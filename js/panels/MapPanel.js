gf.debug.MapPanel = function (game) {
    gf.debug.Panel.call(this, game);

    this.name = 'map';
    this.title = 'Mini-Map';
    this.map = null;
    this.maps = {};

    this._cache = {
        numStates: 0,
        state: null
    };
};

 gf.inherit(gf.debug.MapPanel, gf.debug.Panel, {
    createPanelElement: function() {
        var div = gf.debug.Panel.prototype.createPanelElement.call(this);

        this.states = document.createElement('ul');
        gf.debug.ui.addClass(this.states, 'states');
        gf.debug.ui.delegate(this.states, 'click', 'li', this.onClickState.bind(this));
        div.appendChild(this.states);

        this.mapsui = document.createElement('ul');
        gf.debug.ui.addClass(this.mapsui, 'maps');
        gf.debug.ui.delegate(this.mapsui, 'click', 'li', this.onClickMap.bind(this));
        div.appendChild(this.mapsui);

        return div;
    },
    refresh: function() {
        //build states list
        this.buildStateList();

        //clear maps/layers
        gf.debug.ui.empty(this.mapsui);

        //hide current map
        if(this.map)
            this.map.hide();

        this.map = null;
    },
    buildStateList: function() {
        gf.debug.ui.empty(this.states);

        var states = this.game.state.states,
            name, state;

        for(name in states) {
            state = states[name];

            var li = this.createLi('state', name, state.visible);
            li.dataset.name = name;
            this.states.appendChild(li);

            if(!this.maps[name])
                this.maps[name] = new gf.debug.Minimap(this._panel, state);
            else
                this.maps[name].render(true);
        }
    },
    buildMapList: function(state) {
        gf.debug.ui.empty(this.mapsui);

        //loop through each child of the selected state
        for(var i = 0; i < state.world.children; ++i) {
            var child = state.world.children[i];

            //if this is a tilemap show it and all layers
            if(child instanceof gf.Tilemap) {
                var li = this.createLi('map', child._cachekey, child.visible);
                li.dataset.index = i;

                //if there are any children create a sublist
                if(child.children.length) {
                    var ul = document.createElement('ul'),
                        add = false;

                    for(var l = 0; l < child.children; ++l) {
                        var layer = child.children[l];

                        //only add tilelayers
                        if(layer.type === 'tilelayer') {
                            var lli = this.createLi('layer', layer.name, layer.visible);

                            lli.dataset.mapIndex = i;
                            lli.dataset.index = l;

                            ul.appendChild(lli);

                            add = true;
                        }
                    }

                    //add the sublist to the map li
                    if(add)
                        li.appendChild(ul);
                }

                //add the map li to the list
                this.mapsui.appendChild(li);
            }
        }
    },
    createLi: function(cls, text, active) {
        var li = document.createElement('li');

        gf.debug.ui.addClass(li, cls);
        gf.debug.ui.setText(li, text);

        if(active)
            gf.debug.ui.addClass('active');

        return li;
    },
    onClickState: function(e) {
        var data = e.target.dataset;

        if(this.map)
            this.map.hide();

        this.map = this.maps[data.name];
        this.map.show();
        this.buildMapList(this.game.state.states[data.name]);
    },
    onClickMap: function(e) {
        var data = e.target.dataset,
            obj;

        if(data.mapIndex !== undefined) {
            obj = this._cache.state.world.children[data.mapIndex].children[data.index];
        } else {
            obj = this._cache.state.world.children[data.index];
        }

        //toggle visibility
        obj.visible = !obj.visible;

        if(obj.visible)
            e.target.addClass('active');
        else
            e.target.removeClass('active');
    },
    tick: function() {
        if(!this.active)
            return;

        if(this._cache.numStates !== this.game.state.count || this._cache.state !== this.game.state.active) {
            this._cache.numStates = this.game.state.count;
            this._cache.state = this.game.state.active;
            this.refresh();
            this.map = this.maps[this.game.state.active.name];
        }

        if(this.map)
            this.map.render();
    }
});