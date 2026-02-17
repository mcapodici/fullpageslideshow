<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="wrap fps-settings">
    <h1>Full Page Slideshow</h1>

    <div class="fps-controls">
        <button type="button" id="fps-add-images" class="button button-primary">Add Images</button>
        <label class="fps-seconds-label">
            Interval (seconds):
            <input type="number" id="fps-seconds" min="1" max="60" value="2">
        </label>
        <button type="button" id="fps-save" class="button button-primary">Save Settings</button>
        <span id="fps-save-status"></span>
    </div>

    <p class="description">Drag rows to reorder. Lower position % moves the visible area down.</p>

    <ul id="fps-image-list" class="fps-image-list"></ul>

    <div id="fps-fullscreen-preview" class="fps-fullscreen-preview" style="display:none;">
        <div class="fps-fullscreen-inner"></div>
    </div>
</div>
