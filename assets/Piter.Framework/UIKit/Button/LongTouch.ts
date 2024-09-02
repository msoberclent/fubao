import { Component, EventHandler, EventTouch, Node, _decorator } from "cc";

const { ccclass, property } = _decorator;

/**
 * @classdesc 长按监听组件
 * @author caizhitao
 * @version 0.1.0
 * @since 2018-11-24
 * @description
 *
 * 1. 将本组件挂载在节点上
 * 2. 在属性检查器上设置对应的回调事件
 * 3. 长按挂载的节点，那么就会一直回调第2步中设置的事件
 *
 * @example
 *
 * ```
 *      // 假设第二步回调接受函数为 onTouch() 那么在这个函数的参数如下：
 *
 *      @param touchCounter 本次触摸次数
 *      @param customEventData 在属性检查器中传入进来的 CustomEventData
 *
 *      onTouch(touchCounter: number, customEventData?: any) { }
 *  ```
 */
@ccclass
export default class LongTouch extends Component {

  @property({
    tooltip: "x秒后调用"
  })
  triggerTime: number = 1;

  @property({
    type: [EventHandler],
    tooltip: "回调事件数组，每间隔 ${toucheInterval}s 回调一次"
  })
  longTouchEvents: EventHandler[] = [];

  onEnable() {
    this.node.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
    this.node.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
  }

  onDisable() {
    this.node.off(Node.EventType.TOUCH_START, this._onTouchStart, this);
    this.node.off(Node.EventType.TOUCH_END, this._onTouchEnd, this);
    this.node.off(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
  }

  private _onTouchStart(event: EventTouch) {
    // 这是为了不支持多点触控
    this.scheduleOnce(this._touchCounterCallback, this.triggerTime);
  }

  private _onTouchEnd(event: EventTouch) {
    this.unschedule(this._touchCounterCallback);
  }

  private _onTouchCancel(event: EventTouch) {
    this.unschedule(this._touchCounterCallback);
  }

  private _touchCounterCallback() {
    this.unschedule(this._touchCounterCallback);
    this.publishOneTouch();
  }


  public clearTouchCall(){
    this.unschedule(this._touchCounterCallback);
  }
  /**
   * 通知出去：被点击/触摸了一次，长按时，会连续多次回调这个方法
   */
  private publishOneTouch() {
    this.longTouchEvents.forEach((eventHandler: EventHandler) => {
      eventHandler.emit([this]);
    });
  }
}