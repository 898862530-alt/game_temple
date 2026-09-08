# Game Temple 发布工作流

GitHub `898862530-alt/game_temple` 为唯一默认编辑源。用户已授权将本轮及后续修改发布到 GitHub Pages，Sites 按需同步。

1. 读取 AGENTS.md，从远端最新 main 开始；保护未提交修改，不覆盖其他人的提交。
2. 根目录 JS / CSS / assets 是源文件，scripts 保存完整构建与验收工具。修改前后保留 47 件馆藏与既有策展规则。
3. 更新 version.json 与 CHANGELOG.md：新增功能提高 minor，修复提高 patch，不兼容修改提高 major。每轮使用新的版本号。
4. 运行 `node scripts/build-release.cjs`，然后依次运行 validate.cjs、verify-navigation.cjs、performance-budget.cjs 与 verify-spatial.mjs。模块和主包均以内容哈希命名。
5. 将本轮提交保存在不可复用的 `release/vX.Y.Z` 分支；快进 main，不强推。若远端变化，先合并并重新验收。
6. 等待该提交的 Pages workflow success，核对公开 version.json 与入口中的哈希。固定公开地址始终是 https://898862530-alt.github.io/game_temple/ 。GitHub 的 HTML 缓存可能有短暂传播时间，页面不会自动刷新已打开的旧会话。
7. 回溯：查看 release/vX.Y.Z 与 CHANGELOG.md。回滚：从最新 main revert 目标修改，以新 patch 版本提交、重新验收并发布；不移动旧版本分支。

旧 Sites 与 GitHub 的 Git 历史彼此独立，不合并或覆盖。Sites 暂停同步是用户的明确选择。

开发期直接编辑 app.js、style.css、assets/spatial/gallery.js；不要手工编辑 assets/releases 或 gallery-<hash>.js。Pages 自动校验完整内容、导航、预算、空间逻辑及构建可重现性后部署。
