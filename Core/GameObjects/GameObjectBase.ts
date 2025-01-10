
import { _decorator, Component } from "cc";
import { Enum_GameObject } from "../../Def/EnumDef";

import IRecoverObject from "./IRecoverObject";
import { IColliderInf, IColliderObject } from "../../../Def/StructDef";
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
    uuid: string;
}

/**游戏对象类 */
@ccclass()
export default class GameObjectBase extends Component implements IRecoverObject, IColliderObject {
    colliderInfList: IColliderInf[];
    recoverTag: string;
    protected isRecovering: boolean = true;
    protected m_uuid: string;

    /**游戏对象初始化 */
    public init(param: GameObjectBaseInitParam): void {
        this.isRecovering = false;
        this.m_uuid = param.uuid;
    }

    public onGameStart(info?): any { }
    public onGameUpdate(info?): any { }
    public onGamePause(info?): void { }
    public onGameResume(info?): void { }
    public onGameEnd(endInfo?): void { }

    /**回收时触发 不要乱调用该方法 */
    onRecover(): boolean {
        this.isRecovering = true;
        this.node.setParent(null);

        return true;
    }

    protected _type: Enum_GameObject;
    public get type(): Enum_GameObject {
        return this._type;
    }
    public set type(v: Enum_GameObject) {
        this._type = v;
    }

    public getUUID() {
        return this.m_uuid;
    }

    initCollider(): void {
        throw new Error("Method not implemented.");
    }

    onCollisionEnter(self: IColliderInf, other: IColliderInf) {

    }

    onCollisionStay(self: IColliderInf, other: IColliderInf) {

    }

    onCollisionExit(self: IColliderInf, other: IColliderInf) {

    }

    getColliderInfByUid(uid: string) {
        if (this.colliderInfList) {
            return this.colliderInfList.find(v => v.uuid == uid);
        }

    }
}