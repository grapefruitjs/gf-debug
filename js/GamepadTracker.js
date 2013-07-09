var d = d || {}; //this makes jshint happy

function getGpButtonName(v, i) {
    return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + gf.input.getGpButtonName(i) + ': ' + v.toFixed(2);
}

function getGpAxisName(v, i) {
    return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + gf.input.getGpAxisName(i) + ': ' + v.toFixed(2);
}

function GamepadTracker(cont, game) {
    this.game = game;

    //create DOM elements
    this.box = document.createElement('div');
    d.setStyle(this.box, {
        position: 'absolute',
        top: '50px',
        left: '5px',
        color: '#FFF',
        border: 'solid 1px #1A1A1A',
        'z-index': 10,
        'font-size': '0.9em',
        'background-color': '#222'
    });

    this.value = document.createElement('span');
    this.value.textContent = 'X: 0, Y: 0';

    this.box.appendChild(this.value);

    //append us to the parent
    cont.appendChild(this.box);
}

GamepadTracker.prototype.tick = function() {
    this.value.innerHTML = '';

    if(this.game.input.gamepad.pads && this.game.input.gamepad.pads.length) {
        for(var i = 0, il = this.game.input.gamepad.pads.length; i < il; ++i) {
            var pad = this.game.input.gamepad.pads[i];

            this.value.innerHTML += 'Gamepad: [' + pad.index + '] ' + pad.id + '<br/>';

            this.value.innerHTML += '&nbsp;&nbsp;&nbsp;Buttons:<br/>' +
                pad.buttons.map(getGpButtonName).join('<br/>') +
                '<br/>';

            this.value.innerHTML += '&nbsp;&nbsp;&nbsp;Axes:<br/>' +
                pad.axes.map(getGpAxisName).join('<br/>') +
                '<br/>';
        }
    }
};