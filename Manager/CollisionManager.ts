import { color, Color, Graphics, Rect, v3 } from "cc";
import ManagerBase from "./ManagerBase";
import GameObjectBase from "../Core/GameObjects/GameObjectBase";
import { customAlphabet } from "nanoid";
import { Enum_ColliderType, IColliderBase, IColliderInf, IColliderObject, ICollsionDetail, ICustomCollsionEvent } from "../Def/StructDef";
import { Quadtree } from "../Collision/Quadtree/Quadtree";
import { Rectangle } from "../Collision/Quadtree/Rectangle";
import { Circle, CollisionUtil } from "../Core/Utils/CollisionUtil";

const nanoid = customAlphabet("1234567890abcdefhijklmnopqrstuvwxyzABCDEFHIJKLMNOPQRSTUVWXYZ", 10);

export interface ICollisionPair {
    collider_1: IColliderBase;
    collider_2: IColliderBase;
}

export class CollisionManager extends ManagerBase {
    Quadtree: Quadtree<IColliderInf>;

    graphics: Graphics = null;

    private _lastCollisionsMap: Map<string, ICollisionPair> = new Map();

    private _debugShow: boolean = false;

    protected baseTreeRect: IColliderInf;

    protected gameObjectList: GameObjectBase[];

    public init(graphics: Graphics, debugShow?: boolean): any {
        this.graphics = graphics;
        this._debugShow = debugShow;
        this.gameObjectList = [];

        return super.init(null);
    }

    public initTree(rect: Rectangle) {
        this.Quadtree = new Quadtree(rect);
        let aa: IColliderInf = {
            maskID: 0,
            groupID: 0,
            ownerUid: "",
            type: Enum_ColliderType.None,
            getWorldPosition: null,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            qtIndex: Rectangle.prototype.qtIndex
        }
        this.baseTreeRect = aa;
    }

    public update(dt: number, gameObjectList: GameObjectBase[]) {
        this.Quadtree.clear();

        let collisonEvent: ICustomCollsionEvent = {
            beginEvent: [],
            stayEvent: [],
            exitEvent: []
        }

        for (const obj of gameObjectList) {
            // const collider = obj as IColliderObject;
            // if (obj.colliderInfList == null) {
            //     continue;
            // }

            // if (!collider.needInsertTree) {
            //     continue;
            // }

            // let canTriggeronCollisionEnter = collider.onCollisionEnter != null;
            // let canTriggerCollisionStay = collider.onCollisionStay != null;
            // let canTriggerCollisionExit = collider.onCollisionExit != null;

            // //更新碰撞盒
            // let colliderInf = obj.colliderInfList;
            // for (const inf of colliderInf) {
            //     if (inf.uuid == null) {//给该碰撞盒分配uid
            //         inf.uuid = nanoid();
            //     }

            //     if (inf.ownerType == null) {
            //         inf.ownerType = obj.type;
            //     }

            //     if (inf.canTriggeronCollisionEnter == null) {
            //         inf.canTriggeronCollisionEnter = canTriggeronCollisionEnter;
            //     }
            //     if (inf.canTriggerCollisionStay == null) {
            //         inf.canTriggerCollisionStay = canTriggerCollisionStay;
            //     }
            //     if (inf.canTriggerCollisionExit == null) {
            //         inf.canTriggerCollisionExit = canTriggerCollisionExit;
            //     }

            //     let worldPos = inf.getWorldPosition();

            //     if (inf.type == Enum_ColliderType.Rect) {
            //         inf.x = worldPos.x - 0.5 * inf.width;
            //         inf.y = worldPos.y - 0.5 * inf.height;
            //     }
            //     else {
            //         inf.x = worldPos.x;
            //         inf.y = worldPos.y;
            //     }

            //     this.Quadtree.insert(inf);
            // }

            let colliderList = obj.updateColliders();
            if (colliderList) {
                for (const element of colliderList) {
                    if (element) {
                        this.Quadtree.insert(element);
                    }
                }
            }
        }

        let lastCollisionPairIDArr: string[] = Array.from(this._lastCollisionsMap.keys());
        let curCollisionPairMap: Map<string, ICollisionPair> = new Map();

        for (var i = 0; i < gameObjectList.length; i++) {
            const collider = gameObjectList[i] as IColliderObject;
            if (!collider.needInsertTree) {
                continue;
            }

            let colliderList = gameObjectList[i].colliderInfList;
            if (colliderList == null) {
                continue;
            }

            for (const myObject of colliderList) {

                //[4] … and retrieve all objects from the same tree node
                var candidates = this.Quadtree.retrieve(myObject);

                //[5] Check all collision candidates
                for (let k = 0; k < candidates.length; k++) {

                    var myCandidate = candidates[k];

                    //[6] since all objects are inside the tree, 
                    //we will also retrieve the current object itself.
                    //That's a collision case we want to skip.
                    if (myObject === myCandidate) continue;

                    //[7] check each candidate for real intersection
                    var intersect = this.getIntersection(myObject, myCandidate);

                    //[8] if they actually intersect, we can take further 
                    //actions. 
                    if (intersect) {
                        // … take actions
                        let pairID = this.getCollisionPairId(myObject, myCandidate);

                        let collisionPair: ICollisionPair = {
                            collider_1: myObject,
                            collider_2: myCandidate
                        }

                        curCollisionPairMap.set(pairID, collisionPair);

                        //当前碰撞组是否之前已经存在
                        let hasLastCollision: boolean = this._lastCollisionsMap.has(pairID);
                        if (myObject.canTriggerCollisionStay && hasLastCollision) {//触发stay方法
                            let collisonDetail: ICollsionDetail = {
                                selfCollider: myObject,
                                otherCollider: myCandidate
                            }
                            collisonEvent.stayEvent.push(collisonDetail);
                        }
                        else if (myObject.canTriggeronCollisionEnter && !hasLastCollision) {//触发enter 方法
                            let collisonDetail: ICollsionDetail = {
                                selfCollider: myObject,
                                otherCollider: myCandidate
                            }
                            collisonEvent.beginEvent.push(collisonDetail);
                        }

                    }
                }
            }

        }

        for (const element of lastCollisionPairIDArr) {
            if (!curCollisionPairMap.has(element)) {//触发exit 方法
                let collisionPair = this._lastCollisionsMap.get(element);

                let colliderInf_1 = collisionPair.collider_1;
                let colliderInf_2 = collisionPair.collider_2;

                let collisonDetail: ICollsionDetail = {
                    selfCollider: colliderInf_1,
                    otherCollider: colliderInf_2
                }
                collisonEvent.exitEvent.push(collisonDetail);
            }
        }

        this._lastCollisionsMap = curCollisionPairMap;

        this.draw();

        return collisonEvent;
    }

