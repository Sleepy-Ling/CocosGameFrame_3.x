// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Button, Component, Label, Sprite } from "cc";

const { ccclass, property, requireComponent, menu } = _decorator;

@ccclass
@requireComponent(Button)
@menu("Core/UI_Comp/CommonButton")
export default class CommonButton extends Component {
    private _btn: Button = null;
    @property(Button)
    public get btn(): Button {
        if (this._btn == null) {
            this._btn = this.getComponent(Button);
        }
        return this._btn;
    }

    @property(Label)
    public label: Label = null;

    @property(Sprite)
    public bg: Sprite = null;

    @property(Sprite)
    icon: Sprite = null;
}
