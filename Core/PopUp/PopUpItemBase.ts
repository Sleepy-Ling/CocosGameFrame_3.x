import { _decorator, Component, Label, tween, Vec2, v2, v3 } from "cc";
import IRecoverObject from "../GameObjects/IRecoverObject";


const { ccclass, property } = _decorator;

export class PopUpItemBaseParam {
    closeCallBack: Function;
}

@ccclass
export default class PopUpItemBase extends Component implements IRecoverObject {
    @property(Label)
    label: Label = null;

    param: PopUpItemBaseParam;

    public show(str: string, duration: number, param: PopUpItemBaseParam) {
        this.label.string = str;
        this.param = param;

        this.scheduleOnce(() => { this.onShowEnd(param.closeCallBack); }, duration);
        this.onShowStart(param);
    }

    /**开始展示 */
    protected onShowStart(param: PopUpItemBaseParam) {
        let t = tween(this.node);
        t.set({ scale: v3() }).to(0.1, { scale: v3(1, 1, 1) });

        t.start();
    }

    /**结束展示 */
    protected onShowEnd(endCallBack: Function) {
        let t = tween(this.node);
        t.to(0.1, { scale: v3(0, 0, 0) }).call(() => {
            if (endCallBack) {
                endCallBack();
            }
        });

        t.start();
    }

    public close() {
        this.unscheduleAllCallbacks();

    }

    onRecover(): boolean {
        this.unscheduleAllCallbacks();

        this.node.setParent(null);

        return true;
    }


}
