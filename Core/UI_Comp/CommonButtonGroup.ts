// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, SpriteFrame, EventTouch } from "cc";
import CommonButton from "./CommonButton";

const { ccclass, property, menu } = _decorator;

@ccclass
@menu("Core/UI_Comp/CommonButtonGroup")
export default class CommonButtonGroup extends Component {
    protected commonBtns: CommonButton[];

    @property(SpriteFrame)
    protected sf_unselected: SpriteFrame = null;
    @property(SpriteFrame)
    protected sf_selected: SpriteFrame = null;

    protected curSelectIdx: number = -1;
    protected lastSelectIdx: number = -1;
    protected hasFirstInit: boolean = false;

    start() {
        this.init();
    }

    init() {
        if (!this.hasFirstInit) {
            this.commonBtns = this.getComponentsInChildren(CommonButton);
            this.hasFirstInit = true;

            for (const commonBtn of this.commonBtns) {
                let clickEventHandler = new Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "CommonButtonGroup";
                clickEventHandler.handler = "onClickBtn";

                commonBtn.btn.clickEvents.push(clickEventHandler);
            }
        }
    }

    onClickBtn(evt: EventTouch) {
        if (evt.isStopped()) {
            return;
        }

        for (let i = 0; i < this.commonBtns.length; i++) {
            const commonBtn = this.commonBtns[i];

            if (evt.target == commonBtn.node) {
                this.lastSelectIdx = this.curSelectIdx;
                this.curSelectIdx = i;
            }

            commonBtn.bg.spriteFrame = evt.target == commonBtn.node ? this.sf_selected : this.sf_unselected;
        }
    }

    protected updateBtnsSpriteFrameBySelectedIndex(selectedIdx: number) {
        for (let i = 0; i < this.commonBtns.length; i++) {
            const commonBtn = this.commonBtns[i];
            commonBtn.bg.spriteFrame = i == selectedIdx ? this.sf_selected : this.sf_unselected;
        }

    }

    setCurSelectIndex(idx: number) {
        this.curSelectIdx = idx;
        this.updateBtnsSpriteFrameBySelectedIndex(idx);
        return idx;
    }

    getCurSelectIndex() {
        return this.curSelectIdx;
    }

    getLastSelectIndex() {
        return this.lastSelectIdx;
    }

    public getBtns() {
        return this.commonBtns;
    }
}
