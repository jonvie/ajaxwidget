"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var jv;
(function (jv) {
    var ajaxWidget = (function (_super) {
        __extends(ajaxWidget, _super);
        function ajaxWidget(lodingID, newLoadingBox, fadeIn, fadeOut, imgSrc) {
            if (lodingID === void 0) { lodingID = "loading"; }
            if (newLoadingBox === void 0) { newLoadingBox = true; }
            if (fadeIn === void 0) { fadeIn = 500; }
            if (fadeOut === void 0) { fadeOut = 500; }
            if (imgSrc === void 0) { imgSrc = "http://static.xct.cn/sucai/loading.gif"; }
            var _this = _super.call(this, lodingID, newLoadingBox, fadeIn, fadeOut, imgSrc) || this;
            _this.widgetRootPath = "/App_Addins/widgets/";
            _this.areaVars = undefined;
            return _this;
        }
        ajaxWidget.prototype.bulidWidgetAreas = function (areaVars, attr, rootPath) {
            if (attr === void 0) { attr = ""; }
            if (rootPath === void 0) { rootPath = "/App_Addins/widgets/"; }
            if (rootPath !== undefined && rootPath !== null && rootPath !== "") {
                ajaxWidget.prototype.widgetRootPath = rootPath;
            }
            ajaxWidget.prototype.areaVars = areaVars;
            this.listenWidgetAreas(attr);
        };
        ajaxWidget.prototype.loadAreaWidget = function (areaSetting, widgetArea, attr) {
            var n = 0;
            if (typeof areaSetting === "string") {
                $.getJSON(areaSetting, function (data) {
                    data.forEach(function (widgetItem) {
                        ajaxWidget.prototype.rendWidgetItem(widgetArea, widgetItem, attr, n);
                        n++;
                    });
                });
            }
            else {
                areaSetting.forEach(function (widgetItem) {
                    ajaxWidget.prototype.rendWidgetItem(widgetArea, widgetItem, attr, n);
                    n++;
                });
            }
        };
        ajaxWidget.prototype.rendWidgetItem = function (widgetArea, widgetItem, attr, index) {
            if (index === void 0) { index = 0; }
            var widgetItemID = widgetArea.attr("widget_area") + "_" + widgetItem.Name + "_tmpl" + widgetItem.TmplIndex + "_" + index;
            var newElement = $('<div id="' + widgetItemID + '"  widget_name="' + widgetItem.Name + '" ' + attr + '></div>');
            widgetArea.append(newElement);
            var configFile = ajaxWidget.prototype.widgetRootPath + "widget." + widgetItem.Name + "/widget.config.json";
            var tmplFile = ajaxWidget.prototype.widgetRootPath + "widget." + widgetItem.Name + "/widget.tmpl.html";
            if (widgetItem.Config !== undefined && widgetItem.Config !== null && widgetItem.Config !== "")
                configFile = widgetItem.Config;
            if (widgetItem.Tmpl !== undefined && widgetItem.Tmpl !== null && widgetItem.Tmpl !== "")
                tmplFile = widgetItem.Tmpl;
            $.getJSON(configFile, function (config) {
                var tmpl = $('<code></code>');
                var tmplStr = "";
                $.get(tmplFile, function (data) {
                    var tmlpElement = tmpl.html(data).find("tmpl").eq(widgetItem.TmplIndex);
                    tmplStr = tmlpElement.html();
                    Object.keys(ajaxWidget.prototype.areaVars).forEach(function (key) {
                        tmplStr = tmplStr.replace("[%=" + key + "%]".toLowerCase(), ajaxWidget.prototype.areaVars[key].toLowerCase());
                    });
                    var url = config.BaseDataUrl;
                    if (widgetItem.DataUrl !== undefined && widgetItem.DataUrl !== null && widgetItem.DataUrl !== "")
                        url = widgetItem.DataUrl;
                    if (tmlpElement.attr("url") !== undefined && tmlpElement.attr("url") !== null)
                        url = tmlpElement.attr("url");
                    if (url === "" || url === null || url === undefined) {
                        newElement.html(tmplStr);
                    }
                    else {
                        Object.keys(ajaxWidget.prototype.areaVars).forEach(function (key) {
                            url = url.toLowerCase().replace("{" + key + "}".toLowerCase(), ajaxWidget.prototype.areaVars[key].toLowerCase());
                        });
                        ajaxWidget.prototype.reqTmpl({
                            type: "get",
                            url: url,
                            dataType: "json",
                            success: function () { },
                            error: function () {
                                newElement.html("widget数据加载出错！");
                                ajaxWidget.prototype.fadeOut();
                            }
                        }, tmplStr, "#" + widgetItemID);
                    }
                });
            });
        };
        ajaxWidget.prototype.listenWidgetAreas = function (attr) {
            var areas = "";
            $("[widget_area]").each(function () {
                var areaName = $(this).attr("widget_area");
                if (areaName !== undefined && areaName !== null && areaName !== "") {
                    if ($.inArray(areaName, areas.split(';')) > -1) {
                        console.warn("重复定义了widget_area区域 ：" + areaName + "，重复的定义可能引起未知异常！");
                    }
                    var areaSetting = $(this).attr("widget_area_setting");
                    var widgetItems = $(this).attr("widget_area_items");
                    var obj = $(this);
                    if (widgetItems !== undefined && widgetItems !== null && widgetItems !== "") {
                        areaSetting = eval(widgetItems);
                    }
                    ajaxWidget.prototype.loadAreaWidget(areaSetting, obj, attr);
                    areas += areaName + ";";
                }
            });
        };
        return ajaxWidget;
    }(jv.ajaxView));
    jv.ajaxWidget = ajaxWidget;
})(jv || (jv = {}));
