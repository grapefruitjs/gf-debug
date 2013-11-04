debug.SpritesPanel = function(game) {
    debug.Panel.call(this, game);

    this.name = 'sprites';
    this.title = 'Sprites';

    this.showing = {
        shapes: false,
        tree: false
    };
};

gf.inherit(debug.SpritesPanel, debug.Panel, {
    createPanelElement: function() {
        var div = debug.Panel.prototype.createPanelElement.call(this),
            pad = document.createElement('div');

        // Show colliders
        debug.ui.setHtml(pad,
            '<div class="checkbox">' +
                '<input type="checkbox" value="" id="gf_debug_toggleShapes" class="gf_debug_toggleShapes" name="check" />' +
                '<label for="gf_debug_toggleShapes"></label>' +
            '</div>' +
            '<span>Draw Collider Shapes</span>'/* +
            '<div class="checkbox">' +
                '<input type="checkbox" value="" id="gf_debug_toggleQuadTree" class="gf_debug_toggleQuadTree" name="check" />' +
                '<label for="gf_debug_toggleQuadTree"></label>' +
            '</div>' +
            '<span>Draw QuadTree</span>'*/
        );
        debug.ui.delegate(pad, 'change', '.gf_debug_toggleShapes', this.toggleType.bind(this, 'shapes'));
        //debug.ui.delegate(pad, 'change', '.gf_debug_toggleQuadTree', this.toggleType.bind(this, 'tree'));

        div.appendChild(pad);

        this.physics = new debug.Physics(div, this.game);

        return div;
    },
    toggleType: function(type) {
        this.showing[type] = !this.showing[type];
    },
    tick: function() {
        if(!this.active)
            return;

        this.physics.render();
        /*
        if(this.game.world !== this.gfx.parent) {
            if(this.gfx.parent)
                this.gfx.parent.removeChild(this.gfx);

            this.game.world.add.obj(this.gfx);
        }

        this.gfx.clear();

        //ensure always on top
        if(!this.showing.shapes && !this.showing.tree)
            return this._updateGfx(true);
        else
            this._updateGfx();

        //draw all the bodies
        if(this.showing.shapes) {
            var self = this;
            this.game.physics.space.eachShape(function(shape) {
                if(!shape.body) return;

                debug.drawPhysicsShape(
                    shape,
                    shape.sensor ? self.style.sensorShape : self.style._defaultShape,
                    self.gfx
                );
            });
        }

        //draw the quadtree
        if(this.showing.tree) {
            debug.drawQuadTree(
                this.game.physics.tree,
                this.style.tree,
                this.gfx
            );
        }
        */
    },
    _updateGfx: function(rm) {
        if(rm) {
            if(this.gfx.parent)
                this.gfx.parent.removeChild(this.gfx);
        } else {
            if(!this.gfx.parent)
                this.game.world.add.obj(this.gfx);
        }
    }
});
