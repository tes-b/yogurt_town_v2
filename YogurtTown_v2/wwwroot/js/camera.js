class Camera {
    constructor(canvas) {
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.offsetX = canvas.width * 0.1;
        this.offsetY = canvas.height * 0.6;
        this.speed = 1;
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.isMovingUp = false;
        this.isMovingDown = false;
        this.followObj = null;
    }

    update(elapsedTime) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.follow();

    }

    follow() {
        if (this.followObj) {
            this.x = this.followObj.x - this.offsetX;
            this.y = this.followObj.y - this.offsetY;
        }
    }
}
