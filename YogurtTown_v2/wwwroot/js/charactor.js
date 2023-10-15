class Charactor {
    constructor(tileX = 0, tileY = 0) {
        this.section = currentSection.section;

        this.scale = objectScale;

        this.tileSize = 16;

        this.tileX = tileX;
        this.tileY = tileY;

        this.x = tileX * this.tileSize * this.scale;
        this.y = tileY * this.tileSize * this.scale;

        this.gotoX = listBoard[this.section].tileX;
        this.gotoOffsetX = this.tileSize;

        this.widthHalf = 25;
        this.heightHalf = 25;
        this.jumpPower = 4;
        this.isJumping = false;
        this.jumpDuration = 2000;
        this.jumpTimer = 0;

        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isMovingUp = false;
        this.isMovingDown = false;

        this.MOVE_SPD_WALK = 0.8;
        this.moveSpeed = this.MOVE_SPD_WALK;
        this.acceleration = 0.001;

        this.isLeft = false;

        this.STATE_IDLE = "idle";
        this.STATE_WALK = "walk";
        this.STATE_RUN = "run";
        this.state = "idle";
        

        this.isKeyMoving = false;

        this.imgDict = {};


        this.imgIdle = new Image();
        this.imgIdle.src = imgCharactorIdle;
        this.imgRun = new Image();
        this.imgRun.src = imgCharactorRun;
        this.imgWalk = new Image();
        this.imgWalk.src = imgCharactorWalk;

        this.imgDict[this.STATE_IDLE] = { "obj": this.imgIdle, "frameX": 4, "frameY": 2, "frameWidth": 16, "frameHeight": 16, "frameRate": 50 };
        this.imgDict[this.STATE_RUN] = { "obj": this.imgRun, "frameX": 8, "frameY": 1, "frameWidth": 16, "frameHeight": 16, "frameRate": 5 };
        this.imgDict[this.STATE_WALK] = { "obj": this.imgWalk, "frameX": 6, "frameY": 1, "frameWidth": 16, "frameHeight": 16, "frameRate": 10 };

        this.imgCurrent = this.imgDict[this.state];

        this.imgFrameWidth = 32;
        this.imgFrameHeight = 32;

        this.frameSizeX = 2;
        this.frameSizeY = 2;

        this.currentFrameX = 0;
        this.currentFrameY = 0;

        this.frameCount = 0;

    }

    changeState(state) {
        if (this.state == state) { return; }
        this.state = state;
        this.currentFrameX = 0;
        this.currentFrameY = 0;
        this.frameCount = 0;
        this.imgCurrent = this.imgDict[this.state];
    }

    drawHitbox() {
        ctx.strokeRect(
            this.x - cam.x,
            this.y - cam.y,
            this.imgCurrent["frameWidth"] * this.frameSizeX * this.scale,
            this.imgCurrent["frameHeight"] * this.frameSizeY * this.scale,
        );
    }

    drawFrame(frameX, frameY) {
        if (this.imgCurrent["obj"].complete) {
            ctx.drawImage(
                this.imgCurrent["obj"],
                frameX * this.imgCurrent["frameWidth"] * this.frameSizeX,
                frameY * this.imgCurrent["frameHeight"] * this.frameSizeY,
                this.imgCurrent["frameWidth"] * this.frameSizeX,
                this.imgCurrent["frameHeight"] * this.frameSizeY,
                this.x - cam.x,
                this.y - cam.y,
                this.imgCurrent["frameWidth"] * this.frameSizeX * this.scale,
                this.imgCurrent["frameHeight"] * this.frameSizeY * this.scale,
            );
        }
    }

    // drawImage() {
    //     if(this.imgCurrent["obj"].complete){
    //         ctx.drawImage(
    //             this.imgCurrent["obj"], 
    //             0,
    //             0,
    //             this.imgCurrent["frameWidth"],
    //             this.imgCurrent["frameHeight"],
    //             this.x,
    //             this.y, 
    //             this.width * this.scale,
    //             this.height * this.scale, 
    //             );
    //     }
    // }

    animateImage() {

        this.drawFrame(this.currentFrameX, this.isLeft);
        this.frameCount++;
        let frameRate = this.imgCurrent["frameRate"] - this.moveSpeed;
        if (this.frameCount >= frameRate) {
            this.currentFrameX++;
            if (this.currentFrameX >= this.imgCurrent["frameX"]) {
                this.currentFrameX = 0;
            }
            this.frameCount = 0;
        }
    }

    draw(hitbox = false) {
        if (hitbox) {
            this.drawHitbox();
        }
        this.animateImage();
    }

    changeSection(section) {
        this.section = section;
        console.log(`Go To Section : ${this.section}`);

        this.gotoX = listBoard[this.section].tileX * this.tileSize * this.scale;
        if (Math.abs(this.gotoX - this.x) < this.gotoOffsetX ) {
            this.move("stop");
        }
        else if (this.gotoX < this.x) {
            this.move("left");
        }
        else if (this.gotoX > this.x) {
            this.move("right");
        }
    }

    move(dir) {
        // console.log(dir);
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isMovingUp = false;
        this.isMovingDown = false;

        if (dir == "left") {
            this.isLeft = true;
            this.isMovingLeft = true;
            this.changeState(this.STATE_RUN);
        }
        else if (dir == "right") {
            this.isLeft = false;
            this.isMovingRight = true;
            this.changeState(this.STATE_RUN);
        }
        else if (dir == "up") {
            this.isMovingUp = true;
            this.changeState(this.STATE_WALK);
        }
        else if (dir == "down") {
            this.isMovingDown = true;
            this.changeState(this.STATE_WALK);
        }
        else if (dir == "stop") {
            this.isLeft = false;
            this.changeState(this.STATE_IDLE);
        }
    }

    update(elapsedTime) {
        // calc tile
        this.tileX = Math.floor(this.x / (tileSize * this.scale));
        this.tileY = Math.floor(this.y / (tileSize * this.scale));

        // stop
        let distance = Math.abs(this.gotoX - this.x);
        this.moveSpeed = this.MOVE_SPD_WALK + (distance * this.acceleration);
        if (distance < this.gotoOffsetX ) {
            this.move("stop");
        }

        this.moveUpdate(elapsedTime);
    }

    moveUpdate(elapsedTime) {

        // move
        if (this.isMovingLeft) {
            this.x -= this.moveSpeed * elapsedTime;
        }
        else if (this.isMovingRight) {
            this.x += this.moveSpeed * elapsedTime;
        }
        if (this.isMovingUp) {
            this.y -= this.moveSpeed * elapsedTime;
        }
        else if (this.isMovingDown) {
            this.y += this.moveSpeed * elapsedTime;
        }
    }
}