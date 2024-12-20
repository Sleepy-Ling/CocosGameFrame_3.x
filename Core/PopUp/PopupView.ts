// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Button, AnimationState, Node, Animation } from "cc";
import { AudioName } from "../../Def/EnumDef";
import { ViewBase, ViewParamBase } from "../View/ViewBase";


const { ccclass, property } = _decorator;

export enum Enum_PopupViewState {
    Opening,
    Normal,
    Closing,
}

/**弹窗类 */
@ccclass
export default class PopupView extends ViewBase {
    protected popupState: Enum_PopupViewState;
    @property(Animation)
    popAnim: Animation = null;
    @property(Button)
    btn_close: Button = null;

    protected btnCompList: Button[] = [];

    protected openAnimName: string = "OpenPopUpView";
    protected closeAnimName: string = "ClosePopUpView";

    public firstInitView(param?: ViewParamBase): Promise<boolean> {
        if (this.btn_close) {
            this.bindBtnClickEvent(this.btn_close, "onClickClose", this.node, this.node.name, null, null, false, AudioName.SwitchViewFinish);
        }

        return super.firstInitView(param);
    }

    public onViewOpen(param: ViewParamBase): void {
        super.onViewOpen(param);

        this.popupState = Enum_PopupViewState.Opening;

        this.popAnim.targetOff(this);
        this.popAnim.on(Animation.EventType.FINISHED, this.onPopAnimFinished, this);

        if (this.openAnimName) {
            this.popAnim.play(this.openAnimName);
        }
        else {
            this.onPopUpFinish();
        }
    }

    protected bindBtnClickEvent(btn: Node | Button, clickFuncName: string, target: Node, compName: string, customEventData: string = "", actionID: number = undefined, clearOldListener: boolean = false, btnClickSound?: AudioName) {
        super.bindBtnClickEvent(btn, clickFuncName, target, compName, customEventData, actionID, clearOldListener, btnClickSound);

        if (btn instanceof Button) {
            if (!this.btnCompList.includes(btn)) {
                this.btnCompList.push(btn);
            }
        }
    }

    protected onClickClose(): void {
        this.popupState = Enum_PopupViewState.Closing;

        for (const btn of this.btnCompList) {
            btn.interactable = false;
        }

        if (this.closeAnimName) {
            this.popAnim.play(this.closeAnimName);
        }
        else {
            this.onPopBackFinish();
        }
    }

    /**弹出动画后 */
    protected onPopAnimFinished(tag: string, animationState: AnimationState) {

        console.log(animationState.name);

        if (animationState.name == this.openAnimName) {
            this.onPopUpFinish();

        }

        if (animationState.name == this.closeAnimName) {
            this.onPopBackFinish();
        }

    }

    /**弹出完成 */
    protected onPopUpFinish() {
        this.popupState = Enum_PopupViewState.Normal;
        this.btnCompList.forEach((btn) => {
            btn.interactable = true;
        })
    }

    /**弹出收回完成 */
    protected onPopBackFinish() {
        super.closeSelf();

        this.btnCompList.forEach((btn) => {
            btn.interactable = true;
        })
    }
}
