namespace jv {

    export class ajaxWidget extends ajaxView {

        public widgetRootPath: string = "/App_Addins/widgets/";
        public areaVars: any = undefined;

        constructor(lodingID: string = "loading", newLoadingBox: boolean = true, fadeIn: number = 500, fadeOut: number = 500, imgSrc: string = "http://static.xct.cn/sucai/loading.gif") {
            super(lodingID, newLoadingBox, fadeIn, fadeOut, imgSrc);
        }

        /**
         * 通过注入参数建立页面中的widgetArea区域
         * @param areaVars 注入的变量集合
         * @param areaSetting 一个小部件区域的设置数据接口的url
         * @param attr 
         * @param rootPath 
         */
        public bulidWidgetAreas(areaVars: any, attr: string = "", rootPath: string = "/App_Addins/widgets/"): void {
            if (rootPath !== undefined && rootPath !== null && rootPath !== "") {
                ajaxWidget.prototype.widgetRootPath = rootPath;
            }

            ajaxWidget.prototype.areaVars = areaVars;
            this.listenWidgetAreas(attr);
        }

        private loadAreaWidget(areaSetting: object, widgetArea: JQuery<HTMLElement>, attr: string): void;
        private loadAreaWidget(areaSetting: string, widgetArea: JQuery<HTMLElement>, attr: string): void;
        private loadAreaWidget(areaSetting: any, widgetArea: JQuery<HTMLElement>, attr: string): void {

            let n = 0;
            if (typeof areaSetting === "string") {
                $.getJSON(areaSetting, function (data) {
                    //循环配置中的widgets
                    data.forEach((widgetItem: any) => {
                        ajaxWidget.prototype.rendWidgetItem(widgetArea, widgetItem, attr, n);
                        n++;
                    });
                });
            } else {
                areaSetting.forEach((widgetItem: any) => {
                    ajaxWidget.prototype.rendWidgetItem(widgetArea, widgetItem, attr, n);
                    n++;
                });
            }


        }

        public rendWidgetItem(widgetArea: JQuery<HTMLElement>, widgetItem: any, attr: string, index: number = 0): void {

            let widgetItemID = widgetArea.attr("widget_area") + "_" + widgetItem.Name + "_tmpl" + widgetItem.TmplIndex + "_" + index;
            let newElement: JQuery<HTMLElement> = $('<div id="' + widgetItemID + '"  widget_name="' + widgetItem.Name + '" ' + attr + '></div>');
            //将新的widget容器添加到文档
            widgetArea.append(newElement);

            //获得当前widget配置文件地址
            let configFile = ajaxWidget.prototype.widgetRootPath + "widget." + widgetItem.Name + "/widget.config.json";
            let tmplFile = ajaxWidget.prototype.widgetRootPath + "widget." + widgetItem.Name + "/widget.tmpl.html";

            if (widgetItem.Config !== undefined && widgetItem.Config !== null && widgetItem.Config !== "")
                configFile = widgetItem.Config;//如果有当前widget有自己的设置文件信息
            if (widgetItem.Tmpl !== undefined && widgetItem.Tmpl !== null && widgetItem.Tmpl !== "")
                tmplFile = widgetItem.Tmpl;//如果有当前widget有自己的设置文件信息

            //读取当前widget的config
            $.getJSON(configFile, function (config) {
                let tmpl: JQuery<HTMLElement> = $('<code></code>');
                let tmplStr: string = "";
                //加载模版
                $.get(tmplFile, function (data) {
                    let tmlpElement: JQuery<HTMLElement> = tmpl.html(data).find("tmpl").eq(widgetItem.TmplIndex);
                    tmplStr = tmlpElement.html();
                    Object.keys(ajaxWidget.prototype.areaVars).forEach((key: string) => {
                        tmplStr = tmplStr.replace("[%=" + key + "%]".toLowerCase(), ajaxWidget.prototype.areaVars[key].toLowerCase());
                    });
                    let url = config.BaseDataUrl;
                    if (widgetItem.DataUrl !== undefined && widgetItem.DataUrl !== null && widgetItem.DataUrl !== "")
                        url = widgetItem.DataUrl;
                    if (tmlpElement.attr("url") !== undefined && tmlpElement.attr("url") !== null)
                        url = tmlpElement.attr("url");


                    if (url === "" || url === null || url === undefined) {//如果加载的url设置为空，直接显示模版内容
                        newElement.html(tmplStr);
                    } else {//如果有url读取url的接口数据在渲染模版
                        //console.log(url);
                        Object.keys(ajaxWidget.prototype.areaVars).forEach((key: string) => {
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

        }


        private listenWidgetAreas(attr: string): void {
            let areas:string="";
            $("[widget_area]").each(function () {
                let areaName: any = $(this).attr("widget_area");
                if (areaName !== undefined && areaName !== null && areaName !== "") {
                    
                    if($.inArray(areaName, areas.split(';'))>-1)
                    {
                        console.warn("重复定义了widget_area区域 ："+areaName +"，重复的定义可能引起未知异常！");
                    }
                    let areaSetting: any = $(this).attr("widget_area_setting");
                    let widgetItems: any = $(this).attr("widget_area_items");
                    let obj: JQuery<HTMLElement> = $(this);

                    if (widgetItems !== undefined && widgetItems !== null && widgetItems !== "") {
                        areaSetting = eval(widgetItems);
                    }
                    //当前站点、当前widgetArea的具体设置信息数据路径
                    ajaxWidget.prototype.loadAreaWidget(areaSetting, obj, attr);
                    areas+=areaName+";";
                }
            });
        }
    }
}