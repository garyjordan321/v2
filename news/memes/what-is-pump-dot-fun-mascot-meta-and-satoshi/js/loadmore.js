jQuery(function ($) {
    let isLoading = false;
    const loadedPostsLocations = {};

    // Init things for posts load on button click
    $(document).on('click', '.js-load-more', function () {
        const spinnerWrapper = $('.container .loadmore-btn-wrap');
        const loadmoreContainer = spinnerWrapper.closest('.loadmore-container-wrapper').find('.loadmore-container');
        const button = $(this);

        if (!isLoading) {
            isLoading = true;

            jxPostsLoadmore(spinnerWrapper, loadmoreContainer, button).then(function (json) {
                if (json.hasOwnProperty('html') && json.html) {
                    const mrecs = $(document).find('.sidebar-info.extra').last().find('.code-block');
                    if (mrecs) {
                        mrecs.each(function (key, ad) {
                            adsObserver.observe(ad);
                        });
                    }

                    const native_ads = $(document).find('.main-news').last().find('.na-item');
                    if (native_ads) {
                        native_ads.each(function (key, ad) {
                            adsObserver.observe(ad);
                        });
                    }
                }

                isLoading = false;
            });
        }
    });

    // Init things for single post load on scroll
    if (isPostPage) {
        // getPageYForSidebar();

        if (!$body.hasClass('cb-loadmore-off')) {
            let changeUrlObserver = initChangeUrlObserver();
            let postViewObserver = initPostViewObserver();
            initLoadmoreObserver(changeUrlObserver, postViewObserver, adsObserver);
        }
    }

    // Load post(s) via ajax
    function jxPostsLoadmore(spinnerWrapper, loadmoreContainer, button, currentPost) {
        let spinner = null;
        if (typeof spinnerWrapper !== 'undefined') {
            spinner = spinnerWrapper.find('.loadmore-spinner');
        }

        currentPost = currentPost || null;

        const data = {
            action: 'cb_jx_posts_loadmore',
            cb_nonce: cb_loadmore_params.cb_nonce,
            query_vars: cb_loadmore_params.query_vars,
            is_single: cb_loadmore_params.is_single,
            is_archive: cb_loadmore_params.is_archive,
            is_author: cb_loadmore_params.is_author,
            is_search: cb_loadmore_params.is_search,
            is_home: cb_loadmore_params.is_home,
            page: cb_loadmore_params.current_page,
            queried_object_id: cb_loadmore_params.queried_object_id,
        };

        if (cb_loadmore_params.is_single && currentPost) {
            data.queried_object_id = currentPost.data('id');
        }

        return $.ajax({
            url: cb_loadmore_params.ajaxurl,
            data: data,
            type: 'POST',
            dataType: 'json',
            beforeSend: function () {
                if (spinner) {
                    spinner.show();
                }

                if (typeof button !== 'undefined' && button) {
                    button.hide();
                }
            },
            success: function (json) {
                if (spinner) {
                    spinner.hide();
                }

                let isLastPage = false;
                if (json.hasOwnProperty('html') && json.html) {
                    // spinnerWrapper.before(json.html);
                    loadmoreContainer.append(json.html);
                    cb_loadmore_params.current_page++;
                    formatDates($);

                    isLastPage = parseInt(cb_loadmore_params.current_page) === parseInt(cb_loadmore_params.max_page);
                }

                if (typeof button !== 'undefined' && button) {
                    if (isLastPage) {
                        button.remove();
                    } else {
                        button.show();
                    }
                }
            }
        });
    }

    // Observes when to load new post via ajax (on scroll)
    function initLoadmoreObserver(changeUrlObserver, postViewObserver, adsObserver) {
        let loadmoreObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spinnerWrapper = $(entry.target);
                    const loadmoreContainer = spinnerWrapper.closest('.loadmore-container-wrapper').find('.loadmore-container');
                    const currentPost = $('.page-content-main .article-wrapper:last');

                    if (!isLoading) {
                        isLoading = true;

                        jxPostsLoadmore(spinnerWrapper, loadmoreContainer, null, currentPost).then(function(json) {
                            if (json.hasOwnProperty('html') && json.html) {
                                const loadedPost = $('.page-content-main .article-wrapper:last');
                                const postContent = loadedPost.find('.article-content')[0];

                                changeUrlObserver.observe(postContent);
                                postViewObserver.observe(postContent);

                                const ads = loadedPost.find('.code-block, .recommended-posts .post-item.na-item, .ad-container, .widget-recommended-news .item.na-item');
                                ads.each(function (key, ad) {
                                    adsObserver.observe(ad);
                                });

                                isLoading = false;
                            }
                        });
                    }
                }
            });
        }, { threshold : 0.1 });

        loadmoreObserver.observe($('.page-content-main .loadmore-btn-wrap')[0]);

        return loadmoreObserver;
    }

    // Observes page url changes on scroll
    function initChangeUrlObserver() {
        let changeUrlObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const post = $(entry.target).closest('.article-wrapper');
                    const postId = post.data('id');

                    if (!loadedPostsLocations.hasOwnProperty(postId)) {
                        const el = document.createElement('a');
                        el.href = post.data('url');
                        if (!el.search && window.location.search) {
                            el.search = window.location.search;
                        }
                        loadedPostsLocations[postId] = el;
                    }

                    const currentLocation = loadedPostsLocations[postId];

                    const path = currentLocation.pathname + currentLocation.search;
                    const title = post.find('h1.title').text();

                    // Change page url
                    if (window.history.pushState && currentLocation.href !== window.location.href) {
                        document.title = title;
                        setTimeout(function () {
                            window.history.pushState(null, title, path);
                        }, 10);
                    }
                }
            });
        }, { threshold: [0.1, 0.5, 1.0] });

        // Initial article observer
        const initialArticle = $('.page-content-main .article-wrapper:first .article-content')[0];
        if (initialArticle) {
            changeUrlObserver.observe(initialArticle);
        }

        return changeUrlObserver;
    }

    // Observes when to count page view on the ajax-loaded article
    function initPostViewObserver() {
        let postViewObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const post = $(entry.target).closest('.article-wrapper');
                    trackGAPostView(post.data('url'), post.data('path'), post.data('title'));
                    trackPVCPostView(post.data('id'));
                    postViewObserver.unobserve(entry.target);
                }
            });
        });

        return postViewObserver;
    }

    // Tracks Google Analytics page view
    function trackGAPostView(url, path, title) {
        if (window.dataLayer) {
            window.dataLayer.push({
                event : 'jxPageview',
                jxLocation : `${url}?utm_source=jxLoadmoreArticle&utm_medium=cryptobriefing.com`,
                jxPath : path,
                jxTitle: title
            });
        }
    }

    // Tracks WP page view
    function trackPVCPostView(postId) {
        if (!cb_loadmore_params.pvc.is_enabled) {
            return;
        }

        let data;
        if (cb_loadmore_params.pvc.is_pro) {
            data = {
                subtype: 'post',
                storage_type: 'cookies',
                storage_data: '',
                action: 'pvcp-check-post',
                pvcp_nonce: cb_loadmore_params.pvc.nonce,
                content: postId,
                type: 'post'
            };
        } else {
            data = {
                storage_type: 'cookies',
                storage_data: '',
                action: 'pvc-check-post',
                pvc_nonce: cb_loadmore_params.pvc.nonce,
                id: postId
            };
        }

        $.ajax({
            url: cb_loadmore_params.pvc.ajaxurl,
            type: 'post',
            async: true,
            cache: false,
            data: data
        }).done(function (response) {
            // trigger pvcCheckPost event
            $.event.trigger({
                type: 'pvcCheckPost',
                detail: response
            });
        });
    }
});