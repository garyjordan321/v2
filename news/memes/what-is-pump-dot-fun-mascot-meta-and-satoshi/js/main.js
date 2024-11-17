// Change spinner for signin/signup form
if (typeof xoo_el_localize !== 'undefined') {
    xoo_el_localize.html.spinner = '<img style="margin-top: 5px;" height="30" width="30" class="loadmore-spinner-gif" src="https://static.cryptobriefing.com/wp-content/uploads/2021/07/27015726/loader.gif" alt="' + cb_lang.common.loading + '" />';
}

// Make touch and wheel even listeners 'passive'
jQuery.event.special.touchstart = {
  setup: function (_, ns, handle) {
    this.addEventListener("touchstart", handle, {
      passive: !ns.includes("noPreventDefault"),
    });
  },
};
jQuery.event.special.touchmove = {
  setup: function (_, ns, handle) {
    this.addEventListener("touchmove", handle, {
      passive: !ns.includes("noPreventDefault"),
    });
  },
};
jQuery.event.special.wheel = {
  setup: function (_, ns, handle) {
    this.addEventListener("wheel", handle, { passive: true });
  },
};
jQuery.event.special.mousewheel = {
  setup: function (_, ns, handle) {
    this.addEventListener("mousewheel", handle, { passive: true });
  },
};

const $body = jQuery("body");
const isPostPage = $body.hasClass("single-post") || $body.hasClass("single-briefing") || $body.hasClass("single-review");
const isHomePage = $body.hasClass("home");

