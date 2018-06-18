class BattleMain extends egret.DisplayObjectContainer {
    private battleScene: BattleScene;
    private Controller: Controller;

    public constructor() {
        super();
        this.Controller = new Controller();
        this.battleScene = new BattleScene('bg_jpg', this.Controller);
        this.addChild(this.battleScene);
        this.addChild(this.Controller);
    }

}