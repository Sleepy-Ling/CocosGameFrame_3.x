export class CustomEvents {
    /**窗口打开事件 */
    public static OnViewOpen = "OnViewOpen";
    /**窗口关闭事件 */
    public static OnViewClose = "OnViewClose";

    /**游戏从后台转到前台 */
    public static GameShowFromBackground = "GameShowFromBackground";
    /**游戏从前台转到后台 */
    public static GameHideInBackground = "GameHideInBackground";


    /*------------游戏相关消息------------*/
    public static PauseGame = "PauseGame";
    public static ResumeGame = "ResumeGame";
    public static RestartGame = "RestartGame";

    /**开始某个关卡 */
    public static StartLevel = "StartLevel";
    /**通关 */
    public static LevelFinish = "LevelFinish";
    /**3d 世界初始化完成 */
    public static Init3DWorldFinish = "Init3DWorldFinish";
    /**游戏开始 */
    public static StartGame3D = "StartGame3D";
    public static StartGame2D = "StartGame2D";
    /**选择载具 */
    public static SelectConveyance = "SelectConveyance";
    /**使用广告火箭 */
    public static UseSuperSpeed = "UseSuperSpeed";
    /**改变皮肤 */
    public static OnSkinChange = "OnSkinChange";
    /**改变皮肤后开始游戏 */
    public static SkinChangeAndStartLevel = "SkinChangeAndStartLevel";

    /**更新玩家进度位置 */
    public static UpdatePlayerProgress = "UpdatePlayerProgress";
    /**更新玩家位置 */
    public static UpdatePlayerPosition = "UpdatePlayerPosition";
    /**冲线 */
    public static HitFinalLine = "HitFinalLine";
    /**渲染3d 形象 */
    public static Render3dConveyanceImage = "Render3dConveyanceImage";
    /**停止渲染3d 形象 */
    public static StopRender3dConveyanceImage = "StopRender3dConveyanceImage";

    public static OnCurrencyChange = "OnCurrencyChange";

    public static ShowDebug = "ShowDebug";

    public static LoadingProgress = "LoadingProgress";
    public static LoadingUpdate = "LoadingUpdate";

    /**撞击障碍物事件 */
    public static ImpactObstacle = "ImpactObstacle";

    /*------------调试相关消息------------*/
    public static Debug_PassGame = "Debug_PassGame";
    public static Debug_SetPlayerHp = "Debug_SetPlayerHp";
    public static Debug_JumpLevel = "Debug_JumpLevel";


    public static Debug_ShowDamage = "Debug_ShowDamage";
    public static DebugNode = "DebugNode";
    public static DebugAddBuff = "DebugAddBuff";

    public static DebugSetEscortPlaneHp = "DebugSetEscortPlaneHp";
}

