namespace jv {
    export class ajaxView {

        public pageLoadingBoxID: string;
        public IsShowLoading: boolean = false;
        public pageLoadingBox: any;
        public fadeInTime: number = 500;
        public fadeOutTime: number = 500;
        public dataFormater: Function | undefined;
        public countRequest: number = 0;
        public countDone: number = 0;

        /**
         * 构造函数
         * @param lodingID ： 设置显示loading提示的容器ID名称
         * @param newLoadingBox ：设置是否根据loading容器命名创建新的html容器，默认为true，如果设置为false将直接使用已经存在的同名容器
         * @param imgSrc : loading显示的动态图标的url
         * @param fadeIn ： loading的渐入时间，默认500毫秒
         * @param fadeOut ： loading的淡出时间，默认500毫秒
         */
        constructor(lodingID: string = "loading",newLoadingBox:boolean=true, fadeIn: number = 500, fadeOut: number = 500, imgSrc: string = "http://static.xct.cn/sucai/loading.gif") {
            if(newLoadingBox && $("#" + lodingID).length < 1)
            {
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

        private createLoading(lodingID: string, imgSrc: string) {
            let loading: string = '<div id="' + lodingID + '" style="display:none;z-index:39;background-color:rgba(100, 100, 100, 0.65);position:absolute;height:100%;width: 100%; text-align: center;">'
                + '<img src="' + imgSrc + '" style="margin-top: ' + document.body.clientHeight / 3 + 'px;">'
                + '</div>';
            $('body').prepend(loading);
        }

        private addHtml(addType?: string, obj?: any, data?: any): void {

            let result: any = data;

            //如果数据格式方法dataFormater不为空，则调用格式化方法对数据进行格式化
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

        }

        //页面ajax容器监听后的执行方法
        private listenDone(data: any, formater?: string, add?: string, obj?: any, callBack?: string): void {
            //页面监听的数据格式化方法
            if (formater != undefined && formater != "")
                data = eval(formater);

            ajaxView.prototype.addHtml(add, obj, data);
            if (callBack != undefined && callBack != "")
                eval(callBack);

            ajaxView.prototype.fadeOut();

        }

        //ajax,get,post方法请求成功后的执行方法
        private doDone(data: any, selectStr: string = "", add: string = "replace", callBack?: Function): void {
            if (selectStr != "" && $(selectStr).length > 0)
                this.addHtml(add, $(selectStr), data);
            if (callBack != undefined && callBack!=null)
                callBack.call(this, data);

            ajaxView.prototype.fadeOut();
        }

        //淡出
        protected fadeOut(): void {

            ajaxView.prototype.countDone++;//对ajax执行次数累加
            //如果有定义loadingBox则显示loading信息
            //console.log("addHtml"+ajaxView.prototype.countDone + "/" +ajaxView.prototype.countRequest);

            if (ajaxView.prototype.IsShowLoading && ajaxView.prototype.countDone >= ajaxView.prototype.countRequest) {
                ajaxView.prototype.pageLoadingBox.fadeOut(ajaxView.prototype.fadeOutTime);
                ajaxView.prototype.countDone = ajaxView.prototype.countRequest = 0;
            }
        }

        //淡入
        protected fadeIn(): void {
            ajaxView.prototype.countRequest++;//对ajax的请求数累加
            //console.log("fadeIn"+ajaxView.prototype.countDone + "/" +ajaxView.prototype.countRequest);
            if (ajaxView.prototype.IsShowLoading && ajaxView.prototype.countDone < ajaxView.prototype.countRequest)
                ajaxView.prototype.pageLoadingBox.fadeIn(ajaxView.prototype.fadeInTime);

        }

        /**
         * 在getView、postView方法请求的ajax接口返非html视图片段时，设置数据格式化方法
         * @param formater ： 自定义的数据格式化函数/方法
         */
        public setFormater(formater?: Function): void {
            ajaxView.prototype.dataFormater = formater;
        }

        /**
         * Ajax加载一个url地址，可以是action转换路由，get方式请求
         * @param url:加载地址
         * @param selectStr:加载的内容装入容器
         * @param add:内容的填充方式，支持replace，append，prepend
         * @param callBack:ajax请求完成后的一个回调方法
         */
        public get(url: string, callBack?: Function, selectStr: string = "", add: string = "replace"): void {
            if (url === "")
                return;
            ajaxView.prototype.fadeIn();
            $.get(url).done(function (data) {
                ajaxView.prototype.doDone(data, selectStr, add, callBack);
            });
        }

        /**
         * Ajax加载一个url地址，可以是action转换路由，Post方式请求
         * @param url:加载地址
         * @param selectStr:加载的内容装入容器
         * @param add:内容的填充方式，支持replace，append，prepend
         * @param callBack:ajax请求完成后的一个回调方法
         */
        public post(url: string, callBack?: Function, selectStr: string = "", add: string = "replace"): void {
            if (url === "")
                return;
            ajaxView.prototype.fadeIn();
            $.post(url).done(function (data) {
                ajaxView.prototype.doDone(data, selectStr, add, callBack);
            });
        }

        /**
         * 自定义的ajax请求，兼容jquery中$.ajax()方法的参数设置
         * @param ajaxSetting ： ajax的请求设置，支持$.ajax()的全部setting参数
         * @param callBack ： 成功回调函数
         * @param selectStr:加载的内容装入容器
         * @param add:内容的填充方式，支持replace，append，prepend
         */
        public ajax(ajaxSetting: any, callBack?: Function, selectStr: string = "", add: string = "replace"):void {
            ajaxView.prototype.fadeIn();
            
            $.ajax(ajaxSetting).done(function(data:any){
                ajaxView.prototype.doDone(data, selectStr, add, callBack)
            });
        }

        /**
         * 通过数据接口的url获取数据并渲染接口
         * @param query : 数据请求的URL字符串
         * @param tmpl ：数据渲染模版html字符串 | 数据渲染模版的带#的ID选择符
         * @param selectStr ：填充到的目标容器
         * @param callBack ：数据请求成功的回调方法
         * @param add :内容的填充方式，支持replace，append，prepend
         * @param mod ：请求方法，取值为get | post
         */
        public reqTmpl(query: string,tmpl:string, selectStr?: string, callBack?: Function,  add?: string,mod?:string): void;
        /**
         * 通过完整的ajax请求设置获取数据并渲染模版
         * @param query ：ajax请求的设置
         * @param tmpl：数据渲染模版html字符串 | 数据渲染模版的带#的ID选择符 
         * @param selectStr：填充到的目标容器 
         * @param callBack ：数据请求成功的回调方法
         * @param add:内容的填充方式，支持replace，append，prepend 
         */
        public reqTmpl(query: object,tmpl:string, selectStr?: string, callBack?: Function,  add?: string): void;
        public reqTmpl(query: any,tmpl:any, selectStr: string = "", callBack?: Function,  add: string = "replace",mod:string="get"): void {
            let setting:any;
            if(typeof query==="string")
            {
                setting = {type: mod,url: query,dataType: "json"}
            }else{
                setting=query;
                setting.type=mod;
            }

            ajaxView.prototype.fadeIn();
            $.ajax(setting).done(function (data) {
                let tmplRes:any;
                if (!tmpl.startsWith("#")) {
                    tmplRes = $.tmpl(tmpl, data);
                } else {
                    if ($(tmpl).attr("type") === "text/x-jquery-tmpl")
                        tmplRes = $(tmpl).tmpl(data);
                }
                ajaxView.prototype.doDone(tmplRes, selectStr, add, callBack);
            });
        }
        
      
        ////////////////////////Weget容器方式监听自动加载///////////////////////////////////
        /************************weget自定义属性&参数**************************************
         * @param mvc_partial_action : 只监听包含该属性的html容器，属性值为一个ajax请求的Url
         * @param mvc_verb ： 请求的方式，取值为 post、get
         * @param mvc_add_html ：请求后html视图的加载方式，取值为 replace，append，prepend
         * @param mvc_callback ： ajax请求完成的一个回调方法，值设置方式如同html的事件函数调用方式
         * @param mvc_data_formater ： 如果ajax返回值是json或其他纯数据格式而非html，设置数据格式化的方法
        **********************************************************************************/
        private listenWiget(): void {
            $("[mvc_partial_action]").each(function () {
                let actionUrl: string | undefined = $(this).attr("mvc_partial_action");
                let obj: any = $(this);
                let verb: string | undefined = $(this).attr("mvc_verb");
                let add: string | undefined = $(this).attr("mvc_add_html");
                let callBack: string | undefined = $(this).attr("mvc_callback");
                let formater: string | undefined = $(this).attr("mvc_data_formater");



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
        }

    }
}
