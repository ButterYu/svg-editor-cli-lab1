# Ubuntu / Node 22 的独立历史回放

这也是本次补做的回溯验证，不是历史开发时的 CI。工作流源码位于提交 ea7bbbe，审查截止 SHA 仍是原 final 6de1781a1929e58cf455e679970c5d970da40c5d。

- [实际运行 #1](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40290496940)：成功完成回放、报告生成和 artifact 上传。
- [逐版本输出所在 job](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40290496940/job/121464155528)：可展开 Replay exact historical trees 步骤查看。
- 环境日志：Node v22.23.3、npm 10.9.9、ubuntu-latest；每个版本导出原 Git 树，按自身脚本执行。
- 原版本回放输出时间：2026-10-26 08:11—08:16 UTC，即北京时间 16:11—16:16。
- artifact：retrospective-history-audit-40290496940，ID 12635917943，页面显示约 68.4 KB。
- 上传 artifact 的 SHA-256：16d13a1c1eaffb4457248e198c62c572a1ed7791a91d3cff8386ab8a69b9e3e3。
- artifact 受 GitHub 保留期限限制；仓库永久保留的是另一份 Windows 回放的原始日志、依赖锁和哈希，见 [history-audit](history-audit/README.md)。此表从实际远程 job 日志提取，没有把 Windows 日志改标为 Linux。

工作流成功代表记录生成完成，**不代表每个旧版本都测试通过**。26 个版本的主要判定与 Windows 解释后结果一致：构建 22 通过/3 失败/1 不适用；测试 14 通过/1 失败/10 无测试/1 不适用。早期 tsx 启动细节可能因平台不同，不能把平台细节强行等同。

| #   | 原提交  | 构建           | 测试                 | 格式           | 综合检查       |
| --- | ------- | -------------- | -------------------- | -------------- | -------------- |
| 1   | a0071d0 | not-applicable | not-applicable       | not-applicable | not-applicable |
| 2   | d36c248 | fail           | no-tests-at-revision | fail           | fail           |
| 3   | 0653131 | pass           | no-tests-at-revision | fail           | fail           |
| 4   | 0a6b481 | pass           | no-tests-at-revision | fail           | fail           |
| 5   | d40209f | pass           | no-tests-at-revision | fail           | fail           |
| 6   | 40e7a0b | pass           | no-tests-at-revision | fail           | fail           |
| 7   | 61fd74b | pass           | no-tests-at-revision | fail           | fail           |
| 8   | f71ba0b | fail           | no-tests-at-revision | fail           | fail           |
| 9   | b91d29d | fail           | no-tests-at-revision | fail           | fail           |
| 10  | 12f4131 | pass           | no-tests-at-revision | fail           | fail           |
| 11  | 2101a4d | pass           | no-tests-at-revision | fail           | fail           |
| 12  | b83b55c | pass           | pass                 | fail           | fail           |
| 13  | b6c78f8 | pass           | pass                 | fail           | fail           |
| 14  | b736977 | pass           | pass                 | fail           | fail           |
| 15  | 027f28a | pass           | fail                 | fail           | fail           |
| 16  | 935c4b9 | pass           | pass                 | fail           | fail           |
| 17  | 6acafff | pass           | pass                 | fail           | fail           |
| 18  | aa20109 | pass           | pass                 | fail           | fail           |
| 19  | d56e3df | pass           | pass                 | fail           | fail           |
| 20  | 56d6c6d | pass           | pass                 | fail           | fail           |
| 21  | 22c35cb | pass           | pass                 | fail           | fail           |
| 22  | 8c93dd2 | pass           | pass                 | fail           | fail           |
| 23  | 7298cdc | pass           | pass                 | fail           | fail           |
| 24  | 1052a19 | pass           | pass                 | pass           | pass           |
| 25  | 1056d7c | pass           | pass                 | pass           | pass           |
| 26  | 6de1781 | pass           | pass                 | pass           | pass           |

安装方法仍有原报告列明的限制：没有 npm 锁时使用新的 npm install，未强制使用 pnpm 锁；禁用安装生命周期脚本。真实解析的依赖锁在各自报告中保存。因此验证对象是历史源码在记录环境下的行为，不是对历史机器状态的完美复原。
