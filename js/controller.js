const RIGHT_MOVE = 'right';
const LEFT_MOVE = 'left';
const DOWN_MOVE = 'down';
const ROTATE_MOVE = 'rotate';

document.body.onkeydown = function( e ) {
    const keys =
    {   37: LEFT_MOVE,
        38: ROTATE_MOVE,
        39: RIGHT_MOVE,
        40: DOWN_MOVE  };

    if ( keys[e.keyCode] != undefined ) {
        tick( keys[ e.keyCode ] );
    }
};
