/**
 * 五子棋游戏逻辑模块
 * 使用 ES 模块语法
 */

// 游戏常量配置
const BOARD_SIZE = 15;        // 棋盘格子数（15x15）
const CELL_SIZE = 36;         // 每个格子的大小（像素）
const PADDING = 30;           // 棋盘边距
const CANVAS_SIZE = 600;      // 画布总大小

// 玩家枚举
const PLAYER = {
    NONE: 0,   // 无棋子
    BLACK: 1,  // 黑棋
    WHITE: 2   // 白棋
};

// 游戏状态类
class GomokuGame {
    /**
     * 构造函数 - 初始化游戏
     * @param {HTMLCanvasElement} canvas - 游戏画布元素
     */
    constructor(canvas) {
        this.canvas = canvas;
        // 使用解构从 getContext 获取 2D 上下文
        this.ctx = canvas.getContext('2d');
        this.currentPlayer = PLAYER.BLACK;  // 黑棋先手
        this.gameOver = false;              // 游戏是否结束
        this.lastMove = null;               // 最后落子位置
        this.board = this.createBoard();    // 创建棋盘数据
        this.bindEvents();                  // 绑定事件
        this.draw();                        // 初始绘制
    }

    /**
     * 创建空的棋盘二维数组
     * @returns {number[][]} 15x15 的二维数组，初始值为 0
     */
    createBoard() {
        // 使用 Array.from 创建二维数组
        return Array.from({ length: BOARD_SIZE }, () =>
            Array.from({ length: BOARD_SIZE }, () => PLAYER.NONE)
        );
    }

    /**
     * 绑定点击事件
     */
    bindEvents() {
        // 使用箭头函数保持 this 上下文
        this.canvas.addEventListener('click', (event) => this.handleClick(event));
    }

    /**
     * 处理棋盘点击事件
     * @param {MouseEvent} event - 鼠标点击事件
     */
    handleClick(event) {
        // 游戏已结束则不处理
        if (this.gameOver) return;

        // 获取 Canvas 的实际显示尺寸和位置，处理缩放情况
        const rect = this.canvas.getBoundingClientRect();

        // 计算点击位置在 Canvas 内部的坐标（考虑 CSS 缩放）
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        // 计算点击位置对应的棋盘坐标
        const col = Math.round((x - PADDING) / CELL_SIZE);
        const row = Math.round((y - PADDING) / CELL_SIZE);

        // 检查坐标是否有效
        if (!this.isValidPosition(row, col)) return;

        // 检查该位置是否已有棋子
        if (this.board[row][col] !== PLAYER.NONE) return;

        // 记录最后落子位置
        this.lastMove = { row, col };

        // 放置棋子
        this.placePiece(row, col);

        // 检查是否获胜
        if (this.checkWin(row, col)) {
            this.handleWin();
            return;
        }

        // 检查是否平局（棋盘满了）
        if (this.isBoardFull()) {
            this.handleDraw();
            return;
        }

        // 切换玩家
        this.switchPlayer();
    }

    /**
     * 检查坐标是否在有效范围内
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @returns {boolean} 是否有效
     */
    isValidPosition(row, col) {
        return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
    }

    /**
     * 在指定位置放置棋子
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     */
    placePiece(row, col) {
        this.board[row][col] = this.currentPlayer;
        this.draw();
    }

