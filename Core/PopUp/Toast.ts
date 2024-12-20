// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Vec2, tween } from "cc";
import PopUpItemBase, { PopUpItemBaseParam } from "./PopUpItemBase";




const { ccclass, property } = _decorator;

export class ToastParam extends PopUpItemBaseParam {
    /**世界坐标 */
    position: Vec2;
    offsetY: number;

    tweenTime: number;
}

@ccclass
export default class Toast extends PopUpItemBase {
    param: ToastParam;

    public onShowStart(param: ToastParam) {
    }

    public onShowEnd(endCallBack: Function) {
    }
}
