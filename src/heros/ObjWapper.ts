class ObjWapper extends egret.DisplayObject implements CollsionTest {
    public id: number;
    private _obj: egret.DisplayObject;
    private _desc:string;

    public constructor(obj: egret.DisplayObject) {
        super();
        this._obj = obj;
        this.id=0;
    }

    public getCollsionBox(rect: egret.Rectangle): egret.Rectangle {
        this.obj.getBounds(rect);
        rect.x = this.obj.x - rect.width / 2;
        rect.y = this.obj.y - rect.height / 2;
        return rect;
    }
    get visible(){
        return this.obj.visible;
    }
    set visible(visible:boolean){
        this.obj.visible=visible;
    }

    get obj(){
        return this._obj;
    }
    set obj(obj:egret.DisplayObject){
        this._obj=obj;
    }
    get desc(){
        return this._desc;
    }
    set desc(item:string){
        this._desc=item;
    }
    toObj(){
        let obj:{[key:string]:any}={};
        obj["x"]=this.obj.x;
        obj["y"]=this.obj.y;
        obj["rotation"]=this.obj.rotation;
        obj["desc"]=this.desc;
        obj["visible"]=this.obj.visible+"";
        return obj;
    }
    public applyObj(obj:{}){
        this.obj.x = SceneManager.SCREEN_WIDTH - obj["x"];
        this.obj.y = obj["y"];
        this.obj.rotation = -obj["rotation"];
        if(obj["visible"]=="false")
            this.obj.visible =  false;
        else this.obj.visible=true;
    }
}
