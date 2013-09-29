gf.debug.SpritesPanel = function(game) {
    gf.debug.Panel.call(this, game);

    this.name = 'sprites';
    this.title = 'Sprites';

    this.gfx = new gf.PIXI.Graphics();

    this.style = {
        _default: {
            size: 1,
            color: 0xff2222,
            alpha: 1
        },
        sensor: {
            size: 1,
            color: 0x22ff22,
            alpha: 1
        }
    };
};

 gf.inherit(gf.debug.SpritesPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this),
            pad = document.createElement('div'),
            col = document.createElement('div');

        // Show colliders
        gf.debug.ui.addClass(col, 'checkbox');
        gf.debug.ui.setHtml(col,
            '<input type="checkbox" value="None" id="gf_debug_toggleCollisions" class="gf_debug_toggleCollisions" name="check" />' +
            '<label for="gf_debug_toggleCollisions"></label>' +
            '<span>Show sprite colliders</span>'
        );
        gf.debug.ui.bindDelegate(col, 'click', 'gf_debug_toggleCollisions', this.toggleCollisions.bind(this), 'input');
        pad.appendChild(col);

        div.appendChild(pad);

        return div;
    },
    toggleCollisions: function() {
        this.showing = !this.showing;

        if(this.showing) {
            this.game.world.addChild(this.gfx);
            this._drawPhysics();
        } else {
            if(this.gfx.parent)
                this.gfx.parent.removeChild(this.gfx);
        }
    },
    tick: function() {
        if(this.showing) {
            this._drawPhysics();
        }
    },
    _drawPhysics: function() {
        var self = this,
            g = this.gfx;

        this.gfx.clear();
        this.game.physics.space.eachShape(function(shape) {
            if(!shape.body) return;

            var body = shape.body,
                p = body.p,
                style = shape.sensor ? self.style.sensor : self.style._default;

            g.lineStyle(style.size, style.color, style.alpha);

            //circle
            if(shape.type === 'circle') {
                var cx = shape.bb_l + ((shape.bb_r - shape.bb_l) / 2),
                    cy = shape.bb_t + ((shape.bb_b - shape.bb_t) / 2);

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
    }
});