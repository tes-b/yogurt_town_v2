class BackgroundImg {
    constructor(img, frameWidth, frameHeight, scale=1, depthZ=1) {
        this.img = new Image();
        this.img.src = img;


        this.x = 0;
        this.y = 0;
        this.tileSize = tileSize;
        this.scale = objectScale * 0.5;
        this.frameWidth = frameWidth * tileSize;
        this.frameHeight = frameHeight * tileSize;
        this.depthZ = depthZ;
        this.hitbox = false;
    }

    draw() {

        for(var index=Math.floor((cam.x * this.depthZ)/(this.frameWidth * this.scale)); 
            index<Math.ceil(cam.width/(this.frameWidth * this.scale))+Math.floor((cam.x * this.depthZ)/(this.frameWidth * this.scale))+1; 
            index++) {
            if (this.img.complete) {
                ctx.drawImage(
                    this.img,
                    0,
                    0,
                    this.frameWidth,
                    this.frameHeight,
                    this.x + (this.frameWidth * this.scale * index) - (cam.x * this.depthZ),
                    this.y - cam.y,
                    this.frameWidth * this.scale,
                    this.frameHeight * this.scale,
                );
            }
        }
        if (this.hitbox) {
            this.drawRect();
        }
    }

    drawRect() {
        ctx.strokeRect(
            this.x - cam.x,
            this.y - cam.y,
            this.frameWidth * this.scale,
            this.frameHeight * this.scale,
        );
    }
}

class Background {
    constructor() {
     
        this.scale = 6 * cam.height * 0.001;

        this.imgBackgroundNight1 = new BackgroundImg(imgBackgroundNight1, 36, 20, this.scale, 0.05);
        this.imgBackgroundNight2 = new BackgroundImg(imgBackgroundNight2, 36, 20, this.scale, 0.1);
        this.imgBackgroundNight3 = new BackgroundImg(imgBackgroundNight3, 36, 20, this.scale, 0.2);
        this.imgBackgroundNight4 = new BackgroundImg(imgBackgroundNight4, 36, 20, this.scale, 0.3);
        this.imgBackgroundNight5 = new BackgroundImg(imgBackgroundNight5, 36, 20, this.scale, 0.5);

        
        this.frameCount = 0;
        this.currentFrameX = 0;
        this.frameRate = 30;
        this.switchBg = true;   
        this.imgFrameCount = 0;

        this.hitbox = false;
    }   

    draw() {  
        this.imgBackgroundNight1.draw();    
        this.imgBackgroundNight2.draw();
        this.imgBackgroundNight3.draw();
        this.imgBackgroundNight4.draw();
        this.imgBackgroundNight5.draw();
    }

}