import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { AuditReport } from "./AuditReport.mjs";

export class VerifyAudit {
  git(args) {
    const result = spawnSync("git", args, { encoding: "utf8" });
    if (result.status !== 0) throw new Error(result.stderr);
    return result.stdout.trim();
  }

  run(directory = "doc/history-audit") {
    const audit = JSON.parse(readFileSync(join(directory, "records.json")));
    const rawBytes = readFileSync(join(directory, "raw-records.json"));
    if (AuditReport.digest(rawBytes) !== audit.rawRecordsSha256)
      throw new Error("raw records changed");
    if (
      AuditReport.digest(
        readFileSync(join(directory, "verifier-used.mjs.txt")),
      ) !== audit.runnerSourceSha256
    )
      throw new Error("executed runner source changed");
    const raw = JSON.parse(rawBytes);
    const ancestry = this.git(["rev-list", "--reverse", audit.baseline]).split(
      "\n",
    );
    if (
      JSON.stringify(ancestry) !==
      JSON.stringify(audit.records.map((r) => r.sha))
    )
      throw new Error("historical ancestry incomplete or reordered");
    if (raw.records.length !== audit.records.length)
      throw new Error("record count mismatch");
    for (const [index, record] of audit.records.entries()) {
      const original = raw.records[index];
      const { test, resolvedLock, ...rest } = record;
      const { test: originalTest, ...originalRest } = original;
      if (JSON.stringify(rest) !== JSON.stringify(originalRest))
        throw new Error(`summary changed beyond interpretation: ${record.sha}`);
      if (test !== AuditReport.testVerdict(original))
        throw new Error("invalid test interpretation");
      const bytes = readFileSync(join(directory, record.log));
      AuditReport.validateLog(record, bytes);
      if (
        JSON.stringify(JSON.parse(bytes).commands.map((c) => c.status)) ===
          "[]" &&
        record.install === "pass"
      )
        throw new Error("missing command outputs");
      if (this.git(["rev-parse", `${record.sha}^{tree}`]) !== record.sourceTree)
        throw new Error(`historical source tree changed: ${record.sha}`);
      if (
        this.git(["show", "-s", "--format=%cI", record.sha]) !==
        record.originalCommittedAt
      )
        throw new Error(`historical timestamp changed: ${record.sha}`);
      if (
        resolvedLock &&
        AuditReport.digest(readFileSync(join(directory, resolvedLock))) !==
          record.resolvedLockSha256
      )
        throw new Error("resolved dependency lock changed");
    }
    const last = audit.records.at(-1);
    if (last.build !== "pass" || last.test !== "pass" || last.check !== "pass")
      throw new Error("historical baseline did not pass");
    console.log(
      `Verified ${audit.records.length} historical commits: ancestry, original trees/timestamps, immutable logs, dependency locks and interpreted verdicts.`,
    );
    return audit.records.length;
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  new VerifyAudit().run(process.argv[2]);
}
