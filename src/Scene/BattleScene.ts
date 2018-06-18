/**
 * 战斗场景
 */
class BattleScene extends egret.DisplayObjectContainer {

    private bg_img: egret.Bitmap;//战斗的背景图

    private hero1: Hero;//我方英雄
    private hero2: Hero;

    private displayDic: {[key:string]:CollsionTest}={};

    private flyer: egret.Bitmap;

    //人物移动速度单位
    private speed = 10;
    //重力
    private speedY_g = 1.98;
    //水平方向阻碍加速度
    private speedX_a = 0.25;

    private timer: egret.Timer;

    private controller: Controller;

    public constructor(name: string, controller) {
        super();
        this.bg_img = new egret.Bitmap();
        this.bg_img.texture = RES.getRes(name);
        this.addChild(this.bg_img);

        this.hero1 = new KCX();
        this.hero1.x = 300;
        this.hero1.y = SceneManager.SCREEN_HEIGHT - this.hero1.height / 2;
        this.hero1.id=1;
        this.addChild(this.hero1);

        this.hero2 = new KCX();
        this.hero2.x = 800;
        this.hero2.y = SceneManager.SCREEN_HEIGHT - this.hero2.height / 2;

        var colorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            1, 0, 0, 0, 0,
            0, 0, 0, 1, 0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix)
        this.hero2.filters = [colorFlilter];

