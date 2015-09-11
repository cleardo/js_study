define( function(require) {
    var Now = function(){
        this.cfg = {
            'tplCache':{},           // 模板缓存
            'tpl' : 'static/tpl/',  // 模版文件位置
            'index' : 'index.php',  // 首页位置
            'check' : {}             // 后端的验证列表
        };
        this.time = -1;
        this._userVal = {};   //私有验证
    };

    Now.prototype = {
        constructor: Now,

        /**
         * 根据模板名称和数据内容，得到组装好的模板数据，一般不要直接使用 各项目会有一个额外封装的方法
         * @author 欧远宁
         * @param tpl   模板名称
         * @param data  数据内容
         * @param okFun 完成模板组装后的回调
         */
        tpl : function(tpl, data, okFun){
            var _cfg = this.cfg
                , _c = _cfg.tplCache
                , _t = _cfg.tpl
                , 
                
                rpl = function(s){ // 替换函数
                    s = s.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/'/g, "\\'").replace(/<!--{/g, "';").replace(/}-->/g, ";s+='")
                    .replace(/{#/g, "';s+=").replace(/#}/g, ";s+='");
                    s = "var s='" + s + "';return s;";
                    return s;
                };
            if (_c[tpl]) {
                okFun(_c[tpl](data));
            } else {

                $.get(_t + tpl + '.html?v=' + new Date().getTime(), {}, function(html){
                    /*
                    function(data) {
                        s = '';
                        s += data;
                        return s;
                    }
                    */
                    //调用该函数时，data会被替换掉, html代码被保留
                	_c[tpl] = new Function('data', rpl(html));
                    okFun(_c[tpl](data));
                });

            }
        },

        /**
         * 更友好的剩余时间显示，比如 2012-08-08 08:08:08
         * @author 欧远宁
         * @param time  时间格式为2012-08-08 08:08:08
         * @param start 开始计算的日期的书，一般我们只要计算到后2年就可以了。
         * @param len   如start=2, len=14 那么我们计算时间的时候，就类似 12-08-08 08:08
         */
        pDate : function(time, start, len){
            // 默认只显示到分钟
            if (start == undefined) {
                start = 2;
            }
            if (len == undefined) {
                len = 14;
            }
            var ntime = (this.time > -1) ? this.time : new Date().getTime();
            var date = new Date(time.replace(/-/g, '/')), tmp = (ntime - date.getTime()), future = (tmp < 0), diff = Math.abs(tmp) / 1000, day_diff = Math
                    .floor(diff / 86400);

            if (future) {
                if (isNaN(day_diff) || day_diff >= 31)
                    return time.substr(start, len);
                return day_diff == 0
                        && (diff < 60 && '一会' || diff < 120 && '1分钟后' || diff < 3600 && Math.floor(diff / 60) + '分钟后' || diff < 7200 && '1小时后' || diff < 86400
                                && Math.floor(diff / 3600) + '小时后') || day_diff == 1 && '明天' || day_diff < 7 && day_diff + '天后' || day_diff < 31
                        && Math.ceil(day_diff / 7) + '周后';
            } else {
                if (isNaN(day_diff) || day_diff >= 31)
                    return time.substr(start, len);
                return day_diff == 0
                        && (diff < 60 && '刚刚' || diff < 120 && '1分钟前' || diff < 3600 && Math.floor(diff / 60) + '分钟前' || diff < 7200 && '1小时前' || diff < 86400
                                && Math.floor(diff / 3600) + '小时前') || day_diff == 1 && '昨天' || day_diff < 7 && day_diff + '天前' || day_diff < 31
                        && Math.ceil(day_diff / 7) + '周前';
            }
        },

        /**
         * 如果字符过长，加入省略号
         * @author 欧远宁
         * @param str
         * @param max
         * @param rpl
         */
        pStr : function(str, max, rpl){
            if (str.length < max)
                return str;
            if (rpl == undefined)
                rpl = '...';// 省略的内容替代字符
            return str.substr(0, max) + rpl;
        },

        /**
         * 将timestamp转为 yyyy-mm-dd HH:ii:ss的格式字符串
         * @author 欧远宁
         * @param ts    输入的timestamp
         * @param type  返回的时间格式
         * @returns     格式化后的字符串
         */
        timeStr : function(ts, type){
            if (ts < 10) {
                return '';
            }
            var day = new Date(parseInt(ts) * 1000)
                , fun = function(n){
                    return (n < 10) ? '0' + n : n;
                };
            if (type) {
                return day.getFullYear() + '-' + (fun(day.getMonth() + 1)) + '-' + fun(day.getDate());
            } else {
                return day.getFullYear() + '-' + (fun(day.getMonth() + 1)) + '-' + fun(day.getDate()) + ' ' + fun(day.getHours()) + ':'
                        + fun(day.getMinutes()) + ':' + fun(day.getSeconds());
            }
        },

        /**
         * 增加私有验证
         * @author 欧远宁
         * @param name  名称，在check中的第一个区间的名字，比如myval-a-b
         * @param cb  回调函数
         */
        addVal : function(name, cb) {
            this._userVal[name] = cb;
        },

        /**
         * 得到验证错误信息
         * @param arr
         */
        getCheckErr : function(arr) {
            var _msg = {
               ip : 'IP',
               phone : '电话',
               mobile : '手机',
               date : '日期格式',
               idcard : '身份证',
               zip : '邮编',
               qq : 'QQ号',
               url : '网址',
               mail : '邮箱',
               uuid : 'uuid',
               timestamp : '时间戳'
            },
            _ret = _msg[arr[0]];
            if (_ret){
                return '请输入正确的'+_ret;
            } else {
                var _fun = function(arr) {
                    var _str = '请输入';
                    if (arr.length == 2) {
                        _str+='至少'+arr[1];
                    } else {
                        _str+=arr[1]+'到'+arr[2];
                    }
                    return _str;
                  };

                switch (arr[0]) {
                case 'reg':
                    return '不符合验证规则';
                case 'cmp':
                    if ($('label[for='+arr[1]+']').length > 0) {
                        return '请与'+$('label[for='+arr[1]+']').text()+'的值保持一致';
                    }
                    return '1';
                case 'alpha':
                    return _fun(arr)+'个字母';
                case 'num':
                    return _fun(arr)+'个数字';
                case 'alnum':
                    return _fun(arr)+'个数字或字母';
                case 'str':
                    return _fun(arr)+'个字符';
                case 'str2':
                    return _fun(arr)+'个字符（一个汉字2字符）';
                case 'int':
                    return '请输入'+arr[1]+'到'+arr[2]+'的数值,';
                case 'float':
                    var _msg = '请输入'+arr[2]+'到'+arr[3]+'的数值,';
                    if (arr[1] != '0'){
                        _msg+='最多'+arr[1]+'位小数';
                    }
                    return _msg;
                case 'gt':
                    if ($('label[for='+arr[1]+']').length > 0) {
                        return '必须大于'+$('label[for='+arr[1]+']').text();
                    }
                    return '1';
                case 'lt':
                    if ($('label[for='+arr[1]+']').length > 0) {
                        return '必须小于'+$('label[for='+arr[1]+']').text();
                    }
                    return '1';
                }
            }
        },

        /**
         * 进行验证
         * @author 欧远宁
         * @param arr
         * @param v
         * @returns Boolean 是否通过验证
         */
        val : function(arr, v){
            var self = this
                ,i = 0
                , gt = function(v, cmp){
                if (cmp.indexOf('-') > 0) {// 时间比较
                    return (new Date(v.replace(/-/g, "/")).getTime() > new Date(cmp.replace(/-/g, "/")).getTime());
                } else {// int类型比较
                    return (parseInt(v) > parseInt(cmp));
                }
            };
            for (; i < arr.length; i++) {
                var a = arr[i].split('-');
                if (a[0] == 'must') {
                    if (v == '') {
                        return '不能为空';
                    }
                    continue;
                }

                if (v == '')
                    continue;

                var reg_len = ''
                    ,errMsg = self.getCheckErr(a);
                if (a.length == 3) {
                    reg_len = ',' + a[2];
                }
                switch (a[0]) {
                case 'ip':// 检验ip
                    if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v))
                        return errMsg;
                    continue;
                case 'phone':// 检验电话
                    if (!/^((0[1-9]{3})?(0[12][0-9])?[-])?\d{6,8}$/.test(v))
                        return errMsg;
                    continue;
                case 'mobile':// 检验手机
                    if (!/(^0?[1][3-9][0-9]{9}$)/.test(v))
                        return errMsg;
                    continue;
                case 'date':// 检验日期
                    var f = (a[2] == undefined) ? 'yyyy-MM-dd' : a[2];// 格式
                    var m = 'MM', d = 'dd';
                    y = 'yyyy';
                    var regex = '^' + f.replace(y, '\\d{4}').replace(m, '\\d{2}').replace(d, '\\d{2}') + '$';
                    if (!new RegExp(regex).test(v))
                        return errMsg;
                    var s = v.substr(f.indexOf(y), 4) + '/' + v.substr(f.indexOf(m), 2) + '/' + v.substr(f.indexOf(d), 2);
                    if (isNaN(new Date(s)))
                        return errMsg;
                    continue;
                case 'idcard':// 简单的检验身份证
                    if (!/^(\d{14}|\d{17})(\d|[X])$/.test(v))
                        return errMsg;
                    continue;
                case 'zip':// 检验邮编
                    if (!/^\d{6}$/.test(v))
                        return errMsg;
                    continue;
                case 'qq':// 检验qq
                    if (!/^\d{5,15}$/.test(v))
                        return errMsg;
                    continue;
                case 'url':// 检验url
                    if (!/^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(v))
                        return errMsg;
                    continue;
                case 'mail':// 检验email
                    if (!/\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test(v))
                        return errMsg;
                    continue;
                case 'uuid':// 检验uuid
                    if (!/^[a-f0-9]{16}$/.test(v)) return errMsg;
                    continue;
                case 'cmp':// 与另外一个表单的value进行比较
                    if (v != $('#' + a[1]).val()) return errMsg;
                    continue;
                case 'reg':// 直接与正则比较
                    if (!RegExp(a[1]).test(v))
                        return errMsg;
                    continue;
                case 'alpha':// 字母，格式为 alpha-min-max 表示大于等于min且小于等于max， 如果alpha-num表示，必须是num多个alpha
                    if (!RegExp('^[A-Za-z]{' + a[1] + reg_len + '}$').test(v))
                        return errMsg;
                    continue;
                case 'alnum':// 字母+数字 用法与alpha同
                    if (!RegExp('^[A-Za-z0-9]{' + a[1] + reg_len + '}$').test(v))
                        return errMsg;
                    continue;
                case 'chinese':// 汉字 用法与alpha同
                    if (!RegExp('^[\u4e00-\u9fa5]{' + a[1] + reg_len + '}$').test(v))
                        return errMsg;
                    continue;
                case 'int':// int, 用法 int-min-max ，必须是大于等于min且小于等于max的整数
                    if (!RegExp('(^[1-9]+[0-9]{0,50}$)|(^0$)').test(v)) return '不是数值类型';
                    v = parseInt(v);
                    if (isNaN(v)) return '不是数值类型';
                    if (v < parseInt(a[1]) || v > parseInt(a[2])) {
                        return errMsg;
                    }
                    continue;
                case 'float':// float 用法 float-精度-最小-最大 比如float-2-10-100
                    if (!RegExp('^[0-9]+\.?[0-9]{0,'+a[1]+'}$').test(v)) return '不是数值类型';
                    v = parseFloat(v);
                    if (isNaN(v)) return '不是数值类型';
                    if (v < parseInt(a[2]) || v > parseInt(a[3])) {
                        return errMsg;
                    }
                    continue;
                case 'timestamp':// timestamp
                    if (!/^\d{1,11}$/.test(v))
                        return errMsg;
                    continue;
                case 'num':// 输入都是数字类型 用法与alpha同
                    if (!RegExp('^[-+]?[\\d]{' + a[1] + reg_len + '}$').test(v))
                        return errMsg;
                    continue;
                case 'str':// 普通字符串验证，一个中文占一个字符，用法与alpha同
                    if (!RegExp('^([\\D\\d]){' + a[1] + reg_len + '}$').test(v))
                        return errMsg;
                    continue;
                case 'str2':// 一个汉字当作2个字符
                    v = v.replace(/[^\x00-\xff]/g, "**");
                    if (!RegExp('^([\\D\\d]){' + a[1] + reg_len + '}$').test(v))
                        return errMsg;
                case 'gt':// 大于某个dom的值
                    var cmp = $('#' + a[1]).val();
                    if (!gt(v, cmp)) {
                        return '1';
                    }
                    continue;
                case 'lt':// 小于某个dom的值
                    var cmp = $('#' + a[1]).val();
                    if (cmp == v || gt(v, cmp)) {
                        return '1';
                    }
                    continue;
                default : //进入自定义
                    if (self._userVal[a[0]]) {
                        if ( ! self_userVal[a[0]](arr[i]) ){
                            return '1';
                        }
                    }
                    continue;
                }
            }
            return '';
        },

        /**
         * 发送请求得到结果
         * @param cmd
         * @param data
         * @param cb
         */
        cmd : function(cmd, data, cb, errFun, sync){
            if ($.isFunction(data)){
                cb = data;
                data = {};
			};
			if (!$.isFunction(errFun)){
				errFun = function(msg){
					$.alertMsg(msg);
				};
			}
        	data = data || {};
        	data['_c'] = cmd;
        	
        	if (sync == undefined){
        	    sync = true;
        	}
        	
			$.ajax({
				url : this.cfg.index,
				data : data,
				type : 'POST',
				async : sync,
				dataType : 'json',
				error : function(jqxhr, status, thrown){
				    if(status == 'timeout'){
				        errFun('连接超时');
				    } else if (status == 'parsererror') {
                        errFun('不是正确的json格式');
				    } else if (status == 'error') {
				        errFun('暂时无法连接到服务器，请稍候重试');
				    }
				},
				success : function(ret, status, jqxhr) {
	                if (ret['_t']){
	                    self.time = ret._t;
	                 }
	                 cb(ret);
				}
			});

        }
    };

    return new Now();
});
