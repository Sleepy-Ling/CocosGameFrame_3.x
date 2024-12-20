import { Graphics, Quat, quat, v2, v3, Vec2, Vec3 } from "cc";

class _MathUtil {
    toAngle(radian: number) {
        return 180 / Math.PI * radian;
    }

    toRadian(angle: number) {
        return Math.PI / 180 * angle;
    }

    toPrecision(v: number, precision: number) {
        let temp: number = Math.pow(10, precision);
        return Math.ceil(v * temp) / temp;
    }

    /**范围随机取值 [min,max) */
    randomInt(min: number, max: number) {
        let tempMin = Math.min(min, max);
        let tempMax = Math.max(min, max);
        min = tempMin;
        max = tempMax;

        let d = Math.abs(max - min);
        let curMin = Math.min(min, max);
        return Math.floor(Math.random() * d + curMin);
    }

    /**范围随机取值 [min,max) */
    randomFloat(min: number, max: number) {
        let d = Math.abs(max - min);
        let curMin = Math.min(min, max);
        return Math.random() * d + curMin;
    }

    /**在数组中随机取一个元素 */
    randomElementFromArray<T>(arr: Array<T> | ReadonlyArray<T>, startIdx: number = 0, endIdx: number = arr.length) {
        let idx = this.randomInt(startIdx, endIdx);
        idx = Math.max(idx, 0);

        return arr[idx];
    }

    /**在数组中随机取一个元素，并且基于该数组中删除 */
    randomElementFromArrayAndRemove<T>(arr: Array<T>, startIdx: number = 0, endIdx: number = arr.length) {
        let idx = this.randomInt(startIdx, endIdx);
        idx = Math.max(idx, 0);

        return arr.splice(idx, 1)[0];
    }

    /**在数组中随机取n个元素 */
    randomElementFromArrayByCount<T>(arr: Array<T>, count: number = 1) {
        let tempArr: Array<T> = [];
        tempArr.push(...arr);

        let result: Array<T> = [];

        count = Math.min(tempArr.length, count);

        while (count > 0) {
            let element = this.randomElementFromArrayAndRemove(tempArr);
            result.push(element);
            count--;
        }

        return result;
    }

    /**获取反射角 */
    public getReflectVec(v1: Vec2, nVec: Vec2) {
        let v1Normalize = v2(v1).normalize();
        let nVecNormalize = v2(nVec).normalize();

        // I:v1  入射向量  k：I在反射面法向量的投影  T：反射向量
        // T=I-2k

        return v1Normalize.subtract(nVecNormalize.multiplyScalar(2 * v1Normalize.dot(nVecNormalize)));
    }

    /**
     * 获取两个向量间的夹角
     * @param vec1 
     * @param vec2 
     * @returns 
     */
    getABAngle2D(vec1: Vec2 | Vec3, vec2: Vec2 | Vec3 = null) {
        if (vec2 == null) {
            vec2 = v3(1, 0, 0);
        }
        let ab = Vec2.dot(vec1, vec2);
        let abLen = vec1.length() * vec2.length();
        let cosab = ab / abLen;

        let radians = Math.acos(cosab);
        return MathUtil.toAngle(radians);
    }

    /**
     * 获取从a 到 b 的角度
     * @param from 
     * @param to 
     * @returns 
     */
    getABAngle2D_2(from: Vec2, to: Vec2) {
        let angle1 = this.getVectorAngle2D_1(from);
        let angle2 = this.getVectorAngle2D_1(to);

        return angle2 - angle1;
    }

    getVectorAngle2D_1(vec1: Vec2) {
        let angle = MathUtil.toAngle(Math.atan2(vec1.y, vec1.x));
        return angle;
    }
    /**范围 [min,max) */
    clamp(n: number, min: number, max: number) {
        if (min > max) {
            max = min ^ max;
            min = min ^ max;
            max = min ^ max;
        }

        return Math.max(min, Math.min(max, n));
    }

    toVec2(v: Vec3) {
        return v2(v.x, v.y);
    }

    toVec3(v: Vec2, z: number = 0) {
        return v3(v.x, v.y, z);
    }

    getSign(num: number) {
        if (num > 0) {
            return 1;
        }

        if (num < 0) {
            return -1;
        }

        return 0;
    }

    /**
     * 计算垂直目标向量的向量
     * @param v 目标向量
     */
    calcPerpendicularVec2(v: Vec2) {
        return v2(-v.y, v.x);
    }

    rotateVector2D(v: Vec2, angle: number) {
        const randians = MathUtil.toRadian(angle);
        const sin_theta: number = Math.sin(randians);
        const cos_theta: number = Math.cos(randians);

        return v2(cos_theta * v.x - sin_theta * v.y, sin_theta * v.x + cos_theta * v.y);

    }

    /**
     * 获取旋转角度（仅限于2d）
     * @param quat 四元数
     * @returns 
     */
    getRotationInEulerAngleIn2D(quat: Quat) {
        return MathUtil.toAngle(Math.acos(quat.w) * 2);
    }