    protected getIntersection<T extends IColliderInf>(obj_1: T, obj_2: T) {
        const group_1 = obj_1.groupID;
        const group_2 = obj_2.groupID;
        const mask_1 = obj_1.maskID;
        const mask_2 = obj_2.maskID;

        // return (group_1 & mask_2) > 0 || (group_2 & mask_1) > 0;

        if ((group_1 & mask_2) > 0 || (group_2 & mask_1) > 0) {
            if (obj_1.type == Enum_ColliderType.Rect && obj_2.type == Enum_ColliderType.Rect) {
                return this.containsRect(obj_1, obj_2);
            }
            else if (obj_1.type == Enum_ColliderType.Circle && obj_2.type == Enum_ColliderType.Rect || obj_2.type == Enum_ColliderType.Circle && obj_1.type == Enum_ColliderType.Rect) {
                let circleObj: T = obj_1.type == Enum_ColliderType.Circle ? obj_1 : obj_2;
                let rectObj: T = obj_1.type == Enum_ColliderType.Rect ? obj_1 : obj_2;

                let circle: Circle = {
                    x: circleObj.x,
                    y: circleObj.y,
                    radius: circleObj.width / 2
                }

                let rectangle = {
                    x: rectObj.x,
                    y: rectObj.y,
                    width: rectObj.width,
                    height: rectObj.height
                }

                return CollisionUtil.circleVsRect(circle, rectangle);
            }
            else if (obj_1.type == Enum_ColliderType.Circle && obj_2.type == Enum_ColliderType.Circle) {
                let circle1: Circle = {
                    x: obj_1.x,
                    y: obj_1.y,
                    radius: obj_1.width / 2
                }
                let circle2: Circle = {
                    x: obj_2.x,
                    y: obj_2.y,
                    radius: obj_2.width / 2
                }

                return CollisionUtil.circleVsCircle(circle1, circle2);
            }

        }

    }

    /**
    * rect1 是否包含 rect2
    * @param rect1 
    * @param rect2 
    * @returns 
    */
    containsRect(rect1: IColliderInf, rect2: IColliderInf) {
        var r1w = rect1.width / 2,
            r1h = rect1.height / 2,
            r2w = rect2.width / 2,
            r2h = rect2.height / 2;

        var distX = (rect1.x + r1w) - (rect2.x + r2w);
        var distY = (rect1.y + r1h) - (rect2.y + r2h);

        // if (Math.abs(distX) < r1w + r2w && Math.abs(distY) < r1h + r2h) {
        //     return {
        //         pushX: (r1w + r2w) - Math.abs(distX),
        //         pushY: (r1h + r2h) - Math.abs(distY),
        //         dirX: distX === 0 ? 0 : distX < 0 ? -1 : 1,
        //         dirY: distY === 0 ? 0 : distY < 0 ? -1 : 1
        //     }
        // } else {
        //     return false;
        // }

        return Math.abs(distX) < r1w + r2w && Math.abs(distY) < r1h + r2h;
    }

