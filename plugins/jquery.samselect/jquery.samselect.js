(function($) {
    let classes = {
        'alreadyInit': 'js-already-init',
        'div'        : 'js-div-select',
        'title'      : 'js-div-select-title',
        'ul'         : 'js-div-select-ul',
        'li'         : 'js-div-select-li',
        'a'          : 'js-div-select-a',
        'active'     : 'js-active',
        'open'       : 'js-open',
        'search'     : 'js-div-select-search',
        'empty'      : 'js-div-select-li-empty',
        'process'    : 'js-div-select-li-process'
    };

    let selectors = {
        'alreadyInit': '.' + classes.alreadyInit,
        'div'        : '.' + classes.div,
        'title'      : '.' + classes.title,
        'ul'         : '.' + classes.ul,
        'li'         : '.' + classes.li,
        'a'          : '.' + classes.a,
        'active'     : '.' + classes.active,
        'open'       : '.' + classes.open,
        'search'     : '.' + classes.search,
        'empty'      : '.' + classes.empty,
        'process'    : '.' + classes.process
    };

    let methods = {
        destroy: function() {
            let $select = $(this);
            if (!$select.hasClass(classes.alreadyInit)) {
                return false;
            }

            $select.removeClass($select.data('id')).removeClass(classes.alreadyInit).show();
            $('#' + $select.data('id')).remove();
        }
    };

    $.fn.samselect = function(options) {
        if (typeof options === "string") {
            let method = options;
            if (methods[method]) {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }

            return false;
        }

        let $select = this;

        let body = $('body');

        let div, title, ul, searchInput, searchEmpty, searchProcess;

        let settings = {
            'html'       : false,
            'light'      : false,
            'dark'       : false,
            'red'        : false,
            'transparent': false,
            'hidePrompt' : false,
            'search'     : false,
            'ajaxUrl'    : null,
            'ajaxData'   : {},
            'ajaxType'   : 'get',
            'ajaxProcess': 'Идёт поиск...',
            'ajaxMin'    : 3,
            'prompt'     : 'Поиск',
            'empty'      : 'Ничего не найдено'
        };

        let init = function() {
            normalize();
            build();
        };

        let normalize = function() {
            settings = $.extend({}, settings, options);
        };

        let build = function() {
            if (!$select.hasClass(classes.alreadyInit)) {
                let id = 'jsdivselect' + getId();

                div = $('<div>', {'id': id, 'class': classes.div});
                title = $('<div>', {'class': classes.title});

                $select.data('id', id).addClass(id).hide();

                createUl();
                customize.title();
                customize.div();

                $select.after(div.append(title, ul));

                if (!$select.prop('disabled') && !$select.attr('readonly')) {
                    title.click(toggleUl);
                }

                if (settings.search) {
                    search.init();
                }

                $select.addClass(classes.alreadyInit).removeClass('js-select');
                let top = 39;
                if (settings.dark) {
                    top = 35;
                }

                $(ul).css({'top': top, 'left': 'auto'});

                if (ul.find('li').length > 8) {
                    let clone = $(ul).clone().css({
                        'position': 'static',
                        'top' : -999999,
                        'left':-999999
                    });
                    $(body).append(clone);
                    let liHeight = getLiHeight($(clone.find('li')[0]), true);
                    clone.remove();

                    ul.css({
                        'maxHeight'    : liHeight * 8,
                        'paddingRight' : '0px'
                    });
                    ul.niceScroll(customize.scroll());
                }
            }
        };

        let getId = function(step) {
            if (!step) step = 0;

            if ($('#jsdivselect' + step).length) {
                return getId(++step);
            }

            return step;
        };

        let createUl = function() {
            ul = $('<ul>', {'class': classes.ul});
            $select.find('option').each(function() {
                let li = $('<li>', {'class': classes.li});
                customize.li(li);

                let a = $('<a>', {'class': classes.a});
                customize.a(a);

                if (settings.html) {
                    $(a).html(trim($(this).html()));
                } else {
                    $(a).text(trim($(this).text()));
                }
                li.data('value', $(this).val()).append(a);
                if ($(this).prop('selected')) {
                    li.addClass(classes.active)
                }

                if (settings.hidePrompt && ($(this).val() == '' || $(this).val() == null || $(this).val() == undefined || $(this).val() == 'undefined')) {
                    li.css('display', 'none');
                }

                li.click(function() {
                    changeSelect(this);
                });

                ul.append(li);
            });
            customize.ul();
        };

        let toggleUl = function(event, elUl, elTitle) {
            if (!elUl) elUl = $(ul);
            if (!elTitle) elTitle = title;
            if (elTitle.parent().hasClass(classes.open)) {
                elTitle.parent().removeClass(classes.open);
                elUl.removeClass('select-item__options--active').hide();

                body.off('click');
            } else {
                elTitle.parent().addClass(classes.open);
                elUl.addClass('select-item__options--active').show();

                body.click(function(event) {
                    event = event || window.event;
                    closeSelects(event, elTitle.parent().attr('id'));
                });
            }
        };

        let closeSelects = function(event, selectId) {
            let hide = true;
            if ($(event.target).parents(selectors.div).length) {
                let parent = $(event.target).parents(selectors.div);
                if (parent.attr('id') === selectId) {
                    hide = false;
                }
            }

            if (hide) {
                $(selectors.div + selectors.open).each(function () {
                    toggleUl(event, $(this).find(selectors.ul), $(this).find(selectors.title));
                });
            }
        };

        let changeSelect = function(li) {
            ul.find('li.' + classes.active).removeClass(classes.active);
            $(li).addClass(classes.active);

            customize.title();

            let val = $(li).data('value');
            $select.find('option').each(function() {
                if ($(this).val() === val) {
                    $(this).prop('selected', true);
                    $select.change();

                    return false;
                }
            });

            toggleUl(event);
        };

        let customize = {
            div: function() {
                div.addClass('dropdown');
                if (settings.light) {
                    div.addClass('dropdown--light');
                }
                if (settings.white) {
                    div.addClass('dropdown--white');
                }
                if (settings.dark) {
                    div.addClass('dropdown--dark');
                }
                if (settings.red) {
                    div.addClass('dropdown--red');
                }
                if (settings.transparent) {
                    div.addClass('dropdown--transparent');
                }
                if ($select.prop('disabled') || $select.attr('readonly')) {
                    div.addClass('dropdown--disabled');
                } else if (div.hasClass('dropdown--disabled')) {
                    div.removeClass('dropdown--disabled');
                }
            },
            title: function() {
                let html = '';

                if (ul.find('li.' + classes.active).length) {
                    html = ul.find('li.' + classes.active).html();
                } else {
                    html = ul.find('li:first-child').html();
                }
                title.addClass('dropdown__title');
                title.html(html);
            },
            ul: function() {
                ul.addClass('dropdown__options');
            },
            li: function(li) {
                li.addClass('dropdown__option');
            },
            a: function(a) {
                a.addClass('dropdown__link');
            },
            search: function(input) {
                input.addClass('dropdown__search');
            },
            empty: function(input) {
                input.addClass('dropdown__empty');
            },
            scroll: function() {
                let params = {
                    'cursorcolor'          : '#8361C3',
                    'cursorwidth'          : '4px',
                    'cursorborder'         : false,
                    'cursorborderradius'   : '100px',
                    'nativeparentscrolling': false,
                    'cursorminheight'      : 13,
                    'cursorfixedheight'    : 13,
                    'horizrailenabled'     : false,
                    'autohidemode'         : false,
                    'railpadding'          : {
                        top   : 0,
                        right : 2,
                        left  : 0,
                        bottom: 0
                    }
                };

                if (settings.light) {
                    params.cursorcolor      = 'rgba(2, 51, 40, 1)';
                    params.cursoropacitymax = 0.34;
                    params.cursoropacitymin = 0.34;
                } else {
                    params.cursorcolor = 'rgba(131, 96, 195, 1)';
                    params.cursoropacitymax = 1;
                    params.cursoropacitymin = 1;
                }

                return params;
            }
        };

        let getLiHeight = function(el, isLi) {
            let height;
            if (isLi) {
                height = $(el).outerHeight();
                if (height === 0) {
                    $(el).addClass('js-calc-height');
                    return getLiHeight($(el).parent(), false);
                }
            } else {
                height = $(el).show().find('.js-calc-height').outerHeight();
                if (height === 0) {
                    return getLiHeight($(el).parent(), false);
                } else {
                    $(el).show().find('.js-calc-height').removeClass('js-calc-height');
                    $(el).hide();
                }
            }

            return height;
        };

        let search = new function() {
            let self = this;

            let options;

            let inProcess;

            self.init = function() {
                searchInput = $('<input>', {
                    'class'      : classes.search,
                    'placeholder': settings.prompt
                });
                customize.search(searchInput);

                let li = $('<li>', {'class': classes.li + ' ' + classes.search});
                $(ul).prepend($(li).append(searchInput));

                searchEmpty = $('<li>', {'class': classes.li + ' ' + classes.empty}).text(settings.empty).hide();
                customize.empty(searchEmpty);
                $(ul).append(searchEmpty);

                options = ul.find(selectors.li + ':not(' + selectors.search + ')' + ':not(' + selectors.empty + ')' + ':not(' + selectors.process + ')');

                if (settings.ajaxUrl) {
                    searchProcess = $('<li>', {'class': classes.li + ' ' + classes.process}).text(settings.ajaxProcess).hide();
                    ul.append(searchProcess);
                    $(ul).css({'top': 44, 'left': 'auto'});
                    ul.niceScroll(customize.scroll());
                    self.ajax();
                } else {
                    self.live();
                }
            };

            this.live = function() {
                $(searchInput).keyup(function() {
                    let val = $(this).val();

                    let hideCount = 0;
                    if (trim(val) === '') {
                        options.show();
                    } else {
                        options.each(function() {
                            if (!self.find(val, $(this).text())) {
                                $(this).hide();
                                hideCount++;
                            } else {
                                $(this).show();
                            }
                        });
                    }

                    if (hideCount === $(options).length) {
                        searchEmpty.show();
                    } else {
                        searchEmpty.hide();
                    }
                });
            };

            this.find = function(find, text) {
                return trim(text).toLowerCase().indexOf(trim(find).toLowerCase()) !== -1;
            };

            this.ajax = function() {
                $(searchInput).keyup(function() {
                    clearTimeout(inProcess);
                    searchProcess.hide();
                    if ($(this).val() !== '' && $(this).val().length >= settings.ajaxMin) {
                        searchEmpty.hide();
                        searchProcess.show();
                        options.remove();
                        $select.find('option').remove();

                        inProcess = setTimeout(self.request, 300);
                    }
                });
            };

            this.request = function() {
                clearTimeout(inProcess);
                $.ajax({
                    url     : settings.ajaxUrl,
                    type    : settings.ajaxType,
                    dataType: 'json',
                    data    : $.extend({}, {'q': searchInput.val()}, settings.ajaxData, $($select).data('ajaxData')),
                    success : function(data) {
                        if (data.success) {
                            searchProcess.hide();
                            if (data.items instanceof Object) {
                                data.items = $.map(data.items, function (item, key) {
                                    return {
                                        value: key,
                                        text : item
                                    };
                                });
                            }

                            if (data.items.length) {
                                $.each(data.items.reverse(), function(k, item) {
                                    $select.append($('<option>', {'value': item.value}).text(trim(item.text)));

                                    let a = $('<a>', {'class': classes.a});
                                    customize.a(a);

                                    let li = $('<li>', {'class': classes.li});
                                    li.data('value', item.value).append($(a).text(trim(item.text)));
                                    customize.li(li);

                                    $(li).click(function() {
                                        changeSelect(this);
                                    });
                                    searchInput.parent().after(li);
                                });

                                if (data.items.length > 8) {
                                    let clone = $(ul).clone().css({
                                        'position': 'static',
                                        'top' : -999999,
                                        'left':-999999
                                    });
                                    $(body).append(clone);
                                    let liHeight = getLiHeight($(clone.find('li')[0]), true);
                                    clone.remove();
                                    ul.css({
                                        'maxHeight'    : liHeight * 8,
                                        'paddingRight' : '0px',
                                        'paddingBottom': '8px'
                                    });
                                    ul.niceScroll(customize.scroll());
                                }

                                options = ul.find(selectors.li + ':not(' + selectors.search + ')' + ':not(' + selectors.empty + ')' + ':not(' + selectors.process + ')');
                            } else {
                                searchEmpty.show();
                            }
                        }
                    },
                    'error' : function(data) {
                        console.log('error ajax-search', data);
                    }
                });
            };
        };

        function trim(str, charlist) {
            return str.trim();
        }

        return this.each(init);
    };
})(jQuery);
