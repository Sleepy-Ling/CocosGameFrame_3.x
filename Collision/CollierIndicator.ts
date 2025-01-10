import { _decorator, CCFloat, Component, Enum, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

export const Enum_ColliderType = Enum({
    None: 0,
    Rect: 1,
    Circle: 2,
})


/**碰撞体指示器 在编辑器中编辑范围、类型、偏移值等 */
@ccclass('CollierIndicator')
export class CollierIndicator extends Component {
    @property({ type: Enum_ColliderType })
    type: number;

    @property(CCFloat)
    public get anchorX(): number {
        const uiTrans = this.getComponent(UITransform);
        return uiTrans.anchorX || 0.5;
    }

    @property(CCFloat)
    public get anchorY(): number {
        const uiTrans = this.getComponent(UITransform);
        return uiTrans?.anchorY || 0.5;
    }

    private _width: number;
    @property(CCFloat)
    public get width(): number {
        const uiTrans = this.getComponent(UITransform);
        return uiTrans.width;
    }

    private _height: number;
    @property(CCFloat)
    public get height(): number {
        const uiTrans = this.getComponent(UITransform);
        return uiTrans.height;
    }

}


