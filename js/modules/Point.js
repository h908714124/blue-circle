class Point {

    constructor(i, x, y) {
        this.i = i;
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 20;
        this.active = false;
    }

    centerX() {
        return this.x + this.w / 2;
    }

    centerY() {
        return this.y + this.h / 2;
    }
}

export {Point};