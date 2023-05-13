import { AcGameObject } from "@/assets/scripts/AcGameObject";
import { Wall } from "@/assets/scripts/Wall";
import { Snake } from "@/assets/scripts/Snake";

export class GameMap extends AcGameObject {
    /**
     * 构造GameMap
     * @param ctx     canvas 2d渲染上下文(CanvasRenderingContext2D)
     * @param parent  canvas父元素容器
     */
    constructor(ctx, parent) {
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;            //格子宽高

        this.rows = 13;
        this.cols = 14;        //避免同一时间两条蛇头出现在同一位置

        this.inner_walls_count = 20;
        this.walls = [];

        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows -2, c: 1}, this),
            new Snake({id: 1, color: "#F94848", r: 1, c: this.cols - 2}, this)
        ];
    }

    /**
     * 两点是否连通
     * @param g    地图网格
     * @param sx   起点X
     * @param sy   起点Y
     * @param tx   终点X
     * @param ty   终点Y
     * @returns {boolean} true - 连通   false - 不连通
     */
    check_connectivity(g, sx, sy, tx, ty) {
        if(sx === tx && sy === ty) return true;
        g[sx][sy] = true;

        const dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for(let i = 0; i < 4; ++i) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
                return true;
        }
        return false;
    }

    create_walls() {
        const grid = [];
        for(let r = 0; r < this.rows; ++r) {
            grid[r] = [];
            for(let c = 0; c < this.cols; ++c) {
                grid[r][c] = false;
            }
        }

        //创建地图四周加障碍物
        for(let r = 0; r < this.rows; ++r) {
            grid[r][0] = grid[r][this.cols - 1] = true;
        }
        for(let c = 1; c < this.cols; ++c) {
            grid[0][c] = grid[this.rows - 1][c] = true;
        }

        //创建内部随机障碍物
        for (let i = 0; i < this.inner_walls_count / 2; ++i) {
            for(let j = 0; j < 1000; ++j) {
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                if (grid[r][c] || grid[this.rows - 1 - r][this.cols - 1 - c]) continue;
                if (r === this.rows - 2 && c === 1 || r === 1 && c === this.cols - 2) continue;  //左右上角出生点强制无障碍物
                grid[r][c] = [this.rows - 1 - r][this.cols - 1 - c] = true;
                break;
            }
        }

        //检测地图两侧是否连通
        const copy_grid = JSON.parse(JSON.stringify(grid));
        if(!this.check_connectivity(copy_grid, this.rows - 2, 1, 1, this.cols - 2)) return false;

        //解析障碍物到对象集
        for(let r = 0; r < this.rows; ++r) {
            for(let c = 0; c < this.cols; ++c) {
                if(grid[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
        return true;
    }

    add_listening_events() {
        this.ctx.canvas.focus();

        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            if (e.key === 'w') snake0.set_direction(0);
            else if (e.key === 'd') snake0.set_direction(1);
            else if (e.key === 's') snake0.set_direction(2);
            else if (e.key === 'a') snake0.set_direction(3);
            else if (e.key === 'ArrowUp') snake1.set_direction(0);
            else if (e.key === 'ArrowRight') snake1.set_direction(1);
            else if (e.key === 'ArrowDown') snake1.set_direction(2);
            else if (e.key === 'ArrowLeft') snake1.set_direction(3);
        })
    }

    start() {
        for (let i = 0; i < 1000; ++i){
            if(this.create_walls()) break;
        }
        this.add_listening_events();
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() {     // 判断两条蛇是否都准备好下一回合了
        for(const snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    next_step() {       // 将两条蛇进入下一回合
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    check_valid(cell) {     // 检测目标位置是否合法（没有撞到蛇的身体和障碍物）
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c)
                return false;
        }
        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {   // 当蛇尾会前进时，取消判断蛇尾
                --k;
            }
            for (let i = 0; i < k; ++i) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
                    return false;
            }
        }

        return true;
    }

    update() {
        this.update_size();
        if (this.check_ready()) {
            this.next_step();
        }
        this.render();
    }

    render() {
        const color_even = '#AAD751';
        const color_odd = '#A3D049';
        for(let r = 0; r < this.rows; ++r) {
            for(let c = 0; c < this.cols; ++c) {
                if((r + c) % 2 === 0) {
                    this.ctx.fillStyle = color_even;
                }
                else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}