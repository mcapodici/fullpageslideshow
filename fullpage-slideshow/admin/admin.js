(function ($) {
    'use strict';

    var $list = $('#fps-image-list');
    var $seconds = $('#fps-seconds');
    var $saveStatus = $('#fps-save-status');
    var $overlay = $('#fps-fullscreen-preview');
    var $overlayInner = $overlay.find('.fps-fullscreen-inner');

    // Initialize with saved data
    $seconds.val(fpsAdmin.seconds);

    if (fpsAdmin.images && fpsAdmin.images.length) {
        fpsAdmin.images.forEach(function (img) {
            addImageRow(img.id, img.url, img.position_y);
        });
    }

    // Make list sortable
    $list.sortable({
        placeholder: 'ui-sortable-placeholder',
        handle: '.fps-thumb',
        tolerance: 'pointer'
    });

    // Add Images button
    $('#fps-add-images').on('click', function () {
        var frame = wp.media({
            title: 'Select Slideshow Images',
            multiple: true,
            library: { type: 'image' },
            button: { text: 'Add to Slideshow' }
        });

        frame.on('select', function () {
            var attachments = frame.state().get('selection').toJSON();
            attachments.forEach(function (att) {
                if ($list.find('[data-id="' + att.id + '"]').length) {
                    return;
                }
                addImageRow(att.id, att.url, 50);
            });
        });

        frame.open();
    });

    function addImageRow(id, url, positionY) {
        var filename = url.split('/').pop();
        var $row = $(
            '<li data-id="' + id + '" data-url="' + escapeAttr(url) + '">' +
                '<img class="fps-thumb" src="' + escapeAttr(url) + '" alt="">' +
                '<span class="fps-filename" title="' + escapeAttr(filename) + '">' + escapeHtml(filename) + '</span>' +
                '<label class="fps-position-label">' +
                    'Y: <input type="number" class="fps-position-input" min="0" max="100" value="' + parseInt(positionY, 10) + '">%' +
                '</label>' +
                '<button type="button" class="fps-preview-btn button button-small">Preview</button>' +
                '<button type="button" class="fps-remove" title="Remove">&times;</button>' +
            '</li>'
        );
        $list.append($row);
    }

    // Fullscreen preview on Preview button click
    $list.on('click', '.fps-preview-btn', function () {
        var $row = $(this).closest('li');
        var url = $row.data('url');
        var posY = $row.find('.fps-position-input').val();
        $overlayInner.css({
            'background-image': 'url(' + url + ')',
            'background-position-y': posY + '%'
        });
        $overlay.show();
    });

    // Click overlay to close
    $overlay.on('click', function () {
        $overlay.hide();
    });

    // Remove image
    $list.on('click', '.fps-remove', function () {
        $(this).closest('li').remove();
    });

    // Save
    $('#fps-save').on('click', function () {
        var images = [];
        $list.find('li').each(function () {
            images.push({
                id: $(this).data('id'),
                url: $(this).data('url'),
                position_y: $(this).find('.fps-position-input').val()
            });
        });

        $saveStatus.text('Saving...');

        $.post(fpsAdmin.ajax_url, {
            action: 'fps_save_settings',
            nonce: fpsAdmin.nonce,
            images: images,
            seconds: $seconds.val()
        }, function (response) {
            if (response.success) {
                $saveStatus.text('Saved!');
            } else {
                $saveStatus.text('Error: ' + response.data);
            }
            setTimeout(function () { $saveStatus.text(''); }, 3000);
        }).fail(function () {
            $saveStatus.text('Save failed.');
            setTimeout(function () { $saveStatus.text(''); }, 3000);
        });
    });

    function escapeAttr(str) {
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

})(jQuery);
