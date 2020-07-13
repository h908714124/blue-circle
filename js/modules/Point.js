class Point {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 8;
        this.h = 8;
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