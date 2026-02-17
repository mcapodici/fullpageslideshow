<?php
/**
 * Plugin Name: Full Page Slideshow
 * Description: A full-page background slideshow with crossfade transitions. Configure images and positioning from Settings, output via [fullpage_slideshow] shortcode.
 * Version: 1.0.0
 * Author: Martin
 * License: GPL v2 or later
 */

if (!defined('ABSPATH')) {
    exit;
}

define('FPS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('FPS_PLUGIN_URL', plugin_dir_url(__FILE__));

register_activation_hook(__FILE__, 'fps_activate');

function fps_activate() {
    if (get_option('fullpage_slideshow_images') === false) {
        update_option('fullpage_slideshow_images', '[]');
    }
    if (get_option('fullpage_slideshow_seconds') === false) {
        update_option('fullpage_slideshow_seconds', 2);
    }
}

// Admin menu
add_action('admin_menu', 'fps_admin_menu');

function fps_admin_menu() {
    add_options_page(
        'Full Page Slideshow',
        'Full Page Slideshow',
        'manage_options',
        'fullpage-slideshow',
        'fps_render_settings_page'
    );
}

function fps_render_settings_page() {
    require_once FPS_PLUGIN_DIR . 'admin/settings-page.php';
}

// Admin assets
add_action('admin_enqueue_scripts', 'fps_admin_enqueue');

function fps_admin_enqueue($hook) {
    if ($hook !== 'settings_page_fullpage-slideshow') {
        return;
    }

    wp_enqueue_media();
    wp_enqueue_script('jquery-ui-sortable');

    wp_enqueue_style(
        'fps-admin-css',
        FPS_PLUGIN_URL . 'admin/admin.css',
        [],
        '1.0.0'
    );

    wp_enqueue_script(
        'fps-admin-js',
        FPS_PLUGIN_URL . 'admin/admin.js',
        ['jquery', 'jquery-ui-sortable'],
        '1.0.0',
        true
    );

    wp_localize_script('fps-admin-js', 'fpsAdmin', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('fps_save_settings'),
        'images'   => json_decode(get_option('fullpage_slideshow_images', '[]'), true),
        'seconds'  => get_option('fullpage_slideshow_seconds', 2),
    ]);
}

// AJAX save handler
add_action('wp_ajax_fps_save_settings', 'fps_save_settings');

function fps_save_settings() {
    check_ajax_referer('fps_save_settings', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error('Unauthorized');
    }

    $images = isset($_POST['images']) ? $_POST['images'] : [];
    $seconds = isset($_POST['seconds']) ? intval($_POST['seconds']) : 2;

    // Sanitize images array
    $clean_images = [];
    if (is_array($images)) {
        foreach ($images as $img) {
            $clean_images[] = [
                'id'         => intval($img['id']),
                'url'        => esc_url_raw($img['url']),
                'position_y' => max(0, min(100, intval($img['position_y']))),
            ];
        }
    }

    update_option('fullpage_slideshow_images', wp_json_encode($clean_images));
    update_option('fullpage_slideshow_seconds', max(1, $seconds));

    wp_send_json_success('Settings saved.');
}

// Front-end: enqueue assets on every page (lightweight — only CSS + small JS)
// The JS self-checks for the config and container div before doing anything.
add_action('wp_enqueue_scripts', 'fps_front_enqueue');

function fps_front_enqueue() {
    $images = json_decode(get_option('fullpage_slideshow_images', '[]'), true);
    if (empty($images)) {
        return;
    }

    wp_enqueue_style(
        'fps-slideshow-css',
        FPS_PLUGIN_URL . 'public/slideshow.css',
        [],
        '1.0.2'
    );

    wp_enqueue_script(
        'fps-slideshow-js',
        FPS_PLUGIN_URL . 'public/slideshow.js',
        [],
        '1.0.2',
        true
    );

    $js_images = [];
    foreach ($images as $img) {
        $js_images[] = [
            esc_url($img['url']),
            intval($img['position_y']) . '%',
        ];
    }

    wp_localize_script('fps-slideshow-js', 'fullpageSlideshowConfig', [
        'images'  => $js_images,
        'seconds' => intval(get_option('fullpage_slideshow_seconds', 2)),
    ]);
}

// Shortcode — just outputs the container div
add_shortcode('fullpage_slideshow', 'fps_shortcode');

function fps_shortcode() {
    $images = json_decode(get_option('fullpage_slideshow_images', '[]'), true);
    if (empty($images)) {
        return '';
    }
    return '<div class="fullpage-slideshow"></div>';
}
