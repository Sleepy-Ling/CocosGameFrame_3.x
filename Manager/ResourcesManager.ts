import { AssetManager, SpriteFrame, sys, Texture2D, SpriteAtlas, Asset, assetManager, ImageAsset, log, path } from "cc";
import { DEBUG } from "cc/env";
import { Enum_AssetBundle, AtlasType } from "../Def/EnumDef";
import ManagerBase from "./ManagerBase";
import { TEXTURE_DIR } from "../Def/ConstDef";

class resourcesManager extends ManagerBase {
    /**
     * 加载一张贴图 （异步）
     * @param BundleName 
     * @param path 
     * @param tex_name 
     * @param atlasType 
     * @returns 
     */
    public async LoadSpriteFrameFromAtlas(BundleName: Enum_AssetBundle | string, path: string, tex_name: string, atlasType: AtlasType | string = AtlasType.default) {
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

    /**直接获取贴图资源 （注意：没加载的话，会返回空） */
    public getSpriteFrameFromAtlas(BundleName: Enum_AssetBundle | string, tex_name: string, dirName: string = TEXTURE_DIR, atlasName: string = "") {
        const bundle: AssetManager.Bundle = this.getAssetBundle(BundleName);
        if (!bundle) {
            return null;
        }

        let curPath = dirName ? `${dirName}/${atlasName}` : atlasName;

        let atlas = bundle.get<SpriteAtlas>(curPath, SpriteAtlas);
        let inf = bundle.getInfoWithPath(curPath, SpriteAtlas);
        let isAtlas: boolean = atlas instanceof SpriteAtlas;

        // console.log("atlas", atlas, isAtlas);
        // console.log("inf", inf, "path", curPath,);

        if (atlas && isAtlas) {
            return atlas.getSpriteFrame(tex_name);
        }

        curPath = dirName ? `${dirName}/${tex_name}` : tex_name;

        curPath = path.join(curPath, "spriteFrame");

        let sf = bundle.get<SpriteFrame>(curPath);
        if (!sf) {
            return null;
        }

        // let sf = new SpriteFrame();
        // sf.texture = sf;
        return sf;
    }

    /**直接获取已经加载的资源 */
    public getAssetRes<T extends Asset>(BundleName: Enum_AssetBundle | string, path: string): T {
        if (this.isBundleLoadFinished(BundleName)) {
            let bundle = this.getAssetBundle(BundleName);
            return bundle.get(path);
        }

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

    /**释放该分包中指定路径的资源 */
    public ReleaseAssetRes<T extends Asset>(BundleName: Enum_AssetBundle | string, path: string, type?: { new(): T }) {
        let ab = assetManager.getBundle(BundleName);
        if (!ab) {
            return;
        }
        // let ab = await this.LoadAssetBundle(BundleName)
        // this.ResData[BundleName][path] = null
        ab.release(path, type);
    }

    /**
     * 释放分包中指定目录内的全部资源
     * @param BundleName 分包名
     * @param dirName 目录
     */
    public ReleaseAssetInDir(BundleName: Enum_AssetBundle | string, dirName: string) {
        if (this.isBundleLoadFinished(BundleName)) {
            const ab = assetManager.getBundle(BundleName);
            const infos = ab.getDirWithPath(dirName);
            console.log("release assets in dir", infos);

            for (const element of infos) {
                ab.release(element.path);
            }

            return true;
        }

        return false;
    }

    /**
     * 释放这个分包全部资源
     * @param BundleName 分包名
     * @returns 
     */
    public ReleaseAllAssetsInBundle(BundleName: Enum_AssetBundle | string) {
        if (this.isBundleLoadFinished(BundleName)) {
            console.log("ReleaseAllAssetsInBundle -->", BundleName);

            const ab = assetManager.getBundle(BundleName);
            ab.releaseAll();

            return true;
        }

        return false;
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

    /**加载该分包内全部内容 */
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
                if (err) {
                    reject(err);
                }

                log("LoadDirInBundle", bundleName, dirName, data);
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
