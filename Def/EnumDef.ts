/**枚举定义 */
import { Enum } from 'cc';

//#region  广告相关
export enum AdType {
    TT,
    WeChat,
    QQ,
    None,
    UMWeChat,
    UMOppo,
    UMVivo,
    Native,
}


/**
 *配置
 *
 * @export
 * @enum {number}}
 */
export enum ConfigType {
    Table_Level = "Table_Level",
    Table_MovementBase = "Table_MovementBase",
    Table_Road = "Table_Road",
    Table_Skin = "Table_Skin",
}

/**
 *
 *资源分包
 * @export
 * @enum {number}
 */

export enum Enum_AssetBundle {
    /**存放通用模块 */
    Common = "Common",
    /**音频 */
    Audio = "Audio",
    PopUpToast = "PopUpToast",
    Icon = "Icon",
    Game = "Game",
    Config = "Config",
}


/**
 *音效
 *
 * @export
 * @enum {number}
 */


export enum AudioName {
    None = "",

    BGM = "shape shift BG",
    ClickBtn = "",
    SwitchViewFinish = "",

    /**人物走路声音 */
    player = "player",

    spider_walk_04 = "spider_walk_04",
    spider_walk_05 = "spider_walk_05",
    spider_walk_06 = "spider_walk_06",
    spider_walk_07 = "spider_walk_07",

    Tank = "Tank",
    Boat = "Boat",
    Carwithhorn = "Carwithhorn",
    Cycle = "Cycle",
    ZombieTruck = "ZombieTruck",
    FastRun = "FastRun",
    QuadBike = "QuadBike",
    snowreal = "snowreal",
    Bike = "Bike",
    car = "car",
    jetplane = "jetplane",

    TNT = "Tnt",
    baloon1 = "baloon1",
    Paint = "Paint",

    settlement = "4thlevel",
    fireWork = "NewIconic",
    Star = "Star Sound",
    upgrade = "UI_Upgrade",

    UI_Back = "UI_Back",
}

// export const Enum_Sound = Enum(AudioName);

export enum AtlasType {
    default = "AutoAtlas",
}


export enum UIName {
    //root 层
    MainGameView,

    //ui层
    TestView,
    TestView2,
    MainGameHUDView,
    SkinView,
    SkinRewardView,
    NewPlayerView,
    UnlockConveyanceView,
    SettlementView,
    RandomSkinView,
    SettingView,
    DebugView,
    ColliderTestView,
    //pop 层

    //loading层
    LoadingView = 1001,
}

/**游戏状态 */
export enum Enum_GameState {
    None,
    Gaming = 1 << 0,
    GamePause = 1 << 1,
    GameEnd = 1 << 2,
}


/**在线参数 */
export enum Enum_OnlineParam {

}

export enum Enum_UserSettingType {
    None,
    /**背景音乐 */
    BGM,
    /**音效 */
    SoundsEff,
    /**震动 */
    Vibrate,
    /**灵敏度 */
    Sensitivity,
    /**游戏控制模式 */
    GameControlMode,
    /**游戏ui模式 */
    GameUIMode,

}

export enum Enum_Orientation {
    Portrait,
    Horizontal,
}
export enum Enum_Language {
    EN = "EN",
    CN = "CN",
}

/**层级类型 */
export enum Enum_Layer {
    Main,
    UI,
    Pop,
    Loading,
    Background,
    Guide,
    recovery,

    GM,
}

export enum Enum_GameObject {
    Tower,
    Monster,
}

export enum Enum_VibrateType {
    light,
    medium,
    heavy,
}

/**消息类型 */
export enum Enum_EventType {
    /**全局 */
    Global,
    /**ui层 */
    UI,
    /**游戏类 */
    Game,
    /**货币类 */
    Currency,

    /**新手教学 */
    Guide,
 
    Debug,
}


/**解锁类型 */
export enum Enum_UnlockType {
    None,

}

/**货币分类 */
export enum Enum_Currency {
    /**金币 */
    Gold = 101,
    /**钻石 */
    Gem = 102,

}

export enum Enum_RewardState {
    /**未完成 */
    NotFinished,
    /**未领取 */
    NotTake,
    /**已经领取 */
    HasTaken,
}

/**签到状态 */
export enum Enum_SignInState {
    /**空 */
    None,
    /**当天 */
    CurDay,
    /**可领取 */
    CanTake,
}

export enum Enum_AdType {

}

/**移动人物/载具状态 */
export enum Enum_ConveyanceState {
    Idle,
    Moving,
    Climbing,
    ClimbingEnding,
    Flying,
    StayFlyingTop,
    Fall,
}

// /**碰撞盒分组 */
// export enum Enum_ColliderGroup {
//     Default,
//     Ground = 1 << 1,
//     ClimbWall = 1 << 2,
//     Player = 1 << 3,
//     ClimbWallEnd = 1 << 4,
//     FinishLine = 1 << 5,
//     Rocket = 1 << 6,
//     Obstacle = 1 << 7,
//     All = 1 << 8,
//     Water = 1 << 9,
// }

/**障碍物类型 */
export const Enum_ObstacleType = Enum({
    None: 0,
    Balloon: 1,
    TNT: 2,
    Bucket: 3,
})

/**汽车类型 */
export const Enum_CarType = Enum({
    None: 0,
    Car: 1,
    Tank: 2,
    ZombieTruck: 3,
})

/**地形类型 */
export enum Enum_GroundType {
    None,
    /**平地 */
    Ground = 1,
    /**雪地 */
    SnowGround = 2,
    /**水 */
    Water = 3,
    /**独木桥 */
    SingleLogBridge = 4,
    /**泥地 */
    MudGround = 5,
}

export enum Enum_SkinLv {
    None,
    /**普通 */
    Normal,
    /**稀有 */
    Rare,
    /**史诗 */
    Epic,
}