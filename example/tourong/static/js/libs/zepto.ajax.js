define(function (require) {
    var $ = require('./zepto.js'), jsonpID = 0, document = window.document, key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = "application/json", htmlType = "text/html", blankRE = /^\s*$/;

    function triggerAndReturn(context, eventName, data) {
        var event = $.Event(eventName);
        $(context).trigger(event, data);
        return !event.isDefaultPrevented();
    }

    function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) {
            return triggerAndReturn(context || document, eventName, data);
        }
    }

    $.active = 0;
    function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) {
            triggerGlobal(settings, null, "ajaxStart");
        }
    }

    function ajaxStop(settings) {
        if (settings.global && !(--$.active)) {
            triggerGlobal(settings, null, "ajaxStop");
        }
    }

    function ajaxBeforeSend(xhr, settings) {
        var context = settings.context;
        if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, "ajaxBeforeSend", [xhr, settings]) === false) {
            return false;
        }
        triggerGlobal(settings, context, "ajaxSend", [xhr, settings]);
    }

    function ajaxSuccess(data, xhr, settings, deferred) {
        var context = settings.context, status = "success";
        settings.success.call(context, data, status, xhr);
        if (deferred) {
            deferred.resolveWith(context, [data, status, xhr]);
        }
        triggerGlobal(settings, context, "ajaxSuccess", [xhr, settings, data]);
        ajaxComplete(status, xhr, settings);
    }

    function ajaxError(error, type, xhr, settings, deferred) {
        var context = settings.context;
        settings.error.call(context, xhr, type, error);
        if (deferred) {
            deferred.rejectWith(context, [xhr, type, error]);
        }
        triggerGlobal(settings, context, "ajaxError", [xhr, settings, error || type]);
        ajaxComplete(type, xhr, settings);
    }

    function ajaxComplete(status, xhr, settings) {
        var context = settings.context;
        settings.complete.call(context, xhr, status);
        triggerGlobal(settings, context, "ajaxComplete", [xhr, settings]);
        ajaxStop(settings);
    }

    function empty() {
    }

    $.ajaxJSONP = function (options, deferred) {
        if (!("type" in options)) {
            return $.ajax(options);
        }
        var _callbackName = options.jsonpCallback, callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || ("jsonp" + (++jsonpID)), script = document.createElement("script"), originalCallback = window[callbackName], responseData, abort = function (errorType) {
            $(script).triggerHandler("error", errorType || "abort");
        }, xhr = {abort: abort}, abortTimeout;
        if (deferred) {
            deferred.promise(xhr);
        }
        $(script).on("load error", function (e, errorType) {
            clearTimeout(abortTimeout);
            $(script).off().remove();
            if (e.type == "error" || !responseData) {
                ajaxError(null, errorType || "error", xhr, options, deferred);
            } else {
                ajaxSuccess(responseData[0], xhr, options, deferred);
            }
            window[callbackName] = originalCallback;
            if (responseData && $.isFunction(originalCallback)) {
                originalCallback(responseData[0]);
            }
            originalCallback = responseData = undefined;
        });
        if (ajaxBeforeSend(xhr, options) === false) {
            abort("abort");
            return xhr;
        }
        window[callbackName] = function () {
            responseData = arguments;
        };
        script.src = options.url.replace(/\?(.+)=\?/, "?$1=" + callbackName);
        document.head.appendChild(script);
        if (options.timeout > 0) {
            abortTimeout = setTimeout(function () {
                abort("timeout");
            }, options.timeout);
        }
        return xhr;
    };
    $.ajaxSettings = {type: "GET", beforeSend: empty, success: empty, error: empty, complete: empty, context: null, global: true, xhr: function () {
        return new window.XMLHttpRequest();
    }, accepts: {script: "text/javascript, application/javascript, application/x-javascript", json: jsonType, xml: "application/xml, text/xml", html: htmlType, text: "text/plain"}, crossDomain: false, timeout: 0, processData: true, cache: true};
    function mimeToDataType(mime) {
        if (mime) {
            mime = mime.split(";", 2)[0];
        }
        return mime && (mime == htmlType ? "html" : mime == jsonType ? "json" : scriptTypeRE.test(mime) ? "script" : xmlTypeRE.test(mime) && "xml") || "text";
    }

    function appendQuery(url, query) {
        if (query == "") {
            return url;
        }
        return(url + "&" + query).replace(/[&?]{1,2}/, "?");
    }

    function serializeData(options) {
        if (options.processData && options.data && $.type(options.data) != "string") {
            options.data = $.param(options.data, options.traditional);
        }
        if (options.data && (!options.type || options.type.toUpperCase() == "GET")) {
            options.url = appendQuery(options.url, options.data), options.data = undefined;
        }
    }

    $.ajax = function (options) {
        var settings = $.extend({}, options || {}), deferred = $.Deferred && $.Deferred();
        for (key in $.ajaxSettings) {
            if (settings[key] === undefined) {
                settings[key] = $.ajaxSettings[key];
            }
        }
        ajaxStart(settings);
        if (!settings.crossDomain) {
            settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host;
        }
        if (!settings.url) {
            settings.url = window.location.toString();
        }
        serializeData(settings);
        var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url);
        if (hasPlaceholder) {
            dataType = "jsonp";
        }
        if (settings.cache === false || ((!options || options.cache !== true) && ("script" == dataType || "jsonp" == dataType))) {
            settings.url = appendQuery(settings.url, "_=" + Date.now());
        }
        if ("jsonp" == dataType) {
            if (!hasPlaceholder) {
                settings.url = appendQuery(settings.url, settings.jsonp ? (settings.jsonp + "=?") : settings.jsonp === false ? "" : "callback=?");
            }
            return $.ajaxJSONP(settings, deferred);
        }
        var mime = settings.accepts[dataType], headers = {}, setHeader = function (name, value) {
            headers[name.toLowerCase()] = [name, value];
        },

            protocol = (settings.url.match( /^([\w-]+:)/ )||['',window.location.protocol])[1],

            xhr = settings.xhr(), nativeSetHeader = xhr.setRequestHeader, abortTimeout;
        if (deferred) {
            deferred.promise(xhr);
        }
        if (!settings.crossDomain) {
            setHeader("X-Requested-With", "XMLHttpRequest");
        }
        setHeader("Accept", mime || "*/*");
        if (mime = settings.mimeType || mime) {
            if (mime.indexOf(",") > -1) {
                mime = mime.split(",", 2)[0];
            }
            xhr.overrideMimeType && xhr.overrideMimeType(mime);
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != "GET")) {
            setHeader("Content-Type", settings.contentType || "application/x-www-form-urlencoded");
        }
        if (settings.headers) {
            for (name in settings.headers) {
                setHeader(name, settings.headers[name]);
            }
        }
        xhr.setRequestHeader = setHeader;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = empty;
                clearTimeout(abortTimeout);
                var result, error = false;
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == "file:")) {
                    dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader("content-type"));
                    result = xhr.responseText;
                    try {
                        if (dataType == "script") {
                            (1, eval)(result);
                        } else {
                            if (dataType == "xml") {
                                result = xhr.responseXML;
                            } else {
                                if (dataType == "json") {
                                    result = blankRE.test(result) ? null : $.parseJSON(result);
                                }
                            }
                        }
                    } catch (e) {
                        error = e;
                    }
                    if (error) {
                        ajaxError(error, "parsererror", xhr, settings, deferred);
                    } else {
                        ajaxSuccess(result, xhr, settings, deferred);
                    }
                } else {
                    ajaxError(xhr.statusText || null, xhr.status ? "error" : "abort", xhr, settings, deferred);
                }
            }
        };
        if (ajaxBeforeSend(xhr, settings) === false) {
            xhr.abort();
            ajaxError(null, "abort", xhr, settings, deferred);
            return xhr;
        }
        if (settings.xhrFields) {
            for (name in settings.xhrFields) {
                xhr[name] = settings.xhrFields[name];
            }
        }
        var async = "async" in settings ? settings.async : true;
        xhr.open(settings.type, settings.url, async, settings.username, settings.password);
        for (name in headers) {
            nativeSetHeader.apply(xhr, headers[name]);
        }
        if (settings.timeout > 0) {
            abortTimeout = setTimeout(function () {
                xhr.onreadystatechange = empty;
                xhr.abort();
                ajaxError(null, "timeout", xhr, settings, deferred);
            }, settings.timeout);
        }
        xhr.send(settings.data ? settings.data : null);
        return xhr;
    };
    function parseArguments(url, data, success, dataType) {
        if ($.isFunction(data)) {
            dataType = success, success = data, data = undefined;
        }
        if (!$.isFunction(success)) {
            dataType = success, success = undefined;
        }
        return{url: url, data: data, success: success, dataType: dataType};
    }

    $.get = function () {
        return $.ajax(parseArguments.apply(null, arguments));
    };
    $.post = function () {
        var options = parseArguments.apply(null, arguments);
        options.type = "POST";
        return $.ajax(options);
    };
    $.getJSON = function () {
        var options = parseArguments.apply(null, arguments);
        options.dataType = "json";
        return $.ajax(options);
    };
    $.fn.load = function (url, data, success) {
        if (!this.length) {
            return this;
        }
        var self = this, parts = url.split(/\s/), selector, options = parseArguments(url, data, success), callback = options.success;
        if (parts.length > 1) {
            options.url = parts[0], selector = parts[1];
        }
        options.success = function (response) {
            self.html(selector ? $("<div>").html(response.replace(rscript, "")).find(selector) : response);
            callback && callback.apply(self, arguments);
        };
        $.ajax(options);
        return this;
    };
    var escape = encodeURIComponent;

    function serialize(params, obj, traditional, scope) {
        var type, array = $.isArray(obj), hash = $.isPlainObject(obj);
        $.each(obj, function (key, value) {
            type = $.type(value);
            if (scope) {
                key = traditional ? scope : scope + "[" + (hash || type == "object" || type == "array" ? key : "") + "]";
            }
            if (!scope && array) {
                params.add(value.name, value.value);
            } else {
                if (type == "array" || (!traditional && type == "object")) {
                    serialize(params, value, traditional, key);
                } else {
                    params.add(key, value);
                }
            }
        });
    }

    $.param = function (obj, traditional) {
        var params = [];
        params.add = function (k, v) {
            this.push(escape(k) + "=" + escape(v));
        };
        serialize(params, obj, traditional);
        return params.join("&").replace(/%20/g, "+");
    };
});