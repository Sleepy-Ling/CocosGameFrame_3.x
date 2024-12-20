import { Button, Component, EventTouch, Label, Node, RichText, TTFFont, Vec2, _decorator } from 'cc';
import { AudioName, Enum_AssetBundle, Enum_Language, Enum_Orientation } from '../../Def/EnumDef';
import { SDKManager } from '../../SDK/SDKManager';

import { GM } from '../Global/GM';

import IViewBase from './IViewBase';
const { ccclass, property, menu } = _decorator;

/**界面过渡参数 */
export class ViewTranstionParam {
    /**过渡时所用到的加载界面（值等同于UIName） */
    loadingViewType: number;

    /**所属分包 */
    bundle?: Enum_AssetBundle;
}

/**打开界面参数 */
export class ViewParamBase {
    closeCallBack: Function;
    openCallBack: Function;
}

/**界面基类 */
@ccclass()
@menu("View/ViewBase")
export class ViewBase extends Component implements IViewBase {
    @property(Node)
    protected icon_AdList: Node[] = [];

    /**首次应用字体 */
    protected firstApplyFont: boolean = true;

    protected viewParam: ViewParamBase;
    start(): void {

    }

    /**当前是否为有广告的ui界面 */
    @property({ tooltip: "值为true时，在界面打开或关闭，会调用广告页面参数" })
    private isPageCallAd: boolean = false;

    /**首次初始化界面
     * (注意：该方法只会在加载后执行一次,可以把ui绑定写在此处)
     */
    public async firstInitView(param?: ViewParamBase): Promise<boolean> {
        return Promise.resolve(true);
    }

    /**预初始化 */
    public async preInitView(param: ViewParamBase): Promise<boolean> {
        return Promise.resolve(true);

    }

    /**预加载对应场景资源 */
    public async preLoadSrc(param: ViewParamBase): Promise<boolean> {
        return Promise.resolve(true);

    }


    protected onTouchView(evt: EventTouch) {
        let worldPosition: Vec2 = evt.getLocation();
        console.log("onTouchView ===>", evt.target.name, "touch pos", `{x:${worldPosition.x},y:${worldPosition.y}}`);


    }


    /**在界面打开时触发 */
    public onViewOpen(param: ViewParamBase) {
        this.viewParam = param;

        if (param && param.openCallBack) {
            param.openCallBack();
        }

        if (this.isPageCallAd) {
            SDKManager.showAd(this.node.name + "OpenAd");
        }

        // if (IS_LOG_TOUCH_DETAIL) {
        //     this.node.on(Node.EventType.TOUCH_END, this.onTouchView, this);
        // }
    };

    /**在界面关闭时触发 */
    public onViewClose(param?: any) {
        if (this.viewParam && this.viewParam.closeCallBack) {
            this.viewParam.closeCallBack(param);
        }

        if (this.isPageCallAd) {
            SDKManager.showAd(this.node.name + "CloseAd");
        }


        // if (IS_LOG_TOUCH_DETAIL) {
        //     this.node.off(Node.EventType.TOUCH_END, this.onTouchView, this);
        // }
    };

    /**在界面关闭前触发 */
    public onViewCloseBefore() {

    }

    /**
     * 界面语种切换
     * @param lang 
     */
    public onChangeLanguage(lang: Enum_Language): void {
    }

    /**
     * 横竖屏切换
     * @param ori 
     */
    public onChangeOrientation(ori: Enum_Orientation): void {
    }

    /**屏幕尺寸改变 */
    public onFrameResize(): void {
    }

    /**
     * 监听按钮点击事件
     * @param curButton 按钮节点
     * @param clickFuncName 点击事件函数名
     * @param target 作用域
     * @param compName 组件名
     * @param customEventData 自定义数据string
     * @param actionID 行为id
     * @param clearOldListener 是否清除旧的监听事件
     * @returns 
     */
    protected bindBtnClickEvent(button: Node | Button, clickFuncName: string, target: Node, compName: string, customEventData: string = "", actionID: number = undefined, clearOldListener: boolean = false, btnClickSound?: AudioName) {
        if (button == null) {
            console.error("bindBtnClickEvent error: null object ===>", this.node.name,);
            return;
        }

        let curButton: Button;
        if (button instanceof Node) {
            curButton = button.getComponent(Button);
            if (!curButton) {
                console.error("bindBtnClickEvent error:no Button component ===>", this.node.name,);
                return;
            }
        }
        else {
            curButton = button;
        }

        if (clearOldListener) {
            curButton.clickEvents = [];
        }

        if (curButton.clickEvents == null) {
            curButton.clickEvents = [];
        }

        let clickEventHandler = new Component.EventHandler();
        clickEventHandler.target = target;
        clickEventHandler.component = compName;
        clickEventHandler.handler = clickFuncName;
        clickEventHandler.customEventData = customEventData;
        curButton.clickEvents.push(clickEventHandler);

        clickEventHandler = new Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = compName;
        clickEventHandler.handler = "triggerBtnSound";
        clickEventHandler.customEventData = btnClickSound;
        curButton.clickEvents.push(clickEventHandler);

        // clickEventHandler = new Component.EventHandler();
        // clickEventHandler.target = this.node;
        // clickEventHandler.component = compName;
        // clickEventHandler.handler = "triggerLogBtn";
        // clickEventHandler.customEventData = compName;
        // curButton.clickEvents.push(clickEventHandler);

        if (actionID != undefined && !isNaN(actionID)) {//绑定该按钮行为id
            clickEventHandler = new Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = compName;
            clickEventHandler.handler = "triggerAction";
            clickEventHandler.customEventData = actionID.toString();
            curButton.clickEvents.push(clickEventHandler);
        }
    }

    protected triggerBtnSound(evt: EventTouch, soundName: string) {
        // console.log("soundName", soundName);

        soundName = soundName == null ? AudioName.ClickBtn : soundName;
        GM.audioManager.PlayEffect(soundName, false);
    }

    protected closeSelf() {
        GM.uiManager.CloseUI(this);
    }

    public applyFont(font: TTFFont) {
        if (!this.firstApplyFont) {
            return;
        }

        this.firstApplyFont = false;

        let labList = this.getComponentsInChildren(Label);
        labList.forEach((comp) => {
            comp.font = font;
        })

        let richTextList = this.getComponentsInChildren(RichText);
        richTextList.forEach((comp) => {
            comp.font = font;
        })
    }
}

