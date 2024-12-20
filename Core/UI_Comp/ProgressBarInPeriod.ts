// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, ProgressBar, Component, Node, Vec3, v3 } from "cc";

const { ccclass, property, requireComponent } = _decorator;

/**阶段值 */
export interface IPeriodValue {
    /**第几个阶段 从0开始 */
    idx: number;
    /**占了该阶段百分之几 */
    percent: number;
}

@ccclass
@requireComponent(ProgressBar)
/**阶段进度条 */
export default class ProgressBarInPeriod extends Component {
    private _progress: ProgressBar = null;
    @property(ProgressBar)
    public get progress(): ProgressBar {
        if (!this._progress) {
            this._progress = this.node.getComponent(ProgressBar);
        }

        return this._progress;
    }
    private set progress(value: ProgressBar) {
        this._progress = value;
    }

    /**每个阶段的刻度节点 */
    @property(Node)
    node_mark: Node = null;

    protected markNodeArr: readonly Node[] = [];
    public init() {
        this.markNodeArr = this.node_mark.children;
    }

    public setProgress(param: IPeriodValue) {
        let reachIdx = param.idx;

        let lastReachIdx: number = Math.max(reachIdx - 1, 0);
        let p0 = this.markNodeArr[0].position;

        let r = param.percent;
        let p1 = this.markNodeArr[reachIdx].position;
        let p2 = this.markNodeArr[lastReachIdx].position;
        let len = Vec3.subtract(v3(), p1, p2).length() * r;
        let len2 = Vec3.subtract(v3(), p0, p2).length();

        let r2 = (len + len2) / this.progress.totalLength;
        this.progress.progress = r2;
    }

    public getMarkNodeArr() {
        return this.markNodeArr;
    }
}