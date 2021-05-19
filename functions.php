<?php

add_action('after_setup_theme', function() {
    add_theme_support('title-tag');
    register_nav_menu('primary', 'Primary Menu');
});

add_action('wp_enqueue_scripts', function() {
    $base = get_template_directory_uri() . '/';
    wp_enqueue_style('theme-style', $base . 'style.css');
    wp_enqueue_script('barbajs', $base . 'assets/js/barba.js', ['jquery'], null, true);
    wp_enqueue_script('theme-script', $base . 'assets/js/app.js', null, null, true);
    if (is_singular()) {
        wp_enqueue_script('singular-script', $base . 'assets/js/singular.js', null, null, true);
    }
    if (is_archive()) {
        wp_enqueue_script('archive-script', $base . 'assets/js/archive.js', null, null, true);
    }
});