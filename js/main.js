//register the plugin to grapefruit
gf.plugin.register(debug, 'debug');
window.gfdebug = debug;

//the version of this plugin. Placed in by grunt when built you can change
//this value in the package.json (under version)
debug.version = '@@VERSION';

//on tick funciton to replace the gf.Game.prototype._tick function with
//will call _super to run the normal tick, then tick the panels as well
debug.onTick = function() {
    this._super();

    var dStart = debug.game.clock.now(),
        dEnd;

    debug._statsTick();

    if(debug.panels) {
        debug.panels.map.tick();
        debug.panels.performance.tick();
        debug.panels.sprites.tick();
    }

    dEnd = debug.game.clock.now();
    debug.game.timings.__debugLastDiff = dEnd - dStart;
};

/**
 * Shows the debug bar using the specified game information
 *
 * @method show
 * @param game {gf.Game} the game to debug
 */
debug.show = function(game) {
    if(!game || !(game instanceof gf.Game))
        throw 'Please pass a game instance to debug.show!';

    if(this.game)
        throw 'Already debugging a game instance!';

    this.game = game;

    this.panels = {
        map: new debug.MapPanel(game),
        sprites: new debug.SpritesPanel(game),
        gamepad: new debug.GamepadPanel(game),
        performance: new debug.PerformancePanel(game)
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
debug.logEvent = function(name) {
    if(this.panels && this.panels.performance)
        this.panels.performance.logEvent(name);
};

/**
 * Draws the body of a sprite
 *
 * @method drawPhysicsShape
 * @param shape {Shape} The cp.Shape to draw a visual representation of
 * @param gfx {Graphics} The graphics object to use to draw with
 * @param [style] {Object} The style of the line draws
 * @param [style.size=1] {Number} The thickness of the line stroke
 * @param [style.color=0xff2222] {Number} The color of the line stroke
 * @param [style.alpha=1] {Number} The opacity of the line stroke [0 - 1]
 * @return {Graphics} The graphics object used to draw the shape
 */
gf.Sprite.prototype._drawShape = function(shape, gfx, style) {
    var wt = this.worldTransform,
        x = wt[2],
        y = wt[5],
        sx = wt[0],
        sy = wt[4];

    //setup style
    style = style || {};

    gfx.lineStyle(
        style.size !== undefined ? style.size : 1,
        style.color !== undefined ? style.color : 0xff2222,
        style.alpha !== undefined ? style.alpha : 1
    );

    //draw circle
    //TODO: THIS SHOULD BE BASED ON WORLD TRANSFORM
    if(shape.type === 'circle') {
        /* jshint -W106 */
        var cx = x + (shape.c.x * sx),
            cy = y + (shape.c.y * sy);
        /* jshint +W106 */

        gfx.drawEllipse(cx, cy, shape.r * sx, shape.r * sy);
    }
    //draw polygon
    else {
        var vx = shape.verts[0],
            vy = shape.verts[1];

        gfx.moveTo(
            x + (sx * vx),
            y + (sy * vy)
        );

        for(var i = 2; i < shape.verts.length; i += 2) {
            gfx.lineTo(
                x + (sx * shape.verts[i]),
                y + (sy * shape.verts[i + 1])
            );
        }

        gfx.lineTo(
            x + (sx * vx),
            y + (sy * vy)
        );
    }

    return gfx;
};

debug._bindEvents = function() {
    var activePanel,
        self = this;

    this.ui.delegate(this._bar, 'click', '.gf_debug_menu_item', function(e) {
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

        self.ui.addClass(e.target, 'active');
        panel.toggle();
        activePanel = panel;
    });
};

debug._createElement = function() {
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

debug._createMenuHead = function() {
    var div = document.createElement('div');

    this.ui.addClass(div, 'gf_debug_head');
    this.ui.setText(div, 'Gf Debug (' + this.game.renderMethod + '):');

    return div;
};

debug._createMenuStats = function() {
    this._stats = {};

    var div = document.createElement('div'),
        fps = this._stats.fps = document.createElement('div'),
        dpf = this._stats.dpf = document.createElement('div'),
        ms = this._stats.ms = document.createElement('div');
        //obj = this._stats.obj = document.createElement('div');

    this.ui.addClass(div, 'gf_debug_stats');

    /*this.ui.addClass(obj, 'gf_debug_stats_item world');
    this.ui.setHtml(obj, '<span>0</span>/<span>0</span> Scene Objects Renderable');
    div.appendChild(obj);*/

    this.ui.addClass(dpf, 'gf_debug_stats_item dpf');
    this.ui.setHtml(dpf, '<span>0</span> Draws Each Frame');
    div.appendChild(dpf);

    this.ui.addClass(ms, 'gf_debug_stats_item ms');
    this.ui.setHtml(ms, '<span>0</span> ms');
    div.appendChild(ms);

    this.ui.addClass(fps, 'gf_debug_stats_item fps');
    this.ui.setHtml(fps, '<span>0</span> fps');
    div.appendChild(fps);

    return div;
};

debug.padString = function(str, to, pad) {
    while(str.length < to) {
        str = pad + str;
    }

    return str;
};

debug._statsTick = function() {
    var ms = this.game.timings.tickEnd - this.game.timings.tickStart,
        fps = Math.round(1000 / (this.game.timings.tickStart - this.game.timings.lastTickStart)),
        dpf = this.game.renderer.renderSession.drawCount;

    fps = fps > 60 ? 60 : fps;

    //update stats
    this.ui.setText(this._stats.dpf.firstElementChild, dpf === undefined ? 'N/A' : debug.padString(dpf, 3, 0));
    this.ui.setText(this._stats.ms.firstElementChild, debug.padString(ms.toFixed(0), 4, 0));
    this.ui.setText(this._stats.fps.firstElementChild, debug.padString(fps.toFixed(0), 2, 0));

    //count objects in the world
    /*var objs = debug._countObjs(this.game.stage),
        rnds = 0,
        objects = this.game.stage.children,
        lastObj = this.game.stage.last._iNext;



    do {
        objs++;

        if(!object.visible) {
            object = object.last._iNext;
            continue;
        }

        if(!object.renderable) {
            object = object._iNext;
            continue;
        }

        rnds++;
        object = object._iNext;
    } while(object !== lastObj);

    //set the element values
    debug.ui.setText(debug._stats.obj.children[0], rnds);
    debug.ui.setText(debug._stats.obj.children[1], objs);*/
};