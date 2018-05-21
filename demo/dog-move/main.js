class DogAnimation{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.lastWalkingTime = Date.now();
        this.keyFrameIndex = -1;
        canvas.width = window.innerWidth;
        canvas.height = 200;
        // 存放狗的图
        this.dogPictures = [];
        this.IMG_COUNT = 8;
        this.dog = {
            stepDistance: 10,
            speed: 0.15,
            mouseX: -1
        };
        this.dogSpeed = 0.1;
        this.currentX = 0;
        this.start();
    }
    async start(){
        await this.loadResources();
        window.requestAnimationFrame(this.walk.bind(this));
    }
    walk(){
        let now = Date.now();
        let distance = (now - this.lastWalkingTime) * this.dog.speed;
        if(now - this.lastWalkingTime > 100){
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

            let keyFrameIndex = ++this.keyFrameIndex % this.IMG_COUNT;
            let img = this.dogPictures[keyFrameIndex + 1];


            // this.currentX += distance;

            this.ctx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight,this.currentX,20,186,162);
            this.lastWalkingTime = now;
        }
        if(distance < this.dog.stepDistance){
            window.requestAnimationFrame(this.walk.bind(this));
            return;
        }
    }
    loadResources(){
        let imagesPath = [];
        for(var i = 0; i <= this.IMG_COUNT; i++){
            imagesPath.push(`${i}.png`);
        }

        let works = [];
        imagesPath.forEach(item => {
            works.push(new Promise(resolve => {
                let img = new Image();
                img.onload = () => resolve(img);
                img.src = item;
            }));
        });

        return new Promise(resolve => {
            Promise.all(works).then(dogPictures  => {
                this.dogPictures = dogPictures;
                resolve();
            })
        })
    }
}


let canvas = document.querySelector('#dog');
let dogAnimation = new DogAnimation(canvas);
dogAnimation.start();

