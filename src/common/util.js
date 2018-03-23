var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};

export default {
    getQueryStringByName: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
    formatDate: {
        format: function (date, pattern) {
            pattern = pattern || DEFAULT_PATTERN;
            return pattern.replace(SIGN_REGEXP, function ($0) {
                switch ($0.charAt(0)) {
                    case 'y': return padding(date.getFullYear(), $0.length);
                    case 'M': return padding(date.getMonth() + 1, $0.length);
                    case 'd': return padding(date.getDate(), $0.length);
                    case 'w': return date.getDay() + 1;
                    case 'h': return padding(date.getHours(), $0.length);
                    case 'm': return padding(date.getMinutes(), $0.length);
                    case 's': return padding(date.getSeconds(), $0.length);
                }
            });
        },
        parse: function (dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP);
            var matchs2 = dateString.match(/(\d)+/g);
            if (matchs1.length == matchs2.length) {
                var _date = new Date(1970, 0, 1);
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i]);
                    var sign = matchs1[i];
                    switch (sign.charAt(0)) {
                        case 'y': _date.setFullYear(_int); break;
                        case 'M': _date.setMonth(_int - 1); break;
                        case 'd': _date.setDate(_int); break;
                        case 'h': _date.setHours(_int); break;
                        case 'm': _date.setMinutes(_int); break;
                        case 's': _date.setSeconds(_int); break;
                    }
                }
                return _date;
            }
            return null;
        }
    },

    /*
    * 获取cookie
    */
    getCookie: function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return (arr[2]);
        else
            return null;
    },

    /*
    * 设置cookie,增加到vue实例方便全局调用
    */
    setCookie: function(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    },

    /*
    * 删除cookie
    */
    delCookie: function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    /*
    *  截取url中#前的地址
    * */
    getPath:function(){
        var str = location.href;
        var arr = str.split("#");
        return arr[0];
        // return 'http://172.18.4.40:8086/';
    },
    /*
    * 根据name字段去重
    */
    uniqueByName:function(oldarr){
        var res = [];
        var json = {};
        for(var i = 0; i < oldarr.length; i++){
            if(!json[oldarr[i].name]){
                res.push(oldarr[i]);
                json[oldarr[i].name] = 1;
            }
        }
        return res;
    },
    /*
    * 随机数据
    * 从一个数组中随机获取num个数
    * */
    getRandomNum: function(arr, num) {
        //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
        var temp_array = new Array();
        for (var index in arr) {
            temp_array.push(arr[index]);
        }
        //取出的数值项,保存在此数组
        var return_array = new Array();
        for (var i = 0; i<num; i++) {
            //判断如果数组还有可以取出的元素,以防下标越界
            if (temp_array.length>0) {
                //在数组中产生一个随机索引
                var arrIndex = Math.floor(Math.random()*temp_array.length);
                //将此随机索引的对应的数组元素值复制出来
                return_array[i] = temp_array[arrIndex];
                //然后删掉此索引的数组元素,这时候temp_array变为新的数组
                temp_array.splice(arrIndex, 1);
            } else {
                //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
                break;
            }
        }
        return return_array;
    },

    /*
    * 日期格式化
    * 时间戳转为yyyy-mm-dd
    * */
    getFormatDate: function (input) {
        let d = new Date(input);
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let months = month < 10 ? '0' + month : '' + month;
        let day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
        return year+ '-' + months + '-' + day;
    },
    /*
    * 日期格式化
    * 将某个时间格式的日期转为时间戳
    * */
    getTimestamp: function (stringTime) {
        var timestamp = Date.parse(new Date(stringTime));
        return timestamp;
    },

    /*
    * 获取鼠标位置
    * */
    getMousePos: function(event) {
        var e = event || window.event;
        // e.stopPropagation();
        /*
        var left = e.pageX + 5,
            top = e.pageY;
        if (top + menu.height() >= $(window).height()) {
            top -= menu.height();
        }
        if (left + menu.width() >= $(window).width()) {
            left -= menu.width();
        }
        */

        //获取滚动条距离顶端的距离
        var scrollPos;
        if (window.pageYOffset) {
            scrollPos = window.pageYOffset;
        }else if (document.compatMode && document.compatMode != 'BackCompat'){
            scrollPos = document.documentElement.scrollTop;
        }else if (document.body) {
            scrollPos = document.body.scrollTop;
        }


        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        // var y = e.pageY || e.clientY - scrollY;
        var y = e.pageY || e.clientY - scrollPos;
        // console.log('x: ' + x + '\ny: ' + y);
        // console.log('pageY:'+e.pageY);
        // console.log('clientY:'+e.clientY);
        // console.log('pageYOffset:'+e.pageYOffset);
        return { 'x': x, 'y': y };
    },


    /*
    * 计算会议已进行时长
    * beginTime ：传入时间   格式为时间戳（毫秒数）
    * */
    getMeetingLongTime: function(beginTime){
        var date = new Date().getTime();
        var longTimes = date - beginTime;
        if(longTimes>0){
            //计算出相差天数
            var leavedays = longTimes % (30 * 24 * 3600 * 1000);
            var days = Math.floor(leavedays / (24 * 3600 * 1000));

            //计算出小时数
            var leavehours = leavedays % (24 * 3600 * 1000);     //计算天数后剩余的毫秒数
            var hours = Math.floor(leavehours / (3600 * 1000));

            //计算相差分钟数
            var leaveminutes = leavehours % (3600 * 1000);         //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leaveminutes / (60 * 1000));

            //计算相差秒数
            var leaveseconds = leaveminutes % (60 * 1000);       //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leaveseconds / 1000);

            if(days == 0){
                if(hours == 0){
                    var showLongTime = minutes+"分钟";
                }else{
                    var showLongTime = hours+"小时"+minutes+"分钟";
                }
            }else{
                var showLongTime = days+"天"+hours+"小时"+minutes+"分钟";
            }
        }else{
            var showLongTime="0分钟";
        }
        return showLongTime;
    }

};
