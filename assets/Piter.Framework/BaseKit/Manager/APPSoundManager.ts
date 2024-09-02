import { AudioClip, AudioSource, Node, _decorator } from "cc";
import Global from "../../PiterGlobal";
import { BaseConstant } from "../Constant/BaseConstant";
import { LocalStorageData } from "../Data/LocalStorageData";
import { BaseSoundComponent, SOUND_KEY } from "../Sound/BaseSoundComponent";


const { ccclass, property } = _decorator;

@ccclass('APPSoundManager')
export class APPSoundManager extends BaseSoundComponent {

    /**
     * 声音播放源
     */
    private music: AudioSource;

    /**
     * 当前声音文件名
     */
    public musicSource: string;

    /**
     * 特效集合
     */
    private effectList: Map<string, AudioSource> = new Map();


    private effectPlayList: Map<string, number> = new Map();


    start() {
        Global.SOUND = this;
        this.init();
        let musicNode = new Node();
        this.music = musicNode.addComponent(AudioSource);
        this.music.volume = this._musicVolume
    }

    public set musicVolume(value) {
        if (this._musicVolume == 0 && value > 0) {
            this._musicVolume = value;
            LocalStorageData.setItem(SOUND_KEY.MUSIC_VOMULE, value + "", true);
            let bg = this.musicSource;
            this.musicSource = null;
            this.playMusic(bg, true);
            return;
        }
        this._musicVolume = value;
        LocalStorageData.setItem(SOUND_KEY.MUSIC_VOMULE, value + "", true);
        // if (this.music) {
        //     this.music.volume = value;
        //     let bg = this.musicSource;
        //     this.musicSource = null;
        //     this.playMusic(bg, true);
        //     return;
        // }
        if (value == 1 && !this.music) {
            this.playMusic(this.musicSource, true);
        } else {
            if (this.music) this.music.volume = value;
        }
    }

    public get musicVolume() {
        return this._musicVolume;
    }

    public set effectVolume(value) {
        this._effectVolume = value;
        LocalStorageData.setItem(SOUND_KEY.EFFECT_VOMULE, value + "", true);
        this.effectList.forEach((effect, key) => {
            effect.volume = value;
        });
    }

    public get effectVolume() {
        return this._effectVolume;
    }

    /**
     * 播放声音
     * @param  {string} musicName
     * @param  {} loop=true
     */
    public playMusic(musicName: string, loop = true) {
        if (!this._musicVolume || this._musicVolume == 0) {
            this.musicSource = musicName;
            return;
        }
        if (musicName) {
            if (this.musicSource == musicName && this.music) {
                return;
            }
            if (this.music) {
                this.music.stop();
            }
            Global.RES.loadAsset(musicName, AudioClip, (sound: AudioClip) => {
                if (sound) {
                    this.music.volume = this._musicVolume
                    this.musicSource = musicName;
                    this.music.clip = sound;
                    this.music.loop = loop;
                    this.music.play();
                }
            })
        }
    }

    public stopMusic() {
        this.musicSource = null, this.music && (this.music.stop(), this.music = null);
    }

    public pauseMusic() {
        if (this.music) {
            this.music.pause();
        }
    }

    public remuseMusic() {
        if (this.music) {
            this.music.play();
        }
    }

    public playEffectByTime(cdTime: number = 2000, effectName, loop = false, volume = this._effectVolume, times: number = 1) {
        let time = this.effectPlayList.get(effectName);
        if (!time || Date.now() - time >= cdTime) {
            this.playEffect(effectName, loop, volume, times)
            this.effectPlayList.set(effectName, Date.now());
        }
    }

    public playEffectPauseMusic(cdTime: number = 2000, effecName, delaytime: number, loop = false, volume = this._effectVolume, times: number = 1) {
        let time = this.effectPlayList.get(effecName);
        let beforeMusciSound = this._musicVolume;
        if (!time || Date.now() - time >= cdTime) {
            this.pauseMusic();
            // this._musicVolume = 0;
            this.playEffect(effecName, loop, volume, times)
            this.effectPlayList.set(effecName, Date.now());
            this.scheduleOnce(() => {
                // this._musicVolume = beforeMusciSound
                this.remuseMusic();
            }, delaytime)
            return true;
        }
        return false;
    }


    /**
     * 播放特效
     * @param  {} effectName
     * @param  {} loop
     * @param  {} volume
     */
    public playEffect(effectName, loop = false, volume = this._effectVolume, times: number = 1) {
        if (BaseConstant.RUNING_BACK || !effectName) {
            return;
        }
        if (!this._effectVolume || this._effectVolume == 0) {
            return;
        }
        let comp_audio = this.effectList.get(effectName);
        if (!comp_audio) {
            let node_audio = new Node();
            comp_audio = node_audio.addComponent(AudioSource);
            this.effectList.set(effectName, comp_audio);
        }
        let playVolue = !volume ? this._effectVolume : volume;
        comp_audio.volume = playVolue;
        comp_audio.loop = loop;
        if (comp_audio.clip) {
            comp_audio.play();
            return;
        }
        Global.RES.loadAsset(effectName, AudioClip, (sound: AudioClip) => {
            comp_audio.clip = sound;
            comp_audio.play();
        })
    }

    /**
     * 停止所有特效
     */
    public stopAllEffects() {
        this.effectList.forEach((value, key) => {
            value.stop();
        });
    }

    /**
     * 停止音效
     */
    public stopEffectByName(effectName) {
        let audio = this.effectList.get(effectName);
        if (audio) {
            audio.stop();
        }
    }
}