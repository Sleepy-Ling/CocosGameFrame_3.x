import { Asset, AssetManager, assetManager, SpriteAtlas, SpriteFrame, sys, Texture2D } from "cc";
import { DEBUG } from "cc/env";
import { Enum_AssetBundle, AtlasType } from "../../Def/EnumDef";
import ManagerBase from "../Manager/ManagerBase";

export class ResourcesManager extends ManagerBase {
    ABData: AssetManager.Bundle[] = []
    ResData: { [key: string]: { [key: string]: any } } = {};
    public async LoadSpriteFrameFromAtlas(BundleName: Enum_AssetBundle | string, path: string, tex_name: string, atlasType: AtlasType = AtlasType.default) {
        let p = new Promise<SpriteFrame>(async (resolve) => {
            if (sys.isBrowser && DEBUG) {
                let loadFilePath2 = path ? `${path}/${atlasType}` : atlasType;
                let assetExist = await this.isHasAssetRes(BundleName, loadFilePath2);

                let loadFilePath = path ? `${path}/${tex_name}` : tex_name;
                let tex = await this.LoadAssetRes<Texture2D>(BundleName, loadFilePath);

                let sf = new SpriteFrame();
                sf.texture = tex;
                resolve(sf);
            }
            else {
                let loadFilePath = path ? `${path}/${atlasType}` : atlasType;

                let assetExist = await this.isHasAssetRes(BundleName, loadFilePath);
                // console.log("assetExist", assetExist);

                if (assetExist) {
                    let asset = await this.LoadAssetRes<SpriteAtlas>(BundleName, loadFilePath);

                    if (asset) {
                        let sf: SpriteFrame = asset.getSpriteFrame(tex_name);
                        if (!sf) {
                            let loadFilePath = path ? `${path}/${tex_name}` : tex_name;
                            let tex = await this.LoadAssetRes<Texture2D>(BundleName, loadFilePath);
                            sf = new SpriteFrame();
                            sf.texture = tex;
                        }
                        resolve(sf);
                    }
                }
                else {
                    let loadFilePath = path ? `${path}/${tex_name}` : tex_name;

                    let tex = await this.LoadAssetRes<Texture2D>(BundleName, loadFilePath);

                    let sf = new SpriteFrame();
                    sf.texture = tex;
                    resolve(sf);
                }
            }

        })

        return p;

    }

    /**直接获取已经加载的资源 */
    public syncLoadAssetRes<T extends Asset>(BundleName: Enum_AssetBundle | string, path: string): T {
        if (this.ResData[BundleName][path]) {
            return this.ResData[BundleName][path];
        }

        return null;
    }

    public async isHasAssetRes(BundleName: Enum_AssetBundle | string, path: string): Promise<boolean> {
        let p: Promise<boolean> = new Promise<boolean>(async (resolve) => {
            if (this.ResData[BundleName] && this.ResData[BundleName][path] != null) {
                resolve(true);
            }
            else {
                let bundle = await this.LoadAssetBundle(BundleName);
                // console.log("bundle", bundle);

                const assetInf = bundle["_config"]["paths"]["_map"];


                for (const key in assetInf) {
                    if (key == path) {
                        resolve(true);
                    }
                }


                resolve(false);
            }

            resolve(false);
        })

        return p;
    }

    public async LoadAssetRes<T extends Asset>(BundleName: Enum_AssetBundle | string, path: string): Promise<T> {
        // console.log("LoadAssetRes", BundleName, path);
        return await new Promise(async (resolve, reject) => {
            if (this.ResData[BundleName] == null) {
                this.ResData[BundleName] = []
            }
            if (this.ResData[BundleName][path] != null) {
                resolve(this.ResData[BundleName][path])
            } else {
                let asset = await this.LoadAssetBundle(BundleName)
                // console.log("bundle ", asset);

                asset.load<T>(path, (err, res: T) => {
                    if (err != null) {
                        console.log("LoadAssetRes", BundleName, path, "Fail", err)
                        // resolve(null)

                        console.trace();

                        reject(err);
                        return
                    }
                    this.ResData[BundleName][path] = res
                    resolve(res)
                })
            }

        })
    }

    public async ReleaseAssetRes(BundleName: Enum_AssetBundle | string, path: string) {
        if (this.ResData[BundleName] == null) {
            return
        }
        if (this.ResData[BundleName][path] == null) {
            return
        }
        let ab = await this.LoadAssetBundle(BundleName)
        this.ResData[BundleName][path] = null
        ab.release(path)
    }

    public async LoadAssetBundle(BundleName: Enum_AssetBundle | string): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            if (this.ABData[BundleName] != null) {
                resolve(this.ABData[BundleName])
            } else {
                assetManager.loadBundle(BundleName, (err, bundle) => {
                    if (err) {
                        console.log("LoadAssetBundle", BundleName, "Fail", err)
                        reject(null)
                        return
                    }
                    this.ABData[BundleName] = bundle

                    resolve(bundle)
                })
            }

        })
    }
}

