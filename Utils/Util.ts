import { sys } from "cc"
import { AudioName, Enum_AssetBundle, AtlasType } from "../../Def/EnumDef"



class _Util {
    File = new _FileUtil()
    LZW = new _LZW()
    Random = new _RandomUtil()
    Save = new _SaveUtil()
    Clone = new _Clone();
    public getUUid() {
        let len = 32;
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
        let maxPos = chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd
    }


    /**通过组合时间戳生成uid */
    public getUidWithTimestamp() {
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
        let randomCount: number = 10;
        let str = Date.now().toString();
        while (randomCount > 0) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));

            randomCount--;
        }

        return str;
    }
}

//#region _FileUtil
class _FileUtil {
    /**
     *
     *浏览器上生成文件（导出关卡）
     * @param {string} fileName 文件名 
     * @param {*} content 内容
     * @param {Function} [cb] callback
     */
    WriteFile(fileName: string, content: string, cb?: Function) {
        console.log("export");
        try {
            console.log("data: ", content);
            let link = document.createElement('a');
            link.download = fileName;
            link.style.display = 'none';    // 字符内容转变成blob地址
            let blob = new Blob([content]);
            link.href = URL.createObjectURL(blob);    // 触发点击
            link.click();    // 然后移除

            if (cb) cb();
        } catch (err) {
            console.error('exportData() 导入数据异常')
        }
    }

    /**
     *浏览器上加载关卡配置文件（json）
     *
     * @param {Function} cb callback
     */
    ReadFile(cb: Function) {
        try {
            let input = document.createElement("input");
            input.type = "file";
            input.click();
            input.onchange = () => {
                var file = input.files[0];
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onload = (env) => {
                    const result = env.target.result as string;
                    const data = JSON.parse(result);
                    console.log("input data: ", data);

                    cb(data);
                };
            }
        } catch (err) {
            console.error('importData() 导出数据异常')
        }
    }
}
//#endregion

//#region _LZW 
class Binary {
    Data: any[];
    p: number;
    l: number;
    bl: number;
    mask: any;
    private _m: number;
    constructor(initData = null, p = null, l = null, bl = null) {
        this.Data = initData && initData.constructor == Array ? initData.slice() : []
        this.p = p | 0
        this.l = l | 0
        this.bl = Math.max((bl || 8) | 0, 1)
        this.mask = this.m(bl)
        this._m = 0xFFFFFFFF
        //数据，指针，长度，位长度，遮罩
    }

    data(index: number, value: number) {
        if (!isNaN(value)) this.Data[index] = (value | 0) || 0;
        if (!isNaN(index)) return this.Data[index];
        else return this.Data.slice();
    }

    read() {
        var re: number;
        if (this.p >= this.l) return 0;
        if (32 - (this.p % 32) < this.bl) {
            re = (((this.Data[this.p >> 5] & this.m(32 - (this.p % 32))) << ((this.p + this.bl) % 32)) | (this.Data[(this.p >> 5) + 1] >>> (32 - ((this.p + this.bl) % 32)))) & this.mask;
        } else {
            re = (this.Data[this.p >> 5] >>> (32 - (this.p + this.bl) % 32)) & this.mask;
        }
        this.p += this.bl;
        return re;
    }

    write(i: number) {
        i &= this.mask;
        if (32 - (this.l % 32) < this.bl) {
            this.Data[this.l >> 5] |= i >>> (this.bl - (32 - (this.l % 32)));
            this.Data[(this.l >> 5) + 1] |= (i << (32 - ((this.l + this.bl) % 32))) & this._m;
        } else {
            this.Data[this.l >> 5] |= (i << (32 - ((this.l + this.bl) % 32))) & this._m;
        }
        this.l += this.bl;
    }

    eof() {
        return this.p >= this.l;
    }
    reset() {
        this.p = 0; this.mask = this.m(this.bl);
    }
    resetAll() {
        this.Data = []; this.p = 0; this.l = 0; this.bl = 8; this.mask = this.m(this.bl); this._m = 0xFFFFFFFF;
    }
    setBitLength(len: number) {
        this.bl = Math.max(len | 0, 1);
        this.mask = this.m(this.bl);
    }
    toHexString() {
        var re = [];
        for (var i = 0; i < this.Data.length; i++) {
            if (this.Data[i] < 0) {
                re.push(this.pad((this.Data[i] >>> 16).toString(16), 4) + this.pad((this.Data[i] & 0xFFFF).toString(16), 4));
            } else {
                re.push(this.pad(this.Data[i].toString(16), 8));
            }
        }
        return re.join("");
    }

    toBinaryString() {
        var re = [];
        for (var i = 0; i < this.Data.length; i++) {
            if (this.Data[i] < 0) {
                re.push(this.pad((this.Data[i] >>> 1).toString(2), 31) + (this.Data[i] & 1));
            } else {
                re.push(this.pad(this.Data[i].toString(2), 32));
            }
        }
        return re.join("").substring(0, this.l);
    }

