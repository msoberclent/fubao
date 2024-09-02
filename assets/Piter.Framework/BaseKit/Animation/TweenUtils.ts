import { Node, tween, UIOpacity, v3, Vec2, Vec3 } from 'cc';
import { Callback } from '../Data/Callback';

export class TweenUtils {
    /** 环形旋转 */
    public static circleRotation(target: Node, timed: number) {
        tween(target)
            .by(timed, { eulerAngles: new Vec3(0, 0, -360) })
            .repeatForever()
            .start();
    }
    public static blink(target: Node, timed: number) {
        let uiOpacity = target.getComponent(UIOpacity)
        if (!uiOpacity) {
            uiOpacity = target.addComponent(UIOpacity);
        }
        tween(uiOpacity).repeatForever(tween().to(timed, { opacity: 0 })
            .to(timed, { opacity: 255 }))
            .start();
    }


    /** 淡入动画 */
    public static fadeIn(target: Node, finish: Callback, timed: number) {
        target.getComponent(UIOpacity).opacity = 0;
        tween(target.getComponent(UIOpacity))
            .to(timed, { opacity: 255 })
            .call(() => {
                finish && finish.callback();
            })
            .start();
    }

    /** 淡出动画 */
    public static fadeOut(target: Node, finish: Function, timed: number, opacity: number = 0) {
        tween(target.getComponent(UIOpacity))
            .to(timed, { opacity: opacity })
            .call(() => {
                finish && finish();
            })
            .start();
    }

    /** 震屏效果 */
    public static createShockEff(layer: Node, times: number, strength: number = 1) {
        if (!layer) {
            return;
        }

        let pre = layer.position;

        let action = tween().sequence(tween().by(0.05, { position: v3(2 * strength, 2 * strength, 0) }), tween().by(0.1, { position: v3(-4 * strength, -4 * strength, 0) }), tween().by(0.05, { position: v3(2 * strength, 2 * strength, 0) }));

        const repeat = tween(layer).repeat(times, action);
        const checkEnd = tween().call(() => {
            layer.position = pre;
        });
        repeat.then(checkEnd).start();
    }

    /** 文字抖动 */
    public static scalePop(node: Node, timed: number) {
        tween(node)
            .to(timed + 0.1, { scale: new Vec3(0.7, 0.7, 0.7) })
            .to(timed - 0.1, { scale: new Vec3(0.6, 0.6, 0.6) })
            .start();
    }

    /** 呼吸动画 */
    public static breath(node: Node, min = 0.9, max = 1.1, time: number = 0.6) {
        tween(node)
            .repeatForever(tween().sequence(tween().to(time, { scale: new Vec3(max, max, max) }), tween().to(time, { scale: new Vec3(min, min, min) })))
            .start();
    }

    /** 呼吸动画 */
    public static bigScale(node: Node, min = 0.9, max = 1.1, time = 0.6) {
        tween(node)
            .repeatForever(tween().sequence(tween().to(time, { scale: new Vec3(max, max, max) }), tween().to(time, { scale: new Vec3(min, min, min) })))
            .start();
    }

    /** 呼吸动画 */
    public static buttonScale(node: Node, time = 0.05, scaleBili = 0.1) {
        let curScale = node.scale.x;
        tween(node)
            .to(time, { scale: new Vec3(curScale + scaleBili, curScale + scaleBili, curScale + scaleBili) })
            .to(time, { scale: new Vec3(curScale, curScale, curScale) }).start();
    }


    /**
 *  二阶贝塞尔曲线 运动
 * @param target
 * @param {number} duration
 * @param {} c1 起点坐标
 * @param {} c2 控制点
 * @param {Vec3} to 终点坐标
 * @param opts
 * @returns {any}
 */
    public static bezierTo(target: any, duration: number, c1: Vec3, c2: Vec3, to: Vec3, opts: any) {
        opts = opts || Object.create(null);
        /**
         * @desc 二阶贝塞尔
         * @param {number} t 当前百分比
         * @param {} p1 起点坐标
         * @param {} cp 控制点
         * @param {} p2 终点坐标
         * @returns {any}
         */
        let twoBezier = (t: number, p1: Vec3, cp: Vec3, p2: Vec3) => {
            let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
            let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
            return v3(x, y, 0);
        };
        opts.onUpdate = (arg: Vec3, ratio: number) => {
            target.position = twoBezier(ratio, c1, c2, to);
        };
        return tween(target).to(duration, {}, opts);
    }
}
