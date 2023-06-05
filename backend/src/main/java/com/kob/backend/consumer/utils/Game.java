package com.kob.backend.consumer.utils;

import java.util.Random;

public class Game {
    private final Integer rows;
    private final Integer cols;
    private final Integer inner_walls_count;
    private final int[][] grid;
    private final static int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};

    public Game(Integer rows, Integer cols, Integer inner_walls_count) {
        this.rows = rows;
        this.cols = cols;
        this.inner_walls_count = inner_walls_count;
        this.grid = new int[rows][cols];
    }

    public int[][] getGrid() {
        return grid;
    }

    private boolean check_connectivity(int sx, int sy, int tx, int ty) {
        if(sx == tx && sy == ty) return true;
        grid[sx][sy] = 1;

        for(int i = 0; i < 4; ++i) {
            int x = sx + dx[i], y = sy + dy[i];
            if (x >= 0 && x < this.rows && y >= 0 && y < this.cols && grid[x][y] == 0) {
                if (this.check_connectivity(x, y, tx, ty)) {
                    grid[sx][sy] = 0;
                    return true;
                }
            }
        }
        grid[sx][sy] = 0;
        return false;
    }

    private boolean draw() {    // 画地图
        for (int i = 0; i < rows; ++i) {
            for (int j = 0; j < cols; ++j) {
                grid[i][j] = 0;
            }
        }

        //创建地图四周加障碍物
        for(int r = 0; r < this.rows; ++r) {
            grid[r][0] = grid[r][this.cols - 1] = 1;
        }
        for(int c = 1; c < this.cols; ++c) {
            grid[0][c] = grid[this.rows - 1][c] = 1;
        }

        //创建内部随机障碍物
        Random random = new Random();
        for (int i = 0; i < this.inner_walls_count / 2; ++i) {
            for(int j = 0; j < 1000; ++j) {
                int r = random.nextInt(this.rows);
                int c = random.nextInt(this.cols);
                if (grid[r][c] == 1 || grid[this.rows - 1 - r][this.cols - 1 - c] == 1) continue;
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2) continue;  //左右上角出生点强制无障碍物
                grid[r][c] = grid[this.rows - 1 - r][this.cols - 1 - c] = 1;
                break;
            }
        }

        return check_connectivity(this.rows - 2, 1, 1, this.cols - 2);
    }

    public void createMap() {
        for (int i = 0; i < 100; ++i) {
            if (draw())
                break;
        }
    }
}
