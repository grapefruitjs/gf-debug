debug.Minimap = function(container, state) {
    this.canvas = document.createElement('canvas');
    this.prerenderCanvas = document.createElement('canvas');

    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.pctx = this.prerenderCanvas.getContext('2d');

    this.world = state.world;
    this.camera = state.camera;

    this.scale = 1;

    this._hasRendered = false;

    this.viewportRectColor = 'rgba(255, 0, 255, 1)';

    this.active = true;
    this.maxSize = new gf.Vector();
};

gf.inherit(debug.Minimap, Object, {
    show: function() {
        debug.ui.show(this.canvas);
        this.active = true;
    },
    hide: function() {
        debug.ui.hide(this.canvas);
        this.active = false;
    },
    render: function(full) {
        if(!this.active)
            return;

        if(full || !this._hasRendered) {
            //find the largest tilemap
            for(var w = 0, wl = this.world.children.length; w < wl; ++w) {
                var map = this.world.children[w];

                if(map instanceof gf.Tilemap) {
                    this.maxSize.x = gf.math.max(this.maxSize.x, map.size.x * map.tileSize.x);
                    this.maxSize.y = gf.math.max(this.maxSize.y, map.size.y * map.tileSize.y);
                }
            }

            if(this.maxSize.x === 0 || this.maxSize.y === 0) {
                return;
            }

            this._hasRendered = true;

            this.canvas.width = this.prerenderCanvas.width = this.maxSize.x;
            this.canvas.height = this.prerenderCanvas.height = this.maxSize.y;

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
        var world = this.world,
            pos = world.position,
            cam = this.camera,
            scaleX = this.scale * world.scale.x,
            scaleY = this.scale * world.scale.y,
            sizeX = Math.min(cam.size.x, this.maxSize.x),
            sizeY = Math.min(cam.size.y, this.maxSize.y);

        this.ctx.strokeStyle = this.viewportRectColor;
        this.ctx.strokeRect(
            -pos.x * scaleX,
            -pos.y * scaleY,
            sizeX * scaleX,
            sizeY * scaleY
        );
    },
    prerender: function() {
        var world = this.world;

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
            tx;

        if(!set) return;

        tx = set.getTileTexture(tid);

        if(!tx) return;

        //from pixi canvas renderer
        this.pctx.drawImage(
            tx.baseTexture.source,
            tx.frame.x,
            tx.frame.y,
            tx.frame.width,
            tx.frame.height,
            x * tx.frame.width,
            y * tx.frame.height,
            tx.frame.width * this.scale,
            tx.frame.height * this.scale
        );
    }
});