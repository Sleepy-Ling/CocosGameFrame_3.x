import { _decorator, Component, Node, Label, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Core/UI_Comp/ValueBar')
export default class ValueBar extends Component {
    @property(Label)
    lab_value: Label;
    @property(Sprite)
    bg: Sprite;


    onEnable() {

    }

    onDisable() {

    }
}

