gf.debug.MapPanel = function (game) {
    gf.debug.Panel.call(this, game);

    this.name = 'map';
    this.title = 'Mini-Map';
    this.map = null;
    this.maps = {};
};

 gf.inherit(gf.debug.MapPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        this.states = document.createElement('ul');
        gf.debug.ui.addClass(this.states, 'states');
        div.appendChild(this.states);

        this.maps = document.createElement('ul');
        gf.debug.ui.addClass(this.maps, 'maps');
        div.appendChild(this.maps);

        this.layers = document.createElement('ul');
        gf.debug.ui.addClass(this.layers, 'layers');
        div.appendChild(this.layers);

        this.minimap = new gf.debug.Minimap(div, this.game);

        return div;
    },
    buildStates: function(dom, array) {
        gf.debug.empty(this.states);
    },
    tick: function() {
        if(!this.active)
            return;

        if(this.map)
            this.map.render();
    }
});