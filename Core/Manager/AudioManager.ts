import { AudioClip, AudioSource, Node } from "cc";
import { AudioName, Enum_AssetBundle } from "../../Def/EnumDef";
import AudioManagerBase from "./AudioManagerBase";
import { ResourcesManager } from "./ResourcesManager";


export class AudioManager extends AudioManagerBase {
    private _audioSource: AudioSource = null!;
    protected curBgm: string;

    protected bgmVolume: number = 1;
    protected effectVolume: number = 1;

    public init(audioSourceRoot: Node, bgmVolume: number = 1, effectVolume: number = 1): boolean {
        this._audioSource = audioSourceRoot.getComponent(AudioSource);

        this.setEffectVolume(effectVolume);
        this.setBGMVolume(bgmVolume);

        return true;
    }

    /**播放bgm */
    public async PlayBGM(name: AudioName | string, boolLoop = true) {
        if (name == AudioName.None || name == null) {
            return;
        }


        let clip = await ResourcesManager.LoadAssetRes<AudioClip>(Enum_AssetBundle.Audio, name);
        this._audioSource.clip = clip;
        this._audioSource.play();

        this.curBgm = name;
    }

    /**播放音效 */
    public async PlayEffect(name: AudioName | string, loop: boolean = false): Promise<any> {
        if (name == AudioName.None || name == null) {
            return;
        }

        // console.log("PlayEffect", name);

        const audio = await ResourcesManager.LoadAssetRes<AudioClip>(Enum_AssetBundle.Audio, name);

        let v = this.effectVolume;

        this._audioSource.playOneShot(audio, v);


    }

    public PauseBGM(): boolean {
        this._audioSource.pause();
        return true;
    }

    public ResumeBGM(): boolean {
        this._audioSource.play();
        return true;
    }

    public StopBGM(): boolean {
        this._audioSource.stop();
        return true;
    }

    public StopEffect(id: number): boolean {

        return true;
    }

    public StopEffectByAudioType(name: AudioName | string): boolean {
        // throw new Error("Method not implemented.");

        return true;
    }

    public setBGMVolume(v: number) {
        this._audioSource.volume = v;
        this.bgmVolume = v;
    }
    public setEffectVolume(v: number) {
        this.effectVolume = v;
    }

}