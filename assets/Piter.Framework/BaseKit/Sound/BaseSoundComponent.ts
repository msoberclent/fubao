import { Asset, AudioClip, Component, _decorator } from "cc";
import { LocalStorageData } from "../Data/LocalStorageData";

export const SOUND_KEY = {
    MUSIC_VOMULE: "MUSIC_VOMULE_SLO",
    EFFECT_VOMULE: "EFFECT_VOMULE_SLO"
}

export var SOUND_CONST_URL = {
    CLICK_BTN: "",
    CLOSE_BTN: "game_common/res/slots/sound/button2"
}

export class BaseSoundComponent extends Component {

    /**
     * 声音值0-1
     */
    protected _musicVolume: number = 1;

    /**
     * 特效值0-1
     */
    protected _effectVolume: number = 1;


    start() {
        this.init();
    }

    public init() {
        let music: string = LocalStorageData.getItem(SOUND_KEY.MUSIC_VOMULE, true);
        if (music) {
            this._musicVolume = Number(music);
        }
        let effect: string = LocalStorageData.getItem(SOUND_KEY.EFFECT_VOMULE, true);
        if (effect) {
            this._effectVolume = Number(effect);
        }
    }

}