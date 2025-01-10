import { Animation, Node, sp } from "cc";
import { ISkeletonAnimationData } from "../../Def/StructDef";

export default class AnimCtrl {
    protected anim: Animation;
    protected skeleton: sp.Skeleton;
    protected root: Node;

    protected name: string;

    public init(root: Node) {
        if (root == null) {
            return;
        }

        this.skeleton = root.getComponent(sp.Skeleton);
        this.anim = root.getComponent(Animation);
        this.root = root;
    }

    /**
     * 播放一次动画
     * @param name 空则播放默认
     * @param startTime 播放开始时间
     * @param callback 播放完成回调
     */
    playOnce(name: string, startTime: number = 0, callback: Function) {
        // console.log("playonce", name, this.root?.name);
        if (name != null && !this.hasAnimName(name)) {
            // console.error(this.root.name, "dont have anim ", name);

            if (callback) {
                callback();
            }
            return;
        }

        if (this.skeleton) {
            if (name == null) {
                name = this.skeleton.animation;
            }
            let entry: sp.spine.TrackEntry = this.skeleton.setAnimation(0, name, false);
            entry.animationStart = startTime;

            if (callback) {
                this.skeleton.setTrackCompleteListener(entry, callback as any);
            }

            this.name = name;
        }

        else if (this.anim) {
            name = name || this.anim.defaultClip?.name;

            this.anim.targetOff(this);
            if (name) {
                this.anim.play(name);
                this.anim.getState(name).setTime(startTime);

                if (callback) {
                    // console.log("start play  ");
                    this.anim.once(Animation.EventType.FINISHED, () => {
                        if (callback) {
                            // console.log("do callback");

                            callback();
                        }

                    }, this);
                }
            }


            this.name = name;
        }
    }

    /**
     * 播放循环动画
     * @param name 空则播放默认
     * @param callback 每次播放完成后的回调
     */
    playLoop(name: string, callback?: Function) {
        // console.log("playLoop", name, this.root?.name);
        if (name != null && !this.hasAnimName(name)) {
            // console.error(this.root.name, "dont have anim ", name);

            if (callback) {
                callback();
            }
            return;
        }

        if (this.skeleton) {
            if (name == null) {
                name = this.skeleton.animation;
            }
            let entry: sp.spine.TrackEntry = this.skeleton.setAnimation(0, name, true);

            if (callback) {
                this.skeleton.setTrackCompleteListener(entry, callback as any);
            }

            this.name = name;
        }

        else if (this.anim) {
            name = name || this.anim.defaultClip?.name;

            if (name != null) {
                this.anim.targetOff(this);
                this.anim.play(name);
                if (callback) {
                    this.anim.on(Animation.EventType.LASTFRAME, callback as any, this);
                }
            }


            this.name = name;
        }
    }

    pause() {
        // console.log("pause", this.root?.name);
        if (this.skeleton) {
            this.skeleton.paused = true;
        }

        if (this.anim) {
            this.anim.pause();
        }
    }

    resume() {
        if (this.skeleton) {
            this.skeleton.paused = false
        }

        if (this.anim) {
            this.anim.resume();
        }
    }

    stop(animFrame?: number) {
        console.log("stop", this.root?.name);
        if (this.skeleton) {
            this.skeleton.clearTracks();
            this.skeleton.setToSetupPose();
        }

        if (this.anim) {
            if (animFrame != null) {
                // this.anim.setCurrentTime(animFrame);

                let state = this.anim.getState(this.name);
                if (state) {
                    let t = animFrame * 1 / state.frameRate;
                    state.setTime(t);
                }
            }

            this.anim.stop();
        }
    }

    hasAnimName(animName: string) {
        if (this.skeleton) {
            if (this.skeleton.skeletonData["_skeletonCache"] && this.skeleton.skeletonData["_skeletonCache"]["animations"]) {
                let spineAnimationData = this.skeleton.skeletonData["_skeletonCache"]["animations"] as Array<ISkeletonAnimationData>;

                return spineAnimationData.some((v) => {
                    return v.name == animName;
                })
            }
        }

        else if (this.anim) {
            return this.anim.clips.some((clip) => {
                if (clip) {
                    return clip.name == animName;
                }
            })
        }

        return false;

    }

    setNodeVisible(v: boolean) {
        if (!this.root) {
            return;
        }

        this.root.active = v;
    }

    getCCAnimation() {
        return this.anim;
    }

    public getRootNode() {
        return this.root;
    }

    public reset() {
        this.skeleton.paused = false;
    }
}
