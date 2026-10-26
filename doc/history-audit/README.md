# 历史提交回溯验证

这是 **2026-10-26T07:59:17.658Z 至 2026-10-26T08:03:20.120Z（UTC）补做**的验证，不是开发当时的 CI。原有 26 个提交与时间戳均未修改。基线：`6de1781a1929e58cf455e679970c5d970da40c5d`。

## 方法与边界

- 从公开远程仓库克隆后，对每个精确 SHA 用 git archive 导出原树到独立目录；未补源码、未复制后来的测试、未改旧 package.json。
- 平台：win32/x64，Node v24.22.1，npm 10.9.2。历史脚本按原样执行，超时上限每条命令 120 秒。
- 有 package-lock.json 时执行 npm ci；没有时执行 npm install。后者 **未强制使用 pnpm-lock.yaml**，属于该环境下的补充回放，不能称作历史依赖完全复现。实际解析出的锁文件按哈希保留。
- 安装时禁用生命周期脚本；构建、测试、格式检查和总检查分别执行并保留退出码、起止时间、stdout/stderr。旧 tsx 的本机账户查询错误不等于跨平台源码缺陷。
- 机器绝对路径经过占位符脱敏，错误正文与退出码保留。日志和依赖锁有 SHA-256。
- 第一版核验器把“无测试文件但 Node 退出 0”记为 pass；本摘要根据 testFiles 修正为 no-tests-at-revision。原始 records 与日志没有覆写；执行时的核验器源码保存在 verifier-used.mjs.txt，当前工具已修正并加测试。

## 状态含义

pass：该命令成功（测试还需实际存在测试文件）；fail：该命令返回非零；no-tests-at-revision：该版本没有测试文件；not-applicable：没有 package.json；blocked-by-install：安装失败未执行；execution-error：超时或无法启动。format/check 失败不自动等于功能测试失败。

## 汇总

- 构建：not-applicable: 1；fail: 3；pass: 22。
- 测试：not-applicable: 1；no-tests-at-revision: 10；pass: 14；fail: 1。
- 格式：not-applicable: 1；fail: 22；pass: 3。
- 综合检查：not-applicable: 1；fail: 22；pass: 3。

