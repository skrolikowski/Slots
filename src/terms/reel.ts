import { Game } from '../main';
import { Container } from 'createjs-module';
import TWEEN, { Tween, Easing }  from '@tweenjs/tween.js';
import { Symbol } from ".";

export default class Reel extends Container
{
    private _tween:Tween<Reel>
    private _symbols:Symbol[];
    private _lines:number[];

    private static SpeedStart:number = 350;
    private static SpeedLoop:number = 250;

    constructor(x:number, y:number)
    {
        super();

        this.x = x;
        this.y = y;

        this._tween = new Tween(this);
        this._symbols = [];
        this._lines = [-Game.SymbolSize, 0, Game.SymbolSize, Game.SymbolSize*2, Game.SymbolSize*3];

        for (let i:number = 0; i < 5; ++i)
        {
            let x:number = this.x;
            let y:number = this.y + (i-1) * Game.SymbolSize;
            let symbol:Symbol = new Symbol(x, y);
            symbol.SetSymbol();
            symbol.index = i;
            this._symbols.push(symbol);
        }
        this.addChild(...this._symbols);
    }

    private UpdateSymbols(value:number|null = null)
    {
        for (let i:number = this._symbols.length-1; i >=0; --i)
        {
            let symbol:Symbol = this._symbols[i];
            let currIdx:number = symbol.index
            let nextIdx:number = (currIdx + 1) % this._symbols.length;

            symbol.index = nextIdx;

            if (nextIdx == 0)
            {
                symbol.SetSymbol(value);
            }

            symbol.set({ y: this._lines[nextIdx] });
            this.y = 0;
        }
    }

    private BounceSymbols():void
    {
        this.UpdateSymbols();

        TWEEN.remove(this._tween);

        new Tween(this)
            .to({ y: +16 }, 150)
            .easing(Easing.Quadratic.In)
            .onComplete(() => {
                new Tween(this)
                    .to({ y: 0 }, 80)
                    .easing(Easing.Quadratic.Out)
                    .start();
            })
            .start();
    }

    public SpinStart():void
    {
        this._tween = new TWEEN.Tween(this)
            .to({ y: +Game.SymbolSize }, Reel.SpeedStart)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(() => {
                this.UpdateSymbols();
                this.SpinLoop();
            })
            .start();
    }

    private SpinLoop():void
    {
        this._tween = new TWEEN.Tween(this)
            .repeat(Infinity)
            .to({ y: +Game.SymbolSize }, Reel.SpeedLoop)
            .easing(Easing.Linear.None)
            .onRepeat(() => {
                this.UpdateSymbols()
            })
            .start();
    }

    public SpinStop(symbols:number[]):void
    {
        this._tween
            .repeat(symbols.length)
            .onRepeat(() => {
                this.UpdateSymbols(symbols.pop())
            })
            .onComplete(() => {
                this.BounceSymbols();
            });
    }

    // public SpinStart():void
    // {
    //     for (let i:number = this._symbols.length-1; i >=0; --i)
    //     {
    //         this.SpinLoop(this._symbols[i], true);
    //     }
    // }

    // private SpinLoop(symbol:Symbol, init:boolean = false):void
    // {
    //     let tween:Tween<Symbol> = new Tween(symbol);
    //     let currIndex:number = symbol.index;
    //     let nextIndex:number = (currIndex + 1) % this._symbols.length;
    //     let duration:number = init ? 350 : 150;
    //     var easing = init ? Easing.Quadratic.In : Easing.Linear.None;


    //     symbol.index = nextIndex;

    //     if (nextIndex == 0)
    //     {
    //         symbol.SetSymbol(); // randomize

    //         tween.to({ y: this._lines[nextIndex] }).delay(duration);
    //     } else {
    //         // tween.to({ y: this._lines[currIndex] });
    //         tween.easing(easing);
    //         tween.to({ y: this._lines[nextIndex] }, duration);
    //     }

    //     tween.call(this.SpinLoop, [ symbol ], this);
    // }

    // public SpinStop(results:number[]):void
    // {
    //     for (let i:number = this._symbols.length-1; i >=0; --i)
    //     {
    //         let symbol:Symbol = this._symbols[i];
    //         let tween:Tween = Tween.get(symbol, {override:true});
    //         let currIndex:number = symbol.index;
    //         let nextIndex:number = (currIndex + 1) % this._symbols.length;
    //         let duration:number = 180;

    //         symbol.index = nextIndex;

    //         // set tween..
    //         if (nextIndex == 0)
    //         {
    //             symbol.SetSymbol(results.pop());  // set symbol from `results`..

    //             // tween.to({ y: this._lines[currIndex] });
    //             tween.to({ y: this._lines[nextIndex] }).wait(duration);
    //         } else {
    //             tween.to({ y: this._lines[currIndex] });
    //             tween.to({ y: this._lines[nextIndex] }, duration, Ease.linear);
    //         }

    //         // what next?
    //         if (results.length > 0)
    //         {
    //             // continue emptying `results`...
    //             tween
    //                 .to({ y: this._lines[nextIndex] })
    //                 .call(this.SpinStop, [ results ], this);
    //         }
    //         else
    //         {
    //             tween
    //                 .to({ y: this._lines[nextIndex] })
    //                 .to({ y: this._lines[nextIndex] + 15 }, 100, Ease.quadIn)
    //                 .to({ y: this._lines[nextIndex] }, 50, Ease.quadOut);
    //         }
    //     }
    // }
}