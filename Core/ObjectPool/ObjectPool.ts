import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import IRecoverObject from "../GameObjects/IRecoverObject";

const { ccclass, property } = _decorator;

@ccclass('ObjectPool')
class _ObjectPool {
    private _pool: { [key: string]: Array<IRecoverObject> };
    constructor() {
        this._pool = {};
    }

    put(key: string, obj: IRecoverObject) {
        if (obj == null) {
            return;
        }

        if (this._pool[key] == null) {
            this._pool[key] = [];
        }

        // if (this._pool[key].length > 50) {
        //     this._pool[key].slice()
        // }

        if (obj.onRecover()) {
            this._pool[key].push(obj);
        }

        // console.log(key, " : ", this._pool[key].length);

    }

    /**
     * 通过key 值来获取对象
     * @param key 
     * @returns 
     */
    get(key: string) {
        if (this._pool[key] != null && this._pool[key].length > 0) {
            let obj = this._pool[key].pop();
            return obj;
        }
    }

    /**
     * 通过key或者对应预制体和组件名来获取对象
     * @param key 对象名
     * @param prefab 对象的预制体
     * @param componentType 对应的组件名
     * @returns 
     */
    getByPrefab<T extends Component & IRecoverObject>(key: string, prefab: Prefab | Node, componentType: { new(): T }) {
        let obj = this.get(key);

        if (obj == null) {
            let node = instantiate(prefab) as Node;
            obj = node.getComponent(componentType);

            obj.recoverTag = key;
        }

        return obj as T;
    }

    has(key: string) {
        return this._pool[key] != null && this._pool[key].length > 0;
    }
}

export const ObjectPool = new _ObjectPool();

