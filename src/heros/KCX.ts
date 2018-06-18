/**
 * 英雄 - kuangcongxian
 */
class KCX extends Hero {

    private _mdata: any;
    private _texture: egret.Texture;
    private mcDataFactory;
    public action: Action;
    private actionMap: { [key: string]: Action } = {};

    public usepriority: boolean = true;

    private shp;
    private container: egret.DisplayObjectContainer;

    public constructor() {
        super();

        this._hp = 1000;
        this._max_hp = 1000;

        this._mdata = RES.getRes("kcx_json");
        this._texture = RES.getRes("kcx_png");
        this.mcDataFactory = new egret.MovieClipDataFactory(this._mdata, this._texture);

        this.initAction();
        this.switchAction("stand");
    }

    /**
     * 初始化动作对象
     */
    public initAction() {

        var obj = RES.getRes("kcx_act_json");
        var config = RES.getRes("kcx_atk_json");
        for (var act in obj.kcx.action) {
            var tmp = config.kcx[obj.kcx.action[act]];
            var clip = this.mcDataFactory.generateMovieClipData(obj.kcx.action[act]);
            this.actionMap[obj.kcx.action[act]] = new Action(clip, this, tmp);
            this.action = this.actionMap[obj.kcx.action[act]];
            this.action.anchorOffsetX = this.action.width / 2;
            this.action.anchorOffsetY = this.action.height / 2;
            this.action.anchorOffsetY += RES.getRes("kcx_yfixed_json").kcx[obj.kcx.action[act]];
        }
        for (var atk in obj.kcx.attack) {
            var tmp = config.kcx[obj.kcx.attack[atk]];
            this.actionMap[obj.kcx.attack[atk]] = new Attack(this.mcDataFactory.generateMovieClipData(obj.kcx.attack[atk]), this, tmp);
            this.action = this.actionMap[obj.kcx.attack[atk]];
            this.action.anchorOffsetX = this.action.width / 2;
            this.action.anchorOffsetY = this.action.height / 2;
            this.action.anchorOffsetY += RES.getRes("kcx_yfixed_json").kcx[obj.kcx.attack[atk]];
        }
        this.action = null;
        //test texiao

    }

    /**
     * 默认动作完成回调
     */
    public defaultAction() {
        this.blockSwitch = false;
        this.attackingStatus = false;
        this.usepriority = false;
        this.switchAction("stand", -1);
        this.usepriority = true;
    }

    /**
     * 画出攻击框用于debug
     */
    private drawRect_d() {
        if (this.action.type == Status.ACTION_ATTACK) {
            var atk = <Attack>this.action;
            if (this.shp)
                this.removeChild(this.shp);
            let shp = new egret.Shape();
            this.shp = shp;
            shp.graphics.lineStyle(10, 0x00ff00);
            shp.graphics.lineTo(atk.damage_Area.x, -atk.damage_Area.y);
            shp.graphics.lineTo(atk.damage_Area.x + atk.damage_Area.width, -atk.damage_Area.y);
            shp.graphics.lineTo(atk.damage_Area.x + atk.damage_Area.width, -atk.damage_Area.y + atk.damage_Area.height);
            shp.graphics.lineTo(atk.damage_Area.x, -atk.damage_Area.y + atk.damage_Area.height);
            shp.graphics.lineTo(0, 0);
            shp.graphics.lineTo(-this.width / 2, -this.height / 2);
            shp.graphics.lineTo(this.width / 2, this.height / 2);
            this.addChild(shp);
        }
    }

    /**
     * 动作切换
     */
    public switchAction(name: string, times: number = -1, callback: Function = this.defaultAction, obj: any = this) {
        if (this.current_status == name)
            return;
        if (this.action != null && this.usepriority) {
            if (this.action.priority < this.actionMap[name].priority)
                return;
        }
        this.current_status = name;
        this.playtimes = times;
        if (this.action && this.action.parent)
            this.removeChild(this.action);
        this.action = this.actionMap[name];
        this.addChild(this.action);
        this.action.once(egret.Event.COMPLETE, callback, obj);
        //for debug
        //this.drawRect_d();
        //end
        this.action.gotoAndPlay(0, times);

        if (this.action.type == Status.ACTION_ATTACK){
            this.attackingStatus=true;
            this.dispatchEvent(new egret.Event("atk"));
        }
        var shp = new egret.Shape();
        this.addChild(shp);
        shp.graphics.lineStyle(10, 0x00ff00);
        shp.graphics.lineTo(0, 0);
        this.addChild(shp);

    }

    /**
     * 跳跃
     */
    public jmp(ySpeed: number): void {
        this.isjump = true;
        this.ySpeed = ySpeed;
        this.switchAction("jump", 1);
    }

    public getAtkRect(): egret.Rectangle {
        if (!this.attackingStatus)
            return null;
        if (this.action == null)
            return null;
        if (this.action.type == Status.ACTION_ATTACK) {
            return (<Attack>this.action).damage_Area;
        }
        return null;
    }

    public applyAction(): number {
        egret.log(this.attackingStatus);
        if(this.attackingStatus){
            this.attackingStatus=false;
            return (<Attack>this.action).damage;
        }
        else return 0;
    }

    /**
     * 打印一部分数据
     */
    public toObj(): any {
        var obj = {};
        obj["hp"] = this.hp;
        obj["x"] = this.x;
        obj["y"] = this.y;
        obj["current_status"] = this.current_status;
        obj["blockSwitch"] = this.blockSwitch;
        obj["playtimes"] = this.playtimes;
        obj["ats"] = this.attackingStatus;
        obj["direction"] = this.direction;
        obj["rotation"] = this.rotation;
        obj["desc"]=this.desc;
        return obj;
    }

    public applyObj(obj:{}){
        this.x = SceneManager.SCREEN_WIDTH - obj["x"];
        this.hp = obj["hp"];
        this.y = obj["y"];
        this.direction = !obj["direction"];
        // this.attackingStatus = obj["ats"];
        this.switchAction(obj["current_status"], obj["playtimes"]);
        this.blockSwitch = obj["blockSwitch"];
        this.rotation = -obj["rotation"];
    }

    public stop(): void {
        this.action.stop();
        //this.switchAction("arm_attack");
        // this.action.frameRate=this.action.frameRate=10;
    }

    public start(): void {
        this.action.play();
    }

    public Instant_Shift(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getCollsionBox(rect: egret.Rectangle): egret.Rectangle {
        this.getBounds(rect);
        rect.x = this.x - rect.width / 2;
        rect.y = this.y - rect.height / 2;
        return rect;
    }
    get x(){
        return super.$getX();
    }
    set x(ax:number){
        if(ax>SceneManager.SCREEN_WIDTH)
            ax=SceneManager.SCREEN_WIDTH;
        if(ax<0)
            ax=0;
        super.$setX(ax);
    }
}