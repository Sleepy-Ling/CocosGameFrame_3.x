// import { GM } from "../Core/Global/GM";
import { SaveData, SettingData, UserData } from "../Data/GameData";
import { GAMEDATA_TICK_INTERVAL } from "../Def/ConstDef";
import { Enum_UserSettingType, Enum_Language } from "../Def/EnumDef";
import ManagerBase from "./ManagerBase";

/**数据处理 */
const SaveDataHandler = {
    // get(target: SaveData, property, receiver) {
    //     console.log(`访问了${property}属性`);
    //     return target[property];
    // },

    // 属性设置拦截
    set(target: SaveData, property, value, receiver) {
        console.log(`设置${target.name}的${property}属性为${value}`);
        target[property] = value;
        
        if (property == "isDirty") {
            return true;
        }

        target.isDirty = true;
        return true;
    }
}

/**
 * 游戏数据管理者
 * @description 尽量使用该管理器进行对GameData数据的修改
 */
export default class GameDataManager extends ManagerBase {
    isNewPlayer: boolean = false;
    isFirstPlay: boolean = false;

    public userData: UserData = new UserData();
    public settingData: SettingData = new SettingData();

    protected allData: SaveData[];

    protected oneSecondTimer: number = 0;
    init(mTime: number) {
        this.allData = [];
        this.userData.GetData();
        this.settingData.GetData();

        this.userData = new Proxy<UserData>(this.userData, SaveDataHandler);
        this.settingData = new Proxy<SettingData>(this.settingData, SaveDataHandler);

        this.allData.push(this.userData, this.settingData);

        console.log("game data init :", mTime);

        let date = new Date();
        date.setHours(0, 0, 0, 0);

        console.log("now zero ", date.getTime());

        this.userData.lastLoginMTime = date.getTime();

        return;
    }

    /**在配置表都加载完后初始化 */
    initAfterConfigLoadFinish() {
        if (this.isFirstPlay) {

        }

    }

    public dailyCheck(mTime: number) {
        console.log("dailyCheck");
    }


    /**
     *  管理器每帧tick 函数
     * @param nowMSeconds 当前时间戳 单位：毫秒
     * @param deltaTime 距离上一帧时间间隔 单位：秒
     */
    update(nowMSeconds: number, deltaTime?: number) {
        this.oneSecondTimer += deltaTime;
        if (this.oneSecondTimer > GAMEDATA_TICK_INTERVAL) {
            this.oneSecondTimer -= GAMEDATA_TICK_INTERVAL;
            this.saveData();
        }
    }

    /**进行数据保存 (只保存有改动的）*/
    public saveData() {
        for (const data of this.allData) {
            if (data.isDirty) {
                data.SaveData();
            }

        }
    }

    /**立刻保存全部数据 （不论是否有改动）*/
    public saveAllDataImmediately() {
        for (const data of this.allData) {
            data.SaveData();
        }
    }

    /**每秒更新 */
    public updateInEachSecond() {
        this.saveData();
    }

    /**每分钟更新 */
    public updateInEachMinute(mTime: number) {
        this.dailyCheck(mTime);
    }

    /**
     * 更改玩家设置
     * @param type 
     * @param isOn 
     */
    public changeUserSetting(type: Enum_UserSettingType, value: number) {
        switch (type) {
            case Enum_UserSettingType.SoundsEff:
                this.settingData.effect = value;
                break;
            case Enum_UserSettingType.BGM:
                this.settingData.sound = value;
                break;
            case Enum_UserSettingType.Vibrate:
                this.settingData.vibration = value;
                break;
            case Enum_UserSettingType.Sensitivity:
                this.settingData.sensitivity = value;
                break;
            default:
                break;
        }

        console.log("changeUserSetting", type, value);
    }

    /**获取用户设置 */
    getUserSetting(type: Enum_UserSettingType) {
        if (type == Enum_UserSettingType.SoundsEff) {
            return this.settingData.effect;

        }
        else if (type == Enum_UserSettingType.BGM) {
            return this.settingData.sound;
        }
        else if (type == Enum_UserSettingType.Vibrate) {
            return this.settingData.vibration;
        }
        else if (type == Enum_UserSettingType.Sensitivity) {
            return this.settingData.sensitivity;
        }
    }

    public getLanguage(): Enum_Language {
        return this.settingData.language as Enum_Language || Enum_Language.CN;
    }
    public setLanguage(value: Enum_Language) {
        this.settingData.language = value;
    }

}