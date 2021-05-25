import { filter } from 'lodash';

export class List<T>
{
    protected _items:T[];

    public get Size():number { return this._items.length; }
    public get IsEmpty():boolean { return this.Size == 0; }

    constructor(items:T[] = []) {
        this._items = items;
    }

    public Clear():void
    {
        this._items.splice(0, this._items.length);
    }

    public Peek():T|null {
        return this.IsEmpty ? null : this._items[0];
    }

    public Filter(cb:(v:T)=>boolean):T[]
    {
        return filter(this._items, (v:T) => cb(v));
    }

    public ForEach(cb:(v:T) => void)
    {
        this._items.forEach((v:T) => cb(v));
    }

    public Sort(cb:(a:T,b:T)=>number):void {
        this._items.sort(cb);
    }
}

export class Queue<T> extends List<T>
{
    constructor(items:T[] = []) {
        super(items);
    }

    public Enqueue(item:T):void
    {
        if (item instanceof Array) {
            this._items.push(...item);
        } else {
            this._items.push(item);
        }
    }

    public Dequeue(qty:number = 1):T|T[]|null
    {
        if (qty > 1) {
            return this._items.splice(0, qty);
        }

        return this._items.shift() || null;
    }
}

export class Stack<T> extends List<T>
{
    constructor(items:T[] = []) {
        super(items);
    }

    public Push(item:T|T[] = []):number
    {
        if (item instanceof Array) {
            return this._items.unshift(...item);
        } else {
            return this._items.unshift(item);
        }
    }

    public Pop(qty:number = 1):T|T[]|null {
        if (qty > 1) {
            return this._items.splice(0, qty);
        }

        return this._items.shift() || null;
    }
}