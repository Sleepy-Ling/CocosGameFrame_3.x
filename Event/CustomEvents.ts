/**框架内部消息定义 */
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

    /**游戏对象加入世界完成 */
    public static onGameObjectJoinSceneFinish = "onGameObjectJoinSceneFinish";
    /**游戏对象移除完成 */
    public static onGameObjectRemovedFinish = "onGameObjectRemovedFinish";

    /**移除游戏对象 (非即时移除) */
    public static DelayRemoveObject = "RemoveObject";
    /*------------调试相关消息------------*/
    public static Debug_PassGame = "Debug_PassGame";
    public static Debug_SetPlayerHp = "Debug_SetPlayerHp";
    public static Debug_JumpLevel = "Debug_JumpLevel";


    public static Debug_ShowDamage = "Debug_ShowDamage";
    public static DebugNode = "DebugNode";
    public static DebugAddBuff = "DebugAddBuff";

    public static DebugSetEscortPlaneHp = "DebugSetEscortPlaneHp";
}

