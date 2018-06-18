interface CollsionTest extends egret.DisplayObject{
    id: number;
    visible:boolean;
    desc:string;
    applyObj(obj:{});
    getCollsionBox(rect: egret.Rectangle): egret.Rectangle;
    toObj();
}