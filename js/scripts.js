$(document).ready(function() {
  sam.init();
});

var sam = new function() {
  var self = this;
  
  self.body = $('body');
  
  self._csrf = $('meta[name="csrf-token"]').attr('content');
  
  self.isMobile    = self.body.outerWidth() < 481;
  self.isMobile980 = self.body.outerWidth() < 981;
  self.isTablet    = self.body.outerWidth() < 1181;
  self.isDesktop   = self.body.outerWidth() > 1180;
  
  self.isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1 &&  navigator.userAgent.indexOf('Android') == -1;
  
  self.init = function() {
    self.empty.init();
    self.sectionsMobile.init();
    self.select.init();
    self.dropdown.init();
    self.collapse.init();
    self.showToClick.init();
    self.burger.init();
    self.tinySlider.init();
    self.modal.init();
    self.showPassword.init();
    self.disclaimer.init();
    self.form.init();
    self.nicescroll.init();
    self.tabs.init();
    self.share.init();
    self.circleProgressBar.init();
    
    $(window).resize(function() {
      self.isMobile    = self.body.outerWidth() < 481;
      self.isMobile980 = self.body.outerWidth() < 981;
      self.isTablet    = self.body.outerWidth() < 1181;
    });
  };
  
  this.empty = new function() {
    var that = this;
    
    this.init = function() {
      var $empties = $('[data-empty]');
      if ($empties.length) {
        $empties.each(function() {
          if ($(this).html().trim() === '') {
            $(this).html('');
          }
        });
      }
    }
  };
  
  this.sectionsMobile = new function() {
    this.init = function() {
      if (self.isTablet) {
        let sectionsItem = $('.sections--dropdown').find('.sections__item');
        $(sectionsItem).click(function() {
          $(this).parent().toggleClass('open');
          if ($(this).hasClass('sections__item--active')) {
            return false;
          }
          $(sectionsItem).removeClass('sections__item--active');
          $(this).addClass('sections__item--active');
        });
      }
    }
  };
  
  this.select = new function() {
    this.init = function() {
      $('select.js-select').each(function() {
        $(this).samselect($(this).data());
      });
    };
    
    this.close = function($selects) {
      $selects.each(function() {
        $(this).samselect('destroy');
        $(this).val('').prop('disabled', true);
        $(this).samselect($(this).data());
      })
    };
    
    this.open = function($selects) {
      $selects.each(function() {
        $(this).samselect('destroy');
        $(this).prop('disabled', false);
        $(this).samselect($(this).data());
      });
    };
    
    this.clear = function($selects) {
      $selects.each(function() {
        let prompt = $(this).find('option:first-child').text();
        
        $(this).find('option').remove();
        $(this).append($('<option>').val('').text(prompt));
      });
    };
  };
  
  this.dropdown = new function() {
    let that = this;
    
    this.init = function() {
      $('.js-dropdown').each(function() {
        that.build(this);
      });
    };
    
    this.toggleUl = function(title, ul) {
      if ($(title).parent().hasClass('js-open')) {
        $(title).parent().removeClass('js-open');
        $(ul).removeClass('select-item__options--active').hide();
        
        self.body.off('click');
      } else {
        $(title).parent().addClass('js-open');
        $(ul).addClass('select-item__options--active').show();
        
        let dropdownId = $(title).parent().attr('id');
        self.body.click(function(event) {
          event = event || window.event;
          that.closeDropdowns(event, dropdownId);
        });
      }
    };
    
    this.closeDropdowns = function(event, dropdownId) {
      let hide = true;
      if ($(event.target).parents('.js-div-dropdown').length) {
        let div = $(event.target).parents('.js-div-dropdown');
        if ($(div).attr('id') == dropdownId) {
          hide = false;
        }
      }
      if (hide) {
        $('.js-div-dropdown.js-open').each(function() {
          let title = $(this).find('.js-div-dropdown-title'),
            ul = $(this).find('.js-div-dropdown-ul');
          
          that.toggleUl(title, ul);
        });
      }
    };
    
    this.change = function(li) {
      let div = $(li).parents('.js-div-dropdown'),
        title = $(div).find('.js-div-dropdown-title'),
        ul = $(div).find('.js-div-dropdown-ul');
      
      $(ul).find('li.js-active').removeClass('js-active');
      $(li).addClass('js-active');
      
      if ($(ul).data('customize')) {
        customizeStyle = $(ul).data('customize');
      }
      
      title = that.customize.title(title, ul);
      that.toggleUl(title, ul);
    };
    
    this.getId = function(step) {
      if (!step) {
        step = 0;
      }
      let rand = Date.now();
      if ($('#js-div-dropdown-' + rand).length) {
        return that.getId(++step);
      }
      
      return rand;
    };
    
    this.getDefaultScroll = function() {
      return {
        'autohidemode'      : false,
        'cursorwidth'       : '4px',
        'cursorborder'      : 'none',
        'cursorborderradius': '3px',
        'zindex'            : '998',
        'scrollspeed'       : '0',
        'mousescrollstep'   : 40,
        'touchbehavior'     : sam.isTablet,
        'railpadding'       : {top: 4, right: 2, left: 0, bottom: 4}
      };
    };
    
    this.customize = {
      div: function(div, ul) {
        $(div).addClass('dropdown');
        if ($(ul).data('width')) {
          $(div).css('width', $(ul).data('width'));
        }
        if ($(ul).data('dark')) {
          div.addClass('dropdown--dark');
        }
        if ($(ul).data('light')) {
          div.addClass('dropdown--light');
        }
        if ($(ul).data('transparent')) {
          div.addClass('dropdown--transparent');
        }
        if ($(ul).data('disabled')) {
          div.addClass('dropdown--disabled');
        }
        return div;
      },
      title: function(title, dropdown) {
        let html = '';
        if ($(dropdown).find('li.js-active').length) {
          html = $(dropdown).find('li.js-active').html();
        } else {
          html = $(dropdown).find('li:first-child').html();
        }
        $(title).addClass('dropdown__title');
        $(title).html(html);
        return $(title);
      },
      ul: function(ul) {
        $(ul).addClass('dropdown__options');
        return ul;
      },
      li: function(li) {
        $(li).addClass('dropdown__option');
        return li;
      },
      a: function(a) {
        $(a).addClass('dropdown__link dropdown__link--dropdown');
      },
      scroll: function() {
        var params = that.getDefaultScroll();
        params.cursorcolor = '#0044af';
        params.cursoropacitymax = 0.75;
        params.cursoropacitymin = 0.75;
        
        return params;
      }
    };
    
    this.build = function(dropdown) {
      let id = that.getId(),
        div = $('<div>', {'id': 'js-div-dropdown-' + id, 'class': 'js-div-dropdown'}),
        title = $('<div>', {'class': 'js-div-dropdown-title'}),
        ul = $(dropdown).clone();
      
      $(ul).addClass('js-div-dropdown-ul');
      
      that.customize.title(title, ul);
      that.customize.ul(ul);
      $(ul).find('li').each(function() {
        that.customize.li(this);
        that.customize.a($(this).find('a'));
        $(this).click(function() {
          that.change(this);
        });
      });
      
      that.customize.title(title, ul);
      that.customize.div(div, dropdown);
      
      $(div).append(title, ul);
      $(dropdown).replaceWith(div);
      
      if (!ul.data('disabled')) {
        $(title).click(function() {
          that.toggleUl(this, ul);
        });
      }
      
      if ($(ul).find('li').length > 8) {
        var liHeight = that.getLiHeight($(ul).find('li')[0], true); $(ul).hide();
        $(ul).css({
          'maxHeight'   : liHeight * 8 + 16,
          'paddingRight': '12px'
        });
        $(ul).niceScroll(that.customize.scroll());
      }
      
      $(ul).parents('.js-dropdown-cont').addClass('js-already-init')
    };
    
    this.getLiHeight = function(el, isLi) {
      let height;
      if (isLi) {
        height = $(el).outerHeight();
        if (height === 0) {
          $(el).addClass('js-calc-height');
          return that.getLiHeight($(el).parent(), false);
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
  };
  
  this.collapse = new function() {
    var that = this;
    
    this.params = {
      'speed'   : 200,
      'callback': null
    };
    
    this.callbacks = {};
    
    this.init = function() {
      $('.js-collapse-btn').click(function() {
        var target = $(this).data('target');
        if ($(target).hasClass('js-show')) {
          $(target).removeClass('js-show').addClass('js-hide').slideUp();
        } else {
          if ($(this).data('accordion')) {
            $('.js-collapse').slideUp(function() {
              $(this).removeClass('js-show').addClass('js-hide')
            });
            $('.js-collapse-btn').removeClass($(this).data('activeClass'));
          }
          $(target).slideDown(function() {
            $(this).removeClass('js-hide').addClass('js-show');
          });
        }
        $(this).find('> span').text($(this).data(!$(target).hasClass('js-hide') ? 'showText' : 'hideText'));
        $(this).toggleClass($(this).data('activeClass'));
      });
      
      $('.js-collapse').click(function() {
        let el, selector;
        if ($(this).data('collapseId') || $(this).data('collapseSelector')) {
          el = this;
          selector = $(this).data('collapseSelector') ? true : false;
        } else {
          el = $(this).find('*[data-collapse-id]:first-child');
          selector = $(el).data('collapseSelector') ? true : false;
        }
        
        let pickSelector = (selector) ? $(el).data('collapseSelector') : ('#' + $(el).data('collapseId'));
        if ($(el).hasClass('js-open')) {
          that.close(el, pickSelector);
        } else {
          that.open(el, pickSelector);
        }
      });
    };
    
    this.open = function(el, selector) {
      if (!$(el).hasClass('disable')) {
        $(el).addClass('disable js-open');
        $(selector).slideDown(that.params.speed, function() {
          $(el).removeClass('disable');
          if ($(el).data('openCallback') && (that.params.callback = that.callbacks[$(el).data('openCallback')])) {
            that.runCallback();
          }
        });
      }
    };
    
    this.close = function(el, selector) {
      if (!$(el).hasClass('disable')) {
        $(el).addClass('disable').removeClass('js-open');
        $(selector).slideUp(that.params.speed, function() {
          $(el).removeClass('disable');
          if ($(el).data('closeCallback') && (that.params.callback = that.callbacks[$(el).data('closeCallback')])) {
            that.runCallback();
          }
        });
      }
    };
    
    this.runCallback = function() {
      if (that.params.callback) {
        that.params.callback();
      }
    };
  };
  
  this.showToClick = new function() {
    var that = this;
    
    let $showParent = $('.js-show-parent');
    
    this.init = function() {
      let $showLink = $showParent.find('.js-show-link'),
        $showScroll = $showParent.find('.js-notifications-scroll'),
        $showContentAll = $showParent.find('.js-show-content');
      
      $showLink.click(function() {
        $showLink.not($(this)).removeClass('active');
        $showParent.not($(this).parent()).removeClass('active');
        $showContentAll.not($(this).siblings('.js-show-content')).removeClass('show');
        let $showContent = $(this).siblings('.js-show-content');
        $(this).toggleClass('active');
        $(this).parent().toggleClass('active');
        $showScroll.niceScroll({
          'cursorcolor'          : '#8361C3',
          'cursorwidth'          : '4px',
          'cursorborder'         : false,
          'cursorborderradius'   : '100px',
          'nativeparentscrolling': false,
          'cursorminheight'      : 13,
          'cursorfixedheight'    : 13,
          'horizrailenabled'     : false,
          'autohidemode'         : false,
          'railpadding'          : { top: 0, right: 12, left: 12, bottom: 0 }
        });
        $showContent.toggleClass('show');
        self.body.on('click', function(event) {
          event = event || window.event;
          if (!$(event.target).parents('.js-show-parent').length) {
            $showLink.removeClass('active');
            $showContent.removeClass('show');
            $(this).parent().removeClass('active');
            self.body.off('click');
          }
        });
      });
    };
  };
  
  this.burger = new function() {
    let that = this;
    
    this.init = function() {
      let $hamburger = $('.js-hamburger'),
          $hamburgerOpen = $('.js-hamburger-open'),
          hasSubmenu = $('.js-has-submenu');
      
      $hamburger.click(function() {
        $hamburgerOpen.toggleClass('open');
        $(this).toggleClass('open');
        
        if (!$hamburgerOpen.hasClass('js-hamburger-dont-fixed')) {
          if ($(this).hasClass('open')) {
            if (self.isSafari) {
              $('html').addClass('fixed-safari');
              self.body.addClass('fixed-safari');
            } else {
              self.body.addClass('fixed');
            }
          } else {
            if (self.isSafari) {
              self.body.removeClass('fixed-safari');
              $('html').removeClass('fixed-safari');
            } else {
              self.body.removeClass('fixed');
            }
          }
        }
      });
  
      $(hasSubmenu).click(function() {
        var submenu = $(this).find('.js-submenu');
        $(this).toggleClass('open');
        $(submenu).toggleClass('open');
      });
    };
  };
  
  this.tinySlider = new function () {
    let that = this;
    
    this.sliders = {};
    
    this.timers = {};
    
    this.init = function () {
      $('.js-tiny-slider').each(function (k) {
        let slider = this, data = $(this).data,
          initialWidth = data['initialWidth'], bodyWidth = self.body.outerWidth(),
          sliderName = data['sliderName'] ? data['sliderName'] : k;
        if (initialWidth) {
          if (initialWidth >= bodyWidth) {
            that.build(this, k);
          }
          
          $(window).resize(function () {
            if (that.timers[sliderName]) {
              clearTimeout(that.timers[sliderName]);
              delete that.timers[sliderName];
            }
            that.timers[sliderName] = setTimeout(function () {
              let bodyWidth = self.body.outerWidth();
              if (initialWidth >= bodyWidth) {
                that.build(slider, sliderName);
              } else if (that.sliders[sliderName]) {
                that.destroy(slider, sliderName);
              }
            }, 100);
          });
        } else {
          that.build(this, sliderName);
        }
      });
      $('.js-tiny-container').addClass('show');
    };
    
    this.build = function (slider, k) {
      if (!$(slider).hasClass('js-already-init')) {
        let sliderClass = 'js-tiny-slider-' + k,
          sliderSelector = '.' + sliderClass;
        $(slider).addClass(sliderClass).data('sliderIndex', k);
        let data = $(slider).data();
        let params = {
          //Контейнеры
          container: data['container'] ? data['container'] : sliderSelector, //селектор контейнера для слайдера
          controlsContainer: data['controlsContainer'] ? data['controlsContainer'] : false, //селектор контейнера для стрелок
          navContainer: data['navContainer'] ? data['navContainer'] : false, //селектор контейнера для точек
          //Стрелки и точки
          controls: data['controls'] ? data['controls'] : false, //кнопки
          prevButton: data['prevButton'] ? $(data['prevButton']).get(0) : false, //селектор кнопки пред. слайда
          nextButton: data['nextButton'] ? $(data['nextButton']).get(0) : false, //селектор кнопки след. слайда
          nav: data['nav'] ? data['nav'] : false, //точки [dots]
          navAsThumbnails: data['navAsThumbnails'] ? data['navAsThumbnails'] : false, //навигация в виде мини-картинок
          
          //Основные параметры
          mode: data['mode'] ? data['mode'] : 'carousel',
          items: data['items'] ? data['items'] : 1,            //количество видимых элементов слайдов
          slideBy: data['slideBy'] ? data['slideBy'] : 1,            //на сколько слайдов сдвигать
          startIndex: data['startIndex'] ? data['startIndex'] : false,        //начальный слайд
          autoWidth: data['autoWidth'] ? data['autoWidth'] : false,        //автоматическое определение ширины слайда
          autoHeight: data['autoHeight'] ? data['autoHeight'] : false,        //автоматическое определение высоты слайда,
          fixedWidth: data['fixedWidth'] ? data['fixedWidth'] : false,        //фиксированная ширина слайда
          loop: data['loop'] ? data['loop'] : false,        //бесконечность прокрутки
          speed: data['speed'] ? data['speed'] : 300,          //скорость прокрутки
          lazyload: data['lazyload'] ? data['lazyload'] : false,        //ленивая загрузка
          axis: data['axis'] ? data['axis'] : 'horizontal', //['horizontal', 'vertical'] горизонтальная/вертикальная прокрутка
          gutter: data['gutter'] ? data['gutter'] : 0,            //расстояние между слайдами, в px
          center: data['center'] ? data['center'] : false,        //центрирование активного слайда
          mouseDrag: data['mouseDrag'] ? data['mouseDrag'] : false,        //изменение слайдов путем их перетаскивания
          touch: data['touch'] ? data['touch'] : false,        //активирует обнаружение ввода для сенсорных устройств.
          
          //Автопрокрутка
          autoplay: data['autoplay'] ? data['autoplay'] : false,     //автопрокрутка
          autoplayButtonOutput: data['autoplayButtonOutput'] ? data['autoplayButtonOutput'] : false,     //кнопки для автопрокрутки
          autoplayTimeout: data['autoplayTimeout'] ? data['autoplayTimeout'] : 5000,      //задержка прокрутки
          autoplayDirection: data['autoplayDirection'] ? data['autoplayDirection'] : 'forward', //['forward', 'backward'] направленность прокрутки
          autoplayText: data['autoplayText'] ? data['autoplayText'] : false,     //['start', 'stop'] //текст кнопок прокрутки
          autoplayHoverPause: data['autoplayHoverPause'] ? data['autoplayHoverPause'] : false,     //остановка при наведении мыши
          
          //Респонсив
          responsive: data['responsive'] ? data['responsive'] : false, //{breakpoint: {key: value, [...]}}}
          
          //Отключение hideNav (расширение by @bpystep)
          hideNav: data['hide-nav'] !== 'undefined' ? data['hide-nav'] : true //скрывает Nav, если все слайды отображены
        };
        
        let tnsSlider = tns(params);
        this.sliders[data['sliderName'] ? data['sliderName'] : k] = tnsSlider;
        $(slider).removeClass(sliderClass);
        
        if ($(slider).data('transitionStart') && that.callbacks[$(slider).data('transitionStart')]) {
          tnsSlider.events.on('transitionStart', that.callbacks[$(slider).data('transitionStart')]);
        }
        
        if ($(slider).data('transitionEnd') && that.callbacks[$(slider).data('transitionEnd')]) {
          tnsSlider.events.on('transitionEnd', that.callbacks[$(slider).data('transitionEnd')]);
        }
        $(slider).removeClass(sliderClass);
        $(slider).addClass('js-already-init');
      }
    };
    
    this.destroy = function (slider, k) {
      $(slider).removeClass('js-already-init');
      that.sliders[k].destroy();
      delete that.sliders[k];
    };
    
    this.callbacks = {};
  };
  
  this.modal = new function() {
    var that = this;
    
    this.state = {
      'isActive': false,
      'popup'   : null,
      'btn'     : null
    };
    
    this.init = function() {
      $('a[data-toggle="modal"], button.js-popup-button').click(function() {
        $(this).toggleClass('active');
        
        var $popup = $(this).hasClass('js-popup-button') ? $($(this).data('target')) : $($(this).attr('href'));
        if ($popup.length) {
          if (that.state.isActive) {
            that.close(that.state.popup, that.state.btn);
          }
          that.open($popup, $(this));
        }
      });
    };
    
    this.open = function($popup, $btn) {
      let popupId = $popup.attr('id');
      
      that.overlay.open();
      $popup.addClass('active').addClass('open');
      $btn.addClass('active');
      
      that.overlay.$overlay.click(function(event) {
        event = event || window.event;
        let $parent = $(event.target).parents('#' + popupId);
        if ($parent.length) {
          return;
        }
        
        that.close($popup, $btn);
      });
      
      $popup.find('.js-close').click(function() {
        that.close($popup, $btn);
      });
      
      that.state.isActive = true;
      that.state.popup = $popup;
      that.state.btn = $btn;
    };
    
    this.close = function($popup, $btn) {
      that.overlay.close();
      $popup.removeClass('active').removeClass('open');
      $btn.removeClass('active');
      
      that.overlay.$overlay.off('click');
      $popup.find('.js-close').off('click');
      
      that.state.isActive = false;
      that.state.popup = null;
      that.state.btn = null;
    };
    
    this.overlay = new function() {
      var context = this;
      
      this.$overlay = $('.js-overlay');
      
      this.open = function() {
        context.$overlay.show();
        self.body.addClass('fixed');
        if (self.isDesktop) {
          $('html').css({'marginRight' : this.getScrollBarWidth()});
        }
      };
      
      this.close = function() {
        context.$overlay.hide();
        if (!$('.js-hamburger-open').hasClass('open')) {
          self.body.removeClass('fixed');
        }
        if (self.isDesktop) {
          $('html').css({'marginRight' : '0'});
        }
      };
      
      this.getScrollBarWidth = function() {
        var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
          widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
        $outer.remove();
        return 100 - widthWithScroll;
      };
    };
  };
  
  this.showPassword = new function() {
    var that = this;
    
    this.init = function() {
      var showButton = $('.form__show');
      $(showButton).click(function() {
        var passwordInput = $(this).parents('.form__password').find('input');
        $(passwordInput).attr('type', $(passwordInput).attr('type') === 'password' ? 'text' : 'password');
        $(this).toggleClass('active');
      });
    };
  };
  
  this.disclaimer = new function() {
    var that = this;
    
    this.init = function() {
      that.cookie.init();
    };
    
    this.cookie = new function() {
      var context = this;
      
      let cookieName = 'cookies-show-banner';
      
      this.init = function() {
        let cookie = $.cookie(cookieName);
        if (!cookie) {
          setTimeout(function() {
            $('.js-cookie-banner').toggle(true, 300);
          }, 500);
        }
        $('.js-cookie-banner-accept').click(function() {
          $.cookie(cookieName, 1, {expires: 30, path: '/'});
          $('.js-cookie-banner').slideUp(300);
        });
      };
    };
  };
  
  this.form = new function() {
    var that = this;
    
    this.init = function() {
      that.fileInput();
      that.submitButton();
    };
    
    this.fileInput = function() {
      var fileInput = $('.js-file-input');
      $(fileInput).change(function() {
        var fileLink = $(this).siblings('.js-file-link');
        $(fileLink).find('.js-file-text').text($(this).prop('files')[0].name);
      });
    };
    
    this.submitButton = function() {
      $('form.form:not(.js-no-validate)').each(function() {
        let $button = $(this).find('.button[type="submit"]');
        if ($button.length) {
          if (!$button.get(0).hasAttribute('data-invalid-disabled') || $button.data('invalidDisabled') === true) {
            $(this).on('afterValidate', function(event, messages, errorAttributes) {
              $button.prop('disabled', !!errorAttributes.length);
            });
          }
          
          $(this).submit(function() {
            if (!$button.prop('disabled')) {
              $button.prop('disabled', true);
              setTimeout(function() {
                $button.prop('disabled', false);
              }, 1000);
            }
          });
        }
      });
    };
  };
  
  this.nicescroll = new function() {
    var that = this;
    
    this.init = function() {
      $('.js-nicescroll-main').niceScroll(that.getOps());
    };
    
    this.getOps = function() {
      return {
        'cursorcolor'          : '#8361C3',
        'cursorwidth'          : '4px',
        'cursorborder'         : false,
        'cursorborderradius'   : '100px',
        'nativeparentscrolling': false,
        'cursorminheight'      : 13,
        'cursorfixedheight'    : 13,
        'horizrailenabled'     : false,
        'autohidemode'         : false,
        'railpadding'          : { top: 0, right: 12, left: 12, bottom: 0 }
      };
    };
  };
  
  this.tabs = new function() {
    var that = this;
    
    this.init = function() {
      $('.js-tabs:not(.js-already-init)').each(function() {
        that.build(this);
      });
      
      $('.js-scroll-tabs').each(function() {
        that.scroll(this);
      });
    };
    
    this.customize = {
      li: function(ul, li) {
        let styleClass = $(ul).data('menu') ? 'menu__item--active' : 'tabs__item--active'
        if ($(li).hasClass('js-active')) {
          $(li).addClass(styleClass);
        } else {
          $(li).removeClass(styleClass);
        }
      },
      tab: function(ul, tab) {
        if ($(tab).hasClass('js-show')) {
          $(tab).addClass('tabs__pane--active');
        } else {
          $(tab).removeClass('tabs__pane--active');
        }
      }
    };
    
    this.build = function(ul) {
      if (!$(ul).data('cont-id') && !$($(ul).data('cont-selector'))) {
        return false;
      }
      
      var tabsCont;
      if ($(ul).data('cont-id')) {
        tabsCont = $('#' + $(ul).data('cont-id'));
      } else {
        tabsCont = $($(ul).data('cont-selector'));
      }
      
      $(ul).find('li a').click(function() {
        var li = $(this).parents('li');
        $(ul).find('li.js-active').removeClass('js-active');
        $(li).addClass('js-active');
        $(ul).find('li').each(function() {
          that.customize.li(ul, this);
        });
        
        var tabContSelector;
        if ($(li).data('tab-id')) {
          tabContSelector = '>.js-tab-cont#' + $(li).data('tab-id');
        } else if ($(ul).data('tab-selector')) {
          tabContSelector = '>.js-tab-cont' + $(li).data('tab-selector');
        }
        
        var tab = $(tabsCont).find(tabContSelector);
        $(tabsCont).find('>.js-tab-cont.js-show').removeClass('js-show').hide();
        $(tab).addClass('js-show').show();
        $.each($(tabsCont).find('>.js-tab-cont'), function() {
          that.customize.tab(ul, this);
        });
        
        var tabsCallback = $(ul).data('callback');
        if (tabsCallback && that.callbacks[tabsCallback]) {
          that.callbacks[tabsCallback](ul);
        }
        
        $('html').getNiceScroll().resize();
      });
      
      $(ul).addClass('js-already-init');
    };
    
    this.destroy = function(ul) {
      $(ul).find('li a').off('click');
    };
    
    this.scroll = function() {
      var $tabItems  = $(scrollTabs).find('.tabs__item'),
        $activeTab = $(scrollTabs).find('.tabs__item--active'),
        x = $activeTab.offset().left;
      
      if ($tabItems.last().hasClass('tabs__item--active')) {
        $(scrollTabs).scrollLeft(x) + $(scrollTabs).width();
      } else {
        $(scrollTabs).scrollLeft(x);
      }
    }
    
    this.callbacks = {};
  };
  
  this.share = new function() {
    var that = this;
    
    this.init = function() {
      self.body.on('click', '.js-share-item', function() {
        $(this).parent().find('.js-share-content').toggleClass('open');
      });
    };
  };
  
  this.circleProgressBar = new function() {
    var that = this;
    
    this.init = function() {
      $('.js-progress').circleProgress({
        size: 140,
        emptyFill: 'rgba(255, 255, 255, 1)',
        fill: {gradient: [['#8360C3', 0], ['#8361C3', .15], ['#2EBF91', 1]]}
      });
    };
  };
};

function in_array(needle, haystack, strict) {
  let found = false, key; strict = !!strict;
  
  for (key in haystack) {
    if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
      found = true;
      break;
    }
  }
  
  return found;
}

function empty(value) {
  return (value === "" || value === 0 || value === "0" || value === null || value === false || (value instanceof Array && value.length === 0));
}
