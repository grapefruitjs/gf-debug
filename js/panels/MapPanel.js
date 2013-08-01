gf.debug.MapPanel = function (game) {
    gf.debug.Panel.call(this, game);

    this.name = 'map';
    this.title = 'Mini-Map';
};

gf.inherits(gf.debug.MapPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        return div;
    },
    tick: function() {
        if(this.minimap) {
            this.minimap.render();
        } else if(this.game.world) {
            this.minimap = new gf.debug.Minimap(this._panel, this.game);
        }
    }
});