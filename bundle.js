// eslint-disable-next-line no-unused-vars
function createObserver(func, obid) {
  var runningOnBrowser = typeof window !== 'undefined';
  var isBot = (runningOnBrowser && !('onscroll' in window)) || (typeof navigator !== 'undefined'
    && /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent));
  var supportsIntersectionObserver = runningOnBrowser && 'IntersectionObserver' in window;
  if (!isBot && supportsIntersectionObserver) {
    var io = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        func();
        io.disconnect();
      }
    }, {
      threshold : [0],
      rootMargin: (window.innerHeight || document.documentElement.clientHeight) + 'px'
    });
    io.observe(document.getElementById(obid));
  } else {
    func();
  }
}

// eslint-disable-next-line no-unused-vars
function addScript(url, onload) {
  var s = document.createElement('script');
  s.setAttribute('src', url);
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('charset', 'UTF-8');
  s.async = false;
  if (typeof onload === 'function') {
    if (window.attachEvent) {
      s.onreadystatechange = function() {
        var e = s.readyState;
        if (e === 'loaded' || e === 'complete') {
          s.onreadystatechange = null;
          onload();
        }
      };
    } else {
      s.onload = onload;
    }
  }
  var e = document.getElementsByTagName('script')[0]
    || document.getElementsByTagName('head')[0]
    || document.head || document.documentElement;
  e.parentNode.insertBefore(s, e);
}

// eslint-disable-next-line no-unused-vars
function addCssLink(url) {
  var l = document.createElement('link');
  l.setAttribute('rel', 'stylesheet');
  l.setAttribute('type', 'text/css');
  l.setAttribute('href', url);
  var e = document.getElementsByTagName('link')[0]
    || document.getElementsByTagName('head')[0]
    || document.head || document.documentElement;
  e.parentNode.insertBefore(l, e);
}
;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

/**
 * Handles debouncing of events via requestAnimationFrame
 * @see http://www.html5rocks.com/en/tutorials/speed/animations/
 * @param {Function} callback The callback to handle whichever event
 */
function Debouncer(callback) {
  this.callback = callback;
  this.ticking = false;
}
Debouncer.prototype = {
  constructor: Debouncer,

  /**
   * dispatches the event to the supplied callback
   * @private
   */
  update: function() {
    this.callback && this.callback();
    this.ticking = false;
  },

  /**
   * ensures events don't get stacked
   * @private
   */
  requestTick: function() {
    if (!this.ticking) {
      requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this)));
      this.ticking = true;
    }
  },

  /**
   * Attach this as the event listeners
   */
  handleEvent: function() {
    this.requestTick();
  }
};
;
// 监听滚动事件
function listenScroll(callback) {
  // eslint-disable-next-line no-undef
  const dbc = new Debouncer(callback);
  window.addEventListener('scroll', dbc, false);
  dbc.handleEvent();
}

// 滚动到指定元素
function scrollToElement(target, offset) {
  var scroll_offset = $(target).offset();
  $('body,html').animate({
    scrollTop: scroll_offset.top + (offset || 0),
    easing   : 'swing'
  });
}

// 顶部菜单的监听事件
function navbarScrollEvent() {
  var navbar = $('#navbar');
  var submenu = $('#navbar .dropdown-menu');
  if (navbar.offset().top > 0) {
    navbar.addClass('navbar-custom');
    navbar.removeClass('navbar-dark');
    submenu.addClass('navbar-custom');
    submenu.removeClass('navbar-dark');
  }
  listenScroll(function() {
    navbar[navbar.offset().top > 50 ? 'addClass' : 'removeClass']('top-nav-collapse');
    submenu[navbar.offset().top > 50 ? 'addClass' : 'removeClass']('dropdown-collapse');
    if (navbar.offset().top > 0) {
      navbar.addClass('navbar-custom');
      navbar.removeClass('navbar-dark');
      submenu.addClass('navbar-custom');
      submenu.removeClass('navbar-dark');
    } else {
      navbar.addClass('navbar-dark');
      submenu.removeClass('navbar-dark');
    }
  });
  $('#navbar-toggler-btn').on('click', function() {
    $('.animated-icon').toggleClass('open');
    $('#navbar').toggleClass('navbar-col-show');
  });
}

