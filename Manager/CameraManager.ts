// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Camera, Node, Vec3 } from "cc";
import ManagerBase from "./ManagerBase";


export default class CameraManager extends ManagerBase {
    protected uiCamera: Camera;
    protected gameCamera: Camera;
    protected forwardCamera: Camera;

    init(mainCamera: Camera, gamingCamera?: Camera, forwardCamera?: Camera) {
        this.uiCamera = mainCamera;
        this.gameCamera = gamingCamera;
        this.forwardCamera = forwardCamera;

        return super.init();
    }

    public getUICamera() {
        return this.uiCamera;
    }

    public getGameCamera() {
        return this.gameCamera;
    }

    public getForwardCamera() {
        return this.forwardCamera;
    }

    /**
     * 计算不同正交相机下的世界坐标转换
     * @param worldPos UI节点世界坐标
     * @param fromCamera 源摄像机
     * @param toCamera 目标摄像机
     * @returns 转换后的世界坐标
     */
    public convertWorldPosition(worldPos: Vec3, fromCamera: Camera, toCamera: Camera): Vec3 {
        // 1. 获取节点在源摄像机下的世界坐标
        // worldPos

        // 2. 计算两个相机的正交高度比例
        const fromOrthoHeight = fromCamera.orthoHeight;
        const toOrthoHeight = toCamera.orthoHeight;
        const scale = toOrthoHeight / fromOrthoHeight;

        // 3. 创建新的世界坐标
        const newWorldPos = new Vec3();

        // 4. 根据正交高度比例调整坐标
        Vec3.multiply(newWorldPos, worldPos, new Vec3(scale, scale, 1));

        // 5. 考虑相机位置偏移
        const fromCameraPos = fromCamera.node.getWorldPosition();
        const toCameraPos = toCamera.node.getWorldPosition();

        // 计算相对于源相机的偏移
        newWorldPos.subtract(fromCameraPos);
        // 缩放偏移
        newWorldPos.multiply(new Vec3(scale, scale, 1));
        // 加上目标相机的位置
        newWorldPos.add(toCameraPos);

        return newWorldPos;
    }


}