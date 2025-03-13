  
export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Circle {
    x: number;
    y: number;
    radius: number;
}

/**射线 */
export interface Ray {
    direction: { x: number, y: number };
    origin: { x: number, y: number };
}

/**碰撞结果 */
export interface CollisionResult {
    collided: boolean;
    time: number;
    normal: { x: number, y: number };
}

/**碰撞检测工具 */
export class CollisionUtil {
    /**射线是否与该矩形相交 */
    static rayVsRect(ray: Ray, rect: Rectangle): CollisionResult {
        const result: CollisionResult = {
            collided: false,
            time: 1.0,
            normal: { x: 0, y: 0 }
        };

        // 防止除以零
        const dirX = ray.direction.x === 0 ? 0.00001 : ray.direction.x;
        const dirY = ray.direction.y === 0 ? 0.00001 : ray.direction.y;

        // 计算射线与矩形各边的相交时间
        const txMin = (rect.x - ray.origin.x) / dirX;
        const txMax = (rect.x + rect.width - ray.origin.x) / dirX;
        const tyMin = (rect.y - ray.origin.y) / dirY;
        const tyMax = (rect.y + rect.height - ray.origin.y) / dirY;

        // 确保txMin < txMax，tyMin < tyMax
        const [tMinX, tMaxX] = txMin > txMax ? [txMax, txMin] : [txMin, txMax];
        const [tMinY, tMaxY] = tyMin > tyMax ? [tyMax, tyMin] : [tyMin, tyMax];

        // 找到进入时间和离开时间
        const tEnter = Math.max(tMinX, tMinY);
        const tExit = Math.min(tMaxX, tMaxY);

        // 检查是否发生碰撞
        if (tEnter <= tExit && tExit > 0 && tEnter < 1.0) {
            result.collided = true;
            result.time = tEnter;

            // 确定碰撞法线
            if (tMinX > tMinY) {
                result.normal = {
                    x: ray.direction.x < 0 ? 1.0 : -1.0,
                    y: 0
                };
            } else {
                result.normal = {
                    x: 0,
                    y: ray.direction.y < 0 ? 1.0 : -1.0
                };
            }
        }

        return result;
    }

    static circleVsRect(circle: Circle, rect: Rectangle): boolean {
        // 找到矩形上离圆心最近的点
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

        // 计算圆心到最近点的距离
        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;

        // 计算距离的平方
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

        // 如果距离小于等于半径，则发生碰撞
        return distanceSquared <= (circle.radius * circle.radius);
    }

    static circleVsCircle(circle_1: Circle, circle_2: Circle) {
        const disX = circle_1.x - circle_2.x;
        const disY = circle_1.y - circle_2.y;

        const dis = Math.sqrt(disX * disX + disY * disY);

        return dis <= circle_1.radius + circle_2.radius;
    }
}
