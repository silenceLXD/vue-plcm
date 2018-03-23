import Vue from 'vue'

/**
 * 货币格式化
 * currencyType 货币符号
 */

Vue.filter('formatPrice', function(value = '0', currencyType = '') {
    let res;
    if (value.toString().indexOf('.') === -1) {
        res = (value || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.00'
    } else {
        let prev = value.toString().split('.')[0]
        let next = value.toString().split('.')[1] < 10 ? value.toString().split('.')[1] + '0' : value.toString().split('.')[1]
        res = (prev || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + next
    }
    return currencyType + res
});

/*
* 字符串截取
* */
Vue.filter( 'limitTo' , function(value,begin,end) {
    return value=value.substring(begin,end) ;
});


/*
* 日期格式化
* */
Vue.filter('formatDate',function(value,fmt){
    var d = new Date(value);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
    var hour = d.getHours()<10 ? '0' + d.getHours() : '' + d.getHours();
    var minutes = d.getMinutes()<10 ? '0' + d.getMinutes() : '' + d.getMinutes();
    var seconds = d.getSeconds()<10 ? '0' + d.getSeconds() : '' + d.getSeconds();
    if(fmt == 'yyyy-MM-dd'){
        var date = year+ '-' + month + '-' + day;
    }else if(fmt == 'yyyy-MM-dd hh:mm'){
        var date = year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes;
    }else if(fmt == 'yyyy-MM-dd hh:mm:ss'){
        var date = year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
    }else if(fmt == 'hh:mm:ss'){
        var date = hour + ':' + minutes + ':' + seconds;
    }else if(fmt == 'hh:mm'){
        var date = hour + ':' + minutes;
    }
    return date;
});