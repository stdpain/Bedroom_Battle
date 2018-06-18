/**
 * 碰撞检测池
 * 其中 pool1 id 为1 pool2 id 为2
 */
class CollisionTestingPool extends egret.DisplayObjectContainer {
    private rootContainer: egret.DisplayObjectContainer;
    private pool1: CollsionTest[] = [];
    private pool2: CollsionTest[] = [];
    private size1: number;
    private size2: number;
    private boundingBox1: egret.Rectangle = new egret.Rectangle(0, 0, 0, 0);
    private boundingBox2: egret.Rectangle = new egret.Rectangle(0, 0, 0, 0);
    private shp1: egret.Shape = new egret.Shape();
    private shp2: egret.Shape = new egret.Shape();

    public constructor(root: egret.DisplayObjectContainer) {
        super();
        this.rootContainer = root;
        this.size1 = 0;
        this.size2 = 0;
        this.addEventListener(egret.Event.ENTER_FRAME, this.run, this);

        this.rootContainer.addChild(this.shp1);
        this.rootContainer.addChild(this.shp2);

    }

    public add(item: CollsionTest) {
        if(item.id==1)
            this.pool1[this.size1++] = item;
        else
            this.pool2[this.size2++] = item;
    }

    public remove(item: CollsionTest) {
        if(item.id==1){
            this.pool1.forEach((val, idx, array) => {
                if (val == item) {
                    delete array[idx];
                }
            });
        }
        else {
            this.pool2.forEach((val, idx, array) => {
                if (val == item) {
                    delete array[idx];
                }
            });
        }
    }

    private drawCollsionBox(item: CollsionTest, shp: egret.Shape) {
        item.getCollsionBox(this.boundingBox1);
        shp.graphics.drawRect(this.boundingBox1.x, this.boundingBox1.y,
            this.boundingBox1.width, this.boundingBox1.height);
    }

    private drawAll(){
         //画出碰撞矩形
        this.pool1.forEach((val,idx,array)=>{
            this.drawCollsionBox(val, this.shp1);            
        });
        this.pool2.forEach((val,idx,array)=>{
            this.drawCollsionBox(val,this.shp2);
        });
        //endl
    }

    public run() {
        this.shp1.graphics.clear();
        this.shp1.graphics.lineStyle(5, 0x00ff00);

        this.shp2.graphics.clear();
        this.shp2.graphics.lineStyle(5,0xff0000);
       
        // this.drawAll();

        this.pool2.forEach((val, idx, array) => {
            val.getCollsionBox(this.boundingBox1);
            if(!val.visible)return;
            this.pool1.forEach((val2, idx2, array) => {
                if(!val2.visible)return;
                val2.getCollsionBox(this.boundingBox2);
                if (this.boundingBox2.intersects(this.boundingBox1)) {
                    let event: CollisionEvent = new CollisionEvent(val, val2, this.boundingBox2.intersection(this.boundingBox1));
                    var boundingBox = this.boundingBox2.intersection(this.boundingBox1);
                    this.shp1.graphics.drawRect(boundingBox.x,boundingBox.y,boundingBox.width,boundingBox.height);
                    this.dispatchEvent(event);
                }
            });
        });
    }
}