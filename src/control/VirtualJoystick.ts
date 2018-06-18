/**
 * 虚拟摇杆
 */
class VirtualJoystick extends egret.DisplayObjectContainer {
    private ball: egret.Bitmap;
    private circle: egret.Bitmap;

    private circleRadius: number = 0; //圆环半径
    private ballRadius: number = 0;   //小球半径
    private centerX: number = 0;      //中心点坐标
    private centerY: number = 0;
    private touchID: number;          //触摸ID

    public constructor() {
        super();
        this.ball = new egret.Bitmap();
        this.ball.texture = RES.getRes('gan_core_png');
        this.circle = new egret.Bitmap();
        this.circle.texture = RES.getRes('gan_home_png');
        this.childrenCreated();

        this.scaleX = 1.7;
        this.scaleY = 1.7;
    }

    public childrenCreated() {
        //
        this.addChild(this.circle);
        this.addChild(this.ball);
        //获取圆环和小球半径
        this.circleRadius = this.circle.height / 2;
        this.ballRadius = this.ball.height / 2;
        //获取中心点
        this.centerX = this.circleRadius;
        this.centerY = this.circleRadius;
        //设置锚点
        this.anchorOffsetX = this.circleRadius;
        this.anchorOffsetY = this.circleRadius;
        //设置小球初始位置
        this.ball.x = this.centerX;
        this.ball.y = this.centerY;
        this.ball.anchorOffsetX = this.ballRadius;
        this.ball.anchorOffsetY = this.ballRadius;

        this.reset();
    }

    //启动虚拟摇杆 (监听事件根据实际情况设置，不然点一下UI上的其他按钮，也会触发虚拟摇杆事件。这里只是做demo，就没那么讲究了 - -!)
    public start() {
        SceneManager.Instance.rootStage.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        SceneManager.Instance.rootStage.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        SceneManager.Instance.rootStage.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
    }

    //停止虚拟摇杆
    public stop() {
        SceneManager.Instance.rootStage.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        SceneManager.Instance.rootStage.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        SceneManager.Instance.rootStage.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
    }

    //private invaid:number= -10086;
    //触摸开始，显示虚拟摇杆
    private onTouchBegin(e: egret.TouchEvent) {
        //egret.log("touch_st");
        if (e.stageX < SceneManager.SCREEN_WIDTH / 2 && e.stageY > SceneManager.SCREEN_HEIGHT / 2) {
        }
        else {
            return;
        }

        this.touchID = e.touchPointID;
        this.x = e.stageX;
        this.y = e.stageY;
        this.ball.x = this.centerX;
        this.ball.y = this.centerY;
        SceneManager.Instance.rootStage.addChild(this);

        this.dispatchEvent(new egret.Event("vj_start"));
    }

    //触摸结束，隐藏虚拟摇杆
    private onTouchEnd(e: egret.TouchEvent) {
        if (this.touchID != e.touchPointID) {
            return;
        }
        if (e.stageX < SceneManager.SCREEN_WIDTH / 2) {
        }
        else {
            return;
        }
        //this.hide();
        this.reset();
        this.dispatchEvent(new egret.Event("vj_end"));
    }

    //触摸移动，设置小球的位置
    private p1: egret.Point = new egret.Point();
    private p2: egret.Point = new egret.Point();

    private onTouchMove(e: egret.TouchEvent) {
        if (this.touchID != e.touchPointID) {
            return;
        }
        if (e.stageX < SceneManager.SCREEN_WIDTH / 2) {
        }
        else {
            return;
        }
        //获取手指和虚拟摇杆的距离
        this.p1.x = this.x;
        this.p1.y = this.y;
        this.p2.x = e.stageX;
        this.p2.y = e.stageY;
        var dist = egret.Point.distance(this.p1, this.p2);
        var angle: number = Math.atan2(e.stageY - this.y, e.stageX - this.x);
        //手指距离在圆环范围内
        if (dist <= (this.circleRadius - this.ballRadius)) {
            this.ball.x = this.centerX + e.stageX - this.x;
            this.ball.y = this.centerY + e.stageY - this.y;
            //手指距离在圆环范围外
        } else {
            this.ball.x = Math.cos(angle) * (this.circleRadius - this.ballRadius) + this.centerX;
            this.ball.y = Math.sin(angle) * (this.circleRadius - this.ballRadius) + this.centerY;
        }
        //派发事件
        this.dispatchEventWith("vj_move", false, angle);
    }

    private hide() {
        this.parent && this.parent.removeChild(this);
    }

    private reset() {
        this.x = 150;
        this.y = 500;
        this.ball.x = this.centerX;
        this.ball.y = this.centerY;
    }

}