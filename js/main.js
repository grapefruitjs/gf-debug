//register the plugin to grapefruit
gf.plugin.register({}, 'debug');

//the version of this plugin. Placed in by grunt when built you can change
//this value in the package.json (under version)
gf.debug.version = '@@VERSION';

//the version of gf that is required for this plugin to function correctly.
//Placed in by grunt when built you can change this value in the package.json (under engines.gf)
gf.debug.gfVersion = '@@GF_VERSION';

//on tick funciton to replace the gf.Game.prototype._tick function with
//will call _super to run the normal tick, then tick the panels as well
gf.debug.onTick = function() {
    this._super();

    var dStart = gf.debug.game.clock.now(),
        dEnd;

    gf.debug._statsTick();

    if(gf.debug.panels) {
        //gf.debug.panels.map.tick();
        gf.debug.panels.performance.tick();
        gf.debug.panels.sprites.tick();
    }

    dEnd = gf.debug.game.clock.now();
    gf.debug.game.timings.__debugLastDiff = dEnd - dStart;
};

/**
 * Shows the debug bar using the specified game information
 *
 * @method show
 * @param game {gf.Game} the game to debug
 */
gf.debug.show = function(game) {
    if(!game || !(game instanceof gf.Game))
        throw 'Please pass a game instance to gf.debug.show!';

    if(this.game)
        throw 'Already debugging a game instance!';

    this.game = game;

    this.panels = {
        map: new gf.debug.MapPanel(game),
        sprites: new gf.debug.SpritesPanel(game),
        gamepad: new gf.debug.GamepadPanel(game),
        performance: new gf.debug.PerformancePanel(game)
    };

    //patch the tick method
    gf.plugin.patch(gf.Game, '_tick', this.onTick);

    this.logObjectCountEvent = false;

    //add element to the page
    document.body.appendChild(this._createElement());

    this._bindEvents();
};

/**
 * Shows some event occuring on the timeline of the performance graph
 * which makes it easy to see what is impacting performance and when
 *
 * @method logEvent
 * @param name {String} the event name to show on the graph
 */
gf.debug.logEvent = function(name) {
    if(this.panels && this.panels.performance)
        this.panels.performance.logEvent(name);
};

/**
 * Draws the body of a sprite
 *
 * @method drawBodyShape
 * @param body {Body} The body to draw a visual representation of
 * @param [style] {Object} The style of the line draws
 * @param [style.size=1] {Number} The thickness of the line stroke
 * @param [style.color=0xff2222] {Number} The color of the line stroke
 * @param [style.alpha=1] {Number} The opacity of the line stroke [0 - 1]
 * @param [gfx] {Graphics} The graphics object to use to draw with, if
 *      none is passed a new one is created and added ot the world.
 * @return {Graphics} The graphics object used to draw the shape
 */
gf.debug.drawBodyShape = function(body, style, gfx) {
    var shape = body.shape,
        p = shape.position,
        style = body.sensor ? self.style.sensor : self.style._default,
        game = this.game;

    //setup gfx
    gfx = gfx || (function() {
                    var g = new gf.PIXI.Graphics();
                    game.world.add.obj(g);
                    return g;
                })();

    //setup style
    style = style || {};

    gfx.lineStyle(
        style.size !== undefined ? style.size : 1,
        style.color !== undefined ? style.color : 0xff2222,
        style.alpha !== undefined ? style.alpha : 1
    );

    //draw circle
    if(shape._shapetype === gf.SHAPE.CIRCLE) {
        //var cx = shape.bb_l + ((shape.bb_r - shape.bb_l) / 2),
        //    cy = shape.bb_t + ((shape.bb_b - shape.bb_t) / 2);

        gfx.drawCircle(p.x, p.y, shape.radius);
    }
    //draw polygon
    else {
        var pt = shape.points[0];

        gfx.moveTo(p.x + pt.x, p.y + pt.y);

        for(var x = 1; x < shape.points.length; x++) {
            gfx.lineTo(
                p.x + shape.points[x].x,
                p.y + shape.points[x].y
            );
        }

        gfx.lineTo(p.x + pt.x, p.y + pt.y);
    }

    return gfx;
};

/**
 * Draws the quadtree used by physics onto the screen
 *
 * @method drawQuadTree
 * @param [tree=game.physics.tree] {QuadTree} The quadtree to draw, generally this is for recursing
 * @param [style] {Object} The style of the line draws
 * @param [style.size=1] {Number} The thickness of the line stroke
 * @param [style.color=0x2222ff] {Number} The color of the line stroke
 * @param [style.alpha=1] {Number} The opacity of the line stroke [0 - 1]
 * @param [gfx] {Graphics} The graphics object to use to draw with, if
 *      none is passed a new one is created and added ot the world.
 * @return {Graphics} The graphics object used to draw the tree
 */