    toCString() {
        var _p = this.p, _bl = this.bl, re = [];
        this.setBitLength(13);
        this.reset();
        while (this.p < this.l) re.push(this.C(this.read()));
        this.setBitLength(_bl);
        this.p = _p;
        return this.C(this.l >>> 13) + this.C(this.l & this.m(13)) + re.join("");
    }

    fromCString(str: string) {
        this.resetAll();
        this.setBitLength(13);
        for (var i = 2; i < str.length; i++)this.write(this.D(str, i));
        this.l = (this.D(str, 0) << 13) | (this.D(str, 1) & this.m(13));
        return this;
    }

    clone() {
        return new Binary(this.Data, this.p, this.l, this.bl);
    }

    m(len: number) { return (1 << len) - 1; }
    pad(s: string | any[], len: number) { return (new Array(len + 1)).join("0").substring(s.length) + s; }
    C(i: number) { return String.fromCharCode(i + 0x4e00); }
    D(s: string, i: number) { return s.charCodeAt(i) - 0x4e00; }
}

/**
 *string压缩类
 *采用LZW压缩算法 https://www.cnblogs.com/mcomco/p/10475329.html
 * @class _LZW
 */
class _LZW {

    Compress(str: string) {
        var b = new Binary()
        var code_index = -1
        var char_len = 8
        var str = str.replace(/[\u0100-\uFFFF]/g, function (s) {
            return "\&\#u" + pad(s.charCodeAt(0).toString(16), 4) + ";";
        });
        var dic = {}, cp = [], cpi: number, bl = 8;
        b.setBitLength(bl);
        for (var i = 0; i < (1 << char_len) + 2; i++)dic[i] = ++code_index;
        cp[0] = str.charCodeAt(0);
        for (var i = 1; i < str.length; i++) {
            cp[1] = str.charCodeAt(i);
            cpi = (cp[0] << 16) | cp[1];
            if (dic[cpi] == undefined) {
                dic[cpi] = (++code_index);
                if (cp[0] > m(bl)) { b.write(0x80); b.setBitLength(++bl); }
                b.write(cp[0]);
                cp[0] = cp[1];
            } else {
                cp[0] = dic[cpi];
            }
        }
        b.write(cp[0]);
        function pad(s: string | any[], len: number) { return (new Array(len + 1)).join("0").substring(s.length) + s; }
        function m(len: number) { return (1 << len) - 1; }
        return b.toCString();
    }

    Decompress(str: string) {
        var b = new Binary();
        b.fromCString(str);
        b.reset();
        var result = [], dic_code = -1;
        var dic = {}, cp = [], bl = 8;
        for (var i = 0; i < (1 << bl) + 2; i++)dic[i] = String.fromCharCode(++dic_code); //init the dic
        b.setBitLength(bl);
        cp[0] = b.read();
        while (!b.eof()) {
            cp[1] = b.read();
            if (cp[1] == 0x80) { b.setBitLength(++bl); cp[1] = b.read(); }
            if (dic[cp[1]] == undefined) dic[++dic_code] = dic[cp[0]] + dic[cp[0]].charAt(0);
            else dic[++dic_code] = dic[cp[0]] + dic[cp[1]].charAt(0);
            result.push(dic[cp[0]]);
            cp[0] = cp[1];
        }
        result.push(dic[cp[0]]);
        return result.join("").replace(/\&\#u[0-9a-fA-F]{4};/g, function (w) {
            return String.fromCharCode(parseInt(w.substring(3, 7), 16));
        });
    }
}

//#endregion

//#region _RandomUtil
class _RandomUtil {
    getRandom(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    ArrayBreakOrder(arr: any[]) {
        for (let i = 1; i < arr.length; i++) {
            const random = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[random]] = [arr[random], arr[i]];
        }
    }
}
//#endregion

//#region  Save
class _SaveUtil {
    SaveData(key: string, data: any) {
        sys.localStorage.setItem(key, JSON.stringify(data));
    }

    GetData(key: string) {
        return JSON.parse(sys.localStorage.getItem(key) || "{}");
    }
}


//#endregion

class _Clone {
    // 判断是否为数组
    isArr = (origin: any): boolean => {
        let str = '[object Array]'
        return Object.prototype.toString.call(origin) == str ? true : false
    }


    deepClone = <T>(origin: T, target?: Record<string, any> | T): T => {
        let tar = target || {}

        for (const key in origin) {
            if (Object.prototype.hasOwnProperty.call(origin, key)) {
                if (typeof origin[key] === 'object' && origin[key] !== null) {
                    tar[key] = this.isArr(origin[key]) ? [] : {}
                    this.deepClone(origin[key], tar[key])
                } else {
                    tar[key] = origin[key]
                }

            }
        }

        return tar as T
    }
}

export const Util = new _Util()

