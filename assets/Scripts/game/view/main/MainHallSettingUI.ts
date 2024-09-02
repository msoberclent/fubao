import { Label, Node, Slider, Sprite, _decorator } from "cc";
import { LocalStorageData } from "../../../../Piter.Framework/BaseKit/Data/LocalStorageData";
import { PiterDirector } from "../../../../Piter.Framework/PiterDirector";
import Global from "../../../../Piter.Framework/PiterGlobal";
import { WebGameUtils } from "../../../webutils/WebGameUtils";
import { GameLoginView } from "../login/GameLoginView";
import { ScrollToLeftInPanel } from "../panel/ScrollToLeftInPanel";

const { ccclass, property } = _decorator;

@ccclass('MainHallSettingUI')
export class MainHallSettingUI extends ScrollToLeftInPanel {
    protected static prefabUrl = "common/prefabs/MainHallSettingUI";

    protected static className = "MainHallSettingUI";
    
    @PiterDirector.AUTO_BIND(Sprite)
    AT_MusicSprite: Sprite

    @PiterDirector.AUTO_BIND(Slider)
    AT_musicSlider: Slider

    @PiterDirector.AUTO_BIND(Sprite)
    AT_EffectSprite: Sprite

    @PiterDirector.AUTO_BIND(Slider)
    AT_EffectSlider: Slider

    // @PiterDirector.AUTO_BIND(Node)
    // AT_switchAccBtn: Node;

    @PiterDirector.AUTO_BIND(Label)
    AT_ClientVersionLabel: Label;

    @PiterDirector.AUTO_BIND(Node)
    AT_Full: Node;

    @PiterDirector.AUTO_BIND(Node)
    AT_FullScreenBtn: Node;

    public createChildren(): void {
        super.createChildren();
        let musicValue = Global.SOUND.musicVolume;
        this.AT_MusicSprite.fillRange = this.AT_musicSlider.progress = musicValue;
        let effectValue = Global.SOUND.effectVolume;
        this.AT_EffectSprite.fillRange = this.AT_EffectSlider.progress = effectValue;
        // if (this.paramsData.hideSwitch) {
        //     this.AT_switchAccBtn.active = false;
        // }
        this.AT_Full.active = false;
        // if (sys.isBrowser) {
        //     if (sys.isMobile) {
        //         if (sys.os == sys.OS.ANDROID) {
        //             this.AT_Full.active = true;
        //         }
        //     } else {
        //         this.AT_Full.active = true;
        //     }
        // }
        this.AT_ClientVersionLabel.string = Global.VERSION.CLIENT;
    }

    onMusicSliderMove(e) {
        this.AT_MusicSprite.fillRange = this.AT_musicSlider.progress;
        Global.SOUND.musicVolume = this.AT_musicSlider.progress;
    }

    onEffectSliderMove(e) {
        this.AT_EffectSprite.fillRange = this.AT_EffectSlider.progress;
        Global.SOUND.effectVolume = this.AT_EffectSlider.progress;
    }

    AT_closeBtnTouch(): void {
        Global.UI.closeView(MainHallSettingUI);
    }

    AT_ComfirmBtnTouch() {
        Global.UI.closeView(MainHallSettingUI);
    }

    AT_switchAccBtnTouch() {
        Global.PLAYER.clearPlayerData();
        LocalStorageData.removeItem("user_token");
        Global.SOCKET.isDingHao = true;
        Global.SOCKET.disConnect(false);
        Global.UI.closeAllView();
        Global.UI.openView(GameLoginView, { reload: false });
    }

    AT_FullScreenBtnTouch() {
        // this.AT_FullScreenBtn.getComponent(ToggleButtonComponent).changeStatus()
        WebGameUtils.windowFullscreen();
    }
}