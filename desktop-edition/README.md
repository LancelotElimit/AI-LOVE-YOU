# AI Love You · 独立桌面试作版

独立的 Electron 游戏窗口，桌面 UI 放在 `desktop.css`。原项目文件保持原样。采用当前剧情与素材快照，标题采用图书馆主视觉、竖向菜单，剧情使用全画面场景和深蓝金色对话框，系统菜单同步重设计。

## 直接运行

打开 `dist/AI-Love-You-win32-x64/AI-Love-You.exe`。分发时需复制整个 `AI-Love-You-win32-x64` 文件夹，不能只复制 exe。无需安装 Node.js 或启动服务器。

F11 / Alt+Enter 切换全屏，Esc 退出全屏。窗口可缩放，最小 960×600。剧情底部常驻快捷菜单，鼠标移至顶部显示系统导航。保留原版存档导入导出功能。

## 开发与重新打包

```powershell
npm.cmd ci
npm.cmd start
npm.cmd run package
```

准备步骤将上级项目的当前剧情及素材复制进 `game/`，再载入桌面专用样式；`game/` 是生成目录，请勿手工编辑。`dist/` 为可重新生成的运行包。更换素材后重新运行准备或打包命令即可。

桌面存档独立保存在 `%APPDATA%/AI-Love-You-Desktop`，不会自动读取浏览器存档；可在原版导出，再在桌面版读档界面导入。未迁移到其他游戏引擎，当前版本仍使用 HTML/CSS 渲染，以复用现有剧情系统。
