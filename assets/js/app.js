(function($) {

    // your custom script
    var scripts = {
        init: function () {
            if ($('body').hasClass('page')) {
            this.page();
        } else if ($('body').hasClass('archive')) {
            this.archive();
        }
        },
        page: function () {
            // page scripts
            console.log('from app.js | singular');
        },
        archive: function () {
            // archive script
            console.log('from app.js | archive');
        }
    };
    // call this when dom is ready
    scripts.init();

    Barba.Pjax.start();
    var FadeTransition = Barba.BaseTransition.extend({
        start: function() {
        /**
        * This function is automatically called as soon the Transition starts
        * this.newContainerLoading is a Promise for the loading of the new container
        * (Barba.js also comes with an handy Promise polyfill!)
        */
        // As soon the loading is finished and the old page is faded out, let's fade the new page
            Promise.all([this.newContainerLoading, this.fadeOut()])
                .then(this.fadeIn.bind(this));
        },
        fadeOut: function() {
            /**
            * this.oldContainer is the HTMLElement of the old Container
            */
            return $(this.oldContainer).animate({ opacity: 0 }).promise();
        },
        fadeIn: function() {
            /**
            * this.newContainer is the HTMLElement of the new Container
            * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
            * Please note, newContainer is available just after newContainerLoading is resolved!
            */
            var _this = this;
            var $el = $(this.newContainer);
            $(this.oldContainer).hide();
            $el.css({
                visibility : 'visible',
                opacity : 0
            });
            $el.animate({ opacity: 1 }, 400, function() {
                // recall init to run scripts on other pages
                scripts.init();
                /**
                * Do not forget to call .done() as soon your transition is finished!
                * .done() will automatically remove from the DOM the old Container
                */
                _this.done();
            });
        }
    });
    /**
    * Next step, you have to tell Barba to use the new Transition
    */
    Barba.Pjax.getTransition = function() {
        /**
        * Here you can use your own logic!
        * For example you can use different Transition based on the current page or link...
        */
        return FadeTransition;
    };
    Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {
        var response = newPageRawHTML.replace(/(<\/?)body( .+?)?>/gi, '$1notbody$2>', newPageRawHTML);
        var bodyClasses = $(response).filter('notbody').attr('class');
        $('body').attr('class', bodyClasses);

        var initialized_scripts = [];
        var script_tags = document.getElementsByTagName("script");
        $(script_tags).each(function(i, s) {
            var src = $(s).attr('src');
            if (src) {
                initialized_scripts.push(src);
            }
        });
        var new_imports = [];
        var new_evaluations = '';
        var script_tags = $(response).find('script');
        $(script_tags).each(function(i, s) {
            var src = $(s).attr('src');
            if (src) {
                // if not already initialized add it
                if (initialized_scripts.indexOf(src) == -1) {
                    new_imports.push(src);
                }
            } else {
                // it is an inline script, will evaluate it
                new_evaluations += script_tags[i].innerHTML;
            }
        });
        $.getMultiScripts(new_imports).done(function() {
            eval(new_evaluations);
        }).fail(function(error) {
            // one or more scripts failed to load
        }).always(function() {
            // always called, both on success and error
        });


    });

    $.getMultiScripts = function(arr) {
        var _arr = $.map(arr, function(src) {
            return $.getScript(src);
        });
        _arr.push($.Deferred(function( deferred ){
            $( deferred.resolve );
        }));
        return $.when.apply($, _arr);
    }

})(jQuery);