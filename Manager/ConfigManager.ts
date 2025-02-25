
import { JsonAsset } from "cc";
import { ConfigType, Enum_AssetBundle } from "../Def/EnumDef";

import ManagerBase from "./ManagerBase";
import { ResourcesManager } from "./ResourcesManager";

/**
 * 配置管理者
 * @description 读取配置专用
 */
export default class ConfigManager extends ManagerBase {
    async GetConfigByName(type: ConfigType | string, assetBundle: Enum_AssetBundle = Enum_AssetBundle.Config) {
        let jsonAsset = await ResourcesManager.LoadAssetRes<JsonAsset>(assetBundle, type as string);

        return Promise.resolve(jsonAsset.json);
    }

    getConfig(cfgName: string, assetBundle: Enum_AssetBundle = Enum_AssetBundle.Config) {
        const jsonAsset = ResourcesManager.getAssetRes<JsonAsset>(assetBundle, cfgName);
        return jsonAsset ? jsonAsset.json : null;
    }
}