jQuery(function ($) {
  // Dynamic content
  // if (isHomePage) {
  //   getDynamicContent('home');
  // } else if (isPostPage) {
  //   getDynamicContent('post', $('.page-content-main .article-wrapper:last'));
  // } else {
  //   getDynamicContent('static');
  // }

  $('.header-desktop .lang-current').click(function () {
    $('.header-desktop .lang-options').toggleClass('opened');
  });

  let lastScrollTop = 0;
  $(document).on("scroll", (e) => {
    const scrollTop = $(document).scrollTop();
    const $headerBottomRow = $(".header-bottom-row");
    if (scrollTop > 80) {
      $(".header-desktop").addClass("header-scrolled");
    } else {
      $(".header-desktop").removeClass("header-scrolled");
    }
    if (scrollTop > lastScrollTop && scrollTop - lastScrollTop > 10) {
      $headerBottomRow.slideUp(200);
    }
    if (scrollTop < lastScrollTop && scrollTop - lastScrollTop < 10) {
      $headerBottomRow.slideDown(200);
    }
    lastScrollTop = scrollTop;
  });

  // waitForElement("iframe.ub-emb-iframe", 15000)
  //   .then(function () {
  //     var observer = new MutationObserver(function () {
  //       if ($("iframe.ub-emb-iframe").length === 0) {
  //         setCookie("newsletter_modal_show", "later", 2);
  //       }
  //     });
  //     observer.observe(document.querySelector(".ub-emb-container"), {
  //       childList: true,
  //       subtree: true,
  //     });
  //   })
  //   .catch(() => {
  //     // console.error("CB: unbounce iFrame did not load in 15 seconds");
  //   });

  // Do not show unbounce popup if cb auth window is opened
  // $(document.body).on('xoo_el_popup_toggled', function (e, type) {
  //   const ubPopup = $('.ub-emb-container');
  //   if (ubPopup.length) {
  //     if (type === 'show') {
  //       ubPopup.addClass('cb-hide');
  //     } else if (type === 'hide') {
  //       ubPopup.removeClass('cb-hide');
  //     }
  //   }
  // });

  // Trigger for search
  $(".js-search-icon").click(function () {
    const $searchFormWrap = $(".search-form-wrap");

    if ($searchFormWrap.hasClass("opened")) {
      $searchFormWrap.removeClass("opened");
      $(".js-search-icon").removeClass("opened");
      $("#search").val("");
      $("#search-mobile").val("");
    } else {
      $searchFormWrap.addClass("opened");
      $(".js-search-icon").addClass("opened");
      setTimeout(() => {
        document.getElementById("search").focus();
      }, 200);
    }
  });

  $("#search-mobile").on("focus", function () {
    const $headerMobile = $(".header-mobile");
    const input = $(this);
    input.attr("placeholder", "What are you searching for?").val("");
    $headerMobile.addClass("search-open");
    $("#search-mobile").on("blur", function () {
      $headerMobile.removeClass("search-open");
      input.attr("placeholder", "").val("");
    });
  });

  // Update View all results link in search form on desktop
  $("#search, #search-mobile").change(function () {
    $("#search-results-more-link").attr("href", "/?s=" + $(this).val());
  });

  // Fix search icon overlaying main menu box
  $("#menu-toggle").click(function () {
    $("#search-toggle").prop("checked", false);
    $(".hamburger-menu").toggleClass("opened");
  });

  $(".hamburger-menu .dimmed-bg").click(function () {
    $(".hamburger-menu").removeClass("opened");
  });

  if ($("#wpadminbar").length) {
    // $(".header-mobile").css({ top: "95px" });
    $(".menu-navigation-header-container").css({ "margin-top": "135px" });
    $(".search-box").css({ top: "45px" });
  }

  $(".clipboard").on("click", function () {
    var temp_url = document.createElement("input"),
      text = window.location.href;
    document.body.appendChild(temp_url);
    temp_url.value = text;
    temp_url.select();
    document.execCommand("copy");
    document.body.removeChild(temp_url);

    $(this).closest(".social-icons").find(".copy-to-clipboard").hide();
    $(this).closest(".social-icons").find(".copied-to-clipboard").fadeIn(150);
  });

  $('.social-icon.share').click(function () {
    const url = $(this).data('href');
    if (url) {
      window.open(url, '_blank');
    }
  });

  $(".close-mobile-search").click(function () {
    $("#search-toggle").prop("checked", false);
    $(".js-search-icon").removeClass("opened");
    $(".header-search").removeClass("opened");
    $("#search-mobile").val("");
    $("html, body").removeClass("no-scroll");
  });

  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  $("#search-toggle").click(function () {
    $("#menu-toggle").prop("checked", false);
    const $headerSearch = $(".header-search");
    if ($headerSearch.hasClass("opened")) {
      $headerSearch.removeClass("opened");
      $("html, body").removeClass("no-scroll");
    } else {
      $headerSearch.addClass("opened");
      $("html, body").addClass("no-scroll");
      $("#search-mobile").focus();
    }
  });

  // Posts publishing date
  $.timeago.settings.strings = {
    prefixAgo: null,
    prefixFromNow: null,
    suffixFromNow: cb_lang.date_formatting.suffix_from_now,
    seconds: cb_lang.date_formatting.seconds,
    minute: cb_lang.date_formatting.minute,
    minutes: cb_lang.date_formatting.minutes,
    hour: cb_lang.date_formatting.hour,
    hours: cb_lang.date_formatting.hours,
    day: cb_lang.date_formatting.day,
    days: cb_lang.date_formatting.days,
    month: cb_lang.date_formatting.month,
    months: cb_lang.date_formatting.months,
    year: cb_lang.date_formatting.year,
    years: cb_lang.date_formatting.years,
    wordSeparator: " ",
    numbers: [],
  };

  formatDates($);

  $(document).on("searchwp_live_show_spinner", function () {
    $(".search-results-wrap")
      .find(".loadmore-spinner")
      .hide()
      .before(
        '<img class="loadmore-spinner-gif" src="https://static.cryptobriefing.com/wp-content/uploads/2021/07/27015726/loader.gif" alt="' + cb_lang.common.loading + '" />'
      );
  });

  $(".simetri-link").click(function () {
    ga("send", "event", {
      eventCategory: "Outbound Link",
      eventAction: "click",
      eventLabel: "https://simetri.cryptobriefing.com/pro/cb_1/?try-simetri",
      transport: "beacon",
    });
  });

  if (window.screen.width <= 1024 && window.screen.width > 768) {
    $(document).on(
      "click",
      ".header-nav .menu-item-has-children",
      function (e) {
        if ($(this).hasClass("opened")) {
          $(this).removeClass("opened");
          return true;
        } else {
          e.preventDefault();
          $(this).addClass("opened");
        }
      }
    );
  }

  if (window.screen.width <= 768) {
    $(".current-menu-parent").addClass("opened");
    $(".hamburger-menu .menu-item-has-children").on("click", function (e) {
      if ($(this).hasClass("opened")) {
        $(this).removeClass("opened");
        return true;
      } else {
        e.preventDefault();
        $(this).addClass("opened");
      }
    });

    $(".hamburger-menu .menu-item-has-children .sub-menu").on("click", function (e) {
      e.stopPropagation();
    });
  }

  // if (window.screen.width <= 992) {
  //   searchForm("search-form-mobile");
  // } else {
  //   searchForm("search-form");
  // }

  // function searchForm(id_form) {
  //   if (id_form != "search-form-mobile") {
  //     $("." + id_form).submit(function (e) {
  //       let data = {
  //         action: "search_results",
  //         s: $(this).find("input").val(),
  //         trigger: "button",
  //       };
  //       $.ajax({
  //         url: "/wp-admin/admin-ajax.php",
  //         type: "POST",
  //         data: data,
  //         success: function (html) {},
  //       });
  //     });
  //   } else {
  //     $("." + id_form).keypress(function (event) {
  //       let keycode = event.keyCode ? event.keyCode : event.which;
  //       if (keycode == "13") {
  //         let data = {
  //           action: "search_results",
  //           s: $(this).find("input").val(),
  //           trigger: "button",
  //         };
  //         $.ajax({
  //           url: "/wp-admin/admin-ajax.php",
  //           type: "POST",
  //           data: data,
  //           success: function (html) {},
  //         });
  //       }
  //     });
  //   }

  //   $body.on("click", ".search-results-more", function (e) {
  //     let data = {
  //       action: "search_results",
  //       s: $("." + id_form)
  //         .find("input")
  //         .val(),
  //       trigger: "view_all",
  //     };
  //     $.ajax({
  //       url: "/wp-admin/admin-ajax.php",
  //       type: "POST",
  //       data: data,
  //       success: function (html) {},
  //     });
  //   });

  //   $body.on("click", ".search-results-item", function (e) {
  //     let data = {
  //       action: "search_results",
  //       s: $("." + id_form)
  //         .find("input")
  //         .val(),
  //       trigger: "article",
  //       article_url: $(this).find(".title-wrap a").attr("href"),
  //     };
  //     $.ajax({
  //       url: "/wp-admin/admin-ajax.php",
  //       type: "POST",
  //       data: data,
  //       success: function (html) {},
  //     });
  //   });
  // }

  if ($body.hasClass("home")) {
    // Simetri reports slider on homepage
    let $slider = $(".simetri-reports-slider, .project-spotlight-slider");
    if ($slider.length) {
      $slider.slick({
        slidesToShow: 4,
        infinite: false,
        arrows: true,
        appendArrows: $(
          ".simetri-reports-slider-nav, .project-spotlight-slider-nav"
        ),
        prevArrow:
          '<button class="btn btn-prev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7071 15.2929C14.0976 15.6834 14.0976 16.3166 13.7071 16.7071C13.3166 17.0976 12.6834 17.0976 12.2929 16.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L12.2929 7.29289C12.6834 6.90237 13.3166 6.90237 13.7071 7.29289C14.0976 7.68342 14.0976 8.31658 13.7071 8.70711L10.4142 12L13.7071 15.2929Z" fill="#0D2B3E"/></svg></button>',
        nextArrow:
          '<button class="btn btn-next"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.2929 8.70711C9.90237 8.31658 9.90237 7.68342 10.2929 7.29289C10.6834 6.90237 11.3166 6.90237 11.7071 7.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L11.7071 16.7071C11.3166 17.0976 10.6834 17.0976 10.2929 16.7071C9.90237 16.3166 9.90237 15.6834 10.2929 15.2929L13.5858 12L10.2929 8.70711Z" fill="#0D2B3E"/></svg></button>',
        responsive: [
          {
            breakpoint: 1220,
            settings: {
              slidesToShow: 4,
            },
          },
          {
            breakpoint: 1002,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 592,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 400,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      });
    }

    // Fix markup for low zoom
    let zoom_pct = detectZoom();
    if (zoom_pct === 25) {
      $(".group-news").addClass("zoomed");
    } else {
      $(".group-news").removeClass("zoomed");
    }

    $(window).resize(function () {
      let zoom_pct = detectZoom();
      if (zoom_pct === 25) {
        $(".group-news").addClass("zoomed");
      } else {
        $(".group-news").removeClass("zoomed");
      }
    });
  }

  // Sticky banner close button
  $(".ad-sticky-banner.bottom .close-button").on("click", function (e) {
    $(".ad-sticky-banner.bottom").remove();
  });

  // $(document).on("click", ".social-icon", function () {
  //   const $that = $(this);
  //   $.ajax({
  //     type: "POST",
  //     url: "/wp-admin/admin-ajax.php",
  //     dataType: "json",
  //     data: {
  //       action: "cb_jx_statistic_for_social_media_shares_buttons",
  //       social_id: $that.attr("data-id"),
  //       post_id: $that.closest(".article-wrapper").attr("data-id"),
  //     },
  //   });
  // });

  // Login/Signup popup
  if ($('.xoo-el-container').length) {
    $('.show-subscribe-form').on('click', function () {
      $('.xoo-el-reg-tgr').trigger('click');
    });
    $('.show-signin-form').on('click', function () {
      $('.xoo-el-login-tgr').trigger('click');
    });

    // // Detect background
    // const authPopupBackgrounds = [
    //   /* old bg
    //   'https://static.cryptobriefing.com/wp-content/uploads/2022/07/26035048/background_1.jpeg',
    //   'https://static.cryptobriefing.com/wp-content/uploads/2022/07/26035141/background_2.jpg',
    //   'https://static.cryptobriefing.com/wp-content/uploads/2022/07/26035144/background_3.jpg',
    //   'https://static.cryptobriefing.com/wp-content/uploads/2022/07/26035147/background_4.jpg',
    //   'https://static.cryptobriefing.com/wp-content/uploads/2022/07/26035150/background_5.jpg',
    //    */
    //   'https://static.cryptobriefing.com/wp-content/uploads/2022/10/17073134/login-woman.jpg'
    // ];
    // const backgroundImg = authPopupBackgrounds[getRandomInt(authPopupBackgrounds.length)]
    // $('.xoo-el-sidebar').css('background-image', `url(${backgroundImg})`);

    // Overlay on form processing
    $('.xoo-el-container .xoo-el-action-form').append('<div class="auth-overlay"></div>');

    $('.xoo-el-action-form').on('submit', function () {
      $('.auth-overlay').show();
    });

    $(document.body).on('xoo_el_form_submitted', function (e, response, $form) {
      const $section = $('.xoo-el-container .xoo-el-section.xoo-el-active');
      const formType = $section.attr('data-section');

      if (response.error || formType === 'lostpw') {
        $('.auth-overlay').hide();
      } else if (formType === 'resetpw') {
        // Automatically open login form if reset is successful and show the message
        const notice = $section.find('.xoo-el-notice').html();
        $('.xoo-el-login-tgr').trigger('click');
        $('.xoo-el-section[data-section="login"] .xoo-el-notice').html(notice).show();
        $('.auth-overlay').hide();
      }
    })
  }
});

// Helpers
function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function deviceType() {
  const ua = navigator.userAgent;

  if (ua.match(/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i)) {
    return "tablet";
  } else if (
    ua.match(
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i
    )
  ) {
    return "mobile";
  } else {
    return "desktop";
  }
}

function formatDates($) {
  $("time.timeago.should-format").timeago();
  setTimeout(function () {
    $(".date-wrap").addClass("formatted");
  });
}

function isValidEmail(email) {
  let regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

function detectZoom() {
  var screenWidth = screen.width;
  var windowWidth = window.innerWidth;

  if (windowWidth != screenWidth) {
    var zoomOutPoints = [25, 33, 50, 67, 75, 80, 90];
    var zoomInPoints = [110, 125, 150, 175];
    var percentDifference = Math.ceil((screenWidth / windowWidth) * 100);

    return percentDifference;
  }

  return 0;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Observers
let adsObserver = initAdsObserver();

// Observes when to track view/click on ad banners
function initAdsObserver() {
  let adsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        trackAIBanner(jQuery(entry.target), false);
        jQuery(entry.target).on("click", function () {
          trackAIBanner(jQuery(entry.target), true);
        });
        adsObserver.unobserve(entry.target);
      }
    });
  });

  return adsObserver;
}

