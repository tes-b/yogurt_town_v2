class Board {
    constructor(tileX=0, tileY=0, img, section, url) {
        this.imgObjBoard = new Image();
        this.imgObjBoard.src = img;

        this.section = section;

        this.scale = objectScale;
        
        this.tileX = tileX;
        this.tileY = tileY;

        this.x = this.tileX * tileSize * this.scale;
        this.y = this.tileY * tileSize * this.scale;

        this.tileHor = 8;
        this.tileVer = 6;

        this.width = tileSize * this.tileHor * this.scale;
        this.height = tileSize * this.tileVer * this.scale;

        this.lightOn = false;

        this.url = url;
    }

    setPos(tileX = 0, tileY = 0) {
        this.tileX = tileX;
        this.tileY = tileY;

        this.x = this.tileX * tileSize * this.scale;
        this.y = this.tileY * tileSize * this.scale;
    }

    draw() {
        if(this.imgObjBoard.complete){
            ctx.drawImage(
                this.imgObjBoard,
                tileSize * this.tileHor * this.lightOn,
                0,
                tileSize * this.tileHor,
                tileSize * this.tileVer,
                this.x - cam.x,
                this.y - cam.y, 
                this.width,
                this.height, 
                );
        }
    }
}
