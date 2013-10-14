debug.Panel = function(game) {
    this.game = game;
    this.name = '';
    this.title = '';
    this.active = false;
};

gf.inherit(debug.Panel, Object, {
    //builds the html for a panel
    createPanelElement: function() {
        var div = this._panel = document.createElement('div');
        debug.ui.addClass(div, 'gf_debug_panel');
        debug.ui.addClass(div, this.name);

        return div;
    },
    //builds the html for this panels menu item
    createMenuElement: function() {
        var div = this._menuItem = document.createElement('div');
        debug.ui.addClass(div, 'gf_debug_menu_item ' + this.name);
        debug.ui.setText(div, this.title);

        return div;
    },
    toggle: function() {
        if(this._panel.style.display === 'block') {
            this.hide();
            this.active = false;
        } else {
            this.show();
            this.active = true;
        }
    },
    show: function() {
        debug.ui.setStyle(this._panel, 'display', 'block');
    },
    hide: function() {
        debug.ui.setStyle(this._panel, 'display', 'none');
    }
});