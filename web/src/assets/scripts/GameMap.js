import { AcGameObject } from "@/assets/scripts/AcGameObject";
import { Wall } from "@/assets/scripts/Wall";

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
        this.L = 0; //格子宽高

        this.rows = 13;
        this.cols = 13;

        this.inner_walls_count = 20;
        this.walls = [];
    }

    /**
     * 两点是否连通
     * @param g 地图网格
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
                if (grid[r][c] || grid[c][r]) continue;
                if (r === this.rows - 2 && c === 1 || r === 1 && c === this.cols - 2) continue;  //左右上角出生点强制无障碍物
                grid[r][c] = grid[c][r] = true;
                console.log("x")
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

    start() {
        for (let i = 0; i < 1000; ++i){
            if(this.create_walls()) break;
        }
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    update() {
        this.update_size();
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