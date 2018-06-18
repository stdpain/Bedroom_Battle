/**
 * 场景管理器
 * 单例
 * 用于切换场景
 */

class SceneManager {

    public static readonly Instance: SceneManager = new SceneManager();
    public static readonly SCREEN_WIDTH = 1136;
    public static readonly SCREEN_HEIGHT = 640;
    public rootStage: egret.DisplayObjectContainer;
    public indexScene: egret.DisplayObjectContainer;
    public battleScene: egret.DisplayObjectContainer;
    public battleMain: egret.DisplayObjectContainer;

    private constructor() {

    }

}