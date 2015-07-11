#include <pebble.h>

#define MINUTE_HAND_LENGTH 32
#define HOUR_HAND_LENGTH 22
#define HANDS_THICKNESS 3
#define DIAL_RADIUS 28
#define DIAL_THICKNESS 5
#define PANEL_WIDTH 72
#define PANEL_HEIGHT 84
#define NUM_SETTINGS 13
#define SETTINGS_VERSION 0
#define GColorBluetoothARGB8 0
#define GColorBatteryARGB8 1

enum{TLB_KEY = 0x0, TRB_KEY = 0x1, BLB_KEY = 0x2, BRB_KEY = 0x3, 
TLD_KEY = 0x4, TRD_KEY = 0x5, BLD_KEY = 0x6, BRD_KEY = 0x7, 
TLH_KEY = 0x8, TRH_KEY = 0x9, BLH_KEY = 0xa, BRH_KEY = 0xb, VIBE_KEY = 0xc};
enum{PANEL, DIAL, HANDS};
enum{BATTERY_MID_AMOUNT=50, BATTERY_LOW_AMOUNT=20};
enum{BATTERY_LOW_COLOR = GColorRedARGB8,
    BATTERY_MED_COLOR = GColorChromeYellowARGB8,
    BATTERY_FULL_COLOR = GColorGreenARGB8,
    BLUETOOTH_CONNECT_COLOR = GColorDukeBlueARGB8,
    BLUETOOTH_DISCONNECT_COLOR = GColorDarkCandyAppleRedARGB8
};

static AppSync appsync;
static uint8_t *sync_buffer;
static Window *window;
static Layer *layer;
static int hours, minutes, battery;
static bool bluetooth, vibe;
static uint8_t g_config[] = {GColorBlueARGB8, GColorMagentaARGB8, GColorChromeYellowARGB8, GColorBluetoothARGB8, GColorOrangeARGB8, GColorYellowARGB8, GColorRedARGB8, GColorBatteryARGB8, GColorWhiteARGB8, GColorWhiteARGB8, GColorWhiteARGB8, GColorWhiteARGB8, 1};

static inline GPoint get_point(int32_t angle, int length) {
    GPoint p;
    p.x = sin_lookup(angle) * length / TRIG_MAX_RATIO;
    p.y = -cos_lookup(angle) * length / TRIG_MAX_RATIO;
    return p;
}

static void appsync_error(DictionaryResult dict_error, AppMessageResult message_error, void *c) {
    APP_LOG(APP_LOG_LEVEL_INFO, "Appsync error: %d", message_error);
}

static void appsync_handler(const uint32_t key, const Tuple *new, const Tuple* old, void* c) {
    APP_LOG(APP_LOG_LEVEL_DEBUG, "%ld changed to %ld", key, new->value->uint32);
    persist_write_int(key, new->value->uint32);
    g_config[key] = new->value->uint32;
    if (key != VIBE_KEY)
        layer_mark_dirty(layer);
}

static void settings_init() {
    uint32_t val[NUM_SETTINGS];
    for (int i = 0; i < NUM_SETTINGS; i++) {
        if (persist_exists(i)){
            val[i] = persist_read_int(i);
            APP_LOG(APP_LOG_LEVEL_DEBUG, "%i loaded from storage", i);
        }
        else {
            val[i] = g_config[i];
            APP_LOG(APP_LOG_LEVEL_DEBUG, "%i loaded from defaults", i);
        }
    }
    Tuplet config[] = {TupletInteger(TLB_KEY, val[TLB_KEY]),
        TupletInteger(TRB_KEY, val[TRB_KEY]),
        TupletInteger(BLB_KEY, val[BLB_KEY]),
        TupletInteger(BRB_KEY, val[BRB_KEY]),
        TupletInteger(TLD_KEY, val[TLD_KEY]),
        TupletInteger(TRD_KEY, val[TRD_KEY]),
        TupletInteger(BLD_KEY, val[BLD_KEY]),
        TupletInteger(BRD_KEY, val[BRD_KEY]),
        TupletInteger(TLH_KEY, val[TLH_KEY]),
        TupletInteger(TRH_KEY, val[TRH_KEY]),
        TupletInteger(BLH_KEY, val[BLH_KEY]),
        TupletInteger(BRH_KEY, val[BRH_KEY]),
        TupletInteger(VIBE_KEY, val[VIBE_KEY])};
    int buffersize = dict_calc_buffer_size_from_tuplets(config, NUM_SETTINGS);
    sync_buffer = malloc(buffersize);
    if (sync_buffer)
        app_sync_init(&appsync, sync_buffer, buffersize, config, NUM_SETTINGS, appsync_handler, appsync_error, NULL);
    else
        APP_LOG(APP_LOG_LEVEL_ERROR, "Unable to malloc appsync buffer");
}

static void battery_handler(BatteryChargeState b) {
    battery = b.charge_percent;
    layer_mark_dirty(layer);
}

static void bluetooth_handler(bool connected) {
    bluetooth = connected;
    layer_mark_dirty(layer);
    if (vibe && !connected)
        vibes_double_pulse();
}

