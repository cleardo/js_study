/**
 * 简单的tree 属性：
 * data : 数据来源,[{id:'aa',pid:'aa',txt:'',other:''},{...}]
 * check : 是否显示check
 * 方法：
 * check(id/ids) check一些节点
 * checkAll() check所有节点
 * collapse(id/ids) 关闭某些节点
 * collapseAll() 关闭所有节点
 * expand(id/ids) 打开某些节点
 * expandAll() 打开所有节点
 * select(id) 选中某个节点
 * getSelect() 得到选中的节点
 * getCheck() 得到check的节点列表
 * insert(id, node) 在某个节点后面新增一个节点
 *
 * 事件：
 * select() 被选择
 * check() 被选中
 */
!function ($) {
    var Tree = function(element, options) {
        this.options = options;
        this.$element = $(element).addClass('nui_tree').html('<ul class="nav nav-list parent"><ul>');
        this._data = {};
        this._select = null;
        this._init();
    };

    Tree.prototype = {
       constructor: Tree
       , _init : function(){
           this.reload();
       }, reload : function(){
           var self = this
              , el = this.$element
              , op = this.options
              , para = op.para;

           if (typeof op.data == 'string' && op.data != '') {
               now.cmd(op.data, para, function(ret){
                   self._buildTree(ret.tree);
               });
           } else {
               self._buildTree(op.data);
           }

			el.on('click',':checkbox', function(e){
			   if ( $(this).is(":checked") ) {//从选中修改为未选中
				   self._event('check', $(this).attr('_id'));
				   //$(':checkbox', $(this)).attr('checked', 'checked');
				   $(this).parent().find('input[type=checkbox]').attr('checked', true);
			   } else {//从未选中修改为选中
				   self._event('uncheck', $(this).attr('_id'));
				   //$(':checkbox', $(this)).removeAttr('checked');
				   $(this).parent().find('input[type=checkbox]').attr('checked', false);
			   }
			});

			el.on('click', 'i.fdr-tgl', function(){
			    var $i = $(this)
	               , $parent = $i.parent(),$nf=$parent.find( 'a' ).eq(0).find('i').eq(0);

                if ( $i.hasClass('icon-plus-sign') ){
                    $i.removeClass('icon-plus-sign').addClass('icon-minus-sign');
                    $nf.removeClass('icon-folder-close').addClass('icon-folder-open');
                    $('>ul', $parent).show();
                } else if($i.hasClass('icon-minus-sign')) {
                    $i.removeClass('icon-minus-sign').addClass('icon-plus-sign');
                    $nf.removeClass('icon-folder-open').addClass('icon-folder-close');
                    $('>ul', $parent).hide();
                }
			});

			el.on('click', 'a', function(e){
			   var $this = $(this)
			   , $parent = $this.parent();

			   //todo 以后修改为点击前面的icon做打开关闭
				if ( !$parent.hasClass('active') ) {
					$('li.active', el).removeClass('active');
					$parent.addClass('active');
				}

				self._event('select', $(this).attr('_id'));
			});
       }, _buildTree : function(data) {
           this._data = data;
           var str = ''
               ,el = this.$element
               ,op = this.options;
           var getStr = function(json, deep) {
               var str = '';
               $.each(json, function(idx, node){
                   var _fid = node[op.fid]
                       ,_pid = node[op.pid];
                   str+='<li>';
                   if (op.check) {
                       str+='<input type="checkbox" _id="'+_fid+'" _pid="'+_pid+'" _deep="'+deep+'"';
                       if (node['_checked']) {
                           str+=' checked="checked"';
                       }
                       str+='/>';
                   }
				   var _cls = node['_close'] ? 'close' : 'open';
				   var _cls1 = node['_close'] ? 'plus' : 'minus';
				   var _tmp = '<a href="javascript:void(0);" _id="'+_fid+'" _pid="'+_pid+'" _deep="'+deep+'">';
				   if (node['_child']) {//有子节点
						str+='<i class="icon-'+_cls1+' fdr-tgl"></i>'+_tmp+'<i class="icon-folder-'+_cls+'"/>';
				   }else{
						str+=_tmp+'<i class="icon-file"/>';
				   }
                   if (node['_child']) {//有子节点
                       str+= node[op.txt];
                       str+='</a><ul class="folder nav nav-list';
                       if (_cls == 'close'){
                           str+=' hide';
                       }
                       str+='">';
                       str+=getStr(node['_child'], deep+1);
                       str+='</ul></li>';
                   } else {
                       str+= node[op.txt]+'</a></li>';
                   }
               });
               return str;
           };
           str = getStr(data, 1);
           $('ul.parent', el).html(str);

       }, _event : function(type, fid) {
           if (fid == ''){
               return;
           }
           var self = this
			   ,data = this._data
			   ,_fid=self.options.fid;

		   var search = function(json){
			   var ret = '';
			   $.each(json, function(idx, node){
				   if (ret) return;
				   if (node[_fid] == fid) {
					   ret = node;
				   } else if (node['_child'] != undefined) {
					   ret = search(node['_child']);
				   }
			   });
			   return ret;
		   };
		   var selected = search(data);
		   if (selected) {
			   if (type == 'select') {
				   self._select = selected;
			   }
			   var e = $.Event(type);
			   self.$element.trigger(e, selected);
		   }
       }, check: function(id) {
           $('input[_id="'+id+'"]', this.$element).attr('checked', 'checked');
       }, checkAll : function(){
           $(':checkbox', this.$element).attr('checked', 'checked');
       }, collapse: function(id) {
           if (typeof id == 'string') {
               $('ul[_id="'+id+'"]', this.$element).hide();
           } else {
               var el = this.$element;
               $.each(id, function(idx, _id){
                   $('ul[_id="'+_id+'"]', el).hide();
               });
           }
       }, collapseAll : function() {
           $('ul.folder', this.$element).hide();
       }, extend: function(id) {
           if (typeof id == 'string') {
               $('ul[_id="'+id+'"]', this.$element).show();
           } else {
               var el = this.$element;
               $.each(id, function(idx, _id){
                   $('ul[_id="'+_id+'"]', el).show();
               });
           }
       }, extendAll : function() {
           $('ul.folder', this.$element).show();
       }, select: function(id) {
           setTimeout(
			   function(){
				$('a[_id="'+id+'"]', this.$element).click();
			   },
			1000);
       }, getSelect : function(para) {
           return this._select;
       }, getCheck : function() {
           var self = this
              ,el = self.$element
              ,op = self.options
              ,ret = []
              ,checked = {}
              ,data = this._data.nowData
             ,len=data.length;

           $(':checked', el).each(function(idx, item){
               checked[$(this).attr('_id')+''] = 1;
           });

           for(var i=0; i<len; i++){
               if (checked[ data[i][op.fid]+'' ]){
                   ret.push(data[i]);
               }
           }
           return ret;
       }
    };

    $.fn.tree = function (option, para, cb) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('tree')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.tree.defaults, typeof option == 'object' && option);
            $this.data('tree', (data = new Tree(this, options)));
        } else if (!os) {
            data.options = $.extend({}, data.options, typeof option == 'object' && option);
            data._init();
        }
        if (os) {
            if ( $.isFunction(para) ) {
                para(data[option]({}));
            } else if($.isFunction(cb)) {
                cb(data[option](para));
            } else {
                return data[option](para);
            }
        }
	  });
    };

    $.fn.tree.defaults = {
      check: false,  //是否显示checkbox
      fid : 'id',    //用来唯一标记一行数据的字段
      pid : 'pid',   //用来标记父节点的id
      txt : 'name', //作为显示文字的字段
      data : {},     //取tree的数据，如果是string，则通过后台请求获取，后台必须返回一个tree的key值。
      para : {}      //发送ajax请求时候的额外参数
    };
}(jQuery);
