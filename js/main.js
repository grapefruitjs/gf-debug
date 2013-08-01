var d = {
    //the version of this plugin. Placed in by grunt when built you can change
    //this value in the package.json (under version)
    version: '@@VERSION',

    //the version of gf that is required for this plugin to function correctly.
    //Placed in by grunt when built you can change this value in the package.json (under engines.gf)
    gfVersion: '@@GF_VERSION'
};

//register the plugin to grapefruit
gf.plugin.register(d, 'debug');

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
    this.game.on('beforetick', this._beforeTick.bind(this));
    this.game.on('aftertick', this._afterTick.bind(this));

    this.panels = {
        world: new gf.debug.WorldPanel(game),
        sprites: new gf.debug.SpritesPanel(game),
        gamepad: new gf.debug.GamepadPanel(game),
        performance: new gf.debug.PerformancePanel(game)
    };

    this.logSpriteCount = false;

    //add element to the page
    document.body.appendChild(this.createElement());

    this.bindEvents();
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

gf.debug.bindEvents = function() {
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

        self.ui.addClass(e.target, 'active');
        panel.toggle();
        activePanel = panel;
    });
};

gf.debug.createElement = function() {
    var c = this._container = document.createElement('div'),
        bar = this._bar = document.createElement('div');

    //container
    this.ui.addClass(c, 'gf_debug');
    c.appendChild(bar);

    //the menu bar
    this.ui.addClass(bar, 'gf_debug_menu');
    bar.appendChild(this.createMenuHead());
    bar.appendChild(this.createMenuStats());

    //add the panels
    for(var p in this.panels) {
        bar.appendChild(this.panels[p].createMenuElement());
        c.appendChild(this.panels[p].createPanelElement());
    }

    return c;
};

gf.debug.createMenuHead = function() {
    var div = document.createElement('div');

    this.ui.addClass(div, 'gf_debug_menu_item gf_debug_head');
    this.ui.setText(div, 'Gf Debug:');

    return div;
};

gf.debug.createMenuStats = function() {
    this._stats = {};

    var div = document.createElement('div'),
        fps = this._stats.fps = document.createElement('div'),
        ms = this._stats.ms = document.createElement('div'),
        spr = this._stats.spr = document.createElement('div');

    this.ui.addClass(div, 'gf_debug_stats');

    this.ui.addClass(ms, 'gf_debug_stats_item ms');
    this.ui.setHtml(ms, '<span>0</span> ms');
    div.appendChild(ms);

    this.ui.addClass(fps, 'gf_debug_stats_item fps');
    this.ui.setHtml(fps, '<span>0</span> fps');
    div.appendChild(fps);

    this.ui.addClass(spr, 'gf_debug_stats_item spr');
    this.ui.setHtml(spr, '<span>0</span> sprites');
    div.appendChild(spr);

    return div;
};

gf.debug.timer = (window.performance && window.performance.now) ? window.performance : Date;

gf.debug._beforeTick = function() {
    this._tickStart = this.timer.now();
};

gf.debug._afterTick = function() {
    this.statsTick();
    this.panels.performance.tick();
    this.panels.gamepad.tick();
};

gf.debug.statsTick = function() {
    this._tickEnd = this.timer.now();

    var ms = this._tickEnd - this._tickStart,
        fps = 1000/ms;

    fps = fps > 60 ? 60 : fps;

    //update stats
    this.ui.setText(this._stats.ms.firstElementChild, ms.toFixed(2));
    this.ui.setText(this._stats.fps.firstElementChild, fps.toFixed(2));
};

//update the number of sprites every seconds (instead of every frame)
//since it is so expensive
setInterval(function() {
    if(gf.debug._stats && gf.debug._stats.spr) {
        //count sprites in active state
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

        gf.debug.ui.setText(gf.debug._stats.spr.firstElementChild, c);

        //log the event to the performance graph
        if(gf.debug.logSpriteCount)
            gf.debug.logEvent('debug_count_sprites');
    }
}, 1000);