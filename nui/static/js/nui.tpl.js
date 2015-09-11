!function ($) {
    /**
     * 得到一个模版结果
     * @author 欧远宁
     * @param string tpl   模版url
     * @param object para  后端请求的参数
     * @param function fun 完成后的回调
     */
    $.fn.tpl = function(tpl, para, fun){
        // 返回包装集
        return this.each(function () {
            // div#container
            var _me = $(this);

            if ($.isFunction(para)){
                fun = para;
                para = {};
            }

            // 闭包
            var _cb = function(data){
                now.tpl(tpl, data, function(html){
                  _me.html(html);
                  // 加载完视图后，调用的方法
                  if ($.isFunction(fun)){
                      fun(data);
                  }
                });
            };

            if (para['_c']){
                var cmd = para['_c'];
                delete para['_c'];
                now.cmd(cmd, para, function(ret){
                    _cb(ret);
                });
            } else {
                _cb(para);
            }
        });
    };
}(jQuery);
