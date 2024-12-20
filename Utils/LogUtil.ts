enum Enum_LogLevel {
    Log = 1 << 0,
    Warn = 1 << 1,
    Error = 1 << 2,
    NoLog = 0,
    Log_Warn = Log | Warn,
    Log_Error = Log | Error,
    Warn_Error = Error | Warn,
    NoLimited = Log | Warn | Error,
}

class _LogUtil {
    private logLevel: Enum_LogLevel = Enum_LogLevel.NoLimited;

    private _tag: string = "Log Util";
    Log(...param: any[]) {
        if (this.logLevel & Enum_LogLevel.Log) {
            console.log.apply(console, [this._tag, ": ", ...param]);

        }
    }

    Error(...param) {
        if (this.logLevel & Enum_LogLevel.Error) {
            console.error.apply(console, [this._tag, ": ", ...param]);
        }
    }

    Warn(...param) {
        if (this.logLevel & Enum_LogLevel.Warn) {
            console.warn(this._tag, ": ", param);
        }
    }

}

export const LogUtil = new _LogUtil();

