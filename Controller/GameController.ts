
import { Node } from 'cc';
 
import { Enum_GameObject, Enum_GameState } from '../Def/EnumDef';
import ControllerBase from './ControllerBase';
import { GameObjectsManagerBase } from '../Manager/GameObjectsManagerBase';
import GameObjectBase, { GameObjectBaseInitParam } from '../Core/GameObjects/GameObjectBase';
import { ObjectPool } from '../Core/ObjectPool/ObjectPool';
import { GM } from '../Global/GM';

export default class GameController extends ControllerBase {
    protected root: Node;
    protected gameState: Enum_GameState;
    /**游戏对象管理者 字典 */
    protected GameObjectsManagers: Map<number, GameObjectsManagerBase> = new Map();

    public init(root: Node): boolean {
        this.root = root;
        this.listenMainEvent();

        return true;
    }

    /**开始游戏 */
    public startGame(...model: unknown[]) {

    }

    public update(deltaTime: number): boolean {
        if (this.gameState & Enum_GameState.GamePause) {
            return false;
        }

        GM.gamingTimerManager.update(deltaTime);

        return true;
    }

    protected listenMainEvent() {

    }

    protected offListenMainEvent() {

    }

    /**
     * 根据类型获取对象管理者
     * @param type 
     * @returns 
     */
    public GetManager(type: Enum_GameObject | number): GameObjectsManagerBase {
        if (!this.GameObjectsManagers.has(type)) {
            ///根据类型 自定义初始化对象管理者类
            let manager = new GameObjectsManagerBase();
            this.GameObjectsManagers.set(type, manager);
        }

        return this.GameObjectsManagers.get(type);
    }

    public RemoveObjectByType(type: Enum_GameObject) {
        let manager = this.GetManager(type);
        if (manager) {
            manager.RemoveAllGameObjects();
        }
    }

    public RemoveObjectFromManager(...gameObjectBases: GameObjectBase[]) {
        for (const obj of gameObjectBases) {
            if (!obj) {
                continue;
            }

            let type = obj.type;
            if (!this.GameObjectsManagers.has(type)) {
                continue;
            }

            (this.GameObjectsManagers.get(type) as GameObjectsManagerBase).RemoveGameObjectFromTable(obj);
        }

        // console.log(ObjectPool);
    }

    public RemoveAllGameObects() {
        let itor = this.GameObjectsManagers.values();

        let next = itor.next();

        while (!next.done) {
            let managerBase: GameObjectsManagerBase = next.value;
            if (managerBase == null) {
                continue;
            }
            managerBase.RemoveAllGameObjects();

            next = itor.next();
        }
    }

    public GetAllGameObjects() {
        let result: GameObjectBase[] = [];
        let itor = this.GameObjectsManagers.values();

        let next = itor.next();

        while (!next.done) {
            let managerBase: GameObjectsManagerBase = next.value;
            if (managerBase == null) {
                continue;
            }

            result.push(...managerBase.GetAllGameObjects());

            next = itor.next();
        }

        return result;
    }

    public AddObjectIntoManager(obj: GameObjectBase, param?: GameObjectBaseInitParam) {
        let manager = this.GetManager(obj.type);
        manager.AddGameObjectIntoTable(obj, param);

        if (this.gameState & Enum_GameState.GamePause) {
            obj.onGamePause();
        }
    }

    public GetObjectByType(type: Enum_GameObject | number) {
        return this.GetManager(type).GetAllGameObjects();
    }
    /**获取对应类型的对象数量 */
    public getObjectsCntByType(type: Enum_GameObject | number) {
        return this.GetManager(type).getObjectsCnt();
    }

    public getGameObjectByUUID(uuid: string, type?: Enum_GameObject | number) {
        if (type) {
            return this.GetManager(type).getGameObjectByID(uuid);
        }

        let itor = this.GameObjectsManagers.values();
        let next = itor.next();
        while (!next.done) {
            let managerBase: GameObjectsManagerBase = next.value;
            let obj = managerBase.getGameObjectByID(uuid);

            if (obj) {
                return obj;
            }

            next = itor.next();
        }
    }

    clear() {


    }

}