jQuery(function ($) {
  let isLoading = false;
  let newsbriefsLoadmoreObserver = null;
  initNewsbriefsLoadmoreObserver();
  formatNewsbriefsDates();
  initializeMessageToggles();

  if ($('.main-newsbriefs-item.selected').length) {
    $.ajax({
      url: cb_newsbriefs.ajax_url,
      type: 'POST',
      data: {
        action: 'cb_jx_track_newsbriefs_pageview',
        id: $('.main-newsbriefs-item.selected').data('id'),
        nonce: cb_newsbriefs.nonce
      }
    });
  }

  $(document).on('click', '.main-newsbriefs-item .main-newsbriefs-link', function () {
    $.ajax({
      url: cb_newsbriefs.ajax_url,
      type: 'POST',
      data: {
        action: 'cb_jx_track_newsbriefs_click',
        id: $(this).closest('.main-newsbriefs-item').data('id'),
        nonce: cb_newsbriefs.nonce
      }
    });
  });

  function setupToggle(expandLink, collapseLink, message, fadeOut) {
    if (expandLink.dataset.initialized) {
      return;
    }

    function expandMessage() {
      message.classList.add('message-expanded');
      expandLink.style.display = 'none';
      collapseLink.style.display = 'inline-block';
      fadeOut.style.display = 'none';
    }

    function collapseMessage() {
      message.classList.remove('message-expanded');
      expandLink.style.display = 'inline-block';
      collapseLink.style.display = 'none';
      fadeOut.style.display = 'block';
    }

    expandLink.addEventListener('click', expandMessage);
    collapseLink.addEventListener('click', collapseMessage);

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      message.addEventListener('click', () => {
        if (message.classList.contains('message-expanded')) {
          collapseMessage();
        } else {
          expandMessage();
        }
      });
    }

    expandLink.dataset.initialized = 'true';
  }

  function shouldDisplayExpand(message) {
    const currentHeight = message.scrollHeight;
    const restrictedHeight = 66;
    return currentHeight > restrictedHeight;
  }

  function initializeMessageToggles() {
    const messageBlocks = document.querySelectorAll('.main-newsbriefs-item:not(.selected) .main-newsbriefs-message');
    const expandLinks = document.querySelectorAll('.expand-link');
    const collapseLinks = document.querySelectorAll('.collapse-link');
    const fadeOuts = document.querySelectorAll('.fade-out');

    messageBlocks.forEach((message, i) => {
      if (shouldDisplayExpand(message) && !expandLinks[i].dataset.initialized) {
        setupToggle(expandLinks[i], collapseLinks[i], message, fadeOuts[i]);
        expandLinks[i].style.display = 'inline-block';
        fadeOuts[i].style.display = 'block';
      } else if (!expandLinks[i].dataset.initialized) {
        expandLinks[i].style.visibility = 'hidden';
        collapseLinks[i].style.visibility = 'hidden';
        fadeOuts[i].style.visibility = 'hidden';
      }
    });
  }

  function formatNewsbriefsDates() {
    const times = document.querySelectorAll('.widget-newsbriefs time, .main-newsbriefs-item time');
    times.forEach(function (elem) {
        const utcTime = elem.getAttribute('datetime');
        const options = {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        const locale = $('html').attr('lang');
        let localTime = new Date(utcTime).toLocaleString(locale, options);
        if ('es' === locale) {
          localTime = localTime.replace(/(\d+)\s(\w+),/, (match, p1, p2) => `${p1} ${p2.charAt(0).toUpperCase() + p2.slice(1)},`);
          localTime = localTime.replace(/a\.\sm\./, 'AM');
          localTime = localTime.replace(/p\.\sm\./, 'PM');
        }
        elem.textContent = localTime;
    });
  }
  
  function initNewsbriefsLoadmoreObserver() {
    newsbriefsLoadmoreObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading) {
          isLoading = true;

          const spinnerWrapper = $(entry.target);
          let loadmoreContainer = null,
              spinner = null,
              offset = 0;

          const isWidgetContext = spinnerWrapper.closest('.widget-newsbriefs').length;

          if (isWidgetContext) {
            const wrapper = spinnerWrapper.closest('.widget-content');
            loadmoreContainer = wrapper.find('.newsbriefs-loadmore-container');
            spinner = wrapper.find('.newsbriefs-loadmore-spinner');
            offset = wrapper.find('.item').length;
          } else {
            const wrapper = spinnerWrapper.closest('.main-newsbriefs');
            loadmoreContainer = wrapper.find('.newsbriefs-loadmore-container');
            spinner = wrapper.find('.newsbriefs-loadmore-spinner');
            offset = loadmoreContainer.find('.main-newsbriefs-item').length;
          }

          if (spinner) {
            spinner.show();
          }

          var data = {
            action: 'cb_jx_get_newsbriefs',
            offset: offset,
            is_widget: isWidgetContext ? 1 : 0
          };

          $.ajax({
            url: '/wp-admin/admin-ajax.php',
            type: 'GET',
            dataType: 'json',
            data: data,
            success: function (json) {
              if (spinner) {
                spinner.hide();
              }
    
              isLoading = false;
    
              if (json.data.html) {
                loadmoreContainer.append(json.data.html);
                formatNewsbriefsDates();
                initializeMessageToggles();
              } else {
                newsbriefsLoadmoreObserver.unobserve(entry.target);
              }
            }
          });
        }
      });
    }, { threshold : 0.1 });

    if ($('.widget-newsbriefs .newsbriefs-loadmore-btn-wrap').length) {
      newsbriefsLoadmoreObserver.observe($('.widget-newsbriefs .newsbriefs-loadmore-btn-wrap')[0]);
    }

    if ($('.main-newsbriefs .newsbriefs-loadmore-btn-wrap').length) {
      newsbriefsLoadmoreObserver.observe($('.main-newsbriefs .newsbriefs-loadmore-btn-wrap')[0]);
    }

    return newsbriefsLoadmoreObserver;
  }
});