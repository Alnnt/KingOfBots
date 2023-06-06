import { AcGameObject } from "@/assets/scripts/AcGameObject";
import { Wall } from "@/assets/scripts/Wall";
import { Snake } from "@/assets/scripts/Snake";

export class GameMap extends AcGameObject {
    /**
     * 构造GameMap
     * @param ctx     canvas 2d渲染上下文(CanvasRenderingContext2D)
     * @param parent  canvas父元素容器
     * @param store   包含gamemap属性的store(vuex)对象
     */
    constructor(ctx, parent, store) {
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
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

    create_walls() {
        const grid = this.store.state.pk.gamemap;

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

        this.ctx.canvas.addEventListener("keydown", e => {
            let d = -1;
            if (e.key === 'w') d = 0;
            else if (e.key === 'd') d = 1;
            else if (e.key === 's') d = 2;
            else if (e.key === 'a') d = 3;

            if (d >= 0) {
                this.store.state.pk.socket.send(JSON.stringify({
                    event: "move",
                    direction: d
                }));
            }
        });
    }

    start() {
        this.create_walls();
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