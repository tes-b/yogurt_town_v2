class Info {
    constructor() {

    }

    draw() {
        const charactorPosEl = document.getElementById("charactor-pos");
        if (charactorPosEl) {
            charactorPosEl.innerText = `Charactor : ${Math.floor(charactor.x)} , ${Math.floor(charactor.y)}
                                        Cahractor Tile : ${charactor.tileX} , ${charactor.tileY}
                                        CAM : ${Math.floor(cam.x)}, ${Math.floor(cam.y)}
                                        SECTION : ${currentSection.section}
                                        MOUSE : ${mouseX}, ${mouseY}                                       
                                        `
                                        ;
        }
    }
    
}