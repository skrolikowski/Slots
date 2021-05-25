import { Container, Point, Shadow, Shape } from 'createjs-module';
import { Colors, Reel } from '.';
import { Game } from '../main';

export default class Grid extends Container
{
    private _width:number;
    private _height:number;
    private _offset:Point;
    private _isSpinning:boolean;
    private _reels:Reel[];

    constructor()
    {
        super();

        this._offset = new Point(64, 64);
        this._reels = [];
        this._isSpinning = false;

        this.x = this._offset.x;
        this.y = this._offset.y;
        this._width = Game.NumReels * Game.SymbolSize;
        this._height = 3 * Game.SymbolSize;

        // --
        let box = new Shape();
        let cover = new Shape();
        box.graphics
            .beginFill(Colors.BLACK)
            .drawRoundRect(0,0,this._width,this._height,5)
            .endFill();
        cover.shadow = new Shadow(Colors.BLACK, 5, 5, 5);
        cover.alpha = 0.65;
        cover.graphics
            .setStrokeStyle(Game.SymbolSize)
            .beginStroke(Colors.BLUE)
            .drawRoundRect(-Game.SymbolSize*0.5,-Game.SymbolSize*0.5,this._width+Game.SymbolSize,this._height+Game.SymbolSize,5)
            .endStroke();
        // --

        for (let i:number = 0; i < Game.NumReels; ++i)
        {
            this._reels.push(new Reel(i * Game.SymbolSize/2, 0));
        }

        this.addChild(box);
        this.addChild(...this._reels);
        this.addChild(cover);

        this.on("click", () => { this.Spin() }, this);
    }

    public Spin():void
    {
        if (this._isSpinning)
        {
            Game.Instance.Timer.After(0.1, () => this._reels[0].SpinStop([0,1,2]));
            Game.Instance.Timer.After(0.3, () => this._reels[1].SpinStop([0,1,2]));
            Game.Instance.Timer.After(0.3, () => this._reels[2].SpinStop([0,1,2]));
            Game.Instance.Timer.After(0.3, () => this._reels[3].SpinStop([0,1,2]));
            Game.Instance.Timer.After(0.5, () => this._reels[4].SpinStop([0,1,2]));
        } else {
            Game.Instance.Timer.After(0.1, () => this._reels[0].SpinStart());
            Game.Instance.Timer.After(0.3, () => this._reels[1].SpinStart());
            Game.Instance.Timer.After(0.3, () => this._reels[2].SpinStart());
            Game.Instance.Timer.After(0.3, () => this._reels[3].SpinStart());
            Game.Instance.Timer.After(0.5, () => this._reels[4].SpinStart());
        }

        this._isSpinning = !this._isSpinning;
    }
}