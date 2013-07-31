gf.debug.PhysicsPanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'physics';
};

gf.inherits(gf.debug.PhysicsPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this),
            col = document.createElement('div');

        gf.debug.ui.addClass(col, 'slideOne');
        gf.debug.ui.setHtml(col, '<input type="checkbox" value="None" id="gf_debug_toggleCollisions" name="check" /><label for="gf_debug_toggleCollisions"></label>');
        col.addEventListener('click', this.toggleCollisions.bind(this), false);
        div.appendChild(col);

        return div;
    },
    toggleCollisions: function() {
        var obj = this.game.stage,
            style = {
                color: 0xff2222,
                sensor: {
                    color: 0x22ff22
                }
            },
            show = !this.showing;

        while(obj) {
            if(obj.showPhysics) {
                if(show)
                    obj.showPhysics(style);
                else
                    obj.hidePhysics();
            }
        }

        this.game.world._showPhysics = this.showing = show;
    }
});