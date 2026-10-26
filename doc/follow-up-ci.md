# 本次新增提交的 CI 记录

本表记录补救工作发生时实际运行的 GitHub CI，区别于原 26 个提交的事后回放。下面 10 个小批次均已从 GitHub Actions 页面确认成功；原有提交没有修改。

| 新增提交 | 内容                           | 实际 CI                                                                          |
| -------- | ------------------------------ | -------------------------------------------------------------------------------- |
| d35656e  | 隔离回放与报告工具             | [成功](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40289888785) |
| 6029db9  | 无测试判定与日志完整性测试     | [成功](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40289962037) |
| c1b795a  | 原提交 01—09 的输出            | [成功](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40290154584) |
| bf75022  | 原提交 10—18 的输出            | [成功](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40290162848) |
| 5df3b65  | 原提交 19—26 的输出            | [成功](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40290172123) |
| 0ab331f  | XML 升级前实际依赖解析         | [成功](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40290212486) |
| 5a5de73  | XML 升级后实际依赖解析         | [成功](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40290221745) |
| 2bb09bb  | 简化运行方式后的依赖解析       | [成功](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40290230391) |
| 1774e94  | 原始索引、解释索引、来源及汇总 | [成功](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40290241060) |
| ea7bbbe  | 自动证据校验与手动回放工作流   | [成功](https://github.com/ButterYu/svg-editor-cli-lab1/actions/runs/40290364906) |

本表所在的报告提交及其之后的检查以 [CI 工作流运行列表](https://github.com/ButterYu/svg-editor-cli-lab1/actions/workflows/ci.yml) 为准。报告无法在写入自身提交前引用自己的 SHA 或 CI 结果；最终交付 Release 会记录最终提交与对应成功运行，不预写尚未发生的成功。

`verify:audit` 的通过含义是：证据完整、与原提交一致，且原 final 基线通过；它不会把历史上真实失败的中间版本改判成通过。手动回放工作流的成功含义是回放与报告生成完成，不能解读为所有历史版本测试都通过。
