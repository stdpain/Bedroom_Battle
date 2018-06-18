/**
 * 攻击类
 */
class Attack extends Action {
    public damage: number;
    public damage_type: string;
    public repel_distance_xspeed: number;
    public damage_Area: egret.Rectangle;
    public description: string;
    public PAbody_beat: boolean;


    public constructor(clip, hero: Hero, obj) {
        super(clip, hero, obj);
        this.damage = obj["damage"];
        this.damage_type = obj["damage_type"];
        this.repel_distance_xspeed = obj["repel_distance_xspeed"];
        this.description = obj["description"];
        this.PAbody_beat = obj["PAbody_beat"];
        this.damage_Area = new egret.Rectangle(obj["damage_Area"][0], obj["damage_Area"][1], obj["damage_Area"][2], obj["damage_Area"][3]);
        this.type = Status.ACTION_ATTACK;
    }

    public apply() {
        this.hero.PAbody = this.toPAbody;
    }

    public cancle() {
        this.hero.PAbody = false;
    }
}