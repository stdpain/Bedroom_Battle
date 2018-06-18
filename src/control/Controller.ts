/**
 * 负责控制
 */
class Controller extends egret.DisplayObjectContainer {
    public vj: VirtualJoystick;//虚拟摇杆
    public btnG: ControlBtn;//控制按钮
    public bloodBar: BloodBarComp;//血条

    public up_status: boolean;
    public down_status: boolean;
    public left_status: boolean;
    public right_status: boolean;

    public constructor() {
        super();
        //创建按钮组
        this.btnG = new ControlBtn;
        this.addChild(this.btnG);
        this.btnG.x = 950;
        this.btnG.y = 500;
        this.bloodBar = new BloodBarComp();
        this.addChild(this.bloodBar);
        this.vj = new VirtualJoystick();
        this.addChild(this.vj);
    }

    public setHero(h1: Hero, h2: Hero) {
        this.bloodBar.setHero(h1, h2);
    }
}