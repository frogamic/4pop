var defaults = {'tlb':'#00f','trb':'#f0f','blb':'#fa0','brb':'bluetooth','tld':'#f50','trd':'#ff0','bld':'#f00','brd':'battery','tlh':'#fff','trh':'#fff','blh':'#fff','brh':'#fff','vibe':1};

function pcolor_from_hex(hex) {
    hex = hex.toLowerCase();
    hex = hex.replace(/0/g, "00").replace(/5/g, "01").replace(/a/g, "10").replace(/f/g, "11").replace("#", "11");
    return parseInt(hex, 2);
}

function replace_colors(config) {
    for (var key in config) {
        if (typeof config[key] === "string") {
            if (config[key] === "bluetooth")
                config[key] = 0;
            else if (config[key] === "battery")
                config[key] = 1;
            else
                config[key] = pcolor_from_hex(config[key]);
        }
    }
}

Pebble.addEventListener('ready', function() {
    // window.localStorage.removeItem("config_4pop");
    var config = JSON.parse(window.localStorage.getItem("config_4pop"));
    if (config) {
        var changed = false;
        for (var key in defaults) {
            if (!config[key]) {
                changed = true;
                config[key] = defaults[key];
            }
        }
        if (changed) {
            window.localStorage.setItem("config_4pop", JSON.stringify(config));
        }
    } else {
        window.localStorage.setItem("config_4pop", JSON.stringify(defaults));
    }
});

Pebble.addEventListener('showConfiguration', function () {
    Pebble.openURL('data:text/html,' + encodeURIComponent(config_html.replace("INSERT_SETTINGS_HERE", window.localStorage.getItem("config_4pop")).replace("INSERT_VERSION_HERE", appinfo.versionLabel) + '<!--.html'));
});

Pebble.addEventListener('webviewclosed', function(e) {
    if (e.response !== "cancel") {
        var config = JSON.parse(decodeURIComponent(e.response));
        config.vibe = (config.vibe) ? 1 : 0;
        window.localStorage.setItem("config_4pop", e.response);
        replace_colors(config);
        Pebble.sendAppMessage(config);
        console.log(JSON.stringify(config));
    }
});

