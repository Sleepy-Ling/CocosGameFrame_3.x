import { Button, Component, EventTouch, Label, Node, RichText, TTFFont, Vec2, _decorator } from 'cc';
import { AudioName, ConfigType, Enum_AssetBundle, Enum_Language, Enum_Orientation } from '../../Def/EnumDef';

import { GM } from '../../Global/GM';

import IViewBase from './IViewBase';
import { ResourcesManager } from '../../Manager/ResourcesManager';
const { ccclass, property, menu } = _decorator;

/**界面过渡参数 */
export class ViewTranstionParam {
    /**过渡时所用到的加载界面（值等同于UIName） */
    loadingViewType: string;

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
export class ViewBase<T extends ViewParamBase> extends Component implements IViewBase {
    /**首次应用字体 */
    protected firstApplyFont: boolean = true;

    protected viewParam: T;
    start(): void {

    }
    /**首次初始化界面
     * (注意：该方法只会在加载后执行一次,可以把ui绑定写在此处)
     */
    public async firstInitView(param?: T): Promise<boolean> {
        return Promise.resolve(true);
    }

    /**预初始化 */
    public async preInitView(param: T): Promise<boolean> {
        return Promise.resolve(true);

    }

    /**预加载对应场景资源 */
    public async preLoadSrc(viewName: string, param: T): Promise<boolean> {
        //读取界面资源预加载配置
        const json = GM.configManager.getConfig(ConfigType.Table_ViewLoadRes);
        if (!json || !json[viewName]) {
            return Promise.resolve(true);
        }

        console.log(viewName, "preloadSrc start -->");

        let preLoadPromiseList: Promise<any>[] = [];
        let data = json[viewName];
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length / 2; i++) {
            let idx = i + 1;
            let moduleName: string = data[`module_${idx}`];
            let directory: string = data[`directory_${idx}`];

            console.log("moduleName:", moduleName, "directory:", directory);

            let p = ResourcesManager.LoadDirInBundle(moduleName, directory);
            preLoadPromiseList.push(p);
        }

        //预加载全部必要的资源
        await Promise.all(preLoadPromiseList);

        console.log(viewName, "preloadSrc end ---->");

        return Promise.resolve(true);
    }


    protected onTouchView(evt: EventTouch) {
        let worldPosition: Vec2 = evt.getLocation();
        console.log("onTouchView ===>", evt.target.name, "touch pos", `{x:${worldPosition.x},y:${worldPosition.y}}`);


    }


    /**在界面打开时触发 */
    public onViewOpen(param: T) {
        this.viewParam = param;

        if (param && param.openCallBack) {
            param.openCallBack();
        }

        // if (IS_LOG_TOUCH_DETAIL) {
        //     this.node.on(Node.EventType.TOUCH_END, this.onTouchView, this);
        // }
    };

    /**在界面关闭时触发 */
    public onViewClose(param?: T) {
        if (this.viewParam && this.viewParam.closeCallBack) {
            this.viewParam.closeCallBack(param);
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

    public 
}

