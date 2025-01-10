import { __private, Asset, AssetManager, assetManager, createDefaultPipeline, JsonAsset, log } from "cc";
import { VIEW_DIR } from "../../Def/ConstDef";
import { Enum_AssetBundle, Enum_Layer, UIName } from "../../Def/EnumDef";
import { CustomEvents } from "../../Event/CustomEvents";
import EventDispatcher from "../../Event/EventDispatcher";
import ConfigManager from "./ConfigManager";
import ManagerBase from "./ManagerBase";
import { ResourcesManager } from "./ResourcesManager";
import { GM } from "../Global/GM";

/**预加载管理者 */
export default class PreLoadManager extends ManagerBase {
    private _loadTotal: number = 0;
    private _curLoadCount: number = 0;

    public get curLoadCount(): number {
        return this._curLoadCount
    }
    public set curLoadCount(num: number) {
        this._curLoadCount = num

    }

    private _PreloadBundle: Enum_AssetBundle[] = [
        Enum_AssetBundle.Common,
        Enum_AssetBundle.Config,
    ]

    private _preloadView: Array<{ bundle: Enum_AssetBundle, viewName: UIName }> = [
    ]

    init(...inf: unknown[]): boolean {
        this._curLoadCount = 0;

        assetManager.parser.register('.json', this.parseJson);

        return super.init(inf);
    }

    async BeginLoad(uiEventDispatcher: EventDispatcher, configManager: ConfigManager): Promise<void> {
        await GM.uiManager.OpenUI(UIName.LoadingView, null, null, Enum_Layer.Loading);

        // const uiEventDispatcher = GM.eventDispatcherManager.getEventDispatcher(Enum_EventType.UI);

        let promiseList: Promise<any>[] = [];
        this.curLoadCount = 0;
        this._loadTotal = 0;

        let assetNameList: Array<{ bundle: string, name: string }> = [];
        for (let i = 0; i < this._PreloadBundle.length; i++) {
            const element = this._PreloadBundle[i];

            let p = ResourcesManager.LoadAssetBundle(element).then((bundle) => {
                console.log("finish loading bundle", bundle.name);
                // console.log("paths:", bundle.config.paths);

                const assetInf = bundle["_config"]["paths"]["_map"];

                for (const key in assetInf) {
                    assetNameList.push({ bundle: element, name: key });
                }
            });

            promiseList.push(p);
        }

        await Promise.all(promiseList);

        promiseList = [];


        this._loadTotal += assetNameList.length;

        for (const obj of assetNameList) {
            let pp = ResourcesManager.LoadAssetRes(obj.bundle, obj.name);
            pp.then((assert) => {
                this.curLoadCount++;
                uiEventDispatcher.Emit(CustomEvents.LoadingProgress, this.curLoadCount / this._loadTotal);
            })
            promiseList.push(pp);
        }

        for (const inf of this._preloadView) {
            let path: string = `${VIEW_DIR}/${UIName[inf.viewName]}`;

            let pp = ResourcesManager.LoadAssetRes(inf.bundle, path);
            pp.then((assert) => {
                this.curLoadCount++;
                uiEventDispatcher.Emit(CustomEvents.LoadingProgress, this.curLoadCount / this._loadTotal);
            })
            promiseList.push(pp);

        }

        await Promise.all(promiseList);

        GM.uiManager.CloseUIByName(UIName.LoadingView);

        return Promise.resolve();
    }

    parseJson(file, options, callback) {
        // 解析下载完成的文件
        console.log("file", file);

        callback(null, file);
    }
}
