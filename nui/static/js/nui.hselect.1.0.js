/**
 * 横向的选择。类似select标签
 * @金宁宝
 */
!function ($) {
    var HSelect = function(element, options) {
        this.options = options;
        this.$element = $(element).addClass(options['css']);
        this._data = {load:false};
        this._init();
    };

    HSelect.prototype = {
            constructor: HSelect
          , _init : function() { //初始化HSelect内容
        	  var self = this
        		  ,el = this.$element;

			el.on('click', 'li._a_pill', function(){
				$(this).parent().find('li.active').removeClass('active');
				$(this).addClass('active');
				self._event('select');
			});

			this.reload();
          }, 
          reload : function(ttl) { //刷新显示
        	  var self = this
        	     ,op = this.options
     	         ,para = op.para;

        	  if (typeof op.data == 'string' && op.data != '') {
        	      now.cmd(op.data, para, function(ret){
        	          self._getBody(ret);
        	      });
        	  } else {
                  self._getBody(op.data);
        	  }
          }, 
          _event : function(type) {

				var self = this
				   ,el = this.$element
				   ,data = this._data.nowData
				   ,_fid=self.options.fid
				   ,_selectObj='';

				_selectObj = $('li.active',el);

				var search = function(json){
				   var ret = {};
				   $.each(json, function(key, value){
					   $.each(value.list, function(idx, node){
							$.each(_selectObj ,function(s,slt){
								if (slt.id == node[_fid]) {
									ret[$('li#'+slt.id,el).parent().attr('name')] = node[_fid];
								}
							});
					   });
				   });
				   return ret;
				};

				var selected = search(data);
				if (selected) {
				   var e = $.Event(type);
				   self.$element.trigger(e, selected);
				}
          }, 
          _getBody : function(ret){//得到主体数据
              this._data.nowData = ret.rows;
              var html = ''
                  ,el = this.$element
                  ,op = this.options
                  ,_classNmae = '_a_pill';

              $.each(this._data.nowData, function(key, value){

				  html+='<div style="overflow:hidden;">';
				  if(value.title){
					html+='<dt style="float:left">'+value.title+' : </dt>';
				  }
				  html+='<ul class="nav nav-pills" style="float:left" name="'+value.name+'">';
				  if(value.all){
					html+='<li class="'+_classNmae+'"><a href="javascript:;" id="">'+value.all+'</a></li>';
				  }
				  $.each(value.list, function(idx, item){
					if(value.val == item[op.fid]){
						_classNmae = '_a_pill active';
					}else{
						_classNmae = '_a_pill';
					}
					 html+='<li id="'+item[op.fid]+'"  class="'+_classNmae+'"><a href="javascript:;">'+item.name+'</a></li>';
				  });
				  html+='</ul>';
				  html+='</div>';
              });

              el.html(html);
          }
    };

    $.fn.hselect = function (option, para, cb) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('hselect')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.hselect.defaults, typeof option == 'object' && option);
            $this.data('hselect', (data = new HSelect(this, options)));
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

    $.fn.hselect.defaults = {
      data : '',
      para : {},
      fid : 'id' //数据id名称
    };
}(jQuery);
