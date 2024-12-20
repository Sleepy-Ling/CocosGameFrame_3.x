// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { Animation, _decorator } from "cc";
import CommonButton from "./CommonButton";

const { ccclass, property } = _decorator;

@ccclass
export default class AnimCommonButton extends CommonButton {
    @property(Animation)
    anim: Animation = null;
}
