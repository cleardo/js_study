
/**
 * 可自动匹配的下拉框
 * @金宁宝
 */
    !function ($) {
        var Drop = function(element, options) {
            this.options = options;
            this.$element = $(element).addClass(options['css']);
            this._data = {load:false};
            this._init();
        };
        //{{{插件接口
        Drop.prototype = {
            constructor: Drop
              , _init : function() { //初始化Drop内容
                  var self = this
                      , el = self.$element
                      , op = self.options
                      , selectData = self._data
                      , str = ''
                  , 
                  
                  dropCount = $('.dropdown').length,

                  minWidth = '';

                  if (op.minWidth && op.minWidth > 0) {
                      minWidth = ' min-width: ' + op.minWidth + 'px';
                  }

                  console.log(op);

                  //fix ie7 position bug ：加降序的z-index
                  str += '<div class="dropdown" style="z-index:' + (1000 - dropCount) + '";>';
                    // .drop-top-begin
                  str += '<div class="drop-top">';
                  str += '	<a class="dropdown-toggle" data-toggle="dropdown" style="' + minWidth + '" href="javascript:;">';
                  str += '		<span>请选择</span>';
                  str += '		<b class="caret"></b>';
                  str += '		<input type="hidden" name="'+op.name+'" value="">';
                  str += '	</a>';
                  str += '</div>';
                  // .drop-top-end

                  str += '	<div id="dropdown_con" class="dropdown_con">';
                  if (!op.hide_search) {
                      str += '	<input id="dropSearch" type="text">';
                  }
                  str += '	<ul class="dropdown-menu" style="max-height:260px;overflow-y:auto;"></ul></div>';

                  str += '</div>';

                    //构建input元素
                  el.html(str);

                  el.click(function(e){
                      e?e.stopPropagation():event.cancelBubble = true;
                  });
                  $(document).click(function(e) {

                    //点击文档
                          console.info("/data/home/linzh/wwwroot/momo.im/test.momo.im/htdocs/js_lab/nui/static/js/nui.drop.js", 62, e);
                      $('#dropdown_con', el).hide();

                      $('#dropSearch', el).val("");
                      $('li.nui-drop-li', el).show();

                  });

                  el.on('click', 'li.nui-drop-li', function(){

                      $('.dropdown-toggle',el).find('span').html($(this).html());
                      $('.dropdown-toggle',el).find('input').val($(this).attr('id'));

                      $('#dropdown_con',el).hide();

                      $('.nui-drop-li',el).removeClass('active');
                      $(this).addClass('active');

                      self._event('select', $(this).attr('id'));

                      $('#dropSearch', el).val("");
                      $('li.nui-drop-li', el).show();
                  });

                  el.on('click', 'a.dropdown-toggle', function(){

                      $('.nui-drop .dropdown_con').hide();

                      $('#dropdown_con',el).show();
                      $('ul.dropdown-menu',el).show();
                  });

                  el.on('keyup', '#dropSearch', function(event){
                      var keyword = $.trim($(this).val());
                      if(keyword==''){
                          $(this).val('');
                          $('li.nui-drop-li',el).show();
                          return false;
                      }
                      
                      $.each(selectData.nowData,function(key,val){
                          if(val.name.indexOf(keyword) >= 0){
                              $('#'+val[op.fid]).show();
                          }else{
                              $('#'+val[op.fid]).hide();
                          }
                      });
                  });

                  el.on('keydown', '#dropSearch', function (event) {
                      //绑定回车
                      if (event.keyCode == "13") {
                          self.options.para[op.keyword] = $.trim($(this).val());
                          $('li.nui-drop-li', el).remove();
                          el.drop('reload','search');
                          return false;
                      }
                  });

                  //绑定点击  "上下"
                  el.on('keydown', function (event) {
                      var $obj = $('#dropdown_con', el);
                      if (el == null || el == undefined || $obj == null || $obj == undefined) {
                          return;
                      }
                      if ($obj.css('display') != 'none' && self._isInViewZone($obj)) {
                          var currentIndex = $('.nui-drop-li:visible', el).index($('.nui-drop-li:visible.active', el));
                          if (event.keyCode == '38') {
                              return self._setLiActive(currentIndex - 1);
                          }
                          else if (event.keyCode == '40') {
                              return self._setLiActive(currentIndex + 1);
                          }
                      }
                  });

                  this.reload();
              }
            //判断元素是否在可视范围内
            , _isInViewZone: function ($el) {
                var offTop = $el.offset().top,
                    widowHeight = $(window).height(),
                    documentScroolTop = $(document).scrollTop();

                if (offTop >= documentScroolTop && offTop <= documentScroolTop + widowHeight) {
                    return true;
                }
                else {
                    return false;
                }
            }
            //设置明细数据项Active
            , _setLiActive: function (index) {
                var el = this.$element,
                    subLength = $('.nui-drop-li:visible', el).length,
                    $obj = $('.nui-drop-li', el),
                    $objVisible = $('.nui-drop-li:visible', el);

                if (index >= 0 && index < subLength) {
                    $obj.removeClass('active');
                    $($objVisible[index]).addClass('active');
                    return false;
                }
                else {
                    return true;
                }
            }
        , 
        
        reload: function (ttl) { //刷新显示
        	  var self = this
        	     ,op = this.options
                 ,el = this.$element
				 ,para = op.para;

        	  if (typeof op.data == 'string' && op.data != '') {
                  //获取数据
        	      now.cmd(op.data, para, function(ret){
        	          self._getBody(ret.rows);

                    //触发reloadOk事件
					  el.trigger($.Event('reloadOk'), ret.rows);

					  if(ret.rows != '' && ttl != 'search'){
                          //不是搜索
						  op.callBack(ret.rows);
					  }
        	      }, null, false);

        	  } else if(op.data != '') {
                  // 获取
                  self._getBody(op.data.rows);
				  el.trigger($.Event('reloadOk'), op.data.rows);

				  if(op.data.rows && ttl != 'search'){
					  op.callBack(op.data.rows);
				  }

        	  }
          }, settext : function(text) { //手动设置显示的文本
    		  var el = this.$element;
    		  $('.dropdown-toggle',el).find('span').html(text);
          }, select : function(id) { //选中某个值
        	  var el = this.$element;
        	  $('li.nui-drop-li', el).each(function(i,n){
        		  if ($(this).attr('id')==id) {
        			  $('.dropdown-toggle',el).find('span').html($(this).html());
      				  $('.dropdown-toggle',el).find('input').val($(this).attr('id'));

      				  $('#dropdown_con',el).hide();

      				  $('.nui-drop-li',el).removeClass('active');
      				  $(this).addClass('active');
        			  return;
        		  }
        	  });
          }, 
          
          // 事件函数
          _event : function(type,fid) {

                //_data当前数据
				var self = this
				   ,data = this._data.nowData
				   ,_fid=self.options.fid;


				var search = function(json){
				   var ret = '';

				   $.each(json, function(idx, node){
					   if (ret) return;
					   if (node[_fid] == fid) {
						   ret = node;
					   }
				   });
				   return ret;
				};

				var selected = search(data);
				if (selected) {
				   var e = $.Event(type);
				   self.$element.trigger(e, selected);
				}
          }, 
          
          _getBody : function(rows){//得到主体数据
              this._data.nowData = rows;
              var html = ''
                  ,el = this.$element
                  ,op = this.options
                  ,_i = 0;

			 if(op.selectAll != ''){
				html += '<li class="nui-drop-li"><a href="javascript:;">'+op.selectAll+'</a></li>';
			 }
             $.each(this._data.nowData, function(key, value){
					if(op.isSetDef && _i == 0 && $('.dropdown-menu',el).html() == ''){
						//第一次的时候设置第一个值为默认值
						$('.dropdown-toggle',el).find('span').html(value.name);
						$('.dropdown-toggle',el).find('input[name='+op.fid+']').val(value[op.fid]);
						html += '<li class="nui-drop-li active" id="'+value[op.fid]+'" title="'+value.name+'"><a href="javascript:;">'+value.name+'</a></li>';
					}else{
						html += '<li class="nui-drop-li" id="'+value[op.fid]+'" title="'+value.name+'"><a href="javascript:;">'+value.name+'</a></li>';
					}

					_i++;
             });

             $('.dropdown-menu',el).html(html);
          }, setDef : function(id){
  			var el = this.$element;

			$('.dropdown-toggle',el).find('span').html($('#'+id).html());
			$('.dropdown-toggle',el).find('input').val($('#'+id).attr('id'));

			$('#dropdown_con',el).hide();

			$('.nui-drop-li',el).removeClass('active');
			$('#'+id).addClass('active');
		},setByIdx : function(idx){
			var el = this.$element
			    ,id = $('.dropdown-menu li', el).eq(idx).attr('id');

			this.setDef(id);

		},setByText : function(text){
			var self = this
				,el = self.$element;

			$('.dropdown-menu li', el).each(function(i,n){
				if ($(this).text()==text) {
					var id = $(this).attr('id');
					self.setDef(id);
					return false;
				}
			});
		},getVal : function(){
			var self = this
				,op = this.options
				,el = self.$element
				,dropValue = '';

			dropValue = el.find('input[name='+op.name+']').val();

			return dropValue;
		}
    };
    // }}}
    $.fn.drop = function (option, para, cb) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('drop')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.drop.defaults, typeof option == 'object' && option);
            $this.data('drop', (data = new Drop(this, options)));
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

    $.fn.drop.defaults = {
      data : '',
      para : {},
      name : 'searchslt', //下拉选择控件的名称
      fid : 'id', //数据id名称
      width : 240, //组件宽度
      hide_search:false, //隐藏搜索
      keyword:'keyword', //搜索关键字参数
      isSetDef : false, //是否设置第一个为默认值
      css : 'nui-drop',
      val : '请选择',
      selectAll : '',
      callBack: function (para) { },//加载完成后回调的方法
      minWidth: 0 //默认显示的最小宽度
    };
}(jQuery);
