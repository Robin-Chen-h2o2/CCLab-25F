class Rain {
    constructor(x, y) {
        this.x = x + random(-30, 30);
        this.y = y;
    }
    display() {
        strokeWeight(5);
        line(this.x, this.y, this.x, this.y + 5);
    }
    update() {
        this.y += 10;
    }
    isOutCanvas() {
        if (this.y > height + 5) {
            return true;
        } else {
            return false;
        }
    }
}
