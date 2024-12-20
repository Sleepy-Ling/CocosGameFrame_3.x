import { GM } from "../Core/Global/GM";
import { LogUtil } from "../Core/Utils/LogUtil";
import { MathUtil } from "../Core/Utils/MathUtil";
import { Util } from "../Core/Utils/Util"
import { Enum_Currency } from "../Def/EnumDef";
import { IConveyanceInf } from "../Def/StructDef";


export abstract class SaveData {
    abstract name: string;
    isDirty: boolean;

    GetData() {
        let data = Util.Save.GetData(this.name)
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                this[key] = data[key]
            }
        }
    }

    SaveData() {
        console.log("save -->", this.name);
        Util.Save.SaveData(this.name, this);
        this.isDirty = false;
    }
}

export class UserData extends SaveData {
    name: string = "user"
    userName: string = ""
    uuid: string = Util.getUUid();
    firstLoginMTime: number = 0;
    /**上次登陆的日期 0点  时间戳 单位：毫秒*/
    lastLoginMTime: number = 0;
    /**上次在线时间戳 单位：毫秒 */
    lastOnlineMTime: number;

    currency: Record<Enum_Currency, number>;

    curPlayingLv: number;
    constructor() {
        super();

        this.currency = {
            [Enum_Currency.Gold]: 0,
            [Enum_Currency.Gem]: 0,
        };

        this.curPlayingLv = 1;
    }
}

export class SettingData extends SaveData {
    name: string = "setting"
    sound: number = 1;
    vibration: number = 1;
    effect: number = 1;
    sensitivity: number = 0.25;
    language: string = "CN";
}

// class _GameData {
//     UserData: UserData = new UserData();
//     SettingData: SettingData = new SettingData();

//     NowTime: number;

//     /**当天 日期 */
//     private localDate: string;
//     /**当天 0点时间戳 单位：毫秒*/
//     private localDateZeroMillionSeconds: number;

//     constructor() {

//     }

//     init() {
//         let allData: SaveData[] = [
//             this.UserData,
//             this.SettingData,

//         ];

//         for (const data of allData) {
//             data.GetData();
//         }

//     }

//     /**
//      * 登陆时初始化
//      * @param mTime 登陆时的时间戳
//      */
//     initOnLogin(mTime: number) {
//         let result: { isNewDay: boolean, isNewPlayer: boolean, isFirstPlay: boolean } = {
//             isNewDay: false,
//             isNewPlayer: false,
//             isFirstPlay: false
//         }

//         console.log(this);

//         //更新当天的数据
//         this.localDate = new Date().toLocaleDateString();
//         let localDateZeroMillionSeconds = this.localDateZeroMillionSeconds = new Date(this.localDate).getTime();
//         // console.log("now zero", this.localDateZeroMillionSeconds);


//         let isNewDay: boolean = false;

//         if (this.UserData.lastLoginMTime == 0) {//首次数据初始化
//             result.isNewPlayer = true;
//             result.isFirstPlay = true;
//         }

//         if (this.UserData.firstLoginMTime == null || this.UserData.firstLoginMTime == 0 || this.UserData.firstLoginMTime == localDateZeroMillionSeconds) {
//             this.UserData.firstLoginMTime = localDateZeroMillionSeconds;
//             result.isNewPlayer = true;
//         }

//         //当天0点更新
//         if (this.UserData.lastLoginMTime < localDateZeroMillionSeconds) {
//             this.UserData.lastLoginMTime = localDateZeroMillionSeconds;

//             this.saveAllData();

//             isNewDay = true;

//         }

//         result.isNewDay = isNewDay;

//         return result;
//     }



//     /**保存全部有改动过的数据 */
//     saveAllChangedData() {

//     }

//     /**保存全部数据 */
//     saveAllData() {

//     }

//     public getLocalDateZeroMillionSeconds() {
//         return this.localDateZeroMillionSeconds;
//     }

// }

// export const GameData = new _GameData();