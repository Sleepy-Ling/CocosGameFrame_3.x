// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Camera } from "cc";
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

}