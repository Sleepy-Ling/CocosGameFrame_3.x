
import { Node } from 'cc';
import { GM } from '../Core/Global/GM';
import { Enum_GameState } from '../Def/EnumDef';
import ControllerBase from './ControllerBase';

export default class GameController extends ControllerBase {
    protected root: Node;
    protected gameState: Enum_GameState;
    protected idx: number;

    public init(root: Node, idx: number): boolean {
        this.root = root;
        this.idx = idx;

        this.listenMainEvent();

        return true;
    }

    public update(deltaTime: number): boolean {
        if (this.gameState != Enum_GameState.Gaming) {
            return true;
        }

        GM.gamingTimerManager.update(deltaTime);


        return true;
    }

    protected listenMainEvent() {

    }

    public getIndex() {
        return this.idx;
    }

}