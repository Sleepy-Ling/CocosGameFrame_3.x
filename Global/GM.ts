import { AudioManager } from "../Manager/AudioManager";
import AudioManagerBase from "../Manager/AudioManagerBase";
import CameraManager from "../Manager/CameraManager";
import ConfigManager from "../Manager/ConfigManager";
import EventDispatcherManager from "../Manager/EventDispatcherManager";
import { TimeStampManager } from "../Manager/TimeStampManager";
import PreLoadManager from "../Manager/PreLoadManager";
import { RewardDistributeManager } from "../Manager/RewardDistributeManager";
import TimerManager from "../Manager/TimerManager";
import ToastManager from "../Manager/ToastManager";
import UIManager from "../Manager/UIManager";
import Ad_Manager from "../Manager/Ad_Manager";
import { Camera, Graphics, Node } from "cc";
import { Enum_EventType } from "../Def/EnumDef";
import { CollisionManager } from "../Manager/CollisionManager";
import { Debug_Collision_Visible } from "../Def/ConstDef";
import GameDataManagerBase from "../Manager/GameDataManagerBase";

/**
 * 游戏主管 GameMaster
 *
 ** 这里面的成员类都可以改成自己继承的类，用于统一外部访问调用
 */
export namespace GM {
    /**ui管理者 */
    export const uiManager: UIManager = new UIManager();
    /**摄像机管理者 */
    export const cameraManager: CameraManager = new CameraManager();
    /**游戏数据管理者 */
    export const gameDataManager: GameDataManagerBase = new GameDataManagerBase();
    /**音频管理者 */
    export const audioManager: AudioManagerBase = initAudioManager();
    /**配置管理者 */
    export const configManager: ConfigManager = new ConfigManager();
    /**预加载管理者 */
    export const preLoadManager: PreLoadManager = new PreLoadManager();
    /**奖励派发者 */
    export const rewardDistributeManager: RewardDistributeManager = new RewardDistributeManager();
    /**
     * 事件派发管理者 （按模块类型区分）
     * @description 具体调用例子 const gameEventDispatcher = GM.eventDispatcherManager.getEventDispatcher("模块名");
     */
    export const eventDispatcherManager = new EventDispatcherManager();
    /**飘字管理者 */
    export const toastManager = new ToastManager();
    /**新手指引管理者 */
    // export const tutorialManager = new TutorialManager();
    /**时间戳管理者 */
    export const timeStampManager = new TimeStampManager();
    /**游戏进行时的计时器管理者 */
    export const gamingTimerManager: TimerManager = new TimerManager();
    /**广告相关的管理者 */
    export const ad_Manager = new Ad_Manager();

    export const colliderManager = new CollisionManager();

    export interface IInitParam {
        audioSourceRoot: Node;
        root_ui: Node;
        root_3d: Node;
        uiCamera: Camera;
        gameCamera: Camera;
        forwardCamera: Camera;
        /**当前时间戳 */
        now: number;
        graphics: Graphics,
    }

    /**初始化 */
    export async function init(p: IInitParam) {
        gameDataManager.init(p.now);
        eventDispatcherManager.init();

        const uiEventDispatcher = eventDispatcherManager.getEventDispatcher(Enum_EventType.UI);
        const getLanguageCallback = gameDataManager.getLanguage;
        uiManager.init(p.root_ui, uiEventDispatcher, getLanguageCallback);
        cameraManager.init(p.uiCamera, p.gameCamera, p.forwardCamera);

        preLoadManager.init();
        configManager.init();
        rewardDistributeManager.init();
        audioManager.init(p.audioSourceRoot);
        timeStampManager.init();
        gamingTimerManager.init();
        ad_Manager.init();
        toastManager.init();
        colliderManager.init(p.graphics, Debug_Collision_Visible);
        //初始化红点系统
        // const redDotSf = await ResourcesManager.LoadSpriteFrameFromAtlas(Enum_AssetBundle.Icon, null, "RedDot");
        // RedDotSystem.init(redDotSf);

        // gameController.init(p.root_3d, 0);

        return Promise.resolve(true);
    }

    /**初始化音频管理者 */
    function initAudioManager(): AudioManagerBase {
        return new AudioManager();
    }
}