    /**
     * 切换当前玩家
     */
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === PLAYER.BLACK
            ? PLAYER.WHITE
            : PLAYER.BLACK;
        this.updatePlayerIndicator();
    }

    /**
     * 更新玩家指示器 UI
     */
    updatePlayerIndicator() {
        const indicator = document.getElementById('player-indicator');
        const { currentPlayer } = this;

        if (currentPlayer === PLAYER.BLACK) {
            indicator.textContent = '黑棋';
            indicator.className = 'black';
        } else {
            indicator.textContent = '白棋';
            indicator.className = 'white';
        }
    }

    /**
     * 检查是否五子连珠获胜
     * @param {number} row - 最后落子的行
     * @param {number} col - 最后落子的列
     * @returns {boolean} 是否获胜
     */
    checkWin(row, col) {
        const { currentPlayer, board } = this;

        // 四个方向：水平、垂直、左上-右下、右上-左下
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 左上到右下
            [1, -1]   // 右上到左下
        ];

        // 检查每个方向
        for (const [dr, dc] of directions) {
            let count = 1;  // 当前棋子算 1 个

            // 向正方向检查
            count += this.countDirection(board, row, col, dr, dc, currentPlayer);
            // 向反方向检查
            count += this.countDirection(board, row, col, -dr, -dc, currentPlayer);

            // 五子连珠则获胜
            if (count >= 5) return true;
        }

        return false;
    }

    /**
     * 统计某个方向上连续同色棋子的数量
     * @param {number[][]} board - 棋盘数据
     * @param {number} row - 起始行
     * @param {number} col - 起始列
     * @param {number} dr - 行方向增量
     * @param {number} dc - 列方向增量
     * @param {number} player - 玩家类型
     * @returns {number} 连续棋子数
     */
    countDirection(board, row, col, dr, dc, player) {
        let count = 0;
        let r = row + dr;
        let c = col + dc;

        // 持续检查直到越界或遇到不同颜色
        while (this.isValidPosition(r, c) && board[r][c] === player) {
            count++;
            r += dr;
            c += dc;
        }

        return count;
    }

    /**
     * 检查棋盘是否已满（平局）
     * @returns {boolean} 是否平局
     */
    isBoardFull() {
        // 使用 some 检查是否还有空位
        return !this.board.some(row => row.some(cell => cell === PLAYER.NONE));
    }

    /**
     * 处理获胜
     */
    handleWin() {
        this.gameOver = true;
        const winner = this.currentPlayer === PLAYER.BLACK ? '黑棋' : '白棋';
        this.showResult(`${winner} 获胜！`, this.currentPlayer === PLAYER.BLACK ? 'win-black' : 'win-white');
    }

    /**
     * 处理平局
     */
    handleDraw() {
        this.gameOver = true;
        this.showResult('平局！', 'win-white');
    }

    /**
     * 显示游戏结果
     * @param {string} message - 显示消息
     * @param {string} className - CSS 类名
     */
    showResult(message, className) {
        const resultDiv = document.getElementById('game-result');
        const winnerText = document.getElementById('winner-text');

        winnerText.textContent = message;
        resultDiv.className = `result ${className}`;
    }

    /**
     * 重新开始游戏
     */
    restart() {
        // 重置游戏状态
        this.currentPlayer = PLAYER.BLACK;
        this.gameOver = false;
        this.lastMove = null;
        this.board = this.createBoard();

        // 隐藏结果提示
        const resultDiv = document.getElementById('game-result');
        resultDiv.className = 'result hidden';

        // 更新 UI
        this.updatePlayerIndicator();
        this.draw();
    }

    /**
     * 绘制棋盘和棋子
     */
    draw() {
        const { ctx } = this;

        // 清空画布
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // 绘制棋盘背景
        ctx.fillStyle = '#deb887';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // 绘制网格线
        this.drawGrid();

        // 绘制棋子
        this.drawPieces();

        // 绘制星位标记（天元及四角星）
        this.drawStarPoints();

        // 绘制最后落子标记
        this.drawLastMoveMarker();
    }

    /**
     * 绘制网格线
     */
    drawGrid() {
        const { ctx } = this;

        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        ctx.beginPath();

        // 绘制横线和竖线
        for (let i = 0; i < BOARD_SIZE; i++) {
            const pos = PADDING + i * CELL_SIZE;

            // 横线
            ctx.moveTo(PADDING, pos);
            ctx.lineTo(PADDING + (BOARD_SIZE - 1) * CELL_SIZE, pos);

            // 竖线
            ctx.moveTo(pos, PADDING);
            ctx.lineTo(pos, PADDING + (BOARD_SIZE - 1) * CELL_SIZE);
        }

        ctx.stroke();
    }

    /**
     * 绘制所有棋子
     */
    drawPieces() {
        const { ctx, board } = this;

        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const player = board[row][col];
                if (player !== PLAYER.NONE) {
                    this.drawPiece(ctx, row, col, player);
                }
            }
        }
    }

    /**
     * 绘制单个棋子
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @param {number} player - 玩家类型（黑棋/白棋）
     */
    drawPiece(ctx, row, col, player) {
        const x = PADDING + col * CELL_SIZE;
        const y = PADDING + row * CELL_SIZE;
        const radius = CELL_SIZE * 0.4;

        // 创建径向渐变使棋子有立体感
        const gradient = ctx.createRadialGradient(
            x - radius / 3, y - radius / 3, radius / 10,
            x, y, radius
        );

        if (player === PLAYER.BLACK) {
            // 黑棋渐变
            gradient.addColorStop(0, '#555');
            gradient.addColorStop(1, '#000');
        } else {
            // 白棋渐变
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#ccc');
        }

        // 绘制棋子圆形
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 添加边框
        ctx.strokeStyle = player === PLAYER.BLACK ? '#000' : '#999';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    /**
     * 绘制星位标记（天元及四角星位）
     */
    drawStarPoints() {
        const { ctx } = this;
        const starPositions = [
            [3, 3], [3, 7], [3, 11],   // 上排星位
            [7, 3], [7, 7], [7, 11],   // 中排星位（含天元）
            [11, 3], [11, 7], [11, 11] // 下排星位
        ];

        ctx.fillStyle = '#654321';

        // 使用 for...of 遍历星位
        for (const [row, col] of starPositions) {
            const x = PADDING + col * CELL_SIZE;
            const y = PADDING + row * CELL_SIZE;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /**
     * 绘制最后落子位置的标记（红色方框）
     */
    drawLastMoveMarker() {
        if (!this.lastMove) return;

        const { ctx } = this;
        const { row, col } = this.lastMove;
        const x = PADDING + col * CELL_SIZE;
        const y = PADDING + row * CELL_SIZE;
        const size = CELL_SIZE * 0.5;

        // 绘制红色方框标记最后落子位置
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);
    }
}

// 导出游戏类（供其他模块使用）
export { GomokuGame, PLAYER };

// 页面加载完成后初始化游戏
const initGame = () => {
    const canvas = document.getElementById('game-board');

    // 检查画布是否存在
    if (!canvas) {
        console.error('找不到游戏画布元素');
        return;
    }

    // 创建游戏实例
    const game = new GomokuGame(canvas);

    // 绑定重新开始按钮
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => game.restart());
    }
};

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', initGame);
