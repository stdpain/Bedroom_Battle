/**
 * 英雄类
 */
abstract class Hero extends egret.DisplayObjectContainer implements CollsionTest {
    protected _id: number;
    protected _hp: number;
    protected _max_hp: number;
    protected _mp: number;
    protected _max_mp: number;
    protected belongTo: number;
    protected couldMove: boolean;
    protected _hitStatus: boolean;//挨揍状态
    protected _attackingStatus: boolean;//攻击状态
    protected InvincibleStatus: boolean;//无敌
    public PAbody: boolean;//霸体
    protected defense: boolean;//防御状态
    protected _isjump: boolean;
    public willjump: boolean;
    protected below: boolean;//蹲
    protected run: boolean;
    protected _direction: boolean;
    public ignore_yAccaculate: boolean;

    public current_status: string;
    public playtimes: number;

    public xSpeed: number;
    public ySpeed: number;
    public xAccaculate: number;
    public yAccaculate: number;

    public blockSwitch: boolean;

    private _desc:string;

    public constructor() {
        super();
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.xAccaculate = 0;
        this.yAccaculate = 0;
        this.rotation = 0;
        this._hp = 0;
        this._max_hp = 0;
        this._mp = 0;
        this._max_mp = 0;
        this.belongTo = 0;
        this.couldMove = true;
        this._hitStatus = false;
        this._attackingStatus = false;
        this.InvincibleStatus = true;
        this.PAbody = false;
        this.defense = false;
        this.isjump = false;
        this.willjump = false;
        this.below = false;
        this.run = false;
        this._direction = true;
        this.ignore_yAccaculate = false;
    }

    get desc(){
        return  this._desc;
    }
    
    set desc(item:string){
        this._desc=item;
    }

    get hp(): number {
        return this._hp;
    }

    set hp(hp: number) {
        if (hp <= 0) {
            this.dispatchEvent(new egret.Event("dead"));
            hp = 0;
        }
        this._hp = hp;
    }

    get max_hp(): number {
        return this._max_hp;
    }

    set max_hp(themax_hp: number) {
        this._max_hp = themax_hp;
    }

    get mp(): number {
        return this._mp;
    }

    set mp(themp: number) {
        this._mp = themp;
    }

    get max_mp(): number {
        return this._max_mp;
    }

    set max_mp(themax_mp: number) {
        this._max_mp = themax_mp;
    }

    get attackingStatus(): boolean {
        return this._attackingStatus;
    }

    set attackingStatus(attackingStatus: boolean) {
        this._attackingStatus = attackingStatus;
    }

    get hitStatus(): boolean {
        return this._hitStatus;
    }

    set hitStatus(hitStatus: boolean) {
        this._hitStatus = hitStatus;
    }

    get isjump(): boolean {
        return this._isjump;
    }

    set isjump(isjump: boolean) {
        this._isjump = isjump;
    }

    set direction(direction: boolean) {
        if (this._direction == direction)
            return;
        this._direction = direction;
    }

    get direction(): boolean {
        return this._direction;
    }

    get id() {
        return this._id;
    }

    set id(_id: number) {
        this._id = _id;
    }

    public switchDirection(): void {
        this.direction = !this.direction;
        if (this.direction) {
            this.skewY = 0;
        }
        else this.skewY = 180;
    }

    abstract switchAction(name: string): void;
    abstract switchAction(name: string, times: number): void;

    abstract jmp(ySpeed: number): void;

    abstract toObj(): any;

    abstract getAtkRect(): egret.Rectangle;

    abstract applyAction(): number;

    abstract stop(): void;

    abstract start(): void;

    abstract Instant_Shift(x: number, y: number);

    abstract getCollsionBox(rect: egret.Rectangle): egret.Rectangle;

    abstract applyObj(obj:{});
}