// Game Terminology
// Shane Krolikowski
// ----

export const Symbols = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

export enum Colors {
    GLOW = "yellow",
    GRAY = '#7c7b89',
    WHITE = "#f1e4de",
    RED = '#FF0000',
    BLACK = '#000000',
    ORANGE = '#E9723D',
    DARKBLUE = '#005792',
    BLUE = '#0B7FAB',
}

export { default as Grid } from './grid';
export { default as Symbol } from './symbol';
export { default as Reel } from './reel';