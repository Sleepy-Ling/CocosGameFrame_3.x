export default interface IRecoverObject {
    /**回收标签 */
    recoverTag: string;
    needRecover: boolean;
    onRecover(): boolean;
}