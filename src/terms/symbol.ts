import { Game } from "../main";
import { Colors, Symbols } from '.';
import { Container, Shadow, Shape, Text } from 'createjs-module';

export default class Symbol extends Container
{
    index:number = 0;
    private _symbol:number;
    private _width:number;
    private _height:number;

    constructor(x:number, y:number, symbol:number = 0)
    {
        super();

        this.x = x;
        this.y = y;
        this._width = Game.SymbolSize;
        this._height = Game.SymbolSize;
        this._symbol = symbol;

        // this.x = x + this._width * 0.5;
        // this.y = y + this._height * 0.5;
        // this.regX = this._width * 0.5;
        // this.regY = this._height * 0.5;

        this.Refresh();
    }

    public SetSymbol(symbol:number = -1):void
    {
        if (symbol == -1) {
            symbol = Math.floor(Math.random() * Symbols.length);
        }

        this._symbol = symbol;

        this.Refresh();
    }

    public Refresh():void
    {
        let bg:Shape = new Shape();
        let bg_accent:Shape = new Shape();

        bg.shadow = new Shadow(Colors.ORANGE,0,0,3);
        bg.graphics
            .beginFill(Colors.WHITE)
            .drawRoundRect(0,0,this._width,this._height,5)
            .endFill();
        bg_accent.graphics
            .beginFill(Colors.GRAY)
            .drawRoundRect(8,8,this._width-16,this._height-16,5)
            .endFill();

        let symbolText:Text = new Text();
        symbolText.text = this._symbol.toString();
        symbolText.font = "bold 36px Arial";
        symbolText.color = Colors.WHITE;
        symbolText.textAlign = "center";
        symbolText.textBaseline = "middle";
        symbolText.x = this._width * 0.5;
        symbolText.y = this._height * 0.5;

        this.addChild(bg, bg_accent, symbolText);
    }
}