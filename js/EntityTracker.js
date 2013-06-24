function EntityTracker(cont, ent) {
    this.entity = ent;

    //create DOM elements
    this.box = document.createElement('div');
    setStyle(this.box, {
        position: 'absolute',
        top: '25px',
        left: '5px',
        color: '#FFF',
        border: 'solid 1px #1A1A1A',
        'z-index': 10,
        'font-size': '0.9em',
        'background-color': '#222'
    });

    this.label = document.createElement('span');
    this.label.textContent = 'Player Position: ';

    this.value = document.createElement('span');
    this.value.textContent = 'X: 0, Y: 0';

    this.label.appendChild(document.createElement('br'));
    this.label.appendChild(this.value);

    this.box.appendChild(this.label);

    //append us to the parent
    cont.appendChild(this.box);
}

EntityTracker.prototype.tick = function() {
    this.value.textContent = 'X: ' + this.entity.position.x.toFixed(2) + 
                            ', Y: ' + this.entity.position.y.toFixed(2);
};