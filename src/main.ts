document.body.onload = () => new Game();
// --

import { Timer } from './utils'
import { Grid } from './terms'
import { Stage, Ticker, TickerEvent } from 'createjs-module';
import TWEEN from '@tweenjs/tween.js';

export class Game
{
    private static _instance:Game;
    public static get Instance():Game {
        if (Game._instance == null)
            Game._instance = new Game();
        return Game._instance;
    }
    // ----

    public static NumReels = 5;
    public static SymbolSize = 64;

    private _stage:Stage;
    private _grid:Grid;
    private _timer:Timer = new Timer();

    public get Timer():Timer { return this._timer; }
    public get IsPaused():boolean { return false; }

    constructor()
    {
        Game._instance = this;

        this._timer = new Timer();
        this._stage = new Stage("table");
        this._grid = new Grid();

        this._stage.addChild(this._grid);

        Ticker.on("tick", (ev:any) => {
            let event:TickerEvent = ev as TickerEvent;
            
            
            if (!this.IsPaused) {
                this._stage.update();
                TWEEN.update();
                this.Timer.Update(event.delta);
            }
        });
    }
}