
/**
 * 按格式转换时间字符串
 * @param time 秒
 * @returns 
 */
class _StringUtil {
    public timeToStr(time: number) {
        let seconds = Math.floor(time % 60);
        let minute = Math.floor(time / 60);

        let param = [minute, seconds];
        let str = "{0}:{1}";
        let exp = /{\d}/g;
        let arr = str.match(exp);
        for (let i = 0; i < arr.length; i++) {
            let replace = param[i] < 10 ? '0' + param[i] : param[i].toString();
            str = str.replace(arr[i], replace);
        }

        return str;

    }

    public millionTimeToStr(mTime: number) {
        let time = mTime / 1000;
        let seconds = Math.floor(time) % 60;
        let minute = Math.floor(time / 60) % 60;
        let hour = Math.floor(time / 3600);
        let param = [hour, minute, seconds];
        let str = "{0}:{1}:{2}";
        let exp = /{\d}/g;
        let arr = str.match(exp);
        for (let i = 0; i < arr.length; i++) {
            let replace = param[i] < 10 ? '0' + param[i] : param[i].toString();
            str = str.replace(arr[i], replace);
        }
        return str;
    }

    public millionTimeToDayStr(mTime: number) {
        let day = mTime / 86400000;
        return Math.floor(day).toString();
    }


    /**
     * 简化数字 （满足某位数简写成 数字+单位， 1000 -> 1k  10000 -> 1w)
     * @param num 需要简化的数字
     * @param fractionDigits 保留小数位 默认值为0。
     * @param signs 标识符
     */
    public simplifyNumbers(num: number, fractionDigits: number = 0, signs: string[] = ['k', 'w']) {
        if (num < 1000) {
            return num.toFixed(fractionDigits);
        }

        let result: number = num;

        let signIdx: number = 0;

        let digits: number = Math.floor(Math.log10(result));
        while (digits > 0) {//寻找对应位数的符号
            let nextSign: string = signs[digits];
            if (nextSign && nextSign.length > 0) {
                signIdx = digits;
                result = result / Math.pow(10, digits);
                break;
            }
            digits--;
        }


        let sign = signs[signIdx];
        return result.toFixed(fractionDigits) + sign;
    }

    public formatStrWithRegExp(str: string, param: string[], exp: RegExp = /\{\w+\}/g) {
        let expRes = str.match(exp);

        if (expRes == null) {
            return str;
        }

        for (let i = 0; i < expRes.length; i++) {
            const element = expRes[i];

            str = str.replace(element, param[i] || "");
        }

        return str
    }

    /**基于max值 ，显示数量 ，超过则显示 xxxx+ */
    public limitedNum(num: number, max: number = 99999) {
        return num > max ? `${max}+` : num.toString();
    }

    public addNumberSign(num: number, positiveAndNegative: boolean, needPercent: boolean) {
        if (num != null && !isNaN(num)) {
            let pAndNSignStr: string = "";
            let percentStr: string = "";
            if (positiveAndNegative) {
                pAndNSignStr = num >= 0 ? "+" : "-";

                num = Math.abs(num);
            }
            if (needPercent) {
                percentStr = "%"
            }

            return `${pAndNSignStr}${num}${percentStr}`;
        }
    }

    public getNumberSign(num: number) {
        if (num >= 0) { return "+" };

        if (num < 0) { return "-" };

    }

    /**把版本号转化成数字 大版本|功能版本|小改动  1.0.0  ==> 1000|0000|0000*/
    convertVersionIntoNumber(version: string) {
        let result: number = 0;
        let multiple: number[] = [100000000, 10000, 1];
        let numList = version.split(".").map((v) => Number(v));

        for (let index = 0; index < numList.length; index++) {
            const element = numList[index];
            result += element * multiple[index];

        }

        return result;
    }

    /**分解奖励列表字符串 */
    splitRewardListStr(str: string): string[] {
        let dataList = str.match(/\w+_\w+_\[\w+(?:,\w+)?\](?:_[a-zA-Z0-9]+)?/g);

        return dataList;
    }
}

export const StringUtil = new _StringUtil();
