!function ($) {
    /**
     * 清空资源
     * @author 欧远宁
     */
    $.fn.dispose = function(){
        return this.each(function () {
            $('[_nui_dispose]', $(this)).each(function(){
                var el = $(this),
                    ui = el.attr('_nui_dispose'),
                    cls = el.data(ui);
                (cls && el[cls] && el[cls]('dispose'));
            });
        });
    };
    
    /**
     * 对一个select进行数据填充
     * @author 欧远宁
     * @param object data  需要显示的数据内容，{k=v}的形式
     * @param string def   默认值
     * @param string all   如果有全部选择的话，其文字是什么。为空则没有
     */
    $.fn.sltFill = function(data, def, all){
        def = def || '';
        return this.each(function () {
            var html = ''
                ,ck = '';
            
            if (def == undefined){
                def = '';
            }
            if (all){
                html = '<option value="">'+all+'</option>';
            }
            
            $.each(data, function(key, val){
                ck = (key === def) ? ' selected="selected"' : '';
                html+='<option value="'+key+'"'+ck+'>'+val+'</option>';
            });
            $(this).html(html);
        });
    };

    /**
     * 得到一个模版结果
     * @author 欧远宁
     * @param string tpl   模版url
     * @param object para  后端请求的参数
     * @param function fun 完成后的回调
     */
    $.fn.tpl = function(tpl, para, fun){
        return this.each(function () {
            var _me = $(this);
            if ($.isFunction(para)){
                fun = para;
                para = {};
            }
            var _cb = function(data){
                now.tpl(tpl, data, function(html){
                  _me.html(html);
                  if ($.isFunction(fun)){
                      fun(data);
                  }
                });
            };
            if (para['_c']){
                var cmd = para['_c'];
                delete para['_c'];
                now.cmd(cmd, para, function(ret){
                    _cb(ret);
                });
            } else {
                _cb(para);
            }
        });
    };

    /**
     * 一个简单的弹窗，封装了modal
     * title：标题
     * msg：提示语
     * btn：[
     * 			{text:'确定',okfun:function(){},primary:true},
     * 			{text:'取消'}
     * 		]
     */
    $.dialog = function(title, msg, btn) {
    	$('#_nui_dialog').modal('show');

    	$('h3', $('#_nui_dialog')).html(title);
    	$('.modal-body', $('#_nui_dialog')).html(msg);

    	var footer='';
    	var primary='';
    	btn=typeof btn=='undefined'?[]:btn;
    	$.each(btn,function(i,e){
    		primary='';
    		if(e.primary){
    			primary='btn-primary';
    		}
    		footer+='<button class="btn '+primary+'" name="'+e.text+'">'+e.text+'</button>';
    	});

    	$('.modal-footer', $('#_nui_dialog')).html(footer);

    	$.each(btn,function(i,e){
    		$('.modal-footer', $('#_nui_dialog')).find('button[name='+e.text+']').on('click',function(){
    			if(typeof e.okfun!="undefined"){
    				e.okfun();
    			}
    			$('#_nui_dialog').modal('hide');
    		});
    	});
    };

    /**
     * 简化$.dialog()的确认框
     */
    $.confirm = function(msg, okfun,title,btn) {
    	title= title || '请确定';
    	btn = btn || '确定';
    	$.dialog(title,msg,[{text:btn,primary:true,okfun:okfun}]);
    };

    var _int = -1;

    /**
     * 弹出错误警告信息
     */
    $.alertMsg = function(title, msg){
        var el = $('#_nui_alertmsg');
        $('h4', el).html(title);
        $('span', el).html(msg);
        $('#_nui_mask').show();

        var $b = $(document)
            ,w = el.outerWidth(true)
            ,h = el.outerHeight(true)
            ,bw = $b.outerWidth(true)
            ,bh = $b.outerHeight();

        el.css({
            top : (bh - h)/2 - 30,
            left : (bw - w)/2,
            position : "absolute"
        }).show();

		//自动关闭提示窗口
		setTimeout(function(){
			$('.close').click();
		},1500);
    };

    /**
     * 显示操作成功信息
     */
    $.actMsg = function(title, msg) {
        var el = $('#_nui_actmsg');
        $('h4', el).html(title);
        $('span', el).html(msg);
        el.show();
        _int = window.setTimeout(function(){
            $('#_nui_actmsg').fadeOut(500);
            _int = -1;
        }, 3000);
    };

    var _msg = '<div id="_nui_mask" class="nui_mask hide"></div>';
    $('body').append(_msg);

    var _alert = '<div id="_nui_alertmsg" class="nui_alertmsg alert alert-block hide">'
        +'<button type="button" class="close">&times;</button>'
        +'<h4></h4><span></span></div>';
    $('body').append(_alert);

    var _act = '<div id="_nui_actmsg" class="nui_actmsg alert alert-block alert-success hide">'
        +'<button type="button" class="close">&times;</button>'
        +'<h4></h4><span></span></div>';
    $('body').append(_act);

    var _dialog ='<div class="modal hide fade" id="_nui_dialog">'
				 +'<div class="modal-header">'
				 +'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
		        +'<h3></h3>'
		        +'</div>';
		_dialog+='<div class="modal-body"></div>';
		_dialog+='<div class="modal-footer"></div>'
				+'</div>';
		$('body').append(_dialog);

    $('.close', $('#_nui_alertmsg')).on('click', function(e){
        $('#_nui_alertmsg').fadeOut(500);
        $('#_nui_mask').hide();
    });
    $('.close', $('#_nui_actmsg')).on('click', function(e){
        if (_int > 0){
            window.clearTimeout(_int);
        }
        $('#_nui_actmsg').fadeOut(500);
    });
    $('.close', $('#_nui_dialog')).on('click', function(e){
		$('#_nui_dialog').modal('hide');
		});
}(jQuery);
