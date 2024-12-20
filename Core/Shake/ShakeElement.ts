import { MathUtil } from "../Utils/MathUtil";

 
export class ShakeElement {
    /**甩动限制 */
    ShakeElementLimite: IShakeElementLimite = {
        Shake_X_Max_Distance: 0,
        Shake_X_Min_Distance: 0,
        Shake_Y_Max_Distance: 0,
        Shake_Y_Min_Distance: 0,
        ShakeInterval: 0,
        ShakeDuration: 0
    };
    /**是否生效 */
    _IsTakeEffect: boolean = false;
    get IsTakeEffect(): boolean {
        return this._IsTakeEffect;
    }

    /**甩动时长 */
    ShakeDuration: number = 1;
    /**当前甩动偏移值x */
    NowShakeOffX: number = 0;
    /**当前甩动偏移值Y */
    NowShakeOffY: number = 0;

    /**随机取值计时器 */
    private _random_change_timer: number;

    init(param: IShakeElementLimite) {
        this.ShakeElementLimite.Shake_X_Max_Distance = param.Shake_X_Max_Distance || 0;
        this.ShakeElementLimite.Shake_X_Min_Distance = param.Shake_X_Min_Distance || 0;
        this.ShakeElementLimite.Shake_Y_Max_Distance = param.Shake_Y_Max_Distance || 0;
        this.ShakeElementLimite.Shake_Y_Min_Distance = param.Shake_Y_Min_Distance || 0;
        this.ShakeDuration = param.ShakeDuration;
        this._random_change_timer = 0;

        this.NowShakeOffX = MathUtil.randomFloat(this.ShakeElementLimite.Shake_X_Min_Distance, this.ShakeElementLimite.Shake_X_Max_Distance);
        this.NowShakeOffY = MathUtil.randomFloat(this.ShakeElementLimite.Shake_Y_Min_Distance, this.ShakeElementLimite.Shake_Y_Max_Distance);
    }

    start() {
        this._IsTakeEffect = true;
    }

    stop() {
        this._IsTakeEffect = false;
    }

    update(dt: number) {
        if (!this.IsTakeEffect) {
            return;
        }

        this.ShakeDuration -= dt;
        if (this.ShakeDuration <= 0) {
            if (this.finishCallBack) {
                this.finishCallBack();
            }
            
            this.reset();
        }

        this._random_change_timer += dt;
        if (this._random_change_timer >= this.ShakeElementLimite.ShakeInterval) {
            this._random_change_timer -= this.ShakeElementLimite.ShakeInterval;

            this.NowShakeOffX = MathUtil.randomFloat(this.ShakeElementLimite.Shake_X_Min_Distance, this.ShakeElementLimite.Shake_X_Max_Distance);
            this.NowShakeOffY = MathUtil.randomFloat(this.ShakeElementLimite.Shake_Y_Min_Distance, this.ShakeElementLimite.Shake_Y_Max_Distance);
        }
    }

    reset() {
        this.ShakeElementLimite.Shake_X_Max_Distance = 0;
        this.ShakeElementLimite.Shake_X_Min_Distance = 0;
        this.ShakeElementLimite.Shake_Y_Max_Distance = 0;
        this.ShakeElementLimite.Shake_Y_Min_Distance = 0;

        this.NowShakeOffX = this.NowShakeOffY = 0;
        this._IsTakeEffect = false;
    }

    protected finishCallBack: Function;
    setFinishCallBack(cb: Function) {
        this.finishCallBack = cb;

    }
}

export interface IShakeElementLimite {
    Shake_X_Max_Distance: number;
    Shake_X_Min_Distance: number;
    Shake_Y_Max_Distance: number;
    Shake_Y_Min_Distance: number;

    /**甩动间隔 单位：秒*/
    ShakeInterval: number;
    /**甩动时长 */
    ShakeDuration: number;

}
