debug.SpritesPanel = function(game) {
    debug.Panel.call(this, game);

    this.name = 'sprites';
    this.title = 'Sprites';

    this.gfx = new gf.Graphics();

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

        return div;
    },
    toggleType: function(type) {
        this.showing[type] = !this.showing[type];
    },
    tick: function() {
        if(this.game.world !== this.gfx.parent) {
            if(this.gfx.parent)
                this.gfx.parent.removeChild(this.gfx);

            this.game.world.add.obj(this.gfx);
        }

        this.gfx.clear();

        //ensure always on top
        if(!this.showing.shapes/* && !this.showing.tree*/)
            return this._updateGfx(true);
        else
            this._updateGfx();

        //draw all the bodies
        if(this.showing.shapes) {
            var g = this.gfx, self = this;
            this.game.physics.space.eachShape(function(shape) {
                if(!shape.body) return;

                var body = shape.body,
                    p = body.p,
                    style = shape.sensor ? self.style.sensorShape : self.style._defaultShape;

                g.lineStyle(style.size, style.color, style.alpha);

                //circle
                if(shape.type === 'circle') {
                    /* jshint -W106 */
                    var cx = shape.bb_l + ((shape.bb_r - shape.bb_l) / 2),
                        cy = shape.bb_t + ((shape.bb_b - shape.bb_t) / 2);
                    /* jshint +W106 */

                    g.drawCircle(cx, cy, shape.r);
                }
                //polygon
                else {
                    var sx = shape.verts[0],
                        sy = shape.verts[1];

                    g.moveTo(p.x + sx, p.y + sy);

                    for(var i = 2; i < shape.verts.length; i+=2) {
                        g.lineTo(
                            p.x + shape.verts[i],
                            p.y + shape.verts[i + 1]
                        );
                    }

                    g.lineTo(p.x + sx, p.y + sy);
                }
            });
            /*var bods = this.game.physics.bodies;
            for(var i = 0; i < bods.length; ++i) {
                debug.drawBodyShape(
                    bods[i],
                    bods[i].sensor ? this.style.sensorShape : this.style._defaultShape,
                    this.gfx
                );
            }*/
        }

        //draw the quadtree
        /*if(this.showing.tree) {
            debug.drawQuadTree(
                this.game.physics.tree,
                this.style.tree,
                this.gfx
            );
        }*/
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
