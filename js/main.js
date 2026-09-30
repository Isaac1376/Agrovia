(function ($) {
    "use strict";

    const produceIcons = [
        ['fa-apple-whole', '#c64b3f'],
        ['fa-carrot', '#e27b35'],
        ['fa-lemon', '#c6a52f'],
        ['fa-pepper-hot', '#bd503e'],
        ['fa-seedling', '#548348'],
        ['fa-leaf', '#4d8954'],
        ['fa-wheat-awn', '#b49a4b'],
        ['fa-apple-whole', '#8d4252'],
        ['fa-carrot', '#d8863d'],
        ['fa-lemon', '#b6a33b'],
    ];
    const floatingProduce = document.createElement('div');
    floatingProduce.className = 'floating-produce';
    floatingProduce.setAttribute('aria-hidden', 'true');

    for (let index = 0; index < 8; index += 1) {
        const [icon, color] = produceIcons[index % produceIcons.length];
        const side = index % 2 === 0 ? 'left' : 'right';
        const row = Math.floor(index / 2);
        const edgeOffset = 3 + (row % 2) * 2;
        const produceIcon = document.createElement('i');
        produceIcon.className = `fa-solid ${icon} floating-produce__icon floating-produce__icon--${row % 3}`;
        produceIcon.style.color = color;
        produceIcon.style[side] = `${edgeOffset}%`;
        produceIcon.style.top = `${8 + row * 27}%`;
        produceIcon.style.animationDelay = `-${row * 1.1 + index * 0.35}s`;
        produceIcon.style.animationDuration = `${8 + row * 1.5}s`;
        floatingProduce.appendChild(produceIcon);
    }

    document.body.appendChild(floatingProduce);

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('position-fixed bg-dark shadow-sm');
        } else {
            $('.navbar').removeClass('position-fixed bg-dark shadow-sm');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow').css('display', 'flex');
        } else {
            $('.back-to-top').fadeOut('slow').css('display', 'none');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 1500, 'easeInOutExpo');
        return false;
    });

})(jQuery);