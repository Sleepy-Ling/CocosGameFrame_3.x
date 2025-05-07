
import { Animation, AnimationState, _decorator } from 'cc';
 
import { ViewBase, ViewParamBase } from './ViewBase';
import AnimCtrl from '../../Controller/AnimCtrl';
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
    protected animCtrl: AnimCtrl;

    public firstInitView(param?: T): Promise<boolean> {
        if (!this.anim) {
            this.anim = this.getComponent(Animation);
        }

        this.animCtrl = new AnimCtrl();
        this.animCtrl.init(this.node);

        return super.firstInitView(param);
    }

    public onViewOpen(param: T): void {
        super.onViewOpen(param);

        this.switchState = Enum_SwitchViewState.Normal;
        if (this.anim) {
            // this.anim.targetOff(this);
            // this.anim.on(Animation.EventType.FINISHED, this._onSwitchAnimFinished, this);
            // this.anim.play(this.openViewAnimName);
            this.animCtrl.playOnce(this.openViewAnimName, null, this._onSwitchAnimFinished.bind(this));

            this.switchState = Enum_SwitchViewState.Opening;
        }

    }

    /**播过过渡动画后 */
    private _onSwitchAnimFinished(tag: string, animationState: AnimationState) {
        if (animationState == null) {
            if (this.switchState == Enum_SwitchViewState.Opening) {
                this.onOpenFinish();
            }
            else if (this.switchState == Enum_SwitchViewState.Closing) {
                this.onCloseFinish();
            }
        }
        else if (animationState.name == this.openViewAnimName) {
            this.onOpenFinish();

        }
        else if (animationState.name == this.closeViewAnimName) {
            this.onCloseFinish();
        }

    }

    /**打开过渡动画播放完成 */
    protected onOpenFinish() {
        console.log("onOpenFinish", this.node.name);
        this.switchState = Enum_SwitchViewState.Normal;
    }

    /**关闭过渡动画播放完成 */
    protected onCloseFinish() {
        console.log("onCloseFinish", this.node.name);
        this.switchState = Enum_SwitchViewState.Normal;
        super.closeSelf();
    }

    protected onClickClose(): void {
        if (this.switchState != Enum_SwitchViewState.Normal) {
            return;
        }

        this.switchState = Enum_SwitchViewState.Closing;

        if (this.anim) {
            // this.anim.play(this.closeViewAnimName);
            this.animCtrl.playOnce(this.closeViewAnimName, null, this._onSwitchAnimFinished.bind(this));
        }
        else {
            this.onCloseFinish();
        }
    }

}