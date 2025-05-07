import { Enum_EventType } from "../../Def/EnumDef";
import { CustomEvents } from "../../Event/CustomEvents";
import { GM } from "../../Global/GM";

class _DebugUtil {
    init() {
        window["DebugUtil"] = this;
    }

    passGame() {
        const eventDispatcherManager = GM.eventDispatcherManager.getEventDispatcher(Enum_EventType.Game);
        eventDispatcherManager.Emit(CustomEvents.Debug_PassGame);
    }

    jumpLv(lv: number) {
        const eventDispatcherManager = GM.eventDispatcherManager.getEventDispatcher(Enum_EventType.Game);
        eventDispatcherManager.Emit(CustomEvents.Debug_JumpLevel, lv);
    }
}

export const DebugUtil = new _DebugUtil();