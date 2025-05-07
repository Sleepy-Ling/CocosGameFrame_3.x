import { Component, Node } from "cc";

class _UICompUtil {
    public findNodeComp(name: string, type: new (...args: any[]) => Component, node: Node) {
        let curNode = node;

        let tmpNode = this.findNode(name, curNode);
        let comp = tmpNode.getComponent(type);

        return comp;
    }

    public findNode(name: string, node: Node) {
        let curNode = node;

        let tmpNode = curNode.getChildByName(name);
        if (tmpNode) {
            return tmpNode;
        }

        for (let i = 0; i < curNode.children.length; i++) {
            const element = curNode.children[i];
            if (!element) {
                continue;
            }

            let comp = this.findNode(name, element);
            if (comp) {
                return comp;
            }
        }

        return null;

    }

}

export const UICompUtil = new _UICompUtil();