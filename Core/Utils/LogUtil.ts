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
            // const stack = new Error().stack;
            // if (stack) {
            //     // 提取调用位置的相关信息
            //     const stackLines = stack.split('\n');
            //     const callerLine = stackLines[2]; // 通常第二行是调用者信息
            //     const matchResult = callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
            //     if (matchResult) {
            //         const [_, functionName, filePath, line, column] = matchResult;
            //         console.log.apply(console, [...param, `\n ${functionName}`]);
            //     } else {
            //         console.log(...param, ` ${callerLine.trim()}`);
            //     }

            // } else {
            //     console.log.apply(console, [this._tag, ": ", ...param]);
            // }

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

    rightAlignString(str: string, totalLength: number, paddingChar = ' ') {
        return str.padStart(totalLength, paddingChar);
    }
}

export const LogUtil = new _LogUtil();

