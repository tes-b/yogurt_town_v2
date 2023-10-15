class Button {
    constructor(imgSrc, callback, tileHor, tileVer, posX = 0, posY = 0) {
        this.imgCommand = new Image();
        this.imgCommand.src = imgSrc;

        this.callback = callback;

        this.scale = objectScale;

        this.tileHor = tileHor;
        this.tileVer = tileVer;

        this.x = posX * tileSize * this.scale;
        this.y = posY * tileSize * this.scale;

        this.STATE_NONE = 0;
        this.STATE_CURSOR_ON = 1;
        this.STATE_PRESS = 2;

        this.state = this.STATE_NONE;

        this.width = tileSize * this.tileHor * this.scale;
        this.height = tileSize * this.tileVer * this.scale;

        this.mouseOverPadding = 10;
    }

    update() {
        if (!this.isMouseOver()) {
            this.up();
        }

        if (this.state != this.STATE_PRESS) {
            if (this.isMouseOver()) {
                this.state = this.STATE_CURSOR_ON;
            }
            else {
                this.state = this.STATE_NONE;
            }
        }
        
    }

    press() {
        if (this.isMouseOver()) {
            this.state = this.STATE_PRESS;
        }
    }

    up() {
        if (this.isMouseOver()) {
            this.callback();
        }
        this.state = this.STATE_NONE;
    }

    isMouseOver() {
        return (
          mouseX >= this.x + this.mouseOverPadding &&
          mouseX <= this.x + this.width - this.mouseOverPadding&&
          mouseY >= this.y - cam.y + this.mouseOverPadding&&
          mouseY <= this.y + this.height - cam.y - this.mouseOverPadding
        );
    }

    draw() {
        if (this.imgCommand.complete) {
            ctx.drawImage(
                this.imgCommand,
                0,
                tileSize * this.tileVer * this.state,
                tileSize * this.tileHor,
                tileSize * this.tileVer,
                this.x,
                this.y - cam.y,
                this.width,
                this.height,
            );
            // ctx.strokeRect(
            //     this.x,
            //     this.y - cam.y,
            //     this.width,
            //     this.height,
            //     );
        }
    }
}