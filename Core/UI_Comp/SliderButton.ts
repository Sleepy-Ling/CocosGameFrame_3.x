// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Button, Component, find, Vec3, Enum, Tween, Node, EventHandler, tween, CCBoolean } from "cc";


enum SliderButtonTrasitionType {
    None,
    Move,
}

const { ccclass, property, menu, executeInEditMode, requireComponent } = _decorator;

@ccclass
@menu("Core/UI_Comp/SliderButton")
// @executeInEditMode
@requireComponent(Button)
export default class SliderButton extends Component {
    private _icon_on: Node = null;
    @property(Node)
    public get icon_on(): Node {
        if (this._icon_on == null) {
            this._icon_on = find("on", this.node);
        }
        return this._icon_on;
    }
    public set icon_on(value: Node) {
        this._icon_on = value;
    }

    private _icon_off: Node = null;
    @property(Node)
    public get icon_off(): Node {
        if (this._icon_off == null) {
            this._icon_off = find("off", this.node);
        }
        return this._icon_off;
    }
    public set icon_off(value: Node) {
        this._icon_off = value;
    }

    protected on_position: Vec3;
    protected off_position: Vec3;

    private _isOn: boolean = true;
    public get isOn(): boolean {
        return this._isOn;
    }
    @property(CCBoolean)
    public set isOn(value: boolean) {
        this._isOn = value;
        this.doTransition();
    }

    private _btn: Button = null;
    @property(Button)
    public get btn(): Button {
        if (this._btn == null) {
            this._btn = this.getComponent(Button);
        }
        return this._btn;
    }

    protected tweenMoveTime: number = 0.2;

    clickCallBack: Function = null;

    @property({ type: Enum(SliderButtonTrasitionType), tooltip: "过渡类型" })
    transitionType: SliderButtonTrasitionType = SliderButtonTrasitionType.None;

    protected onLoad(): void {
        let btn = this.btn;
        const handler: EventHandler = new Component.EventHandler();
        handler.component = "SliderButton";
        handler.handler = "onClick";
        handler.target = this.node;

        btn.clickEvents.push(handler);

        if (this.icon_on) {
            this.on_position = this.icon_on.position.clone();
        }

        if (this.icon_off) {
            this.off_position = this.icon_off.position.clone();
        }
    }

    onClick() {
        this.isOn = !this.isOn;

        if (this.clickCallBack) {
            this.clickCallBack(this.isOn);
        }
    }

    doTransition() {
        if (this.icon_off == null || this.icon_on == null) {
            return false;
        }

        if (this.transitionType == SliderButtonTrasitionType.Move) {
            let from: Vec3;
            let to: Vec3;

            this.icon_off.active = !this.isOn;
            this.icon_on.active = this.isOn;
            let target: Node;
            if (this.isOn) {
                target = this.icon_on;
                from = this.off_position;
                to = this.on_position;
            }
            else {
                target = this.icon_off;
                from = this.on_position;
                to = this.off_position;
            }

            Tween.stopAllByTarget(target);

            target.setPosition(from);
            let ntween = tween<Node>(target);
            ntween.to(this.tweenMoveTime, { position: to }).call(this.onDoTransitionFinished).start();
        }
        else {
            this.icon_off.active = !this.isOn;
            this.icon_on.active = this.isOn;

        }

        return true;
    }

    protected onDoTransitionFinished(target: Node) {
        // console.log("onDoTransitionFinished");

    }

    resetInEditor(): void {
        this.isOn = true;
        this.clickCallBack = null;

        this.btn.clickEvents = [];
    }

}
