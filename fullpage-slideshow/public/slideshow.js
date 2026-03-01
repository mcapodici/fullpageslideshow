(function () {
    var config = window.fullpageSlideshowConfig;
    if (!config || !config.images || !config.images.length) {
        return;
    }

    var images = config.images;
    var seconds = config.seconds || 2;

    var slideshowDiv = document.querySelector('.martins-fullpage-slideshow');
    if (!slideshowDiv) return;

    function createInnerDiv() {
        var slideShowEndOfBody = document.createElement('div')
        slideShowEndOfBody.className = 'martins-fullpage-slideshow'
        var div = document.createElement('div');
        div.className = 'fps-inner';
        slideShowEndOfBody.appendChild(div);
        document.body.appendChild(slideShowEndOfBody);
        return div;
    }

    // Single image — just display it, no cycling
    if (images.length === 1) {
        var solo = createInnerDiv();
        solo.style.backgroundImage = "url('" + images[0][0] + "')";
        solo.style.backgroundPositionY = images[0][1];
        solo.classList.add('fps-active');
        return;
    }

    var innerDiv1 = createInnerDiv();
    var innerDiv2 = createInnerDiv();

    var currentIndex = 0;

    innerDiv1.style.backgroundImage = "url('" + images[0][0] + "')";
    innerDiv1.style.backgroundPositionY = images[0][1];
    innerDiv1.classList.add('fps-active');

    innerDiv2.style.backgroundImage = "url('" + images[1][0] + "')";
    innerDiv2.style.backgroundPositionY = images[1][1];

    var showingFirst = true;

    function updateBackground() {
        if (showingFirst) {
            // Fade in div2, fade out div1
            innerDiv2.classList.add('fps-active');
            innerDiv1.classList.remove('fps-active');
            // Preload next image into div1
            currentIndex = (currentIndex + 1) % images.length;
            setTimeout(function () {
                innerDiv1.style.backgroundImage = "url('" + images[currentIndex][0] + "')";
                innerDiv1.style.backgroundPositionY = images[currentIndex][1];
            }, 1000); // after transition completes
        } else {
            // Fade in div1, fade out div2
            innerDiv1.classList.add('fps-active');
            innerDiv2.classList.remove('fps-active');
            // Preload next image into div2
            currentIndex = (currentIndex + 1) % images.length;
            setTimeout(function () {
                innerDiv2.style.backgroundImage = "url('" + images[currentIndex][0] + "')";
                innerDiv2.style.backgroundPositionY = images[currentIndex][1];
            }, 1000);
        }
        showingFirst = !showingFirst;
    }

    setInterval(updateBackground, seconds * 1000);
})();
