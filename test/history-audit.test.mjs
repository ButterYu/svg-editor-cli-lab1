import { test } from "node:test";
import assert from "node:assert/strict";
import { HistoryAudit } from "../scripts/HistoryAudit.mjs";
import { AuditReport } from "../scripts/AuditReport.mjs";

test("audit does not treat a zero-test successful process as test coverage", () => {
  assert.equal(
    HistoryAudit.classify({ status: 0 }, false),
    "no-tests-at-revision",
  );
  assert.equal(
    HistoryAudit.classify({ status: 1 }, false),
    "no-tests-at-revision",
  );
  assert.equal(
    HistoryAudit.classify({ status: null }, false),
    "execution-error",
  );
  assert.equal(HistoryAudit.classify({ status: 0 }), "pass");
  assert.equal(
    AuditReport.testVerdict({ install: "pass", testFiles: [], test: "pass" }),
    "no-tests-at-revision",
  );
  assert.equal(
    AuditReport.testVerdict({
      install: "fail",
      testFiles: [],
      test: "blocked-by-install",
    }),
    "blocked-by-install",
  );
});

test("audit publication detects tampered output and mismatched commit identity", () => {
  const bytes = Buffer.from(JSON.stringify({ sha: "a", sourceTree: "tree" }));
  const record = {
    sha: "a",
    sourceTree: "tree",
    logSha256: AuditReport.digest(bytes),
  };
  assert.doesNotThrow(() => AuditReport.validateLog(record, bytes));
  assert.throws(
    () => AuditReport.validateLog(record, Buffer.from("changed")),
    /hash mismatch/,
  );
  assert.throws(
    () => AuditReport.validateLog({ ...record, sha: "b" }, bytes),
    /identity mismatch/,
  );
});
