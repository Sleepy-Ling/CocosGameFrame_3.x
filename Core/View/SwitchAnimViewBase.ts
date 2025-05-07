
import { Animation, AnimationState, _decorator } from 'cc';
import { ViewBase, ViewParamBase } from './ViewBase';
const { ccclass, property, menu } = _decorator;

export enum Enum_SwitchViewState {
    Opening,
    Normal,
    Closing,
}

export class SwitchAnimViewInitParam extends ViewParamBase {

}

/**具有切换动画界面基类 */
@ccclass()
@menu("View/SwitchAnimViewBase")
export class SwitchAnimViewBase<T extends SwitchAnimViewInitParam> extends ViewBase<T> {
    protected anim: Animation;
    protected openViewAnimName: string = "OpenViewAnim";
    protected closeViewAnimName: string = "CloseViewAnim";
    protected switchState: Enum_SwitchViewState;

    public firstInitView(param?: T): Promise<boolean> {
        if (!this.anim) {
            this.anim = this.getComponent(Animation);


        }

        return super.firstInitView(param);
    }

    public onViewOpen(param: T): void {
        super.onViewOpen(param);

        if (this.anim) {
            this.anim.targetOff(this);
            this.anim.on(Animation.EventType.FINISHED, this._onSwitchAnimFinished, this);
            this.anim.play(this.openViewAnimName);

            this.switchState = Enum_SwitchViewState.Opening;
        }

    }

    /**播过过渡动画后 */
    private _onSwitchAnimFinished(tag: string, animationState: AnimationState) {
        if (animationState.name == this.openViewAnimName) {
            this.onOpenFinish();

        }

        if (animationState.name == this.closeViewAnimName) {
            this.onCloseFinish();
        }

    }

    /**打开过渡动画播放完成 */
    protected onOpenFinish() {
        console.log("onOpenFinish", this.node.name);

    }

    /**关闭过渡动画播放完成 */
    protected onCloseFinish() {
        console.log("onCloseFinish", this.node.name);

        super.closeSelf();
    }

    protected onClickClose(): void {
        this.switchState = Enum_SwitchViewState.Closing;

        if (this.anim) {
            this.anim.play(this.closeViewAnimName);
        }
        else {
            this.onCloseFinish();
        }
    }

}