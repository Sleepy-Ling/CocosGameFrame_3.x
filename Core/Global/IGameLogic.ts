import { Enum_GameState } from "../../Def/EnumDef";

export interface IGameLogic {
    state: Enum_GameState;
    /**游戏开始 */
    start(): boolean;
    /**游戏暂停 */
    pause(): boolean;
    /**游戏重开 */
    restart(): boolean;

    update(dt: number): boolean;
}