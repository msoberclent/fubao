import { _decorator, Component, Node } from "cc";
import Global from "../../PiterGlobal";
/**
 * 声音按钮组件(包含 特效和音乐)
 */
const { ccclass, property } = _decorator;
@ccclass('SocketDebugNode')
export class SocketDebugNode extends Component {

    start(){
        
    }

    public onTouch() {
        Global.SOCKET.disConnectAndReconnect();
    }

}