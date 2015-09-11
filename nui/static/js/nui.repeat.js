/**
 * N行 × N列的重复显示某个render的组件
 *
 * @金宁宝
 */
//时间序列：要先获取数据，然后获取模板，替换模板变量, 然后才能渲染模板
!function ($) {
    var Repeat = function(element, options) {
        this.options = options;
        this.$element = $(element).addClass(options['css']);
        this._data = {load:false};
        this._init();
    };

    Repeat.prototype = {
            constructor: Repeat
          , _init : function() { //初始化repeat内容
              var el = this.$element
                 ,op = this.options
                 ,str='';

              if(op.col <=0){
                  op.col = 3;
              }
              op.itemSpan = parseInt(12/op.col);
              op.size = op.col * op.row;

              str += '<div class="nui-repeat">';
              str += '<div class="nui-repeat-title">';
              op.title && (str += '<h3>'+op.title+'</h3>');
              str += '</div>';
              str += '<div class="nui-repeat-list"></div>';
              str += '</div>';
              if (op.showpage){
                  str+='<div class="pagination pagination-right page_ml"></div>';
              }
              el.html(str);

            if (op.showpage) {
            	this.reload();
            }else {
            	this.reload('n');
            }
          }, 
          reload : function(ttl) { 
              //{{{ $el.repeat('reload');
              //刷新显示
        	  var self = this
        	     ,op = this.options
        	     ,para = op.para;

              para.start = (op.nowPage -1) * op.size;
        	  if (typeof op.data == 'string' && op.data != '') {
                  para.ttl = ttl?ttl:'y';
				  if(op.size === ''){
					para.all = 'y';
				  }else{
					para.size = op.size;
				  }
                  // 执行命令
        	      now.cmd(op.data, para, function(ret){
        	          self._getBody(ret.rows);
					  self._getPage(ret.ttl);
        	      });
        	  } else {
                  self._getBody(op.data);
				  self._getPage(op.data.length);
        	  }
        	  self._data._load = false;
              //}}}
          } , 
          _getBody : function(ret){
              //得到主体数据 
        	  this._data.nowData = ret;

              var html = ''
                  ,el = this.$element
                  ,op = this.options
        	  	  ,liHtml = '<div class="span'+op.itemSpan+'"'
                  ,_rowData = ''
                  ,_rowNum = '';

              if (op.itemHeight) {
            	  liHtml+=' style="height:'+op.itemHeight+'px;"';
              }
              liHtml+='>';
              
        	  if (ret.length==0 && op.norender!='') {
        		  // 只显示一列
        		  html+='<div class="row-fluid">';
        		  html+= op.norender;
        		  html+='</div>';
        	  }else {
				  //计算行数
				  _rowNum = Math.ceil(ret.length/op.col);
				  html+='<div class="repeat-content">';

				  for(var i=0;i<_rowNum;i++){
					  html+='<div class="row-fluid">';

					  _rowData = ret.slice(op.col*i,op.col*(i+1));

					  $.each(_rowData, function(idx, item){

						if($.isFunction(op.render)){

							html+=liHtml+op.render(item)+'</div>';

						}else{
							now.tpl(op.render, item, function(ret){

								html+=liHtml+ret+'</div>';

							},false);
						}
					  });
					  html+='</div>';

					  _rowData = '';
				  }
				  html+='</div>';
        	  }

             //渲染模板上去
              $('.nui-repeat-list', el).html(html);

          }, 
          _getPage : function(ttl){ //底部分页信息
          //{{{ 分页
              var self = this
              , el = self.$elemnt
              , op = this.options;
              if (!op.showpage) {
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
              $('.page_ml', el).html(str);
              //绑定分页事件
              $('.page_ml li', el).click(function(){
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
          //}}}
          },
          getRow : function(id){
              var rows = this._data.nowData
                  , fid = this.options.fid;

              var search = function(sdata) {
            	  var ret = '';
                  for(var i=0;i<sdata.length;i++){
                      if (sdata[i][fid] == id){
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
          }
    };

    $.fn.repeat = function (option, para, cb) {

      return this.each(function () {
        var $this = $(this)
          , data = $this.data('repeat')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.repeat.defaults, typeof option == 'object' && option);
            $this.data('repeat', (data = new Repeat(this, options)));
        } else if (!os) {
            //选项
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

    $.fn.repeat.defaults = {
      title: '',    //标题
      nowPage : 1,
      render : '',  //生成每个数据块函数
      data : '',
      para : {},    //请求参数
      col : 3,      //每行2个
      row : 2,      //每页2行，如果为0表示显示所有
      showpage : true,  // 是否显示页码
      fid:'',
      norender: '',     // 没有数据时展示
      itemHeight : 0,   // 高度
      css:'repeat_ui'
    };
}(jQuery);
