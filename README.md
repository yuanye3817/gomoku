# 五子棋 (Gomoku)

一个基于原生 JavaScript 开发的经典五子棋游戏，支持双人对战，具有精美的 UI 设计和完整的游戏逻辑。

![五子棋游戏截图](https://via.placeholder.com/600x400?text=Gomoku+Game)

## 功能特性

- **经典玩法**：支持双人对战，黑棋先手，轮流落子
- **智能判定**：自动检测五子连珠获胜和平局情况
- **精美界面**：渐变背景、木质棋盘、立体棋子效果
- **游戏提示**：实时显示当前玩家，最后落子位置红色标记
- **一键重开**：支持随时重新开始新游戏
- **响应式设计**：适配不同屏幕尺寸

## 技术栈

- **HTML5 Canvas** - 游戏棋盘绘制
- **ES6+ JavaScript** - 游戏逻辑实现
- **CSS3** - 界面样式和动画效果

## 使用方法

### 在线体验

直接打开 `index.html` 文件即可开始游戏：

```bash
# 克隆项目
git clone https://github.com/yuanye3817/gomoku.git

# 进入项目目录
cd gomoku

# 用浏览器打开
open index.html
```

### 游戏规则

1. **开局**：黑棋先手，双方轮流在棋盘交叉点落子
2. **获胜**：先在横、竖、斜任意方向上连成五子者获胜
3. **平局**：棋盘填满且无人获胜时判定为平局
4. **提示**：最后落子位置会用红色方框标记

## 项目结构

```
gomoku/
├── index.html    # 主页面，包含游戏界面和样式
├── game.js       # 游戏核心逻辑（ES 模块）
├── style.css     # 样式文件（内联在 HTML 中）
└── README.md     # 项目说明
```

## 代码特点

- 使用 **ES6 类**封装游戏逻辑，结构清晰
- 采用 **Canvas API** 实现高性能绘制
- 支持 **ES 模块**导入导出，便于扩展
- 代码注释完善，易于理解和维护

## 本地开发

```bash
# 启动本地服务器（推荐使用 VS Code Live Server 或 Python 简易服务器）
python -m http.server 8080

# 访问 http://localhost:8080
```

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License © 2024
