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

    /*------------调试相关消息------------*/
    public static Debug_PassGame = "Debug_PassGame";
    public static Debug_SetPlayerHp = "Debug_SetPlayerHp";
    public static Debug_JumpLevel = "Debug_JumpLevel";


    public static Debug_ShowDamage = "Debug_ShowDamage";
    public static DebugNode = "DebugNode";
    public static DebugAddBuff = "DebugAddBuff";

    public static DebugSetEscortPlaneHp = "DebugSetEscortPlaneHp";
}

