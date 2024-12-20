


import { _decorator, Canvas, Vec2 } from 'cc';
import { Enum_GameState, Enum_GameObject } from '../../Def/EnumDef';
import { GameObjectsManagerBase } from '../Manager/GameObjectsManagerBase';

import GameObjectBase, { GameObjectBaseInitParam } from '../GameObjects/GameObjectBase';
import { ViewBase, ViewParamBase } from './ViewBase';

export class GameViewInitParam extends ViewParamBase {
    public levelID: number = -1;
    constructor(lv: number) {
        super();

        this.levelID = lv;
    }
}

export class GameViewInf {
    public levelID: number;
}

const { ccclass, property } = _decorator;

@ccclass
export default abstract class GameViewBase extends ViewBase {
    /**当前游戏状态 */
    protected gameState: Enum_GameState = Enum_GameState.None;
    /**游戏对象管理者 字典 */
    protected GameObjectsManagers: Map<Enum_GameObject, GameObjectsManagerBase> = new Map();

    /**游戏开始 */
    protected abstract onGameStart(info?: any): void;
    /**游戏结束 */
    protected abstract onGameEnd(info?: any): void;
    /**游戏恢复（从暂停状态中） */
    public abstract resume(info?: any): void;
    /**游戏暂停 */
    public abstract pause(info?: any): void;
    /**游戏重开 */
    public abstract restart(info?: any): void;
    public startGame(info?: any): void { };

    /**游戏通关判断 */
    protected abstract isGamePass(): boolean;

    /**游戏界面参数 */
    protected viewParam: GameViewInitParam;

    public onViewOpen(param: GameViewInitParam) {
        this.viewParam = param;

    }

    /**
     * 根据类型获取对象管理者
     * @param type 
     * @returns 
     */
    public GetManager(type: Enum_GameObject): GameObjectsManagerBase {
        if (!this.GameObjectsManagers.has(type)) {
            ///根据类型 自定义初始化对象管理者类
            let manager = new GameObjectsManagerBase();
            this.GameObjectsManagers.set(type, manager);
        }

        return this.GameObjectsManagers.get(type);
    }

    public RemoveObjectFromManager(...gameObjectBases: GameObjectBase[]) {
        for (const obj of gameObjectBases) {
            let type = obj.type;
            if (!this.GameObjectsManagers.has(type)) {
                continue;
            }

            (this.GameObjectsManagers.get(type) as GameObjectsManagerBase).RemoveGameObjectFromTable(obj);
        }
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

    public AddObjectIntoManager(obj: GameObjectBase, param?: GameObjectBaseInitParam) {


        let manager = this.GetManager(obj.type);
        manager.AddGameObjectIntoTable(obj, param);

        if (this.gameState & Enum_GameState.GamePause) {
            obj.onGamePause();
        }
    }

    public GetObjectByType(type: Enum_GameObject) {
        return this.GetManager(type).GetAllGameObjects();
    }

    public isOutSreen(worldPos: Vec2) {

    }

    public abstract getGameInf(): Readonly<GameViewInf>;

    public abstract getGameObjectCfg(id: string): Readonly<Object>;

    public getGameObjectByUUID(uuid: string, type?: Enum_GameObject) {
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
}