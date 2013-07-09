var d = {
    _init: false,
    show: function(cont, o) {
        if(!o.game)
            throw 'Need to know what game to debug!';

        d.game = o.game;
        d.game.on('beforetick', d._beforeTick);
        d.game.on('aftertick', d._afterTick);

        if(o.fps !== false)
            d.showFps(cont, o.fps);

        if(o.gamepad !== false)
            d.showGamepad(cont, o.game);

        if(o.player)
            d.showPlayer(cont, o.player);
    },
    //show the FPS Counter
    showFps: function(cont, o) {
        if(d.meter) return d.meter;

        if(typeof cont === 'object' && cont.nodeType === undefined) {
            o = cont;
            cont = document.body;
        }
        cont = d._ensureContainer(cont);

        o = o || {};
        //add some of our defaults
        o.smoothing = o.smoothing || 1;
        o.heat = o.heat !== undefined ? o.heat : true;
        o.graph = o.graph !== undefined ? o.graph : true;
        o.history = o.history !== undefined ? o.history : 25;

        d.meter = new FPSMeter(cont, o);
    },
    //show the Entity Tracker
    showEntity: function(cont, ent) {
        if(d.entity) return d.entity;

        if(typeof cont === 'object' && cont.nodeType === undefined) {
            ent = cont;
            cont = document.body;
        }
        cont = d._ensureContainer(cont);

        if(ent) {
            d.entity = new EntityTracker(cont, ent);
        }
    },
    //show the Gamepad Tracker
    showGamepad: function(cont, game) {
        if(d.gamepad) return d.gamepad;

        if(typeof cont === 'object' && cont.nodeType === undefined) {
            game = cont;
            cont = document.body;
        }
        cont = d._ensureContainer(cont);

        if(game) {
            d.gamepad = new GamepadTracker(cont, game);
        }
    },

    _beforeTick: function() {
        if(d.meter)
            d.meter.tickStart();
    },
    _afterTick: function() {
        if(d.meter)
            d.meter.tick();

        if(d.entity)
            d.entity.tick();

        if(d.gamepad)
            d.gamepad.tick();
    },

    _ensureContainer: function(cont) {
        if(typeof cont === 'string')
            cont = document.getElementById(cont);

        if(!cont)
            cont = document.body;

        return cont;
    },
    setStyle: function(dom, style) {
        for(var key in style) {
            dom.style[key] = style[key];
        }
    }
};

//the version of this plugin. Placed in by grunt when built
//you can change this value in the package.json (under version)
d.version = '@@VERSION';

//the version of gf that is required for this plugin
//to function correctly. Placed in by grunt when built
//you can change this value in the package.json (under engines.gf)
d.gfVersion = '@@GF_VERSION';

//register the plugin to grapefruit
gf.plugin.register(d, 'debug');
