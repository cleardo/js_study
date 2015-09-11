/**
 * 简单的滚动容器
 * @金宁宝
 */
!function ($) {
    var Scroll = function(element, options) {
        this.options = options;
        this.$element = $(element).addClass(options['css']);
        this._data = {load:false};
        this._init();
    };

    Scroll.prototype = {
            constructor: Scroll
          , 
          _init : function() { //初始化Scroll内容
        	  var el = this.$element;

			el.on('click', 'div.nui-scroll-left', function(){
        	  var _allObj = ''
        	     ,_showObj = ''
        	     ,_firstId = ''
        	     ,_firstShowId = ''
        	     ,_lastShowId = '';

				_allObj = $('div.nui-scroll-item',el);
				_showObj = $('div.show',el);

				if(_allObj.length > 0){
					_firstId = _allObj.get(0).id;
				}

				if(_showObj.length > 0){
					_firstShowId = _showObj.get(0).id;
					_lastShowId = _showObj.get(_showObj.length-1).id;

					if(_firstShowId != _firstId){
						$('#'+_firstShowId,el).prev().removeClass('hide').addClass('show');
						$('#'+_lastShowId,el).removeClass('show').addClass('hide');
					}
				}
			});

			el.on('click', 'div.nui-scroll-right', function(){
        	  var _allObj = ''
        	     ,_showObj = ''
        	     ,_lastId = ''
        	     ,_firstShowId = ''
        	     ,_lastShowId = '';

				_allObj = $('div.nui-scroll-item',el);
				_showObj = $('div.show',el);

				if(_allObj.length > 0){
					_lastId = _allObj.get(_allObj.length-1).id;
				}

				if(_showObj.length > 0){
					_firstShowId = _showObj.get(0).id;
					_lastShowId = _showObj.get(_showObj.length-1).id;
					if(_lastShowId != _lastId){
						$('#'+_firstShowId,el).removeClass('show').addClass('hide');
						$('#'+_lastShowId,el).next().removeClass('hide').addClass('show');
					}
				}
			});

			el.on('click', '#_viewHref', function(){
                // 触发绑定的viewAll事件处理函数
				el.trigger($.Event('viewAll'),'');
			});

			this.reload();
          }, 

          reload : function(ttl) { 
              // 刷新显示
        	  var self = this,
                op = this.options,
                para = op.para;

        	  if (typeof op.data == 'string' && op.data != '') {
				  para.all = 'y';
				  para.ttl = ttl?ttl:'y';
        	      now.cmd(op.data, para, function(ret){
        	          self._getBody(ret.rows, ret.ttl);
        	      });
        	  } else {
                  // 直接传数据
                  console.log('getBody');
                  self._getBody(op.data, op.data.length);
        	  }
          }, 

          _getBody : function(rows, ttl) {
              // 得到主体数据
              this._data.nowData = rows;

              var html = '',
                // 当前容器div元素
                el = this.$element,
                op = this.options,
                _classNmae = 'show';

			  html+='<div>';
			  html+='	<div class="row-fluid nui-scroll-head">';
			  html+='		<div class="pull-left">';

			  if(op.title != ''){
				html+=op.title;
			  }

			  html+='		</div>';

			  html+='		<div class="pull-right">';

			  if(op.ttl != '') {
                  console.log('参数ttl不为空', ttl);
		          html+=op.ttl.replace('{ttl}', ttl);
			  }

			  if(op.ttlTxt != ''){
				html+='&nbsp;&nbsp;<a id="_viewHref" href="javascript:;">'+op.ttlTxt+'</a>';
			  }

			  html+='		</div>';
			  html+='	</div>';
			  html+='	<div class="row-fluid nui-scroll-body" style="height: '+op.hvWidth+'px;">';
			  html+='		<div class="pull-left nui-scroll-left">向左</div>';
			  html+='		<div class="pull-right nui-scroll-right">向右</div>';

			  html+='		<div class="pull-right nui-scroll-content">';

              $.each(this._data.nowData, function(idx, item) {
                  console.log("数据项value", item);

				if(idx >= op.showNum) {
					_classNmae = 'hide';
				}

				html+='<div class="nui-scroll-item '+_classNmae+'" id="'+item[op.fid]+'" style="width: '+op.liWidth+'px;">';
				if($.isFunction(op.render)){
					html+=op.render(item);
				} else{
					now.tpl(op.render,item,function(ret){
						html+=ret;
					},false);
				}
				html+='</div>';
              });
			  html+='		</div>';
			  html+='	</div>';
			  html+='</div>';

              el.html(html);
          }
    };

    $.fn.scroll = function (option, para, cb) {
        // console.log('scroll');
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('scroll')
          , os = (typeof option == 'string');

        if (!data) {
            // 将Scroll存储到scroll
            var options = $.extend({}, $.fn.scroll.defaults, typeof option == 'object' && option);
            $this.data('scroll', (data = new Scroll(this, options)));
        } else if (!os) {
            data.options = $.extend({}, data.options, option);
            // console.log(option);
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

    $.fn.scroll.defaults = {
      title: '',      //标题
      ttl : '',  //是否显示总数 例如：'共{ttl}笔'
      ttlTxt : '', //显示所有连接
      render : '', //生成每个数据块函数
      data : '',
      para : {},
      showNum : 3,//显示的条数
      fid : 'id', //数据id名称
      hvWidth : '500', //scroll宽度
      liWidth : '150' //每个数据块宽度
    };
}(jQuery);