function waitForElement(querySelector, timeout) {
  return new Promise((resolve, reject) => {
    var timer = false;
    if (document.querySelectorAll(querySelector).length) return resolve();
    const observer = new MutationObserver(() => {
      if (document.querySelectorAll(querySelector).length) {
        observer.disconnect();
        if (timer !== false) clearTimeout(timer);
        return resolve();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    if (timeout)
      timer = setTimeout(() => {
        observer.disconnect();
        reject();
      }, timeout);
  });
}

// Tracks ad banner view/click
function trackAIBanner(banner, is_click) {
  is_click = is_click || false;
  if (banner.length) {
    // Native ad data
    const na_data = jQuery(banner).attr("data-na_id");
    if (na_data) {
      let location = "";
      if (jQuery(banner).attr("data-na_location")) {
        location = jQuery(banner).attr("data-na_location");
      } else if ($body.hasClass("home")) {
        location = "home";
      } else if ($body.hasClass("tag")) {
        location = "tag";
      } else if ($body.hasClass("tax-coins")) {
        location = "coin";
      } else if ($body.hasClass("category")) {
        location = "category";
      }

      jQuery.post(cb_loadmore_params.ajaxurl, {
        action: "cb_native_ad_track",
        native_ad_id: jQuery(banner).attr("data-na_id"),
        location: location,
        is_click: is_click,
      });
    }

    // Category ad data
    const category_ad_id = jQuery(banner).attr("data-category_ad_id");
    if (category_ad_id) {
      jQuery.post(cb_loadmore_params.ajaxurl, {
        action: "cb_category_ad_track",
        category_ad_id: category_ad_id,
        position: jQuery(banner).attr("data-position"),
        is_click: is_click,
      });
    }
  }
}

function setSignupBoxBackgroundImage(image) {
  waitForElement(".widget-newsletter-form", 15000)
    .then(function () {
      jQuery(".nf-wrapper")
        .css("background-image", "url(" + image.src + ")")
        .addClass(image.is_vertical ? "vertical" : "");
    })
    .catch(() => {
      // console.error("CB: Newsletter box did not load in 15 seconds");
    });
}

function getDynamicContent(context, currentPost) {
  const $ = jQuery;

  // currentPost = currentPost || null;

  // let retrievedFragments = ['auth_buttons'];

  // switch (context) {
  //   case 'home':
  //     // retrievedFragments.push('nf_background_image');
  //     // retrievedFragments.push('native_ad_list');
  //     break;

  //   case 'post':
  //     // retrievedFragments.push('nf_background_image');
  //     // retrievedFragments.push('native_ad_widget');
  //     // retrievedFragments.push('native_ad_recommended');

  //     // const category_ad_sov = Math.floor(Math.random() * 100) + 1;
  //     // if (category_ad_sov <= 40) {
  //     //   retrievedFragments.push('category_ad');
  //     //   $(".sponsorship-banner-top", currentPost).addClass("skeleton-loader");
  //     //   $(".sponsorship-banner-bottom", currentPost).addClass("skeleton-loader");
  //     // }
  //     break;
  // }

  // if (!$('body').hasClass('logged-in')) {
  //   $('.header-auth').html(`<a href="javascript:;" class="xoo-el-login-tgr" title="Sign In"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 -256 1792 1792"><g transform="matrix(1,0,0,-1,197.42373,1300.6102)"><path d="M 1408,131 Q 1408,11 1335,-58.5 1262,-128 1141,-128 H 267 Q 146,-128 73,-58.5 0,11 0,131 0,184 3.5,234.5 7,285 17.5,343.5 28,402 44,452 q 16,50 43,97.5 27,47.5 62,81 35,33.5 85.5,53.5 50.5,20 111.5,20 9,0 42,-21.5 33,-21.5 74.5,-48 41.5,-26.5 108,-48 Q 637,565 704,565 q 67,0 133.5,21.5 66.5,21.5 108,48 41.5,26.5 74.5,48 33,21.5 42,21.5 61,0 111.5,-20 50.5,-20 85.5,-53.5 35,-33.5 62,-81 27,-47.5 43,-97.5 16,-50 26.5,-108.5 10.5,-58.5 14,-109 Q 1408,184 1408,131 z m -320,893 Q 1088,865 975.5,752.5 863,640 704,640 545,640 432.5,752.5 320,865 320,1024 320,1183 432.5,1295.5 545,1408 704,1408 863,1408 975.5,1295.5 1088,1183 1088,1024 z"/></g></svg>Sign In</a>`);
  // }
  // } else {
  //   $.get(
  //     "/wp-admin/admin-ajax.php",
  //     {
  //       action: "cb_jx_get_page_fragments_cache",
  //       url_path: window.location.pathname,
  //       retrieved_fragments: retrievedFragments
  //     },
  //     function (json) {
  //       const isUserLoggedIn = json.hasOwnProperty('is_user_logged_in') && json.is_user_logged_in;
  //       const authButtonsRetrieved = json.hasOwnProperty('auth_buttons') && json.auth_buttons;
  //       const nfBackgroundImageRetrieved = json.hasOwnProperty("nf_background_image") && json.nf_background_image;
  //       const nativeAdListRetrieved = json.hasOwnProperty("native_ad_list") && json.native_ad_list;
  //       const nativeAdWidgetRetrieved = json.hasOwnProperty("native_ad_widget") && json.native_ad_widget;
  //       const nativeAdRecommendedRetrieved = json.hasOwnProperty("native_ad_recommended") && json.native_ad_recommended;
  //       const categoryAdRetrieved = json.hasOwnProperty("category_ad") && json.category_ad;

  //       if (isUserLoggedIn) {
  //         $('.header-auth').removeClass('guest');
  //       } else {
  //         $('.header-auth').addClass('guest');
  //       }

  //       if (authButtonsRetrieved) {
  //         $('.header-auth').html(json.auth_buttons);
  //       }

  //       if (isUserLoggedIn && $('.widget_cb_widget_newsletter_form').length) {
  //         $('.widget_cb_widget_newsletter_form').closest('.sidebar-item').addClass('cb-hide');
  //       } else if (nfBackgroundImageRetrieved) {
  //         setSignupBoxBackgroundImage(json.nf_background_image);
  //       }

  //       if (context === 'home' && nativeAdListRetrieved) {
  //         $(".group-news .main-news-list .na-placeholder").replaceWith(json.native_ad_list);
  //       }

  //       if (context === 'post') {
  //         if (nativeAdWidgetRetrieved) {
  //           $(".widget-na-sidebar .widget-content .skeleton-loader").hide();
  //           $(".widget-na-sidebar .widget-content .posts-list", currentPost).html(json.native_ad_widget);
  //         }

  //         if (nativeAdRecommendedRetrieved) {
  //           $(".recommended-posts .na-placeholder", currentPost).replaceWith(json.native_ad_recommended);
  //         }

  //         if (categoryAdRetrieved) {
  //           $(".sponsorship-banner-top", currentPost).removeClass("skeleton-loader").html($(json.category_ad).find(".article-sponsorship-header"));
  //           $(".sponsorship-banner-bottom", currentPost).removeClass("skeleton-loader").html($(json.category_ad).find(".article-sponsorship-footer"));
  //         }
  //       }
  //     },
  //     "json"
  //   ).then(function () {
  //     // Native ad (in posts list) tracking
  //     if (retrievedFragments.includes('native_ad_list')) {
  //       const native_ad = $(".main-news-list .na-item");
  //       if (native_ad) {
  //         adsObserver.observe(native_ad[0]);
  //       }
  //     }

  //     // Native ad (in widget) tracking
  //     if (retrievedFragments.includes('native_ad_widget')) {
  //       const native_ad = $(".widget-na-sidebar .widget-content .posts-list", currentPost).find(".na-item");
  //       if (native_ad) {
  //         adsObserver.observe(native_ad[0]);
  //       }
  //     }

  //     // Native ad (in recommended section) tracking
  //     if (retrievedFragments.includes('native_ad_recommended')) {
  //       const native_ad = $(".recommended-posts .posts-list", currentPost).find(".na-item");
  //       if (native_ad) {
  //         adsObserver.observe(native_ad[0]);
  //       }
  //     }

  //     // Category ads tracking
  //     if (retrievedFragments.includes('category_ad')) {
  //       const category_ads = $(".category-sponsorship-ad", currentPost);
  //       if (category_ads.length) {
  //         category_ads.each(function (key, ad) {
  //           adsObserver.observe(ad);
  //         });
  //       }
  //     }
  //   });
  // }
}