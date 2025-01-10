import { color, Color, Graphics, Node, v2, v3, Vec2 } from "cc";
import ManagerBase from "./ManagerBase";
import Quadtree, { Rect } from '@timohausmann/quadtree-js';
import GameObjectBase from "../GameObjects/GameObjectBase";
import { IColliderBase, IColliderInf, IColliderObject } from "../../../Def/StructDef";
import { customAlphabet } from "nanoid";
import { CollisionUtil, Ray } from "../Utils/CollisionUtil";


const nanoid = customAlphabet("1234567890abcdefhijklmnopqrstuvwxyzABCDEFHIJKLMNOPQRSTUVWXYZ", 10);

export enum Enum_ColliderType {
    None,
    Rect,
    Circle,
}

export interface ICollisionPair {
    collider_1: IColliderBase;
    collider_2: IColliderBase;
}

export class CollisionManager extends ManagerBase {
    Quadtree: Quadtree;

    graphics: Graphics = null;

    private lastCollisionsMap: Map<string, ICollisionPair> = new Map();

    public init(graphics: Graphics): any {
        this.graphics = graphics;

        return super.init(null);
    }

    public initTree(rect: Rect) {
        this.Quadtree = new Quadtree(rect);
    }

    public update(dt: number, gameObjectList: GameObjectBase[]): void {
        this.Quadtree.clear();

        let objectsLookup: Map<string, GameObjectBase> = new Map();

        for (const obj of gameObjectList) {
            // let worldPos = obj.node.getWorldPosition();

            if (obj.colliderInfList == null) {
                continue;
            }

            //更新碰撞盒
            let colliderInf = obj.colliderInfList;
            for (const inf of colliderInf) {
                if (inf.uuid == null) {//给该碰撞盒分配uid
                    inf.uuid = nanoid();
                }

                let worldPos = inf.getWorldPosition();
                inf.x = worldPos.x + -inf.anchorX * inf.width;
                inf.y = worldPos.y + -inf.anchorY * inf.height;

                this.Quadtree.insert(inf);
            }

            objectsLookup.set(obj.getUUID(), obj);
        }

        let lastCollisionPairIDArr: string[] = Array.from(this.lastCollisionsMap.keys());
        let curCollisionPairMap: Map<string, ICollisionPair> = new Map();

        for (var i = 0; i < gameObjectList.length; i++) {

            let colliderList = gameObjectList[i].colliderInfList;
            if (colliderList == null) {
                continue;
            }

            for (const myObject of colliderList) {

                //[4] … and retrieve all objects from the same tree node
                var candidates = this.Quadtree.retrieve<IColliderInf>(myObject);

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
                    //actions. In this script, colliding objects will turn 
                    //green and change velocity 
                    if (intersect) {
                        // … take actions
                        let pairID = this.getCollisionPairId(myObject, myCandidate);

                        let collisionPair: ICollisionPair = {
                            collider_1: myObject,
                            collider_2: myCandidate
                        }
                        curCollisionPairMap.set(pairID, collisionPair);

                        if (this.lastCollisionsMap.has(pairID)) {//触发stay方法
                            myObject.owner.onCollisionStay(myObject, myCandidate);
                        }
                        else {//触发enter 方法
                            myObject.owner.onCollisionEnter(myObject, myCandidate);
                        }

                    }
                }
            }

        }

        for (const element of lastCollisionPairIDArr) {
            if (!curCollisionPairMap.has(element)) {//触发exit 方法
                let collisionPair = this.lastCollisionsMap.get(element);

                // let result = this.splitCollisionPairId(element);

                let obj_1: IColliderObject = collisionPair.collider_1.owner;
                let obj_2: IColliderObject = collisionPair.collider_2.owner;
                let colliderInf_1 = collisionPair.collider_1;
                let colliderInf_2 = collisionPair.collider_2;

                // obj_1 = objectsLookup.get(result.obj_1_uuid);
                // obj_2 = objectsLookup.get(result.obj_2_uuid);

                // if (obj_1 == null || obj_2 == null) {
                //     continue;
                // }

                // let colliderInf_1 = obj_1.colliderInfList.find((v) => v.uuid == result.collider_1_uid);
                // let colliderInf_2 = obj_2.colliderInfList.find((v) => v.uuid == result.collider_2_uid);

                // obj_1.onCollisionExit(colliderInf_1, colliderInf_2);

                if (obj_1 && obj_1.onCollisionExit) {
                    obj_1.onCollisionExit(colliderInf_1, colliderInf_2);
                }
                if (obj_2 && obj_2.onCollisionExit) {
                    obj_2.onCollisionExit(colliderInf_2, colliderInf_1);
                }
            }
        }

        this.lastCollisionsMap = curCollisionPairMap;

        objectsLookup.clear();
        this.draw();
    }

    protected getIntersection<T extends IColliderInf>(obj_1: T, obj_2: T) {
        const group_1 = obj_1.groupID;
        const group_2 = obj_2.groupID;
        const mask_1 = obj_1.maskID;
        const mask_2 = obj_2.maskID;

        if ((group_1 & mask_2) > 0 || (group_2 & mask_1) > 0) {
            return this.containsRect(obj_1, obj_2);
        }

    }

    /**
    * rect1 是否包含 rect2
    * @param rect1 
    * @param rect2 
    * @returns 
    */
    containsRect(rect1: Rect, rect2: Rect) {
        var r1w = rect1.width / 2,
            r1h = rect1.height / 2,
            r2w = rect2.width / 2,
            r2h = rect2.height / 2;

        var distX = (rect1.x + r1w) - (rect2.x + r2w);
        var distY = (rect1.y + r1h) - (rect2.y + r2h);

        if (Math.abs(distX) < r1w + r2w && Math.abs(distY) < r1h + r2h) {
            return {
                pushX: (r1w + r2w) - Math.abs(distX),
                pushY: (r1h + r2h) - Math.abs(distY),
                dirX: distX === 0 ? 0 : distX < 0 ? -1 : 1,
                dirY: distY === 0 ? 0 : distY < 0 ? -1 : 1
            }
        } else {
            return false;
        }

    }

    draw(): void {
        if (!this.graphics) {
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

        let allObject = tree.retrieve<IColliderInf>(bounds);

        // Draw objects
        tempColor = color(Color.RED.toHEX());
        tempColor.a = 120;
        this.graphics.fillColor = tempColor;

        for (let obj of allObject) {
            const halfHeight = obj.height / 2;
            const halfWidth = obj.width / 2;
            tempPos.x = obj.x;
            tempPos.y = obj.y;
            tempPos = this.graphics.node.inverseTransformPoint(tempPos, tempPos);

            this.graphics.rect(tempPos.x, tempPos.y, obj.width, obj.height);


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
        let obj_1_uuid = collider_1.owner.getUUID();
        let obj_2_uuid = collider_2.owner.getUUID();

        let finial_1_uid = `${obj_1_uuid}-${collider_1_uid}`;
        let finial_2_uid = `${obj_2_uuid}-${collider_2_uid}`;

        if (finial_1_uid.localeCompare(finial_2_uid) > 0) {
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

}