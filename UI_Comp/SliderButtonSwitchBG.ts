import { _decorator, Sprite, find, tween } from "cc";
import SliderButton from "./SliderButton";

const { ccclass, property, menu, executeInEditMode, requireComponent } = _decorator;

@ccclass
@menu("Core/UI_Comp/SliderButtonSwitchBG")
export default class SliderButtonSwitchBG extends SliderButton {
    private _bg_on: Sprite = null;
    @property(Sprite)
    public get bg_on(): Sprite {
        if (this._bg_on == null) {
            this._bg_on = find("bg_on", this.node).getComponent(Sprite);
        }
        return this._bg_on;
    }
    public set bg_on(value: Sprite) {
        this._bg_on = value;
    }

    private _bg_off: Sprite = null;
    @property(Sprite)
    public get bg_off(): Sprite {
        if (this._bg_off == null) {
            this._bg_off = find("bg_off", this.node).getComponent(Sprite);
        }
        return this._bg_off;
    }
    public set bg_off(value: Sprite) {
        this._bg_off = value;
    }

    public doTransition(): boolean {
        let succ = super.doTransition();

        if (!this.bg_on || !this.bg_off) {
            return false;
        }
        else {
            let EndRange: number = this.isOn ? 1 : 0;
            this.bg_on.fillRange = 1 - EndRange;
            let ntween = tween(this.bg_on);
            ntween.to(this.tweenMoveTime, { fillRange: EndRange }).start();

        }

        return succ;
    }
}