gf.debug.drawQuadTree = function(tree, style, gfx) {
    //setup gfx
    gfx = gfx || (function() {
                    var g = new gf.PIXI.Graphics();
                    game.world.add.obj(g);
                    return g;
                })();

    tree = tree || this.game.physics.tree;

    //setup style
    style = style || {};

    gfx.lineStyle(
        style.size !== undefined ? style.size : 1,
        style.color !== undefined ? style.color : 0x2222ff,
        style.alpha !== undefined ? style.alpha : 1
    );

    //draw our bounds
    gfx.drawRect(
        tree.bounds.x,
        tree.bounds.y,
        tree.bounds.width,
        tree.bounds.height
    );

    //draw each node
    if(tree.nodes.length) {
        for(i = 0; i < tree.nodes.length; ++i) {
            //recurse for children
            this.drawQuadTree(tree.nodes[i], style, gfx);
        }
    }

    return gfx;
};

gf.debug._bindEvents = function() {
    var activePanel,
        self = this;

    this.ui.bindDelegate(this._bar, 'click', 'gf_debug_menu_item', function(e) {
        var panel = self.panels[e.target.className.replace(/gf_debug_menu_item|active/g, '').trim()];

        if(!panel)
            return;

        if(activePanel) {
            activePanel.toggle();
            self.ui.removeClass(activePanel._menuItem, 'active');

            if(activePanel.name === panel.name) {
                activePanel = null;
                return;
            }
        }

        if(panel.name === 'performance')
            panel.active = true;
        else
            self.panels.performance.active = false;

        self.ui.addClass(e.target, 'active');
        panel.toggle();
        activePanel = panel;
    });
};

gf.debug._createElement = function() {
    var c = this._container = document.createElement('div'),
        bar = this._bar = document.createElement('div');

    //container
    this.ui.addClass(c, 'gf_debug');
    c.appendChild(bar);

    //the menu bar
    this.ui.addClass(bar, 'gf_debug_menu');
    bar.appendChild(this._createMenuHead());
    bar.appendChild(this._createMenuStats());

    //add the panels
    for(var p in this.panels) {
        bar.appendChild(this.panels[p].createMenuElement());
        c.appendChild(this.panels[p].createPanelElement());
    }

    return c;
};

gf.debug._createMenuHead = function() {
    var div = document.createElement('div');

    this.ui.addClass(div, 'gf_debug_head');
    this.ui.setText(div, 'Gf Debug (' + this.game.renderMethod + '):');

    return div;
};

gf.debug._createMenuStats = function() {
    this._stats = {};

    var div = document.createElement('div'),
        fps = this._stats.fps = document.createElement('div'),
        ms = this._stats.ms = document.createElement('div'),
        obj = this._stats.obj = document.createElement('div');

    this.ui.addClass(div, 'gf_debug_stats');

    this.ui.addClass(ms, 'gf_debug_stats_item ms');
    this.ui.setHtml(ms, '<span>0</span> ms');
    div.appendChild(ms);

    this.ui.addClass(fps, 'gf_debug_stats_item fps');
    this.ui.setHtml(fps, '<span>0</span> fps');
    div.appendChild(fps);

    this.ui.addClass(obj, 'gf_debug_stats_item obj');
    this.ui.setHtml(obj, '<span>0</span> objects');
    div.appendChild(obj);

    return div;
};

gf.debug._statsTick = function() {
    var ms = this.game.timings.tickEnd - this.game.timings.tickStart,
        fps = 1000/ms;

    fps = fps > 60 ? 60 : fps;

    //update stats
    this.ui.setText(this._stats.ms.firstElementChild, ms.toFixed(2));
    this.ui.setText(this._stats.fps.firstElementChild, fps.toFixed(2));
};
/*

//update the number of sprites every couple seconds (instead of every frame)
//since it is so expensive
setInterval(function() {
    if(gf.debug._stats && gf.debug._stats.obj) {
        //count objects in active state
        var c = 0,
            s = gf.debug.game.activeState,
            wld = s.world,
            cam = s.camera;

        while(wld) {
            c++;
            wld = wld._iNext;
        }

        while(cam) {
            c++;
            cam = cam._iNext;
        }

        gf.debug.ui.setText(gf.debug._stats.obj.firstElementChild, c);

        //log the event to the performance graph
        if(gf.debug.logObjectCountEvent)
            gf.debug.logEvent('debug_count_objects');
    }
}, 2000);
*/