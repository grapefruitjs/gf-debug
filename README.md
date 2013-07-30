# Grapefruit Debug Plugin

This plugin provides a powerful debug toolbar that displays some useful information, and provides ways
of enabling certain debug features.

## Usage

You can use the plugin on your page by including the built css, and the built js after you include grapefruit:

```html
<!doctype html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="/css/vendor/gf/gf-debug.css"/>
    </head>
    <body>
        <!-- your body -->
        <script src="/js/vendor/gf/gf.min.js"></script>
        <script src="/js/vendor/gf/gf-debug.min.js"</script>
    </body>
</html>
```

Then somewhere in your game code, after you create a game instance you can tell the debugger to debug that game:

```js
gf.debug.show(game);
```

Which will show the debug bar using the specified game.

## Panels

The plugin provides a few panels of information which are outlined here:

### World

This panel provides information about the currently loaded world (`game.world`). As the currently active game state
changes, this will change as well to reflect the new world used in the active game state.

### Sprites

### Physics

### Performance