        this.addChild(this.hero2);
        this.hero2.switchDirection();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.childrenCreated, this);

        WebSocketManager.Instance.x = 400;
        this.addChild(WebSocketManager.Instance);

        // this.hero2.addEventListener("atk", this.testAtk, this);

        this.controller = controller;
        this.controller.setHero(this.hero1, this.hero2);

        //test for flyer
        this.flyer = new egret.Bitmap();
        this.flyer.texture = RES.getRes("dark01@2x_png");
        this.addChild(this.flyer);
        this.flyer.visible = false;
        this.flyer.anchorOffsetX = this.flyer.width / 2;
        this.flyer.anchorOffsetY = this.flyer.height / 2;

        let objWapper: ObjWapper = new ObjWapper(this.flyer);
        objWapper.id=1;

        let ctp = new CollisionTestingPool(this);
        ctp.add(objWapper);
        ctp.add(this.hero1);
        ctp.add(this.hero2);
        ctp.addEventListener(CollisionEvent.type, this.ans, this);
        this.addChild(ctp);

        var fly2 = new egret.Bitmap();
        fly2.texture = RES.getRes("dark01@2x_png");
        this.addChild(fly2);
        fly2.visible = false;
        fly2.anchorOffsetX = fly2.width / 2;
        fly2.anchorOffsetY = fly2.height / 2;
        fly2.visible=false;
        let objWapper2: ObjWapper = new ObjWapper(fly2);
        objWapper2.id=2;

        this.displayDic["hero"]=this.hero1;
        this.displayDic["dark01"]=objWapper;
        this.displayDic["@@hero"]=this.hero2;
        this.displayDic["@@dark01"]=objWapper2;

        ctp.add(objWapper2);

        this.hero1.desc="hero";
        this.hero2.desc="@@hero";
        objWapper.desc="dark01";
        objWapper2.desc="@@dark01";
    }
    //rect的回调函数
    private blockRect:boolean = false;
    public rect(){
        if(this.blockRect)return;
        this.blockRect=true;
        let v_x = this.hero2.x;
        let v_y = this.hero2.y;

        // this.hero2.
        egret.Tween.get(this.hero1).to({x: v_x + 200}, 500, egret.Ease.sineIn).call(function () {
            this.blockRect=false;
        }, this);
        // egret.Tween.get(this.flyer).to({rotation: 360}, 1500);
    }
    private blockcirc:boolean = false;
    public circ(){
        if(this.blockcirc)return;
        this.blockcirc=true;
        egret.Tween.get(this.hero1).to({x:this.hero1.x-200},120,egret.Ease.sineIn).call(function(){
            this.blockcirc=false;
        },this);
    }


    public ans(event: CollisionEvent) {
        let a = event.collsionTest1;
        let b = event.collsionTest2;
        let c = event.intersectRect;
        var ans = Math.random();
        var bns = Math.random();
        var cns = Math.random();

        if(b instanceof Hero){
            if(a instanceof Hero){
                let damage:number = a.applyAction();
                // egret.log(damage);
                b.hp=b.hp-damage;
            }
            else b.hp=b.hp-10;
        }
    }

    private sendDic() {
        var key: string;
        for(key in this.displayDic)
        {
            if(key.indexOf("@@")>=0)
                continue;
            WebSocketManager.Instance.sendData(this.displayDic[key].toObj());
            // egret.log(this.displayDic[key].toObj());
        }
    }

    public childrenCreated() {
        //开启虚拟摇杆

        this.controller.vj.start();
        this.controller.vj.addEventListener("vj_start", this.onStart, this);
        this.controller.vj.addEventListener("vj_move", this.onChange, this);
        this.controller.vj.addEventListener("vj_end", this.onEnd, this);
        this.controller.btnG.addEventListener("btn_tan", this.att, this);
        this.controller.btnG.addEventListener("btn_x", this.test, this);
        this.controller.btnG.setOntouchRec(this.rect,this);
        this.controller.btnG.setOntouchO(this.circ,this);

        this.addEventListener(egret.Event.ENTER_FRAME, this.physicsFrame, this);

        this.hero2.addEventListener("dead", this.onWin, this);
        this.hero1.addEventListener("dead", this.youLost, this);

        WebSocketManager.Instance.bindOnReceiveMessage(this.onGetDate,this);
    }

    private blockTest: boolean = false;

    private test() {
        if (this.blockTest) return;
        this.blockTest = true;
        this.flyer.visible = true;
        this.flyer.x = this.hero1.x;
        this.flyer.y = this.hero1.y;

        egret.Tween.get(this.flyer).to({x: this.hero1.x + 1000}, 1500, egret.Ease.sineIn).call(function () {
            this.flyer.visible = false;
            this.blockTest = false
        }, this);
        egret.Tween.get(this.flyer).to({rotation: 360}, 1500);
    }
    private onGetDate(){
        var byte: egret.ByteArray = new egret.ByteArray();
        //读取数据
        WebSocketManager.Instance.socket.readBytes(byte);
        //读取字符串信息
        var msg: string = byte.readUTFBytes(byte.bytesAvailable);
        var obj = JSON.parse(msg);
        
        var key: string;
        key = obj.desc;
        if(this.displayDic["@@"+key]!=null)
            this.displayDic["@@"+key].applyObj(obj);

        this.setdirectionAndRole(this.hero2);
    }
    private wan: boolean = false;

    private onWin(evt: egret.Event) {
        if (this.wan)
            return;
        this.wan = true;
        let gameoverText: egret.TextField = new egret.TextField;
        gameoverText.text = "You Win";
        this.addChild(gameoverText);
        gameoverText.textAlign = "center";
        gameoverText.textColor = 0xff00;
        gameoverText.size = 80;
        gameoverText.x = this.stage.width / 2 - gameoverText.width;
        gameoverText.y = this.stage.height / 2 - gameoverText.height;

        this.controller.vj.stop();
        this.controller.btnG.stop();
        // this.stop();
    }

    private youLost(evt: egret.Event) {
        if (this.wan)
            return;
        this.wan = true;
        let gameoverText: egret.TextField = new egret.TextField;
        gameoverText.text = "You Lost";
        this.addChild(gameoverText);
        gameoverText.textAlign = "center";
        gameoverText.textColor = 0xff00;
        gameoverText.size = 80;
        gameoverText.x = this.stage.width / 2 - gameoverText.width;
        gameoverText.y = this.stage.height / 2 - gameoverText.height;

        this.controller.vj.stop();
        this.controller.btnG.stop();
    }

    private att(evt: egret.Event) {
        // egret.Tween.get(this.hero1).to({x:600,y:20}, 300, egret.Ease.sineIn );
        this.hero1.attackingStatus = true;
        this.hero1.switchAction("arm_attack", 1);
        this.hero1.blockSwitch = true;
        if (this.hero1.isjump) {
            var ang = Math.atan((this.hero1.y - this.hero2.y) / (this.hero1.x - this.hero2.x));
            this.hero1.rotation = ang / Math.PI * 180;
        }
    }

    //摇杆启动，人物开始根据摇杆移动
    private onStart() {
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    }

    //触摸摇杆的角度改变，人物的移动速度方向也随之改变
    private onChange(e: egret.Event) {
        var angle = e.data;
        this.hero1.xSpeed = Math.cos(angle) * this.speed;
        var ang = angle / Math.PI * 180;
        if (ang > -145 && ang < -45) {
            this.hero1.willjump = true;
        }
        else this.hero1.willjump = false;
    }

    //停止摇杆，人物停止移动
    private onEnd() {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.hero1.switchAction("stand");
        this.hero1.willjump = false;
    }

    //每帧更新，人物移动
    private onEnterFrame() {
        if (!this.hero1.blockSwitch) {
            this.hero1.x += this.hero1.xSpeed;
            this.hero1.switchAction("walk", -1);
        }
    }

    private draw_boundingbox_d(obj: egret.DisplayObjectContainer) {

        var bbox: egret.Rectangle = obj.getBounds();
        var shape: egret.Shape = new egret.Shape();
        shape.graphics.lineStyle(10, 0xff00);
        shape.graphics.lineTo(0, 0);
        shape.graphics.lineTo(bbox.width, 0);
        shape.graphics.lineTo(bbox.width, bbox.height);
        shape.graphics.lineTo(0, 0 + bbox.height);
        shape.graphics.lineTo(0, 0);
        shape.x = 0;
        shape.y = 0;
        shape.anchorOffsetX = bbox.width / 2;
        shape.anchorOffsetY = bbox.height / 2;
        //this.addChild(shape);
        obj.addChild(shape);
    }

    /**
     * 重力模仿和碰撞检测
     */
    private physicsFrame(evt: egret.Event) {
        if (this.hero1.willjump && !this.hero1.isjump) {
            this.hero1.jmp(-30);
        }
        if (this.hero1.isjump && this.hero1.hitStatus) {
            this.hero1.rotation = -90;
        }
        this.setdirectionAndRole(this.hero1);
        this.cacuFall(this.hero1);
        this.cacuFall(this.hero2);
        BattleScene.checkDirection(this.hero1, this.hero2);
        // this.xshake();
        // this.stop();
        this.controller.bloodBar.update();
        this.sendDic();
    }

    /**
     * 计算下落
     */
    private cacuFall(hero: Hero) {
        hero.ySpeed += this.speedY_g;
        hero.y += hero.ySpeed;
        if (hero.y >= SceneManager.SCREEN_HEIGHT - hero.height / 2) {
            hero.y = SceneManager.SCREEN_HEIGHT - hero.height / 2;
            hero.ySpeed = 0;
            hero.isjump = false;
            hero.rotation = 0;
        }
    }

    public static checkDirection(h1: Hero, h2: Hero) {
        if (h1.x > h2.x) {
            h1.direction = false;
        }
        else h1.direction = true;
    }

    public setdirectionAndRole(h: Hero) {
        if (h.direction) {
            h.skewY = h.rotation;
        } else
            h.skewY = 180 + h.rotation;
    }

    /**
     * 攻击判定
     */
    public testAtk() {
        if (this.hero2.getAtkRect()) {
            if (this.checker(this.hero1, this.hero2)) {
                this.hero1.hp -= this.hero2.applyAction();
            }
        }
    }

    /**
     * 矩形碰撞检测
     */
    public static checkColl(obj1: egret.DisplayObject, obj2: egret.DisplayObject) {
        let boundRect1: egret.Rectangle = obj1.getBounds();
        let boundRect2: egret.Rectangle = obj2.getBounds().clone();
        boundRect1.x = obj1.x;
        boundRect1.y = obj1.y;
        boundRect2.x = obj2.x;
        boundRect2.y = obj2.y;
        return boundRect1.intersects(boundRect2);
    }

    /**
     * 检测 h2攻击h1
     */
    private p1 = new egret.Point();
    private p2 = new egret.Point();
    private p3 = new egret.Point();
    private p4 = new egret.Point();

    public checker(h1: Hero, h2: Hero) {
        let boundRect1: egret.Rectangle = h1.getBounds();
        let attackRect: egret.Rectangle = h2.getAtkRect();
        boundRect1.x = h1.x;
        boundRect1.y = h1.y;

        h2.localToGlobal(attackRect.x, -attackRect.y, this.p1);
        h2.localToGlobal(attackRect.x + attackRect.width, -attackRect.y, this.p2);
        h2.localToGlobal(attackRect.x, -attackRect.y + attackRect.height, this.p3);
        h2.localToGlobal(attackRect.x + attackRect.width, -attackRect.y + attackRect.height, this.p4);
        return h1.hitTestPoint(this.p1.x, this.p1.y) || h1.hitTestPoint(this.p2.x, this.p2.y) || h1.hitTestPoint(this.p3.x, this.p3.y) || h1.hitTestPoint(this.p4.x, this.p4.y);
    }

    /**
     * 特写控制
     */
    private stop() {
        // this.hero1.stop();
        // this.hero2.stop();
        // this.controller.btnG.stop();
        // this.controller.vj.stop();
        this.scaleX = 1.5;
        this.scaleY = 1.5;
        this.x = -this.hero1.x * 1.5;
        this.y = -this.hero1.y * 1.5;
        this.y = this.y + this.hero1.height / 2 * 1.5;
        this.x = this.x + this.hero1.width / 2 * 1.5;
    }

    private goon() {
        this.hero1.start();
        this.hero2.start();
        this.controller.btnG.start();
        this.controller.vj.start();
    }

    /**
     * 摇晃控制
     */
    private directionx: boolean = true;

    private xshake() {
        if (this.directionx)
            this.x += 3;
        else
            this.x -= 3;
        if (Math.abs(this.x) > 3)

            this.directionx = !this.directionx;
    }

    private xshakecancle() {
        this.x = 0;
    }

    private directiony: boolean = true;

    private yshake() {
        if (this.directiony)
            this.y += 3;
        else
            this.y -= 3;
        if (Math.abs(this.y) > 3)
            this.directiony = !this.directiony;
    }

    private yshakecancle() {
        this.y = 0;
    }
}