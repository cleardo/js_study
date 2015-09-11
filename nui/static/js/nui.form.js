/**
 * 表单处理
 */
!function ($) {
    var Frm = function(element, options) {
        this.options = options;
        this.$element = $(element);

        var self = this;

        $(options['submit']).on('click', function(){
            console.log('submit');
        	self.post();
        });
    };

    Frm.prototype = {
        constructor: Frm, 

        val : function(para) {
    		para = $.extend({}, this.options.para, para);

    		var ok = true, 
              el = this.$element;

    		el.find(':input').each(function() {
                // 查找每个输入元素
    		    var _el = $(this), 
                  ck = _el.attr('check');

    			if(_el.data('editor')){
    			    _el.editor('sync');
    			}

    			var val = $.trim(_el.val());

    			if (ck) {
                    // 是否进行检查
    				var arr = ck.split(' '),
                      ret = now.val(arr, val),
                      _ep = _el.parent();

                    if ($('span.help-inline', _ep).length == 0) {
                        _ep.append('<span class="help-inline"></span>');
                    }

                    var $msg = $('span.help-inline', _ep);

    				if (ret == '') {
    					$('.control-group', el).removeClass('error').addClass('success');
    				    $msg.html('<i class="icon-ok"></i>').show();
    				} else {
    					$('.control-group', el).removeClass('success').addClass('error');
    					var title = _el.attr('title');
					    title = title || ret;
					    $msg.html(ret).show();
    					ok = false;
    				}
    			}
    		});

    		if (ok) {
    			var formParam = el.find(':input').serializeArray();
    			var _p = {};
    			$.each(formParam, function(){
    			    _p[this.name] = _p[this.name]==undefined?$.trim(this.value)
    						:_p[this.name]+',' + $.trim(this.value);
    			});
    			$.each(_p, function(k,v){
    			    para[k] = v;
    			});
    		}
            // 返回数组 
    		return [ok, para];

    	}, 
        
        // 进行数据填充 {{{
        fill : function(para) { 
            console.log('fill');
    		var el = this.$element
    			, data = para.data
    			, tbl = para.tbl;

			el.find('[name]').each(function() {
                console.log(this);
				var key,val;
				
				if(typeof tbl == 'string'){
					key = $(this).attr('name').replace(tbl+'[', '').replace(']','');
					val = data[key];
				}else{
					var key = $(this).attr('name');
					$.each(tbl,function(k,v){
						key = key.replace(v+'[', '').replace(']','');
					});
					val = data[key];
				}
					
        		if(val == undefined){
        			return;
        		}

				if (this.nodeName == 'INPUT'
				    || this.nodeName == 'SELECT'
				    ||  this.nodeName == 'TEXTAREA') {
		            switch(this.type) {
		            	case 'hidden':
		                case 'password':
		                case 'text':
		                case 'textarea':
		                case 'select-one':
                            // 单选框
	                    	$(this).val(val);
		                    break;
		                case 'select-multiple':
		                	//不处理
		                	break;

		                case 'checkbox'://必须以 , 隔开的数据
                			if($.inArray($(this).val(), val.split(',')) >= 0){
                				$(this).attr('checked',true);
                			}
		                	break;

		                case 'radio':
                			if($(this).val() == val){
                				$(this).attr('checked',true);
                			}
		                    break;
		            }
				}else if(this.nodeName == 'IMG'){
        			$(this).attr('src',val);
        		}else {
					$(this).html(val);
				}
	        });
        }, 
        // }}}
        
        // 清空表单数据 {{{
        clear : function() { 
            // 进行清理
        	var el = this.$element;
        	$('.control-group', el).removeClass('error').removeClass('success');
        	$('span.help-inline', el).hide();
        	el.find(':input').each(function() {
                switch(this.type) {
            		case 'hidden':
                    case 'password':
                    case 'text':
                        $(this).val('');
                        break;
                    case 'textarea':
                        $(this).text('');
                        if( $(this).data('editor') ){
                            $(this).editor('html', '');
                        };
                        break;
                    case 'select-one':
                    	break;
                    case 'checkbox':
                    case 'select-multiple':
                    case 'radio':
                    	//全部设置为false
                        this.checked = false;
                }
            });
        }, 
        // }}}
        
        // 清空数据验证的信息，对勾等 {{{
        clearCheck : function() {
            // 清理检查信息，不清理表单 
            var el = this.$element;

            $('.control-group', el)
                .removeClass('error')
                .removeClass('success');

            // 隐藏帮助信息
            $('span.help-inline', el)
                .hide();
        }, 
        // }}}
        
        post: function(para) {
        	var $this = this
        	    ,op = this.options
        	    ,ret = $this.val(para)
        	    ,el = $this.$element;

		    	if (ret[0]) {
                    // 触发自定义事件
		    		el.trigger($.Event('valOk'),ret[1]);

		    		if (op.cmd) {
                        // 如果有传命令
			    		ret[1]['_c'] = op.cmd;

			    		now.cmd(op.cmd, ret[1], function(ret){
                            //触发cmdReturn事件
			     	    	var e = $.Event('cmdReturn');

			     	    	el.trigger(e, ret);

			     	    	if (ret['_c'] != undefined){
			     	    	    if (op.alertErr) {
			     	    	        $.alertMsg('出错提示', ret['_m']);
			     	    	    }
			     	    		el.trigger($.Event('cmdError'), ret);
			     	    	} else {
			     	    		el.trigger($.Event('cmdOk'), ret);
			     	    	}
			    		});
		    		}
		    	}
        }, 
        
        // 按钮判断
        enabled : function(para) {
            
            var $btn = $(this.options['submit']);

            if (para) {
                $btn.removeAttr('disabled');
            } else {
                $btn.attr('disabled', 'disabled');
            }
        }
    };

    // 插件定义 {{{
    $.fn.frm = function (option, para, cb) {
        return this.each(function () {
            var $this = $(this), 
              data = $this.data('frm'), 
              os = (typeof option == 'string');

            if (!data) {
                // 初始化Form对象
                // 表单的属性 form action method para
                // 表单的方法 check enable submit 
                var options = $.extend(
                    {}, 
                    $.fn.frm.defaults, 
                    typeof option == 'object' && option
                );

                $this.data('frm', (data = new Frm(this, options)));

            } else if (!os) {
                // 不是字符串，用于设置对象属性
                data.options =  $.extend(
                    {}, 
                    data.options, 
                    typeof option == 'object' && option
                );
            }

            if (os) {
                data[option](para);
            }
        });
    };

    $.fn.frm.defaults = {
      	cmd: '',  		//发送的请求
      	submit : '', 	//点击的按钮
      	para : {}, 		//附加参数
        alertErr : true //是否自动弹出错误提示？
    };
    // }}}

    // 如果绑定了data-api属性，则触发函数
    // $target.attr('data-api', 'frm')
    // 命名空间.frm.data-api
    // .off('.frm.data-api')
    $(document).on('click.frm.data-api', '[data-api="frm"]', function (e) {
        console.log('data-api click');
        var el = $(this),
          $target = $(el.attr('data-target'));

        if (!el.data('frm')) {
            var opt = {};

            if (el.attr('data-cmd')) {
                opt = {cmd : el.attr('data-cmd')};
            }

            $target.frm(opt);
        }

        // 目标表单触发提交到服务端，按钮与表单可在不同一个地方
        $target.frm('post');
    });
}(jQuery);
