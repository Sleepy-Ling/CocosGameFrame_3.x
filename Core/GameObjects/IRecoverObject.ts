export default interface IRecoverObject {
    /**回收标签 */
    recoverTag: string;
    onRecover(): boolean;
}