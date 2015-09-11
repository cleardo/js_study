define( function(require) {
    var N = require('now');
    var Fxl = function(){
        this.cfg = {};
        this.session = {};
        this.cms = {};
        this.disCb = '';
    };
    Fxl.prototype = {
            constructor: Fxl,
            
            sec2hour : function(second,chinese){
            	var str = '';
            	var h = 0;
            	var tstr = '';
            	if (second>3600) {
            		h = second/3600;
            		second = second%3600;
            		tstr = chinese ? '小时' : ':';
            		if (h<10) {
            			str += '0' + h + tstr;
            		}else {
            			str += h + tstr;
            		}
            	}
            	var m = 0;
            	if (second>60) {
            		m = second/60;
            		second = second%60;
            		tstr = chinese ? '分钟' : ':';
            		if (m<10){
            			str += '0' + m + tstr;
            		}else {
            			str += m + tstr;
            		}
            		
            	}
            	
            	tstr = chinese ? '秒' : '';
            	if (second<10){
            		str = '0' + second + tstr;
            	}else {
            		str = second + tstr;
            	}
            	
            	return str;
            },
    
            cmd : function(cmd, para, okFun, errFun, sync){
                if ($.isFunction(para)){
					sync = errFun;
                    errFun = okFun;
                    okFun = para;
                    para = {};
                };

                N.cmd(cmd, para, function(ret){
                    if (ret['_c'] == undefined){
                        okFun(ret);
                    } else {
                        if ($.isFunction(errFun)){
                            errFun(ret._m);
                        } else {
                            $.alertMsg('出错提示', ret['_m']);
                        }
                    }
                }, function(msg){
                    if ($.isFunction(errFun)){
                        errFun(msg);
                    } else {
                        $.alertMsg('出错提示', ret['_m']);
                    }
                },sync);
            },
            setDispose : function(cb) {
            	this.disCb = cb;
            },
            
            dispose : function(){
            	if ($.isFunction(this.disCb)) {
            		this.disCb();
            		this.disCb = '';
            	}
            }
    };
    return new Fxl();
});
