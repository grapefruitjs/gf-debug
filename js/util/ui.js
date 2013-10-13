//Some general dom helpers
gf.debug.ui = {
    delegate: function(dom, evt, selector, fn) {
        dom.addEventListener(evt, function(e) {
            if(e.target && e.target.matches(selector)) {
                if(fn) fn(e);
            }
        });
    },

    removeClass: function(dom, cls) {
        var classes = dom.className.split(' '),
            i = classes.indexOf(cls);

        if(i !== -1) {
            classes.splice(i, 1);
            dom.className = classes.join(' ').trim();
        }
    },

    addClass: function(dom, cls) {
        var classes = dom.className.split(' ');

        classes.push(cls);
        dom.className = classes.join(' ').trim();
    },

    setText: function(dom, txt) {
        dom.textContent = txt;
    },

    setHtml: function(dom, html) {
        dom.innerHTML = html;
    },

    setStyle: function(dom, style, value) {
        if(typeof style === 'string') {
            dom.style[style] = value;
        } else {
            for(var key in style) {
                dom.style[key] = style[key];
            }
        }
    },

    empty: function(dom) {
        while(dom.firstChild) {
            dom.removeChild(dom.firstChild);
        }
    },

    show: function(dom) {
        this.setStyle(dom, 'display', 'block');
    },

    hide: function(dom) {
        this.setStyle(dom, 'display', 'none');
    }
};

// polyfill for matchesSelector
if (!HTMLElement.prototype.matches) {
    var htmlprot = HTMLElement.prototype;

    htmlprot.matches =
        htmlprot.matches ||
        htmlprot.webkitMatchesSelector ||
        htmlprot.mozMatchesSelector ||
        htmlprot.msMatchesSelector ||
        htmlprot.oMatchesSelector ||
        function (selector) {
            // poorman's polyfill for matchesSelector
            var elements = this.parentElement.querySelectorAll(selector),
                element,
                i = 0;

            while (element = elements[i++]) {
                if (element === this) return true;
            }
            return false;
        };
}