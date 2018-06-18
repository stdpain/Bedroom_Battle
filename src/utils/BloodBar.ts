/**
 * 血条
 */
class BloodBar extends egret.DisplayObjectContainer {
    private xue_img: egret.Bitmap;
    private xue_border: egret.Bitmap;
    private amask: egret.Bitmap;
    private hero: Hero;
    private text: egret.TextField;

    public constructor(scale: number, hero: Hero) {
        super();
        this.amask = new egret.Bitmap;
        this.amask.texture = RES.getRes("mask_png");

        this.xue_img = new egret.Bitmap;
        this.xue_img.texture = RES.getRes("xue_png");

        this.xue_border = new egret.Bitmap;
        this.xue_border.texture = RES.getRes("xue_border_png");

        this.addChild(this.xue_img);
        this.addChild(this.xue_border);

        this.scaleX = scale;
        this.hero = hero;

        this.text = new egret.TextField();
        this.text.text = this.hero.hp + "";
        this.text.textAlign = "center";
        this.text.textColor = 0xff;
        this.addChild(this.text);
    }

    public update() {
        this.xue_img.x = -this.amask.width + this.hero.hp / this.hero.max_hp * this.amask.width;
        this.xue_img.mask = this.amask;
        this.addChild(this.amask);
        this.text.text = this.hero.hp + "";
    }

}