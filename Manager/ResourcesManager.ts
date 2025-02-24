import { AssetManager, SpriteFrame, sys, Texture2D, SpriteAtlas, Asset, assetManager, ImageAsset, log } from "cc";
import { DEBUG } from "cc/env";
import { Enum_AssetBundle, AtlasType } from "../Def/EnumDef";
import ManagerBase from "./ManagerBase";

class resourcesManager extends ManagerBase {
    // ResData: { [key: string]: { [key: string]: any } } = {};
    public async LoadSpriteFrameFromAtlas(BundleName: Enum_AssetBundle | string, path: string, tex_name: string, atlasType: AtlasType = AtlasType.default) {
        let p = new Promise<SpriteFrame>(async (resolve) => {
            if (sys.isBrowser && DEBUG) {

                let loadFilePath = path ? `${path}/${tex_name}` : tex_name;
                loadFilePath = loadFilePath + "/spriteFrame";

                let sf = await this.LoadAssetRes<SpriteFrame>(BundleName, loadFilePath);
                resolve(sf);

            }
            else if (sys.isBrowser) {
                let loadFilePath = path ? `${path}/${tex_name}` : tex_name;
                loadFilePath = loadFilePath + "/spriteFrame";
                let sf = await this.LoadAssetRes<SpriteFrame>(BundleName, loadFilePath);

                console.log("sf", sf);

                resolve(sf);
            }
            else {
                //图集资源位置
                let loadAtlasPath = path ? `${path}/${atlasType}` : atlasType;

                let assetExist = await this.isHasAssetRes(BundleName, loadAtlasPath);
                console.log("assetExist", assetExist);

                //图集不存在
                if (!assetExist) {
                    let loadFilePath = path ? `${path}/${tex_name}` : tex_name;
                    loadFilePath = loadFilePath + "/spriteFrame";

                    console.log("loadFilePath", loadFilePath);

                    let sf = await this.LoadAssetRes<SpriteFrame>(BundleName, loadFilePath);

                    console.log("sf", sf);

                    resolve(sf);

                    return;
                }

                let asset = await this.LoadAssetRes<SpriteAtlas>(BundleName, loadAtlasPath);

                if (asset) {
                    let sf: SpriteFrame = asset.getSpriteFrame(tex_name);

                    if (!sf) {
                        let loadFilePath = path ? `${path}/${tex_name}` : tex_name;

                        let tex = await this.LoadAssetRes<Texture2D>(BundleName, loadFilePath);

                        let sf = new SpriteFrame();
                        sf.texture = tex;
                        resolve(sf);

                        return;
                    }

                    resolve(sf);
                }

            }

        })

        return p;

    }

    /**直接获取已经加载的资源 */
    public getAssetRes<T extends Asset>(BundleName: Enum_AssetBundle | string, path: string): T {
        // if (this.ResData[BundleName][path]) {
        //     return this.ResData[BundleName][path];
        // }

        return this.getAssetBundle(BundleName).get(path);

        return null;
    }

    /**当前分包是否有该资源 （不论是否加载了） */
    public async isHasAssetRes(BundleName: Enum_AssetBundle | string, path: string): Promise<boolean> {
        let p: Promise<boolean> = new Promise<boolean>(async (resolve) => {

            let bundle = await this.LoadAssetBundle(BundleName);
            let result = bundle.getInfoWithPath(path);
            // console.log("bundle", bundle);

            // const assetInf = bundle["_config"]["paths"]["_map"];


            // for (const key in assetInf) {
            //     if (key == path) {
            //         resolve(true);
            //     }
            // }


            resolve(result != null);

        })

        return p;
    }

    public async LoadAssetRes<T extends Asset>(BundleName: Enum_AssetBundle | string, path: string): Promise<T> {
        // console.log("LoadAssetRes", BundleName, path);
        return await new Promise(async (resolve, reject) => {
            if (this.isBundleLoadFinished(BundleName)) {
                let bundle = this.getAssetBundle(BundleName);
                let asset = bundle.get(path);
                // console.log("BundleName:", BundleName, path);
                // console.log(asset);
                if (asset) {
                    resolve(asset as T);
                    return;
                }
            }

            let bundle = await this.LoadAssetBundle(BundleName)
            // console.log("bundle ", asset);

            bundle.load<T>(path, (err, res: T) => {
                if (err != null) {
                    console.log("LoadAssetRes", BundleName, path, "Fail", err)
                    // resolve(null)

                    console.trace();

                    reject(err);
                    return
                }
                resolve(res)
            })

        })
    }

    public async ReleaseAssetRes(BundleName: Enum_AssetBundle | string, path: string) {
        let ab = assetManager.getBundle(BundleName);
        if (!ab) {
            return;
        }
        // let ab = await this.LoadAssetBundle(BundleName)
        // this.ResData[BundleName][path] = null
        ab.release(path);
    }

    /**加载分包 */
    public async LoadAssetBundle(BundleName: Enum_AssetBundle | string): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            if (this.isBundleLoadFinished(BundleName)) {
                resolve(this.getAssetBundle(BundleName));
            }
            else {
                assetManager.loadBundle(BundleName, (err, bundle) => {
                    if (err) {
                        console.log("LoadAssetBundle", BundleName, "Fail", err)
                        reject(null)
                        return
                    }

                    resolve(bundle)
                })
            }

        })
    }

    public async LoadAllAssetInBundle(BundleName: Enum_AssetBundle | string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let bundle = await this.LoadAssetBundle(BundleName);

            const assetInf = bundle["_config"]["paths"]["_map"];
            let allPromise: Promise<Asset>[] = [];
            for (const key in assetInf) {
                // assetNameList.push({ bundle: element, name: key });
                let p = this.LoadAssetRes(BundleName, key);
                allPromise.push(p);
            }

            await Promise.all(allPromise);

            resolve(true);
        });
    }

    /**加载指定分包内的目录资源 */
    public async LoadDirInBundle(bundleName: Enum_AssetBundle | string, dirName: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let bundle = await this.LoadAssetBundle(bundleName);

            bundle.loadDir(dirName, (err: Error, data: Asset[]) => {
                log("LoadDirInBundle",bundleName, data)
                resolve(true);
            });

        });
    }

    /**获取已加载的分包 */
    public getAssetBundle(bundleName: string) {
        if (!this.isBundleLoadFinished(bundleName)) {
            return null;
        }
        return assetManager.getBundle(bundleName);
    }

    /**当前分包是否加载完成 */
    public isBundleLoadFinished(bundleName: string) {
        return assetManager.bundles.has(bundleName);
    }
}

export const ResourcesManager = new resourcesManager();
