/**
 * 可自动匹配的多选下拉框
 * @金宁宝
 */
!function ($) {

    var MutiDrop = function(element, options) {
        this.options = options;
        this.$element = $(element).addClass(options['css']).addClass('_clear').css({width:'233px'});

        this._data = {load:false};

        this._init();
    };

    MutiDrop.prototype = {
            constructor: MutiDrop, 
          
          _init : function() { 
              //初始化Drop内容
        	  var self = this
        		  ,el = this.$element
        		  ,op = this.options
        		  ,selectData = this._data
        		  ,str = '';

			str += '<div class="dropdown drop-multi">';
			str += '	<a class="dropdown-toggle" data-toggle="dropdown" href="javascript:;">';
			str += '		<ul class="drop-choices"><li class="search-field"><input class="default" type="text" style="width: 233px;" autocomplete="off" value="请点击选择" readonly=true></li></ul>';
			str += '		<input id="mutidrop_result" type="hidden" name="'+op.name+'" value="">';
			str += '	</a>';

            //搜索+下拉框 不显示
			str += '	<div id="mutidrop_con" style="display:none">';
			if (op.search) {
                //搜索输入字段
			    str += '	<input id="mutiDropSearch" type="text">';
			}

            // 搜索框
			str += '	<ul class="dropdown-menu mutidrop-search" style="max-height:260px;overflow-y:auto;">';
			str += '	</ul></div>';

			str += '</div>';

            //设置基础html
			el.html(str);

			el.click(function(e){
                // 阻止传播 撤销冒泡
                // e是否存在
				e ? e.stopPropagation() : event.cancelBubble = true;
			});

			$(document).click(function(e) {

                    console.info("/data/home/linzh/wwwroot/momo.im/test.momo.im/htdocs/js_lab/nui/static/js/nui.mutidrop.js", 57, "document");

                    console.info("/data/home/linzh/wwwroot/momo.im/test.momo.im/htdocs/js_lab/nui/static/js/nui.mutidrop.js", 59, e);
			    $('#mutidrop_con', el).hide();
			    $('#mutiDropSearch', el).val('');
			    self._resetList();
			});

            //{{{事件
			//选中内容
			el.on('click', 'li.nui-drop-li', function(){
				var result = $('#mutidrop_result',el).val();
				
				if(op.max_slt > 0 && result != ''){
					var ret_arr = result.split(',');
					if(ret_arr.length >= op.max_slt){
						$.alertMsg('最多只能选择'+op.max_slt+'个');
						return ;
					}
				}
				
				var currId = $(this).attr('id');
				var currName = $(this).find('a').html();
				if(result == ''){
					$('#mutidrop_result',el).val(currId);
				}else{
					$('#mutidrop_result',el).val(result+','+currId);
				}

				var addLi = '<li class="search-choice"><span>'+currName+'</span><span rel="1" class="search-choice-close" del_id="'+currId+'" href="javascript:;"></span></li>';
				$('.drop-choices',el).append(addLi);
				$('#mutidrop_con', el).hide();
				$('#mutiDropSearch', el).val('');

				self._resetList();

				$('.search-field',el).hide();

				self._event('select', $(this).attr('id'));
			});

			//删除已选择的内容
			el.on('click', 'span.search-choice-close', function(e){
				var del_id = $(this).attr('del_id');

				var result = $('#mutidrop_result',el).val();
				result = result.replace(del_id+',','').replace(','+del_id,'').replace(del_id,'');
				$('#mutidrop_result',el).val(result);

				$(this).parent().remove();
				$('#'+del_id,el).show();

				if(result == ''){
					$('.search-field',el).show();
				}
				e.stopPropagation();
			});

			el.on('click', 'a.dropdown-toggle', function(e){
				$('#mutidrop_con',el).show();
				$('ul.dropdown-menu',el).show();
			});

			//绑定搜索框
			el.on('keyup', '#mutiDropSearch', function(event){

			    var keyword = $.trim($(this).val()),
                    selected = el.find("span.search-choice-close"),
                    seIds = "";

			    $.each(selected, function (i, se) {
			        seIds += $(se).attr("del_id") + ",";
			    });

				if(keyword==''){
					$(this).val('');
					self._resetList();
					return false;
				}

				$.each(selectData.nowData,function(key,val){
				    if (val.name.indexOf(keyword) >= 0 && seIds.indexOf(val[op.fid]) < 0) {
						$('#'+val[op.fid], el).show();
					}else{
						$('#'+val[op.fid],el).hide();
					}
				});
			});


            el.on('keydown', '#dropSearch', function (event) {
                var keyword = $.trim($(this).val());
                //绑定回车
                if (event.keyCode == "13") {
                	op.para[op.name] = keyword;
					$('li.nui-drop-li',el).remove();
					el.mutidrop('reload');
                    return false;
                }
            });

			el.on('keydown', '#mutiDropSearch', function (event) {
			    //绑定回车
			    if (event.keyCode == "13") {
			        op.para[op.name] = $.trim($(this).val());
			        $('li.nui-drop-li', el).remove();
			        el.mutidrop('reload');
			        return false;
			    }
			});
            //}}}

			this.reload();
          }

        //重置列表，隐藏已选项
        , _resetList: function () {
            var self = this,
                el = this.$element,
                op = this.options,
                selected = el.find("span.search-choice-close"),
                select = el.find("li.nui-drop-li"),
                seIds = "";

            $.each(selected, function (i, se) {
                seIds += $(se).attr("del_id") + ",";
            });
            
            $.each(select, function (key, se) {
                var id = se.id;
                if (seIds.indexOf(id) >= 0) {
                    $('#' + id, el).hide();
                } else {
                    $('#' + id, el).show();
                }
            });
        }
        , 
        
        reload: function (ttl) { 
            //刷新显示
        	  var self = this
				 ,op = this.options
				 ,para = op.para;

        	  //刷新重新加载先清空原有数据
        	  self.clear();

        	  if (typeof op.data == 'string' && op.data != '') {
        	      now.cmd(op.data, para, function(ret){
        	          self._getBody(ret);
        	      });
        	  } else {
                  self._getBody(op.data);
        	  }
          }, 
          
          settext : function(text) { //手动设置显示的文本
    		  var el = this.$element;
        	  $('.dropdown-toggle',el).find('div').html(text);
          }, 
          
          _event : function(type,fid) {

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

				self._resetList();
          }, 
          
          _getBody : function(ret){
              //ret 调用时请求的下拉框源数据
              //得到主体数据
              this._data.nowData = ret.rows;

              var html = ''
                  ,el = this.$element
                  ,op = this.options
                  ,_result;

              _result = $('#mutidrop_result',el).val();

              $.each(this._data.nowData, function(key, value){
				if(_result.indexOf(value[op.fid]) == -1){
					html += '<li class="nui-drop-li" id="'+value[op.fid]+'"><a href="javascript:;">'+value.name+'</a></li>';
				}else{
					html += '<li class="nui-drop-li hide" id="'+value[op.fid]+'"><a href="javascript:;">'+value.name+'</a></li>';
				}
              });

              $('.dropdown-menu',el).append(html);
          }, 
          
          setDef : function(ret){
  			var el = this.$element,
			    str = '',
			    _defData = [],
  				_i = 0;

  			$('li.search-choice',el).remove();
			$('#mutidrop_result', el).val('');
			$('li.nui-drop-li',el).show();

			if(!$.isEmptyObject(ret)){
				$('.search-field',el).hide();

				$.each(ret,function(key,val){
					str += '<li class="search-choice"><span>'+val+'</span><span rel="1" class="search-choice-close" del_id="'+key+'" href="javascript:;"></span></li>';
					$('#'+key,el).hide();
					_defData[_i++] = key;
				});

				$('.drop-choices',el).append(str);
				$('#mutidrop_result',el).val(_defData.join());
			}else{
				$('.search-field',el).attr('style','display: list-item;');
			}
		},
        
        setByIdx : function(arr){
			var el = this.$element
		    ,jsonData = {};
			$.each(arr,function(key,val){
				$('.dropdown-menu li', el).each(function(i,n){
					if (i==val) {
						jsonData[$(this).attr('id')] = $(this).find('a').text();

					}
				});
			});
			this.setDef(jsonData);
		},
        
        setByText : function(arr){
			var el = this.$element
		    ,jsonData = {};
			$.each(arr,function(key,val){
				$('.dropdown-menu a', el).each(function(i,n){
					var text = $(this).text();
					if (text==val) {
						jsonData[$(this).parent().attr('id')] = text;
					}
				});
			});
			this.setDef(jsonData);
		}, 
        
        clear : function(){
  			var el = this.$element;

			$('li.search-choice',el).remove();
			$('#mutidrop_result', el).val('');
			$('li.nui-drop-li',el).show();
			$('li.search-field',el).attr('style','display: list-item;');
			//$('.dropdown-menu li',el).remove();
		}
    };

    $.fn.mutidrop = function (option, para, cb) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('mutidrop')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.mutidrop.defaults, typeof option == 'object' && option);
            $this.data('mutidrop', (data = new MutiDrop(this, options)));
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

    $.fn.mutidrop.defaults = {
      data : '',
      para : {},
      name : 'keyword', //下拉选择控件的名称
      fid : 'id', //数据id名称
      search:false, //隐藏搜索
      max_slt : 0,//最多可以选择几个
      css : 'nui-mutidrop'
    };
}(jQuery);
