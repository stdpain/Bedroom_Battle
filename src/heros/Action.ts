/**
 * 动作类
 */
class Action extends egret.MovieClip {
    public priority: number;
    public toPAbody: boolean;
    public type: string;
    public hero: Hero;
    public toDefense: boolean;
    public blockswitch: boolean;

    public constructor(clip, hero: Hero, obj) {
        super(clip);
        this.priority = obj["priority"];
        this.toPAbody = obj["toPAbody"];
        this.type = Status.ACTION_MOVE;
        this.hero = hero;
    }

    public apply() {
        this.hero.PAbody = this.toPAbody;
    }

    public cancle() {
        this.hero.PAbody = false;
    }
}