gf.debug.Minimap = function(container, state) {
    this.canvas = document.createElement('canvas');
    this.prerenderCanvas = document.createElement('canvas');

    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.pctx = this.prerenderCanvas.getContext('2d');

    this.world = state.world;
    this.camera = state.camera;

    this.scale = 0.25;

    this._hasRendered = false;

    this.viewportRectColor = 'rgba(255, 0, 255, 1)';

    this.active = true;
};

gf.inherit(gf.debug.Minimap, Object, {
    show: function() {
        gf.debug.show(this.canvas);
        this.active = true;
    },
    hide: function() {
        gf.debug.hide(this.canvas);
        this.active = false;
    },
    render: function(full) {
        if(!this.map || !this.active)
            return;

        if(full || !this._hasRendered) {
            this._hasRendered = true;

            this.canvas.width = this.prerenderCanvas.width = (this.map.size.x * this.map.tileSize.x * this.scale);
            this.canvas.height = this.prerenderCanvas.height = (this.map.size.y * this.map.tileSize.y * this.scale);

            //pre renders the tilemaps to the prerenderCanvas
            this.prerender();
        }

        //redraw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMap();
        this.drawObjects();
        this.drawViewport();
    },
    drawMap: function() {
        //draw the prerendered map canvas
        this.ctx.drawImage(this.prerenderCanvas, 0, 0);
    },
    drawObjects: function() {
        // NOT YET IMPLEMENTED
    },
    drawViewport: function() {
        //draw the viewport
        var w = this.world,
            p = w.position,
            c = this.camera,
            s = this.scale;

        this.ctx.strokeStyle = this.viewportRectColor;
        this.ctx.strokeRect(
            (-p.x * s) / w.scale.x,
            (-p.y * s) / w.scale.x,
            (c.size.x * s) / w.scale.x,
            (c.size.y * s) / w.scale.y
        );
    },
    prerender: function() {
        var world = this.game.world;

        //for each child of world, if it is visible and a tilemap, prerender it
        for(var w = 0, wl = world.children.length; w < wl; ++w) {
            if(world.children[w].visible && world.children[w] instanceof gf.Tilemap) {
                this.prerenderMap(world.children[w]);
            }
        }
    },
    prerenderMap: function(map) {
        for(var l = 0, ll = map.children.length; l < ll; ++l) {
            var layer = map.children[l];

            //if it is a Tilelayer and is visible
            if(layer.tileIds && layer.visible) {
                this.prerenderLayer(layer, map);
            }
        }
    },
    prerenderLayer: function(layer, map) {
        var size = map.size;

        //render the layer one tile at a time
        for(var x = 0, xl = size.x; x < xl; ++x) {
            for(var y = 0, yl = size.y; y < yl; ++y) {
                var id = (x + (y * size.x)),
                    tid = layer.tileIds[id];

                this.prerenderTile(tid, map, x, y);
            }
        }
    },
    prerenderTile: function(tid, map, x, y) {
        var set = map.getTileset(tid),
            tx = set.getTileTexture(tid);

        if(!set || !tx)
            return;

        //from pixi canvas renderer
        this.pctx.drawImage(
            tx.baseTexture.source,
            tx.frame.x,
            tx.frame.y,
            tx.frame.width,
            tx.frame.height,
            x,
            y,
            tx.frame.width * this.scale,
            tx.frame.height * this.scale
        );
    }
});