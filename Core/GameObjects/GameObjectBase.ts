
import { _decorator } from "cc";
import { Enum_GameObject } from "../../Def/EnumDef";

import IRecoverObject from "./IRecoverObject";
const { ccclass, property } = _decorator;

/**游戏基类接口（重写必要的接口） */
export interface IGameObjectBase {
    init(...param: unknown[]): void;
    onGameStart(info?): any;
    onGameUpdate(info?): any;
    onGameFixUpdate(info?): any;
    onGamePause(info?): void;
    onGameResume(info?): void;
    onGameEnd(endInfo?): void;
}

export class GameObjectBaseInitParam {

}

/**游戏对象类 */
@ccclass()
export default abstract class GameObjectBase implements IRecoverObject {
    protected isRecovering: boolean = true;

    /**游戏对象初始化 */
    public init(...param: unknown[]): void {
        this.isRecovering = false;
    }

    public onGameStart(info?): any { }
    public onGameUpdate(info?): any { }
    public onGamePause(info?): void { }
    public onGameResume(info?): void { }
    public onGameEnd(endInfo?): void { }

    /**外部调用回收方法 */
    abstract recover(): void;

    /**回收时触发 不要乱调用该方法 */
    onRecover(): boolean {
        this.isRecovering = true;

        return true;
    }

    protected _type: Enum_GameObject;
    public get type(): Enum_GameObject {
        return this._type;
    }
    public set type(v: Enum_GameObject) {
        this._type = v;
    }

}