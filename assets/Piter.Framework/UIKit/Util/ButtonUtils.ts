import { Button, Sprite, Node } from "cc";
import { Callback } from "../../BaseKit/Data/Callback";
import { ButtonScaleComponent } from "../Component/ButtonScaleComponent";

/*
 * @Author: lixiaodi 
 * @Date: 2020-11-18 11:36:12 
 * @Last Modified by: lixiaodi
 * @Last Modified time: 2021-01-25 15:01:34
 * 按钮工具类
 */
export default class ButtonUtils {

    public static addButtonEffect(components: Button[], thisObj) {
        if (!components || components.length == 0) {
            return;
        }
        for (let i = 0; i < components.length; i++) {
            let button = components[i];
            //存在按下状态
            if (button.name.indexOf("_") == 0) {
                continue;
            }
            let callName = button.name.replace("<Button>", "");
            if (thisObj[`${callName}Touch`]) {
                let comp = button.node.getComponent(ButtonScaleComponent);
                if (!comp) {
                    comp = button.node.addComponent(ButtonScaleComponent)
                }
                comp.addTouchEvent(new Callback(thisObj[`${callName}Touch`], thisObj));
            }
        }
    }

    public static addSpriteButton(components: Sprite[], thisObj) {
        if (!components || components.length == 0) {
            return;
        }
        for (let i = 0; i < components.length; i++) {
            let button = components[i];
            if (button.name.indexOf("Btn") == -1 && button.name.indexOf("btn") == -1) {
                continue
            }
            let callName = button.name.replace("<Sprite>", "");
            if (thisObj[`${callName}Touch`]) {

                let comp = button.node.getComponent(ButtonScaleComponent);
                if (!comp) {
                    comp = button.node.addComponent(ButtonScaleComponent)
                }
                comp.addTouchEvent(new Callback(thisObj[`${callName}Touch`], thisObj));
            }
        }
    }

    public static showDisableImage(button: Button, interactable) {
        button.interactable = interactable;
    }

    /**
     * 锁定按钮
     * @param button 
     * @param isLock 
     */
    public static lockButton(button: Node, isLock: boolean) {
        if (button && button.getComponent(ButtonScaleComponent)) {
            button.getComponent(ButtonScaleComponent).setDisable(isLock);
        }
        if (button && button.getComponent(Button)) {
            button.getComponent(Button).interactable = !isLock;
        }
    }
    /**
     * 按钮设置灰色
     * @param button 
     * @param isGray 
     */
    public static setGray(button: Button | Sprite, isGray: boolean, needLock: boolean = false) {
        if (!button || !button.node) {
            return;
        }
        if (button.node.getComponent(Sprite)) {
            button.node.getComponent(Sprite).grayscale = isGray;
            if (button.node.getComponent(ButtonScaleComponent)) {
                button.node.getComponent(ButtonScaleComponent).setDisable(isGray);
            }
        }
        if (needLock != undefined && button.node.getComponent(Button)) {
            button.node.getComponent(Button).interactable = !isGray;
        }
    }
}