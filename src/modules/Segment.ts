class Segment {

    constructor(a, b) {
        if (a.i > b.i) {
            this.a = b;
            this.b = a;
        } else {
            this.a = a;
            this.b = b;
        }
    }
}

export {Segment};