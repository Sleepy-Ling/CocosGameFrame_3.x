
import { Enum_EventType } from "../Def/EnumDef";
import { CustomEvents } from "../Event/CustomEvents";
import GameObjectBase, { GameObjectBaseInitParam } from "../Core/GameObjects/GameObjectBase";
import { GM } from "../Core/Global/GM";
import { ObjectPool } from "../Core/ObjectPool/ObjectPool";
import { LogUtil } from "../Core/Utils/LogUtil";
import ManagerBase from "./ManagerBase";

export class GameObjectsManagerBase extends ManagerBase {
    /**当前游戏场景里面的对象 用于统一控制 */
    protected GameObjectsTable = new Map<String, GameObjectBase>();

    public init(inf?: any) { return super.init() };

    public getGameObjectByID(id: string) {
        return this.GameObjectsTable.get(id);
    }

    /**把游戏对象加入表里 */
    public AddGameObjectIntoTable(gameObjectBase: GameObjectBase, initInf: GameObjectBaseInitParam = null) {
        let id = gameObjectBase.getUUID() || initInf.uuid || gameObjectBase.node.uuid;
        if (id == null) {
            LogUtil.Log("添加对象的uuid 为空!!");
            return;
        }

        if (this.GameObjectsTable.has(id)) {
            LogUtil.Log("重复添加对象 " + id, gameObjectBase);
            return;
        }

        this.GameObjectsTable.set(id, gameObjectBase);

        initInf.uuid = id;

        gameObjectBase.init(initInf);

        const gameEventDispatcher = GM.eventDispatcherManager.getEventDispatcher(Enum_EventType.Game);
        gameEventDispatcher.Emit(CustomEvents.onGameObjectJoinSceneFinish, gameObjectBase);
    }

    /**
     * 移除某个游戏对象
     * @param gameObjectBase 游戏对象
     * @returns 
     */
    public RemoveGameObjectFromTable(gameObjectBase: GameObjectBase) {
        let id = gameObjectBase.getUUID();
        if (!this.GameObjectsTable.has(id)) {
            return;
        }

        this.GameObjectsTable.delete(id);
        // gameObjectBase.recover();
        ObjectPool.put(gameObjectBase.recoverTag, gameObjectBase);

        const gameEventDispatcher = GM.eventDispatcherManager.getEventDispatcher(Enum_EventType.Game);
        gameEventDispatcher.Emit(CustomEvents.onGameObjectRemovedFinish, gameObjectBase);

    }

    /**
     * 移除全部游戏对象
     */
    public RemoveAllGameObjects() {
        const gameEventDispatcher = GM.eventDispatcherManager.getEventDispatcher(Enum_EventType.Game);
        let allObjects = this.GetAllGameObjects();

        allObjects.forEach((obj) => {
            // obj.recover();
            ObjectPool.put(obj.recoverTag, obj);

            gameEventDispatcher.Emit(CustomEvents.onGameObjectRemovedFinish, obj);

        })

        this.GameObjectsTable.clear();

    }

    /**获得该管理器对全部对象 （仅提供对象调用） */
    public GetAllGameObjects(): Array<GameObjectBase> {
        let itor = this.GameObjectsTable.values();
        return Array.from(itor);
    }

    public updateAllObjects(deltaTime: number) {
        let itor = this.GameObjectsTable.values();
        while (1) {
            let obj = itor.next().value;
            if (obj == null) {
                break;
            }

            obj.onGameUpdate(deltaTime);
        }
    }

    public pauseAllGameObjects() {
        this.GetAllGameObjects().forEach((obj) => {
            obj.onGamePause();
        })
    }

    public resumeAllGameObjects() {
        this.GetAllGameObjects().forEach((obj) => {
            obj.onGameResume();
        })
    }

    public setAllObjectsGameEnd() {
        this.GetAllGameObjects().forEach((obj) => {
            obj.onGameEnd();
        })
    }
}