| # | 原提交 | 构建 | 测试 | 格式 | 综合检查 | 证据 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [a0071d0](https://github.com/ButterYu/svg-editor-cli-lab1/commit/a0071d0615c0735d5084a0d6405f4208ca2da60d) | not-applicable | not-applicable | not-applicable | not-applicable | [日志](logs/01-a0071d0.json) |
| 2 | [d36c248](https://github.com/ButterYu/svg-editor-cli-lab1/commit/d36c24856fdf43a233de9e677f3a3a2e9594ad10) | fail | no-tests-at-revision | fail | fail | [日志](logs/02-d36c248.json) |
| 3 | [0653131](https://github.com/ButterYu/svg-editor-cli-lab1/commit/065313152c2e91855d48b78e5e7321ee204fd2e4) | pass | no-tests-at-revision | fail | fail | [日志](logs/03-0653131.json) |
| 4 | [0a6b481](https://github.com/ButterYu/svg-editor-cli-lab1/commit/0a6b481ebc6a4feea1f9b455c8a8b6cbdfa0a5cc) | pass | no-tests-at-revision | fail | fail | [日志](logs/04-0a6b481.json) |
| 5 | [d40209f](https://github.com/ButterYu/svg-editor-cli-lab1/commit/d40209fcaf5f45f0bd72cc46e842404dd3eb438c) | pass | no-tests-at-revision | fail | fail | [日志](logs/05-d40209f.json) |
| 6 | [40e7a0b](https://github.com/ButterYu/svg-editor-cli-lab1/commit/40e7a0bea690fefef216174c8f0808b4b7c2c4b7) | pass | no-tests-at-revision | fail | fail | [日志](logs/06-40e7a0b.json) |
| 7 | [61fd74b](https://github.com/ButterYu/svg-editor-cli-lab1/commit/61fd74ba0de16638d4f90f19dea91ce36b9cbfd6) | pass | no-tests-at-revision | fail | fail | [日志](logs/07-61fd74b.json) |
| 8 | [f71ba0b](https://github.com/ButterYu/svg-editor-cli-lab1/commit/f71ba0b833c06cd440a8f22b6d064945fa0ec7b9) | fail | no-tests-at-revision | fail | fail | [日志](logs/08-f71ba0b.json) |
| 9 | [b91d29d](https://github.com/ButterYu/svg-editor-cli-lab1/commit/b91d29d679f1d1298ecaf11c5c83d8b83b3f2d42) | fail | no-tests-at-revision | fail | fail | [日志](logs/09-b91d29d.json) |
| 10 | [12f4131](https://github.com/ButterYu/svg-editor-cli-lab1/commit/12f4131e90a9cdde5c4de7a9bf42fbda9d06892f) | pass | no-tests-at-revision | fail | fail | [日志](logs/10-12f4131.json) |
| 11 | [2101a4d](https://github.com/ButterYu/svg-editor-cli-lab1/commit/2101a4d3ff88fa7298485cfd247e070a8d5713cc) | pass | no-tests-at-revision | fail | fail | [日志](logs/11-2101a4d.json) |
| 12 | [b83b55c](https://github.com/ButterYu/svg-editor-cli-lab1/commit/b83b55cede96a2bf848705fd3e82b1edbd8d64c0) | pass | pass | fail | fail | [日志](logs/12-b83b55c.json) |
| 13 | [b6c78f8](https://github.com/ButterYu/svg-editor-cli-lab1/commit/b6c78f80a5ed7a033b8c7948cadefd25e919cce3) | pass | pass | fail | fail | [日志](logs/13-b6c78f8.json) |
| 14 | [b736977](https://github.com/ButterYu/svg-editor-cli-lab1/commit/b7369776bd9d2b1d8eb69ea33c22c7dc1244ba28) | pass | pass | fail | fail | [日志](logs/14-b736977.json) |
| 15 | [027f28a](https://github.com/ButterYu/svg-editor-cli-lab1/commit/027f28ac63e1692c9d79b83da055c5a8fb8710aa) | pass | fail | fail | fail | [日志](logs/15-027f28a.json) |
| 16 | [935c4b9](https://github.com/ButterYu/svg-editor-cli-lab1/commit/935c4b9e778960a562f29029f6f11447f9fa6b08) | pass | pass | fail | fail | [日志](logs/16-935c4b9.json) |
| 17 | [6acafff](https://github.com/ButterYu/svg-editor-cli-lab1/commit/6acafffd5914bada6c4dec5206125e1634dd759a) | pass | pass | fail | fail | [日志](logs/17-6acafff.json) |
| 18 | [aa20109](https://github.com/ButterYu/svg-editor-cli-lab1/commit/aa20109b9e36c63c0ac280f5a782282a3417b981) | pass | pass | fail | fail | [日志](logs/18-aa20109.json) |
| 19 | [d56e3df](https://github.com/ButterYu/svg-editor-cli-lab1/commit/d56e3dfeb001b207db58d2deb11cc39699961016) | pass | pass | fail | fail | [日志](logs/19-d56e3df.json) |
| 20 | [56d6c6d](https://github.com/ButterYu/svg-editor-cli-lab1/commit/56d6c6dee2bee57728490d4e12eea25666fbaa79) | pass | pass | fail | fail | [日志](logs/20-56d6c6d.json) |
| 21 | [22c35cb](https://github.com/ButterYu/svg-editor-cli-lab1/commit/22c35cb45de6421e13af70ccc89f3e261deb5476) | pass | pass | fail | fail | [日志](logs/21-22c35cb.json) |
| 22 | [8c93dd2](https://github.com/ButterYu/svg-editor-cli-lab1/commit/8c93dd25bc13e0575f0275a4c4b47c58c6538da3) | pass | pass | fail | fail | [日志](logs/22-8c93dd2.json) |
| 23 | [7298cdc](https://github.com/ButterYu/svg-editor-cli-lab1/commit/7298cdc5d3150ef02512d34ae06281438d3881e2) | pass | pass | fail | fail | [日志](logs/23-7298cdc.json) |
| 24 | [1052a19](https://github.com/ButterYu/svg-editor-cli-lab1/commit/1052a1914f8b4c276f93402c0c06d0521c567944) | pass | pass | pass | pass | [日志](logs/24-1052a19.json) |
| 25 | [1056d7c](https://github.com/ButterYu/svg-editor-cli-lab1/commit/1056d7cb5df4e5998adaa2904b7d4e30a38e3e1c) | pass | pass | pass | pass | [日志](logs/25-1056d7c.json) |
| 26 | [6de1781](https://github.com/ButterYu/svg-editor-cli-lab1/commit/6de1781a1929e58cf455e679970c5d970da40c5d) | pass | pass | pass | pass | [日志](logs/26-6de1781.json) |

## 可复核文件

records.json 是解释后的索引；raw-records.json 是原始核验器索引；logs/ 保存逐提交输出；locks/ 保存按 SHA-256 去重的实际依赖锁。记录中的 originalCommittedAt 是历史时间，startedAt/finishedAt 才是本次执行时间。

## 重新执行

在安装 Node/npm、Git、tar 的环境中：

```sh
npm run audit:history -- --repo . --until 6de1781a1929e58cf455e679970c5d970da40c5d --out ../fresh-audit
```

新的环境、依赖解析和时间戳可能产生不同结果，不应要求日志逐字一致。不要把重跑结果写回旧提交。
