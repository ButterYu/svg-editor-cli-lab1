import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Publishes immutable logs and a separately interpreted summary. */
export class AuditReport {
  static digest(bytes) {
    return createHash("sha256").update(bytes).digest("hex");
  }

  static testVerdict(record) {
    if (
      record.install === "pass" &&
      record.testFiles.length === 0 &&
      record.test !== "script-absent"
    ) {
      return "no-tests-at-revision";
    }
    return record.test;
  }

  static validateLog(record, bytes) {
    if (AuditReport.digest(bytes) !== record.logSha256)
      throw new Error(`log hash mismatch: ${record.sha}`);
    const log = JSON.parse(bytes);
    if (log.sha !== record.sha || log.sourceTree !== record.sourceTree)
      throw new Error("log identity mismatch");
  }

  publish(input, output) {
    const raw = readFileSync(join(input, "records.json"));
    const audit = JSON.parse(raw);
    if (audit.records.at(-1)?.sha !== audit.baseline)
      throw new Error("incomplete audit");
    if (existsSync(output)) throw new Error("output must be a new directory");
    mkdirSync(join(output, "logs"), { recursive: true });
    mkdirSync(join(output, "locks"));
    copyFileSync(join(input, "records.json"), join(output, "raw-records.json"));
    const source = readFileSync(join(input, "verifier-used.mjs.txt"));
    writeFileSync(join(output, "verifier-used.mjs.txt"), source);
    const records = audit.records.map((record) => {
      const bytes = readFileSync(join(input, record.log));
      AuditReport.validateLog(record, bytes);
      writeFileSync(join(output, record.log), bytes);
      let resolvedLock;
      if (record.resolvedLockSha256) {
        const original = record.log.replace(/\.json$/, ".resolved-lock.json");
        const lock = readFileSync(join(input, original));
        if (AuditReport.digest(lock) !== record.resolvedLockSha256)
          throw new Error(`lock hash mismatch: ${record.sha}`);
        resolvedLock = `locks/${record.resolvedLockSha256}.json`;
        writeFileSync(join(output, resolvedLock), lock);
      }
      return { ...record, test: AuditReport.testVerdict(record), resolvedLock };
    });
    const interpreted = {
      ...audit,
      interpretationCreatedAt: new Date().toISOString(),
      runnerSourceSha256: AuditReport.digest(source),
      rawRecordsSha256: AuditReport.digest(raw),
      interpretation:
        "No test files means no-tests-at-revision even when Node exits 0. Original raw-records.json and logs are retained byte-for-byte; identical resolved locks are deduplicated by SHA-256.",
      records,
    };
    writeFileSync(
      join(output, "records.json"),
      JSON.stringify(interpreted, null, 2) + "\n",
    );
    const counts = (phase) =>
      Object.entries(
        records.reduce((acc, r) => {
          acc[r[phase]] = (acc[r[phase]] ?? 0) + 1;
          return acc;
        }, {}),
      )
        .map(([key, count]) => `${key}: ${count}`)
        .join("；");
    const rows = records
      .map(
        (r) =>
          `| ${r.ordinal} | [${r.sha.slice(0, 7)}](https://github.com/ButterYu/svg-editor-cli-lab1/commit/${r.sha}) | ${r.build} | ${r.test} | ${r.format} | ${r.check} | [日志](${r.log}) |`,
      )
      .join("\n");
    writeFileSync(
      join(output, "README.md"),
      `# 历史提交回溯验证\n\n这是 **${audit.startedAt} 至 ${audit.finishedAt}（UTC）补做**的验证，不是开发当时的 CI。原有 ${records.length} 个提交与时间戳均未修改。基线：\`${audit.baseline}\`。\n\n## 方法与边界\n\n- 从公开远程仓库克隆后，对每个精确 SHA 用 git archive 导出原树到独立目录；未补源码、未复制后来的测试、未改旧 package.json。\n- 平台：${audit.environment.platform}/${audit.environment.arch}，Node ${audit.environment.node}，npm ${audit.environment.npm}。历史脚本按原样执行，超时上限每条命令 120 秒。\n- 有 package-lock.json 时执行 npm ci；没有时执行 npm install。后者 **未强制使用 pnpm-lock.yaml**，属于该环境下的补充回放，不能称作历史依赖完全复现。实际解析出的锁文件按哈希保留。\n- 安装时禁用生命周期脚本；构建、测试、格式检查和总检查分别执行并保留退出码、起止时间、stdout/stderr。旧 tsx 的本机账户查询错误不等于跨平台源码缺陷。\n- 机器绝对路径经过占位符脱敏，错误正文与退出码保留。日志和依赖锁有 SHA-256。\n- 第一版核验器把“无测试文件但 Node 退出 0”记为 pass；本摘要根据 testFiles 修正为 no-tests-at-revision。原始 records 与日志没有覆写；执行时的核验器源码保存在 verifier-used.mjs.txt，当前工具已修正并加测试。\n\n## 状态含义\n\npass：该命令成功（测试还需实际存在测试文件）；fail：该命令返回非零；no-tests-at-revision：该版本没有测试文件；not-applicable：没有 package.json；blocked-by-install：安装失败未执行；execution-error：超时或无法启动。format/check 失败不自动等于功能测试失败。\n\n## 汇总\n\n- 构建：${counts("build")}。\n- 测试：${counts("test")}。\n- 格式：${counts("format")}。\n- 综合检查：${counts("check")}。\n\n| # | 原提交 | 构建 | 测试 | 格式 | 综合检查 | 证据 |\n| --- | --- | --- | --- | --- | --- | --- |\n${rows}\n\n## 可复核文件\n\nrecords.json 是解释后的索引；raw-records.json 是原始核验器索引；logs/ 保存逐提交输出；locks/ 保存按 SHA-256 去重的实际依赖锁。记录中的 originalCommittedAt 是历史时间，startedAt/finishedAt 才是本次执行时间。\n\n## 重新执行\n\n在安装 Node/npm、Git、tar 的环境中：\n\n\x60\x60\x60sh\nnpm run audit:history -- --repo . --until ${audit.baseline} --out ../fresh-audit\n\x60\x60\x60\n\n新的环境、依赖解析和时间戳可能产生不同结果，不应要求日志逐字一致。不要把重跑结果写回旧提交。\n`,
    );
    return interpreted;
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (process.argv.length !== 4)
    throw new Error("usage: node scripts/AuditReport.mjs <input> <new-output>");
  new AuditReport().publish(resolve(process.argv[2]), resolve(process.argv[3]));
}