// 头图视差的监听事件
function parallaxEvent() {
  var target = $('#background[parallax="true"]');
  var parallax = function() {
    var oVal = $(window).scrollTop() / 5;
    var offset = parseInt($('#board').css('margin-top'), 0);
    var max = 96 + offset;
    if (oVal > max) {
      oVal = max;
    }
    target.css({
      transform          : 'translate3d(0,' + oVal + 'px,0)',
      '-webkit-transform': 'translate3d(0,' + oVal + 'px,0)',
      '-ms-transform'    : 'translate3d(0,' + oVal + 'px,0)',
      '-o-transform'     : 'translate3d(0,' + oVal + 'px,0)'
    });

    var toc = $('#toc');
    if (toc) {
      $('#toc-ctn').css({
        'padding-top': oVal + 'px'
      });
    }
  };
  if (target.length > 0) {
    listenScroll(parallax);
  }
}

// 向下滚动箭头的监听事件
function scrollDownArrowEvent() {
  $('.scroll-down-bar').on('click', function() {
    scrollToElement('#board', -$('#navbar').height());
  });
}

// 向顶部滚动箭头的监听事件
function scrollTopArrowEvent() {
  var topArrow = $('#scroll-top-button');
  if (!topArrow) {
    return;
  }
  var posDisplay = false;
  var scrollDisplay = false;
  // 位置
  var setTopArrowPos = function() {
    var boardRight = document.getElementById('board').getClientRects()[0].right;
    var bodyWidth = document.body.offsetWidth;
    var right = bodyWidth - boardRight;
    posDisplay = right >= 50;
    topArrow.css({
      'bottom': posDisplay && scrollDisplay ? '20px' : '-60px',
      'right' : right - 64 + 'px'
    });
  };
  setTopArrowPos();
  $(window).resize(setTopArrowPos);
  // 显示
  var headerHeight = $('#board').offset().top;
  listenScroll(function() {
    var scrollHeight = document.body.scrollTop + document.documentElement.scrollTop;
    scrollDisplay = scrollHeight >= headerHeight;
    topArrow.css({
      'bottom': posDisplay && scrollDisplay ? '20px' : '-60px'
    });
  });
  // 点击
  topArrow.on('click', function() {
    $('body,html').animate({
      scrollTop: 0,
      easing   : 'swing'
    });
  });
}

$(document).ready(function() {
  navbarScrollEvent();
  parallaxEvent();
  scrollDownArrowEvent();
  scrollTopArrowEvent();
});
;
// eslint-disable-next-line no-unused-expressions
!(function(window, document) {
  var runningOnBrowser = typeof window !== 'undefined';
  var supportsIntersectionObserver = runningOnBrowser && 'IntersectionObserver' in window;

  var images = Array.prototype.slice.call(document.querySelectorAll('img[srcset]'));
  if (!images || images.length === 0) {
    return;
  }

  if (supportsIntersectionObserver) {
    var io = new IntersectionObserver(function(changes) {
      changes.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.setAttribute('srcset', target.src);
        target.onload = target.onerror = () => io.unobserve(target);
      });
    }, {
      threshold : [0],
      rootMargin: (window.innerHeight || document.documentElement.clientHeight) + 'px'
    });
    images.map((item) => io.observe(item));
  } else {
    // eslint-disable-next-line no-inner-declarations
    function elementInViewport(el) {
      var rect = el.getBoundingClientRect();
      var height = window.innerHeight || document.documentElement.clientHeight;
      var top = rect.top;
      return (top >= 0 && top <= height * 3) || (top <= 0 && top <= -(height * 2) - rect.height);
    }

    // eslint-disable-next-line no-inner-declarations
    function loadImage(el, fn) {
      var img = new Image();
      var src = el.getAttribute('src');
      img.onload = function() {
        el.srcset = src;
        fn && fn();
      };
      img.srcset = src;
    }

    // eslint-disable-next-line no-undef
    var lazyLoader = new Debouncer(processImages);

    // eslint-disable-next-line no-inner-declarations
    function processImages() {
      for (var i = 0; i < images.length; i++) {
        if (elementInViewport(images[i])) {
          // eslint-disable-next-line no-loop-func
          (function(index) {
            var loadingImage = images[index];
            loadImage(loadingImage, function() {
              images = images.filter(function(t) {
                return loadingImage !== t;
              });
            });
          })(i);
        }
      }
      if (images.length === 0) {
        window.removeEventListener('scroll', lazyLoader, false);
      }
    }

    window.addEventListener('scroll', lazyLoader, false);
    lazyLoader.handleEvent();
  }

})(window, document);
;
// A local search script with the help of [hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search)
// Copyright (C) 2017
// Liam Huang <https://github.com/Liam0205>
// This library is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 2.1 of the
// License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
// 02110-1301 USA
//
// Updated by Rook1e <https://github.com/0x2E>

