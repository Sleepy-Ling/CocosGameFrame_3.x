
/**管理者基类 */
export default abstract class ManagerBase {
    /**管理器初始化 */
    public init(inf?: unknown): any {

        return true;
    }

    /**
     * 管理器每帧tick 函数
     * @param deltaTime 距离上一帧时间间隔 单位：秒
     */
    public update(deltaTime?: number) {

    }

}
