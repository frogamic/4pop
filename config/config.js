
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

Pebble.addEventListener('showConfiguration', function () {
    Pebble.openURL('https://cdn.rawgit.com/frogamic/4pop/v1.0/config/config.html?version=' + appinfo.versionLabel);
});

Pebble.addEventListener('webviewclosed', function(e) {
    if (e.response !== "cancel") {
        var config = JSON.parse(decodeURIComponent(e.response));
        config.vibe = (config.vibe) ? 1 : 0;
        window.localStorage.setItem("config_4pop", e.response);
        replace_colors(config);
        Pebble.sendAppMessage(config);
    }
});

