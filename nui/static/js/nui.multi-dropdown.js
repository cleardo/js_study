/**
 * 多选的自动匹配下拉
 *@author 杨艳
 */
!function(){
	var _cmd = '';
	var MutiDrop = function(element, options) {
		this.options = options;
		this.$element = $(element).addClass(options['css']);
		this._data = {load:false};
		this._init();
	};

	MutiDrop.prototype = {
		constructor:MutiDrop,
		_init : function() {
			var self = this;
			self.reload();
		},reload : function(ttl){
			var op = this.options,
				self = this;
				if (typeof op.data == 'string' && op.data != '') {
					_cmd = op;
				}
				if (typeof op.data == 'string' && op.data != '' && !op.searchs) {
					_cmd = op;
					now.cmd(op.data, {}, function(ret){
						self._getBody(ret);
					});
				}else{
					if(op.data){
						self._getBody(op.data);
					}
				}
		},_event : function(type, fid){
			var el = this.$element,
				data = this._data.nowData,
				_fid = this.options.fid;

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
				   el.trigger(e, selected);
				}
		}, _getBody : function(ret){

			this._data.nowData = ret.rows;
			var html = '',
				el = this.$element,
				op = this.options,
				str = '';

			str += '<div id="selectError1_chzn" class="chzn-container chzn-container-multi" style="width: 220px;">';
			str +='<input class="selectValue" id="'+op.name+'" name="'+op.name+'" type="Hidden" value="">';
			str +='<ul class="chzn-choices">';
			str +='<li class="search-field">';
			str +='<input name="searchinput" type="text" autocomplete="off" value="">';
			str +='</li>';
			str +='</ul>';
			str +='<div class="chzn-drop" style="left: -9000px; width: 220px; top: 29px;">';
			if(op.searchs){
				str +='<div class="chzn-search"><input id="searchInput" type="text" autocomplete="off" style="width: 200px;" tabindex="-1"></div>';
			}
			str +='<ul class="chzn-results" id="chzn_results">';
			if(this._data.nowData){
				$.each(this._data.nowData, function(key, value){
					str += '<li id="'+value[op.fid]+'" flag="'+value[op.fid]+'" class="active-result" style="">'+value.name+'</li>';
				});
			}
			str +='</ul>';
			str +='</div>';
			str +='</div>';
			el.html(str);

		}, setDef : function(ret){
			var el = this.$element,
			    str = '';
			$('.search-choice', el).remove();
			$('.selectValue', el).val('');
			if(ret.name && ret.val){
				var value_arr = ret.val.split(','),
				    name_arr = ret.name.split(',');
				
				$.each(name_arr,function(key,val){
					str += '<li class="search-choice">';
					str += '	<span>'+val+'</span>';
					str += '	<a id="del_'+value_arr[key]+'" class="search-choice-close" href="javascript:void(0)" flag="'+value_arr[key]+'">X</a>';
					str += '</li>';
					//隐藏下拉列表中已选择项
					$('#'+value_arr[key]).hide();
				});

				$('.search-field').before(str);
				$('.selectValue').val(ret.val);
			}

		}
	};
	$.fn.mutidrop = function (option, para, cb) {
		return this.each(function () {
		var $this = $(this),
			data = $this.data('mutidrop'),
			os = (typeof option == 'string');
		if (!data) {
			var options = $.extend({}, $.fn.mutidrop.defaults, typeof option == 'object' && option);
			$this.data('searchmultiselect', (data = new MutiDrop(this, options)));
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
		name : 'searchlts', //下拉选择控件的名称
		fid : 'id', //数据id名称
		width : 240, //组件宽度
		fname : 'name',
		searchs : false
	};

	//选择下拉数据
	$(document).on('click', 'li.active-result', function(){
		$('.search-field').before('<li class="search-choice"><span>'+$(this).html()+'</span><a class="search-choice-close" id="del_'+$(this).attr('id')+'" flag="'+$(this).attr('id')+'" href="javascript:void(0)">X</a></li>');//添加选中内容

		var vl = $('.selectValue').val();
		if(vl){
			var flag = $(this).attr('id');
			var vl_arr = vl.split(',');
				vl_arr.push(flag);
			var vl_str = '';
			$.each(vl_arr, function(k, v){
				if(v){
					if(k>0)
						vl_str += ','+v;
					else
						vl_str = v;
				}
			});
			$('.selectValue').val(vl_str);
		}else{
			$('.selectValue').val($(this).attr('id'));
		}

		$('div.chzn-drop').css({'left': '-9000px', 'width': '220px', 'top': '29px'});

		//隐藏已选数据
		var liList = document.getElementById('chzn_results').getElementsByTagName("li");
		var liLength=liList.length;
		var selectVal = $('.selectValue').val();
		for(var i=0; i<liLength; i++){
			if(selectVal && selectVal.indexOf(liList[i].id)>=0){
				$('#'+liList[i].id).hide();
			}else{
				$('#'+liList[i].id).show();
			}
		}
	}).on('click', 'li a.search-choice-close', function(){//删除已选项
		$(this).parent('li').remove();
		var flag = $(this).attr('flag');
		var vl = $('.selectValue').val();
		var vl_arr = vl.split(',');
		var vl_new_arr = new Array;
		var vl_str = '';
		$.each(vl_arr, function(k, v){
			if(v != flag)
				vl_new_arr.push(v);
		});
		$.each(vl_new_arr, function(k, v){
			if(k>0)
				vl_str += ','+v;
			else
				vl_str = v;
		});
		$('.selectValue').val(vl_str);
		$('#'+$(this).attr('flag')).show();;
		$('div.chzn-drop').css({'left': '-9000px', 'width': '220px', 'top': '29px'});

	}).on('click', 'li.search-field', function(){//点击显示下拉列表
		$('div.chzn-drop').css({'left': '0px', 'width': '220px', 'top': '29px'});
	}).on('click', 'li>span', function(){//点击显示下拉列表
		$('div.chzn-drop').css({'left': '0px', 'width': '220px', 'top': '29px'});
	}).on('mouseleave', function(){//收起下拉列表选项

		$('div.chzn-drop').css({'left': '-9000px', 'width': '220px', 'top': '29px'});

		//隐藏已选数据
		if(document.getElementById('chzn_results')){
			var liList = document.getElementById('chzn_results').getElementsByTagName("li");
			var liLength=liList.length;
			var selectVal = $('.selectValue').val();
			for(var i=0; i<liLength; i++){
				if(selectVal && selectVal.indexOf(liList[i].id)>=0){
					$('#'+liList[i].id).hide();
				}else{
					$('#'+liList[i].id).show();
				}
			}
		}
	}).on('click', '.chzn-search', function(){

		if($('#searchInput').val()){
			var _keyword = $('#searchInput').val();
			var _str = '';
			var para = {};
			para[_cmd.name] = _keyword;
			now.cmd(_cmd.data, para, function(ret){
				$.each(ret.rows,function(key,val){
					_str += '<li id="'+val[_cmd.fid]+'" flag="'+val[_cmd.fid]+'" class="active-result" style="">'+val[_cmd.fname]+'</li>';
					//隐藏下拉列表中已选择项
					//$('#'+val[_cmd.fid]).hide();
				});
				$('.chzn-results').html(_str);
				var vl = $('.selectValue').val();
				var vl_arr = vl.split(',');
				$.each(vl_arr, function(k, v){
					$('#'+v).hide();
				});
			},'',false);
		}
	});
}(jQuery);
