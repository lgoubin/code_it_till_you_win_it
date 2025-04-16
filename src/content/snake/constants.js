

export const CHARACTERS = {
    HEAD: '\x1b[92m$\x1b[0m',
    BODY: '\x1b[92m#\x1b[0m',
    TAIL: '\x1b[92m+\x1b[0m',
    APPLE: '\x1b[91m@\x1b[0m',
    WALL: '*',
    EMPTY: '·'
};

export const DIRECTIONS = {
    E : { x: 1, y: 0 },
    W : { x: -1, y: 0 },
    N : { x: 0, y: -1 },
    S: { x: 0, y: 1 }
};