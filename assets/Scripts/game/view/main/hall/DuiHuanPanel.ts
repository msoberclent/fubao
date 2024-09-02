import { EditBox, _decorator } from 'cc';
import { PiterDirector } from '../../../../../Piter.Framework/PiterDirector';
import Global from '../../../../../Piter.Framework/PiterGlobal';
import PiterPanel from '../../../../../Piter.Framework/UIKit/Base/PiterPanel';
import { DefaultToast } from '../../../../../Piter.Framework/UIKit/Example/DefaultToast';
import { ServerConfig } from '../../../constant/ServerConst';
const { ccclass, property } = _decorator;

@ccclass('DuiHuanPanel')
export class DuiHuanPanel extends PiterPanel {
    protected static prefabUrl = "hall/prefabs/DuiHuanPanel";

    protected static className = "DuiHuanPanel";

    @PiterDirector.AUTO_BIND(EditBox)
    AT_input3: EditBox = null;

    callfun = null;
    public createChildren(): void {
        super.createChildren();
    }
    AT_closeBtnTouch() {
        Global.UI.closeView(DuiHuanPanel);
    }

    async AT_EnterBtnTouch() {
        let str = this.AT_input3.string.trim();
        if (str != "") {
            let data = await Global.HTTP.sendRequestAsync(ServerConfig.PATH_CONFIG.http_server + `/api/gate/activity-prize-exchange`, {
                code: str
            });
            if (data.code == 200) {
                DefaultToast.instance.showText("申请成功",data.msg);
                this.AT_closeBtnTouch();
            } else {
                DefaultToast.instance.showText(data.msg);
            }
        } else {
            DefaultToast.instance.showText("请输入彩金码");
        }
    }

}