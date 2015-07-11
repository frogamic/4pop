// File generated automatically from files in /config. Do not change this file as it will be replaced
var appinfo = { "uuid": "34624378-9ddd-44d0-a3be-80adcf8c045b", "shortName": "4pop", "longName": "4pop", "companyName": "frogamic", "versionLabel": "0.5", "sdkVersion": "3", "targetPlatforms": ["basalt"], "capabilities": ["configurable"], "watchapp": { "watchface": true }, "appKeys": { "tlb": 0, "trb": 1, "blb": 2, "brb": 3, "tld": 4, "trd": 5, "bld": 6, "brd": 7, "tlh": 8, "trh": 9, "blh": 10, "brh": 11, "vibe": 12 }, "resources": { "media": [] } };
var config_html = "<html><head>\n<title>4pop settings page</title>\n<style type=\"text/css\">\n#colorpicker {\nposition: fixed;\nwidth: 100%;\nheight: 100%;\ntop: 0;\nleft: 0;\noverflow: scroll;\n}\n.extitem {\nwidth: 50vw;\ndisplay: inline-block;\ntext-align: center;\n}\n.coloritem {\nwidth: 25vw;\nheight: 25vw;\ndisplay: inline-block;\n}\nbutton {\nwidth: 45%;\nheight: 50;\n}\nbody {\ntext-align: center;\n}\n</style>\n<script>\nvar nColors = 64;\nvar nExt = 2;\nvar colors = [\"#000\", \"#005\", \"#00a\", \"#00f\", \"#050\", \"#055\", \"#05a\", \"#05f\", \"#0a0\", \"#0a5\", \"#0aa\", \"#0af\", \"#0f0\", \"#0f5\", \"#0fa\", \"#0ff\", \"#500\", \"#505\", \"#50a\", \"#50f\", \"#550\", \"#555\", \"#55a\", \"#55f\", \"#5a0\", \"#5a5\", \"#5aa\", \"#5af\", \"#5f0\", \"#5f5\", \"#5fa\", \"#5ff\", \"#a00\", \"#a05\", \"#a0a\", \"#a0f\", \"#a50\", \"#a55\", \"#a5a\", \"#a5f\", \"#aa0\", \"#aa5\", \"#aaa\", \"#aaf\", \"#af0\", \"#af5\", \"#afa\", \"#aff\", \"#f00\", \"#f05\", \"#f0a\", \"#f0f\", \"#f50\", \"#f55\", \"#f5a\", \"#f5f\", \"#fa0\", \"#fa5\", \"#faa\", \"#faf\", \"#ff0\", \"#ff5\", \"#ffa\", \"#fff\", \"bluetooth\", \"battery\"];\nvar settings = INSERT_SETTINGS_HERE;\nvar chosenColor;\nvar extitems = [];\nvar colorpicker = document.createElement(\"div\");\ncolorpicker.id = 'colorpicker';\ncolorpicker.style.display = 'none';\nfor (var i = 0; i < nColors + nExt; i++)\n{\nvar colorbox = document.createElement(\"div\");\ncolorbox.style.background = colors[i];\ncolorbox.id = colors[i].replace(\"#\", \"c_\");\nif (i >= nColors){\nextitems.push(colorbox);\ncolorbox.setAttribute(\"class\", \"extitem\");\ncolorbox.innerHTML=\"<h3>\"+colors[i]+\"</h3>\";\ncolorbox.style.background = \"White\";\n} else {\ncolorbox.style.background = colors[i];\ncolorbox.setAttribute(\"class\", \"coloritem\");\n}\ncolorbox.onclick = select_color;\ncolorpicker.appendChild(colorbox);\n}\nfunction hide_extitems() {\nextitems[0].style.display=\"none\";\nextitems[1].style.display=\"none\";\n}\nfunction show_extitems() {\nextitems[0].style.display=\"inline-block\";\nextitems[1].style.display=\"inline-block\";\n}\nfunction show_popup() {\nif (this.id.charAt(2) === 'h')\nhide_extitems();\nelse\nshow_extitems();\nchosenColor = this.id;\ncolorpicker.style.display = 'block';\n}\nfunction send_settings() {\nsettings.vibe = document.getElementById(\"vibe\").checked;\ndocument.location = \"pebblejs://close#\" + encodeURIComponent(JSON.stringify(settings));\n}\nfunction select_color() {\nsettings[chosenColor] = this.id.replace(\"c_\", \"#\");\nvar canvas = document.getElementById(chosenColor);\ncanvas.c = settings[chosenColor];\ndraw_canvas(canvas);\ncolorpicker.style.display = 'none';\n}\nfunction draw_canvas(canvas) {\nvar ctx = canvas.getContext(\"2d\");\nvar cy = canvas.height * (canvas.id.charAt(0) == 't' ? .25 : .75);\nvar cx = canvas.width * (canvas.id.charAt(1) == 'l' ? .25 : .75);\nctx.fillStyle = \"DimGray\";\nctx.fillRect(0, 0, canvas.width, canvas.height);\nctx.lineWidth = 1;\nctx.strokeStyle = \"Black\";\nctx.beginPath();\nctx.moveTo(0, canvas.height/2);\nctx.lineTo(canvas.width, canvas.height/2);\nctx.moveTo(canvas.width/2, 0);\nctx.lineTo(canvas.width/2, canvas.height);\nctx.stroke();\nctx.lineCap = ctx.lineJoin = \"round\";\nvar b = 1;\nvar c = [canvas.c];\nif(canvas.c === \"battery\") {\nb = 3;\nc = [\"#f00\", \"#fa0\", \"#0f0\"];\n} else if(canvas.c === \"bluetooth\") {\nb = 2;\nc = [\"#005\", \"#a00\"];\n}\nswitch (canvas.id.charAt(2)){\ncase 'b':\nvar y = cy - canvas.height/4;\nvar h = canvas.height/2;\nvar x = cx - canvas.width/4;\nvar w = canvas.width/2;\nfor (var i = 0; i < b; i++) {\nctx.fillStyle = c[i];\nctx.fillRect(x + i * w/b , y, w/b, h);\n}\nbreak;\ncase 'd':\nctx.shadowBlur = 0;\nctx.shadowOffsetY = 2;\nctx.shadowOffsetX = -2;\nctx.shadowColor=\"black\";\nctx.lineWidth = canvas.width / 20;\nfor (var i = 0; i < b; i++) {\nctx.beginPath();\nctx.strokeStyle=c[i];\nctx.arc(cx, cy, canvas.width / 5, i*(2*Math.PI/b), (i+1)*(2*Math.PI/b));\nctx.stroke();\n}\nbreak;\ncase 'h':\nctx.strokeStyle = canvas.c;\nctx.shadowBlur = 0;\nctx.shadowOffsetY = 2;\nctx.shadowOffsetX = 2;\nctx.shadowColor=\"black\";\nctx.lineWidth = canvas.width / 30;\nctx.beginPath();\nctx.moveTo(cx - canvas.width / 10, cy - canvas.width / 8);\nctx.lineTo(cx, cy);\nctx.lineTo(cx + canvas.width / 5, cy - canvas.width / 18);\nctx.stroke();\n}\n}\nwindow.onload = function() {\ndocument.body.appendChild(colorpicker);\nfor (var id in settings) {\nvar i = document.getElementById(id);\nif (id === \"vibe\") {\ni.checked = settings[id];\n}else{\ni.c = settings[id];\ni.width = window.innerWidth * .3;\ni.height = window.innerWidth * .35;\ni.onclick = show_popup;\ndraw_canvas(i);\n}\n}\n};\n</script>\n</head>\n<body>\n<p>\n<canvas id=\"tlb\"></canvas>\n<canvas id=\"tld\"></canvas>\n<canvas id=\"tlh\"></canvas>\n</p>\n<p>\n<canvas id=\"trb\"></canvas>\n<canvas id=\"trd\"></canvas>\n<canvas id=\"trh\"></canvas>\n</p>\n<p>\n<canvas id=\"blb\"></canvas>\n<canvas id=\"bld\"></canvas>\n<canvas id=\"blh\"></canvas>\n</p>\n<p>\n<canvas id=\"brb\"></canvas>\n<canvas id=\"brd\"></canvas>\n<canvas id=\"brh\"></canvas>\n</p>\n<p>\n<input type=\"checkbox\" id=\"vibe\">Vibrate on bluetooth disconnect</input>\n</p>\n<p>\n<button type=\"submit\" onclick=\"send_settings();\">Save</button>\n<button type=\"cancel\" onclick=\"document.location = 'pebblejs://close#cancel'\">Cancel</button>\n</p>\n4pop version INSERT_VERSION_HERE\n</body>\n</html>\n";
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
        window.localStorage.setItem("config_4pop", e.response);
        replace_colors(config);
        console.log("Sending "+JSON.stringify(config));
        pebble.sendAppMessage(config);
    }
});

