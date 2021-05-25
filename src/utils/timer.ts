import { NotVoid } from "lodash";

export class TimerObject
{
    private m_id:string;
    private m_delay:number;
    private m_count:number;
    private m_expires:number;
    private m_onTick:() => void;
    private m_onComplete:() => void;

    public get Handle():string { return this.m_id; }
    public get CanRemove():boolean { return this.m_count <= 0; }
    public get ElapsedTime():number { return Timer.ElapsedTime; }
    public get IsComplete():boolean { return this.ElapsedTime >= this.m_expires; }

    public constructor(data:any)
    {
        this.m_id = Math.floor(Math.random()*1000)+"_"+new Date().getTime();  // identifier for deletion
        this.m_delay = data.delay;
        this.m_count = data.count || 1;
        this.m_expires = this.ElapsedTime + this.m_delay;
        this.m_onTick = data.onTick;
        this.m_onComplete = data.onComplete;
    }

    public OnTick()
    {
        if (this.m_onTick != null) this.m_onTick();
    }

    public OnComplete()
    {
        this.m_count -= 1;
        this.m_expires = this.ElapsedTime + this.m_delay;
        
        if (this.m_onComplete != null) this.m_onComplete();
    }
}

export default class Timer
{
    static ElapsedTime:number = 0;

    private _timers:Map<string,TimerObject>;

    constructor()
    {
        this._timers = new Map<string,TimerObject>();
    }

    public During(delay:number, onTick:(dt:number,t:number) => void, onComplete:(dt:number,t:number) => void):string
    {
        const timer:TimerObject = new TimerObject({delay, onTick, onComplete});

        this._timers.set(timer.Handle, timer);
        return timer.Handle;
    }

    public After(delay:number, onComplete:(dt:number,t:number) => void):string
    {
        return this.During(delay, () => {}, onComplete);
    }

    public Every(delay:number, onComplete:(dt:number,t:number) => void, count:number = Number.MAX_SAFE_INTEGER):string
    {
        const timer:TimerObject = new TimerObject({delay, onComplete, count});

        this._timers.set(timer.Handle, timer);
        return timer.Handle;
    }

    // public Script()
    // {
    //     // const wait = async (delay:number) => {
    //     //     await new Promise(r => setTimeout(r, delay*1000));
    //     // }
    // }

    public Cancel(id:string)
    {
        if (this._timers.has(id)) this._timers.delete(id);
    }

    public Clear():void
    {
        for (var id in this._timers)
        {
            this._timers.delete(id);
        }
    }

    public Update(dt:number)
    {
        Timer.ElapsedTime += dt*.001

        let toRemove:string[] = [];

        this._timers.forEach((timer:TimerObject) => {
            timer.OnTick();

            if (timer.IsComplete) {
                timer.OnComplete();
            }

            if (timer.CanRemove) {
                toRemove.push(timer.Handle);
            }
        });

        toRemove.forEach((id:string) => this.Cancel(id));
    }
}