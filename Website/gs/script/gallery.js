/* TO MODIFY: Make changes to this file and test locally under the Debug compilation configuration. When
finished, run this text through a javascript minifier and copy the output to lib.min.js.
There is an online minifier at http://gpbmike.github.io/refresh-sf/. */
var Gs;
(function (Gs) {
    var $ = jQuery;
    //#region Gallery-wide functions
    /**
    * A container for variables that can be used throughout the Gs module.
    * @module Vars
    */
    var Vars;
    (function (Vars) {
        // Not seen here is the dynamic property having the same name as the client ID of the div tag holding this gallery.
        // By default it is 'gsp_g' and it contains two properties: gsData: GalleryData and gsAlbumTreeData (object that can be fed to jsTree).
        // One can access these properties using bracket notation: var data = Gs.Vars[clientId].gsData
        /**
        * Get the path, relative to the web site root, to the current web application. Does not include the containing page
        * or the trailing slash. Example: If GS is installed at C:\inetpub\wwwroot\dev\gallery, and C:\inetpub\wwwroot\ is
        * the parent web site, this property returns /dev/gallery. This is assigned in GalleryPage.AddGlobalStartupScript
        * and ultimately comes from Utils.AppRoot on the server.
        */
        Vars.AppRoot = '';
        /**
         * Gets the URL to the current web application. Does not include the containing page or the trailing slash.
         * Example: If the gallery is installed in a virtual directory 'gallery' on domain 'www.site.com', this returns 'http://www.site.com/gallery'.
         */
        Vars.AppUrl = '';
        /**
        * Gets the path, relative to the current application, to the directory containing the Gallery Server resources such
        * as images, user controls, scripts, etc. This value is pulled from the AppSettings value "GalleryResourcesPath"
        * in web.config if present; otherwise it defaults to "gs". Examples: "gs", "GalleryServer\resources"
        * This is assigned in GalleryPage.AddGlobalStartupScript and ultimately comes from Utils.GalleryResourcesPath on the server.
        */
        Vars.GalleryResourcesRoot = '';
        /**
        * Gets a reference to the ID of a Microsoft Ajax Library component that implements IDisposable. Used to reference the
        * Silverlight component, if one is being used on the page to play a video or audio file.
        */
        Vars.msAjaxComponentId = '';
        /**
        * Gets a reference to the URL of the current page, with the hash tag removed.
        */
        Vars.href = '';
    })(Vars = Gs.Vars || (Gs.Vars = {}));
    /**
    * A container for functions that can be used throughout the Gs module.
    * @class Utils
    */
    var Utils = (function () {
        function Utils() {
        }
        /**
         * Replace apostrophes and quotation marks with their ASCII equivalents
         * @param value string
         * @returns {String} The escaped string
         */
        Utils.escape = function (value) { return value.replace(/\'/g, '&#39;').replace(/\"/g, '&quot;'); };
        /**
         * HTML encode a string. Note that this function will strip out extra whitespace, such as new lines and tabs.
         * @param value
         * @returns {string} The encoded string
         */
        Utils.htmlEncode = function (value) { return $('<div/>').text(value).html(); };
        /**
         * HTML decode a string.
         * @param value
         * @returns {string} The decoded string
         */
        Utils.htmlDecode = function (value) {
            return $('<div/>').html(value).text();
        };
        /**
         * Removes all HTML tags from the string. Also replaces apostrophes and quotation marks with their ASCII equivalents
         * @param value string
         * @returns {String} The string with HTML removed
         */
        Utils.removeHtmlTags = function (value) { return Utils.escape(value.replace(/(<[^<>]*>)/g, '')); };
        /**
         * Returns true when the current browser supports the checkValidity() function on form elements.
         */
        Utils.hasFormValidation = function () {
            return typeof document.createElement('input').checkValidity == 'function';
        };
        /**
         * Returns true when the user's screen is touch-enabled.
         */
        Utils.isTouchScreen = function () {
            // ReSharper disable once DoubleNegationOfBoolean
            return !!('ontouchstart' in window) || !!navigator.msMaxTouchPoints;
        };
        /**
         * Returns true for screens less than w px wide. See http://stackoverflow.com/questions/6850164
         */
        Utils.isWidthLessThan = function (w) {
            return window.matchMedia && window.matchMedia('(max-device-width: ' + w + 'px)').matches || screen.width <= w;
        };
        /**
         * Returns true for touch-enabled screens where only the center pane is visible. Gallery Server is hard-coded to show a single
         * pane for widths less than 750 pixels.
         */
        Utils.isSinglePaneTouchScreen = function () {
            return Utils.isTouchScreen() && Utils.isWidthLessThan(750);
        };
        /**
         * Get the width of the browser viewport. See http://stackoverflow.com/questions/3437786
         */
        Utils.getViewportWidth = function () {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        };
        /**
         * Get the height of the browser viewport. See http://stackoverflow.com/questions/3437786
         */
        Utils.getViewportHeight = function () {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        };
        /**
         * Returns true when obj is undefined, null, or an empty string.
         */
        Utils.isNullOrEmpty = function (obj) {
            if ((!obj && obj !== false) || !(obj.length > 0)) {
                return true;
            }
            return false;
        };
        /**
         * Performs a deep copy of the specified object.
         */
        Utils.deepCopy = function (o) {
            var copy = o, k;
            if (o && typeof o === 'object') {
                copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
                for (k in o) {
                    if (o.hasOwnProperty(k)) {
                        copy[k] = Utils.deepCopy(o[k]);
                    }
                }
            }
            return copy;
        };
        /**
         * Converts the album to an instance of GalleryItem.
         */
        Utils.convertAlbumToGalleryItem = function (a) {
            return { Id: a.Id, ParentId: a.ParentId, IsAlbum: true, MimeType: 0, ItemType: 3, NumAlbums: a.NumAlbums, NumMediaItems: a.NumMediaItems, Caption: a.Caption, Title: a.Title, ViewIndex: -1, Views: [] };
        };
        /**
         * Converts the media item to an instance of GalleryItem.
         */
        Utils.convertMediaItemToGalleryItem = function (m) {
            return { Id: m.Id, ParentId: m.AlbumId, IsAlbum: false, MimeType: m.MimeType, ItemType: m.ItemType, NumAlbums: 0, NumMediaItems: 0, Caption: '', Title: m.Title, ViewIndex: m.ViewIndex, Views: Utils.deepCopy(m.Views) };
        };
        /**
         * Gets a string representation of the item type.
         */
        Utils.getItemTypeDesc = function (itemType) {
            switch (itemType) {
                case Enums.ItemType.Album:
                    return 'Album';
                case Enums.ItemType.Image:
                    return 'Image';
                case Enums.ItemType.Audio:
                    return 'Audio';
                case Enums.ItemType.Video:
                    return 'Video';
                case Enums.ItemType.Generic:
                    return 'Generic';
                case Enums.ItemType.External:
                    return 'External';
                default:
                    return 'Unknown';
            }
        };
        /**
         * Finds the gallery item in data.Album.GalleryItems[] matching the specified ID and item type. Returns null if not found.
         */
        Utils.findGalleryItem = function (data, id, got) {
            if (data.Album != null && data.Album.GalleryItems != null)
                return $.grep(data.Album.GalleryItems, function (gi) { return (gi.Id === id && gi.ItemType === got); })[0];
            else
                return null;
        };
        /**
         * Finds the media item in data.Album.MediaItems[] matching the specified ID and - optionally - the item type. Returns null if not found.
         */
        Utils.findMediaItem = function (data, id, itemType) {
            if (data.Album != null && data.Album.MediaItems != null) {
                if (itemType == null)
                    return $.grep(data.Album.MediaItems, function (mi) { return (mi.Id === id); })[0];
                else
                    return $.grep(data.Album.MediaItems, function (mi) { return (mi.Id === id && mi.ItemType === itemType); })[0];
            }
            else
                return null;
        };
        /**
         * Finds the meta item in metaItems having the specified mTypeId. mTypeId maps to the MetadataItemName enumeration. Returns null if not found.
         */
        Utils.findMetaItem = function (metaItems, mTypeId) {
            return $.grep(metaItems, function (mi) { return mi.MTypeId === mTypeId; })[0] || null;
        };
        /**
         * Finds the meta item in metaItems having the specified id. Returns null if not found.
         */
        Utils.findMetaItemById = function (metaItems, id) {
            return $.grep(metaItems, function (mi) { return mi.Id === id; })[0] || null;
        };
        /**
         * Add the gallery items to the client-side data
         * @param data The gallery data to add the gallery items to.
         * @param gItems The gallery items to add to the gallery data.
         * CURRENTLY NOT USED (originally created when copying item to current album but came up with a different solution)
         */
        Utils.addGalleryItems = function (data, gItems) {
            $.each(gItems, function (indx, gi) {
                data.Album.GalleryItems.push(gi);
                data.Album.NumGalleryItems++;
                if (!gi.IsAlbum) {
                    data.Album.NumMediaItems++;
                }
            });
        };
        /**
         * Remove the gallery items from the client-side data
         * @param data The gallery data to remove the gallery items from.
         * @param gItems The gallery items to remove from the gallery data.
         */
        Utils.removeGalleryItems = function (data, gItems) {
            $.each(gItems, function (indx, gi) {
                // There is no guarantee that gItems are the same memory references as those in data.Album.GalleryItems,
                // (they won't be when we get here after deleting items), so we find the matching items in our data and remove those.
                var gi1 = Utils.findGalleryItem(data, gi.Id, gi.ItemType);
                if (gi1 != null) {
                    data.Album.GalleryItems.gspRemove($.inArray(gi1, data.Album.GalleryItems));
                    data.Album.NumGalleryItems--;
                    if (!gi.IsAlbum) {
                        data.Album.NumMediaItems--;
                    }
                }
            });
        };
        /**
         * Remove the media item from the data.Album.MediaItems[] array. Also updates the index of remaining media items in the array
         * and decrements the Album.NumGalleryItems and Album.NumMediaItems properties.
         * @param data The gallery data to remove the media item from.
         * @param mItem The media item to remove from the gallery data.
         */
        Utils.removeMediaItem = function (data, mItem) {
            var idx = $.inArray(mItem, data.Album.MediaItems);
            // Remove the media object at the specified index from the client data
            data.Album.MediaItems.gspRemove(idx);
            if (idx >= 0) {
                $.each(data.Album.MediaItems, function (indx, mo) {
                    mo.Index = indx + 1; // Re-assign the index values of each media object
                });
                data.Album.NumGalleryItems--;
                data.Album.NumMediaItems--;
                if (idx >= data.Album.MediaItems.length)
                    idx = data.Album.MediaItems.length - 1; // Deleted item was the last one; set index to 2nd to last one
                // Set current media item to the previous one so when we subsequently call showNextMediaObject we see the right one
                data.MediaItem = data.Album.MediaItems[idx - 1];
            }
            else
                data.MediaItem = null; // No more items in album; set to null. Calling code will detect and then redirect
        };
        /**
        * Get the requested view for the specified media item or gallery item. If the requested view is for the optimized version and
        * it does not exist, the original is returned; otherwise returns null when the requested size does not exist.
        * @param mediaItem An instance of MediaItem or GalleryItem
        * @param viewSize The size to be returned
        * @returns {DisplayObject}
        */
        Utils.getView = function (mediaItem, viewSize) {
            var orig = null;
            for (var i = 0; i < mediaItem.Views.length; i++) {
                if (mediaItem.Views[i].ViewSize === viewSize) {
                    return mediaItem.Views[i];
                }
                else if (mediaItem.Views[i].ViewSize === Enums.ViewSize.Original)
                    orig = mediaItem.Views[i];
            }
            return orig;
        };
        /**
        * Returns true if the specified media item or gallery item has the requested view; otherwise returns false.
        * @param mediaItem An instance of MediaItem or GalleryItem
        * @param viewSize The size to look for
        * @returns {boolean}
        */
        Utils.hasView = function (mediaItem, viewSize) {
            if (mediaItem.Views == null) {
                return false;
            }
            for (var i = 0; i < mediaItem.Views.length; i++) {
                if (mediaItem.Views[i].ViewSize === viewSize) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Gets the page ready to go by turning input form elements into buttons, configuring jsRender converters and helper functions,
         * and assigning a few variables.
         */
        Utils.Init = function () {
            // To reduce chance of namespace collision, define an alias to Cookies object (https://github.com/js-cookie/js-cookie)
            Vars.Cookies = Cookies.noConflict();
            $('.gsp_ns input:submit, .gsp_ns button').button();
            // Set up jsRender converters
            $.views.converters({
                getItemTypeDesc: function (itemType) { return Utils.getItemTypeDesc(itemType); },
                stripHtml: function (text) { return Utils.removeHtmlTags(text); }
            });
            $.views.helpers({
                htmlEscape: function (value) { return Utils.escape(value); },
                // Parses a string representing a date into a JavaScript Date object. See https://github.com/jquery/globalize
                parseDate: function (value, formats, culture) { return Globalize.parseDate(value, formats, culture); },
                // Parses a string representing a whole number in the given radix (10 by default). See https://github.com/jquery/globalize
                parseInt: function (value, radix, culture) { return Globalize.parseInt(value, radix, culture); },
                // Parses a string representing a floating point number in the given radix (10 by default). See https://github.com/jquery/globalize
                parseFloat: function (value, radix, culture) {
                    return Globalize.parseFloat(value, radix, culture);
                },
                // Find the meta item for the specified type, returning an object set to default values if not found.
                findMetaItem: function (metaItems, mTypeId) { return (Utils.findMetaItem(metaItems, mTypeId) || new MetaItem(mTypeId)); },
                /**
                 * Gets URL to album. When preserveTags=true, several known query string parameters are included if already present; otherwise they are stripped.
                 * Ex: http://localhost/default.aspx?tag=desert, http://localhost/default.aspx?aid=44
                 * @param albumId The ID of the album the URL should navigate to. If no album ID is applicable (e.g. virtual albums), specify Constants.IntMinValue.
                 * @param preserveTags Indicates whether several known query string parameters should be preserved in the resulting URL.
                 * @returns {string} An URL pointing to the album having ID albumId
                 */
                getAlbumUrl: function (albumId, preserveTags) { return Utils.GetAlbumUrl(albumId, preserveTags); },
                /**
                 * Gets URL to the album or media asset corresponding to the galleryItem parameter. When preserveTags=true, several known query
                 * string parameters are included if already present; otherwise they are stripped .
                 * Ex: http://localhost/default.aspx?aid=44, http://localhost/default.aspx?tag=desert&moid=23
                 * @param galleryItem The gallery item the URL should navigate to.
                 * @param preserveTags Indicates whether several known query string parameters should be preserved in the resulting URL.
                 * @returns {} An URL pointing to the album or media asset corresponding to the galleryItem parameter.
                 */
                getGalleryItemUrl: function (galleryItem, preserveTags) {
                    var qs = { aid: galleryItem.IsAlbum ? galleryItem.Id : null, moid: galleryItem.IsAlbum ? null : galleryItem.Id };
                    if (!preserveTags) {
                        // Generally we want to strip tags for albums and preserve them for MOs. This allows users to browse MOs
                        // within the context of their tag/people/search criteria.
                        qs.title = null;
                        qs.tag = null;
                        qs.people = null;
                        qs.search = null;
                        qs.latest = null;
                        qs.filter = null;
                        qs.rating = null;
                        qs.top = null;
                    }
                    return Utils.GetUrl(Vars.href, qs);
                },
                getView: function (galleryItem, viewSize) { return Utils.getView(galleryItem, viewSize); },
                /**
                 * Get URL to media item. When preserveTags=true, several known query string parameters are included if already present; otherwise they are stripped.
                 * Ex: http://localhost/default.aspx?tag=desert&moid=23
                 * @param mediaId The ID of the media asset the URL should navigate to.
                 * @param preserveTags Indicates whether several known query string parameters should be preserved in the resulting URL.
                 * @returns {string} An URL pointing to the media asset having ID mediaId
                 */
                getMediaUrl: function (mediaId, preserveTags) { return Utils.GetMediaUrl(mediaId, preserveTags); },
                /**
                 * Gets URL to page where album objects can be downloaded. Ex: http://localhost/default.aspx?g=task_downloadobjects&aid=45
                 * @param albumId The ID of the album.
                 * @returns {string} An URL to the album download page.
                 */
                getDownloadUrl: function (albumId) { return Utils.GetUrl(window.location.href, { g: 'task_downloadobjects', moid: null, aid: albumId }); },
                /**
                 * Gets URL to add objects page for current album. Ex: http://localhost/default.aspx?g=task_addobjects&aid=45
                 * @param galleryData The gallery data
                 * @returns {string} An URL to the add objects page.
                 */
                getAddUrl: function (galleryData) { return Utils.GetUrl(window.location.href, { g: 'task_addobjects', aid: galleryData.Album.Id }); },
                /**
                 * Gets URL to the specified page. Any existing query string parameters are removed except for the media or album ID. Ex: http://localhost/default.aspx?g=task_addobjects&aid=45
                 * @param pageId The name of the destination page. Maps to PageId enumeration. Ex: task_addobjects, mediaobject, album, admin_manageusers
                 * @param galleryData The gallery data
                 * @returns {string} An URL to the page.
                 */
                getPageUrl: function (pageId, galleryData) {
                    var qsParms = { title: null, tag: null, people: null, search: null, latest: null, filter: null, rating: null, top: null, aid: null, moid: null };
                    qsParms.g = pageId;
                    if (galleryData.MediaItem != null) {
                        qsParms.moid = galleryData.MediaItem.Id;
                    }
                    else if (galleryData.Album.Id > Constants.IntMinValue) {
                        qsParms.aid = galleryData.Album.Id;
                    }
                    return Utils.GetUrl(window.location.href, qsParms);
                },
                /**
                 * Indicates whether the current screen has touch capabilities.
                 * @returns {boolean} true when the screen is touch capable; otherwise false
                 */
                isTouchScreen: function (boolean) { return Utils.isTouchScreen(); },
                /**
                 * Indicates whether the current screen has a width smaller than the specified number of pixels.
                 * @param number The width, in pixels, to test.
                 * @returns {boolean} true when the screen is less than the specified width; otherwise false
                 */
                isWidthLessThan: function (width) { return Utils.isWidthLessThan(width); },
                /**
                * Indicates whether the current screen has touch capabilities with only the center pane visible. Gallery Server is hard-coded to show a single
                * pane for widths less than 750 pixels.
                * @returns {boolean} true when the screen is a single-pane touch screen; otherwise false
                */
                isSinglePaneTouchScreen: function (boolean) { return Utils.isSinglePaneTouchScreen(); }
            });
            // Gets reference to current URL with hash tag removed
            Vars.href = window.location.href.replace(/#\d+/, '');
            Utils.StoreParentFrameUrlInSession();
        };
        /**
         * Reload the current page with all existing query string parameters preserved except for 'msg', which is removed if present.
         */
        Utils.ReloadPage = function () {
            window.location.href = Utils.RemoveQSParm(window.location.href, 'msg');
        };
        /**
         * Get the HTML embed code that can be used to embed the specified media asset on a web page.
         */
        Utils.GetEmbedCode = function (mediaId) {
            var url = Utils.GetUrl(Vars.AppUrl + '/' + Vars.GalleryResourcesRoot + '/embed.aspx' + location.search, { aid: null, moid: mediaId });
            return "<iframe allowtransparency='true' frameborder='0' sandbox='allow-same-origin allow-forms allow-scripts' scrolling='auto' src='" + url + "' style='width:100%;height:100%'></iframe>";
        };
        /**
         * Gets URL to album. When preserveTags=true, several known query string parameters are included if already present; otherwise they are stripped
         * Ex: http://localhost/default.aspx?tag=desert, http://localhost/default.aspx?aid=44
         * @param albumId The ID of the album the URL should navigate to. If no album ID is applicable (e.g. virtual albums), specify Constants.IntMinValue.
         * @param preserveTags Indicates whether several known query string parameters should be preserved in the resulting URL.
         * @returns {string} An URL pointing to the album having ID albumId
         */
        Utils.GetAlbumUrl = function (albumId, preserveTags) {
            var qs = { aid: null, moid: null };
            if (!preserveTags) {
                qs.title = null;
                qs.tag = null;
                qs.people = null;
                qs.search = null;
                qs.latest = null;
                qs.filter = null;
                qs.rating = null;
                qs.top = null;
            }
            if (albumId > Constants.IntMinValue)
                qs.aid = albumId;
            return Utils.GetUrl(document.location.href, qs);
        };
        /**
         * Get URL to the album, using parent window location if the gallery is contained within an iframe. This is useful for generating a link to the
         * page containing the iframe rather than a "deep link" directly to the album that would be generated by GetAlbumUrl(). For example, if a page
         * gallery.html contains an iframe that points to the default gallery page (default.aspx), this function will return http://site.com/gallery.html?aid=X
         * It is expected that the admin creating the page will have code that passes the query string to the iframe source as described in the Admin Guide.
         * @param albumId The ID of the album the URL should navigate to. If no album ID is applicable (e.g. virtual albums), specify Constants.IntMinValue.
         * @returns {string} An URL pointing to the album having ID albumId
         */
        Utils.GetAlbumExternalUrl = function (albumId) {
            var qs = { aid: null, moid: null };
            if (albumId > Constants.IntMinValue)
                qs.aid = albumId;
            var url = document.location.href;
            if (Utils.GetParentFrameUrl() != null) {
                url = Utils.GetParentFrameUrl() + document.location.search;
            }
            return Utils.GetUrl(url, qs);
        };
        /**
        * Get URL to media item. When preserveTags=true, several known query string parameters are included if already present; otherwise they are stripped.
        * Ex: http://localhost/default.aspx?tag=desert&moid=23
        * @param mediaId The ID of the media asset the URL should navigate to.
        * @param preserveTags Indicates whether several known query string parameters should be preserved in the resulting URL.
        * @returns {string} An URL pointing to the media asset having ID mediaId
        */
        Utils.GetMediaUrl = function (mediaId, preserveTags) {
            var qs = { aid: null, moid: mediaId };
            if (!preserveTags) {
                // Generally we want to strip tags for albums and preserve them for MOs. This allows users to browse MOs
                // within the context of their tag/people/search criteria.
                qs.title = null;
                qs.tag = null;
                qs.people = null;
                qs.search = null;
                qs.latest = null;
                qs.filter = null;
                qs.rating = null;
                qs.top = null;
            }
            return Utils.GetUrl(document.location.href, qs);
        };
        /**
         * Get URL to the media asset, using parent window location if the gallery is contained within an iframe. This is useful for generating a link to the
         * page containing the iframe rather than a "deep link" directly to the asset that would be generated by GetMediaUrl(). For example, if a page
         * gallery.html contains an iframe that points to the default gallery page (default.aspx), this function will return http://site.com/gallery.html?moid=X
         * It is expected that the admin creating the page will have code that passes the query string to the iframe source as described in the Admin Guide.
        * @param mediaId The ID of the media asset the URL should navigate to.
        * @returns {string} An URL pointing to the media asset having ID mediaId
        */
        Utils.GetMediaExternalUrl = function (mediaId) {
            var qs = { aid: null, moid: mediaId };
            var url = document.location.href;
            if (Utils.GetParentFrameUrl() != null) {
                url = Utils.GetParentFrameUrl() + document.location.search;
            }
            return Utils.GetUrl(url, qs);
        };
        /**
         * If we're within an iframe, try to get the parent frame's URL and store it in session storage. The only way to get the URL is from document.referrer,
         * and that will only be accurate the first time the user goes to the page containing the iframe. Detect this and put it in session storage so we can
         * refer to it on subsequent page loads.
         */
        Utils.StoreParentFrameUrlInSession = function () {
            var isInIframe = (parent !== window);
            if (isInIframe) {
                var referrerNoQs = void 0;
                if (document.referrer.indexOf('?') >= 0) {
                    // Strip off query string so we have something like http://site.com/gallery.aspx
                    referrerNoQs = document.referrer.substring(0, document.referrer.indexOf('?'));
                }
                else {
                    referrerNoQs = document.referrer;
                }
                var curPageUrlNoQs = document.location.origin + document.location.pathname; // Current URL w/o query string e.g. http://site.com/gallery.aspx
                if (referrerNoQs !== curPageUrlNoQs) {
                    // Referrer is different page than the current one, so it is highly probably referrer is the parent frame URL. Store in session storage (supported in IE 8+).
                    if (sessionStorage) {
                        sessionStorage.setItem('parentFrameUrl', document.referrer);
                    }
                }
            }
            else if (sessionStorage) {
                // Handle the (admittedly rare) situation where a user navigates directly to the gallery after being on a page with an iframe to the gallery
                sessionStorage.removeItem('parentFrameUrl');
            }
        };
        /**
         * Get the URL to the page containing this gallery in an iframe. If this gallery is not in an iframe, return null.
         */
        Utils.GetParentFrameUrl = function () {
            return sessionStorage && sessionStorage.getItem('parentFrameUrl');
        };
        /**
         * Generate an URL from the url parameter and having the specified query string parameters. If 'url' contains the 'ss' or 'msg' parameters,
         * they are removed. Ex: http://localhost/default.aspx?tag=desert, http://localhost/default.aspx?aid=44
         * @param url The URL to use for modification. This is often assigned from document.location.href.
         * @param parmValuePairs A set of query string parameters to assign to the URL
         * @returns {string} Returns the url with updated query string parameters.
         */
        Utils.GetUrl = function (url, parmValuePairs) {
            if (typeof parmValuePairs.ss === 'undefined')
                parmValuePairs.ss = null; // auto-start slide show
            if (typeof parmValuePairs.msg === 'undefined')
                parmValuePairs.msg = null; // msg ID
            $.each(parmValuePairs, function (p, v) { url = Utils.AddQSParm(Utils.RemoveQSParm(url, p), p, v); });
            return url;
        };
        /**
         * Indicates whether the specified query string parameter is present on the URL for the current page.
         * @param param The query string parameter name.
         * @returns {boolean} true if parameter is present; otherwise false
         */
        Utils.IsQSParmPresent = function (param) {
            var qs = Utils.GetQS[param];
            return ((qs != null) && (qs.length > 0));
        };
        /**
         * Gets an object where its properties represent the query string parameters for the current page.
         * @returns {Object} An object containing string properties representing the query string parameters.
         */
        Utils.GetQS = function () {
            var result = {};
            var queryString = location.search.substring(1);
            var re = /([^&=]+)=([^&]*)/g;
            var m;
            while ((m = re.exec(queryString))) {
                result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }
            return result;
        };
        /**
         * Gets the value of the specified query string parameter. Returns undefined if the parameter is not present.
         * @param param The query string parameter name.
         * @returns {string} The query string parameter value.
         */
        Utils.GetQSParm = function (param) { return Utils.GetQS()[param]; };
        /**
         * Adds the specified query string name and value to the URL.
         * @param url The URL to add the query string value to
         * @param param The query string parameter name.
         * @param value The query string parameter value.
         * @returns {string} The updated URL.
         */
        Utils.AddQSParm = function (url, param, value) {
            if (!param || !value)
                return url;
            param = encodeURIComponent(param);
            value = encodeURIComponent(value);
            var urlparts = url.split('?');
            if (urlparts.length < 2)
                return url + '?' + param + '=' + value;
            var kvp = urlparts[1].split(/[&;]/g);
            var i;
            for (i = kvp.length - 1; i >= 0; i--) {
                var x = kvp[i].split('=');
                if (x[0] === param) {
                    x[1] = value;
                    kvp[i] = x.join('=');
                    break;
                }
            }
            if (i < 0) {
                kvp[kvp.length] = [param, value].join('=');
            }
            return urlparts[0] + '?' + kvp.join('&');
        };
        /**
         * Removes the specified query string name from the URL.
         * @param url The URL to remove the query string value from
         * @param param The query string parameter name.
         * @returns {string} The updated URL.
         */
        Utils.RemoveQSParm = function (url, param) {
            var urlparts = url.split('?');
            if (urlparts.length < 2)
                return url;
            var prefix = encodeURIComponent(param) + '=';
            var pars = urlparts[1].split(/[&;]/g);
            for (var i = pars.length - 1; i >= 0; i--)
                if (pars[i].lastIndexOf(prefix, 0) !== -1)
                    pars.splice(i, 1);
            if (pars.length > 0)
                return urlparts[0] + '?' + pars.join('&');
            else
                return urlparts[0];
        };
        /**
         * Disposes the Microsoft Ajax Library component having the specified ID. Used to clean up resources when Silverlight
         * media assets are rendered on the page. No action is taken if no current component is active or if ID is null or an empty string.
         * @param id The ID of the Microsoft Ajax Library component
         */
        Utils.DisposeAjaxComponent = function (id) {
            if (typeof Sys === 'undefined' || typeof Sys.Application === 'undefined')
                return;
            if (id && id.length > 0) {
                var obj = Sys.Application.findComponent(id);
                if (obj)
                    obj.dispose();
            }
        };
        /**
         * Highlight the text in the element. Use this to select text in contentEditable elements such as those used in tinyMCE.
         * Inspired from http://stackoverflow.com/questions/6139107/
         */
        Utils.selectElementContents = function (el) {
            // A stackoverflow user suggested wrapping the commands in a requestAnimationFrame callback for "extra compatibility". Not 
            // sure exactly what this means and did not thoroughly test not using it.
            var selectContents = function () {
                var range = document.createRange();
                range.selectNodeContents(el);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            };
            if (typeof requestAnimationFrame !== 'undefined') {
                requestAnimationFrame(function () { return selectContents(); });
            }
            else {
                // We'll get here for IE9 and lower. http://caniuse.com/#search=requestAnimationFrame
                selectContents();
            }
        };
        /**
        * Generate a 32-character pseudo-GUID.
        * @returns {String} Returns a pseudo-GUID.
        */
        Utils.createPseudoGuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        /**
         * Parse a user-friendly message from the JQueryXHR instance. If it contains a responseJSON property, then use that;
         * otherwise use the responseText property.
         * @param jqXHR The JQueryXHR instance
         * @returns {String} Returns a user-friendly message.
         */
        Utils.parseJqXhrMsg = function (jqXHR) {
            return (jqXHR.responseJSON && jqXHR.responseJSON.Message && jqXHR.responseJSON.MessageDetail ? jqXHR.responseJSON.Message + ' ' + jqXHR.responseJSON.MessageDetail : jqXHR.responseText);
        };
        return Utils;
    }());
    Gs.Utils = Utils;
    //#region Class / Interface / Enum / Constants definitions
    var Constants;
    (function (Constants) {
        Constants.IntMinValue = -2147483648;
        Constants.IntMaxValue = 2147483647;
    })(Constants = Gs.Constants || (Gs.Constants = {}));
    var Enums;
    (function (Enums) {
        /**
        * Specifies the size of a display object. This is the client-side version of the DisplayObjectType enumeration defined on the server.
        * @enum ViewSize
        */
        (function (ViewSize) {
            /**
            * Gets the Unknown view size.
            */
            ViewSize[ViewSize["Unknown"] = 0] = "Unknown";
            /**
            * Gets the Thumbnail view size.
            */
            ViewSize[ViewSize["Thumbnail"] = 1] = "Thumbnail";
            /**
            * Gets the Optimized view size.
            */
            ViewSize[ViewSize["Optimized"] = 2] = "Optimized";
            /**
            * Gets the Original view size.
            */
            ViewSize[ViewSize["Original"] = 3] = "Original";
            /**
            * Gets the External view size.
            */
            ViewSize[ViewSize["External"] = 4] = "External";
        })(Enums.ViewSize || (Enums.ViewSize = {}));
        var ViewSize = Enums.ViewSize;
        ;
        /**
        * Specifies the category to which this mime type belongs. This usually corresponds to the first portion of the full mime type description.
        * (e.g. "image" if the full mime type is "image/jpeg") The one exception to this is the "Other" enumeration, which represents any category
        * not represented by the others. This is the client-side version of the MimeTypeCategory enumeration defined on the server.
        * @enum MimeType
        */
        (function (MimeType) {
            /**
            * Gets the NotSet mime type name, which indicates that no assignment has been made.
            */
            MimeType[MimeType["NotSet"] = 0] = "NotSet";
            /**
            * Gets the Other mime type name.
            */
            MimeType[MimeType["Other"] = 1] = "Other";
            /**
            * Gets the Image mime type name.
            */
            MimeType[MimeType["Image"] = 2] = "Image";
            /**
            * Gets the Video mime type name.
            */
            MimeType[MimeType["Video"] = 3] = "Video";
            /**
            * Gets the Audio mime type name.
            */
            MimeType[MimeType["Audio"] = 4] = "Audio";
        })(Enums.MimeType || (Enums.MimeType = {}));
        var MimeType = Enums.MimeType;
        ;
        /**
        * Specifies the type of the gallery object. This is the client-side version of the GalleryObjectType enumeration defined on the server.
        * Note that some of the enumeration values that exist on the server are not present here because they would be complex to implement and
        * are not needed at this time.
        * @enum ItemType
        */
        (function (ItemType) {
            /**
            * Specifies that no gallery object type has been assigned.
            */
            ItemType[ItemType["NotSpecified"] = 0] = "NotSpecified";
            /**
            * Gets the Album gallery object type.
            */
            ItemType[ItemType["Album"] = 3] = "Album";
            /**
            * Gets the Image gallery object type.
            */
            ItemType[ItemType["Image"] = 4] = "Image";
            /**
            * Gets the Audio gallery object type.
            */
            ItemType[ItemType["Audio"] = 5] = "Audio";
            /**
            * Gets the Video gallery object type.
            */
            ItemType[ItemType["Video"] = 6] = "Video";
            /**
            * Gets the Generic gallery object type.
            */
            ItemType[ItemType["Generic"] = 7] = "Generic";
            /**
            * Gets the External gallery object type.
            */
            ItemType[ItemType["External"] = 8] = "External";
        })(Enums.ItemType || (Enums.ItemType = {}));
        var ItemType = Enums.ItemType;
        ;
        /**
        * Specifies whether an item is editable and, if so, the type of editor to use.
        * @enum PropertyEditorMode
        */
        (function (PropertyEditorMode) {
            /**
            * Indicates no property editor mode has been specified
            */
            PropertyEditorMode[PropertyEditorMode["NotSet"] = 0] = "NotSet";
            /**
            * Indicates that a property is not editable by users.
            */
            PropertyEditorMode[PropertyEditorMode["NotEditable"] = 3] = "NotEditable";
            /**
            * Indicates that a plain text editor is to be used for property editing.
            */
            PropertyEditorMode[PropertyEditorMode["PlainTextEditor"] = 2] = "PlainTextEditor";
            /**
            * Indicates that the tinyMCE HTML editor is to be used for property editing.
            */
            PropertyEditorMode[PropertyEditorMode["TinyMCEHtmlEditor"] = 3] = "TinyMCEHtmlEditor";
        })(Enums.PropertyEditorMode || (Enums.PropertyEditorMode = {}));
        var PropertyEditorMode = Enums.PropertyEditorMode;
        ;
        /**
        * Specifies one or more security-related actions within Gallery Server. A user may or may not have authorization to
        * perform each security action. A user's authorization is determined by the role or roles to which he or she belongs.
        * Note that some of the enumeration values that exist on the server are not present here.
        * This is the client-side version of the SecurityActions enumeration defined on the server.
        * @enum SecurityActions
        */
        (function (SecurityActions) {
            /**
            * Represents the ability to create a new album within the current album. This includes the ability to move or
            * copy an album into the current album.
            */
            SecurityActions[SecurityActions["AddChildAlbum"] = 2] = "AddChildAlbum";
            /**
            * Represents the ability to add a new media object to the current album. This includes the ability to move or
            * copy a media object into the current album.
            */
            SecurityActions[SecurityActions["AddMediaObject"] = 4] = "AddMediaObject";
            /**
            * Represents the ability to edit an album's title, summary, and begin and end dates. Also includes rearranging the
            * order of objects within the album and assigning the album's thumbnail image. Does not include the ability to
            * add or delete child albums or media objects.
            */
            SecurityActions[SecurityActions["EditAlbum"] = 8] = "EditAlbum";
        })(Enums.SecurityActions || (Enums.SecurityActions = {}));
        var SecurityActions = Enums.SecurityActions;
        ;
        /**
        * Identifies the type of virtual album. Note that some of the enumeration values that exist on the server are not present here.
        * This is the client-side version of the VirtualAlbumType enumeration defined on the server.
        * @enum SecurityActions
        */
        (function (VirtualAlbumType) {
            /**
            * Specifies that the album is not a virtual album.
            */
            VirtualAlbumType[VirtualAlbumType["NotVirtual"] = 1] = "NotVirtual";
        })(Enums.VirtualAlbumType || (Enums.VirtualAlbumType = {}));
        var VirtualAlbumType = Enums.VirtualAlbumType;
        ;
        /**
        * Specifies the type of the slide show. . This is the client-side version of the SlideShowType enumeration defined on the server.
        * @enum SlideShowType
        */
        (function (SlideShowType) {
            /**
            * Specifies that no slide show type has been assigned.
            */
            SlideShowType[SlideShowType["NotSet"] = 0] = "NotSet";
            /**
            * Gets the Inline slide show type.
            */
            SlideShowType[SlideShowType["Inline"] = 1] = "Inline";
            /**
            * Gets the FullScreen slide show type.
            */
            SlideShowType[SlideShowType["FullScreen"] = 2] = "FullScreen";
        })(Enums.SlideShowType || (Enums.SlideShowType = {}));
        var SlideShowType = Enums.SlideShowType;
        ;
        /**
         * Specifies a particular message that is to be displayed to the user. The text of the message is extracted from the resource file.
         * This is useful when redirecting the user to a new page. Include 'msg=11' in the URL, where 11 is the numeric value of the desired message.
         */
        (function (MessageType) {
            MessageType[MessageType["None"] = 0] = "None";
            MessageType[MessageType["AlbumSuccessfullyDeleted"] = 11] = "AlbumSuccessfullyDeleted";
        })(Enums.MessageType || (Enums.MessageType = {}));
        var MessageType = Enums.MessageType;
        /**
         * Specifies the type of meta item (e.g. title, caption, etc). Maps to the MetadataItemName enumeration on the server.
         */
        (function (MetaType) {
            MetaType[MetaType["NotSet"] = 0] = "NotSet";
            MetaType[MetaType["Title"] = 29] = "Title";
            MetaType[MetaType["Caption"] = 41] = "Caption";
            MetaType[MetaType["HtmlSource"] = 112] = "HtmlSource";
        })(Enums.MetaType || (Enums.MetaType = {}));
        var MetaType = Enums.MetaType;
        /**
         * Specifies a keyboard character. Can be used to compare with an event's keyCode property to see which key a user pressed.
         */
        (function (KeyCode) {
            KeyCode[KeyCode["NotSet"] = 0] = "NotSet";
            KeyCode[KeyCode["Enter"] = 13] = "Enter";
            KeyCode[KeyCode["Escape"] = 27] = "Escape";
            KeyCode[KeyCode["CursorLeft"] = 37] = "CursorLeft";
            KeyCode[KeyCode["CursorRight"] = 39] = "CursorRight";
        })(Enums.KeyCode || (Enums.KeyCode = {}));
        var KeyCode = Enums.KeyCode;
        /**
         * Identifies the amount to rotate or flip a media asset. Maps to the MediaAssetRotateFlip enumeration on the server.
         */
        (function (RotateFlip) {
            RotateFlip[RotateFlip["NotSet"] = 0] = "NotSet";
            RotateFlip[RotateFlip["Rotate0FlipNone"] = 1] = "Rotate0FlipNone";
            RotateFlip[RotateFlip["Rotate0FlipX"] = 2] = "Rotate0FlipX";
            RotateFlip[RotateFlip["Rotate0FlipY"] = 3] = "Rotate0FlipY";
            RotateFlip[RotateFlip["Rotate90FlipNone"] = 4] = "Rotate90FlipNone";
            RotateFlip[RotateFlip["Rotate180FlipNone"] = 7] = "Rotate180FlipNone";
            RotateFlip[RotateFlip["Rotate270FlipNone"] = 10] = "Rotate270FlipNone";
        })(Enums.RotateFlip || (Enums.RotateFlip = {}));
        var RotateFlip = Enums.RotateFlip;
        /**
         * Identifies a specific page. Maps to the PageId enumeration on the server.
         */
        (function (PageId) {
            PageId[PageId["none"] = 0] = "none";
            PageId[PageId["admin_albums"] = 1] = "admin_albums";
            PageId[PageId["admin_backuprestore"] = 2] = "admin_backuprestore";
            PageId[PageId["admin_css"] = 3] = "admin_css";
            PageId[PageId["admin_eventlog"] = 4] = "admin_eventlog";
            PageId[PageId["admin_galleries"] = 5] = "admin_galleries";
            PageId[PageId["admin_gallerysettings"] = 6] = "admin_gallerysettings";
            PageId[PageId["admin_gallerycontrolsettings"] = 7] = "admin_gallerycontrolsettings";
            PageId[PageId["admin_images"] = 8] = "admin_images";
            PageId[PageId["admin_manageroles"] = 9] = "admin_manageroles";
            PageId[PageId["admin_manageusers"] = 10] = "admin_manageusers";
            PageId[PageId["admin_mediaobjects"] = 11] = "admin_mediaobjects";
            PageId[PageId["admin_metadata"] = 12] = "admin_metadata";
            PageId[PageId["admin_filetypes"] = 13] = "admin_filetypes";
            PageId[PageId["admin_mediatemplates"] = 14] = "admin_mediatemplates";
            PageId[PageId["admin_sitesettings"] = 15] = "admin_sitesettings";
            PageId[PageId["admin_uitemplates"] = 16] = "admin_uitemplates";
            PageId[PageId["admin_usersettings"] = 17] = "admin_usersettings";
            PageId[PageId["admin_videoaudioother"] = 18] = "admin_videoaudioother";
            PageId[PageId["admin_mediaqueue"] = 19] = "admin_mediaqueue";
            PageId[PageId["album"] = 20] = "album";
            PageId[PageId["changepassword"] = 21] = "changepassword";
            PageId[PageId["createaccount"] = 22] = "createaccount";
            PageId[PageId["error_cannotwritetodirectory"] = 23] = "error_cannotwritetodirectory";
            PageId[PageId["error_generic"] = 24] = "error_generic";
            PageId[PageId["login"] = 25] = "login";
            PageId[PageId["mediaobject"] = 26] = "mediaobject";
            PageId[PageId["myaccount"] = 27] = "myaccount";
            PageId[PageId["recoverpassword"] = 28] = "recoverpassword";
            PageId[PageId["task_addobjects"] = 29] = "task_addobjects";
            PageId[PageId["task_synchronize"] = 30] = "task_synchronize";
        })(Enums.PageId || (Enums.PageId = {}));
        var PageId = Enums.PageId;
        /**
         * Specifies a Gallery Server license. Maps to LicenseLevel enumeration on the server. Some UI templates refer to the
         * numerical value of the enumeration, so if you change the value, check the UI templates.
         */
        (function (LicenseLevel) {
            LicenseLevel[LicenseLevel["NotSet"] = 0] = "NotSet";
            LicenseLevel[LicenseLevel["TrialExpired"] = 1] = "TrialExpired";
            LicenseLevel[LicenseLevel["Free"] = 2] = "Free";
            LicenseLevel[LicenseLevel["HomeNonprofit"] = 3] = "HomeNonprofit";
            LicenseLevel[LicenseLevel["Enterprise"] = 4] = "Enterprise";
            LicenseLevel[LicenseLevel["EnterpriseUltimate"] = 5] = "EnterpriseUltimate";
            LicenseLevel[LicenseLevel["Trial"] = 6] = "Trial";
        })(Enums.LicenseLevel || (Enums.LicenseLevel = {}));
        var LicenseLevel = Enums.LicenseLevel;
    })(Enums = Gs.Enums || (Gs.Enums = {}));
    /**
    * A client-optimized object that stores application-level properties for the gallery.
    * @class Permissions
    */
    var App = (function () {
        function App() {
        }
        return App;
    }());
    Gs.App = App;
    /**
     * A simple object that contains gallery item information. It is essentially a client-optimized version of IGalleryObject.
     * @class GalleryItem
     */
    var GalleryItem = (function () {
        function GalleryItem() {
        }
        return GalleryItem;
    }());
    Gs.GalleryItem = GalleryItem;
    /**
     * A client-optimized object that contains information about a particular view of a media object.
     * @class DisplayObject
     */
    var DisplayObject = (function () {
        function DisplayObject() {
        }
        return DisplayObject;
    }());
    Gs.DisplayObject = DisplayObject;
    /**
     * A client-optimized object that stores a piece of information describing a gallery object.
     * @class MetaItem
     */
    var MetaItem = (function () {
        function MetaItem(mTypeId) {
            this.Id = 0;
            this.MediaId = 0;
            this.MTypeId = mTypeId;
            this.GTypeId = 0;
            this.Desc = '';
            this.Value = '';
            //this.IsEditable = false;
            this.EditMode = Enums.PropertyEditorMode.NotSet;
        }
        return MetaItem;
    }());
    Gs.MetaItem = MetaItem;
    /**
     * A data object that contains permissions relevant to the current user.
     * @class Permissions
     */
    var Permissions = (function () {
        function Permissions() {
        }
        return Permissions;
    }());
    Gs.Permissions = Permissions;
    /**
     * A simple object that contains album information. This class is used to pass information between the browser and the web server via AJAX callbacks.
     * @class Album
     */
    var Album = (function () {
        function Album() {
        }
        return Album;
    }());
    Gs.Album = Album;
    /**
     * A client-optimized object that contains media object information.
     * @class MediaItem
     */
    var MediaItem = (function () {
        function MediaItem() {
        }
        return MediaItem;
    }());
    Gs.MediaItem = MediaItem;
    /**
     * A client-optimized object that contains language resources.
     * @class Resource
     */
    var Resource = (function () {
        function Resource() {
        }
        return Resource;
    }());
    Gs.Resource = Resource;
    /**
     * A client-optimized object that stores properties that affect the user experience.
     * @class Settings
     */
    var Settings = (function () {
        function Settings() {
        }
        return Settings;
    }());
    Gs.Settings = Settings;
    /**
     * A client-optimized object containing information about the current user.
     * @class User
     */
    var User = (function () {
        function User() {
        }
        return User;
    }());
    Gs.User = User;
    /**
     * A client-optimized object that contains gallery data.
     * @class GalleryData
     */
    var GalleryData = (function () {
        function GalleryData() {
        }
        return GalleryData;
    }());
    Gs.GalleryData = GalleryData;
    /**
     * A data object containing information about the result of an action. Maps to the ActionResult class on the server.
     * @class ActionResult
     */
    var ActionResult = (function () {
        function ActionResult() {
        }
        return ActionResult;
    }());
    Gs.ActionResult = ActionResult;
    /**
     * A client-optimized object that wraps a meta item and the gallery items it applies to.
     * @class GalleryItemMeta
     */
    var GalleryItemMeta = (function () {
        function GalleryItemMeta() {
        }
        return GalleryItemMeta;
    }());
    Gs.GalleryItemMeta = GalleryItemMeta;
    //#endregion Class / Interface / Enum / Constants definitions
    //#region tinyMCE plugins
    // Add placeholder functionality for tinyMCE editor. Inspired from https://github.com/mohan999/tinymce-placeholder
    // Tested only for inline mode
    if (typeof tinyMCE !== 'undefined') {
        tinyMCE.PluginManager.add('placeholder', function (editor) {
            editor.on('init', function () {
                var tinyMcePh = new TinyMcePlaceholder(editor); // editor is instance of tinymce.Editor: https://www.tinymce.com/docs/api/class/tinymce.editor/
                onBlur();
                tinyMCE.DOM.bind(tinyMcePh.placeholderElement, 'click', function (e) {
                    // User clicks on placeholder
                    tinyMcePh.hide();
                    $(e.target).prevAll('.mce-content-body').focus();
                });
                editor.on('focus', function () {
                    tinyMcePh.hide();
                });
                editor.on('blur', onBlur);
                function onBlur() {
                    if (editor.getContent() === '') {
                        tinyMcePh.show();
                    }
                    else {
                        tinyMcePh.hide();
                    }
                }
            });
            var TinyMcePlaceholder = (function () {
                function TinyMcePlaceholder(editor) {
                    // The placeholder text comes from the first of these locations: (1) placedholder attribute of the tinyMCE element 
                    // (2) placeholder_text setting in tinyMCE.init() (3) hard-coded text 'Add...'
                    this.placeholderText = editor.getElement().getAttribute('placeholder') || editor.settings.placeholder_text || 'Add...';
                    // Get the parent of our tinyMCE element. This plugin requires the parent to have a top left position at the same place as the element.
                    this.placeholderParent = $(editor.getElement()).parent()[0];
                    tinyMCE.DOM.setStyle(this.placeholderParent, 'position', 'relative');
                    var attrs = { 'class': 'gs_meta_placeholder' }; // Class should have style similar to: position: absolute; top: 0; left: 0; color: #888; padding: 3px; width: 100%; overflow:hidden;border: 1px solid transparent;
                    this.placeholderElement = tinyMCE.DOM.add(this.placeholderParent, 'label', attrs, this.placeholderText);
                }
                TinyMcePlaceholder.prototype.show = function () {
                    tinyMCE.DOM.setStyle(this.placeholderElement, 'display', '');
                };
                TinyMcePlaceholder.prototype.hide = function () {
                    tinyMCE.DOM.setStyle(this.placeholderElement, 'display', 'none');
                };
                return TinyMcePlaceholder;
            }());
        });
    }
    //#endregion
    $(document).ready(Utils.Init);
    //#endregion End Gallery-wide functions
    //#region AJAX functions
    var DataService = (function () {
        function DataService() {
        }
        DataService.logOff = function (callback) {
            $.post(Vars.AppRoot + '/api/task/logoff', function (data) {
                callback(data);
            });
        };
        DataService.getGalleryItems = function (albumId, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'GET',
                url: Vars.AppRoot + '/api/albums/' + albumId + '/galleryitems',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.deleteGalleryItems = function (galleryItems, deleteFromFileSystem, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'DELETE',
                url: Vars.AppRoot + '/api/galleryitems/delete?deleteFromFileSystem=' + deleteFromFileSystem,
                data: JSON.stringify(galleryItems),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.deleteOriginalFiles = function (galleryItems, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'DELETE',
                url: Vars.AppRoot + '/api/galleryitems/deleteoriginalfiles',
                data: JSON.stringify(galleryItems),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.getMediaAsset = function (mediaAssetId, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'GET',
                url: Vars.AppRoot + '/api/mediaitems/' + mediaAssetId + '/get'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        /**
         * Delete the specified media asset. NOTE: This function is not currently used in Gallery Server.
         */
        DataService.deleteMediaAsset = function (mediaAssetId, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'DELETE',
                url: Vars.AppRoot + '/api/mediaitems/' + mediaAssetId
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.prepareZipDownload = function (galleryItems, viewSize, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/mediaitems/preparezipdownload?mediaSize=' + viewSize,
                data: JSON.stringify(galleryItems),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        /**
         * Create a new album on the server. The only properties of the album parameter that are used are Title and ParentId.
         * Optional: If GalleryId is specified and an error occurs, it is used to help with error logging.
         */
        DataService.createAlbum = function (album, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'PUT',
                url: Vars.AppRoot + '/api/albums/createalbum',
                data: JSON.stringify(album),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.sortAlbum = function (album, persistToAlbum, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + "/api/albums/sortalbum?persistToAlbum=" + persistToAlbum,
                data: JSON.stringify(album),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.changeAlbumOwner = function (albumId, ownerName, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + "/api/albums/changealbumowner?albumId=" + albumId + "&ownerName=" + ownerName,
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.saveAlbum = function (album, alwaysCallback, doneCallback, failCallback) {
            var a = Utils.deepCopy(album);
            a.MediaItems = null;
            a.GalleryItems = null;
            a.MetaItems = null;
            a.Permissions = null;
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/albums/post',
                data: JSON.stringify(a),
                contentType: 'application/json; charset=utf-8'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.moveTo = function (destinationAlbumId, galleryItemsToMove, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/albums/movetoalbum?destinationAlbumId=' + destinationAlbumId,
                data: JSON.stringify(galleryItemsToMove),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.copyTo = function (destinationAlbumId, galleryItemsToCopy, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/albums/copytoalbum?destinationAlbumId=' + destinationAlbumId,
                data: JSON.stringify(galleryItemsToCopy),
                contentType: 'application/json; charset=utf-8'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        /**
         * Sort the galleryItems in the order in which they are passed. This method is used when a user is manually sorting an album
         * and has dragged an item to a new position.
         */
        DataService.sortGalleryItems = function (galleryItems, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/albums/sortgalleryobjects',
                data: JSON.stringify(galleryItems),
                contentType: 'application/json; charset=utf-8'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.saveMeta = function (galleryItemMeta, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'PUT',
                url: Vars.AppRoot + '/api/galleryitemmeta',
                data: JSON.stringify(galleryItemMeta),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.deleteMeta = function (galleryItemMeta, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'DELETE',
                url: Vars.AppRoot + '/api/galleryitemmeta',
                data: JSON.stringify(galleryItemMeta),
                contentType: 'application/json; charset=utf-8'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.canUserEdit = function (galleryItems, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/galleryitemmeta/canuseredit',
                data: JSON.stringify(galleryItems),
                contentType: 'application/json; charset=utf-8'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        /**
         * Get the meta items for the specified gallery items. Server returns an array of MetaItem instances.
         */
        DataService.getMeta = function (galleryItems, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/galleryitemmeta/galleryitems',
                data: JSON.stringify(galleryItems),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.assignThumbnail = function (galleryItem, albumId, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/albums/assignThumbnail?albumId=' + albumId,
                data: JSON.stringify(galleryItem),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.cancelMediaQueueItem = function (mediaQueueId, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/mediaqueueitem/cancel/?mediaQueueId=' + mediaQueueId
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.saveCurrentUserProfile = function (user, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/users/currentuserprofile',
                data: JSON.stringify(user),
                contentType: 'application/json; charset=utf-8'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.clearUserProfile = function (userName, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/users/clearuserprofile?userName=' + userName,
                contentType: 'application/json; charset=utf-8'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        /**
         * Purge the entire cache on the server. User must be a site administrator.
         * NOTE: This function is not currently used in Gallery Server.
         */
        DataService.purgeCache = function (alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                url: Vars.AppRoot + '/api/task/purgecache'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.calculateOriginalFileSize = function (galleryItem, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/albums/calculateoriginalfilesize',
                data: JSON.stringify(galleryItem),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.replaceWithEditedImage = function (mediaAssetId, fileNameOnServer, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/mediaitems/replacewitheditedimage?mediaAssetId=' + mediaAssetId + '&fileNameOnServer=' + encodeURIComponent(fileNameOnServer),
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.replaceMediaAssetFile = function (mediaAssetId, fileNameOnServer, fileName, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + "/api/mediaitems/replacemediaassetfile?mediaAssetId=" + mediaAssetId + "&fileNameOnServer=" + encodeURIComponent(fileNameOnServer) + "&fileName=" + encodeURIComponent(fileName),
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        DataService.rotateFlipMediaAsset = function (galleryItems, rotateFlip, viewSize, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'POST',
                url: Vars.AppRoot + '/api/galleryitems/rotateflip?rotateFlip=' + rotateFlip + '&viewSize=' + viewSize,
                data: JSON.stringify(galleryItems),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        /**
         * Invoke a GET request to the specified url and parse the response as JSON.
         */
        DataService.getAsJson = function (url, data, alwaysCallback, doneCallback, failCallback) {
            $.ajax({
                type: 'GET',
                url: url,
                data: data,
                dataType: 'json'
            })
                .done(doneCallback)
                .always(alwaysCallback)
                .fail(failCallback);
        };
        return DataService;
    }());
    Gs.DataService = DataService;
    //#endregion
    //#region gsTagCloud plug-in
    $.fn.gsTagCloud = function (data, options) {
        var _this = this;
        var settings = $.extend({}, $.fn.gsTagCloud.defaults, options);
        var getTagDataAndRender = function () {
            DataService.getAsJson(options.tagCloudUrl, null, function () {
                _this.removeClass('gsp_wait');
            }, function (tags) {
                var tc = new GsTagCloud(_this, tags, settings);
                tc.render();
            }, function (jqXHR) {
                Msg.show('Cannot Retrieve Tag Cloud Data', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
            });
        };
        if (data == null) {
            getTagDataAndRender();
        }
        else {
            var gspTc = new GsTagCloud(this, data, settings);
            gspTc.render();
        }
        return this;
    };
    $.fn.gsTagCloud.defaults = {
        clientId: '',
        tagCloudType: 'tag',
        tagCloudUrl: '',
        shape: 'rectangular' // Shape of cloud. Set to false to get the elliptic shape (the default shape of JQCloud)
    };
    var GsTagCloud = (function () {
        function GsTagCloud(target, data, options) {
            this.$target = target; // A jQuery object to receive the tag cloud.
            this.TagCloudOptions = options;
            this.Data = data;
        }
        GsTagCloud.prototype.render = function () {
            var _this = this;
            var parms = { title: null, tag: null, people: null, search: null, latest: null, filter: null, rating: null, top: null, aid: null, moid: null };
            var pageUrl = window.location.href;
            var jqcloudData = $.map(this.Data, function (tag) {
                parms[_this.TagCloudOptions.tagCloudType] = tag.value;
                return { text: tag.value, weight: tag.count, link: Utils.GetUrl(pageUrl, parms) };
            });
            this.$target.jQCloud(jqcloudData, {
                encodeURI: false,
                shape: this.TagCloudOptions.shape
            });
        };
        return GsTagCloud;
    }());
    //#endregion
    //#region gsTreeView plug-in
    $.fn.gsTreeView = function (data, options) {
        var _this = this;
        var settings = $.extend({}, $.fn.gsTreeView.defaults, options);
        var getTreeDataAndRender = function () {
            var ajaxData = {
                // Query string parms to be added to the AJAX request
                id: settings.albumId,
                gid: settings.galleryId,
                secaction: settings.requiredSecurityPermissions,
                sc: settings.enableCheckboxPlugin,
                navurl: settings.navigateUrl,
                levels: settings.numberOfLevels,
                includealbum: settings.includeAlbum,
                idtoselect: settings.albumIdsToSelect
            };
            DataService.getAsJson(settings.treeDataUrl, ajaxData, function () {
                // Always callback
                _this.removeClass('gsp_wait');
            }, function (treeJson) {
                // Success callback
                var treeData = (typeof (treeJson) === 'string' ? JSON.parse(treeJson) : treeJson);
                var tv = new GsTreeView(_this, treeData, settings);
                tv.render();
            }, function (jqXHR) {
                Msg.show('Cannot Retrieve Tag Cloud Data', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
            });
        };
        if (data == null) {
            getTreeDataAndRender();
        }
        else {
            var gspTv = new GsTreeView(this, data, settings);
            gspTv.render();
        }
        return this;
    };
    $.fn.gsTreeView.defaults = {
        albumId: 0,
        galleryId: 0,
        containerClientId: '',
        allowMultiSelect: false,
        numberOfLevels: 1,
        albumIdsToSelect: null,
        checkedAlbumIdsHiddenFieldClientId: '',
        theme: 'gsp',
        requiredSecurityPermissions: 1,
        navigateUrl: '',
        enableCheckboxPlugin: false,
        includeAlbum: true,
        treeDataUrl: '' // The URL for retrieving tree data. Ignored when tree data is passed via data parameter
    };
    var GsTreeView = (function () {
        function GsTreeView(target, data, options) {
            this.$target = target; // A jQuery object to receive the rendered treeview.
            this.TreeViewOptions = options;
            this.Data = data;
        }
        GsTreeView.prototype.render = function () {
            var _this = this;
            this.updateNodeDataWithAlbumIdsToSelect();
            var jstreeOptions = {
                core: {
                    worker: false,
                    check_callback: true,
                    data: function (node, cb) {
                        if (node.id === '#') {
                            return cb(_this.Data);
                        }
                        var url = Vars.GalleryResourcesRoot + '/handler/gettreeview.ashx';
                        var ajaxData = {
                            // Query string parms to be added to the AJAX request
                            id: node.li_attr['data-id'],
                            //gid: self.TreeViewOptions.galleryId,
                            secaction: _this.TreeViewOptions.requiredSecurityPermissions,
                            sc: _this.TreeViewOptions.enableCheckboxPlugin,
                            navurl: _this.TreeViewOptions.navigateUrl,
                            levels: 1,
                            includealbum: false
                        };
                        DataService.getAsJson(url, ajaxData, null, function (treeData) {
                            cb(treeData);
                        }, function (jqXHR) {
                            Msg.show('Cannot Retrieve Tree Data', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                        });
                        return null;
                    },
                    multiple: this.TreeViewOptions.allowMultiSelect,
                    themes: {
                        name: this.TreeViewOptions.theme,
                        dots: false,
                        icons: false,
                        responsive: false
                    },
                    error: function () {
                        var msg = 'An error occurred in jsTree.';
                        var err = _this.$target.jstree(true).last_error();
                        if (err && err.reason && err.error && err.id && err.plugin && err.data) {
                            msg = msg + " " + err.reason + " Error: " + err.error + "; ID: " + err.id + "; Plugin: " + err.plugin + "; Data: " + err.data;
                        }
                        Msg.show('jsTree Error', msg, { msgType: 'error', autoCloseDelay: 0 });
                    }
                }
            };
            if (this.TreeViewOptions.enableCheckboxPlugin) {
                jstreeOptions.plugins = ['checkbox'];
                jstreeOptions.checkbox = {
                    keep_selected_style: false,
                    three_state: this.TreeViewOptions.allowMultiSelect,
                    visible: true,
                    whole_node: true,
                    cascade: '',
                    tie_selection: true
                };
            }
            this.$target.jstree(jstreeOptions)
                .on('ready.jstree', function (e, data) {
                _this.onLoaded(e, data);
            })
                .on('changed.jstree', function (e, data) {
                _this.onChangeState(e, data);
            })
                .on('deselect_node.jstree', function (e, data) {
                _this.onDeselectNode(e, data);
            });
        };
        ;
        /**
         * Grab the data-id values from the top selected nodes, concatenate them and store them in a hidden
         * form field. This can later be retrieved by server side code to determine what was selected.
         * @param data Tree data. Not sure what the schema is.
         */
        GsTreeView.prototype.storeSelectedNodesInHiddenFormField = function (data) {
            if (this.TreeViewOptions.checkedAlbumIdsHiddenFieldClientId == null || this.TreeViewOptions.checkedAlbumIdsHiddenFieldClientId.length === 0)
                return;
            var topSelectedNodes = data.instance.get_top_selected(true);
            var albumIds = $.map(topSelectedNodes, function (val, i) { return val.li_attr['data-id']; }).join();
            $("#" + this.TreeViewOptions.checkedAlbumIdsHiddenFieldClientId).val(albumIds);
        };
        ;
        /**
         * Process the this.TreeViewOptions.albumIdsToSelect array - find the matching node in the data and change state.selected to true
         * Note that in many cases the nodes are pre-selected in server side code. This function isn't needed in those cases.
         */
        GsTreeView.prototype.updateNodeDataWithAlbumIdsToSelect = function () {
            var _this = this;
            if (Utils.isNullOrEmpty(this.TreeViewOptions.albumIdsToSelect))
                return;
            var findMatch = function (nodeArray, dataId) {
                // Search nodeArray for a node having data-id=dataId, acting recursively
                if (Utils.isNullOrEmpty(nodeArray))
                    return null;
                var matchingNode = $.grep(nodeArray, function (n) { return (n.li_attr['data-id'] === dataId); })[0] || null;
                if (matchingNode != null)
                    return matchingNode;
                // Didn't find it, so recursively search node data
                $.each(nodeArray, function (idx, n) {
                    matchingNode = findMatch(n.children, dataId);
                    if (matchingNode != null) {
                        return false; // Break out of $.each
                    }
                    else
                        return true;
                });
                return matchingNode;
            };
            $.each(this.TreeViewOptions.albumIdsToSelect, function (idx, id) {
                var node = findMatch(_this.Data, id);
                if (node != null) {
                    node.state.selected = true;
                }
            });
        };
        GsTreeView.prototype.onChangeState = function (e, data) {
            if (data.action === 'select_node') {
                var url = data.instance.get_node(data.node, true).children('a').attr('href');
                if (url != null && url.length > 1) {
                    // Selected node is a hyperlink with an URL, so navigate to it.
                    document.location.href = url;
                    return;
                }
            }
            if (data.action === 'deselect_node' || data.action === 'select_node') {
                this.storeSelectedNodesInHiddenFormField(data);
            }
        };
        GsTreeView.prototype.onDeselectNode = function (e, data) {
            // Don't let user deselect the only selected node when allowMultiSelect=false
            if (!this.TreeViewOptions.allowMultiSelect && data.instance.get_selected().length === 0) {
                data.instance.select_node(data.node);
            }
        };
        GsTreeView.prototype.onLoaded = function (e, data) {
            this.storeSelectedNodesInHiddenFormField(data);
            // Scroll the left pane if necessary so that the selected node is visible
            if (this.TreeViewOptions.containerClientId.length < 1)
                return;
            var selectedIds = data.instance.get_selected();
            if (selectedIds != null && selectedIds.length === 1) {
                var nodeOffsetTop = $("#" + selectedIds[0]).position().top;
                var leftPaneHeight = $("#" + this.TreeViewOptions.containerClientId).height();
                if (nodeOffsetTop > leftPaneHeight) {
                    $("#" + this.TreeViewOptions.containerClientId).animate({ scrollTop: nodeOffsetTop }, 200, 'linear');
                }
            }
        };
        ;
        return GsTreeView;
    }());
    //#endregion gsTreeView plug-in
    //#region gs.gsMedia widget
    $.widget('gs.gsMedia', {
        options: {
            clientId: ''
        },
        _create: function () {
            var gData = Vars[this.options.clientId].gsData;
            this.gspMedia = new GsMedia(this.element, gData, this.options);
            this.gspMedia.initialize();
        },
        showNextMediaObject: function () {
            this.gspMedia.showNextMediaObject();
        },
        startSlideshow: function () {
            this.gspMedia.startSlideshow();
        },
        stopSlideshow: function () {
            this.gspMedia.stopSlideshow();
        },
        render: function () {
            this.gspMedia.render();
        },
        preloadImages: function () {
            this.gspMedia.preloadImages();
        },
        addCursorNavigationHandler: function () {
            this.gspMedia.addCursorNavigationHandler();
        },
        removeCursorNavigationHandler: function () {
            this.gspMedia.removeCursorNavigationHandler();
        }
    });
    var GsMedia = (function () {
        function GsMedia(target, data, options) {
            this.$target = target; // A jQuery object to receive the rendered HTML from the template.
            this.data = data;
            this.gsMediaOptions = options;
            this.timer = null;
        }
        GsMedia.prototype.initialize = function () {
            if (!this.data.MediaItem) {
                Msg.show('Cannot Render Media Object', "<p>Cannot render the media object template. Navigate to a media object and then return to this page.</p><p>You'll know you got it right when you see 'moid' In the URL's query string.</p><p>ERROR: this.Data.MediaItem is null.</p>", { msgType: 'error', autoCloseDelay: 0 });
                return;
            }
            this.jsRenderSetup();
            this.overwriteMediaObject();
            this.attachEvents();
            this.render();
            this.preloadImages();
        };
        GsMedia.prototype.jsRenderSetup = function () {
            var _this = this;
            // Create a few helper functions that can be used in the jsRender template.
            $.views.helpers({
                prevUrl: function () {
                    // Generate the URL to the previous media item.
                    var prvMi = _this.getPreviousMediaObject();
                    return prvMi ? _this.getPermalink(prvMi.Id) : Utils.GetAlbumUrl(_this.data.Album.Id, true);
                },
                nextUrl: function () {
                    // Generate the URL to the next media item.
                    var nxtMi = _this.getNextMediaObject();
                    return nxtMi ? _this.getPermalink(nxtMi.Id) : Utils.GetAlbumUrl(_this.data.Album.Id, true);
                },
                getEmbedCode: function () {
                    var url = Utils.GetUrl(_this.data.App.AppUrl + '/' + _this.data.App.GalleryResourcesPath + '/embed.aspx' + location.search, { aid: null, moid: _this.data.MediaItem.Id });
                    return "<iframe allowtransparency='true' frameborder='0' sandbox='allow-same-origin allow-forms allow-scripts' scrolling='auto' src='" + url + "' style='width:100%;height:100%'></iframe>";
                }
            });
        };
        GsMedia.prototype.render = function () {
            this.setSize();
            this.dataBind();
            this.runMediaObjectScript();
            this.ScaleDownOriginalIfNecessary();
            if (this.data.Settings.SlideShowIsRunning)
                this.startSlideshow();
            if (history.replaceState)
                history.replaceState(null, '', this.getPermalink(this.data.MediaItem.Id));
        };
        /**
         * Reduce the size of the media asset, if necessary, to ensure there are no horizontal scrollbars. Applies only when viewing
         * an original media asset.
         */
        GsMedia.prototype.ScaleDownOriginalIfNecessary = function () {
            if (this.data.Settings.MediaViewSize !== Enums.ViewSize.Original)
                return;
            var $moContainer = $('.gsp_moContainer', this.$target);
            var moContainerWidth = $moContainer.width();
            var mediaSelector = 'img:first-child, video:first-child, object:first-child';
            var $media = $(mediaSelector, $moContainer).first();
            if ($media.length === 0)
                return; // We'll get here for images that can't display in the browser (wmf, psd, etc). No need to go further.
            // We can't measure width when dimensions aren't specified in the HTML, since it's not known until later.
            // 1) Hook into load event and go from there.
            // 2) Use width and height dimension in metadata.
            var moWidth = $media.outerWidth();
            var checkWidth = function ($mediaEl) {
                if (moWidth > moContainerWidth) {
                    // The media asset is too big to fit in the center pane. Set its width to the width of its container.
                    // We have to change box- sizing to border- box to have enough room for the padding/border.
                    $mediaEl.css({ 'box-sizing': 'border-box', 'width': moContainerWidth, 'height': 'auto' });
                }
            };
            if (moWidth > moContainerWidth) {
                checkWidth($media);
            }
            else {
                // The media asset may not yet be loaded and that is why moWidth is small. Check for this and add handler if necessary,
                // but we only check images because there isn't a complete property for the video & object tags.
                if (this.data.MediaItem.ItemType === Enums.ItemType.Image && !$media[0].complete) {
                    $media.load(function () {
                        // We need to get another reference to the media element. If we try to re-use the first one, the CSS doesn't work in Chrome 47.
                        var $mediaEl = $(mediaSelector, $moContainer).first();
                        moContainerWidth = $moContainer.width();
                        moWidth = $mediaEl.outerWidth();
                        checkWidth($mediaEl);
                    });
                }
            }
        };
        GsMedia.prototype.setSize = function () {
            var defaultViewIndex = 0;
            for (var i = 0; i < this.data.MediaItem.Views.length; i++) {
                if (this.data.MediaItem.Views[i].ViewSize === this.data.Settings.MediaViewSize) {
                    this.data.MediaItem.ViewIndex = this.data.ActiveGalleryItems[0].ViewIndex = i; // Get index corresponding to requested size
                    return;
                }
                else if (this.data.MediaItem.Views[i].ViewSize === Enums.ViewSize.Original
                    || this.data.MediaItem.Views[i].ViewSize === Enums.ViewSize.External)
                    defaultViewIndex = i;
            }
            // If we get here, we couldn't find a match for the requested size, so default to showing original or external
            this.data.MediaItem.ViewIndex = this.data.ActiveGalleryItems[0].ViewIndex = defaultViewIndex;
        };
        GsMedia.prototype.startSlideshow = function () {
            var _this = this;
            if (this.data.Settings.SlideShowType === Enums.SlideShowType.FullScreen) {
                this.removeCursorNavigationHandler();
                var ss = new GsFullScreenSlideShow(this.data, {
                    viewSize: this.data.Settings.MediaViewSize,
                    on_exit: function (currentId, autoExited) {
                        _this.data.Settings.SlideShowIsRunning = false;
                        _this.addCursorNavigationHandler();
                        // If slide show auto-exited, we finished the album so navigate to the album view. Otherwise just show the image.
                        if (autoExited) {
                            _this.redirectToAlbum();
                        }
                        else {
                            _this.showMediaObject(currentId);
                        }
                    }
                });
                this.data.Settings.SlideShowIsRunning = ss.startSlideShow();
            }
            else if (this.data.Settings.SlideShowType === Enums.SlideShowType.Inline) {
                if (this.timer && this.timer.isRunning)
                    return true;
                this.data.Settings.SlideShowIsRunning = true;
                if (this.data.MediaItem.ItemType === Enums.ItemType.Image || this.getNextMediaObject() != null) {
                    this.timer = new GsTimer(this.showNextMediaObject, this.data.Settings.SlideShowIntervalMs, this);
                    this.timer.start();
                }
                else {
                    this.data.Settings.SlideShowIsRunning = false;
                    Msg.show(this.data.Resource.MoNoSsHdr, this.data.Resource.MoNoSsBdy, { msgType: 'info' });
                }
            }
            return this.data.Settings.SlideShowIsRunning;
        };
        GsMedia.prototype.stopSlideshow = function () {
            if (this.timer)
                this.timer.stop();
            this.data.Settings.SlideShowIsRunning = false;
        };
        GsMedia.prototype.dataBind = function () {
            Utils.DisposeAjaxComponent(Vars.msAjaxComponentId); // Dispose Silverlight component (if necessary)
            this.$target.html($.render[this.data.Settings.MediaTmplName](this.data)); // Render HTML template and add to page
            this.animateMediaObject(); // Execute transition effect
            this.attachMediaEvents();
            this.makeMetaItemsEditable();
        };
        GsMedia.prototype.makeMetaItemsEditable = function () {
            var _this = this;
            if (!this.data.Album.Permissions.EditMediaObject)
                return;
            var tinyMcePlainTextOptions = {
                selector: "#" + this.data.Settings.MediaClientId + " section[data-editMode=2]",
                menubar: false,
                inline: true,
                skin: this.data.App.Skin,
                plugins: ['placeholder'],
                toolbar: false,
                forced_root_block: false,
                verify_html: false,
                placeholder_text: this.data.Resource.MetaEditPlaceholder,
                setup: function (editor) {
                    var selectedGalleryItemsKey = 'sgi';
                    var currentMetaItemKey = 'cmi';
                    editor.on('init', function (e) {
                        // Navigate to hyperlink if user clicks on one. Without this tinyMCE simply makes the area editable and doesn't send the user to the URL.
                        $(editor.getBody()).on('click', 'a[href]', function (e1) {
                            window.location.href = $(e1.currentTarget).attr('href');
                        });
                    });
                    editor.on('focus', function (e) {
                        var metaItem = Utils.findMetaItemById(_this.data.MediaItem.MetaItems, $(e.target.targetElm).data('id'));
                        _this.$target.data(selectedGalleryItemsKey, _this.data.ActiveGalleryItems);
                        _this.$target.data(currentMetaItemKey, metaItem);
                        if (metaItem.EditMode === Enums.PropertyEditorMode.PlainTextEditor) {
                            // Need to encode any HTML for plain text editing
                            var tinyMceEditor = tinyMCE.get(e.target.id);
                            tinyMceEditor.setContent(Utils.htmlEncode(metaItem.Value));
                        }
                        // Disable left/right arrow navigation so user can use these keys while editing
                        $("#" + _this.data.Settings.MediaClientId).gsMedia('removeCursorNavigationHandler');
                    });
                    editor.on('blur', function (e) {
                        var tinyMceEditor = tinyMCE.get(e.target.id);
                        var $targetElm = $(tinyMceEditor.targetElm);
                        // Persist unsaved changes
                        if (tinyMceEditor.isDirty()) {
                            // Retrieve the selected gallery items. We can't use data.ActiveGalleryItems because it will be different if user made a new selection
                            // (this is because the blur event we're running right now fires after the jQuery UI selected event)
                            var selectedGalleryItems = [Utils.convertMediaItemToGalleryItem(_this.data.MediaItem)];
                            var cachedMetaItem_1 = _this.$target.data(currentMetaItemKey);
                            var editorFormat = (cachedMetaItem_1.EditMode === Enums.PropertyEditorMode.TinyMCEHtmlEditor ? 'html' : 'text');
                            var galleryItemMeta = { GalleryItems: selectedGalleryItems, MetaItem: { MTypeId: cachedMetaItem_1.MTypeId, Value: tinyMceEditor.getContent({ format: editorFormat }) } };
                            var $parentCell_1 = $(e.target.targetElm).addClass('gsp_wait_center');
                            DataService.saveMeta(galleryItemMeta, function () { $parentCell_1.removeClass('gsp_wait_center'); }, function (gim) {
                                // Success callback - Ajax request to save meta property completed. Check for validation and other errors and respond accordingly
                                switch (gim.ActionResult.Status) {
                                    case 'Success':
                                    case 'Info':
                                    case 'Warning':
                                        {
                                            // Update local data objects with new meta value
                                            var metaItem = Utils.findMetaItemById(_this.data.MediaItem.MetaItems, $(e.target.targetElm).data('id'));
                                            if (metaItem != null) {
                                                if (metaItem.MTypeId === Enums.MetaType.Title) {
                                                    _this.data.MediaItem.Title = gim.MetaItem.Value;
                                                }
                                                metaItem.Value = gim.MetaItem.Value;
                                                if (cachedMetaItem_1.EditMode === Enums.PropertyEditorMode.PlainTextEditor) {
                                                    // Editor may have been displaying HTML-encoded text, so now display the un-encoded value
                                                    tinyMCE.get(e.target.id).targetElm.innerHTML = gim.MetaItem.Value;
                                                }
                                                _this.$target.trigger("mediaUpdate." + _this.data.Settings.ClientId, [_this.data.ActiveGalleryItems]);
                                            }
                                            break;
                                        }
                                    case 'Error':
                                        // Revert to previous value and show or hide the placeholder text.
                                        $targetElm.html(cachedMetaItem_1.Value).nextAll('label').toggle(cachedMetaItem_1.Value.length === 0);
                                        break;
                                }
                                if (gim.ActionResult.Status !== 'Success') {
                                    Msg.show(gim.ActionResult.Title, gim.ActionResult.Message, { msgType: gim.ActionResult.Status.toLowerCase(), autoCloseDelay: 0 });
                                }
                            }, function (jqXHR) {
                                // Revert to previous value and show or hide the placeholder text.
                                $targetElm.html(cachedMetaItem_1.Value).nextAll('label').toggle(cachedMetaItem_1.Value.length === 0);
                                Msg.show('Cannot Save Changes', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                            });
                        }
                        // Restore left/right arrow navigation
                        $("#" + _this.data.Settings.MediaClientId).gsMedia('addCursorNavigationHandler');
                    });
                    editor.on('keydown', (function (e) {
                        var tinyMceEditor = tinyMCE.get(e.target.id);
                        if (e.keyCode === Enums.KeyCode.Escape) {
                            var cachedMetaItem = _this.$target.data(currentMetaItemKey);
                            tinyMceEditor.setContent((cachedMetaItem.MTypeId === Enums.MetaType.HtmlSource ? Utils.htmlEncode(cachedMetaItem.Value) : cachedMetaItem.Value));
                            tinyMceEditor.setDirty(false);
                            tinyMceEditor.targetElm.blur();
                            return false; // Prevent event propagation. If we return true (or omit this line), tinyMceEditor.isDirty() returns true in blur event handler
                        }
                        else if (e.keyCode === Enums.KeyCode.Enter) {
                            if (_this.$target.data(currentMetaItemKey).EditMode === Enums.PropertyEditorMode.PlainTextEditor) {
                                // User hit 'enter' while in text mode. Blur editor to trigger save. Do nothing for HTML mode to allow user to move to next line.
                                tinyMceEditor.targetElm.blur();
                                return false;
                            }
                        }
                        return true;
                    }));
                }
            };
            tinyMCE.init(tinyMcePlainTextOptions);
            if (this.data.App.License >= Enums.LicenseLevel.HomeNonprofit) {
                // Don't bother setting up the HTML editor for expired trials and the free version. This code won't do anything anyway since
                // the server won't send any meta properties with editMode=3 (HTML editor).
                var tinyMceHtmlOptions = Utils.deepCopy(tinyMcePlainTextOptions);
                tinyMceHtmlOptions.selector = "#" + this.data.Settings.MediaClientId + " section[data-editMode=3]";
                tinyMceHtmlOptions.plugins = ['code autolink image link textcolor placeholder'];
                tinyMceHtmlOptions.image_advtab = true; // Add advanced tab to image editor
                tinyMceHtmlOptions.verify_html = false; // Use Gallery Server's scrubber. When verify_html is ommitted or set to true, tinyMCE strips out invalid elements, but only on the client. 
                tinyMceHtmlOptions.toolbar1 = 'formatselect fontsizeselect forecolor backcolor image';
                tinyMceHtmlOptions.toolbar2 = 'undo redo | code bold italic link | alignleft aligncenter alignright | bullist numlist indent';
                delete tinyMceHtmlOptions.forced_root_block; // Remove forced_root_block setting to force it to inherit default value
                tinyMCE.init(tinyMceHtmlOptions);
            }
        };
        GsMedia.prototype.animateMediaObject = function () {
            var _this = this;
            var hideMediaObject = function (moEl) {
                // If it is an image and a transition is specified, then hide the media object container so that it
                // can later be shown with the transition effect. Returns true when object is hidden; otherwise returns false.
                var isImage = _this.data.MediaItem.ItemType === Enums.ItemType.Image;
                var hasTransition = _this.data.Settings.TransitionType !== 'none';
                if (isImage && hasTransition) {
                    // Explicitly set the height of the parent element so that the page doesn't reflow when the media object is hidden.
                    // Line commented out 2012-06-05 because it added a vertical scrollbar and no longer seemed required
                    //moEl.parent().height(moEl.parent().height());
                    moEl.hide();
                    return true;
                }
                else {
                    return false;
                }
            };
            var anEl = $('.gsp_moContainer', this.$target);
            if (hideMediaObject(anEl)) {
                // Valid:  'none', 'fade', 'blind', 'bounce', 'clip', 'drop', 'explode', 'fold', 'highlight', 'puff', 'pulsate', 'scale', 'shake', 'size', 'slide', 'transfer'.
                switch (this.data.Settings.TransitionType) {
                    case 'none':
                        anEl.show();
                        break;
                    case 'fade':
                        anEl.fadeIn(this.data.Settings.TransitionDurationMs);
                        break;
                    default:
                        var options = {};
                        // Some effects have required parameters
                        if (this.data.Settings.TransitionType === 'scale')
                            options = { percent: 100 };
                        anEl.toggle(this.data.Settings.TransitionType, options, this.data.Settings.TransitionDurationMs);
                        break;
                }
            }
        };
        GsMedia.prototype.showPreviousMediaObject = function (e) {
            if (typeof tinyMCE !== 'undefined' && tinyMCE.activeEditor) {
                tinyMCE.activeEditor.destroy();
            }
            this.data.MediaItem = this.getPreviousMediaObject();
            if (this.data.MediaItem) {
                if (e)
                    e.preventDefault(); // Prevent the event from bubbling (prevents hyperlink navigation on next/previous buttons)
                this.data.ActiveGalleryItems = [Utils.convertMediaItemToGalleryItem(this.data.MediaItem)];
                $("#" + this.data.Settings.ClientId + "_moid").val(this.data.MediaItem.Id.toString());
                this.setSize();
                this.render(); // Re-bind the template
                this.$target.trigger('previous.' + this.data.Settings.ClientId, [this.data.ActiveGalleryItems]);
            }
            else
                this.redirectToAlbum();
        };
        GsMedia.prototype.showNextMediaObject = function (e) {
            if (typeof tinyMCE !== 'undefined' && tinyMCE.activeEditor) {
                tinyMCE.activeEditor.destroy();
            }
            this.data.MediaItem = this.getNextMediaObject();
            if (this.data.MediaItem == null && this.data.Settings.SlideShowLoop) {
                // Set media item to the first image
                if (this.data.Album.MediaItems.length > 0) {
                    var mo = this.data.Album.MediaItems[0];
                    while (mo && mo.MimeType !== Enums.MimeType.Image) {
                        mo = this.data.Album.MediaItems[$.inArray(mo, this.data.Album.MediaItems) + 1];
                    }
                    this.data.MediaItem = mo;
                }
            }
            if (this.data.MediaItem) {
                if (e)
                    e.preventDefault(); // Prevent the event from bubbling (prevents hyperlink navigation on next/previous buttons)
                this.data.ActiveGalleryItems = [Utils.convertMediaItemToGalleryItem(this.data.MediaItem)];
                $("#" + this.data.Settings.ClientId + "_moid").val(this.data.MediaItem.Id.toString());
                this.setSize();
                this.render(); // Re-bind the template
                this.$target.trigger("next." + this.data.Settings.ClientId, [this.data.ActiveGalleryItems]);
            }
            else
                this.redirectToAlbum();
        };
        GsMedia.prototype.showMediaObject = function (id) {
            this.data.MediaItem = Utils.findMediaItem(this.data, id);
            if (this.data.MediaItem) {
                this.data.ActiveGalleryItems = [Utils.convertMediaItemToGalleryItem(this.data.MediaItem)];
                $("#" + this.data.Settings.ClientId + "_moid").val(this.data.MediaItem.Id.toString());
                this.setSize();
                this.render(); // Re-bind the template
                this.$target.trigger("mediaUpdate." + this.data.Settings.ClientId, [this.data.ActiveGalleryItems]);
            }
            else
                this.redirectToAlbum();
        };
        GsMedia.prototype.getPreviousMediaObject = function () {
            return this.data.Album.MediaItems[$.inArray(this.data.MediaItem, this.data.Album.MediaItems) - 1];
        };
        GsMedia.prototype.getNextMediaObject = function () {
            if (this.data.Settings.SlideShowIsRunning) {
                // Return the next *image* media object
                var mo = this.data.MediaItem;
                do {
                    mo = this.data.Album.MediaItems[$.inArray(mo, this.data.Album.MediaItems) + 1];
                } while (mo && mo.MimeType !== Enums.MimeType.Image);
                return mo;
            }
            else {
                // Return the next media object
                return this.data.Album.MediaItems[$.inArray(this.data.MediaItem, this.data.Album.MediaItems) + 1];
            }
        };
        GsMedia.prototype.redirectToAlbum = function () {
            window.location.href = Utils.GetAlbumUrl(this.data.Album.Id, true);
        };
        ;
        GsMedia.prototype.runMediaObjectScript = function () {
            if (this.data.MediaItem.Views[this.data.MediaItem.ViewIndex].ScriptOutput.length > 0) {
                (new Function((this.data.MediaItem.Views[this.data.MediaItem.ViewIndex].ScriptOutput)))();
            }
        };
        GsMedia.prototype.getPermalink = function (id) {
            return Utils.GetUrl(document.location.href, { moid: id });
        };
        ;
        GsMedia.prototype.overwriteMediaObject = function () {
            // Overwrite the this.Data.MediaItem object that was parsed from JSON with the equivalent object from the collection. We do this so that
            // we can later use $.inArray to find the current item in the array.
            for (var i = 0; i < this.data.Album.MediaItems.length; i++) {
                if (this.data.Album.MediaItems[i].Id === this.data.MediaItem.Id) {
                    this.data.MediaItem = this.data.Album.MediaItems[i];
                    return;
                }
            }
        };
        GsMedia.prototype.attachEvents = function () {
            // This runs once when initialized, so don't wire up any events on items *inside* the template, since
            // they'll be erased when the user navigates between media objects. (Do that in attachMediaEvents())
            var _this = this;
            // Attach a handler for when a metaitem is updated.
            $("#" + this.data.Settings.MediaClientId).on("metaUpdate." + this.data.Settings.ClientId, function (e, gim) { _this.onMetaUpdate(e, gim); });
            this.addCursorNavigationHandler();
        };
        GsMedia.prototype.attachMediaEvents = function () {
            // This runs each time the template is rendered, so here we wire up events to any elements inside the rendered HTML.
            var _this = this;
            // Attach handlers for next/previous clicks and left/right swipes.
            $('.gsp_mvPrevBtn', this.$target).on('click', function (e) { _this.showPreviousMediaObject(e); });
            $('.gsp_mvNextBtn', this.$target).on('click', function (e) { _this.showNextMediaObject(e); });
            if (Utils.isTouchScreen) {
                $('.gsp_moContainer', this.$target).touchwipe({
                    preventDefaultEvents: false,
                    wipeLeft: function () { _this.showNextMediaObject(); },
                    wipeRight: function () { _this.showPreviousMediaObject(); }
                });
            }
        };
        GsMedia.prototype.addCursorNavigationHandler = function () {
            var _this = this;
            if (this.data.Settings.ShowMediaObjectNavigation) {
                $(document.documentElement).on("keydown." + this.data.Settings.ClientId, function (e) {
                    if ((e.target.tagName === 'INPUT') || (e.target.tagName === 'TEXTAREA'))
                        return; // Ignore when focus is in editable box
                    if (e.keyCode === Enums.KeyCode.CursorLeft)
                        _this.showPreviousMediaObject(e);
                    if (e.keyCode === Enums.KeyCode.CursorRight)
                        _this.showNextMediaObject(e);
                });
            }
        };
        GsMedia.prototype.removeCursorNavigationHandler = function () {
            $(document.documentElement).off("keydown." + this.data.Settings.ClientId);
        };
        ;
        GsMedia.prototype.onMetaUpdate = function (e, gim) {
            // Event handler for when a meta item has been updated. e is the jQuery event object; gim is the GalleryItemMeta instance.
            if (gim.MetaItem.MTypeId === Enums.MetaType.Title) {
                this.render(); // At some point we may want to move this outside the 'if' if the media template uses other metadata values
            }
            else if (gim.MetaItem.MTypeId === Enums.MetaType.HtmlSource) {
                this.render();
            }
        };
        GsMedia.prototype.preloadImages = function () {
            var _this = this;
            // Create an array of all optimized or original image URLs
            var urls = $.map(this.data.Album.MediaItems, function (mo) {
                for (var i = 0; i < mo.Views.length; i++) {
                    if ((mo.Views[i].ViewType === Enums.MimeType.Image) && (mo.Views[i].ViewSize === _this.data.Settings.MediaViewSize))
                        return mo.Views[i].Url;
                }
                return null;
            });
            // Create an image tag & set the source
            $.each(urls, function (idx, url) {
                $('<img>').attr('src', url);
            });
        };
        return GsMedia;
    }());
    //#endregion End GsMedia object
    //#region gs.gsThumbnails widget
    $.widget('gs.gsThumbnails', {
        options: {
            clientId: ''
        },
        _create: function () {
            var data = Vars[this.options.clientId].gsData;
            this.gsThumbnails = new GsThumbnails(this.element, data, this.options);
        },
        renderThumbnails: function () {
            this.gsThumbnails.renderThmbView();
        },
        selectThumbnails: function () {
            this.gsThumbnails.selectThumbnails();
        },
        deselectThumbnails: function () {
            this.gsThumbnails.deselectThumbnails();
        }
    });
    var GsThumbnails = (function () {
        function GsThumbnails(target, data, options) {
            this.hndleDom = "<div class='hndl'><span class='fa fa-arrows'></span></div>"; // The drag handle for rearranging thumbnails
            this.$target = target; // A jQuery object to receive the rendered HTML from the template.
            this.data = data;
            this.gsThumbnailsOptions = options;
            if (!this.data.Album.GalleryItems) {
                Msg.show('Cannot Render Album', "<p>Cannot render the album thumbnails. Navigate to an album and then return to this page.</p><p>You'll know you got it right when you see 'aid' In the URL's query string.</p><p>ERROR: data.Album.GalleryItems is null.</p>", { msgType: 'error', autoCloseDelay: 0 });
                return;
            }
            this.jsRenderSetup(); // Prepare jsRender for rendering
            this.attachEvents();
            this.renderThmbView();
        }
        GsThumbnails.prototype.attachEvents = function () {
            var _this = this;
            // Attach a handler for when a metaitem is updated.
            $("#" + this.data.Settings.ThumbnailClientId).on("metaUpdate." + this.data.Settings.ClientId, function (e, gim) { _this.onMetaUpdate(e, gim); });
        };
        GsThumbnails.prototype.onMetaUpdate = function (e, gim) {
            // Meta data has been updated. Let's re-render the thumbnail view so that is always shows the
            // latest data (e.g. the title/caption may have changed).
            var selItemsOld = $('.ui-selected', e.currentTarget); // Grab a reference to which thumbnails are selected
            this.renderThmbView(); // Render the template (which will wipe out the current selection)
            // Re-select thumbnails that were previously selected
            $('.thmb', this.$target).filter(function (idx, el) { return selItemsOld.is("li[data-id=" + $(el).data('id') + "][data-it=" + $(el).data('it') + "]"); })
                .addClass('ui-selected');
            // Update: I'm leaving this commented out so that user can tab from title to the next meta property (caption).
            // Trigger the selectable 'stop' event, which ultimately refreshes the UI by rebinding the right pane and the thumbnails in the center pane.
            // (Currently it has no effect on left pane, header, or media view because it's not needed)
            // Note that if the fix proposed in bugfix 44 is implemented, it will trigger this to fire when tags/people are updated,
            // causing the focus to leave the 'next tag' field, making it hard to quickly add multiple tags.
            //const s = $('.thmb', this.$target).parent().selectable('option', 'stop');
            //if (typeof (s) == 'function')
            //    s();
        };
        GsThumbnails.prototype.renderThmbView = function () {
            var albumHtml = $.render[this.data.Settings.ThumbnailTmplName](this.data);
            if (!this.renderPager(albumHtml)) {
                var $albumHtml = $(albumHtml);
                this.activateImages($albumHtml);
                this.$target.empty().append($albumHtml);
                this.configThmbs(); // Assign width & height of thumbnails, make selectable
            }
            this.configHeader();
        };
        GsThumbnails.prototype.selectThumbnails = function () {
            $('.thmb', this.$target).addClass('ui-selected');
            this.triggerThumbnailSelectionStopEvent();
        };
        GsThumbnails.prototype.deselectThumbnails = function () {
            $('.thmb', this.$target).removeClass('ui-selected');
            this.triggerThumbnailSelectionStopEvent();
        };
        /**
         * Fire the selectable stop event associated with the thumbnail selection behavior. This updates the current selection
         * in our client data (ActiveGalleryItems) and does a few other housekeeping items. See thmbSelected function for details.
         */
        GsThumbnails.prototype.triggerThumbnailSelectionStopEvent = function () {
            var s = $('.thmb', this.$target).parent().selectable('option', 'stop');
            if (typeof (s) == 'function')
                s();
        };
        GsThumbnails.prototype.configHeader = function () {
            var _this = this;
            // When user clicks header area, make the album the current item, unselect any selected thumbnails, and trigger event to be handled in meta plug-in
            $('.gsp_abm_sum', this.$target).click(function () {
                $('.thmb', _this.$target).removeClass('ui-selected');
                _this.data.ActiveGalleryItems = [Utils.convertAlbumToGalleryItem(_this.data.Album)];
                _this.$target.trigger("select." + _this.data.Settings.ClientId, [_this.data.ActiveGalleryItems]);
            });
        };
        ;
        GsThumbnails.prototype.pagerRequired = function () {
            return (this.data.Settings.PageSize > 0 && this.data.Album.GalleryItems.length > this.data.Settings.PageSize);
        };
        ;
        /**
         * If present, replace attribute 'srcDelay' with 'src'. This activates image sources, which will trigger a call to the server.
         * We start with 'srcDelay' to prevent server calls for every image in an album.
         * See https://galleryserverpro.com/get-faster-page-loading-with-on-demand-thumbnail-image-retrieval/
         */
        GsThumbnails.prototype.activateImages = function (html) {
            $('img.gsp_thmb_img', html).each(function (idx, el) {
                if (el.getAttribute('srcDelay')) {
                    el.setAttribute('src', el.getAttribute('srcDelay'));
                    el.removeAttribute('srcDelay');
                }
            });
        };
        GsThumbnails.prototype.renderPager = function (albumHtml) {
            var _this = this;
            if (!this.pagerRequired())
                return false;
            var $albumHtml = $(albumHtml);
            var $albumHtmlThmbs = $albumHtml.find('.thmb').clone();
            var $albumHtmlWithoutThmbs = $albumHtml.find('.thmb').remove().end();
            var pagerOptions = {
                format: '[< c >]',
                page: null,
                lapping: 0,
                perpage: this.data.Settings.PageSize,
                onSelect: function (pagerData, page) { return _this.onPagerSelect(pagerData, page, $albumHtmlThmbs); },
                onFormat: function (pagerData, pagerEvent) { return _this.onPagerFormat(pagerData, pagerEvent); }
            };
            // Render album template except for thumbnails (we'll add the thumbs in onSelect)
            this.$target.html($albumHtmlWithoutThmbs);
            var pgr = $();
            var pagerHtml = '<div class="gsp_pager"></div>';
            if (this.data.Settings.PagerLocation === 'Top' || this.data.Settings.PagerLocation === 'TopAndBottom') {
                pgr = $(pagerHtml).prependTo(this.$target);
            }
            if (this.data.Settings.PagerLocation === 'Bottom' || this.data.Settings.PagerLocation === 'TopAndBottom') {
                pgr = pgr.add($(pagerHtml).appendTo(this.$target));
            }
            var pager = pgr.paging(this.data.Album.GalleryItems.length, pagerOptions);
            $(window).on('hashchange', (function () {
                if (window.location.hash)
                    pager.setPage(parseInt(window.location.hash.substr(1), 10));
                else
                    pager.setPage(1); // Default to 1st page
            }));
            $(window).trigger('hashchange');
            return true;
        };
        GsThumbnails.prototype.onPagerSelect = function (pagerData, page, $albumHtmlThmbs) {
            // Retrieve the HTML for the desired slice and replace existing thumbnails with them.
            var visibleIndices = pagerData.slice; // Contains start and end indices for visible elements
            $('.thmb', this.$target).remove();
            // Get array of thumbnail elements for the desired page, then add to page DOM, and configure
            var html = $albumHtmlThmbs.slice(visibleIndices[0], visibleIndices[1]);
            this.activateImages(html);
            $('.gsp_abm_thmbs').append(html.hide().fadeIn());
            this.configThmbs();
            this.$target.trigger("page." + this.data.Settings.ClientId, this);
            return true;
        };
        GsThumbnails.prototype.onPagerFormat = function (pagerData, pagerEvent) {
            switch (pagerEvent) {
                case 'block':
                    // n and c
                    return '<span class="gsp_pagerText">' + this.data.Resource.AbmPgrStatus.format(pagerData.value, pagerData.pages) + '</span>';
                case 'next':
                    // >
                    if (pagerData.active)
                        return '<a href="#' + pagerData.value + '" title="' + this.data.Resource.AbmPgrNextTt + '">›</a>';
                    else
                        return '<span class="gsp_disabled">›</span>';
                case 'prev':
                    // <
                    if (pagerData.active)
                        return '<a href="#' + pagerData.value + '" title="' + this.data.Resource.AbmPgrPrevTt + '">‹</a>';
                    else
                        return '<span class="gsp_disabled">‹</span>';
                case 'first':
                    // [
                    if (pagerData.active)
                        return '<a href="#' + pagerData.value + '" title="' + this.data.Resource.AbmPgrFirstTt + '" class="gsp_first-child">«</a>';
                    else
                        return '<span class="gsp_disabled gsp_first-child">«</span>';
                case 'last':
                    // ]
                    if (pagerData.active)
                        return '<a href="#' + pagerData.value + '" title="' + this.data.Resource.AbmPgrLastTt + '" class="gsp_last-child">»</a>';
                    else
                        return '<span class="gsp_disabled gsp_last-child">»</span>';
                default:
                    return '';
            }
        };
        GsThumbnails.prototype.thmbSelected = function (e, ui) {
            var _this = this;
            // Get a reference to the selected gallery items, then trigger event to be handled in meta plug-in
            var selItems = $.map($('.ui-selected', this.$target), function (item) {
                var $this = $(item);
                var id = $this.data('id');
                var itemType = $this.data('it');
                // Get the gallery item that matches the thumbnail that was selected
                return $.map(_this.data.Album.GalleryItems, function (obj) { return (obj.Id === id && obj.ItemType === itemType ? obj : null); })[0];
            });
            if (this.data.Album.Permissions.EditAlbum && this.data.Album.SortById === Constants.IntMinValue) {
                if (Utils.isTouchScreen() && selItems.length === 1) {
                    $('.ui-selected', this.$target).prepend(this.hndleDom);
                }
            }
            this.data.ActiveGalleryItems = selItems.length > 0 ? selItems : [Utils.convertAlbumToGalleryItem(this.data.Album)];
            if (!(selItems.length === 1 && selItems[0].Id === Constants.IntMinValue)) {
                // User selected another thumbnail before finishing the creation of a new album. Blur the input to finish the album creation
                $('.mce-edit-focus', this.$target).blur();
            }
            this.$target.trigger("select." + this.data.Settings.ClientId, [this.data.ActiveGalleryItems]);
        };
        ;
        GsThumbnails.prototype.thmbUnselected = function (e, ui) {
            $('.hndl', ui.unselected).remove();
        };
        ;
        GsThumbnails.prototype.configThmbs = function () {
            var _this = this;
            var $thmbs = $('.thmb', this.$target);
            $thmbs.equalSize(); // Make all thumbnail tags the same width & height
            var isSinglePaneTouchScreen = Utils.isTouchScreen() && Utils.isWidthLessThan(750);
            if (!isSinglePaneTouchScreen) {
                // Use jQuery UI selectable interaction for thumbnail selection, which gives us dragging and CTRL-click multiple selection.
                // We can't use this on single pane touchscreens because it prevents the user from scrolling with their finger.
                $thmbs.parent().selectable({
                    filter: 'li',
                    cancel: 'a,.hndl,input,.mce-edit-focus',
                    stop: this.thmbSelected.bind(this),
                    unselected: this.thmbUnselected.bind(this)
                });
            }
            else {
                // We have single pane touchscreen (probably a smart phone < 750px wide). Hook into click event of thumbnail. User will only be
                // able to select one thumbnail at a time, but it's better than nothing. (see gallery.css & media.ascx)
                $thmbs.click(function (e) {
                    $thmbs.removeClass('ui-selected').filter($(e.currentTarget)).addClass('ui-selected');
                    _this.thmbSelected(e, null);
                });
            }
            // Make thumbnails sortable
            if (this.data.Album.Permissions.EditAlbum && this.data.Album.SortById === Constants.IntMinValue) {
                var onManualSort = function (e, ui) {
                    var $thmb = ui.item;
                    $thmb.addClass('gsp_wait');
                    // Get the items in their current sequence and pass that to the server's sort method.
                    var gItems = $.map($thmb.parent().children(), function (item) {
                        var $this = $(item);
                        var id = $this.data('id');
                        var itemType = $this.data('it');
                        return { Id: id, ItemType: itemType };
                    });
                    DataService.sortGalleryItems(gItems, function () {
                        // DONE callback
                        $thmb.removeClass('gsp_wait');
                    }, null, function (jqXHR) {
                        Msg.show('Cannot Save', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                    });
                };
                $thmbs
                    .css({ '-ms-touch-action': 'none', 'touch-action': 'none' }) // Required to allow dragging on touchscreens (-ms-touch-action applies to IE10 only)
                    .parent()
                    .sortable({
                    start: function (e, ui) {
                        ui.placeholder.width(ui.helper.width());
                        ui.placeholder.height(ui.helper.height());
                    },
                    stop: onManualSort,
                    scroll: true,
                    containment: 'document',
                    cursor: 'move',
                    handle: '.hndl'
                });
                // Show/hide the drag bar when a user hovers over the thumbnail, but only for non-touchscreens.
                // We use stop/unselected events to handle show/hide for touchscreens.
                if (!Utils.isTouchScreen()) {
                    $thmbs.hover(function (e) { $(e.currentTarget).prepend(_this.hndleDom); }, function (e) { $('.hndl', $(e.currentTarget)).remove(); });
                }
            }
        };
        GsThumbnails.prototype.jsRenderSetup = function () {
            var _this = this;
            // Set up converters that can strip all HTML from some text and truncate. There is a related stripHtml converter in
            // Gs.Utils.Init(). Note that the released version of jsRender may support chained converters, which would allow 
            // us to create one for stripping and one for truncating, then chain them instead of using stripHtmlAndTruncate.
            // See https://github.com/BorisMoore/jsrender/issues/127
            $.views.converters({
                stripHtmlAndTruncate: function (text) {
                    var t = text.replace(/(<[^<>]*>)/g, '');
                    var m = _this.data.Settings.MaxThmbTitleDisplayLength;
                    return (t.length > m ? Utils.escape(t.substr(0, m)) + '...' : Utils.escape(t));
                }
            });
        };
        ;
        return GsThumbnails;
    }());
    //#endregion GsThumbnails class
    //#region gspMeta plug-in
    $.fn.gspMeta = function (data, options) {
        var self = this;
        return this.each(function () {
            if (!$.data(this, 'plugin_gspMeta')) {
                var gspMeta = new GsMeta();
                gspMeta.init(self, data, options);
                $.data(this, 'plugin_gspMeta', gspMeta);
            }
        });
    };
    $.fn.gspMeta.defaults = {
        tmplName: ''
    };
    var GsMeta = (function () {
        function GsMeta() {
        }
        GsMeta.prototype.init = function (target, gsData, options) {
            this.$target = target;
            this.data = gsData;
            this.settings = $.extend({}, $.fn.gspMeta.defaults, options);
            this.bindData();
            // Bind to next, previous, and mediaUpdated events from the GspMedia plug-in so that we can refresh the metadata.
            $("#" + this.data.Settings.MediaClientId).on('next.' + this.data.Settings.ClientId + ' previous.' + this.data.Settings.ClientId + ' mediaUpdate.' + this.data.Settings.ClientId, $.proxy(this.showMeta, this));
            // Bind to the select event from the gsThumbnails plug-in so we can refresh the metadata.
            $("#" + this.data.Settings.ThumbnailClientId).on('select.' + this.data.Settings.ClientId, $.proxy(this.showMeta, this)); // $.proxy(this.showMeta, this) *or* e => this.showMeta(e) *or* this.showMeta.bind(this) http://stackoverflow.com/questions/12756423/
        };
        GsMeta.prototype.bindData = function () {
            var _this = this;
            // Render the right pane template to the page DOM
            this.$target.removeClass('gsp_wait').html($.render[this.settings.tmplName](this.data));
            // Add separator row between the top and bottom sections of the metadata table
            $('.gsp_m1Row:last').after('<tr class="gsp_mSep"><td colspan="2"></td></tr>');
            var hasExistingMetaItems = this.data.ActiveMetaItems.length > 0;
            var hasEditPermission = function (callback) {
                // Determine if user has edit permission to ActiveGalleryItems. Since this calculation may involve an async post to the server,
                // instead of returning a boolean we take a callback function and pass the result (as a boolean) to the function.
                // If any of the selected items are a media object, verify user has EditMediaObject perm.
                // If any of the selected items are an album, verify user has EditAlbum perm.
                var hasAlbum, hasMediaItem;
                $.each(_this.data.ActiveGalleryItems, function (i, gItem) {
                    if (gItem.IsAlbum)
                        hasAlbum = true;
                    else
                        hasMediaItem = true;
                });
                var canEdit = ((!hasAlbum || _this.data.Album.Permissions.EditAlbum) && (!hasMediaItem || _this.data.Album.Permissions.EditMediaObject));
                var isVirtualAlbum = _this.data.Album.VirtualType !== Enums.VirtualAlbumType.NotVirtual;
                var isChildSelected = (_this.data.ActiveGalleryItems.length >= 0 && _this.data.ActiveGalleryItems[0].Id !== _this.data.Album.Id);
                if (!canEdit && isVirtualAlbum && isChildSelected && _this.data.User.IsAuthenticated) {
                    // Logged-on user is looking at a virtual album and has limited permissions. User may have edit permission to the 
                    // particular items that are selected, so make a callback to see.
                    DataService.canUserEdit(_this.data.ActiveGalleryItems, null, function (canEditFromServer) {
                        // SUCCESS callback: Send result from server to callback function passed to this function
                        callback.apply(_this, [canEditFromServer]);
                    }, function (jqXHR) {
                        Msg.show('Cannot Determine User Permission', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                    });
                }
                else {
                    callback.apply(_this, [canEdit]);
                }
                //return canEdit;
            };
            if (hasExistingMetaItems) {
                hasEditPermission(function (canUserEdit) {
                    if (canUserEdit) {
                        _this.makeMetaEditable();
                    }
                    else {
                        _this.convertTagsToLinks();
                    }
                });
            }
            this.configureRating();
        };
        GsMeta.prototype.convertTagsToLinks = function () {
            var _this = this;
            // Look for the comma-separated tags (they have CSS class names gsp_mtag & gsp_mpeople) and convert them to hyperlinks.
            $.each(['tag', 'people'], function (i, tagType) {
                // Find the tag or people tag, but not if it's been previously made editable (we won't do anything in those cases)
                var tagContainer = $('.gsp_meta tr td.gsp_m' + tagType, _this.$target);
                // Build HTML links to represent the tags.
                var html = $.map(tagContainer.text().split(','), function (item) {
                    var tag = item.trim();
                    if (tag.length > 0) {
                        var parms = { title: null, tag: null, people: null, search: null, latest: null, filter: null, rating: null, top: null, aid: null, moid: null };
                        parms[tagType] = tag.replace(/\s+\(\d+\)$/gi, ''); // Strip off the trailing count (e.g ' (3)') if present
                        return "<a href=\"" + Utils.GetUrl(window.location.href, parms) + "\" class=\"gsp_mtaglink\">" + tag + "</a>";
                    }
                    return null;
                });
                tagContainer.text('').html(html.join('')); // Replace text with HTML links
            });
        };
        GsMeta.prototype.configureRating = function () {
            var _this = this;
            // Get rating element. Gets a match ONLY when the admin has configured the rating meta item as editable.
            var editableRatingEls = $('tr[data-editmode=2] .gsp_rating, tr[data-editmode=3] .gsp_rating', this.$target);
            if (editableRatingEls.length > 0 && (this.data.User.IsAuthenticated || this.data.Settings.AllowAnonymousRating)) {
                // Configure an editable rating
                editableRatingEls.rateit({
                    min: 0,
                    max: 5,
                    resetable: false
                }).on('rated', function (e, v) {
                    _this.$target.addClass('gsp_wait');
                    var metaTypeId = _this.getMetaItem($(e.target).closest('.gsp_m2Row').data('id')).MTypeId;
                    var galleryItemMeta = { GalleryItems: _this.data.ActiveGalleryItems, MetaItem: { MTypeId: metaTypeId, Value: v } };
                    DataService.saveMeta(galleryItemMeta, function () { _this.$target.removeClass('gsp_wait'); }, function (gim, resMsg, ajax) {
                        // Success callback - Ajax request to rate completed. Check for validation and other errors and respond accordingly
                        switch (gim.ActionResult.Status) {
                            case 'Success':
                                _this.syncGalleryDataOnMetaUpdate(gim);
                                break;
                            case 'Info':
                            case 'Warning':
                            case 'Error':
                                Msg.show(gim.ActionResult.Title, gim.ActionResult.Message, { msgType: gim.ActionResult.Status.toLowerCase(), autoCloseDelay: 0 });
                                break;
                        }
                    }, function (jqXHR) {
                        Msg.show('Cannot Save Changes', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                    });
                });
            }
            else {
                // Configure a read-only rating
                $('.gsp_rating', this.$target).rateit({
                    min: 0,
                    max: 5,
                    resetable: false,
                    readonly: true
                });
            }
        };
        GsMeta.prototype.syncGalleryDataOnMetaUpdate = function (gim) {
            // Update related properties on albums, media objects, and their metadata when meta items are changed.
            for (var i = 0; i < gim.GalleryItems.length; i++) {
                // Update GalleryItem, MediaItem, Album, and MetaItems
                var gNew = gim.GalleryItems[i];
                var metaItems = void 0;
                // Update gallery item if present in our data
                var gCurrent = Utils.findGalleryItem(this.data, gNew.Id, gNew.ItemType);
                if (gCurrent != null) {
                    switch (gim.MetaItem.MTypeId) {
                        case Enums.MetaType.Title:
                            gCurrent.Title = gim.MetaItem.Value;
                            break;
                        case Enums.MetaType.Caption:
                            gCurrent.Caption = gim.MetaItem.Value;
                            break;
                    }
                }
                // Update media object if present in our data
                var mCurrent = Utils.findMediaItem(this.data, gNew.Id, gNew.ItemType);
                if (mCurrent != null) {
                    switch (gim.MetaItem.MTypeId) {
                        case Enums.MetaType.Title:
                            mCurrent.Title = gim.MetaItem.Value;
                            break;
                        case Enums.MetaType.HtmlSource:
                            {
                                var view = Utils.getView(mCurrent, Enums.ViewSize.External);
                                if (view)
                                    view.HtmlOutput = gim.MetaItem.Value;
                                break;
                            }
                    }
                    metaItems = mCurrent.MetaItems;
                }
                // Update album if present in our data
                if (this.data.Album != null && this.data.Album.Id === gNew.Id && gNew.ItemType === Enums.ItemType.Album) {
                    switch (gim.MetaItem.MTypeId) {
                        case Enums.MetaType.Title:
                            this.data.Album.Title = gim.MetaItem.Value;
                            break;
                        case Enums.MetaType.Caption:
                            this.data.Album.Caption = gim.MetaItem.Value;
                            break;
                    }
                    metaItems = this.data.Album.MetaItems;
                }
                // Update meta item if present in our data
                if (metaItems != null) {
                    var mi = Utils.findMetaItem(metaItems, gim.MetaItem.MTypeId);
                    if (mi != null)
                        mi.Value = gim.MetaItem.Value;
                }
                // Update meta item in our ActiveMetaItems array
                var activeMetaItem = $.grep(this.data.ActiveMetaItems, function (mi) { return (mi.MTypeId === gim.MetaItem.MTypeId); })[0];
                if (activeMetaItem != null) {
                    activeMetaItem.Value = gim.MetaItem.Value;
                }
            }
        };
        GsMeta.prototype.makeMetaEditable = function () {
            var _this = this;
            var tinyMcePlainTextOptions = {
                selector: "#" + this.data.Settings.RightPaneClientId + " tr[data-editMode=2] .gs_vv",
                menubar: false,
                inline: true,
                skin: this.data.App.Skin,
                plugins: ['placeholder'],
                toolbar: false,
                forced_root_block: false,
                verify_html: false,
                placeholder_text: this.data.Resource.MetaEditPlaceholder,
                setup: function (editor) {
                    var selectedGalleryItemsKey = 'sgi';
                    var semaphoreKey = 'sk';
                    var getMetaItemId = function ($targetElm) {
                        return $targetElm.closest('tr').data('id');
                    };
                    var getMetaItemKey = function ($targetElm) {
                        return "cmi_" + getMetaItemId($targetElm).toString();
                    };
                    editor.on('init', function (e) {
                        // Navigate to hyperlink if user clicks on one. Without this tinyMCE simply makes the area editable and doesn't send the user to the URL.
                        $(editor.getBody()).on('click', 'a[href]', function (e1) {
                            window.location.href = $(e1.currentTarget).attr('href');
                        });
                    });
                    editor.on('focus', function (e) {
                        var $targetElm = $(e.target.targetElm);
                        $targetElm.data(semaphoreKey, true);
                        _this.$target.data(selectedGalleryItemsKey, _this.data.ActiveGalleryItems);
                        var metaItem = _this.getMetaItem(getMetaItemId($targetElm));
                        _this.$target.data(getMetaItemKey($targetElm), metaItem);
                        if (metaItem.EditMode === Enums.PropertyEditorMode.PlainTextEditor) {
                            // Need to encode any HTML for plain text editing
                            var tinyMceEditor = tinyMCE.get(e.target.id);
                            tinyMceEditor.setContent(Utils.htmlEncode(metaItem.Value));
                        }
                        else if (metaItem.MTypeId === Enums.MetaType.HtmlSource) {
                            // External HTML is encoded for display, so we need to get the un-encoded value from the metadata item
                            tinyMCE.get(e.target.id).setContent(metaItem.Value);
                        }
                        // Disable left/right arrow navigation so user can use these keys while editing
                        $("#" + _this.data.Settings.MediaClientId).gsMedia('removeCursorNavigationHandler');
                    });
                    editor.on('blur', function (e) {
                        var tinyMceEditor = tinyMCE.get(e.target.id);
                        var $targetElm = $(tinyMceEditor.targetElm);
                        // If tinyMCE thinks there are changes OR more than one thumbnail was selected and the property is set to a blank value, save changes.
                        // We need the second test because one or more of the selected items may have a value that needs deleting.
                        var isDirty = tinyMceEditor.isDirty() || (_this.data.ActiveGalleryItems.length > 1 && tinyMceEditor.getContent().length === 0);
                        // Persist unsaved changes
                        if (isDirty) {
                            // Retrieve the selected gallery items. We can't use data.ActiveGalleryItems because it will be different if user made a new selection
                            // (this is because the blur event we're running right now fires after the jQuery UI selected event)
                            var selectedGalleryItems = _this.$target.data(selectedGalleryItemsKey);
                            var cachedMetaItem_2 = _this.$target.data(getMetaItemKey($targetElm));
                            var editorFormat = (cachedMetaItem_2.EditMode === Enums.PropertyEditorMode.TinyMCEHtmlEditor ? 'html' : 'text');
                            var galleryItemMeta = { GalleryItems: selectedGalleryItems, MetaItem: { MTypeId: cachedMetaItem_2.MTypeId, Value: tinyMceEditor.getContent({ format: editorFormat }) } };
                            var $parentCell_2 = $targetElm.parent().addClass('gsp_wait_center'); // This is the TD cell containing the meta value
                            DataService.saveMeta(galleryItemMeta, function () { $parentCell_2.removeClass('gsp_wait_center'); }, function (gim) {
                                // Success callback - Ajax request to save meta property completed. Check for validation and other errors and respond accordingly
                                switch (gim.ActionResult.Status) {
                                    case 'Success':
                                    case 'Info':
                                    case 'Warning':
                                        {
                                            _this.syncGalleryDataOnMetaUpdate(gim);
                                            if (cachedMetaItem_2.MTypeId === Enums.MetaType.HtmlSource) {
                                                // HTML encode the external HTML meta property so user can see HTML codes
                                                tinyMCE.get(e.target.id).targetElm.innerHTML = Utils.htmlEncode(gim.MetaItem.Value);
                                            }
                                            else if (cachedMetaItem_2.EditMode === Enums.PropertyEditorMode.PlainTextEditor) {
                                                // Editor may have been displaying HTML-encoded text, so now display the un-encoded value
                                                tinyMCE.get(e.target.id).targetElm.innerHTML = gim.MetaItem.Value;
                                            }
                                            // Trigger event to refresh the center pane. We could trigger only when title is updated since that's the only property shown
                                            // in the center in a default install, but we do it for all updates in case admin has added other properties to the center.
                                            $("#" + _this.data.Settings.MediaClientId).trigger("metaUpdate." + _this.data.Settings.ClientId, [gim]);
                                            $("#" + _this.data.Settings.ThumbnailClientId).trigger("metaUpdate." + _this.data.Settings.ClientId, [gim]);
                                            // The thumbnail 'select' event fires in between the focus and blur events, so if user selected a thumbnail while editing a meta property,
                                            // the right pane will have been re-rendered with the old meta data before this event fires. Detect this situation and trigger the
                                            // thumbnail 'select' event a second time, which will cause the right pane to be re-rendered, this time with correct meta data.
                                            // We want to fire only when necessary because if the focus is on a right pane property, it will be lost.
                                            // Step 1: Has right pane been rendered since focus event fired? Will be true when user selects any thumbnail, which causes our semaphore to disappear
                                            var rightPaneHasBeenRenderedSinceFocus = typeof $targetElm.data(semaphoreKey) === 'undefined';
                                            // Step 2: Is the last selected thumbnail one of the gallery items we just updated?
                                            var lastSelectedItemWasUpdated = function (updatedItems) {
                                                var itemWasUpdated = false;
                                                if (updatedItems.length > 0) {
                                                    updatedItems.forEach(function (gi) {
                                                        if (gi.Id === _this.data.ActiveGalleryItems[_this.data.ActiveGalleryItems.length - 1].Id) {
                                                            itemWasUpdated = true;
                                                        }
                                                    });
                                                }
                                                return itemWasUpdated;
                                            };
                                            if (rightPaneHasBeenRenderedSinceFocus && lastSelectedItemWasUpdated(gim.GalleryItems)) {
                                                $("#" + _this.data.Settings.ThumbnailClientId).trigger("select." + _this.data.Settings.ClientId, [_this.data.ActiveGalleryItems]);
                                            }
                                            break;
                                        }
                                    case 'Error':
                                        // Revert to previous value and show or hide the placeholder text.
                                        $targetElm.html(cachedMetaItem_2.Value).nextAll('label').toggle(cachedMetaItem_2.Value.length === 0);
                                        break;
                                }
                                if (gim.ActionResult.Status !== 'Success') {
                                    Msg.show(gim.ActionResult.Title, gim.ActionResult.Message, { msgType: gim.ActionResult.Status.toLowerCase(), autoCloseDelay: 0 });
                                }
                            }, function (jqXHR) {
                                // Revert to previous value and show or hide the placeholder text.
                                $targetElm.html(cachedMetaItem_2.Value).nextAll('label').toggle(cachedMetaItem_2.Value.length === 0);
                                Msg.show('Cannot Save Changes', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                            });
                        }
                        // Restore left/right arrow navigation
                        $("#" + _this.data.Settings.MediaClientId).gsMedia('addCursorNavigationHandler');
                    });
                    editor.on('keydown', (function (e) {
                        var tinyMceEditor = tinyMCE.get(e.target.id);
                        if (e.keyCode === Enums.KeyCode.Escape) {
                            var cachedMetaItem = _this.$target.data(getMetaItemKey($(tinyMceEditor.targetElm)));
                            tinyMceEditor.setContent((cachedMetaItem.MTypeId === Enums.MetaType.HtmlSource ? Utils.htmlEncode(cachedMetaItem.Value) : cachedMetaItem.Value));
                            tinyMceEditor.setDirty(false);
                            tinyMceEditor.targetElm.blur();
                            return false; // Prevent event propagation. If we return true (or omit this line), tinyMceEditor.isDirty() returns true in blur event handler
                        }
                        else if (e.keyCode === Enums.KeyCode.Enter) {
                            if (_this.$target.data(getMetaItemKey($(tinyMceEditor.targetElm))).EditMode === Enums.PropertyEditorMode.PlainTextEditor) {
                                // User hit 'enter' while in text mode. Blur editor to trigger save. Do nothing for HTML mode to allow user to move to next line.
                                tinyMceEditor.targetElm.blur();
                                return false;
                            }
                        }
                        return true;
                    }));
                }
            };
            tinyMCE.init(tinyMcePlainTextOptions);
            if (this.data.App.License >= Enums.LicenseLevel.HomeNonprofit) {
                // Don't bother setting up the HTML editor for expired trials and the free version. This code won't do anything anyway since
                // the server won't send any meta properties with editMode=3 (HTML editor).
                var tinyMceHtmlOptions = Utils.deepCopy(tinyMcePlainTextOptions);
                tinyMceHtmlOptions.selector = "#" + this.data.Settings.RightPaneClientId + " tr[data-editMode=3] section";
                tinyMceHtmlOptions.plugins = ['code autolink image link textcolor placeholder'];
                tinyMceHtmlOptions.image_advtab = true; // Add advanced tab to image editor
                tinyMceHtmlOptions.verify_html = false; // Use Gallery Server's scrubber. When verify_html is ommitted or set to true, tinyMCE strips out invalid elements, but only on the client. 
                tinyMceHtmlOptions.toolbar1 = 'formatselect fontsizeselect forecolor backcolor image';
                tinyMceHtmlOptions.toolbar2 = 'undo redo | code bold italic link | alignleft aligncenter alignright | bullist numlist indent';
                delete tinyMceHtmlOptions.forced_root_block; // Remove forced_root_block setting to force it to inherit default value
                tinyMCE.init(tinyMceHtmlOptions);
            }
            // Get the tag value, stripping off trailing count if present. Ex: If tag="Animal (3)", change it to "Animal".
            // The parameter 'e' is expected to be a jQuery reference to the li element containing the tag.
            var getTagValue = function (e) { return e.contents()
                .filter(function (idx, el) { return (el.nodeType === 3); })
                .text().trim().replace(/\s+\(\d+\)$/gi, ''); };
            // Configure the tag/people properties
            $('.gsp_ns .gsp_meta tr[data-editmode=2] .gsp_mtag,.gsp_ns .gsp_meta tr[data-editmode=2] .gsp_mpeople').each(function (idx, el) {
                $(el).html("<input class='' value='" + Utils.escape($(el).text()) + "' placeholder='" + _this.data.Resource.MetaEditPlaceholder + "' />");
                var initComplete = false;
                var ipt = $('input', $(el));
                var tagType = ipt.closest('.gsp_mtag').length > 0 ? 'tags' : 'people';
                ipt.autoSuggest(Vars.AppRoot + '/api/meta/' + tagType, {
                    extraParams: "&galleryId=" + _this.data.Settings.GalleryId,
                    preFill: ipt.val(),
                    minChars: 1,
                    startText: '',
                    selectionClick: function (e) {
                        // User clicked the tag. Navigate to a page showing all objects with that tag.
                        var tagValue = e.parents('.gsp_mtag').length === 0 ? null : getTagValue(e);
                        var peopleValue = e.parents('.gsp_mpeople').length === 0 ? null : getTagValue(e);
                        window.location.href = Utils.GetUrl(window.location.href, { title: null, tag: tagValue, people: peopleValue, search: null, latest: null, filter: null, rating: null, top: null, aid: null, moid: null });
                    },
                    selectionAdded: function (e) {
                        if (initComplete) {
                            e.addClass('gsp_wait_spinner');
                            var newTag = e.contents()
                                .filter(function (idx2, el2) { return (el2.nodeType === 3); })
                                .text().trim();
                            var metaTypeId = _this.getMetaItem(e.closest('.gsp_mRowDtl').data('id')).MTypeId;
                            var galleryItemMeta = { GalleryItems: _this.data.ActiveGalleryItems, MetaItem: { MTypeId: metaTypeId, Value: newTag } };
                            DataService.saveMeta(galleryItemMeta, function () { e.removeClass('gsp_wait_spinner'); }, function (gim) {
                                // Success callback - Ajax request to save tag/person completed. Check for validation and other errors and respond accordingly
                                switch (gim.ActionResult.Status) {
                                    case 'Success':
                                    case 'Info':
                                    case 'Warning':
                                        if (_this.data.MediaItem != null) {
                                            // When showing a single media object, update the data object's meta value so it is available during next/previous browsing
                                            var mi = Utils.findMetaItem(_this.data.MediaItem.MetaItems, gim.MetaItem.MTypeId);
                                            if (mi != null)
                                                mi.Value += ', ' + gim.MetaItem.Value;
                                        }
                                        if (_this.data.ActiveGalleryItems.length > 1) {
                                            // Append the count to the end of the tag value showing how many of the selected items have that tag (e.g. "Vacation (12)")
                                            var textNode = e.contents().filter(function (idx3, el3) { return el3.nodeType === 3; })[0];
                                            textNode.textContent = textNode.textContent + ' (' + _this.data.ActiveGalleryItems.length + ')';
                                        }
                                        // Uncomment the following to trigger the metaUpdata event in the media or thumbnail view. We have it commented out because it
                                        // causes the media/thumbnail view to be re-rendered, triggering a flash, and serving no useful purpose in a stock installation.
                                        //$(`#${me.data.Settings.MediaClientId}`).trigger(`metaUpdate.${me.data.Settings.ClientId}`, [gim]);
                                        //$(`#${me.data.Settings.ThumbnailClientId}`).trigger(`metaUpdate.${me.data.Settings.ClientId}`, [gim]);
                                        break;
                                }
                                if (gim.ActionResult.Status !== 'Success') {
                                    Msg.show(gim.ActionResult.Title, gim.ActionResult.Message, { msgType: gim.ActionResult.Status.toLowerCase(), autoCloseDelay: 0 });
                                }
                            }, function (jqXHR) {
                                Msg.show('Cannot Save Changes', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                            });
                        }
                    },
                    selectionRemoved: function (e) {
                        e.animate({ opacity: .2 }, 'slow', function () { e.addClass('gsp_wait_spinner'); });
                        // Get the tag value, stripping off trailing count if present. Ex: If tag="Animal (3)", change it to "Animal".
                        var newTag = getTagValue(e);
                        var metaTypeId = _this.getMetaItem(e.closest('.gsp_mRowDtl').data('id')).MTypeId;
                        var galleryItemMeta = { GalleryItems: _this.data.ActiveGalleryItems, MetaItem: { MTypeId: metaTypeId, Value: newTag } };
                        DataService.deleteMeta(galleryItemMeta, null, function () {
                            // Success callback
                            e.remove();
                            if (_this.data.MediaItem != null) {
                                // When showing a single media object, update the data object's meta value so it is available during next/previous browsing
                                var mi = Utils.findMetaItem(_this.data.MediaItem.MetaItems, metaTypeId);
                                if (mi != null) {
                                    // Remove the tag from the comma separated list of tags
                                    mi.Value = $.grep(mi.Value.split(/\s*,\s*/), function (tag, i) { return (tag !== newTag); }).join(', ');
                                }
                            }
                            $("#" + _this.data.Settings.MediaClientId).trigger("metaUpdate." + _this.data.Settings.ClientId, [galleryItemMeta]);
                            $("#" + _this.data.Settings.ThumbnailClientId).trigger("metaUpdate." + _this.data.Settings.ClientId, [galleryItemMeta]);
                        }, function (jqXHR) {
                            Msg.show('Cannot Save Changes', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                        });
                    }
                });
                initComplete = true;
            });
        };
        GsMeta.prototype.getMetaItem = function (id) {
            // Find the meta item with the specified ID.
            return $.grep(this.data.ActiveMetaItems, function (mi) { return (mi.Id === id); })[0];
        };
        GsMeta.prototype.showMeta = function (e, gItems) {
            var _this = this;
            // gItems is an array of GalleryItem objects. It should be the same reference as data.ActiveGalleryItems
            this.$target.addClass('gsp_wait'); // Show wait animated gif
            // Are we showing the meta for the current media item?
            var showMetaForMediaItem = (gItems != null) && (gItems.length === 1) && (gItems[0].ItemType !== Enums.ItemType.Album) && (this.data.MediaItem != null) && (this.data.MediaItem.Id === gItems[0].Id);
            if (showMetaForMediaItem && this.data.MediaItem.MetaItems) {
                // We already have the meta items on the client, so grab them, bind and return (no need to get them from server).
                this.data.ActiveMetaItems = this.data.MediaItem.MetaItems;
                this.bindData();
                return;
            }
            if (gItems == null || gItems.length < 1) {
                // No gallery items have been passed. It is not expected that we'll get here, but just in case, clear out the active
                // meta items and re-bind.
                this.data.ActiveMetaItems = [];
                this.bindData();
            }
            else if (gItems.length === 1) {
                // A single gallery item is selected.
                var i = gItems[0];
                if (i.Id === Constants.IntMinValue) {
                    // User is viewing a virtual album and clicked in the album area. Bind to the meta items we already have on the client.
                    this.data.ActiveMetaItems = this.data.Album.MetaItems;
                    this.bindData();
                }
                else {
                    // Get meta items from server and show.
                    var gt = (i.ItemType === Enums.ItemType.Album ? 'albums' : 'mediaitems');
                    var url = Vars.AppRoot + '/api/' + gt + '/' + i.Id + '/meta';
                    DataService.getAsJson(url, null, null, function (metaItems) {
                        // Success callback
                        _this.data.ActiveMetaItems = metaItems;
                        if (_this.data.MediaItem != null) {
                            _this.data.MediaItem.MetaItems = metaItems;
                        }
                        _this.bindData();
                    }, function (jqXHR) {
                        _this.$target.removeClass('gsp_wait');
                        Msg.show('Cannot Retrieve Data From Server', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                    });
                }
            }
            else {
                // More than one gallery item has been passed. Send the items to the server so we can get a merged list of meta.
                DataService.getMeta(gItems, null, function (metaItems) {
                    _this.data.ActiveMetaItems = metaItems;
                    if (_this.data.MediaItem != null)
                        _this.data.MediaItem.MetaItems = metaItems;
                    _this.bindData();
                }, function (jqXHR) {
                    Msg.show('Cannot Retrieve Data', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                });
            }
        };
        return GsMeta;
    }());
    //#endregion
    //#region gs.gsHeader widget
    $.widget('gs.gsHeader', {
        options: {
            clientId: ''
        },
        _create: function () {
            this.gsHeader = new GsHeader(this.element, Vars[this.options.clientId].gsData);
            this.gsHeader.initialize();
        }
    });
    //#endregion gs.gsHeader widget
    //#region gsHeader class
    var GsHeader = (function () {
        function GsHeader(target, data) {
            var _this = this;
            this.viewSizeClick = function (e) {
                var $trigger = $(e.currentTarget).parent().siblings('.gs_rbn_hm_vs').removeClass('gs_rbn_tab_slctd').end().addClass('gs_rbn_tab_slctd');
                // Handle event when user selects a new size from the media view size dropdown under the view all ribbon button. Update UI so
                // requested media asset size is displayed.
                var viewSize = parseInt($trigger.data('size'), 10);
                if (viewSize === _this.data.Settings.MediaViewSize) {
                    return true; // Nothing has changed, so just return
                }
                _this.data.Settings.MediaViewSize = viewSize;
                // Replace the current media item with the requested size, plus preload any images in the album.
                $("#" + _this.data.Settings.MediaClientId).gsMedia('render').gsMedia('preloadImages'); // Has no effect when on thumbnails page
                _this.data.User.GalleryId = _this.data.Album.GalleryId;
                _this.data.User.MediaViewSize = _this.data.Settings.MediaViewSize;
                _this.data.User.SlideShowType = _this.data.Settings.SlideShowType;
                _this.data.User.SlideShowLoop = _this.data.Settings.SlideShowLoop;
                DataService.saveCurrentUserProfile(_this.data.User, null, null, function (jqXHR) {
                    Msg.show('Could not update user profile', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                });
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.selectClick = function (e) {
                // User clicked 'All' or 'None'. Select or deselect thumbnails.
                var action = $(e.currentTarget).data('action') === 'select' ? 'selectThumbnails' : 'deselectThumbnails';
                $("#" + _this.data.Settings.ThumbnailClientId).gsThumbnails(action);
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.slideShowOptionsClick = function (e) {
                var $trigger = $(e.currentTarget).addClass('gs_rbn_tab_slctd');
                var $dg = $('.gs_rbn_hm_ss_mr_dlg', _this.$target);
                if ($dg.is(':ui-dialog')) {
                    if ($dg.dialog('isOpen')) {
                        $dg.dialog('close');
                        $trigger.removeClass('gs_rbn_tab_slctd').find('.fa').removeClass('fa-rotate-180');
                        return false;
                    }
                }
                else {
                    // First time user clicked 'more' button. Wire up events.
                    $('.gs_rbn_mr_dlg_ss_type', $dg).on('change', function (e1) {
                        // Handle event when user selects a new slide show type under the slide show ribbon button.
                        _this.data.Settings.SlideShowType = parseInt(e1.currentTarget.value, 10);
                        _this.data.User.GalleryId = _this.data.Album.GalleryId;
                        _this.data.User.MediaViewSize = _this.data.Settings.MediaViewSize;
                        _this.data.User.SlideShowType = _this.data.Settings.SlideShowType;
                        _this.data.User.SlideShowLoop = _this.data.Settings.SlideShowLoop;
                        DataService.saveCurrentUserProfile(_this.data.User, null, null, function (jqXHR) {
                            Msg.show('Could not update user profile', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                        });
                        return true;
                    });
                    $('.gs_rbn_mr_dlg_ss_loop', $dg).on('click', function (e1) {
                        // Handle event when user toggles the loop checkbox under the slide show ribbon button.
                        _this.data.Settings.SlideShowLoop = $(e1.currentTarget).prop('checked');
                        _this.data.User.GalleryId = _this.data.Album.GalleryId;
                        _this.data.User.MediaViewSize = _this.data.Settings.MediaViewSize;
                        _this.data.User.SlideShowType = _this.data.Settings.SlideShowType;
                        _this.data.User.SlideShowLoop = _this.data.Settings.SlideShowLoop;
                        DataService.saveCurrentUserProfile(_this.data.User, null, null, function (jqXHR) {
                            Msg.show('Could not update user profile', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                        });
                        return true;
                    });
                }
                $dg.dialog({
                    appendTo: "#" + _this.data.Settings.HeaderClientId,
                    autoOpen: true,
                    draggable: false,
                    resizable: false,
                    closeOnEscape: true,
                    classes: { 'ui-dialog': 'gs_rbn_mr_dlg_container' },
                    width: 320,
                    minHeight: 0,
                    show: 'fade',
                    hide: 'fade',
                    position: { my: "left top", at: "left bottom", of: $trigger },
                    open: function (e1, ui) {
                        $(document).on('click', function (e2) {
                            // We want to close the dialog for any click outside the dialog or the 'more' button
                            if ($(e2.target).parents('.gs_rbn_mr_dlg_container,.gs_rbn_hm_ss').length === 0) {
                                $dg.dialog('close');
                                $trigger.removeClass('gs_rbn_tab_slctd').find('.fa').removeClass('fa-rotate-180');
                                $(document).unbind(e2);
                            }
                        });
                    },
                    close: function (e1, ui) {
                        // Revert arrow. We don't really need this code in the other two places, but we leave them there because this event has a noticable lag to it (at least in Chrome)
                        $trigger.removeClass('gs_rbn_tab_slctd').find('.fa').removeClass('fa-rotate-180');
                    }
                });
                $('.fa', $trigger).addClass('fa-rotate-180');
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.slideShowClick = function (e) {
                if (_this.data.Settings.SlideShowIsRunning) {
                    $("#" + _this.data.Settings.MediaClientId).gsMedia('stopSlideshow');
                    $('.gs_rbn_hm_ss_icon', $(e.currentTarget)).removeClass('fa-pause').addClass('fa-eject fa-rotate-90');
                }
                else if (_this.data.MediaItem != null) {
                    // User on media view page, so start slide show
                    $("#" + _this.data.Settings.MediaClientId).gsMedia('startSlideshow');
                    if (_this.data.Settings.SlideShowIsRunning && _this.data.Settings.SlideShowType === Enums.SlideShowType.Inline) {
                        // Change slide show icon to 'pause' icon. This isn't needed for fullscreen slideshows.
                        $('.gs_rbn_hm_ss_icon', $(e.currentTarget)).removeClass('fa-eject fa-rotate-90').addClass('fa-pause');
                    }
                }
                else {
                    // User on thumbnail page, so send the user to the media view page of the first image in this album, including
                    // the 'ss=1' query string parm that will trigger an auto slide show when the page loads.
                    var findFirstImage = function () {
                        if (_this.data.Album != null && _this.data.Album.GalleryItems != null)
                            return $.grep(_this.data.Album.GalleryItems, function (gi) { return (gi.ItemType === Enums.ItemType.Image); })[0];
                        else
                            return null;
                    };
                    var img = findFirstImage();
                    if (img != null) {
                        var qs = { aid: null, moid: null, ss: '1' };
                        qs.moid = img.Id;
                        window.location.href = Utils.GetUrl(document.location.href, qs);
                    }
                    else
                        Msg.show(_this.data.Resource.MoNoSsHdr, _this.data.Resource.MoNoSsBdy, { msgType: 'info' });
                }
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.downloadClick = function (e) {
                var $trigger = $(e.currentTarget).addClass('gs_rbn_tab_slctd');
                var $dg = $('.gs_rbn_hm_dl_mr_dlg', _this.$target);
                if ($dg.is(':ui-dialog')) {
                    if ($dg.dialog('isOpen')) {
                        $dg.dialog('close');
                        $trigger.removeClass('gs_rbn_tab_slctd');
                        return false;
                    }
                }
                else {
                    // First time user clicked 'Download' button. Wire up events.
                    $('.chkCheckUncheckAll', $dg).on('click', _this.toggleThumbnailSelection);
                    $('.gs_rbn_hm_dl_btn', $dg).button();
                    $('.gs_rbn_hm_dl_btn', $dg).click(function (e1) {
                        // User clicked 'download media asset button'. If a single media asset is selected, give that to user as a simple download.
                        // If more than one media asset or an album is selected, give the user a zip file.
                        // If no thumbnail has been selected, inform user
                        if (document.getElementById(_this.data.Settings.ThumbnailClientId) !== null && $("#" + _this.data.Settings.ThumbnailClientId + " .thmb.ui-selected").length === 0) {
                            Msg.show('No Thumbnail Selected', 'Select one or more thumbnails and try again.', { msgType: 'warning' });
                            return false;
                        }
                        var mediaSize = parseInt($('.gs_rbn_mr_dlg_mv_size', $dg).val(), 10);
                        if (_this.data.ActiveGalleryItems.length === 1 && _this.data.ActiveGalleryItems[0].ItemType !== Enums.ItemType.Album) {
                            // Single media asset selected.
                            var mi = _this.data.ActiveGalleryItems[0];
                            if (mi.ItemType === Enums.ItemType.External && mediaSize !== Enums.ViewSize.Thumbnail) {
                                Msg.show('Download not available', 'External media objects cannot be downloaded. However, the source HTML can be accessed in the right pane.', { msgType: 'info', autoCloseDelay: 0 });
                            }
                            else {
                                // Get URL from the desired media size, then append sa=1 to it
                                var assetView = Utils.getView(mi, mediaSize);
                                document.location.href = assetView.Url + "&sa=1";
                                $dg.dialog('close');
                                $trigger.removeClass('gs_rbn_tab_slctd');
                            }
                        }
                        else {
                            // Either an album or multiple items are selected. Use zip processor. We have to make 2 API calls, the first is a POST to generate the zip.
                            // The 2nd is a GET request we can assign to document.location.href. (We could've used 1 call if we could send all our data in a GET request.)
                            $(e1.currentTarget).siblings('.gs_rbn_hm_dl_btn_lbl').toggleClass('gsp_invisible');
                            DataService.prepareZipDownload(_this.data.ActiveGalleryItems, mediaSize, function () {
                                // DONE callback
                                $(e1.currentTarget).siblings('.gs_rbn_hm_dl_btn_lbl').toggleClass('gsp_invisible');
                                $dg.dialog('close');
                                $trigger.removeClass('gs_rbn_tab_slctd');
                            }, function (actionResult) {
                                // SUCCESS callback - Ajax request to generate ZIP successfull. Check for validation and other errors and respond accordingly
                                switch (actionResult.Status) {
                                    case 'Success':
                                        document.location.href = Utils.AddQSParm(Vars.AppRoot + '/api/mediaitems/downloadzip', 'filename', actionResult.ActionTarget);
                                        break;
                                    default:
                                        Msg.show(actionResult.Title, actionResult.Message, { msgType: actionResult.Status.toLowerCase(), autoCloseDelay: 0 });
                                        break;
                                }
                            }, function (jqXHR) {
                                Msg.show('Cannot Download', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                            });
                        }
                        return false;
                    });
                }
                $dg.dialog({
                    appendTo: "#" + _this.data.Settings.HeaderClientId,
                    autoOpen: true,
                    draggable: false,
                    resizable: false,
                    closeOnEscape: true,
                    classes: { 'ui-dialog': 'gs_rbn_mr_dlg_container' },
                    width: 320,
                    minHeight: 0,
                    show: 'fade',
                    hide: 'fade',
                    position: { my: 'left top', at: 'left bottom', of: $trigger },
                    open: function (e1, ui) {
                        $(document).on('click', function (e2) {
                            // We want to close the dialog for any click outside the dialog or the 'more' button
                            if ($(e2.target).parents('.gs_rbn_mr_dlg_container,.gs_rbn_hm_dl').length === 0) {
                                $dg.dialog('close');
                                $trigger.removeClass('gs_rbn_tab_slctd');
                                $(document).unbind(e2);
                            }
                        });
                    },
                    close: function (e1, ui) {
                        $trigger.removeClass('gs_rbn_tab_slctd');
                    }
                });
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.shareClick = function (e) {
                var $trigger = $(e.currentTarget).addClass('gs_rbn_tab_slctd');
                var $dg = $('.gs_rbn_hm_sh_mr_dlg', _this.$target);
                if ($dg.is(':ui-dialog')) {
                    if ($dg.dialog('isOpen')) {
                        $dg.dialog('close');
                        $trigger.removeClass('gs_rbn_tab_slctd');
                        return false;
                    }
                }
                //else {
                //    // First time user clicked 'Share' button. Wire up events.
                //}
                // Update URL & embed code to current values
                var hdr;
                var thisAssetUrl = null;
                var thisPageUrl;
                var embedCode = null;
                if (_this.data.ActiveGalleryItems.length === 1) {
                    // One item is active. Get URL to it.
                    var gi = _this.data.ActiveGalleryItems[0];
                    var albumOrAsset = gi.IsAlbum ? _this.data.Resource.RbnShAbm : _this.data.Resource.RbnShAsset;
                    if (gi.IsAlbum) {
                        thisPageUrl = Utils.GetAlbumExternalUrl(gi.Id);
                    }
                    else {
                        embedCode = Utils.GetEmbedCode(gi.Id);
                        var assetView = Utils.getView(_this.data.ActiveGalleryItems[0], _this.data.Settings.MediaViewSize);
                        if (assetView != null) {
                            thisAssetUrl = assetView.Url;
                        }
                        thisPageUrl = Utils.GetMediaExternalUrl(gi.Id);
                    }
                    hdr = albumOrAsset + " <span class='gsp_vibrant'>" + gi.Title + "</span>";
                }
                else {
                    // Multiple items are selected. Get URL to parent album instead.
                    thisPageUrl = Utils.GetAlbumExternalUrl(_this.data.Album.Id);
                    hdr = _this.data.Resource.RbnShAbm + " <span class='gsp_vibrant'>" + _this.data.Album.Title + "</span>";
                }
                $('.gs_rbn_mr_dlg_sh_hdr').html(hdr);
                $('.gs_rbn_mr_dlg_sh_ipt_url', $dg).val(thisPageUrl);
                if (thisAssetUrl != null) {
                    $('.gs_rbn_mr_dlg_asset_sh_ipt_url', $dg).val(thisAssetUrl);
                    $('.gs_rbn_mr_dlg_sh_asset_pg_hdr,.gs_rbn_mr_dlg_sh_asset_pg_dtl', $dg).show();
                }
                else {
                    $('.gs_rbn_mr_dlg_sh_asset_pg_hdr,.gs_rbn_mr_dlg_sh_asset_pg_dtl', $dg).hide();
                }
                if (embedCode != null) {
                    $('.gs_rbn_mr_dlg_sh_ipt_embed', $dg).text(embedCode);
                    $('.gs_rbn_mr_dlg_sh_html_hdr,.gs_rbn_mr_dlg_sh_html_dtl', $dg).show();
                }
                else {
                    $('.gs_rbn_mr_dlg_sh_html_hdr,.gs_rbn_mr_dlg_sh_html_dtl', $dg).hide();
                }
                $dg.dialog({
                    appendTo: "#" + _this.data.Settings.HeaderClientId,
                    autoOpen: true,
                    draggable: false,
                    resizable: false,
                    closeOnEscape: true,
                    classes: { 'ui-dialog': 'gs_rbn_mr_dlg_container' },
                    width: Utils.isWidthLessThan(420) ? Utils.getViewportWidth() : 420,
                    minHeight: 0,
                    show: 'fade',
                    hide: 'fade',
                    position: { my: 'left top', at: 'left bottom', of: $trigger },
                    open: function (e1, ui) {
                        $(document).on('click', function (e2) {
                            // We want to close the dialog for any click outside the dialog or the 'more' button
                            if ($(e2.target).parents('.gs_rbn_mr_dlg_container,.gs_rbn_hm_sh').length === 0) {
                                $dg.dialog('close');
                                $trigger.removeClass('gs_rbn_tab_slctd');
                                $(document).unbind(e2);
                            }
                        });
                    },
                    close: function (e1, ui) {
                        $trigger.removeClass('gs_rbn_tab_slctd');
                    },
                    create: function (e1, ui) { }
                });
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.sortClick = function (e) {
                var $trigger = $(e.currentTarget).addClass('gs_rbn_tab_slctd');
                var $dg = $('.gs_rbn_hm_st_mr_dlg', _this.$target);
                if ($dg.is(':ui-dialog')) {
                    if ($dg.dialog('isOpen')) {
                        $dg.dialog('close');
                        $trigger.removeClass('gs_rbn_tab_slctd');
                        return false;
                    }
                }
                else {
                    // First time user clicked 'Sort' button. Wire up events.
                    $(".gs_rbn_mr_dlg_st_btn_group a[data-sortup=" + _this.data.Album.SortUp + "]", $dg).addClass('gs_rbn_mr_dlg_st_sltd');
                    var sortAlbum = function () {
                        var persistToAlbum = (_this.data.Album.Permissions.EditAlbum && _this.data.Album.VirtualType === Enums.VirtualAlbumType.NotVirtual);
                        $('.gs_rbn_mr_dlg_st_mi_ctr .fa').removeClass('fa-check').parent().filter("[data-id=" + _this.data.Album.SortById + "]").find('.fa').addClass('fa-spinner fa-spin');
                        var album = Utils.deepCopy(_this.data.Album);
                        // Save bandwidth by lightening up our object. Keep the gallery items for virtual albums, though, because those are what the server will be sorting.
                        if (_this.data.Album.VirtualType === Enums.VirtualAlbumType.NotVirtual) {
                            album.GalleryItems = null;
                        }
                        album.MediaItems = null;
                        album.MetaItems = null;
                        album.Permissions = null;
                        DataService.sortAlbum(album, persistToAlbum, function () {
                            // DONE
                            $(".gs_rbn_mr_dlg_st_mi_ctr a[data-id=" + _this.data.Album.SortById + "] .fa").removeClass('fa-spinner fa-spin').addClass('fa-check');
                            $dg.dialog('close');
                            $trigger.removeClass('gs_rbn_tab_slctd');
                        }, function (galleryItems) {
                            // SUCCESS
                            if (_this.data.Album.GalleryItems != null) {
                                _this.data.Album.GalleryItems = galleryItems;
                                $("#" + _this.data.Settings.ThumbnailClientId).gsThumbnails('renderThumbnails'); // No effect in media view
                            }
                        }, function (jqXHR) {
                            Msg.show('Cannot Sort', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                        });
                    };
                    $('.gs_rbn_mr_dlg_st_btn', $dg).click(function (e1) {
                        // User clicked a sort direction (up or down). Highlight the selected sort direction and carry out the sort.
                        $(e1.currentTarget).addClass('gs_rbn_mr_dlg_st_sltd').siblings().removeClass('gs_rbn_mr_dlg_st_sltd');
                        var sortUp = $(e1.currentTarget).data('sortup');
                        if (_this.data.Album.SortUp !== sortUp) {
                            _this.data.Album.SortUp = sortUp;
                            sortAlbum();
                        }
                        return false;
                    });
                    // Configure the sort fields as a menu and handle the select event.
                    $('.gs_rbn_mr_dlg_st_mi_ctr', $dg).menu({
                        select: function (e1, ui) {
                            var sortById = ui.item.find('a').data('id');
                            if (sortById != null) {
                                _this.data.Album.SortById = sortById; // Get the sort ID (e.g. <li><a href='#' data-id='29'>Title</a></li>)
                                sortAlbum();
                            }
                        }
                    })
                        .find("a[data-id=" + _this.data.Album.SortById + "] .fa").addClass('fa-check'); // Add a checkbox to the current sort field
                }
                $dg.dialog({
                    appendTo: "#" + _this.data.Settings.HeaderClientId,
                    autoOpen: true,
                    draggable: false,
                    resizable: false,
                    closeOnEscape: true,
                    classes: { 'ui-dialog': 'gs_rbn_mr_dlg_container' },
                    width: 320,
                    minHeight: 0,
                    show: 'fade',
                    hide: 'fade',
                    position: { my: 'left top', at: 'left bottom', of: $trigger },
                    open: function (e1, ui) {
                        $(document).on('click', function (e2) {
                            // We want to close the dialog for any click outside the dialog or the 'more' button
                            if ($(e2.target).parents('.gs_rbn_mr_dlg_container,.gs_rbn_hm_st').length === 0) {
                                $dg.dialog('close');
                                $trigger.removeClass('gs_rbn_tab_slctd');
                                $(document).unbind(e2);
                            }
                        });
                    },
                    close: function (e1, ui) {
                        $trigger.removeClass('gs_rbn_tab_slctd');
                    }
                });
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.createAlbumClick = function (e) {
                var $btn = $(e.currentTarget);
                if ($btn.hasClass('gs_rbn_tab_slctd'))
                    return false;
                else
                    $btn.addClass('gs_rbn_tab_slctd');
                if ($btn.parents('.gs_rbn_tab').hasClass('gsp_disabled'))
                    return false;
                var renderThmbView = function () {
                    $("#" + _this.data.Settings.ThumbnailClientId).gsThumbnails('renderThumbnails');
                };
                var thmbUrl = Vars.AppRoot + '/' + Vars.GalleryResourcesRoot + '/handler/getmedia.ashx?moid=0&dt=1&g=' + _this.data.Album.GalleryId;
                var thmb = { Width: _this.data.Settings.EmptyAlbumThmbWidth, Height: _this.data.Settings.EmptyAlbumThmbHeight, ViewSize: Enums.ViewSize.Thumbnail, ViewType: Enums.MimeType.Image, Url: thmbUrl };
                var emptyAlbum = { Id: 0, ParentId: 0, IsAlbum: true, MimeType: 0, ItemType: Enums.ItemType.Album, NumAlbums: 0, NumMediaItems: 0, Caption: '', Title: _this.data.Resource.AbmDefTitle, ViewIndex: 0, Views: [thmb] };
                _this.data.Album.GalleryItems.splice(0, 0, emptyAlbum);
                renderThmbView();
                // Configure editor in plain text mode for album title. There are a few issues with trying to use HTML mode here (thumbnails are designed not to
                // render HTML, narrow thumbnail width, broken behavior for certain commands like bullet lists), so we stick with plain text editor.
                tinyMCE.init({
                    menubar: false,
                    inline: true,
                    skin: _this.data.App.Skin,
                    selector: "#" + _this.data.Settings.ThumbnailClientId + " .gsp_abm_thmbs li:first .gsp_go_t",
                    toolbar: false,
                    forced_root_block: false,
                    setup: function (editor) {
                        editor.on('focus', function (focusEv) {
                            Utils.selectElementContents(focusEv.target.targetElm);
                        });
                        editor.on('blur', function (blurEv) {
                            var tinyMceEditor = tinyMCE.get(blurEv.target.id);
                            // Create new album
                            var album = { Title: tinyMceEditor.getContent({ format: 'text' }), ParentId: _this.data.Album.Id, GalleryId: _this.data.Album.GalleryId };
                            var $parentCell = $(blurEv.target.targetElm).addClass('gsp_wait_center');
                            DataService.createAlbum(album, function () { $parentCell.removeClass('gsp_wait_center'); }, function (actionResult) {
                                // Success callback - Ajax request to save meta property completed. Check for validation and other errors and respond accordingly
                                switch (actionResult.Status) {
                                    case 'Success':
                                    case 'Info':
                                    case 'Warning':
                                        {
                                            $btn.removeClass('gs_rbn_tab_slctd');
                                            var a = _this.data.Album.GalleryItems[0]; // Get reference to album
                                            a.Title = actionResult.ActionTarget.Title; // Update title (which may have been changed by the server (e.g. HTML removed))
                                            a.Id = actionResult.ActionTarget.Id;
                                            // Re-render, which updates the HTML (like the data-id on the li element) and the link to the album
                                            renderThmbView();
                                            // Add new album to album tree in left pane
                                            var $albumTree = $("#" + _this.data.Settings.ClientId + "_lptv").jstree(true);
                                            if ($albumTree) {
                                                $albumTree.create_node($albumTree.get_selected()[0], { text: a.Title, state: { opened: true }, a_attr: { href: Utils.GetAlbumUrl(a.Id), title: a.Title }, li_attr: { id: "tv_" + a.Id, 'data-id': a.Id } }, 'first');
                                                $albumTree.open_node($albumTree.get_selected()[0]);
                                            }
                                            break;
                                        }
                                    case 'Error':
                                        _this.data.Album.GalleryItems.gspRemove(0);
                                        renderThmbView();
                                        break;
                                }
                                if (actionResult.Status !== 'Success') {
                                    Msg.show(actionResult.Title, actionResult.Message, { msgType: actionResult.Status.toLowerCase(), autoCloseDelay: 0 });
                                }
                            }, function (jqXHR) {
                                _this.data.Album.GalleryItems.gspRemove(0);
                                renderThmbView();
                                Msg.show('Cannot Save Changes', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                            });
                        });
                        editor.on('keydown', (function (keydownEv) {
                            var tinyMceEditor = tinyMCE.get(keydownEv.target.id);
                            if (keydownEv.keyCode === Enums.KeyCode.Escape) {
                                tinyMceEditor.destroy();
                                $btn.removeClass('gs_rbn_tab_slctd');
                                _this.data.Album.GalleryItems.gspRemove(0);
                                renderThmbView();
                                return false;
                            }
                            else if (keydownEv.keyCode === Enums.KeyCode.Enter) {
                                tinyMceEditor.targetElm.blur();
                                return false;
                            }
                            return true;
                        }));
                    },
                    init_instance_callback: (function (editor) {
                        // Activate tinyMCE by giving it the focus
                        $("#" + _this.data.Settings.ThumbnailClientId + " .gsp_abm_thmbs li:first .gsp_go_t").focus();
                    })
                });
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.transferToAlbumClick = function (e) {
                var $trigger = $(e.currentTarget);
                if ($(e.currentTarget).parents('.gs_rbn_tab').hasClass('gsp_disabled'))
                    return false;
                // User clicked 'move to' or 'copy to' button. Show album tree and move/copy selected items to album when a node is selected.
                var $dg = $('.gs_rbn_mng_mt_tv_dlg', _this.$target);
                // If tree and dialog haven't yet been generated, do so now.
                if ($dg.length === 0) {
                    $dg = $("<div class='gs_rbn_mng_mt_tv_dlg gsp_dlg'><div class='gs_am_rbn_mt_tv'><div class='gsp_textcenter'><span class='fa fa-2x fa-spinner fa-pulse'></span></div></div></div>");
                    $dg.dialog({
                        appendTo: "#" + _this.data.Settings.HeaderClientId,
                        autoOpen: false,
                        draggable: false,
                        resizable: false,
                        closeOnEscape: true,
                        classes: { 'ui-dialog': 'gs_rbn_mr_dlg_container' },
                        width: Utils.isWidthLessThan(420) ? Utils.getViewportWidth() : 420,
                        minHeight: 0,
                        show: 'fade',
                        hide: 'fade',
                        //position: { my: "left top", at: "left bottom", of: $btn },
                        open: function (e1, ui) {
                            $(document).on('click', function (e2) {
                                // We want to close the dialog for any click outside the dialog
                                if ($(e2.target).parents('.gs_rbn_mr_dlg_container,.gs_rbn_mng_mt,.gs_rbn_mng_ct').length === 0) {
                                    $dg.dialog('close');
                                    $trigger.removeClass('gs_rbn_tab_slctd');
                                    $(document).unbind(e2);
                                }
                            });
                        }
                    });
                    // Call the gsTreeView plug-in, which adds an album treeview
                    var treeOptions = {
                        galleryId: (_this.data.Album.Permissions.AdministerSite || _this.data.Album.Permissions.AdministerGallery ? 'all' : _this.data.Album.GalleryId),
                        containerClientId: _this.data.Settings.ClientId,
                        treeDataUrl: Vars.GalleryResourcesRoot + '/handler/gettreeview.ashx',
                        requiredSecurityPermissions: Enums.SecurityActions.AddChildAlbum | Enums.SecurityActions.AddMediaObject,
                        albumIdsToSelect: _this.data.Album.Id
                    };
                    $('.gs_am_rbn_mt_tv', $dg).gsTreeView(null, treeOptions);
                    $('.gs_am_rbn_mt_tv', $dg).on('changed.jstree', function (e, nodeData) {
                        if (nodeData.action === 'select_node') {
                            // Add spinner icon to the right of the album text (this is removed in the complete callback below)
                            $(nodeData.event.currentTarget).append("<span class='fa fa-spinner fa-pulse gsp_addleftmargin3'></span>");
                            var transferType = _this.$target.data('transfertype'); // moveTo or copyTo. Must match Gs.DataService method.
                            var destAlbumId = parseInt(nodeData.node.li_attr['data-id'], 10);
                            // Get selected thumbnails and call API for moving or copying items
                            DataService[transferType](destAlbumId, _this.data.ActiveGalleryItems, function () {
                                // Always callback - remove spinner icon
                                $(nodeData.event.currentTarget).find('.fa-spinner').remove();
                            }, function (actionResult, ajaxResult, ajaxObj) {
                                // Success callback - Ajax request to move/copy items successfully completed. Check for validation and other errors and respond accordingly
                                switch (actionResult.Status) {
                                    case 'Success':
                                        Msg.show(actionResult.Title, actionResult.Message, { msgType: 'success' });
                                        if (transferType === 'moveTo' && _this.data.Album.VirtualType === Enums.VirtualAlbumType.NotVirtual) {
                                            // We moved items from a physical album, so remove them from the client-side data and update the screen
                                            if (_this.data.MediaItem != null) {
                                                // Media view
                                                Utils.removeMediaItem(_this.data, _this.data.MediaItem);
                                                $("#" + _this.data.Settings.MediaClientId).gsMedia('showNextMediaObject');
                                            }
                                            else if (_this.data.Album.GalleryItems != null && destAlbumId !== _this.data.Album.Id) {
                                                // Thumbnail view - Remove items from current album and rebind, but only when the destination album is NOT the current album.
                                                Utils.removeGalleryItems(_this.data, _this.data.ActiveGalleryItems);
                                                // Select the current album so its metadata shows up in the right pane
                                                _this.data.ActiveGalleryItems = [Utils.convertAlbumToGalleryItem(_this.data.Album)];
                                                $("#" + _this.data.Settings.ThumbnailClientId).gsThumbnails('renderThumbnails');
                                            }
                                            // Since we have new ActiveGalleryItems, raise the select event, which will show their meta in the right pane
                                            $("#" + _this.data.Settings.ThumbnailClientId).trigger("select." + _this.data.Settings.ClientId, [_this.data.ActiveGalleryItems]);
                                        }
                                        else if (transferType === 'copyTo') {
                                            // If we copied items to the current album and we're on the thumbnail view, update the client-side data and refresh the thumbnails
                                            // This will pull in the newly copied items and ensure they are sorted correctly.
                                            if (destAlbumId === _this.data.Album.Id && _this.data.Album.GalleryItems != null) {
                                                DataService.getGalleryItems(_this.data.Album.Id, null, function (galleryItems) {
                                                    _this.data.Album.GalleryItems = galleryItems;
                                                    $("#" + _this.data.Settings.ThumbnailClientId).gsThumbnails('renderThumbnails');
                                                }, function (jqXHR) {
                                                    Msg.show('Action Aborted', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                                                });
                                            }
                                        }
                                        break;
                                    default:
                                        Msg.show(actionResult.Title, actionResult.Message, { msgType: 'error', autoCloseDelay: 0 });
                                        break;
                                }
                                $dg.dialog('close');
                            }, function (jqXHR) {
                                Msg.show('Cannot Move Items', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                            });
                        }
                    });
                }
                if ($dg.dialog('isOpen')) {
                    $dg.dialog('close');
                }
                else {
                    _this.$target.data('transfertype', $trigger.data('transfertype')); // Store moveTo or copyTo on instance property (we can't access it any other way from inside the changed.jstree event)
                    $dg.dialog('option', 'hide', null).dialog('close').dialog('option', 'hide', 'fade'); // Kill, then restore fade for quicker closing
                    $dg.dialog('option', 'position', { my: 'left top', at: 'left bottom', of: $trigger });
                    $dg.dialog('option', 'close', function () { $trigger.removeClass('gs_rbn_tab_slctd'); });
                    $dg.dialog('open');
                    $trigger.addClass('gs_rbn_tab_slctd');
                }
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.replaceFileClick = function (e) {
                var hdr;
                if (_this.data.ActiveGalleryItems.length === 1 && !_this.data.ActiveGalleryItems[0].IsAlbum) {
                    // One media asset is active. Display it's title.
                    hdr = _this.data.Resource.RbnShAsset + " <span class='gsp_vibrant'>" + _this.data.ActiveGalleryItems[0].Title + "</span>";
                    $('.gs_rbn_mr_dlg_rf_hdr').html(hdr);
                }
                else {
                    // Either more than one asset is selected or an album is selected. Replace is not supported in this scenario.
                    return false;
                }
                var $trigger = $(e.currentTarget).addClass('gs_rbn_tab_slctd');
                var $dg = $('.gs_rbn_mng_rf_mr_dlg', _this.$target);
                if ($dg.is(':ui-dialog')) {
                    if ($dg.dialog('isOpen')) {
                        $dg.dialog('close');
                        $trigger.removeClass('gs_rbn_tab_slctd');
                        return false;
                    }
                }
                else {
                    $('.gs_rbn_mng_rf_btn', $dg).button({
                        disabled: true
                    });
                    var configUploader = function () {
                        var applyButtonIcon = function (iconClasses) {
                            $('.gs_rbn_mng_rf_btn', $dg).siblings('.gs_rbn_mng_rf_btn_lbl').find('.fa').attr('class', iconClasses);
                        };
                        var addDropText = function () {
                            $('.plupload_droptext', $dg).html('Drag file here');
                        };
                        var removeDropText = function () {
                            $('.plupload_droptext', $dg).html('');
                        };
                        var onFileUpload = function (e3, args) {
                            // File has been transferred to the server; now call web service to replace media asset file with this one.
                            var mediaId = _this.data.ActiveGalleryItems[0].Id;
                            DataService.replaceMediaAssetFile(mediaId, args.file.target_name, args.file.name, function () {
                                // Done handler
                            }, function (actionResult) {
                                // Success handler. Check for validation and other errors. If none, refresh URL to show image as it now exists on server.
                                var msgOptions = { msgType: actionResult.Status.toLowerCase() };
                                if (actionResult.Status === 'Warning' || actionResult.Status === 'Error') {
                                    msgOptions.autoCloseDelay = 0;
                                }
                                if (actionResult.Message != null) {
                                    Msg.show(actionResult.Title, actionResult.Message, msgOptions);
                                }
                                if (actionResult.Status === 'Success') {
                                    // Grab a reference to either the media view img element or the thumbnail view img element
                                    var $imgEl = $("#" + _this.data.Settings.MediaClientId + " .gsp_mo_img, #" + _this.data.Settings.ThumbnailClientId + " .thmb[data-id=" + mediaId + "] .gsp_thmb_img");
                                    // Remove any previous width/height.
                                    $imgEl.add($imgEl.parents('.thmb')).css({ width: '', height: '' });
                                    // If we're on the thumbnail view, set the max width. Without this, when we call equalSize() thumbs with long captions will cause the thumbnails to expand to fit the caption on a single line.
                                    if ($("#" + _this.data.Settings.ThumbnailClientId).length > 0) {
                                        $imgEl.parents('.thmb').css({ 'max-width': (_this.data.Settings.MaxThumbnailLength + 40) + 'px' });
                                    }
                                    if ($imgEl.length > 0 && typeof $imgEl.attr('src') !== 'undefined') {
                                        // Force the browser to reload the image
                                        $imgEl[0].src += "&ver=" + new Date().getTime().toString();
                                        // When the image loads, update the thumbnail borders to reflect the latest width/height
                                        if (_this.data.Album.GalleryItems && !$imgEl[0].complete) {
                                            $imgEl.load(function () {
                                                var wBuffer = (_this.data.Album.GalleryItems.length > 1 ? 0 : 20); // We only need a buffer when there's 1 asset since the other thumbnails already include a buffer.
                                                $("#" + _this.data.Settings.ThumbnailClientId + " .thmb").equalSize(wBuffer, 0);
                                            });
                                        }
                                    }
                                    else if (_this.data.ActiveGalleryItems.length === 1) {
                                        // If we get here, no image element was found. We are probably on the single media view page looking at a non-image (video, etc).
                                        // Retrieve the asset from the server and re-render.
                                        DataService.getMediaAsset(_this.data.ActiveGalleryItems[0].Id, null, function (mediaItem) {
                                            // SUCCESS callback
                                            _this.data.MediaItem = mediaItem;
                                            $("#" + _this.data.Settings.MediaClientId).gsMedia('render');
                                        }, function (jqXHR) {
                                            Msg.show('Cannot Refresh Media Asset', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                                        });
                                    }
                                    else {
                                        Msg.show('Cannot Refresh Media Asset', 'Refresh your browser to see the updated media asset.', { msgType: 'info', autoCloseDelay: 0 });
                                    }
                                    applyButtonIcon('fa fa-check gsp_msgfriendly');
                                }
                                else {
                                    applyButtonIcon('fa fa-close gsp_msgattention');
                                }
                            }, function (jqXHR) {
                                Msg.show('Cannot Replace File', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                                applyButtonIcon('fa fa-close gsp_msgattention');
                            });
                        };
                        var onComplete = function (e3, args) {
                            // Invoked when a plUpload error occurs, file has either failed to upload/be processed in some way or has successfully been uploaded and processed
                            var uploader = $('.gs_rbn_mr_dlg_rf_uploader', $dg).plupload('getUploader');
                            $.each(uploader.files, function (i, file) { return uploader.removeFile(file); });
                        };
                        var onError = function (up, args) {
                            // args.error.code can be any of these values:
                            //STOPPED:1,STARTED:2,QUEUED:1,UPLOADING:2,FAILED:4,DONE:5,GENERIC_ERROR:-100,HTTP_ERROR:-200,IO_ERROR:-300,SECURITY_ERROR:-400,INIT_ERROR:-500,FILE_SIZE_ERROR:-600,FILE_EXTENSION_ERROR:-601,IMAGE_FORMAT_ERROR:-700,IMAGE_MEMORY_ERROR:-701,IMAGE_DIMENSIONS_ERROR:-702
                            var getErrMsg = function () {
                                if (args.error.code === plupload.FILE_SIZE_ERROR) {
                                    return "File size must be less than " + args.up.settings.max_file_size + ". The file '" + args.error.file.name + "' is " + Globalize.format(args.error.file.size / 1024 / 1024, 'n1') + " MB.";
                                }
                                if (args.error.code === plupload.FILE_EXTENSION_ERROR) {
                                    return "The file '" + args.error.file.name + "' has an extension not currently allowed by the gallery configuration. If you are an administrator, you can enable this extension in the site administration.";
                                }
                                var msg = "<p>" + args.error.message + " Code " + args.error.code + ".</p>";
                                if (args.error.file != null) {
                                    msg += "<p>File: " + args.error.file.name + ".</p>";
                                }
                                if (args.error.response != null) {
                                    // Unfortunately, the response is invalid json and can't be parsed into an object, so we just show the raw text
                                    msg += "<p>HTTP response data: " + args.error.response + "</p>";
                                }
                                return msg;
                            };
                            Msg.show('Cannot Replace File', getErrMsg(), { msgType: 'error', autoCloseDelay: 0 });
                            applyButtonIcon('fa fa-close gsp_msgattention');
                        };
                        $('.gs_rbn_mr_dlg_rf_uploader', $dg).plupload({
                            browse_button: null,
                            runtimes: 'html5,silverlight,flash,html4',
                            url: '',
                            flash_swf_url: Vars.GalleryResourcesRoot + "/script/plupload/Moxie.swf",
                            silverlight_xap_url: Vars.GalleryResourcesRoot + "/script/plupload/Moxie.xap",
                            multi_selection: false,
                            //filters: <%= GetFileFilters() %>, // No easy way to specify file types here; server side logic will protect us from disabled file types
                            unique_names: true,
                            max_file_size: _this.data.Settings.MaxUploadSizeKB + " KB",
                            chunk_size: '2mb',
                            views: {
                                list: false,
                                thumbs: true,
                                active: 'thumbs'
                            },
                            uploaded: onFileUpload,
                            complete: onComplete,
                            error: onError,
                            init: {
                                FilesAdded: function (up, filesAdded) {
                                    $('.gs_rbn_mng_rf_btn', $dg).button('option', 'disabled', up.files.length !== 1);
                                    removeDropText();
                                    if (up.files.length > 1) {
                                        applyButtonIcon('fa fa-close gsp_msgattention');
                                    }
                                    else {
                                        applyButtonIcon('fa');
                                    }
                                },
                                FilesRemoved: function (up, filesRemoved) {
                                    $('.gs_rbn_mng_rf_btn', $dg).button('option', 'disabled', up.files.length !== 1);
                                    if (up.files.length === 1) {
                                        applyButtonIcon('fa');
                                    }
                                    else if (up.files.length < 1) {
                                        addDropText();
                                    }
                                }
                            }
                        });
                        addDropText();
                        var uploadFiles = function (e2) {
                            // Begin the upload of files to the server.
                            var uploader = $('.gs_rbn_mr_dlg_rf_uploader', $dg).plupload('getUploader');
                            var mediaId = _this.data.ActiveGalleryItems[0].Id;
                            var albumId = _this.data.ActiveGalleryItems[0].ParentId;
                            uploader.settings.url = Vars.GalleryResourcesRoot + "/handler/upload.ashx?aid=" + albumId + "&moid=" + mediaId;
                            // Files in queue upload them first
                            if (uploader.files.length === 1) {
                                applyButtonIcon('fa fa-spinner fa-pulse');
                                uploader.start();
                            }
                            else {
                                applyButtonIcon('fa');
                                Msg.show('Replacement canceled', 'Select or drag a single replacement file. Multiple replacement files are not supported.', { msgType: 'warning', autoCloseDelay: 0 });
                            }
                        };
                        $('.gs_rbn_mng_rf_btn', $dg).click(function (e1) {
                            // User clicked upload button
                            if (_this.data.ActiveGalleryItems.length === 1 && !_this.data.ActiveGalleryItems[0].IsAlbum) {
                                uploadFiles(e1);
                            }
                            else {
                                Msg.show('Replacement canceled', 'Multiple assets are selected or the selected asset is an album. Select a single media asset and try again.', { msgType: 'warning', autoCloseDelay: 0 });
                            }
                            e1.preventDefault();
                        });
                    };
                    var loadScripts = function (files, callback) {
                        $.getScript(files.shift(), files.length ? function () { loadScripts(files, callback); } : callback);
                    };
                    if (!jQuery().plupload) {
                        var scripts = [(Vars.GalleryResourcesRoot + "/script/plupload/plupload.full.min.js"), (Vars.GalleryResourcesRoot + "/script/plupload/jquery.ui.plupload.min.js")];
                        if (_this.data.App.IsDebugEnabled) {
                            scripts = [(Vars.GalleryResourcesRoot + "/script/plupload/moxie.js"), (Vars.GalleryResourcesRoot + "/script/plupload/plupload.dev.js"), (Vars.GalleryResourcesRoot + "/script/plupload/jquery.ui.plupload.js")];
                        }
                        loadScripts(scripts, configUploader);
                    }
                    else {
                        configUploader();
                    }
                    $('.gs_rbn_hlp_ctr span', $dg).gsTooltip({
                        title: _this.data.Resource.RbnRplTtHdr,
                        content: _this.data.Resource.RbnRplTtDtl
                    });
                }
                $dg.dialog({
                    appendTo: "#" + _this.data.Settings.HeaderClientId,
                    autoOpen: true,
                    draggable: false,
                    resizable: false,
                    closeOnEscape: true,
                    classes: { 'ui-dialog': 'gs_rbn_mr_dlg_container' },
                    width: 320,
                    minHeight: 0,
                    show: 'fade',
                    hide: 'fade',
                    position: { my: 'left top', at: 'left bottom', of: $trigger },
                    open: function (e1, ui) {
                        $(document).on('click', function (e2) {
                            // We want to close the dialog for any click outside the dialog or the 'more' button
                            if ($(e2.target).parents('.gs_rbn_mr_dlg_container,.gs_rbn_mng_rf').length === 0) {
                                $dg.dialog('close');
                                $trigger.removeClass('gs_rbn_tab_slctd');
                                $(document).unbind(e2);
                            }
                        });
                    },
                    close: function (e1, ui) {
                        $trigger.removeClass('gs_rbn_tab_slctd');
                    }
                });
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            /**
             * Show the disk space used by the original files on each thumbnail.
             */
            this.appendOriginalFileSizeUsage = function () {
                var getOriginalFileSizeString = function (gItem) {
                    // Generate a string like '(571 KB)' or '(23.7 MB)' representing the size of the original file(s) associated with the gallery item
                    var fileSizeKB = 0;
                    if (gItem.ItemType === Enums.ItemType.Album) {
                        fileSizeKB = Utils.getView(gItem, Enums.ViewSize.Original).FileSizeKB;
                    }
                    else if (Utils.hasView(gItem, Enums.ViewSize.Optimized) && Utils.hasView(gItem, Enums.ViewSize.Original)) {
                        // Media asset: return the size of the original file, but only when there's both an optimized and original file
                        fileSizeKB = Utils.getView(gItem, Enums.ViewSize.Original).FileSizeKB;
                    }
                    return fileSizeKB < 1024 ? "(" + fileSizeKB + " KB)" : "(" + Globalize.format(fileSizeKB / 1024, 'n1') + " MB)";
                };
                var appendOrUpdateThmbMsg = function ($thmb, msg) {
                    // Add msg to end of thumbnail. Re-use existing DOM element if present; otherwise add one
                    var $thmbMsg = $thmb.find('.gs_of_svgs');
                    if ($thmbMsg.length > 0) {
                        $thmbMsg.html(msg);
                    }
                    else {
                        $thmb.append("<p class='gs_of_svgs gsp_msgsuccess'>" + msg + "</p>");
                    }
                };
                var $thmbs = $("#" + _this.data.Settings.ThumbnailClientId + " .thmb");
                // Loop through each item in gallery, creating a DOM element in the thumbnail showing the file size
                $.each(_this.data.Album.GalleryItems, function (idx, gItem) {
                    var $thmb = $thmbs.filter("[data-id=" + gItem.Id + "][data-it=" + gItem.ItemType + "]");
                    if (gItem.ItemType === Enums.ItemType.Album && !Utils.hasView(gItem, Enums.ViewSize.Original)) {
                        // Call the server to request the size of original files in the album, then append.
                        $thmb.find('.gsp_go_t').addClass('gsp_wait');
                        appendOrUpdateThmbMsg($thmb, '(Estimating savings...)');
                        DataService.calculateOriginalFileSize(gItem, null, function (gItem1) {
                            gItem.Views = gItem1.Views;
                            $thmb.find('.gsp_go_t').removeClass('gsp_wait');
                            appendOrUpdateThmbMsg($thmb, getOriginalFileSizeString(gItem));
                            $thmbs.css('height', 'auto').equalHeights();
                        }, null);
                    }
                    else {
                        appendOrUpdateThmbMsg($thmb, getOriginalFileSizeString(gItem));
                    }
                });
                $thmbs.css('height', 'auto').equalHeights();
            };
            this.deleteOptionsClick = function (e) {
                var $trigger = $(e.currentTarget).addClass('gs_rbn_tab_slctd');
                var $dg = $('.gs_rbn_mng_dlt_mr_dlg', _this.$target);
                var removeOriginalFileSizaUsage = function () {
                    $("#" + _this.data.Settings.ThumbnailClientId + " .thmb").find('p.gs_of_svgs').remove().end().css('height', 'auto').equalHeights();
                };
                if ($dg.is(':ui-dialog')) {
                    if ($dg.dialog('isOpen')) {
                        $dg.dialog('close');
                        $trigger.removeClass('gs_rbn_tab_slctd').find('.fa').removeClass('fa-rotate-180');
                        return false;
                    }
                }
                else {
                    // First time user clicked 'more' button. Wire up events.
                    $('.chkCheckUncheckAll', $dg).on('click', _this.toggleThumbnailSelection);
                    $('.gs_delete_db_records_only_lbl', $dg).gsTooltip({
                        title: _this.data.Resource.RbnDelDbRcrdsTtHdr,
                        content: _this.data.Resource.RbnDelDbRcrdsTtDtl
                    });
                    $('.gs_delete_original_files_lbl', $dg).gsTooltip({
                        title: _this.data.Resource.RbnDelOrgTtHdr,
                        content: _this.data.Resource.RbnDelOrgTtDtl
                    });
                    $('.gs_delete_db_records_only, .gs_delete_original_files', $dg).on('click', function (e1) {
                        // User clicked one of the checkboxes in the delete options dialog.
                        if ($(e1.currentTarget).hasClass('gs_delete_db_records_only')) {
                            // User clicked 'Delete DB records only'.
                            $('.gs_delete_original_files', $dg).prop('checked', false); // Deselect the other checkbox.
                            // Remove (if present) the original file sizes that were added in showOriginalFileSizaUsage()
                            removeOriginalFileSizaUsage();
                        }
                        else {
                            // User clicked 'Delete original files'.
                            $('.gs_delete_db_records_only', $dg).prop('checked', false); // Deselect the other checkbox.
                            // Toggle the the potential disk savings below the thumbnail image
                            if (_this.data.Album.GalleryItems != null) {
                                $('.gs_delete_original_files', $dg).prop('checked') ? _this.appendOriginalFileSizeUsage() : removeOriginalFileSizaUsage();
                            }
                        }
                        //return true;
                    });
                }
                $dg.dialog({
                    appendTo: "#" + _this.data.Settings.HeaderClientId,
                    autoOpen: true,
                    draggable: false,
                    resizable: false,
                    closeOnEscape: true,
                    classes: { 'ui-dialog': 'gs_rbn_mr_dlg_container' },
                    width: 'auto',
                    minHeight: 0,
                    show: 'fade',
                    hide: 'fade',
                    position: { my: "left top", at: "left bottom", of: $trigger },
                    open: function (e1, ui) {
                        $(document).on('click', function (e2) {
                            // We want to close the dialog for any click outside the dialog or the 'more' button
                            if ($(e2.target).parents('.gs_rbn_mr_dlg_container,.gs_rbn_mng_dlt').length === 0) {
                                $dg.dialog('close');
                                $trigger.removeClass('gs_rbn_tab_slctd').find('.fa').removeClass('fa-rotate-180');
                                $(document).unbind(e2);
                            }
                        });
                    },
                    close: function (e1, ui) {
                        // Revert arrow. We don't really need this code in the other two places, but we leave them there because this event has a noticable lag to it (at least in Chrome)
                        $trigger.removeClass('gs_rbn_tab_slctd').find('.fa').removeClass('fa-rotate-180');
                        //$('.fa', $trigger).removeClass('fa-rotate-180');
                    }
                });
                $('.fa', $trigger).addClass('fa-rotate-180');
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.toggleThumbnailSelection = function (e) {
                var $chk = $(e.target);
                var isChecked = $chk.data('ischecked'); // true when we want to check all; otherwise false
                if (isChecked) {
                    $chk.text(_this.data.Resource.ThmbSltAll);
                    $("#" + _this.data.Settings.ThumbnailClientId).gsThumbnails('deselectThumbnails');
                }
                else {
                    $chk.text(_this.data.Resource.ThmbSltNone);
                    $("#" + _this.data.Settings.ThumbnailClientId).gsThumbnails('selectThumbnails');
                }
                $chk.data('ischecked', !isChecked);
                return true;
            };
            this.deleteClick = function (e) {
                var DeletionMode;
                (function (DeletionMode) {
                    DeletionMode[DeletionMode["Unknown"] = 0] = "Unknown";
                    DeletionMode[DeletionMode["Delete"] = 1] = "Delete";
                    DeletionMode[DeletionMode["DeleteOriginalFiles"] = 2] = "DeleteOriginalFiles";
                    DeletionMode[DeletionMode["DeleteDbRecordsOnly"] = 3] = "DeleteDbRecordsOnly";
                })(DeletionMode || (DeletionMode = {}));
                ;
                var getDeletionMode = function () {
                    var $dgDltOptions = $('.gs_rbn_mng_dlt_mr_dlg', _this.$target);
                    if ($('.gs_delete_original_files', $dgDltOptions).prop('checked')) {
                        return DeletionMode.DeleteOriginalFiles;
                    }
                    else if ($('.gs_delete_db_records_only', $dgDltOptions).prop('checked')) {
                        return DeletionMode.DeleteDbRecordsOnly;
                    }
                    else {
                        return DeletionMode.Delete;
                    }
                };
                /**
                 * Generate the message to display to the user in the delete confirmation dialog.
                 */
                var getDeleteConfirmMsg = function () {
                    var delMode = getDeletionMode();
                    var isParentAlbumSelected = _this.data.ActiveGalleryItems.length === 1 && _this.data.ActiveGalleryItems[0].Id === _this.data.Album.Id;
                    var isVirtualAlbum = _this.data.Album.VirtualType !== Enums.VirtualAlbumType.NotVirtual;
                    if (isParentAlbumSelected && (isVirtualAlbum || delMode === DeletionMode.DeleteOriginalFiles)) {
                        // If the user hasn't selected anything and the album is virtual or user is deleting original files, select all child items
                        $("#" + _this.data.Settings.ThumbnailClientId).gsThumbnails('selectThumbnails');
                    }
                    var isSingleMediaAsset = _this.data.ActiveGalleryItems.length === 1 && _this.data.ActiveGalleryItems[0].ItemType !== Enums.ItemType.Album;
                    var isSingleAlbum = _this.data.ActiveGalleryItems.length === 1 && _this.data.ActiveGalleryItems[0].ItemType === Enums.ItemType.Album;
                    var numAlbums = _this.data.ActiveGalleryItems.filter(function (gi) { return gi.ItemType === Enums.ItemType.Album; }).length;
                    var numMediaAssets = _this.data.ActiveGalleryItems.length - numAlbums;
                    switch (delMode) {
                        case DeletionMode.DeleteOriginalFiles:
                            {
                                // Items with something to delete will have a viewSize=2
                                var sumFileSizesKB = 0;
                                $.each(_this.data.ActiveGalleryItems, function (indx, gi) {
                                    var isAlbumWithOriginal = (gi.ItemType === Enums.ItemType.Album) && Utils.hasView(gi, Enums.ViewSize.Original);
                                    var isMediaAssetWithOriginal = (gi.ItemType !== Enums.ItemType.Album) && Utils.hasView(gi, Enums.ViewSize.Optimized) && Utils.hasView(gi, Enums.ViewSize.Original);
                                    if (isAlbumWithOriginal || isMediaAssetWithOriginal) {
                                        sumFileSizesKB += Utils.getView(gi, Enums.ViewSize.Original).FileSizeKB;
                                    }
                                });
                                var sumFileSizesStr = sumFileSizesKB < 1024 ? sumFileSizesKB + " KB" : Globalize.format(sumFileSizesKB / 1024, 'n1') + " MB";
                                return "<p>The original file" + (numAlbums + numMediaAssets === 1 ? '' : 's') + " for " + numMediaAssets + " media asset" + (numMediaAssets === 1 ? '' : 's') + " and " + numAlbums + " child album" + (numAlbums === 1 ? '' : 's') + " will be permanently deleted, but the items will stay in the gallery along with their thumbnail and optimized files.</p><p class='gsp_msgfriendly'>This is expected to free up " + sumFileSizesStr + " of disk space.</p>";
                            }
                        case DeletionMode.DeleteDbRecordsOnly:
                            {
                                var msg;
                                if (isSingleMediaAsset) {
                                    msg = "<p>The media asset '" + Utils.removeHtmlTags(_this.data.ActiveGalleryItems[0].Title) + "' will be removed from the gallery but the original file will be left in its current location.</p>";
                                }
                                else if (isSingleAlbum) {
                                    msg = "<p>The album '" + Utils.removeHtmlTags(_this.data.ActiveGalleryItems[0].Title) + "' and its contents will be removed from the gallery but the original directory and files will be left in their current location.</p>";
                                }
                                else {
                                    msg = "<p>" + numMediaAssets + " media asset" + (numMediaAssets === 1 ? '' : 's') + " and " + numAlbums + " album" + (numAlbums === 1 ? '' : 's') + " will be removed from the gallery but the original directories and files will be left in their current location.</p>";
                                }
                                return msg + '<p class=\'gsp_msgfriendly\'>You can add them back at a later time with the synchronize function.</p>';
                            }
                        case DeletionMode.Delete:
                        default:
                            {
                                if (isSingleMediaAsset) {
                                    return "<p class='gsp_msgwarning'>The media asset '" + Utils.removeHtmlTags(_this.data.ActiveGalleryItems[0].Title) + "' will be permanently deleted.</p>";
                                }
                                else if (isSingleAlbum) {
                                    return "<p class='gsp_msgwarning'>The album '" + Utils.removeHtmlTags(_this.data.ActiveGalleryItems[0].Title) + "' will be permanently deleted.</p>";
                                }
                                else {
                                    return "<p class='gsp_msgwarning'>" + numMediaAssets + " media asset" + (numMediaAssets === 1 ? '' : 's') + " and " + numAlbums + " album" + (numAlbums === 1 ? '' : 's') + " will be permanently deleted.</p>";
                                }
                            }
                    }
                };
                /**
                 * Generate the text to apply to the delete confirmation button
                 */
                var getDeleteConfirmBtnLbl = function () {
                    switch (getDeletionMode()) {
                        case DeletionMode.DeleteOriginalFiles: return 'Delete original media files';
                        case DeletionMode.DeleteDbRecordsOnly: return 'Delete from gallery';
                        default: return 'Delete';
                    }
                };
                var deleteGalleryItems = function () {
                    var keepFiles = $('.gs_delete_db_records_only', _this.$target).prop('checked');
                    DataService.deleteGalleryItems(_this.data.ActiveGalleryItems, !keepFiles, function () {
                        // Always callback
                        $('.gs_rbn_mng_dlt', _this.$target).removeClass('gsp_wait');
                    }, function (actionResult, ajaxResult, ajaxObj) {
                        // Success callback - Ajax request to delete items successfully completed. Check for validation and other errors and respond accordingly
                        var msgOptions = { msgType: actionResult.Status.toLowerCase() };
                        if (actionResult.Status === 'Warning' || actionResult.Status === 'Error') {
                            msgOptions.autoCloseDelay = 0;
                        }
                        Msg.show(actionResult.Title, actionResult.Message, msgOptions);
                        // We deleted items, so remove them from the client-side data and update the screen. Note that we remove all items even if one or 
                        // more weren't actually deleted on the server (e.g. permission denied). Could refactor in future so that only successful deletions
                        // are removed, but this isn't important enough to do now.
                        if (_this.data.MediaItem != null) {
                            // Media view
                            Utils.removeMediaItem(_this.data, _this.data.MediaItem);
                            $("#" + _this.data.Settings.MediaClientId).gsMedia('showNextMediaObject');
                        }
                        else if (_this.data.Album.GalleryItems != null) {
                            var deletedItems = actionResult.ActionTarget;
                            // Thumbnail view
                            if (_this.data.ActiveGalleryItems.length === 1 && _this.data.ActiveGalleryItems[0].Id === _this.data.Album.Id && deletedItems.length === _this.data.ActiveGalleryItems.length) {
                                // User deleted current album. Redirect to parent album.
                                window.location.href = Utils.AddQSParm(Utils.GetAlbumUrl(_this.data.Album.ParentId), 'msg', String(Enums.MessageType.AlbumSuccessfullyDeleted));
                                return;
                            }
                            else {
                                // User deleted one or more items within the album. Remove from client data and rebind.
                                Utils.removeGalleryItems(_this.data, deletedItems);
                                // Select the current album so its metadata shows up in the right pane
                                _this.data.ActiveGalleryItems = [Utils.convertAlbumToGalleryItem(_this.data.Album)];
                                $("#" + _this.data.Settings.ThumbnailClientId).gsThumbnails('renderThumbnails');
                            }
                        }
                        // Since we have new ActiveGalleryItems, raise the select event, which will show their meta in the right pane
                        $("#" + _this.data.Settings.ThumbnailClientId).trigger("select." + _this.data.Settings.ClientId, [_this.data.ActiveGalleryItems]);
                    }, function (jqXHR) {
                        Msg.show('Cannot Delete Items', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                    });
                };
                var deleteOriginalFiles = function () {
                    DataService.deleteOriginalFiles(_this.data.ActiveGalleryItems, function () {
                        // Always callback
                        $('.gs_rbn_mng_dlt', _this.$target).removeClass('gsp_wait');
                    }, function (actionResult, ajaxResult, ajaxObj) {
                        // Success callback - Ajax request to delete original files successfully completed. Check for validation and other errors and respond accordingly
                        var msgOptions = { msgType: actionResult.Status.toLowerCase() };
                        if (actionResult.Status === 'Warning' || actionResult.Status === 'Error') {
                            msgOptions.autoCloseDelay = 0;
                        }
                        Msg.show(actionResult.Title, actionResult.Message, msgOptions);
                        $.each(actionResult.ActionTarget, function (idx, giServer) {
                            // ActionTarget contains the successfully processed items. Find the matching items in our client data and update the original file size.
                            var giLocal = Utils.findGalleryItem(_this.data, giServer.Id, giServer.ItemType);
                            var origDTLocal = Utils.getView(giLocal, Enums.ViewSize.Original);
                            var origDTFromServer = Utils.getView(giServer, Enums.ViewSize.Original);
                            if (origDTLocal != null && origDTFromServer != null) {
                                origDTLocal.FileSizeKB = origDTFromServer.FileSizeKB;
                            }
                            // Now update the UI to reflect the new file sizes
                            _this.appendOriginalFileSizeUsage();
                        });
                    }, function (jqXHR) {
                        Msg.show('Cannot Delete Original Files', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                    });
                };
                var $dg = $('.gs_rbn_mg_dlt_confirm_dlg', _this.$target);
                if (!$dg.is(':ui-dialog')) {
                    // First time user clicked delete button. Wire up our events and configured the dialog.
                    $dg.dialog({
                        appendTo: "#" + _this.data.Settings.HeaderClientId,
                        resizable: true,
                        width: Utils.isWidthLessThan(420) ? Utils.getViewportWidth() : 420,
                        modal: true,
                        show: 'fade',
                        hide: 'fade',
                        position: { my: 'center top', at: 'right bottom', of: $(e.currentTarget) }
                    });
                    $('.ui-dialog-buttonset button', $dg).button();
                    // Wire up event for user confirming item deletion
                    $('.gs_rbn_mg_dlt_confirm_dlt_btn', $dg).on('click', function (e1) {
                        $dg.dialog('close');
                        $('.gs_rbn_mng_dlt', _this.$target).addClass('gsp_wait');
                        if ($('.gs_delete_original_files', _this.$target).prop('checked')) {
                            deleteOriginalFiles();
                        }
                        else {
                            deleteGalleryItems();
                        }
                        //$('.gs_rbn_mng_dlt', this.$target).removeClass('gsp_wait');
                    });
                    // Wire up event for user cancelling item deletion
                    $('.gs_rbn_mg_dlt_confirm_cncl_btn', $dg).on('click', function (e1) { $dg.dialog('close'); });
                }
                $('.gs_rbn_mg_dlt_confirm_msg', $dg).html(getDeleteConfirmMsg());
                $('.gs_rbn_mg_dlt_confirm_dlt_btn', $dg).text(getDeleteConfirmBtnLbl());
                $dg.dialog('open');
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.assignThumbnailOptionsClick = function (e) {
                if ($(e.currentTarget).parents('.gs_rbn_tab').hasClass('gsp_disabled'))
                    return false;
                // User clicked assign thumbnail options. Show album tree.
                var $trigger = $(e.currentTarget).addClass('gs_rbn_tab_slctd');
                var $dg = $('.gs_rbn_mng_at_mr_dlg', _this.$target);
                if ($dg.is(':ui-dialog')) {
                    if ($dg.dialog('isOpen')) {
                        $dg.dialog('close');
                        $trigger.removeClass('gs_rbn_tab_slctd').find('.fa').removeClass('fa-rotate-180');
                        return false;
                    }
                }
                else {
                    // First time user clicked 'more' button. Call the gsTreeView plug-in, which adds an album treeview
                    var treeOptions = {
                        galleryId: _this.data.Album.GalleryId,
                        containerClientId: _this.data.Settings.ClientId,
                        treeDataUrl: Vars.GalleryResourcesRoot + '/handler/gettreeview.ashx',
                        numberOfLevels: 2,
                        requiredSecurityPermissions: Enums.SecurityActions.EditAlbum,
                        albumIdsToSelect: _this.data.Album.Id
                    };
                    $('.gs_rbn_at_tv', $dg).gsTreeView(null, treeOptions);
                    $('.gs_rbn_at_tv', $dg).on('changed.jstree', function (e, nodeData) {
                        if (nodeData.action === 'select_node') {
                            // Add spinner icon to the right of the album text (this is removed in the complete callback below)
                            $(nodeData.event.currentTarget).append("<span class='fa fa-spinner fa-pulse gsp_addleftmargin3'></span>");
                            $('.gs_rbn_mng_thmb .gs_rbn_btn', _this.$target).click();
                        }
                    });
                    $('.gs_rbn_hlp_ctr span', $dg).gsTooltip({
                        title: _this.data.Resource.RbnThmbTtHdr,
                        content: _this.data.Resource.RbnThmbTtDtl
                    });
                }
                $dg.dialog({
                    appendTo: "#" + _this.data.Settings.HeaderClientId,
                    autoOpen: true,
                    draggable: false,
                    resizable: false,
                    closeOnEscape: true,
                    classes: { 'ui-dialog': 'gs_rbn_mr_dlg_container' },
                    width: 'auto',
                    minHeight: 0,
                    show: 'fade',
                    hide: 'fade',
                    position: { my: 'left top', at: 'left bottom', of: $trigger },
                    open: function (e1, ui) {
                        $(document).on('click', function (e2) {
                            // We want to close the dialog for any click outside the dialog or the 'more' button
                            if ($(e2.target).parents('.gs_rbn_mr_dlg_container,.gs_rbn_mng_thmb').length === 0) {
                                $dg.dialog('close');
                                $trigger.removeClass('gs_rbn_tab_slctd').find('.fa').removeClass('fa-rotate-180');
                                $(document).unbind(e2);
                            }
                        });
                    },
                    close: function (e1, ui) {
                        // Revert arrow. We don't really need this code in the other two places, but we leave them there because this event has a noticable lag to it (at least in Chrome)
                        $trigger.removeClass('gs_rbn_tab_slctd').find('.fa').removeClass('fa-rotate-180');
                    }
                });
                $('.fa', $trigger).addClass('fa-rotate-180');
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.assignThumbnailClick = function (e) {
                // Grab the thumbnail for the first selected asset and assign it as the thumbnail for the current album or the specified album
                var closeAssignThmbDialog = function () {
                    var $dg = $('.gs_rbn_mng_at_mr_dlg', _this.$target);
                    if ($dg.is(':ui-dialog') && $dg.dialog('isOpen')) {
                        $dg.dialog('close');
                        $('.fa-spinner', $dg).remove();
                    }
                };
                // If no thumbnail has been selected, inform user
                if (document.getElementById(_this.data.Settings.ThumbnailClientId) !== null && $("#" + _this.data.Settings.ThumbnailClientId + " .thmb.ui-selected").length === 0) {
                    Msg.show('No Thumbnail Selected', 'Select a thumbnail and try again.', { msgType: 'warning' });
                    closeAssignThmbDialog();
                    return false;
                }
                // If there is a selected album in the assign thumbnail treeview, use that. Otherwise use the current album.
                var albumId = _this.data.Album.Id;
                var $assignThmbAlbumTree = $($('.gs_rbn_at_tv', _this.$target)).jstree(true);
                if ($assignThmbAlbumTree) {
                    var selectedAlbumNode = $assignThmbAlbumTree.get_selected(true)[0]; // There should just be one selected album
                    if (selectedAlbumNode != null) {
                        albumId = selectedAlbumNode.li_attr['data-id'];
                    }
                }
                // If the album is virtual, inform user
                if (albumId === Constants.IntMinValue) {
                    Msg.show('No Album Selected', 'Select an album from the thumbnail options window and try again.', { msgType: 'warning' });
                    closeAssignThmbDialog();
                    return false;
                }
                DataService.assignThumbnail(_this.data.ActiveGalleryItems[0], albumId, function () {
                    // Always callback: Close assign thumbnail options dialog if open
                    closeAssignThmbDialog();
                }, function (actionResult, ajaxResult, ajaxObj) {
                    // Success callback: Ajax request to delete items successfully completed. Check for validation and other errors and respond accordingly
                    var msgOptions = { msgType: actionResult.Status.toLowerCase() };
                    if (actionResult.Status === 'Warning' || actionResult.Status === 'Error') {
                        msgOptions.autoCloseDelay = 0;
                    }
                    Msg.show(actionResult.Title, actionResult.Message, msgOptions);
                }, function (jqXHR) {
                    Msg.show('Cannot Assign Thumbnail', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                });
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.editImageClick = function (e) {
                // Make an invisible DOM element for the original version of selected image, then apply tinyMCE and invoke the mceEditImage command.
                var $editImgBtn = $(e.currentTarget).addClass('gsp_wait_center');
                var galleryItem = _this.data.ActiveGalleryItems[0];
                // Verify selected item is an image
                if (galleryItem.ItemType !== Enums.ItemType.Image) {
                    Msg.show('Image Not Selected', 'Select an image and try again.', { msgType: 'warning' });
                    $editImgBtn.removeClass('gsp_wait_center');
                    return true;
                }
                var originalView = Utils.getView(galleryItem, Enums.ViewSize.Original);
                // Verify we retrieved the original image.
                if (originalView == null || originalView.ViewSize !== Enums.ViewSize.Original) {
                    Msg.show('Image Editor Requires Original Image', 'The image editor requires access to the original, high resolution image, but it is not available. Your security settings may be preventing you from accessing it.', { msgType: 'warning', autoCloseDelay: 0 });
                    $editImgBtn.removeClass('gsp_wait_center');
                    return true;
                }
                if (!$(originalView.HtmlOutput).is('img') || !$(originalView.HtmlOutput).has('img')) {
                    // There is no image tag in the HTML - user is probably viewing an image that can't be shown in the browser (wmf, psd, etc). Abort.
                    Msg.show('Unsupported Image Type', 'The image editor supports browser-compatible images. Unfortunately, the original, high-resolution file associated with this image cannot be displayed in a browser window.', { msgType: 'warning', autoCloseDelay: 0 });
                    $editImgBtn.removeClass('gsp_wait_center');
                    return true;
                }
                // If we have DOM elements left over from a previous edit, remove now
                $('.gs_tinymce_wrapper', _this.$target).remove();
                // Create DOM element for the original we will be editing
                var $tinymceEl = $('<div>', { 'class': 'gs_tinymce_wrapper', 'style': 'display:none' }).append(originalView.HtmlOutput).appendTo(_this.$target);
                _this.makeImageEditable($tinymceEl, $editImgBtn);
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.makeImageEditable = function ($el, $editImgBtn) {
                // Show the tinyMCE image tools when the user clicks the 'Edit image' ribbon button
                if (typeof tinyMCE === 'undefined') {
                    Msg.show('tinyMCE Not Found', 'The image editor requires tinyMCE, but it was not found.', { msgType: 'warning' });
                    $editImgBtn.removeClass('gsp_wait_center');
                }
                tinyMCE.init({
                    selector: "#" + _this.data.Settings.HeaderClientId + " .gs_tinymce_wrapper",
                    menubar: false,
                    inline: true,
                    skin: _this.data.App.Skin,
                    toolbar: false,
                    plugins: 'imagetools',
                    setup: function (editor) {
                        editor.on('init', function (e) {
                            editor.selection.select($('.gsp_mo_img', $el)[0]);
                            editor.execCommand('mceEditImage');
                            $editImgBtn.removeClass('gsp_wait_center');
                        });
                    },
                    images_upload_handler: function (blobInfo, success, failure, progress) {
                        $("#" + _this.data.Settings.MediaClientId + " .gsp_mvMediaHeader, #" + _this.data.Settings.ThumbnailClientId + " .gsp_abm_sum").addClass('gsp_wait_center');
                        var galleryItem = _this.data.ActiveGalleryItems[0];
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', "gs/handler/upload.ashx?aid=" + galleryItem.ParentId + "&moid=" + galleryItem.Id);
                        xhr.withCredentials = true;
                        progress(0); // Show progress bar and initialize to 0%
                        // Fix the CSS of the progress bar so it is centered along the top. Without this it is partially hidden on the left.
                        if (tinyMCE.activeEditor.notificationManager.notifications.length > 0) {
                            tinyMCE.activeEditor.notificationManager.notifications[0].$el.css({ 'left': '50%', 'transform': 'translate(-50%, 0)' });
                        }
                        var filename = Utils.createPseudoGuid() + '.' + blobInfo.filename().split('.').pop();
                        xhr.upload.onprogress = function (e) {
                            var percentLoaded = Math.round(e.loaded / e.total * 100);
                            progress(percentLoaded);
                        };
                        xhr.onload = function () {
                            if (xhr.status !== 200) {
                                failure("HTTP Error: " + xhr.status);
                                return;
                            }
                            // Upload is successful. Now call replaceFromFile.
                            DataService.replaceWithEditedImage(galleryItem.Id, filename, function () {
                                // Done handler
                                $("#" + _this.data.Settings.MediaClientId + " .gsp_mvMediaHeader, #" + _this.data.Settings.ThumbnailClientId + " .gsp_abm_sum").removeClass('gsp_wait_center');
                                $el.remove();
                                tinyMCE.activeEditor.destroy();
                            }, function (actionResult) {
                                // Success handler. Check for validation and other errors. If none, refresh URL to show image as it now exists on server.
                                var msgOptions = { msgType: actionResult.Status.toLowerCase() };
                                if (actionResult.Status === 'Warning' || actionResult.Status === 'Error') {
                                    msgOptions.autoCloseDelay = 0;
                                }
                                if (actionResult.Message != null) {
                                    Msg.show(actionResult.Title, actionResult.Message, msgOptions);
                                }
                                if (actionResult.Status === 'Success') {
                                    // Grab a reference to either the media view img element or the thumbnail view img element
                                    var $imgEl = $("#" + _this.data.Settings.MediaClientId + " .gsp_mo_img, #" + _this.data.Settings.ThumbnailClientId + " .thmb[data-id=" + galleryItem.Id + "] .gsp_thmb_img");
                                    // Remove any previous width/height.
                                    $imgEl.add($imgEl.parents('.thmb')).css({ width: '', height: '' });
                                    // If we're on the thumbnail view, set the max width. Without this, when we call equalSize() thumbs with long captions will cause the thumbnails to expand to fit the caption on a single line.
                                    if ($("#" + _this.data.Settings.ThumbnailClientId).length > 0) {
                                        $imgEl.parents('.thmb').css({ 'max-width': (_this.data.Settings.MaxThumbnailLength + 40) + 'px' });
                                    }
                                    if ($imgEl.length > 0 && typeof $imgEl.attr('src') !== 'undefined') {
                                        $imgEl[0].src += "&ver=" + new Date().getTime().toString();
                                        // When the image loads, update the thumbnail borders to reflect the latest width/height
                                        if (_this.data.Album.GalleryItems && !$imgEl[0].complete) {
                                            $imgEl.load(function () {
                                                var wBuffer = (_this.data.Album.GalleryItems.length > 1 ? 0 : 20); // We only need a buffer when there's 1 asset since the other thumbnails already include a buffer.
                                                $("#" + _this.data.Settings.ThumbnailClientId + " .thmb").equalSize(wBuffer, 0);
                                            });
                                        }
                                    }
                                    else {
                                        Msg.show('Cannot Refresh Image', "Your changes were successfully saved on the server, but we couldn't refresh the image in your browser because an error occurred while trying to find the image element. $imgEl.length==" + $imgEl.length, { msgType: 'error', autoCloseDelay: 0 });
                                    }
                                }
                            }, function (jqXHR) {
                                Msg.show('Cannot Save Changes', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                            });
                        };
                        var formData = new FormData();
                        formData.append('name', filename);
                        formData.append('file', blobInfo.blob(), filename);
                        xhr.send(formData);
                    }
                });
            };
            this.rotateLeftClick = function (e) {
                _this.rotateFlip(Enums.RotateFlip.Rotate270FlipNone, e);
                return true;
            };
            this.rotateRightClick = function (e) {
                _this.rotateFlip(Enums.RotateFlip.Rotate90FlipNone, e);
                return true;
            };
            this.flipHorizontalClick = function (e) {
                _this.rotateFlip(Enums.RotateFlip.Rotate0FlipX, e);
                return true;
            };
            this.flipVerticalClick = function (e) {
                _this.rotateFlip(Enums.RotateFlip.Rotate0FlipY, e);
                return true;
            };
            this.rotateFlip = function (rotateFlipAmount, e) {
                // Handle the rotate/flip request the user initiated in the ribbon toolbar. This is unrelated to rotate/flip requests handled 
                // within the tinyMCE image editor.
                var getRotateFlipClassName = function () {
                    switch (rotateFlipAmount) {
                        case Enums.RotateFlip.Rotate270FlipNone:
                            return 'fa-rotate-left';
                        case Enums.RotateFlip.Rotate90FlipNone:
                            return 'fa-rotate-right';
                        case Enums.RotateFlip.Rotate0FlipX:
                            return 'fa-shield fa-rotate-270';
                        case Enums.RotateFlip.Rotate0FlipY:
                            return 'fa-shield fa-rotate-180';
                        default:
                            return null;
                    }
                };
                var getViewSize = function (galleryItems) {
                    // Get view size of first item. We assume all items have the same size (all thumbnails, optimized, or originals).
                    return galleryItems[0].Views[galleryItems[0].ViewIndex].ViewSize;
                };
                // Verify selected items are images or videos
                var selectedImagesAndVideos = $.grep(_this.data.ActiveGalleryItems, function (gi) { return (gi.ItemType === Enums.ItemType.Image || gi.ItemType === Enums.ItemType.Video); });
                if (selectedImagesAndVideos.length === 0) {
                    Msg.show('Image or Video Not Selected', 'Select an image or video and try again.', { msgType: 'warning' });
                    return;
                }
                $(e.currentTarget).find('.fa').removeClass(getRotateFlipClassName()).addClass('fa-spinner fa-spin');
                DataService.rotateFlipMediaAsset(selectedImagesAndVideos, rotateFlipAmount, getViewSize(selectedImagesAndVideos), function () {
                    // Done callback - restore icon
                    $(e.currentTarget).find('.fa').removeClass('fa-spinner fa-spin').addClass(getRotateFlipClassName());
                }, function (actionResult) {
                    // Success callback
                    var msgOptions = { msgType: actionResult.Status.toLowerCase() };
                    if (actionResult.Status === 'Warning' || actionResult.Status === 'Error') {
                        msgOptions.autoCloseDelay = 0;
                    }
                    if (actionResult.Message != null) {
                        Msg.show(actionResult.Title, actionResult.Message, msgOptions);
                    }
                    var rotatedFlippedItems = actionResult.ActionTarget;
                    $.each(rotatedFlippedItems, function (indx, galleryItem) {
                        // Grab a reference to either the media view img element or the thumbnail view img element
                        var $imgEl = $("#" + _this.data.Settings.MediaClientId + " .gsp_mo_img, #" + _this.data.Settings.ThumbnailClientId + " .thmb[data-id=" + galleryItem.Id + "] .gsp_thmb_img");
                        // Remove any previous width/height.
                        $imgEl.add($imgEl.parents('.thmb')).css({ 'width': '', 'height': '' });
                        if ($imgEl.length > 0 && typeof $imgEl.attr('src') !== 'undefined') {
                            $imgEl[0].src += "&ver=" + new Date().getTime().toString();
                            // When the image loads, update the thumbnail borders to reflect the latest width/height
                            if (_this.data.Album.GalleryItems && !$imgEl[0].complete) {
                                $imgEl.load(function () {
                                    var wBuffer = (_this.data.Album.GalleryItems.length > 1 ? 0 : 20); // We only need a buffer when there's 1 asset since the other thumbnails already include a buffer.
                                    $("#" + _this.data.Settings.ThumbnailClientId + " .thmb").equalSize(wBuffer, 0);
                                });
                            }
                        }
                    });
                }, function (jqXHR) {
                    Msg.show('Cannot Rotate/Flip', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                });
            };
            this.securityClick = function (e) {
                var $trigger = $(e.currentTarget).addClass('gs_rbn_tab_slctd');
                var $dg = $('.gs_rbn_mng_sc_mr_dlg', _this.$target);
                if ($dg.is(':ui-dialog')) {
                    if ($dg.dialog('isOpen')) {
                        $dg.dialog('close');
                        $trigger.removeClass('gs_rbn_tab_slctd');
                        return false;
                    }
                }
                else {
                    // First time user clicked 'Security' button. Wire up events.
                    $('.gs_rbn_mng_sc_isprivate_lbl', $dg).gsTooltip({
                        title: _this.data.Resource.AbmPvtHdr,
                        content: _this.data.Resource.AbmPvtDtl
                    });
                    $('.gs_rbn_mr_pvt_abm_ownr_ipt', $dg).gsTooltip({
                        title: _this.data.Resource.AbmOwnrLbl,
                        content: _this.data.Resource.AbmOwnrTtDtl
                    }).on('change', function (e1) {
                        // User changed the album owner
                        var oldAbmOwnr = _this.data.Album.Owner;
                        _this.data.Album.Owner = $(e1.currentTarget).val();
                        if (oldAbmOwnr !== _this.data.Album.Owner) {
                            $(e1.currentTarget).addClass('gsp_wait_center');
                            DataService.changeAlbumOwner(_this.data.Album.Id, _this.data.Album.Owner, function () {
                                // Done event.
                                $(e1.currentTarget).removeClass('gsp_wait_center');
                                $(e1.currentTarget).val(_this.data.Album.Owner);
                            }, function (actionResult) {
                                // Success callback: Ajax request to delete items successfully completed. Check for validation and other errors and respond accordingly
                                var msgOptions = { msgType: actionResult.Status.toLowerCase() };
                                if (actionResult.Status === 'Warning' || actionResult.Status === 'Error') {
                                    msgOptions.autoCloseDelay = 0;
                                }
                                Msg.show(actionResult.Title, actionResult.Message, msgOptions);
                                if (actionResult.Status === 'Error') {
                                    _this.data.Album.Owner = oldAbmOwnr; // Revert back
                                }
                                else {
                                    _this.data.Album.Owner = actionResult.ActionTarget; // Update to reflect correct case if necessary
                                }
                            }, function (jqXHR) {
                                _this.data.Album.Owner = oldAbmOwnr; // Revert back
                                Msg.show('Cannot Edit Album', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                            });
                        }
                    });
                    $('.gs_rbn_mng_sc_isprivate', $dg).on('change', function (e1) {
                        // User clicked 'hide this album'. Toggle IsPrivate for the album.
                        if (!_this.data.Settings.AllowAnonBrowsing) {
                            Msg.show(_this.data.Resource.AbmAnonDisabledTitle, _this.data.Resource.AbmAnonDisabledMsg, { msgType: 'warning', autoCloseDelay: 0 });
                            e1.currentTarget.checked = true;
                            return false;
                        }
                        var $lockIcon = $('.gs_isp_icn', $dg);
                        _this.data.Album.IsPrivate = e1.currentTarget.checked;
                        // Switch lock icon to spinner
                        $lockIcon.removeClass('gsp_gold').toggleClass('fa-lock fa-spinner fa-spin');
                        DataService.saveAlbum(_this.data.Album, function () {
                            // Done event.
                            $lockIcon.toggleClass('fa-lock fa-spinner fa-spin').attr('title', _this.data.Album.IsPrivate ? _this.data.Resource.AbmIsPvtTt : _this.data.Resource.AbmNotPvtTt);
                            if (_this.data.Album.IsPrivate) {
                                $lockIcon.addClass('gsp_gold');
                            }
                        }, function () {
                            // Success event
                        }, function (jqXHR) {
                            _this.data.Album.IsPrivate = e1.currentTarget.checked = !_this.data.Album.IsPrivate; // Revert back
                            Msg.show('Cannot Edit Album', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                        });
                        return false;
                    });
                }
                $dg.dialog({
                    appendTo: "#" + _this.data.Settings.HeaderClientId,
                    autoOpen: true,
                    draggable: false,
                    resizable: false,
                    closeOnEscape: true,
                    classes: { 'ui-dialog': 'gs_rbn_mr_dlg_container' },
                    width: Utils.isWidthLessThan(420) ? Utils.getViewportWidth() : 420,
                    minHeight: 0,
                    show: 'fade',
                    hide: 'fade',
                    position: { my: 'left top', at: 'left bottom', of: $trigger },
                    open: function (e1, ui) {
                        $(document).on('click', function (e2) {
                            // We want to close the dialog for any click outside the dialog or the 'more' button
                            if ($(e2.target).parents('.gs_rbn_mr_dlg_container,.gs_rbn_mng_sc').length === 0) {
                                $dg.dialog('close');
                                $trigger.removeClass('gs_rbn_tab_slctd');
                                $(document).unbind(e2);
                            }
                        });
                    },
                    close: function (e1, ui) {
                        $trigger.removeClass('gs_rbn_tab_slctd');
                    }
                });
                return true; // Allow event bubbling so other dialogs can be closed if they are open
            };
            this.$target = target; // A jQuery object to receive the rendered HTML from the template.
            this.data = data;
        }
        GsHeader.prototype.initialize = function () {
            this.renderHeader();
            this.configRibbon();
            this.configLogin();
            this.configSearch();
            $(document.documentElement).trigger("gsHeaderLoaded." + this.data.Settings.ClientId);
        };
        GsHeader.prototype.renderHeader = function () {
            this.$target.html($.render[this.data.Settings.HeaderTmplName](this.data)); // Render HTML template and add to page
        };
        GsHeader.prototype.configRibbon = function () {
            var _this = this;
            // STEP 1: Wire up button events and handle enabled/disabled state
            var isGalleryWritable = !this.data.Settings.IsReadOnlyGallery;
            // OPTIMIZED/ORIGINAL TOGGLE
            $('.gs_rbn_hm_opt .gs_rbn_btn,.gs_rbn_hm_hr .gs_rbn_btn', this.$target).on('click', this.viewSizeClick);
            // SELECT/CLEAR TOGGLE
            $('.gs_rbn_hm_slt .gs_rbn_btn', this.$target).on('click', this.selectClick);
            // SLIDE SHOW
            $('.gs_rbn_hm_ss .gs_rbn_mr', this.$target).on('click', this.slideShowOptionsClick);
            $('.gs_rbn_hm_ss .gs_rbn_btn', this.$target).on('click', this.slideShowClick);
            // DOWNLOAD
            $('.gs_rbn_hm_dl .gs_rbn_btn', this.$target).on('click', this.downloadClick);
            // SHARE
            $('.gs_rbn_hm_sh .gs_rbn_btn', this.$target).on('click', this.shareClick);
            // SORT
            $('.gs_rbn_hm_st .gs_rbn_btn', this.$target).on('click', this.sortClick);
            // CREATE ALBUM
            var createAlbumEnabled = isGalleryWritable && this.data.Album.GalleryItems != null && this.data.Album.VirtualType === Enums.VirtualAlbumType.NotVirtual && this.data.Album.Permissions.AddChildAlbum;
            if (createAlbumEnabled) {
                $('.gs_rbn_mng_ca .gs_rbn_btn', this.$target).on('click', this.createAlbumClick);
            }
            else {
                var msg = 'This function is disabled'; // Fallback text - it is expected this will be overwritten below
                if (this.data.Album.GalleryItems == null)
                    msg = 'Disabled - navigate to the album thumbnail view to create an album';
                else if (this.data.Album.VirtualType !== Enums.VirtualAlbumType.NotVirtual)
                    msg = 'Disabled because you are looking at a virtual album - navigate to a physical album to enable this function';
                else if (!this.data.Album.Permissions.AddChildAlbum)
                    msg = 'Disable because you do not have permission to create an album';
                else if (!isGalleryWritable)
                    msg = 'Disabled because the gallery is read only';
                $('.gs_rbn_mng_ca', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', msg);
            }
            // ADD MEDIA
            if (!this.data.Album.Permissions.AddMediaObject) {
                $('.gs_task_addobjects', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because you do not have permission for this action');
            }
            // MOVE TO 
            var moveToEnabled = isGalleryWritable && ((this.data.Album.Permissions.DeleteChildAlbum && this.data.User.CanAddAlbumToAtLeastOneAlbum) || (this.data.Album.Permissions.DeleteMediaObject && this.data.User.CanAddMediaToAtLeastOneAlbum));
            if (moveToEnabled) {
                $('.gs_rbn_mng_mt .gs_rbn_btn', this.$target).on('click', this.transferToAlbumClick);
            }
            else {
                $('.gs_rbn_mng_mt', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because the gallery is read only or you do not have permission for this action');
            }
            // COPY TO
            var copyToEnabled = isGalleryWritable && (this.data.Settings.AllowCopyingReadOnlyObjects ? (this.data.User.CanAddAlbumToAtLeastOneAlbum || this.data.User.CanAddMediaToAtLeastOneAlbum) : this.data.Album.Permissions.AddMediaObject);
            if (copyToEnabled) {
                $('.gs_rbn_mng_ct .gs_rbn_btn', this.$target).on('click', this.transferToAlbumClick);
            }
            else {
                $('.gs_rbn_mng_ct', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because the gallery is read only or you do not have permission for this action');
            }
            // REPLACE
            var replaceEnabled = isGalleryWritable && this.data.Album.Permissions.EditMediaObject;
            if (replaceEnabled) {
                $('.gs_rbn_mng_rf .gs_rbn_btn', this.$target).on('click', this.replaceFileClick);
            }
            else {
                $('.gs_rbn_mng_rf', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because the gallery is read only, you do not have permission for this action, or you have not selected a single media asset');
            }
            if (this.data.MediaItem == null) {
                // We're on the album (thumbnail) view. Start with button disabled. Later in this function we hook into the thumb select event to enable it as needed.
                $('.gs_rbn_mng_rf', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because the gallery is read only, you do not have permission for this action, or you have not selected a single media asset');
            }
            // DELETE
            // User requires only EditMediaObject permission when deleting the original file, so we'll enable even if user doesn't have DeleteMediaObject or DeleteMediaObject
            // permission. Server side code re-evaluates permissions and will prevent the user from deleting when she isn't supposed to.
            var deleteEnabled = isGalleryWritable && (this.data.Album.Permissions.EditMediaObject || this.data.Album.Permissions.DeleteMediaObject || this.data.Album.Permissions.DeleteChildAlbum);
            if (deleteEnabled) {
                $('.gs_rbn_mng_dlt .gs_rbn_mr', this.$target).on('click', this.deleteOptionsClick);
                $('.gs_rbn_mng_dlt .gs_rbn_btn', this.$target).on('click', this.deleteClick);
            }
            else {
                $('.gs_rbn_mng_dlt', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because the gallery is read only or you do not have permission for this action');
            }
            // THUMBNAIL
            if (this.data.User.CanEditAtLeastOneAlbum) {
                $('.gs_rbn_mng_thmb .gs_rbn_mr', this.$target).on('click', this.assignThumbnailOptionsClick);
                $('.gs_rbn_mng_thmb .gs_rbn_btn', this.$target).on('click', this.assignThumbnailClick);
            }
            else {
                $('.gs_rbn_mng_thmb', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because you do not have permission for this action');
            }
            // EDIT IMAGE
            if (isGalleryWritable && this.data.Album.Permissions.EditMediaObject) {
                $('.gs_rbn_mng_edt .gs_rbn_btn', this.$target).on('click', this.editImageClick);
                $('.gs_rbn_mng_rtfp .gs_rbn_btn.gs_rt_lt', this.$target).on('click', this.rotateLeftClick);
                $('.gs_rbn_mng_rtfp .gs_rbn_btn.gs_rt_rt', this.$target).on('click', this.rotateRightClick);
                $('.gs_rbn_mng_rtfp .gs_rbn_btn.gs_fh', this.$target).on('click', this.flipHorizontalClick);
                $('.gs_rbn_mng_rtfp .gs_rbn_btn.gs_fv', this.$target).on('click', this.flipVerticalClick);
            }
            else {
                $('.gs_rbn_mng_edt,.gs_rbn_mng_rtfp', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because the gallery is read only or you do not have permission for this action');
            }
            // SECURITY
            if (this.data.Album.VirtualType === Enums.VirtualAlbumType.NotVirtual && this.data.Album.Permissions.EditAlbum) {
                $('.gs_rbn_mng_sc .gs_rbn_btn', this.$target).on('click', this.securityClick);
            }
            else {
                $('.gs_rbn_mng_sc', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because you do not have permission for this action or a virtual album is being displayed');
            }
            // SYNCHRONIZE
            if (!this.data.Album.Permissions.Synchronize) {
                $('.gs_task_synchronize', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because you do not have permission for this action');
            }
            // ADMIN and SETTINGS tabs: The UI template renders HTML only for site & gallery admins, so we only need to disable certain items for gallery admins
            if (!this.data.Album.Permissions.AdministerSite) {
                $('.gs_admin_sitesettings,.gs_admin_mediaqueue,.gs_admin_mediatemplates,.gs_admin_css,.gs_admin_backuprestore,.gs_admin_filetypes', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled - Requires site administrator permission');
                if (this.data.Album.Permissions.AdministerGallery && !this.data.App.AllowGalleryAdminToManageUsersAndRoles) {
                    $('.gs_admin_manageusers,.gs_admin_manageroles', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because you do not have permission for this action');
                }
            }
            // Show all tabs where at least one of its buttons are enabled (by default all tabs have gsp_invisible class)
            $('.gs_rbn_tab_ctr:has(.gs_rbn_tab > li:not(li.gsp_disabled))', this.$target).each(function (idx, el) {
                $(".gs_rbn_ctr li:has(a[href='#" + el.id + "'])", _this.$target).removeClass('gsp_invisible');
            });
            // STEP 2: Create tab widget for ribbon
            var selRbnCookieName = this.data.Settings.ClientId + '_rbtb_cookie';
            var isRbnExpandedCookieName = this.data.Settings.ClientId + '_rbstate_cookie';
            // Retrieve the selected tab and whether it is expanded. We prefer sessionStorage over a cookie because it is unique to each tab.
            // sessionStorage is supported in IE8+ and all modern browsers. Default to showing the first tab expanded for user's first visit.
            var rbnTabIndex = (sessionStorage && parseInt(sessionStorage.getItem('rbnTabIndex'), 10)) || parseInt(Vars.Cookies.get(selRbnCookieName), 10) || 0;
            var isRbnExpanded = (sessionStorage && sessionStorage.getItem('isRbnExpanded')) || Vars.Cookies.get(isRbnExpandedCookieName) || 'true';
            var $rbnCtr = $("#" + this.data.Settings.HeaderClientId + "_rbn_ctr");
            var activePanel = $rbnCtr.tabs({
                collapsible: true,
                active: isRbnExpanded === 'true' ? (rbnTabIndex || 0) : false,
                activate: function (e, ui) {
                    $('.gs_rbn_tab > li', ui.newPanel).equalHeights();
                    Vars.Cookies.set(selRbnCookieName, ui.newTab.index(), { expires: 365 });
                    Vars.Cookies.set(isRbnExpandedCookieName, (ui.newTab.length > 0), { expires: 365 });
                    if (typeof (Storage) !== 'undefined') {
                        sessionStorage.setItem('rbnTabIndex', ui.newTab.index().toString());
                        sessionStorage.setItem('isRbnExpanded', (ui.newTab.length > 0).toString());
                    }
                }
            })
                .show().tabs('option', 'active');
            // If we wanted the ribbon expanded (isRbnExpanded=true) but it's not (activePanel=false), that's probably because the user logged off
            // and the previously active tab doesn't exist. Activate the first tab.
            if (isRbnExpanded === 'true' && activePanel === false) {
                $('ul.gs_rbn_tab_ctr > li:first a', $rbnCtr).click();
            }
            // Add special class to button that matches current page (if any)
            var $tabPanel = $("#" + this.data.Settings.ClientId + " .gs_rbn_ctr .gs_" + Enums.PageId[this.data.Settings.PageId]).addClass('gs_rbn_tab_slctd').parents('.ui-tabs-panel');
            // Make tab active if it's not already active
            if ($tabPanel.length > 0 && !$tabPanel.is(':visible')) {
                // User may have pasted link in browser, causing them to navigate to a page in a different ribbon tab. Show it.
                $rbnCtr.tabs('option', 'active', $("#" + this.data.Settings.ClientId + " .gs_rbn_ctr .ui-tabs-panel").index($tabPanel));
            }
            // If the active tab is invisible, make the first one active (user probably doesn't have permission where she previously did)
            var $activeTab = $('.gs_rbn_ctr .ui-tabs-nav li.ui-tabs-active', this.$target);
            if ($activeTab.length > 0 && $activeTab.hasClass('gsp_invisible')) {
                $rbnCtr.tabs('option', 'active', 0);
            }
            // activePanel will be false when collapsed; otherwise a zero-based index of active tab
            if (activePanel !== false) {
                // Ribbon is expanded, so make the buttons equal height
                $("#" + this.data.Settings.ClientId + " .gs_rbn_tab > li").equalHeights();
            }
            if ((this.data.Settings.PageId === Enums.PageId.task_addobjects || this.data.Settings.PageId === Enums.PageId.task_synchronize) || Enums.PageId[this.data.Settings.PageId].lastIndexOf('admin_', 0) === 0) {
                // User is on the add/sync page or one of the Admin/Settings pages. Disable applicable buttons on Home and Manage tabs
                $('.gs_rbn_mng_tab_ctr .gs_rbn_tab > li:not(.gs_task_addobjects,.gs_task_synchronize)', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').off('click');
            }
            if (!this.data.Settings.AllowUrlOverride) {
                // Remove the hyperlinks from the album breadcrumb menu
                $('.albumMenu a', this.$target).contents().filter(function (idx, el) {
                    return el.nodeType === Node.TEXT_NODE;
                }).unwrap();
            }
            // Bind to the select event from the gsThumbnails plug-in so we can enable/disable relevant ribbon buttons.
            $("#" + this.data.Settings.ThumbnailClientId).on('select.' + this.data.Settings.ClientId, $.proxy(this.thumbnailsSelected, this));
        };
        GsHeader.prototype.thumbnailsSelected = function () {
            if (!this.data.Settings.IsReadOnlyGallery && this.data.Album.Permissions.EditMediaObject && this.data.ActiveGalleryItems.length === 1 && !this.data.ActiveGalleryItems[0].IsAlbum) {
                $('.gs_rbn_mng_rf', this.$target).removeClass('gsp_disabled').find('.gs_rbn_btn').attr('title', this.data.Resource.RbnRplTt);
                // Update the asset title on the replace dropdown when a single media asset is selected; otherwise set to blank.
                $('.gs_rbn_mr_dlg_rf_hdr').html(this.data.Resource.RbnShAsset + " <span class='gsp_vibrant'>" + this.data.ActiveGalleryItems[0].Title + "</span>");
            }
            else {
                $('.gs_rbn_mng_rf', this.$target).addClass('gsp_disabled').find('.gs_rbn_btn').attr('title', 'Disabled because the gallery is read only, you do not have permission for this action, or you have not selected a single media asset');
                $('.gs_rbn_mr_dlg_rf_hdr').html(this.data.Resource.RbnShAsset + " <span class='gsp_vibrant'></span>");
            }
        };
        GsHeader.prototype.configLogin = function () {
            var dgLogin;
            if (this.data.User.IsAuthenticated) {
                $('.gsp_logoffLink', this.$target).click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    DataService.logOff(function () { Utils.ReloadPage(); });
                });
            }
            else {
                dgLogin = $("#" + this.data.Settings.ClientId + "_loginDlg");
                dgLogin.data('dgLoginWidth', 420);
                dgLogin.dialog({
                    appendTo: "#" + this.data.Settings.ClientId,
                    autoOpen: false,
                    draggable: false,
                    resizable: false,
                    closeOnEscape: true,
                    classes: { 'ui-dialog': 'gsp_loginDlgContainer' },
                    width: dgLogin.data('dgLoginWidth'),
                    minHeight: 0,
                    show: 'fade',
                    hide: 'fade',
                    open: function () {
                        setTimeout(function () { $('.gsp_login_textbox:first', dgLogin).focus(); }, 50); // Delay needed for IE
                    }
                });
                var disableCreateUserValidation = function (disabled) {
                    // When true, the required attribute of form elements in the create user control are disabled. This allows the user to log in 
                    // on the create user page.
                    $('.gsp_createuser input[data-required=true]').prop('required', !disabled);
                };
                $('.gsp_login_trigger', this.$target).click(function (e) {
                    if (dgLogin.dialog('isOpen')) {
                        dgLogin.dialog('close');
                        disableCreateUserValidation(false); // Restore required attribute
                    }
                    else {
                        dgLogin.dialog('option', 'hide', null).dialog('close').dialog('option', 'hide', 'fade'); // Kill, then restore fade for quicker closing
                        dgLogin.dialog('option', 'position', { my: 'right bottom', at: 'right top', of: e.currentTarget });
                        dgLogin.dialog('open');
                        disableCreateUserValidation(true);
                    }
                    return false;
                });
                $('.gsp_login_textbox', dgLogin).on('keydown', function (e) {
                    if (e.keyCode === Enums.KeyCode.Enter) {
                        $('.gsp_login_button', dgLogin).click();
                        return false;
                    }
                    else {
                        return true;
                    }
                });
                $('.gsp_login_button', dgLogin).button();
                // Close dialog when user clicks outside the login window
                $('body').on('click', function (e) {
                    if (dgLogin.dialog('isOpen') && !$(e.target).is('.ui-dialog, a') && !$(e.target).closest('.ui-dialog').length) {
                        dgLogin.dialog('close');
                        disableCreateUserValidation(false); // Restore required attribute
                    }
                });
            }
        };
        GsHeader.prototype.configSearch = function () {
            var _this = this;
            var dgSearch;
            if (this.data.Settings.ShowSearch) {
                dgSearch = $('.gsp_search_dlg', this.$target);
                dgSearch.data('dgSearchWidth', 420);
                dgSearch.dialog({
                    appendTo: "#" + this.data.Settings.ClientId,
                    autoOpen: false,
                    draggable: false,
                    resizable: false,
                    closeOnEscape: true,
                    classes: { 'ui-dialog': 'gsp_searchDlgContainer' },
                    width: dgSearch.data('dgSearchWidth'),
                    minHeight: 0,
                    show: 'fade',
                    hide: 'fade',
                    open: function (t, d) {
                        setTimeout(function () { $('.gsp_searchbox', dgSearch).focus(); }, 50); // Delay needed for IE
                    }
                });
                $('.gsp_search_trigger', this.$target).click(function (e) {
                    if (dgSearch.dialog('isOpen'))
                        dgSearch.dialog('close');
                    else {
                        dgSearch.dialog('option', 'hide', null).dialog('close').dialog('option', 'hide', 'fade'); // Kill, then restore fade for quicker closing
                        dgSearch.dialog('option', 'position', { my: 'right bottom', at: 'right top', of: e.currentTarget });
                        dgSearch.dialog('open');
                    }
                    return false;
                });
                // Start search when search button is clicked
                $('.gsp_searchbutton', dgSearch).on('click', function (e) {
                    var prepSearchTerms = function (st) {
                        // Replace any spaces outside of quotes with +
                        var result = '';
                        var inQuote;
                        $.each(st.split(''), function (idx, v) {
                            if (v === '\"' || v === '\'')
                                inQuote = !inQuote;
                            result += (!inQuote && v === ' ' ? '+' : v);
                        });
                        return result;
                    };
                    e.preventDefault();
                    e.stopPropagation();
                    var minSearchLen = 3;
                    var searchTerm = $('.gsp_searchbox', dgSearch).val();
                    if (searchTerm.length >= minSearchLen) {
                        var sType = $("[name=" + _this.data.Settings.ClientId + "_searchType]:checked").val();
                        var parms = { title: null, tag: null, people: null, search: null, latest: null, filter: null, rating: null, top: null, aid: null, moid: null };
                        parms[sType] = prepSearchTerms(searchTerm);
                        window.location.href = Utils.GetUrl(window.location.href, parms);
                    }
                    else {
                        var $msgEl = $('.gsp_search_msg', dgSearch);
                        $msgEl.css('visibility', 'visible');
                        $('.gsp_searchbox', dgSearch).one('keydown', function () { $msgEl.css('visibility', 'hidden'); }).focus();
                    }
                }).button();
                $('.gsp_searchbox, .gsp_search_type_container input', dgSearch).on('keydown', function (e) {
                    if (e.keyCode === Enums.KeyCode.Enter) {
                        $('.gsp_searchbutton', dgSearch).click();
                        return false;
                    }
                    else
                        return true;
                });
                // Close dialog when user clicks outside the search window
                $('body').on('click', function (e) {
                    if (dgSearch.dialog('isOpen') && !$(e.target).is('.ui-dialog, a') && !$(e.target).closest('.ui-dialog').length) {
                        dgSearch.dialog('close');
                    }
                });
            }
        };
        return GsHeader;
    }());
    $.fn.gsTooltip = function (options) {
        var self = this;
        return this.each(function () {
            if (!$.data(this, 'plugin_gspTooltip')) {
                var tt = new GsTooltip();
                tt.init(self, options);
                $.data(this, 'plugin_gspTooltip', tt);
            }
        });
    };
    $.fn.gsTooltip.defaults = {
        title: '',
        content: ''
    };
    var GsTooltip = (function () {
        function GsTooltip() {
        }
        GsTooltip.prototype.init = function (target, options) {
            this.$target = target;
            this.settings = $.extend({}, $.fn.gsTooltip.defaults, options);
            this.initVars();
            this.configureDialog();
            this.configureTooltip();
        };
        GsTooltip.prototype.initVars = function () {
            this.$dgTrigger = $("<button class='gsp_tt_tgr'></button>");
            this.$dgTooltip = $("<div class='gsp_tt_dlg'><div class='gsp_tt_dlg_title'>" + this.settings.title + "</div><div class='gsp_tt_dlg_bdy'>" + this.settings.content + "</div></div>");
        };
        GsTooltip.prototype.configureDialog = function () {
            var me = this;
            // Configure the tooltip dialog
            this.$dgTooltip.dialog({
                appendTo: '.gsp_ns:first',
                autoOpen: false,
                draggable: false,
                resizable: false,
                closeOnEscape: true,
                classes: { 'ui-dialog': 'gsp_tt_dlg_container' },
                width: Utils.isWidthLessThan(420) ? Utils.getViewportWidth() : 420,
                minHeight: 0,
                show: 'fade',
                hide: 'fade',
                position: { my: 'left top', at: 'left bottom', of: this.$dgTrigger },
                open: function () { me.onTooltipOpen(); }
            });
        };
        GsTooltip.prototype.onTooltipOpen = function () {
            var _this = this;
            $(document).on('click', function (e1) {
                if ($(e1.target).parents('.gsp_tt_dlg_container').length === 0) {
                    _this.$dgTooltip.dialog('close');
                    $(document).unbind(e1);
                }
            });
        };
        GsTooltip.prototype.configureTooltip = function () {
            var _this = this;
            this.$dgTrigger.insertAfter(this.$target)
                .button({
                showLabel: false,
                icon: 'gsp-ui-icon-help' // .gsp-ui-icon { background-position: inherit; font-size: 16px; }
            })
                .click(function (e) {
                if (_this.$dgTooltip.dialog('isOpen'))
                    _this.$dgTooltip.dialog('close');
                else {
                    _this.$dgTooltip.dialog('open');
                }
                return false;
            });
        };
        ;
        return GsTooltip;
    }());
    //#endregion
    //#region equalHeights, equalSize plug-in
    /**
    * equalHeights: Make all elements same height according to tallest one in the collection
    * equalSize: Make all elements same width & height according to widest and tallest one in the collection
    */
    jQuery.fn.equalHeights = function (hBuffer) {
        hBuffer = hBuffer || 0;
        return this.height(hBuffer + Math.max.apply(null, this.map(function () {
            return jQuery(this).height();
        }).get()));
    };
    jQuery.fn.equalWidths = function (wBuffer) {
        wBuffer = wBuffer || 0;
        return this.width(wBuffer + Math.max.apply(null, this.map(function () {
            return jQuery(this).width();
        }).get()));
    };
    jQuery.fn.equalSize = function (wBuffer, hBuffer) {
        wBuffer = wBuffer || 0;
        hBuffer = hBuffer || 0;
        return this.width(wBuffer + Math.max.apply(null, this.map(function () {
            return jQuery(this).width();
        }).get())).height(hBuffer + Math.max.apply(null, this.map(function () {
            return jQuery(this).height();
        }).get()));
    };
    var GsFullScreenSlideShow = (function () {
        function GsFullScreenSlideShow(data, options) {
            var defaults = {
                viewSize: Enums.ViewSize.Optimized,
                on_exit: function () { }
            };
            this.data = data;
            this.settings = $.extend({}, defaults, options);
        }
        GsFullScreenSlideShow.prototype.startSlideShow = function () {
            var _this = this;
            var items = this.data.Album.MediaItems || this.data.Album.GalleryItems;
            var urls = $.map(items, function (mo) {
                if (mo.ItemType === Enums.ItemType.Image)
                    return { id: mo.Id, thumb: Utils.getView(mo, Enums.ViewSize.Thumbnail).Url, title: mo.Title, image: Utils.getView(mo, _this.settings.viewSize).Url };
                else
                    return null;
            });
            if (urls.length === 0) {
                Msg.show(this.data.Resource.MoNoSsHdr, this.data.Resource.MoNoSsBdy, { msgType: 'info' });
                return false;
            }
            ;
            var ssTmpl = '<div class="ssControlsContainer"> \
            <!--Thumbnail Navigation--> \
            <div id="prevthumb"></div> \
            <div id="nextthumb"></div> \
    \
            <!--Arrow Navigation--> \
            <a id="prevslide" class="load-item"></a> \
            <a id="nextslide" class="load-item"></a> \
    \
            <div id="thumb-tray" class="load-item"> \
                <div id="thumb-back"></div> \
                <div id="thumb-forward"></div> \
            </div> \
    \
            <!--Time Bar--> \
            <div id="progress-back" class="load-item"> \
                <div id="progress-bar"></div> \
            </div> \
    \
            <!--Control Bar--> \
            <div id="controls-wrapper" class="load-item"> \
                <div id="controls"> \
    \
                    <a id="play-button"> \
                        <img id="pauseplay" src="{0}/pause.png" /></a> \
    \
                    <a id="stop-button"> \
                        <img src="{0}/stop.png" /></a> \
    \
                    <!--Slide counter--> \
                    <div id="slidecounter"> \
                        <span class="slidenumber"></span> / <span class="totalslides"></span> \
                    </div> \
    \
                    <!--Slide captions displayed here--> \
                    <div id="slidecaption"></div> \
    \
                    <!--Thumb Tray button--> \
                    <a id="tray-button"> \
                        <img id="tray-arrow" src="{0}/button-tray-up.png" /></a> \
    \
                    <!--Navigation--> \
                    <ul id="slide-list"></ul> \
    \
                </div> \
            </div> \
    </div> \
                    '.format(this.data.App.SkinPath + '/images/supersized');
            var getTransition = function (transitionType) {
                switch (transitionType) {
                    case 'fade': return 1;
                    case 'slide': return 3;
                    default: return 0;
                }
            };
            var getStartSlide = function () {
                // Get the current media object and find the index of the matching one in the urls var.
                var startSlide = 1;
                if (_this.data.MediaItem == null)
                    return startSlide;
                $.each(urls, function (idx, ssItem) {
                    if (_this.data.MediaItem.Id === ssItem.id) {
                        startSlide = idx + 1;
                        return false; // false breaks out of $.each
                    }
                    return true;
                });
                return startSlide;
            };
            // Fire up the full screen slide show.
            $.supersized({
                // Functionality
                image_path: this.data.App.SkinPath + '/images/supersized/',
                slideshow: 1,
                autoplay: 1,
                auto_exit: this.data.Settings.SlideShowLoop ? 0 : 1,
                start_slide: getStartSlide(),
                loop: this.data.Settings.SlideShowLoop ? 1 : 0,
                random: 0,
                slide_interval: this.data.Settings.SlideShowIntervalMs,
                transition: getTransition(this.data.Settings.TransitionType),
                transition_speed: 500,
                new_window: 1,
                pause_hover: 0,
                keyboard_nav: 1,
                performance: 1,
                image_protect: 0,
                // Size & Position						   
                min_width: 0,
                min_height: 0,
                vertical_center: 1,
                horizontal_center: 1,
                fit_always: 1,
                fit_portrait: 1,
                fit_landscape: 1,
                // Components							
                slide_links: 'blank',
                thumb_links: 1,
                thumbnail_navigation: 0,
                slides: urls,
                // Theme Options			   
                progress_bar: 0,
                mouse_scrub: 0,
                html_template: ssTmpl,
                on_destroy: function (currentId, autoExit) {
                    _this.settings.on_exit.apply(null, [currentId, autoExit]);
                }
            });
            // Exit slideshow when stop button is clicked.
            $('#stop-button').on('click', function () {
                $.supersized('getApi').destroy();
            });
            return true;
        };
        ;
        return GsFullScreenSlideShow;
    }());
    var GsTimer = (function () {
        function GsTimer(callback, milliseconds, context) {
            this.isRunning = false;
            this.milliseconds = milliseconds;
            this.callback = callback;
            this.context = context;
            if (!this.context)
                this.context = this;
            this.handle = null;
        }
        GsTimer.prototype.start = function () {
            var _this = this;
            if (this.isRunning)
                return;
            var context = this.context;
            var invokeCallback = function () {
                _this.callback.apply(context);
            };
            this.handle = setInterval(invokeCallback, this.milliseconds);
            this.isRunning = true;
        };
        GsTimer.prototype.stop = function () {
            if (!this.isRunning)
                return;
            clearInterval(this.handle);
            this.isRunning = false;
        };
        return GsTimer;
    }());
    Gs.GsTimer = GsTimer;
    var Msg = (function () {
        function Msg() {
        }
        Msg.show = function (title, message, options) {
            var defaults = {
                msgType: 'success',
                autoCloseDelay: 4000,
                width: 500 // The width of the dialog window. 'auto' or a number (e.g. 500) If viewport width is less than this value, the width is set to the viewport width.
            };
            var settings = $.extend({}, defaults, options);
            $('.gsp_msg').remove(); // Remove any previous message that may be visible
            var $dgHtml = $('<div>');
            var cssClass = 'gsp_msg';
            if (message) {
                $dgHtml.append(message);
                cssClass += ' gsp_msgHasContent';
            }
            else {
                cssClass += ' gsp_msgNoContent';
            }
            cssClass += " gsp_msg_" + settings.msgType;
            $dgHtml.dialog({
                appendTo: '.gsp_ns:first',
                position: { my: 'top', at: 'top' },
                title: title,
                width: (typeof settings.width === 'number' && Utils.isWidthLessThan(settings.width)) ? Utils.getViewportWidth() : settings.width,
                height: 'auto',
                resizable: false,
                classes: { 'ui-dialog': cssClass },
                show: 'fade',
                hide: 'fade'
            });
            if (settings.autoCloseDelay > 0) {
                // Auto-close for success messages
                setTimeout(function () {
                    if ($dgHtml.is(':ui-dialog')) {
                        $dgHtml.dialog('destroy');
                    }
                }, settings.autoCloseDelay);
            }
        };
        return Msg;
    }());
    Gs.Msg = Msg;
    /**
    * An object for executing long running tasks on the server and periodically checking its status. The following
    *   assumptions are made: (1) The URL used to invoke the task invokes it on a background thread and returns quickly.
    *   (2) A callback function userDefinedProgressCallback is specified that monitors the returned progress data. This
    *   function is responsible for detecting when the task is complete and subsequently calling resetTask, which cancels the
    *   polling mechanism.
    */
    var ServerTask = (function () {
        function ServerTask(options) {
            var _this = this;
            /**
             * An internal function for invoking the progress URL on the server.
             */
            this.internalProgressCallback = function () {
                // Note the special syntax '= () =>' in the function declaration. It allows the 'this' keyword to work correctly even 
                // though it's being invoked from an ajax callback. See http://stackoverflow.com/questions/14471975/
                $.ajax({
                    url: _this.taskSettings.taskProgressUrl,
                    cache: false,
                    headers: { 'X-ServerTask-TaskId': _this.taskSettings.taskId }
                })
                    .done(function (status) {
                    // Set the timer to call this method again after the specified interval.
                    _this.taskSettings.timerId = window.setTimeout(_this.internalProgressCallback, _this.taskSettings.interval);
                    if (_this.taskSettings.userDefinedProgressCallback != null)
                        _this.taskSettings.userDefinedProgressCallback(status, _this);
                })
                    .fail(function (jqXHR) {
                    Msg.show('Error retrieving status', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                    if (_this.taskSettings.taskFailedCallback != null)
                        _this.taskSettings.taskFailedCallback(jqXHR, _this);
                });
            };
            var defaults = {
                taskId: this.createTaskId(),
                timerId: 0,
                taskBeginData: null,
                taskBeginUrl: null,
                taskProgressUrl: null,
                taskAbortUrl: null,
                interval: 1000,
                userDefinedProgressCallback: null,
                taskFailedCallback: null,
                taskAbortedCallback: null
            };
            this.taskSettings = $.extend({}, defaults, options);
            //this.self = this;
        }
        /**
         * Internal function to generate a unique task ID.
         * @returns {String} Returns a pseudo-GUID.
         */
        ServerTask.prototype.createTaskId = function () {
            return Utils.createPseudoGuid();
        };
        ;
        /**
         * Send a signal to the server to stop the action. When the polling mechanism detects that the server task has
         * been canceled, it will resets the task (which cancels the timer).
         */
        ServerTask.prototype.abortTask = function () {
            if (this.taskSettings.taskAbortUrl != null && this.taskSettings.taskAbortUrl !== '') {
                $.ajax({
                    url: this.taskSettings.taskAbortUrl,
                    async: false,
                    cache: false,
                    headers: { 'X-ServerTask-TaskId': this.taskSettings.taskId }
                });
            }
        };
        ;
        /**
         * Invoke the long tunning task and begin the periodic polling to check its status.
         */
        ServerTask.prototype.startTask = function () {
            var _this = this;
            $.ajax({
                url: this.taskSettings.taskBeginUrl,
                type: 'POST',
                data: JSON.stringify(this.taskSettings.taskBeginData),
                contentType: 'application/json; charset=utf-8',
                headers: { 'X-ServerTask-TaskId': this.taskSettings.taskId }
            })
                .always(function (jqXHR) {
                if (jqXHR.status !== 0)
                    return;
                if (_this.taskSettings.taskAbortedCallback != null)
                    _this.taskSettings.taskAbortedCallback(self);
                //end();
            })
                .done(function () {
                // Start the progress callback (if any)
                if (_this.taskSettings.userDefinedProgressCallback != null && _this.taskSettings.taskProgressUrl != null) {
                    _this.taskSettings.timerId = window.setTimeout(_this.internalProgressCallback, _this.taskSettings.interval);
                }
            })
                .fail(function (jqXHR) {
                Msg.show('Error starting task', Utils.parseJqXhrMsg(jqXHR), { msgType: 'error', autoCloseDelay: 0 });
                if (_this.taskSettings.taskFailedCallback != null)
                    _this.taskSettings.taskFailedCallback(jqXHR, _this);
            });
        };
        ;
        /**
         * Clears the existing timer function and resets the internal state of the object. Note that
         * this function does not send an abort signal to the server.
         */
        ServerTask.prototype.resetTask = function () {
            this.taskSettings.taskId = '0';
            window.clearTimeout(this.taskSettings.timerId);
        };
        ;
        return ServerTask;
    }());
    Gs.ServerTask = ServerTask;
})(Gs || (Gs = {}));
/**
 * Remove items from an array. From http://ejohn.org/blog/javascript-array-remove/ Examples of usage:
 * array.remove(1); Remove the second item from the array
 * array.remove(-2); Remove the second-to-last item from the array
 * array.remove(1, 2); Remove the second and third items from the array
 * array.remove(-2, -1); Remove the last and second-to-last items from the array
 * @param {number} from Specifies the index in the array at which to begin removing items. If the 'to' parameter is ommitted, then
 * only the item at this index is removed.
 * @param {number} to Specifies the index in the array at which to stop removing items. All items between 'from' and 'to' are removed.
 * @returns {} Returns the original array with the requested items removed.
 */
Array.prototype.gspRemove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
// Create array method to compare two arrays for equality http://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
// Warn if overriding existing method
if (Array.prototype.gsEquals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// Attach the .gsEquals method to Array's prototype to call it on any array
Array.prototype.gsEquals = function (array) {
    // If the other array is a falsy value, return
    if (!array)
        return false;
    // Compare lengths - can save a lot of time 
    if (this.length !== array.length)
        return false;
    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] !== array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', { enumerable: false });
String.prototype.format = function () {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i - 0] = arguments[_i];
    }
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) { return (typeof args[number] != 'undefined'
        ? args[number]
        : match); });
};
if (!String.prototype.trim) {
    // Add trim() function for browsers that don't implement it (IE 1-8).
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
//#endregion
//# sourceMappingURL=gallery.js.map