/**
 * 简单的grid
 */
!function ($) {
    var Grid = function(element, options) {
        this.options = options;
        this.$element = $(element).addClass(options['css']);
        this._data = {load:false};
        this._select = null;  //当前点击到的行数据
        this._init();
    };

    Grid.prototype = {
          constructor: Grid , 
          // _init {{{
          _init : function() { 
              // 初始化grid内容
              var el = this.$element
                 ,op = this.options
                 ,fl = op.fields.length
                 ,str='<table class="table table-hover table-striped';

              op.row && (fl+=1);
              op.check && (fl+=1);

              op.border && (str+=' table-bordered');

            // 表格标题
              str+='"><thead>';

              op.title && (str+='<tr><th colspan="'+fl+'">'+op.title+'</th></tr>');

              str+='<tr>';
              if (op.row){
                  str+='<th class="row"></th>';
              }
              if (op.check){
                  str+='<th class="check"><input type="checkbox"></th>';
              }
              $.each(op.fields, function(idx, item){
                  var w=(item.width)?' style="width:'+item.width+'px"':'';
                  str+='<th'+w+'>'+item.head+'</th>';
              });
              str+='</tr></thead><tbody></tbody></table>';
              if (op.size > 0){
                  str+='<div class="pagination pagination-right"></div>';
              }

              // 渲染html
              el.html(str);

              $('th.check :checkbox', el).click(function(){
                  if ($(this).is(':checked')){
                      $('td.check :checkbox', el).attr('checked', 'checked');
                  } else {
                      $('td.check :checkbox', el).removeAttr('checked');
                  }
              });

            // 绑定点击事件
			el.on('click', 'i.fdr-tgl', function(){
			    var $i = $(this),
                  $fid = $(this).attr('id');

                if ( $i.hasClass('icon-plus-sign') ){
                    // 树展开
                    $i.removeClass('icon-plus-sign').addClass('icon-minus-sign');
					el.find('tr[pClass='+$fid+']').show();
                } 
                else if($i.hasClass('icon-minus-sign')) 
                {
                    $i.removeClass('icon-minus-sign').addClass('icon-plus-sign');
                    $('.'+$fid).hide();
					el.find('.'+$fid).find('i.fdr-tgl').removeClass('icon-minus-sign').addClass('icon-plus-sign');
                }
			});

              this.reload();
          }, 
          // }}}
          
          reload : function(ttl) {
              // 刷新显示
        	  var self = this,
                // 对象容器
                el = this.$element,
                op = this.options,
                para = op.para;

              para.start = (op.nowPage -1) * op.size;

        	  if (typeof op.data == 'string' && op.data != '') {
                  para.size = op.size;
                  para.ttl = ttl?ttl:'y';

        	      now.cmd(op.data, para, function(ret){
        	          self._getBody(ret.rows);
					  if(op.tree === false && typeof op.optNoPage == 'undefined'){
						self._getPage(ret.ttl);
					  }
        	      });

        	  } else {
                  self._getBody(op.data.slice(para.start, para.start+op.size));
				  if(op.tree === false){
					self._getPage(op.data.length);
				  }
        	  }
        	  self._data._load = false;

			  el.find('input[type=checkbox]').attr('checked',false);

          }, 

          _event : function(type, fid) {
              // 抛出event
              if (fid == ''){
                  return;
              }
              var self = this,
                data = this._data.nowData;

              for(var i=0; i<data.length; i++){
                  if (fid == data[i][self.options.fid]){
                      if (type == 'select') {
                          self._select = data[i];
                      }
                      var e = $.Event(type);
                      self.$element.trigger(e, data[i]);
                      break;
                  }
              }
          } , 
          
          // getBody {{{
          _getBody : function(rows){
              //得到主体数据

              this._data.nowData = rows;
              var html = ''
                  ,self = this
                  ,el = this.$element
                  ,op = this.options
                  ,nowPage = op.nowPage
                  ,ck = '';

              // getHtml() 获取html {{{
			  var getHtml = function(json,indent,pClass,className){

				var html = '';

				$.each(json, function(idx, item){
                    // 处理json数据
                    console.log(item);
				    var display = '';

					var fid = (op.fid && item[op.fid]) ? item[op.fid]:'';

					if(op.tree && item[op.parentKey] != '' && !op.spread){
                        // 显示表格树
						display = 'display:none';
					}

					 html+='<tr _id="'+fid+'" class="'+className+'" pclass="'+pClass+'" style="'+display+'">';

					 if (op.row) {
                         // 默认有row 行号
						 html+='<td class="row">' + ((nowPage-1) * op.size+idx+1) +'</td>';
					 }

					 if (op.check){
						 ck = (item['_check'])?' checked="checked"':'';
						 html+='<td class="check" style="width:3px"><input type="checkbox"'+ck+'></td>';
					 }

					 $.each(op.fields, function(i, f) {
						var w=(f.width)?' style="width:'+f.width+'px;"':'';
						var suojin = '';
						var biaozhi = '';

						if(f.name == op.treeField){
                            // 如果域的name和树主节点相同
                            // 缩进
							suojin = indent;
							if (item['_child']) {
                                // 有子节点
                                // 图标设置 展示 关闭
								if(op.spread) {
									biaozhi = '<a href="javascript:;"><i class="icon-minus-sign fdr-tgl" id="'+fid+'"></i></a>';
								}else{
									biaozhi = '<a href="javascript:;"><i class="icon-plus-sign fdr-tgl" id="'+fid+'"></i></a>';
								}
							}else{
								biaozhi = '';
							}
						}

						if ( $.isFunction(f.render) ){
							 html+='<td'+w+'>'+suojin + biaozhi + f.render(item[f.name], item, idx)+'</td>';
						} else {
							 html+='<td'+w+'>'+suojin + biaozhi + item[f.name]+'</td>';
						}
					 });

					 html+='</tr>';
                     console.log(html);

					if (item['_child']) {//有子节点
						html+=getHtml(item['_child'],indent+'&nbsp;&nbsp;&nbsp;&nbsp;',fid,className+' '+fid);
					}

              });

			   return html;
			};
            // }}}

			html = getHtml(rows,'','','');

            $('tbody', el).html(html);

            $('tbody tr', el).click(function(){

                  $(this).toggleClass('row_hover');
                  self._event('select', $(this).attr('_id'));
              });

              $('td.check :checkbox', el).click(function(){
                  var fid = $(this).parent().parent().attr('_id');
                  if ($(this).is(':checked')) {
                      if ( $('td.check :checked', el).length ==  $('td.check', el).length){
                          $('th.check :checkbox', el).attr('checked', 'checked');
                      } else {
                          $('th.check :checkbox', el).removeAttr('checked', 'checked');
                      }
                      self._event('check', fid);
                  } else {
                      $('th.check :checkbox', el).removeAttr('checked', 'checked');
                      self._event('uncheck', fid);
                  }
              });

          }, 
          // }}}
          
          // _getPage {{{
          _getPage : function(ttl){ 
              // 底部分页信息
              var self = this
              , el = self.$elemnt
              , op = this.options;
              if (op.size <= 0) {
                  return;
              }
              if (ttl != undefined && parseInt(ttl) > -1){
                  this._data.ttl = ttl;
                  this._data.ttlPage = Math.ceil(ttl/op.size);
              }
              var ttlPage = self._data.ttlPage
                  ,nowPage = op.nowPage
                  ,str='<ul>'
                  ,fcss=(nowPage==1)?'disabled':''
                  ,ecss=(nowPage==ttlPage || ttlPage==0)?'disabled':'';

              str+='<li class="'+fcss+'"><a href="javascript:void(0);">&lt;&lt;</a></li>';
              str+='<li class="'+fcss+'"><a href="javascript:void(0);">&lt;</a></li>';
              var begin = Math.max(1, nowPage - 5);
              if(ttlPage < 11){//不到10页
                  begin = 1;
              } else if (ttlPage - nowPage < 6){//最后5页
                  begin = Math.max(1, ttlPage - 9);
              }
              var end = Math.min(ttlPage, begin + 9);
              for (; begin<=end; begin++){
                  if (begin == nowPage){
                      str+='<li class="active"><a href="javascript:void(0);">'+begin+'</a></li>';
                  } else {
                      str+='<li><a href="javascript:void(0);">'+begin+'</a></li>';
                  }
              }
              str+='<li class="'+ecss+'"><a class="next" href="javascript:void(0);">&gt;</a></li>';
              str+='<li class="'+ecss+'"><a class="first" href="javascript:void(0);">&gt;&gt;</a></li></li>';
              $('.pagination', el).html(str);
              //绑定分页事件
              $('.pagination li', el).click(function(){
                  if (!$(this).hasClass('disabled') && !$(this).hasClass('active')){
                      if (self._data._load){
                          return;
                      }
                      self._data._load = true;
                      var n = $('a', $(this)).text()
                          ,nowPage = op.nowPage
                          ,ttlPage = self._data.ttlPage;
                      if (n == '>>'){
                          nowPage = ttlPage;
                      } else if (n== '<<') {
                          nowPage = 1;
                      } else if (n == '>') {
                          nowPage = Math.min(nowPage+1, ttlPage);
                      } else if (n == '<'){
                          nowPage = Math.max(nowPage-1, 1);
                      } else {
                          nowPage = parseInt(n);
                      }
                      op.nowPage = nowPage;
                      self.reload('n');
                  }
              });
          }, 
          // }}}
          
          getRows : function(){
              return this._data.nowData;
          } ,
          
          // getRow(id) {{{
          getRow : function(id){
              var rows = this._data.nowData, 
                fid = this.options.fid;


              /**
               * @synopsis function 
               * @author 林志宏
               *
               * @param sdata - 所有行数据
               *
               * @return 
               */
              var search = function(sdata) {

            	  var ret = '';

                  for(var i=0;i<sdata.length;i++){

                        // sdata - 行数据
                        // 第i行的fid rows[i]['role_id']
                      if (sdata[i][fid] == id){
                          // 找所指定id的行
                          ret = rows[i];
                          break;
                      } else if (sdata[i]['_child']) {
                    	  ret = search(sdata[i]['_child']);
                    	  if (ret){
                    		  break;
                    	  }
                      }
                  }
                  return ret;
              };

              return search(rows);
          }, 
          // }}}
          
          getSelect : function() {//得到当前点击的行的数据
              return this._select;
          }, 
          
          getCheck : function() {//得到选中的数据
              var self = this
                 ,el = self.$element
                 ,op = self.options
                 ,ret = []
                 ,checked = {}
                 ,data = this._data.nowData
                ,len=data.length;

              $('td.check :checked', el).each(function(idx, item){
                  checked[$(this).parent().parent().attr('_id')+''] = 1;
              });

              for(var i=0; i<len; i++){
                  if (checked[ data[i][op.fid]+'' ]){
                      ret.push(data[i]);
                  }
              }

              return ret;
          }
    };

    $.fn.grid = function (option, para, cb) {
      return this.each(function () {
        var $this = $(this), 
          // 获取绑定到元素的对象
          data = $this.data('grid'), 
          // 是否调用成员函数
          os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.grid.defaults, typeof option == 'object' && option);
            $this.data('grid', (data = new Grid(this, options)));
        } else if (!os) {
            // 设置对象属性
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

    // 类属性，成员变量
    $.fn.grid.defaults = {
      title: '',      //标题
      check : false,  //是否显示选择框
      border : false,

      // 是否显示表格树
      tree : false, //是否是表格树，true是表格树,默认是普通表格
	  parentKey:'pid',//父id的key值，默认是pid
	  treeField:'name', //作为树主节点的字段名

      // 默认不展开
	  spread: false,//是否展开子节点

      size : 15,

        // 当前页
      nowPage : 1,

      fid : 'id',

      row : true,

      fields : [],

      // 要显示在表格中的数据
      // url或json
      data : '',

      css : 'nui_grid',

      para : {}
    };

}(jQuery);

