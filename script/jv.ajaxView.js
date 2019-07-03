"use strict";
var jv;
(function (jv) {
    var ajaxView = (function () {
        function ajaxView(lodingID, newLoadingBox, fadeIn, fadeOut, imgSrc) {
            if (lodingID === void 0) { lodingID = "loading"; }
            if (newLoadingBox === void 0) { newLoadingBox = true; }
            if (fadeIn === void 0) { fadeIn = 500; }
            if (fadeOut === void 0) { fadeOut = 500; }
            if (imgSrc === void 0) { imgSrc = "http://static.xct.cn/sucai/loading.gif"; }
            this.IsShowLoading = false;
            this.fadeInTime = 500;
            this.fadeOutTime = 500;
            this.countRequest = 0;
            this.countDone = 0;
            if (newLoadingBox && $("#" + lodingID).length < 1) {
                this.createLoading(lodingID, imgSrc);
            }
            this.pageLoadingBoxID = lodingID;
            ajaxView.prototype.fadeInTime = fadeIn;
            ajaxView.prototype.fadeOutTime = fadeOut;
            ajaxView.prototype.pageLoadingBox = $("#" + this.pageLoadingBoxID);
            ajaxView.prototype.countDone = ajaxView.prototype.countRequest = 0;
            if (this.pageLoadingBoxID === "" || $("#" + this.pageLoadingBoxID).length < 1) {
                ajaxView.prototype.IsShowLoading = false;
            }
            else {
                ajaxView.prototype.IsShowLoading = true;
            }
            this.listenWiget();
        }
        ajaxView.prototype.createLoading = function (lodingID, imgSrc) {
            var loading = '<div id="' + lodingID + '" style="display:none;z-index:39;background-color:rgba(100, 100, 100, 0.65);position:absolute;height:100%;width: 100%; text-align: center;">'
                + '<img src="' + imgSrc + '" style="margin-top: ' + document.body.clientHeight / 3 + 'px;">'
                + '</div>';
            $('body').prepend(loading);
        };
        ajaxView.prototype.addHtml = function (addType, obj, data) {
            var result = data;
            if (this.dataFormater != undefined) {
                result = this.dataFormater(data);
            }
            switch (addType) {
                case "replace":
                    obj.html(result);
                    break;
                case "append":
                    obj.append(result);
                    break;
                case "prepend":
                    obj.prepend(result);
                    break;
                default:
                    obj.html(result);
                    break;
            }
        };
        ajaxView.prototype.listenDone = function (data, formater, add, obj, callBack) {
            if (formater != undefined && formater != "")
                data = eval(formater);
            ajaxView.prototype.addHtml(add, obj, data);
            if (callBack != undefined && callBack != "")
                eval(callBack);
            ajaxView.prototype.fadeOut();
        };
        ajaxView.prototype.doDone = function (data, selectStr, add, callBack) {
            if (selectStr === void 0) { selectStr = ""; }
            if (add === void 0) { add = "replace"; }
            if (selectStr != "" && $(selectStr).length > 0)
                this.addHtml(add, $(selectStr), data);
            if (callBack != undefined && callBack != null)
                callBack.call(this, data);
            ajaxView.prototype.fadeOut();
        };
        ajaxView.prototype.fadeOut = function () {
            ajaxView.prototype.countDone++;
            if (ajaxView.prototype.IsShowLoading && ajaxView.prototype.countDone >= ajaxView.prototype.countRequest) {
                ajaxView.prototype.pageLoadingBox.fadeOut(ajaxView.prototype.fadeOutTime);
                ajaxView.prototype.countDone = ajaxView.prototype.countRequest = 0;
            }
        };
        ajaxView.prototype.fadeIn = function () {
            ajaxView.prototype.countRequest++;
            if (ajaxView.prototype.IsShowLoading && ajaxView.prototype.countDone < ajaxView.prototype.countRequest)
                ajaxView.prototype.pageLoadingBox.fadeIn(ajaxView.prototype.fadeInTime);
        };
        ajaxView.prototype.setFormater = function (formater) {
            ajaxView.prototype.dataFormater = formater;
        };
        ajaxView.prototype.get = function (url, callBack, selectStr, add) {
            if (selectStr === void 0) { selectStr = ""; }
            if (add === void 0) { add = "replace"; }
            if (url === "")
                return;
            ajaxView.prototype.fadeIn();
            $.get(url).done(function (data) {
                ajaxView.prototype.doDone(data, selectStr, add, callBack);
            });
        };
        ajaxView.prototype.post = function (url, callBack, selectStr, add) {
            if (selectStr === void 0) { selectStr = ""; }
            if (add === void 0) { add = "replace"; }
            if (url === "")
                return;
            ajaxView.prototype.fadeIn();
            $.post(url).done(function (data) {
                ajaxView.prototype.doDone(data, selectStr, add, callBack);
            });
        };
        ajaxView.prototype.ajax = function (ajaxSetting, callBack, selectStr, add) {
            if (selectStr === void 0) { selectStr = ""; }
            if (add === void 0) { add = "replace"; }
            ajaxView.prototype.fadeIn();
            $.ajax(ajaxSetting).done(function (data) {
                ajaxView.prototype.doDone(data, selectStr, add, callBack);
            });
        };
        ajaxView.prototype.reqTmpl = function (query, tmpl, selectStr, callBack, add, mod) {
            if (selectStr === void 0) { selectStr = ""; }
            if (add === void 0) { add = "replace"; }
            if (mod === void 0) { mod = "get"; }
            var setting;
            if (typeof query === "string") {
                setting = { type: mod, url: query, dataType: "json" };
            }
            else {
                setting = query;
                setting.type = mod;
            }
            ajaxView.prototype.fadeIn();
            $.ajax(setting).done(function (data) {
                var tmplRes;
                if (!tmpl.startsWith("#")) {
                    tmplRes = $.tmpl(tmpl, data);
                }
                else {
                    if ($(tmpl).attr("type") === "text/x-jquery-tmpl")
                        tmplRes = $(tmpl).tmpl(data);
                }
                ajaxView.prototype.doDone(tmplRes, selectStr, add, callBack);
            });
        };
        ajaxView.prototype.listenWiget = function () {
            $("[mvc_partial_action]").each(function () {
                var actionUrl = $(this).attr("mvc_partial_action");
                var obj = $(this);
                var verb = $(this).attr("mvc_verb");
                var add = $(this).attr("mvc_add_html");
                var callBack = $(this).attr("mvc_callback");
                var formater = $(this).attr("mvc_data_formater");
                if (actionUrl != "") {
                    ajaxView.prototype.fadeIn();
                    if (verb === "get") {
                        $.get(actionUrl).done(function (data) {
                            ajaxView.prototype.listenDone(data, formater, add, obj, callBack);
                        });
                    }
                    if (verb === "post") {
                        $.post(actionUrl).done(function (data) {
                            ajaxView.prototype.listenDone(data, formater, add, obj, callBack);
                        });
                    }
                }
            });
        };
        return ajaxView;
    }());
    jv.ajaxView = ajaxView;
})(jv || (jv = {}));
