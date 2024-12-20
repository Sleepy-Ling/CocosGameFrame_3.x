// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Label, Component } from "cc";

const { ccclass, property, requireComponent, menu } = _decorator;

@ccclass
@menu("UI_Func/RollingNumber")
@requireComponent(Label)
export default class RollingNumber extends Component {

    @property(Label)
    private _label: Label = null;
    public get label(): Label {
        if (!this._label) {
            this._label = this.node.getComponent(Label);
        }
        return this._label;
    }
    public set label(value: Label) {
        this._label = value;
    }

    protected finishCallBack: Function;
    protected isRolling: boolean;
    protected duration: number;
    protected startValue: number;
    protected endValue: number;
    protected difference: number;

    protected curValue: number;
    protected elapsedTime: number;
    protected fractionDigits: number;

    protected update(dt: number): void {
        if (this.isRolling) {
            this.elapsedTime += dt;

            if (this.elapsedTime >= this.duration) {
                this.stopRolling();
            }
            else {
                let r = this.elapsedTime / this.duration;

                this.curValue = this.startValue + this.difference * r;
                this.label.string = this.curValue.toFixed(this.fractionDigits);
            }
        }
    }

    /**
     * 开始数字滚动
     * @param from 开始数值
     * @param to 目标数值
     * @param duration 滚动时长
     * @param fractionDigits 显示的小数位个数
     * @param finishCallBack 完成回调
     */
    startRollTo(from: number, to: number, duration: number = 0.5, fractionDigits: number = 0, finishCallBack: Function = null) {
        if (this.isRolling) {
            this.stopRolling();
        }

        this.startValue = from;
        this.endValue = to;
        this.duration = duration;
        this.fractionDigits = fractionDigits;
        this.finishCallBack = finishCallBack;

        this.curValue = from;
        this.difference = to - from;

        this.elapsedTime = 0;

        this.isRolling = true;

        this.label.string = from.toString();
    }

    /**
     * 停止滚动
     * @description 停止数字滚动，并且显示最终值，调用回调
     */
    stopRolling() {
        this.isRolling = false;

        if (this.endValue != null) {
            this.label.string = this.endValue.toFixed(this.fractionDigits);

        }
        if (this.finishCallBack) {
            this.finishCallBack();

            this.finishCallBack = null;
        }
    }

    getIsRolling() {
        return this.isRolling;
    }

    setValue(v: number) {
        this.label.string = v.toString();
    }
}