// eslint-disable-next-line no-unused-vars
var searchFunc = function(path, search_id, content_id) {
  // 0x00. environment initialization
  'use strict';
  var $input = document.getElementById(search_id);
  var $resultContent = document.getElementById(content_id);
  $resultContent.innerHTML = '<div class="m-auto text-center"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div><br/>Loading...</div>';
  $.ajax({
    // 0x01. load xml file
    url     : path,
    dataType: 'xml',
    success : function(xmlResponse) {
      // 0x02. parse xml file
      var dataList = $('entry', xmlResponse).map(function() {
        return {
          title  : $('title', this).text(),
          content: $('content', this).text(),
          url    : $('url', this).text()
        };
      }).get();
      $resultContent.innerHTML = '';

      $input.addEventListener('input', function() {
        // 0x03. parse query to keywords list
        var str = '';
        var keywords = this.value.trim().toLowerCase().split(/[\s-]+/);
        $resultContent.innerHTML = '';
        if (this.value.trim().length <= 0) {
          return;
        }
        // 0x04. perform local searching
        dataList.forEach(function(data) {
          var isMatch = true;
          if (!data.title || data.title.trim() === '') {
            data.title = 'Untitled';
          }
          var orig_data_title = data.title.trim();
          var data_title = orig_data_title.toLowerCase();
          var orig_data_content = data.content.trim().replace(/<[^>]+>/g, '');
          var data_content = orig_data_content.toLowerCase();
          var data_url = data.url;
          var index_title = -1;
          var index_content = -1;
          var first_occur = -1;
          // only match articles with not empty contents
          if (data_content !== '') {
            keywords.forEach(function(keyword, i) {
              index_title = data_title.indexOf(keyword);
              index_content = data_content.indexOf(keyword);

              if (index_title < 0 && index_content < 0) {
                isMatch = false;
              } else {
                if (index_content < 0) {
                  index_content = 0;
                }
                if (i === 0) {
                  first_occur = index_content;
                }
                //content_index.push({index_content:index_content, keyword_len:keyword_len});
              }
            });
          } else {
            isMatch = false;
          }
          // 0x05. show search results
          if (isMatch) {
            str += '<a href=\'' + data_url + '\' class=\'list-group-item list-group-item-action font-weight-bolder search-list-title\'>' + orig_data_title + '</a>';
            var content = orig_data_content;
            if (first_occur >= 0) {
              // cut out 100 characters
              var start = first_occur - 20;
              var end = first_occur + 80;

              if (start < 0) {
                start = 0;
              }

              if (start === 0) {
                end = 100;
              }

              if (end > content.length) {
                end = content.length;
              }

              var match_content = content.substring(start, end);

              // highlight all keywords
              keywords.forEach(function(keyword) {
                var regS = new RegExp(keyword, 'gi');
                match_content = match_content.replace(regS, '<span class=\'pink-text\'>' + keyword + '</span>');
              });

              str += '<p class=\'search-list-content\'>' + match_content + '...</p>';
            }
          }
        });
        const input = $('#local-search-input');
        if (str.indexOf('list-group-item') === -1) {
          return input.addClass('invalid').removeClass('valid');
        }
        input.addClass('valid').removeClass('invalid');
        $resultContent.innerHTML = str;
      });
    }
  });
  $(document).on('click', '#local-search-close', function() {
    $('#local-search-input').val('').removeClass('invalid').removeClass('valid');
    $('#local-search-result').html('');
  });
};
