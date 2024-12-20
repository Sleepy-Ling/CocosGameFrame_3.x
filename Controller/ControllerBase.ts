 export default abstract class ControllerBase {
    public abstract init(...param: unknown[]): boolean;
    public abstract update(inf: unknown): boolean;
}

