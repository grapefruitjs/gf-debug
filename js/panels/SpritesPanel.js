gf.debug.SpritesPanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'sprites';
    this.title = 'Sprites';

    this.gfx = new gf.PIXI.Graphics();

    this.style = {
        _defaultShape: {
            size: 1,
            color: 0xff2222,
            alpha: 1
        },
        sensorShape: {
            size: 1,
            color: 0x22ff22,
            alpha: 1
        },
        tree: {
            size: 1,
            color: 0x2222ff,
            alpha: 1
        }
    };

    this.showing = {
        shapes: false,
        tree: false
    };
};

 gf.inherit(gf.debug.SpritesPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this),
            pad = document.createElement('div');

        // Show Shapes
        var shapes = document.createElement('div');
        gf.debug.ui.addClass(shapes, 'checkbox');
        gf.debug.ui.setHtml(shapes,
            '<input type="checkbox" value="" id="gf_debug_toggleShapes" class="gf_debug_toggleShapes" name="check" />' +
            '<label for="gf_debug_toggleShapes"></label>' +
            '<span>Draw Collider Shapes</span>'
        );
        gf.debug.ui.bindDelegate(shapes, 'click', 'gf_debug_toggleShapes', this.toggleButton.bind(this, 'shapes'), 'input');
        pad.appendChild(shapes);

        // Show QuadTree
        var tree = document.createElement('div');
        gf.debug.ui.addClass(tree, 'checkbox');
        gf.debug.ui.setHtml(tree,
            '<input type="checkbox" value="" id="gf_debug_toggleQuadTree" class="gf_debug_toggleQuadTree" name="check" />' +
            '<label for="gf_debug_toggleQuadTree"></label>' +
            '<span>Draw QuadTree</span>'
        );
        gf.debug.ui.bindDelegate(tree, 'click', 'gf_debug_toggleQuadTree', this.toggleButton.bind(this, 'tree'), 'input');
        pad.appendChild(tree);

        div.appendChild(pad);

        return div;
    },
    toggleButton: function(type) {
        this.showing[type] = !this.showing[type];
    },
    tick: function() {
        this.gfx.clear();

        //ensure always on top
        if(!this.showing.shapes && !this.showing.tree)
            return this._updateGfx(true);
        else
            this._updateGfx();

        //draw all the bodies
        if(this.showing.shapes) {
            var bods = this.game.physics.bodies;
            for(var i = 0; i < bods.length; ++i) {
                gf.debug.drawBodyShape(
                    bods[i],
                    bods[i].sensor ? this.style.sensorShape : this.style._defaultShape,
                    this.gfx
                );
            }
        }

        //draw the quadtree
        if(this.showing.tree) {
            gf.debug.drawQuadTree(
                this.game.physics.tree,
                this.style.tree,
                this.gfx
            );
        }
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