static GColor get_color(int quadrant, int element) {
    int argb = g_config[element * 4 + quadrant];
    if (argb == GColorBatteryARGB8) {
        if(battery > BATTERY_MID_AMOUNT)
            argb = BATTERY_FULL_COLOR;
        else if(battery > BATTERY_LOW_AMOUNT)
            argb = BATTERY_MED_COLOR;
        else
            argb = BATTERY_LOW_COLOR;
    } else if (argb == GColorBluetoothARGB8) {
        if(bluetooth)
            argb = BLUETOOTH_CONNECT_COLOR;
        else
            argb = BLUETOOTH_DISCONNECT_COLOR;
    }
    return (GColor){.argb = argb};
}

static void layer_update_proc (Layer* layer, GContext* ctx) {
    static const GPoint center[4] = {
        {PANEL_WIDTH / 2 + 1, PANEL_HEIGHT / 2 - 1},
        {PANEL_WIDTH / 2 + PANEL_WIDTH + 1, PANEL_HEIGHT / 2 - 1},
        {PANEL_WIDTH / 2 + 1, PANEL_HEIGHT / 2 + PANEL_HEIGHT - 1},
        {PANEL_WIDTH / 2 + PANEL_WIDTH + 1, PANEL_HEIGHT / 2 + PANEL_HEIGHT - 1}
    };

    int32_t minuteAngle = TRIG_MAX_ANGLE * minutes / 60;
    int32_t hourAngle = TRIG_MAX_ANGLE * hours / 12;
    hourAngle+= minuteAngle / 12;

    GPoint hourPoint, minutePoint;

    hourPoint = get_point(hourAngle, HOUR_HAND_LENGTH);
    minutePoint = get_point(minuteAngle, MINUTE_HAND_LENGTH);

    for (int i = 0; i < 4; i++) {
        GRect panel = GRect(center[i].x - PANEL_WIDTH / 2 - 1,
                center[i].y - PANEL_HEIGHT / 2 + 1, PANEL_WIDTH, PANEL_HEIGHT);
        graphics_context_set_fill_color(ctx, get_color(i, PANEL));
        graphics_fill_rect(ctx, panel, 0, GCornerNone);

        GPoint shadowCenter = center[i];
        shadowCenter.x -= 2;
        shadowCenter.y += 2;
        graphics_context_set_stroke_color(ctx, GColorBlack);
        graphics_context_set_stroke_width(ctx, DIAL_THICKNESS);
        graphics_draw_circle(ctx, shadowCenter, DIAL_RADIUS);

        graphics_context_set_stroke_width(ctx, HANDS_THICKNESS);
        GPoint m = minutePoint;
        GPoint h = hourPoint;
        m.x += center[i].x - 2;
        m.y += center[i].y + 2;
        h.x += center[i].x - 2;
        h.y += center[i].y + 2;
        graphics_draw_line(ctx, h, shadowCenter);
        graphics_draw_line(ctx, m, shadowCenter);

        graphics_context_set_stroke_color(ctx, get_color(i, DIAL));
        graphics_context_set_stroke_width(ctx, DIAL_THICKNESS);
        graphics_draw_circle(ctx, center[i], DIAL_RADIUS);

        graphics_context_set_stroke_color(ctx, GColorBlack);
        graphics_context_set_stroke_width(ctx, HANDS_THICKNESS);
        shadowCenter.x += 1;
        shadowCenter.y -= 1;
        m.x += 1;
        m.y -= 1;
        graphics_draw_line(ctx, m, shadowCenter);
        graphics_context_set_stroke_color(ctx, get_color(i, HANDS));
        m.x += 1;
        m.y -= 1;
        h.x += 2;
        h.y -= 2;
        graphics_draw_line(ctx, h, center[i]);
        graphics_draw_line(ctx, m, center[i]);
    }
}

static void update_time(struct tm *t) {
    minutes = t->tm_min;
    hours = t->tm_hour;
}

static void tick_handler(struct tm *t, TimeUnits changed) {
    update_time(t);
    layer_mark_dirty(layer);
}

static void window_load(Window *window) {
    Layer *window_layer = window_get_root_layer(window);
    GRect bounds = layer_get_bounds(window_layer);

    settings_init();

    layer = layer_create(bounds);
    layer_set_update_proc(layer, layer_update_proc);
    layer_add_child(window_layer, layer);

    battery_state_service_subscribe(battery_handler);
    bluetooth_connection_service_subscribe(bluetooth_handler);
    tick_timer_service_subscribe(MINUTE_UNIT, tick_handler);
}

static void window_unload(Window *window) {
    app_sync_deinit(&appsync);
    free(sync_buffer);
    battery_state_service_unsubscribe();
    bluetooth_connection_service_unsubscribe();
    tick_timer_service_unsubscribe();
    layer_destroy(layer);
}

static void init(void) {
    window = window_create();
    window_set_window_handlers(window, (WindowHandlers) {
        .load = window_load,
        .unload = window_unload,
    });

    time_t temp = time(NULL);
    struct tm* t = localtime(&temp);
    update_time(t);


    battery = battery_state_service_peek().charge_percent;
    bluetooth = bluetooth_connection_service_peek();

    window_stack_push(window, false);
}

static void deinit(void) {
    window_destroy(window);
}

int main(void) {
    init();

    APP_LOG(APP_LOG_LEVEL_DEBUG, "Done initializing, pushed window: %p", window);

    app_event_loop();
    deinit();
}
