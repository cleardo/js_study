/**
 * N行 × N列的重复显示某个render的组件
 *
 * @金宁宝
 */
!function ($) {
    var Repeat = function(element, options) {
        this.options = options;
        this.$element = $(element).addClass(options['css']);
        this._data = {load:false};
        this._init();
    };

    Repeat.prototype = {
        constructor: Repeat, 

        _init : function() { 
            //初始化repeat内容
              var el = this.$element
                 ,op = this.options
                 ,str='<table class="table table-hover table-striped';

              if(op.col <=0){
                  op.col = 3;
              }
              op.size = op.col * op.row;

              op.border && (str+=' table-bordered');
              str+='"><thead>';
              op.title && (str+='<tr><th colspan="'+op.col+'">'+op.title+'</th></tr>');

              str+='</thead><tbody></tbody></table>';
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
          
          reload : function(ttl) { //刷新显示
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
        	      now.cmd(op.data, para, function(ret){
        	          self._getBody(ret.rows);
					  self._getPage(ret.ttl);
        	      });
        	  } else {
                  self._getBody(op.data);
				  self._getPage(op.data.length);
        	  }
        	  self._data._load = false;
          } , 
          
          _getBody : function(ret){
              //得到主体数据
              this._data.nowData = ret;

              var html = ''
                  ,el = this.$element
                  ,op = this.options
                  ,_rowData = ''
                  ,_rowNum = '';

			  // 计算行数
			  _rowNum = Math.ceil(this._data.nowData.length/op.col);

			  for(var i=0;i<_rowNum;i++){
				  html+='<tr>';
				  _rowData = this._data.nowData.splice(0,op.col);
				  $.each(_rowData, function(idx, item){
					 html+='<td>'+op.render(item)+'</td>';
				  });
				  html+='</tr>';
				  _rowData = '';
			  }

              $('tbody', el).html(html);
          }, _getPage : function(ttl){ //底部分页信息
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
      render : '', //生成每个数据块函数
      data : '',
      para : {},
      col : 3, //每行2个
      row : 2, //每页2行，如果为0表示显示所有
      showpage : true
    };
}(jQuery);
