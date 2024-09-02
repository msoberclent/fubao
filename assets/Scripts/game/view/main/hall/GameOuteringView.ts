
const { ccclass, property } = _decorator;

import { Node, UIOpacity, _decorator, game, sys } from "cc";
import { LogUtils } from "../../../../../Piter.Framework/BaseKit/Util/LogUtils";
import { PiterDirector } from "../../../../../Piter.Framework/PiterDirector";
import Global from "../../../../../Piter.Framework/PiterGlobal";
import PiterPanel from "../../../../../Piter.Framework/UIKit/Base/PiterPanel";
import { DefaultAlertView } from "../../../../../Piter.Framework/UIKit/Example/DefaultAlertView";
import { WebGameUtils } from "../../../../webutils/WebGameUtils";
import { ServerConfig } from "../../../constant/ServerConst";


@ccclass('GameOuteringView')
export class GameOuteringView extends PiterPanel {
    protected static prefabUrl = "hall/prefabs/GameOuteringView";

    protected static className = "GameOuteringView";

    lockReq: any;

    @PiterDirector.AUTO_BIND(Node)
    AT_CloseBtn: Node = null;

    public createChildren() {
        super.createChildren();
        if (sys.isNative) {
            this.AT_CloseBtn.active = false;
        }
        Global.IN_OUTER = true;
    }

    public onAdded() {
        super.onAdded();
        Global.EVENT.on(`exit_subgame`, this.onExitSubGame, this)
    }

    public onRemoved() {
        super.onRemoved();
        Global.EVENT.off(`exit_subgame`, this.onExitSubGame, this)
    }

    onExitSubGame() {
        if (sys.isNative) {
            this.node.getChildByName("maskNode").getComponent(UIOpacity).opacity = 0;
            this.AT_CloseBtnTouch();
        }
    }

    closeInnerGames() {
        Global.SOCKET.reConnect();
        Global.UI.closeView(GameOuteringView);
    }

    public closeErrorTimes = 0;
    public async AT_CloseBtnTouch() {
        if (this.lockReq) {
            return;
        }
        let gameId = this.paramsData.gameId;
        LogUtils.logDJ(this.paramsData);
        if (gameId > 100 && gameId < 1000) {
            this.closeInnerGames();
            return;
        }

        this.lockReq = true;
        let path = ServerConfig.PATH_CONFIG.http_server + "/api/connect/close-outer-url"
        let resp = await Global.HTTP.sendRequestAsync(path, {
            uid: this.paramsData.uid,
            gameId: this.paramsData.gameId
            // gameId: 1
        });
        if (resp.code == 200) {
            Global.UI.closeView(GameOuteringView);
        } else {
            this.lockReq = false;
            this.closeErrorTimes++;
            if (this.closeErrorTimes < 3) {
                this.scheduleOnce(() => {
                    this.AT_CloseBtnTouch();
                }, 0.5)
            } else {
                DefaultAlertView.addOnlyAlert(`退出游戏失败(原因:${resp.msg}),请重新进入游戏`, () => {
                    if (sys.isNative) {
                        game.restart();
                    } else {
                        WebGameUtils.flushWindow()
                        this.AT_CloseBtnTouch();
                    }
                })
            }
            // DefaultToast.instance.showText(resp.msg);
        }
    }
}
