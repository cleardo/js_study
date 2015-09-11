/**
 * 可自动匹配的下拉框
 * @金宁宝
 */
!function ($) {
    var SwitchDrop = function(element, options) {
        this.options = options;
        this.$element = $(element).addClass(options['css']);
        this._data = {load:false};
        this._init();
    };

    SwitchDrop.prototype = {
            constructor: SwitchDrop
          , _init : function() { //初始化SwitchDrop内容
        	  var self = this
        		  ,el = this.$element
        		  ,op = this.options
        		  ,str = '';

			str += '<div id="_assignedTo_chzn_switch" class="chzn-container_switch chzn-container_switch-single" style="width: '+op.width+'px;">';
			str += '	<a id="_chzn" class="chzn-single_switch" href="javascript:void(0)" tabindex="0">';
			str += '		<span></span>';
			str += '		<div><b></b></div>';
			str += '	</a>';
			str += '	<div style="left: -9000px; width: 243px; top: 21px;" class="chzn-drop_switch">';
			str += '		<ul id="_result_switch" class="chzn-results_switch"></ul>';
			str += '	</div>';
			str += '</div>';

			el.html(str);

			el.on('click', '#_chzn', function(){
				$('#_assignedTo_chzn_switch',el).addClass('chzn-container-active');
				$(this).addClass('chzn-single-with-drop');
				$('div.chzn-drop_switch',el).css({'left': '0px', 'width': '243px', 'top': '21px'});
			});

			el.on('mouseleave',function(){
				$('#_assignedTo_chzn_switch',el).removeClass('chzn-container-active');
				$(this).removeClass('chzn-single-with-drop');
				$('div.chzn-drop_switch',el).css({'left': '-9000px', 'width': '243px', 'top': '21px'});
				$('li.active-result',el).show();
			});

			el.on('click', 'li.active-result', function(){

				$('#_chzn',el).find('span').html($(this).html());
				$('#_chzn',el).find('input').val($(this).attr('id'));

				$('.active-result',el).removeClass('result-selected highlighted');
				$(this).addClass('result-selected highlighted');

				$('#_assignedTo_chzn_switch',el).removeClass('chzn-container-active');
				$(this).removeClass('chzn-single-with-drop');
				$('div.chzn-drop_switch',el).css({'left': '-9000px', 'width': '243px', 'top': '21px'});

				self._event('select', $(this).attr('id'));
			});

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
          }, _event : function(type,fid) {
				var self = this
				   ,data = this._data.nowData;

				var search = function(json){
				   var ret = '';
				   $.each(json, function(idx, node){
					   if (ret) return;
					   if (idx == fid) {
						   ret = idx;
					   }
				   });
				   return ret;
				};

				var selected = search(data);
				if (selected) {
				   var e = $.Event(type);
				   self.$element.trigger(e, selected);
				}
          }, _getBody : function(ret){//得到主体数据
              this._data.nowData = ret;
              var html = ''
                  ,el = this.$element
                  ,op = this.options
                  ,_i = 0;
                 
              $.each(this._data.nowData, function(key, value){
            	  	if(op.isSetDef && _i == 0){
            	  		$('#_chzn',el).find('span').html(value);
            	  	}
					html += '<li style="" class="active-result" id="'+key+'">'+value+'</li>';
					_i++;
              });

              $('#_result_switch',el).html(html);
          }
    };

    $.fn.switchdrop = function (option, para, cb) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('switchdrop')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.switchdrop.defaults, typeof option == 'object' && option);
            $this.data('switchdrop', (data = new SwitchDrop(this, options)));
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

    $.fn.switchdrop.defaults = {
      data : '',
      para : {},
      isSetDef : true, //是否设置第一个为默认值
      width : 120 //组件宽度
    };
}(jQuery);



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

    Drop.prototype = {
            constructor: Drop
          , _init : function() { //初始化Drop内容
        	  var self = this
        		  ,el = this.$element
        		  ,op = this.options
        		  ,selectData = this._data
        		  ,str = '';

			str += '<div id="assignedTo_chzn" class="chzn-container chzn-container-single" style="width: '+op.width+'px;">';
			str += '	<a class="chzn-single" href="javascript:void(0)" tabindex="0">';
			str += '		<span></span>';
			str += '		<input type="hidden" name="'+op.name+'" value="">';
			str += '		<div><b></b></div>';
			str += '	</a>';
			str += '	<div style="left: -9000px; width: 243px; top: 21px;" class="chzn-drop">';
			str += '		<div class="chzn-search_drop"><input id="searchInput" type="text" autocomplete="off" style="width: 208px;" tabindex="-1"></div>';
			str += '		<ul class="chzn-results"></ul>';
			str += '	</div>';
			str += '</div>';

			el.html(str);

			el.on('click', 'a.chzn-single', function(){

				$('#assignedTo_chzn',el).addClass('chzn-container-active');
				$(this).addClass('chzn-single-with-drop');
				$('div.chzn-drop',el).css({'left': '0px', 'width': '243px', 'top': '21px'});
			});

			el.on('mouseleave',function(){
				$('#assignedTo_chzn',el).removeClass('chzn-container-active');
				$(this).removeClass('chzn-single-with-drop');
				$('div.chzn-drop',el).css({'left': '-9000px', 'width': '243px', 'top': '21px'});
				$('li.active-result',el).show();

				$('#searchInput').val('');
			});

			el.on('click', 'li.active-result', function(){

				$('.chzn-single',el).find('span').html($(this).html());
				$('.chzn-single',el).find('input').val($(this).attr('id'));

				$('.active-result',el).removeClass('result-selected highlighted');
				$(this).addClass('result-selected highlighted');

				$('#assignedTo_chzn',el).removeClass('chzn-container-active');
				$(this).removeClass('chzn-single-with-drop');
				$('div.chzn-drop',el).css({'left': '-9000px', 'width': '243px', 'top': '21px'});

				$('#searchInput').val('');

				self._event('select', $(this).attr('id'));
			});

			el.on('keyup', '#searchInput', function(){
				var keyword = $(this).val();
				$.each(selectData.nowData,function(key,val){
					if(val.name.indexOf(keyword) >= 0){
						$('#'+val[op.fid]).show();
					}else{
						$('#'+val[op.fid]).hide();
					}
				});
			});


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
          }, _event : function(type,fid) {

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
          }, _getBody : function(ret){//得到主体数据
              this._data.nowData = ret.rows;
              var html = ''
                  ,el = this.$element
                  ,op = this.options;

              $.each(this._data.nowData, function(key, value){
					html += '<li style="" class="active-result" id="'+value[op.fid]+'">'+value.name+'</li>';
              });

              $('.chzn-results',el).html(html);
          }
    };

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
      width : 240 //组件宽度
    };
}(jQuery);
