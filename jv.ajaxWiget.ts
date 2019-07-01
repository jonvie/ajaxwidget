namespace jv {

    export class ajaxWiget extends ajaxView {

        public wigetRootPath: string = "/App_Addins/wigets/";
        public areaVars: any = undefined;

        constructor(lodingID: string = "loading", newLoadingBox: boolean = true, fadeIn: number = 500, fadeOut: number = 500, imgSrc: string = "http://static.xct.cn/sucai/loading.gif") {
            super(lodingID, newLoadingBox, fadeIn, fadeOut, imgSrc);
        }

        /**
         * 通过注入参数建立页面中的wigetArea区域
         * @param areaVars 注入的变量集合
         * @param areaSetting 一个小部件区域的设置数据接口的url
         * @param attr 
         * @param rootPath 
         */
        public bulidWigetAreas(areaVars: any, attr: string = "", rootPath: string = "/App_Addins/wigets/"): void {
            if (rootPath !== undefined && rootPath !== null && rootPath !== "") {
                ajaxWiget.prototype.wigetRootPath = rootPath;
            }

            ajaxWiget.prototype.areaVars = areaVars;
            this.listenWigetAreas(attr);
        }

        private loadAreaWiget(areaSetting: object, wigetArea: JQuery<HTMLElement>, attr: string): void;
        private loadAreaWiget(areaSetting: string, wigetArea: JQuery<HTMLElement>, attr: string): void;
        private loadAreaWiget(areaSetting: any, wigetArea: JQuery<HTMLElement>, attr: string): void {

            let n = 0;
            if (typeof areaSetting === "string") {
                $.getJSON(areaSetting, function (data) {
                    //循环配置中的wigets
                    data.forEach((wigetItem: any) => {
                        ajaxWiget.prototype.rendWigetItem(wigetArea, wigetItem, attr, n);
                        n++;
                    });
                });
            } else {
                areaSetting.forEach((wigetItem: any) => {
                    ajaxWiget.prototype.rendWigetItem(wigetArea, wigetItem, attr, n);
                    n++;
                });
            }


        }

        public rendWigetItem(wigetArea: JQuery<HTMLElement>, wigetItem: any, attr: string, index: number = 0): void {

            let wigetItemID = wigetArea.attr("wiget_area") + "_" + wigetItem.Name + "_tmpl" + wigetItem.TmplIndex + "_" + index;
            let newElement: JQuery<HTMLElement> = $('<div id="' + wigetItemID + '"  wiget_name="' + wigetItem.Name + '" ' + attr + '></div>');
            //将新的wiget容器添加到文档
            wigetArea.append(newElement);

            //获得当前wiget配置文件地址
            let configFile = ajaxWiget.prototype.wigetRootPath + "wiget." + wigetItem.Name + "/wiget.config.json";
            let tmplFile = ajaxWiget.prototype.wigetRootPath + "wiget." + wigetItem.Name + "/wiget.tmpl.html";

            if (wigetItem.Config !== undefined && wigetItem.Config !== null && wigetItem.Config !== "")
                configFile = wigetItem.Config;//如果有当前wiget有自己的设置文件信息
            if (wigetItem.Tmpl !== undefined && wigetItem.Tmpl !== null && wigetItem.Tmpl !== "")
                tmplFile = wigetItem.Tmpl;//如果有当前wiget有自己的设置文件信息

            //读取当前wiget的config
            $.getJSON(configFile, function (config) {
                let tmpl: JQuery<HTMLElement> = $('<code></code>');
                let tmplStr: string = "";
                //加载模版
                $.get(tmplFile, function (data) {
                    let tmlpElement: JQuery<HTMLElement> = tmpl.html(data).find("tmpl").eq(wigetItem.TmplIndex);
                    tmplStr = tmlpElement.html();
                    Object.keys(ajaxWiget.prototype.areaVars).forEach((key: string) => {
                        tmplStr = tmplStr.replace("[%=" + key + "%]".toLowerCase(), ajaxWiget.prototype.areaVars[key].toLowerCase());
                    });
                    let url = config.BaseDataUrl;
                    if (wigetItem.DataUrl !== undefined && wigetItem.DataUrl !== null && wigetItem.DataUrl !== "")
                        url = wigetItem.DataUrl;
                    if (tmlpElement.attr("url") !== undefined && tmlpElement.attr("url") !== null)
                        url = tmlpElement.attr("url");


                    if (url === "" || url === null || url === undefined) {//如果加载的url设置为空，直接显示模版内容
                        newElement.html(tmplStr);
                    } else {//如果有url读取url的接口数据在渲染模版
                        //console.log(url);
                        Object.keys(ajaxWiget.prototype.areaVars).forEach((key: string) => {
                            url = url.toLowerCase().replace("{" + key + "}".toLowerCase(), ajaxWiget.prototype.areaVars[key].toLowerCase());
                        });
                        ajaxWiget.prototype.reqTmpl({
                            type: "get",
                            url: url,
                            dataType: "json",
                            success: function () { },
                            error: function () {
                                newElement.html("wiget数据加载出错！");
                                ajaxWiget.prototype.fadeOut();
                            }
                        }, tmplStr, "#" + wigetItemID);
                    }
                });

            });

        }


        private listenWigetAreas(attr: string): void {
            let areas:string="";
            $("[wiget_area]").each(function () {
                let areaName: any = $(this).attr("wiget_area");
                if (areaName !== undefined && areaName !== null && areaName !== "") {
                    
                    if($.inArray(areaName, areas.split(';'))>-1)
                    {
                        console.warn("重复定义了wiget_area区域 ："+areaName +"，重复的定义可能引起未知异常！");
                    }
                    let areaSetting: any = $(this).attr("wiget_area_setting");
                    let wigetItems: any = $(this).attr("wiget_area_items");
                    let obj: JQuery<HTMLElement> = $(this);

                    if (wigetItems !== undefined && wigetItems !== null && wigetItems !== "") {
                        areaSetting = eval(wigetItems);
                    }
                    //当前站点、当前wigetArea的具体设置信息数据路径
                    ajaxWiget.prototype.loadAreaWiget(areaSetting, obj, attr);
                    areas+=areaName+";";
                }
            });
        }
    }
}