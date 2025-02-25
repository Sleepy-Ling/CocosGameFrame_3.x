import { Vec3 } from "cc";
import { Circle } from "../Collision/Quadtree/Circle";
import { NodeGeometry, Indexable } from "../Collision/Quadtree/types";

/*===================框架内部结构定义=================== */

export interface ITemp {

}

export enum Enum_ColliderType {
    None,
    Rect,
    Circle,
}

export interface IColliderBase {
    /**碰撞规则id 不要乱改*/
    readonly maskID: number;
    /**碰撞盒id 不要乱改*/
    readonly groupID: number;

    /**不要修改，自动赋值 */
    uuid?: string;

    /**持有者uid 不要修改 */
    ownerUid: string;
    /**持有者类型 不要修改 */
    ownerType?: number;

    /*不要修改 */
    canTriggeronCollisionEnter?: boolean;
    /*不要修改 */
    canTriggerCollisionStay?: boolean;
    /*不要修改 */
    canTriggerCollisionExit?: boolean;
}


/**碰撞盒信息 */
export interface IColliderInf extends IColliderBase, NodeGeometry, Indexable {
    /**碰撞盒类型 长方形、圆形 */
    type: Enum_ColliderType;
    getWorldPosition(): Vec3;
}

export interface ICircleCollider extends IColliderInf, Circle {

}

/**碰撞体结构 */
export interface IColliderObject {
    /**是否加入碰撞系统管理 */
    needInsertTree: boolean;
    /**碰撞盒 */
    colliderInfList: IColliderInf[];
    /**初始化碰撞盒 */
    initCollider(): void;
    updateColliders(): IColliderInf[];
    /**碰撞触发 */
    onCollisionEnter?(self: IColliderBase, other: IColliderBase): void;
    onCollisionStay?(self: IColliderBase, other: IColliderBase): void;
    onCollisionExit?(self: IColliderBase, other: IColliderBase): void;
    getUUID(): string;
}


export interface ICollsionDetail {
    selfCollider: IColliderBase;
    otherCollider: IColliderBase;
}

export interface ICustomCollsionEvent {
    beginEvent: ICollsionDetail[];
    stayEvent: ICollsionDetail[];
    exitEvent: ICollsionDetail[];
}

