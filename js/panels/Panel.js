gf.debug.Panel = function(game) {
    this.game = game;
    this.name = '';
    this.title = '';
};

 gf.inherit(gf.debug.Panel, Object, {
    //builds the html for a panel
    createPanelElement: function() {
        var div = this._panel = document.createElement('div');
        gf.debug.ui.addClass(div, 'gf_debug_panel');
        gf.debug.ui.addClass(div, this.name);

        return div;
    },
    //builds the html for this panels menu item
    createMenuElement: function() {
        var div = this._menuItem = document.createElement('div');
        gf.debug.ui.addClass(div, 'gf_debug_menu_item ' + this.name);
        gf.debug.ui.setText(div, this.title);

        return div;
    },
    toggle: function() {
        if(this._panel.style.display === 'block')
            this.hide();
        else
            this.show();
    },
    show: function() {
        gf.debug.ui.setStyle(this._panel, 'display', 'block');
    },
    hide: function() {
        gf.debug.ui.setStyle(this._panel, 'display', 'none');
    }
});