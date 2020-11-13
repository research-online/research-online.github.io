// This function configures the appeareance of the NGU popup and enables it
// when the pages displays to the NGU section.
// The whole js file can be removed when the NGU secion gets disabled

!(function ($) {
    "use strict";

    // Initiate venobox (lightbox feature used in communications)
    $(document).ready(function () {
        $('.venobox_ngu').venobox({
            framewidth: '800px',                            // default: ''
            frameheight: '',                            // default: ''
            border: '0px',                             // default: '0'
            bgcolor: '#f49494',                          // King's College background
            spinColor: '#f49494',
            share: ['facebook', 'twitter'] // default: []
        });

        // Automatically triggers the venobox_ngu popup whenever the hash #communications is in the URL
        if (window.location.hash) {
            if (window.location.hash.includes("communications")) {
                setTimeout(function () {
                    $('.venobox_ngu').venobox({
                        framewidth: '800px',                            // default: ''
                        frameheight: '',                            // default: ''
                        border: '0px',                             // default: '0'
                        bgcolor: '#f49494',                          // King's College background
                        spinColor: '#f49494',
                        share: ['facebook', 'twitter'] // default: []
                    }).trigger('click')
                }, 1000);
            }
        }
    });

})(jQuery);