    draw(): void {
        if (!this.graphics) {
            return;
        }

        if (!this._debugShow) {
            return;
        }

        this.graphics.clear();


        const tree = this.Quadtree;

        let bounds = tree.bounds;

        let tempColor: Color;
        let tempPos = v3(bounds.x, bounds.y, 0);
        tempPos = this.graphics.node.inverseTransformPoint(tempPos, tempPos);

        // Draw current node
        this.graphics.strokeColor = Color.WHITE;
        tempColor = color(Color.YELLOW.toHEX());
        tempColor.a = 120;
        this.graphics.fillColor = tempColor
        // this.graphics.fillColor.a = 120; //(120);

        this.graphics.rect(tempPos.x, tempPos.y, bounds.width, bounds.height);

        this.graphics.fill();

        this.graphics.stroke();

        let allObject = tree.retrieve(this.baseTreeRect);

        // Draw objects
        tempColor = color(Color.RED.toHEX());
        tempColor.a = 120;
        this.graphics.fillColor = tempColor;

        for (let obj of allObject) {
            tempPos.x = obj.x;
            tempPos.y = obj.y;
            tempPos = this.graphics.node.inverseTransformPoint(tempPos, tempPos);

            if (obj.type == Enum_ColliderType.Rect) {
                this.graphics.rect(tempPos.x, tempPos.y, obj.width, obj.height);
            }
            else if (obj.type == Enum_ColliderType.Circle) {
                this.graphics.circle(tempPos.x, tempPos.y, obj.width / 2);
            }

            this.graphics.fill();
        }


        //Draw tree child
        this.graphics.strokeColor = Color.BLACK;
        this.graphics.lineWidth = 5;
        let nowTreeList = [tree];

        while (nowTreeList.length > 0) {
            let tree = nowTreeList.shift();
            const bounds = tree.bounds;

            if (tree.nodes && tree.nodes.length > 0) {
                nowTreeList.push(...tree.nodes);
            }
            else {
                tempPos.x = bounds.x;
                tempPos.y = bounds.y;
                tempPos = this.graphics.node.inverseTransformPoint(tempPos, tempPos);

                this.graphics.rect(tempPos.x, tempPos.y, bounds.width, bounds.height);
                this.graphics.stroke();

            }
        }

    }

    /**获取碰撞体对的id */
    private getCollisionPairId(collider_1: IColliderInf, collider_2: IColliderInf): string {
        let collider_1_uid = collider_1.uuid;
        let collider_2_uid = collider_2.uuid;
        let obj_1_uuid = collider_1.ownerUid;//.owner.getUUID();
        let obj_2_uuid = collider_2.ownerUid;//.owner.getUUID();

        let finial_1_uid = `${obj_1_uuid}-${collider_1_uid}`;
        let finial_2_uid = `${obj_2_uuid}-${collider_2_uid}`;

        if (finial_1_uid < finial_2_uid) {
            return `${finial_1_uid}:${finial_2_uid}`;
        }

        return `${finial_2_uid}:${finial_1_uid}`;

    }

    private splitCollisionPairId(pairID: string) {
        let arr = pairID.split(':');
        // return { obj_1_uuid: arr[0], obj_2_uuid: arr[1] };

        let tempArr = arr[0].split("-");
        let obj_1_uuid = tempArr[0];
        let collider_1_uid = tempArr[1];
        tempArr = arr[1].split("-");
        let obj_2_uuid = tempArr[0];
        let collider_2_uid = tempArr[1];

        let result = {
            obj_1_uuid: obj_1_uuid,
            collider_1_uid: collider_1_uid,
            obj_2_uuid: obj_2_uuid,
            collider_2_uid: collider_2_uid,
        }
        return result;
    }

    /**
     * 根据指定的碰撞盒获取对应的碰撞体
     * @param colliderInfList 指定的碰撞盒
     */
    public getCollider(colliderInfList: IColliderInf[]) {
        let result: IColliderInf[] = [];

        for (const myObject of colliderInfList) {
            var candidates = this.Quadtree.retrieve(myObject);

            //[5] Check all collision candidates
            for (let k = 0; k < candidates.length; k++) {

                var myCandidate = candidates[k];

                //[6] since all objects are inside the tree, 
                //we will also retrieve the current object itself.
                //That's a collision case we want to skip.
                if (myObject === myCandidate) continue;

                //[7] check each candidate for real intersection
                var intersect = this.getIntersection(myObject, myCandidate);

                //[8] if they actually intersect, we can take further 
                //actions. 
                if (intersect) {
                    result.push(myCandidate);
                }

            }
        }

        return result;
    }
}