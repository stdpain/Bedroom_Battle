class BloodBarComp extends egret.DisplayObjectContainer {
    private bloodBar: BloodBar;
    private bloodBar2: BloodBar;
    private h1: Hero;
    private h2: Hero;
    private timer: egret.Timer;
    private timer_Text: egret.TextField;
    private timer_num: number = 60;

    public constructor() {
        super();

        this.timer_Text = new egret.TextField;
        this.timer_Text.text = this.timer_num + "";
        this.timer_Text.x = 600;
        this.timer_Text.textColor = 0xffff00;
        this.addChild(this.timer_Text);

        this.timer = new egret.Timer(1000, 60);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerupdate, this);
        this.timer.start();
    }

    public update() {
        this.bloodBar.update();
        this.bloodBar2.update();
    }

    private timerupdate() {
        this.timer_num -= 1;
        this.timer_Text.text = this.timer_num + "";
    }

    public setHero(h1: Hero, h2: Hero) {
        this.h1 = h1;
        this.h2 = h2;
        this.bloodBar = new BloodBar(2, this.h1);
        this.addChild(this.bloodBar);
        this.bloodBar2 = new BloodBar(2, this.h2);
        this.addChild(this.bloodBar2);
        this.bloodBar2.x = 820;
    }

}