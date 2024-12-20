import { v2 } from "cc";
import { GM } from "../Global/GM";
import { PopUpItemBaseParam } from "../PopUp/PopUpItemBase";
import { ToastParam } from "../PopUp/Toast";


import ManagerBase from "./ManagerBase";

/**飘字管理者 */
export default class ToastManager extends ManagerBase {

    /**显示飘字提示 */
    ShowToast(toastID: number, content: string, duration: number = 2, closeCallBack?: Function) {
        let param: PopUpItemBaseParam;
        if (toastID == 0) {
            let curParam: ToastParam = {
                position: v2(375, 1212),
                offsetY: -50,
                tweenTime: 0.5,
                closeCallBack: closeCallBack
            };

            param = curParam;
        }

        GM.uiManager.ShowToast(toastID, content, duration, param);
    }
}