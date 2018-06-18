class CollisionEvent extends egret.Event {
    public static readonly type: string = "Collising";
    public collsionTest1: CollsionTest;
    public collsionTest2: CollsionTest;
    public intersectRect: egret.Rectangle;
    public msg: string;

    public constructor(test1: CollsionTest, test2: CollsionTest, rect: egret.Rectangle, bubbles: boolean = false, cancelable: boolean = false) {
        super(CollisionEvent.type, bubbles, cancelable);
        this.collsionTest1 = test1;
        this.collsionTest2 = test2;
        this.intersectRect = rect;
    }
}