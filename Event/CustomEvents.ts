export class CustomEvents {
    /**窗口打开事件 */
    public static OnViewOpen = "OnViewOpen";
    /**窗口关闭事件 */
    public static OnViewClose = "OnViewClose";

    /**游戏从后台转到前台 */
    public static GameShowFromBackground = "GameShowFromBackground";
    /**游戏从前台转到后台 */
    public static GameHideInBackground = "GameHideInBackground";

    public static LoadingProgress = "LoadingProgress";
    /*------------碰撞相关消息------------*/
    public static CollisonEvent = "CollisonEvent";

    /*------------游戏相关消息------------*/
    public static PauseGame = "PauseGame";
    public static ResumeGame = "ResumeGame";
    public static RestartGame = "RestartGame";


    /**缩放游戏摄像头 */
    public static ScaleGameCamera = "ScaleGameCamera";
    /**移动游戏摄像头 */
    public static MoveGameCamera = "MoveGameCamera";
    /**选择卡片中 */
    public static OnSelectingCard = "OnSelectingCard";
    /**移动放置助手事件 */
    public static OnMovePlaceAssistant = "OnMovePlaceAssistant";
    // /**选择卡片中 */
    // public static OnSelectingCard = "OnSelectingCard";

    /**点击世界界面 */
    public static ClickWorldView = "ClickWorldView";
    /**点击塔 */
    public static ClickTower = "ClickTower";
    /**取消点击塔 */
    public static CancelClickTower = "CancelClickTower";
    /**升级塔 */
    public static PlaceTower = "PlaceTower";
    /**升级塔 */
    public static UpgradeTower = "UpgradeTower";
    /**移除塔 */
    public static RemoveTower = "RemoveTower";
    /**生成小怪 */
    public static GenerateEnemy = "GenerateEnemy";
    /**清除小怪 */
    public static ClearAllEnemy = "ClearAllEnemy";
    /**生成子弹 */
    public static ShootBullet = "ShootBullet"

    /**游戏对象加入世界完成 */
    public static onGameObjectJoinSceneFinish = "onGameObjectJoinSceneFinish";
    /**游戏对象移除完成 */
    public static onGameObjectRemovedFinish = "onGameObjectRemovedFinish";

    /**移除游戏对象 (非即时移除) */
    public static RemoveObject = "RemoveObject";

    /**人物攻击事件 */
    public static ObjectAttack = "ObjectAttack";
    /**范围攻击 */
    public static AreaAttack = "AreaAttack";
    /**范围伤害技能 */
    public static AreaDamageSkillTrigger = "AreaDamageSkillTrigger";
    /**闪电链 */
    public static LightningChainAttack = "LightningChainAttack";
    // /**攻击伤害事件 （技能、道具）*/
    // public static TriggerDamage = "TriggerDamage";
    /**触发游戏事件 */
    public static TriggerGameEvent = "TriggerGameEvent";
    /*------------调试相关消息------------*/
    public static Debug_PassGame = "Debug_PassGame";
    public static Debug_SetPlayerHp = "Debug_SetPlayerHp";
    public static Debug_JumpLevel = "Debug_JumpLevel";


    public static Debug_ShowDamage = "Debug_ShowDamage";
    public static DebugNode = "DebugNode";
    public static DebugAddBuff = "DebugAddBuff";

    public static DebugSetEscortPlaneHp = "DebugSetEscortPlaneHp";
}

