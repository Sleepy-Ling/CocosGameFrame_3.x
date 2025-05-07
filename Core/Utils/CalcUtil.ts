
import { Vec2 } from "cc";
import { MathUtil } from "./MathUtil";
 
class _CalcUtil {
    /**解析 cc.Component.EventHandler emit 参数 */
    public analyzeParam(param: string) {
        let result: any[] = [];

        let strArr = param.split(",");
        for (const oneParam of strArr) {
            let splitStr = oneParam.split("|");

            let type = splitStr[0];
            let value = splitStr[1];

            if (type == "number") {
                result[result.length] = Number(value);
            }
            else if (type == "boolean") {
                result[result.length] = value == "true";
            }
            else {
                result[result.length] = value;
            }

        }

        return result;
    }

    /**从奖池中抽奖 */
    drawInJackpot<T>(id_list: T[], jackPot_rate: number[]) {
        let random = MathUtil.randomFloat(0, 1);
        let min: number = 0;

        for (let i = 0; i < jackPot_rate.length; i++) {
            const element = jackPot_rate[i];
            if (random >= min && random < min + element) {
                return id_list[i];
            }
            else {
                min += element;
            }
        }

        return id_list[id_list.length - 1];
    }
}
export const CalcUtil = new _CalcUtil();