/**
 * 通信模块
 */
class WebSocketManager extends egret.DisplayObjectContainer {

    public static readonly Instance: WebSocketManager = new WebSocketManager();

    public success: boolean = false;
    private text: egret.TextField;

    private constructor() {
        super();
        this.text = new egret.TextField;
        this.text.textColor = 0xff0000;
        this.addChild(this.text);
        this.initWebSocket();
    }

    public socket: egret.WebSocket;

    private initWebSocket(): void {
        //创建 WebSocket 对象
        this.socket = new egret.WebSocket();
        //设置数据格式为二进制，默认为字符串
        this.socket.type = egret.WebSocket.TYPE_BINARY;
        //添加收到数据侦听，收到数据会调用此方法
        //this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        //添加链接打开侦听，连接成功会调用此方法
        this.socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        //添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
        this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        //添加异常侦听，出现异常会调用此方法
        this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        //连接服务器
        // this.socket.connectByUrl("ws://localhost:8080/websocket");
        this.socket.connectByUrl("ws://101.200.42.121:8088/websocket");
    }

    /**
     * 发送一个json对象
     */
    public sendData(obj): void {
        //创建 ByteArray 对象
        var byte: egret.ByteArray = new egret.ByteArray();
        var msg = obj;
        byte.writeUTFBytes(JSON.stringify(msg));
        byte.position = 0;
        var msg2: string = byte.readUTFBytes(byte.bytesAvailable);
        //egret.log(msg2);
        //发送数据
        this.socket.writeBytes(byte, 0, byte.bytesAvailable);
    }

    private onSocketOpen(): void {
        this.trace("WebSocketOpen");
        this.success = true;
        // this.text.textFlow=(new egret.HtmlTextParser).parser("<strong>连接状态</strong>");
        this.text.text = "连接状态" + this.success + "";
    }

    private onSocketClose(): void {
        this.trace("WebSocketClose");
        this.success = false;
        this.text.text = "连接状态" + this.success + "";
    }

    private onSocketError(): void {
        this.trace("WebSocketError");
        this.success = false;
        this.text.text = "连接状态" + "传输错误" + "";
    }

    private onReceiveMessage(e: egret.Event): void {
        //创建 ByteArray 对象
        var byte: egret.ByteArray = new egret.ByteArray();
        //读取数据
        this.socket.readBytes(byte);
        //读取字符串信息
        var msg: string = byte.readUTFBytes(byte.bytesAvailable);
        this.trace("收到数据:");
        this.trace("readUTF : " + msg);
    }

    private trace(msg: any): void {
        // egret.log(msg);
    }

    public bindOnReceiveMessage(e_callback: Function, obj) {
        this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, e_callback, obj);
    }
}