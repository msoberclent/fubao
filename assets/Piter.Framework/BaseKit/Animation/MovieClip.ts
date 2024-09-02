import { CCBoolean, Component, Enum, Sprite, SpriteAtlas, SpriteFrame, tween, _decorator } from "cc";
import Global from "../../PiterGlobal";
import { BaseEvent } from "../Constant/BaseEvent";
import { Callback } from "../Data/Callback";
import { HashMap } from "../Data/HashMap";

/**
 * 序列帧
 */
const { ccclass, property } = _decorator;

export enum MovieClipFrameType {
    ALATAS, //图集
    PICTURE //散图
}

Enum(MovieClipFrameType);


@ccclass("MovieClip")
export class MovieClip extends Component {

    @property({ type: Sprite, tooltip: "帧动画合图" })
    sprite: Sprite;

    /**
     * 动画Map
     */
    private mcMap: HashMap<string, SpriteFrame[]> = new HashMap();

    /**
     * 回调Map
     */
    private funcMap: HashMap<string, Callback> = new HashMap();

    @property({
        type: SpriteAtlas, tooltip: "帧动画合图", visible: function () {
            return this.frameType == MovieClipFrameType.ALATAS;
        }
    })
    protected atlas: SpriteAtlas | null = null;

    /**
     * 当前使用的序列帧图
     */
    @property({
        type: [SpriteFrame], tooltip: "帧动画散图", visible: function () {
            return this.frameType == MovieClipFrameType.PICTURE;
        }
    })
    public spriteFrames: SpriteFrame[] = [];

    /**
     * 播放的集合
     */
    private runningFrames: SpriteFrame[] = [];

    @property({ type: MovieClipFrameType })
    protected frameType: MovieClipFrameType = MovieClipFrameType.ALATAS;

    /**
     * 帧数
     */
    @property
    frame: number = 24;

    /**
    * 帧数
    */
    @property({ type: CCBoolean })
    playOnLoad: boolean = true;


    @property({ type: CCBoolean })
    playOnEditor: boolean = false;

    /**
     * 播放次数
     */
    private playTimes: number;

    /**
     * 当前播放第几张
     */
    private currentIndex = 0;

    /**
     * 是否在运行中
     */
    private running: boolean = false;

    /**
     * 当前播放动画名
     */
    private currentMovieName: string;


    private lastFrameTime: number;

    @property({
        type: Boolean,
        tooltip: '是否在播放结束隐藏动画'
    })
    public playOnHide: boolean = false;

    @property({
        type: Boolean,
        tooltip: '初始隐藏动画'
    })
    public loadToHide: boolean = false;
    finishCall: Function;
    startCheck() {

    }

    public onLoad() {
        this.addMovieMcByFrames("default", this.spriteFrames, null);
        if (this.playOnLoad) {
            this.play("default", -1);
        }
        this.node.active = !this.loadToHide
    }

    /**
     * 播放动画
     * @param movieName 动画名称
     * @param times 播放次数 <=0 则为无限循环
     * @param finishCall 播放完成动画
     */
    public play(movieName = "default", times: number = 1, finishCall?: Function) {
        if (this.currentMovieName == movieName) {
            return;
        }
        this.finishCall = finishCall;
        let spriteFrames = this.mcMap.get(movieName);
        if (!spriteFrames) {
            if (movieName == "default") {
                this.addMovieMcByFrames("default", this.spriteFrames, null);
            } else {
                console.error(`animation error ${movieName}`);
                return;
            }
        }
        this.node.active = true;
        this.currentIndex = 0;
        this.currentMovieName = movieName
        this.runningFrames = spriteFrames
        if (times == 0) {
            times = -1;
        }
        this.playTimes = times;
        this.running = true;
    }

    public update(dt: number) {
        if (this.running) {
            if (Date.now() - this.lastFrameTime < (1000 / this.frame)) {
                return;
            }
            this.currentIndex++;
            if (this.currentIndex >= this.runningFrames.length) {
                this.doOncePlayOver();
            }
            this.lastFrameTime = Date.now();
            if (this.running) {
                this.setSpriteFrame(this.currentIndex);
                if (this.node.name.indexOf('_bf') != -1) {  //前置动画处理
                    Global.EVENT.dispatchEvent(BaseEvent.SKILL_ANIM_CHANGE, {
                        idx: this.currentIndex,
                        animName: this.node.name
                    });
                }
            }
        }
    }

    public pause() {
        this.running = false;
    }

    public remuse() {
        this.running = true;
    }

    /**
     * 一次播放完成
     */
    private doOncePlayOver() {
        this.currentIndex = 0;
        if (this.playTimes != -1) {
            this.playTimes--;
            if (this[`onPlayOnce`]) {
                //抛出播放一次的事件
                this[`onPlayOnce`](this.currentMovieName);
            }
            if (this.playTimes <= 0) {
                if (this.onPlayOver) {
                    //抛出播放完成的事件
                    this.onPlayOver(this.currentMovieName);
                }
                this.running = false;
                this.currentMovieName = null;
            }
        }
    }

    onPlayOver(name) {
        if (this.playOnHide) {
            this.currentMovieName = null;
            this.node.active = false;
        }
        this.finishCall && this.finishCall();
    }

    onPlayOnce(name) {

    }

    private setSpriteFrame(index) {
        this.sprite.spriteFrame = this.runningFrames[index];
    }

    /**
   * 添加动画资源
   * @param name 
   */
    public addMovieMcByFrames(moveMcName: string, spriteFrames: SpriteFrame[], overCallback: Callback) {
        this.mcMap.put(moveMcName, spriteFrames);
        this.funcMap.put(moveMcName, overCallback);
    }


    private editorInterval;

    onLostFocusInEditor() {
        if (this.editorInterval) {
            clearInterval(this.editorInterval);
        }
    }

    onFocusInEditor() {
        if (CC_EDITOR && this.playOnEditor) {
            if (!this.sprite || this.spriteFrames!.length < 2) {
                return;
            }
            this.runningFrames = this.spriteFrames;
            let index = 0;
            this.sprite.spriteFrame = this.spriteFrames[index];
            this.editorInterval = setInterval(() => {
                this.setSpriteFrame(index);
                index++
                if (index > this.spriteFrames.length - 1) {
                    index = 0;
                }
            }, 1000 / this.frame);
        }
    }
}