    getQuatByAngle(angle: number, axis: Vec3 = v3()) {
        const randians = MathUtil.toRadian(angle / 2);
        const cos_theta = Math.cos(randians);
        const sin_theta: number = Math.sin(randians);

        return quat(sin_theta * axis.x, sin_theta * axis.y, sin_theta * axis.z, cos_theta);
    }

    /**画扇形 */
    drawFanShaped(cx: number, cy: number, radius: number, startRadians: number, endRadians: number, graphics: Graphics, counterclockwise: boolean = false, hexColor: string = '#ff0000') {
        graphics.clear();
        graphics.moveTo(cx, cy);
        let point1 = v2(Math.cos(startRadians) * radius + cx, Math.sin(startRadians) * radius + cy)
        graphics.lineTo(point1.x, point1.y);
        graphics.arc(cx, cy, radius, startRadians, endRadians, counterclockwise);
        graphics.lineTo(cx, cy);
        graphics.fillColor.fromHEX(hexColor);
        graphics.fill();
    }

    /**判断该点是否在线上 */
    public isPointOnLine(point: Vec2, lineStart: Vec2, lineEnd: Vec2) {
        let line: Vec2 = Vec2.subtract(v2(), lineEnd, lineStart);
        let line2: Vec2 = Vec2.subtract(v2(), point, lineStart);

        let dotValue: number = line.dot(line2);
        let cos_theta = dotValue / line.length() * line2.length();

        return cos_theta == 1 && line.lengthSqr() >= line2.lengthSqr();
    }

    /**计算3点顺序方向 正数:p3 在p1p2顺时针方向,负数:p3 在p1p2逆时针方向， 0:p3和p1p2共线  */
    public judge3PointSequence(p1: Vec2, p2: Vec2, p3: Vec2) {
        let p1p2: Vec2 = Vec2.subtract(v2(), p2, p1);
        let p1p3: Vec2 = Vec2.subtract(v2(), p3, p1);

        return p1p2.cross(p1p3);
    }

    /**获得两线相交的点 */
    public getLineIntersectionPoint(line1Start: Vec2, line1End: Vec2, line2Start: Vec2, line2End: Vec2) {
        let seq1 = this.judge3PointSequence(line1Start, line1End, line2Start);
        if (seq1 == 0) {
            if (this.isPointOnLine(line1Start, line1End, line2Start)) {
                return line2Start;
            }
        }

        let seq2 = this.judge3PointSequence(line1Start, line1End, line2End);
        if (seq2 == 0) {
            if (this.isPointOnLine(line1Start, line1End, line2End)) {
                return line2End;
            }
        }

        if (seq1 * seq2 > 0) {//line2Start和line2End 都在line1 同侧，则无相交
            return null;
        }

        let seq3 = this.judge3PointSequence(line2Start, line2End, line1Start);
        if (seq3 == 0) {
            if (this.isPointOnLine(line2Start, line2End, line1Start)) {
                return line1Start;
            }
        }

        let seq4 = this.judge3PointSequence(line2Start, line2End, line1End);
        if (seq4 == 0) {
            if (this.isPointOnLine(line2Start, line2End, line1End)) {
                return line1End;
            }
        }

        if (seq3 * seq4 > 0) {//line1Start和line1End 都在line2 同侧，则无相交
            return null;
        }

        let line1kb = this.lineKB(line1Start, line1End);
        let line2kb = this.lineKB(line2Start, line2End);
        let b1: number = line1kb.b;
        let b2: number = line2kb.b;

        let k1: number = line1kb.k;
        let k2: number = line2kb.k;

        let x: number;
        let y: number;

        if (k1 == null) {
            x = line1Start.x;
            y = k2 * x + b2;
        }
        else if (line2kb.k == null) {
            x = line2Start.x;
            y = k1 * x + b1;
        }
        else {
            x = (b2 - b1) / (k1 - k2);
            y = k1 * x + b1;
        }


        return v2(x, y);
    }

    /**
    * 根据两点求直线的一般表达式  a*x + b*y + c = 0
    * @param point1 直线上的点
    * @param point2 不要与point1相同
    */
    public lineABC(point1: Vec2, point2: Vec2) {
        let value = { a: 0, b: 0, c: 0 };
        value.a = point1.y - point2.y;
        value.b = point2.x - point1.x;
        value.c = point1.x * point2.y - point2.x * point1.y;
        return value;
    }

    /**
     * y=kx+b
     * @param point1 
     * @param point2 
     */
    public lineKB(point1: Vec2, point2: Vec2) {
        let value = { k: 0, b: 0 };
        if (point1.x == point2.x) {//垂直x轴
            value.k = null;
            value.b = null;
        }
        else {
            let k = (point2.y - point1.y) / (point2.x - point1.x);
            let b = point1.y - k * point1.x;
            value.k = k;
            value.b = b;
        }
        return value;
    }

}

export const MathUtil = new _MathUtil();
