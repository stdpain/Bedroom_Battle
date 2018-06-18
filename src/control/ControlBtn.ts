/**
 * 按钮组
 */
class ControlBtn extends egret.DisplayObjectContainer {

    protected tan: egret.Bitmap;
    protected O: egret.Bitmap;
    protected rec: egret.Bitmap;
    protected X: egret.Bitmap;

    public constructor() {
        super();
        this.tan = this.createBitmap("tang_png");
        this.O = this.createBitmap("o_png");
        this.rec = this.createBitmap("rect_png");
        this.X = this.createBitmap("x_png");

        this.addChild(this.tan);
        this.addChild(this.O);
        this.addChild(this.rec);
        this.addChild(this.X);

        this.reset(this.tan);
        this.reset(this.O);
        this.reset(this.rec);
        this.reset(this.X);

        this.tan.x = 0;
        this.tan.y = -this.tan.height / 1.413;

        this.X.x = 0;
        this.X.y = this.tan.height / 1.413;

        this.O.x = this.tan.width / 1.413;
        this.O.y = 0;

        this.rec.x = -this.tan.width / 1.413;
        this.rec.y = 0;

        this.start();

        this.setOntouchTan(this.ontouchTan, this);
        this.setOntouchX(this.ontouchX, this);
        this.setOntouchO(this.OntouchO, this);

        this.scaleX = 1.5;
        this.scaleY = 1.5;

        this.tan.touchEnabled = true;
        this.X.touchEnabled = true;
        this.O.touchEnabled = true;
        this.rec.touchEnabled = true;
    }

    private createBitmap(name: string): egret.Bitmap {
        let bitmap = new egret.Bitmap;
        bitmap.texture = RES.getRes(name);
        return bitmap;
    }

    private reset(btn: egret.DisplayObject) {
        btn.anchorOffsetX = btn.width / 2;
        btn.anchorOffsetY = btn.height / 2;
    }

    public setOntouchTan(egret_callback: Function, obj: any) {
        //设置点击回调
        this.tan.addEventListener(egret.TouchEvent.TOUCH_TAP, egret_callback, obj);
    }

    public setOntouchX(egret_callback: Function, obj: any) {
        //设置点击回调
        this.X.addEventListener(egret.TouchEvent.TOUCH_TAP, egret_callback, obj);
    }

    public setOntouchO(egret_callback: Function, obj: any) {
        //设置点击回调
        this.O.addEventListener(egret.TouchEvent.TOUCH_TAP, egret_callback, obj);
    }

    public setOntouchRec(egret_callback: Function, obj: any) {
        //设置点击回调
        this.rec.addEventListener(egret.TouchEvent.TOUCH_TAP, egret_callback, obj);
    }

    public removeOntouchTan(egret_callback: Function, obj: any) {
        //取消点击回调
        this.tan.removeEventListener(egret.TouchEvent.TOUCH_TAP, egret_callback, obj);
    }

    public removeOntouchX(egret_callback: Function, obj: any) {
        //取消点击回调
        this.X.removeEventListener(egret.TouchEvent.TOUCH_TAP, egret_callback, obj);
    }

    public removeOntouchO(egret_callback: Function, obj: any) {
        //取消点击回调
        this.O.removeEventListener(egret.TouchEvent.TOUCH_TAP, egret_callback, obj);
    }

    public removeOntouchRec(egret_callback: Function, obj: any) {
        //取消点击回调
        this.rec.removeEventListener(egret.TouchEvent.TOUCH_TAP, egret_callback, obj);
    }

    private ontouchTan(evt: egret.Event) {
        this.dispatchEvent(new egret.Event("btn_tan"));
    }

    private ontouchX(evt: egret.Event) {
        this.dispatchEvent(new egret.Event("btn_x"));
    }

    private OntouchO() {

    }

    public start() {
        this.touchChildren = true;
    }

    public stop() {
        this.touchChildren = false;
    }

}