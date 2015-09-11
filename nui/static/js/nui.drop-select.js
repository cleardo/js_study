/**
 * 下拉框
 * @金宁宝
 */
!function ($) {
    var DropSelect = function(element, options) {
        this.options = options;
        this.$element = $(element).addClass(options['css']);
        this._data = {load:false};
        this._init();
    };

    DropSelect.prototype = {
            constructor: DropSelect
          , _init : function() { //初始化Drop内容
			this.reload();
          }, reload : function(ttl) { //刷新显示
        	  var self = this
        	     ,op = this.options;

        	  if (typeof op.data == 'string' && op.data != '') {
        	      now.cmd(op.data, {}, function(ret){
        	          self._getBody(ret);
        	      });
        	  } else {
                  self._getBody(op.data);
        	  }
          }, _getBody : function(ret){//得到主体数据
              this._data.nowData = ret.rows;
              var option = ''
                  ,el = this.$element
                  ,op = this.options;

              $.each(this._data.nowData, function(key, value){
					option += '<option value="'+value[op.fid]+'">'+value.name+'</option>';
              });

              el.html(html);
          }
    };

    $.fn.dropselect = function (option, para, cb) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('dropselect')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.dropselect.defaults, typeof option == 'object' && option);
            $this.data('dropselect', (data = new DropSelect(this, options)));
        } else if (!os) {
            data.options = $.extend({}, data.options, option);
        }
        if (os) {
            if ( $.isFunction(para) ) {
                para(data[option]({}));
            } else if($.isFunction(cb)) {
                cb(data[option](para));
            } else {
                data[option](para);
            }
        }
      });
    };

    $.fn.dropselect.defaults = {
      data : '',
      para : {},
      fid : 'id', //数据id名称
      width : 240 //组件宽度
    };
}(jQuery);
