/**
 * 开始场景
 *
 */
class MainScene extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.loadResource();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, this.createGameScene, this);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;

    protected createGameScene(): void {
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);

        let colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        // colorLabel.text = "寝室大作战";
        colorLabel.text = "男の寝室斗♂戰-V0.0.2";

        colorLabel.size = 64;
        colorLabel.x = 100;
        colorLabel.y = 80;
        this.addChild(colorLabel);

        let textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        //RES.getResAsync("description_json", this.startAnimation, this);

        let startbtn = new eui.Button();
        startbtn.label = "开始打架";
        startbtn.horizontalCenter = 0;
        startbtn.verticalCenter = 0;
        startbtn.x = this.stage.width / 2 - 20;
        startbtn.y = this.stage.height / 2 - 50;
        this.addChild(startbtn);
        startbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartGame, this);

        let button = new eui.Button();
        button.label = "充钱";
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        button.x = this.stage.width / 2 - 20;
        button.y = this.stage.height / 2;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private onStartGame(e: egret.TouchEvent) {
        /*if(!SceneManager.Instance.battleScene){
            // SceneManager.Instance.battleScene = new BattleScene('bg_jpg');

        }*/
        if (!SceneManager.Instance.battleMain) {
            SceneManager.Instance.battleMain = new BattleMain();
        }
        SceneManager.Instance.rootStage.removeChild(SceneManager.Instance.indexScene);
        // SceneManager.Instance.rootStage.addChild(SceneManager.Instance.battleScene);
        SceneManager.Instance.rootStage.addChild(SceneManager.Instance.battleMain);
    }

    private onButtonClick(e: egret.TouchEvent) {
        let panel = new eui.Panel();
        panel.title = "提示";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        let content = new egret.TextField();
        content.text = "充钱也不会变强";
        content.y = 100;
        content.x = 100;
        content.textAlign = "center";
        content.textColor = 0;
        panel.addChild(content);
        panel.x = 350;
        panel.y = this.stage.height / 2 - 50;
        this.addChild(panel);
    }

}