import { Game } from '../main';
import { Container, Tween, Ease } from 'createjs-module';
import { Symbol } from ".";

export default class Reel extends Container
{
    private _symbols:Symbol[];
    private _lines:number[];

    constructor(x:number, y:number)
    {
        super();

        this.x = x;
        this.y = y;

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

    public SpinStart():void
    {
        for (let i:number = this._symbols.length-1; i >=0; --i)
        {
            this.SpinLoop(this._symbols[i], true);
        }
    }

    private SpinLoop(symbol:Symbol, init:boolean = false):void
    {
        let tween:Tween = Tween.get(symbol, {override:true});
        let currIndex:number = symbol.index;
        let nextIndex:number = (currIndex + 1) % this._symbols.length;
        let duration:number = init ? 180 : 150;
        var easing = init ? Ease.quadIn : Ease.linear;

        symbol.index = nextIndex;

        if (nextIndex == 0)
        {
            symbol.SetSymbol(); // randomize

            tween.to({ y: this._lines[nextIndex] }).wait(duration);
        } else {
            tween.to({ y: this._lines[currIndex] });
            tween.to({ y: this._lines[nextIndex] }, duration, easing);
        }

        tween.call(this.SpinLoop, [ symbol ], this);
    }

    public SpinStop(results:number[]):void
    {
        for (let i:number = this._symbols.length-1; i >=0; --i)
        {
            let symbol:Symbol = this._symbols[i];
            let tween:Tween = Tween.get(symbol, {override:true});
            let currIndex:number = symbol.index;
            let nextIndex:number = (currIndex + 1) % this._symbols.length;
            let duration:number = 180;

            symbol.index = nextIndex;

            // set tween..
            if (nextIndex == 0)
            {
                symbol.SetSymbol(results.pop());  // set symbol from `results`..

                // tween.to({ y: this._lines[currIndex] });
                tween.to({ y: this._lines[nextIndex] }).wait(duration);
            } else {
                tween.to({ y: this._lines[currIndex] });
                tween.to({ y: this._lines[nextIndex] }, duration, Ease.linear);
            }

            // what next?
            if (results.length > 0)
            {
                // continue emptying `results`...
                tween.call(this.SpinStop, [ results ], this);
            }
            else
            {
                tween
                    .to({ y: this._lines[nextIndex] + 15 }, 100, Ease.quadIn)
                    .to({ y: this._lines[nextIndex] }, 50, Ease.quadOut);
            }
        }
    }
}