/**
 * 简单的UI组件，参考的bootstrap
 */
define(function(require){
    var now = require('now');

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
            if (para['_c'] && para['_c'] !== ''){
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
        // XXX:
		setTimeout(function(){
			//$('.close').click();
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

/**
 * 简单的聊天实现，支持1对1和群聊
 */
!function ($) {
    var nowChat = null;

    $._chatReady = function(){
        nowChat._initOk();
    };
    $._chatLoginOk = function(){
        nowChat._loginOk();
    };
    $._chatClose = function(){
        nowChat._chatClose();
    };
    $._chatErr = function(code, msg) {
        nowChat._chatErr(code, msg);
    };
    $._chatData = function(data) {
        nowChat._chatData(data);
    };

    var Chat = function(element, options) {
        if (nowChat) {
            alert('同时只能存在一个聊天实例');
        }
        this.options = options;
        this.$element = $(element);
        this.swf = null;
        nowChat = this;
        this._init();
    };
    Chat.prototype = {
        constructor: Chat
       , _init : function() {
           var el=this.$element;
           el.flash({
               width : 0,
               height : 0,
               src :'static/swf/chat.swf'
           });
       } ,_initOk : function() {
           var self = this
               , el = this.$element
               , op = this.options;

           el.flash('getSwf', function(swf){
               self.swf = swf;
               swf.initChat(op.host, op.port, op.uid, op.name, op.rand, op.code, op.group);
           });

       } , _loginOk : function(){
           var e = $.Event('chatLoginOk');
           this.$element.trigger(e);
       }, _chatErr: function(code, msg){
           var e = $.Event('chatErr');
           this.$element.trigger(e, code, msg);
       }, _chatClose : function() {
           var e = $.Event('chatClose');
           this.$element.trigger(e);
       }, _chatData : function(data){
           var e = $.Event('chatData');
           this.$element.trigger(e, data);
       }, sendMsg : function(para) {
           this.swf.sendMsg(para.to, para.msg);
       } ,dispose : function(){
           this.$element.html('');
           nowchat = null;
       }
    };
    $.fn.chat = function (option, para,cb) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('chat')
            , os = (typeof option == 'string');

          if (!data) {
              var options = $.extend({}, $.fn.chat.defaults, typeof option == 'object' && option);
              $this.data('chat', (data = new Chat(this, options)));
          } else if (!os) {
              data.options =  $.extend({}, data.options, typeof option == 'object' && option);
          }

          if (os) {
              data[option](para);
          }
        });
      };

      $.fn.chat.defaults = {
          host : '127.0.0.1',
          port : 2008,
          uid : '',
          name : '',
          group : '',
          rand : '',
          code : ''
      };

}(jQuery);

/**
 * 表单处理
 */
!function ($) {
    var Frm = function(element, options) {
        this.options = options;
        this.$element = $(element);
        var self = this;
        $(options['submit']).on('click', function(){
        	self.post();
        });
    };

    Frm.prototype = {
        constructor: Frm
        , val : function(para){
    		para = $.extend({}, this.options.para, para);

    		var ok = true
    		  , el = this.$element;

    		el.find(':input').each(function(){
    		    var _el = $(this)
    			    , ck = _el.attr('check');

    			if(_el.data('editor')){
    			    _el.editor('sync');
    			}

    			var val = $.trim(_el.val());

    			if (ck){
    				var arr = ck.split(' ')
    				   ,ret = now.val(arr, val)
    				   ,_ep = _el.parent();

                    if ($('span.help-inline', _ep).length == 0) {
                        _ep.append('<span class="help-inline"></span>');
                    }
                    var $msg = $('span.help-inline', _ep);
    				if (ret == '') {
    					_ep.parent().removeClass('error').addClass('success');
    				    $msg.html('<i class="icon-ok"></i>').show();
    				} else {
    					_ep.parent().removeClass('success').addClass('error');
    					var title = _el.attr('title');
					    title = title || ret;
					    $msg.html(ret).show();
    					ok = false;
    				}
    			}
    		});

    		if (ok){
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
    		return [ok, para];

    	}, fill : function(para) { //进行数据填充
    		var el = this.$element
    			, data = para.data
    			, tbl = para.tbl;
			el.find('[name]').each(function() {
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
        }, clear : function() { //进行清理
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
        }, clearCheck : function() {//清理检查信息，不清理表单 
            var el = this.$element;
            $('.control-group', el).removeClass('error').removeClass('success');
            $('span.help-inline', el).hide();
        }, post : function(para) {
        	var $this = this
        	    ,op = this.options
        	    ,ret = $this.val(para)
        	    ,el = $this.$element;

		    	if (ret[0]) {
		    		el.trigger($.Event('valOk'),ret[1]);

		    		if (op.cmd) {
			    		ret[1]['_c'] = op.cmd;
			    		now.cmd(op.cmd, ret[1], function(ret){
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
        }, enabled : function(para) {
            var $btn = $(this.options['submit']);
            if (para) {
                $btn.removeAttr('disabled');
            } else {
                $btn.attr('disabled', 'disabled');
            }
        }
    };

    $.fn.frm = function (option, para,cb) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('frm')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.frm.defaults, typeof option == 'object' && option);
            $this.data('frm', (data = new Frm(this, options)));
        } else if (!os) {
        	data.options =  $.extend({}, data.options, typeof option == 'object' && option);
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

    $(document).on('click.frm.data-api', '[data-api="frm"]', function (e) {
        var el = $(this)
            ,$target = $(el.attr('data-target'));
        if ( !el.data('frm') ){
            var opt = {};
            if (el.attr('data-cmd')) {
                opt = {cmd : el.attr('data-cmd')};
            }
            $target.frm(opt);
        }
        $target.frm('post');
      });
}(jQuery);

/**
 * 快速表单创建
 * $('#dom').quickfrm({
 *    fields : [
 *      {name:'user[account]', mdl:'base', text:'帐号', check:'must str-6-20', type:'text', edit:true, title:'', id:'' val="aaa"}
 *    ],
 *    submit : '提交',
 *    cmd : 'aa',
 *    para : {},
 *    title : '',
 *    direct : 'horizontal',
 *    class : 'well'
 * });
 */
!function ($) {
    var QuickFrm = function(element, options) {
        this.options = options;
        this.$element = $(element);
    };

    var _fieldId = 0;

    //每个字段的默认值
    var _defField = {
       title : '',    //标题
       type : 'text', //类型 text checkbox select textarea
       id : '',       //id
       val :'',       //值
       must : false,  //是否必填
       edit : true,   //是否可编辑
       check : '',    //额外的检查项
       attr : '',      //特殊属性  {'data-api':'datepick',placeholder:"最大操作时间"}
       rows : '3',     //只在textarea有效
       cols : '30',     //只在textarea有效
       css : 'input-medium'
    };

    QuickFrm.prototype = {
              constructor: QuickFrm
            , _init : function() {
                var self = this
                    ,el = self.$element
                    ,op = self.options
                    ,fLen = op.fields.length
                    ,_check = '';

                var add_html=['','',''];
            	var cls='';
                if(op.direct=='v'){
                	add_html[0]='<div class="control-group">';
                	add_html[1]='<div class="controls">';
                	add_html[2]='</div></div>';
                	cls+='form-horizontal ';
                }
                if(op.direct=='h'){
                	cls+='form-inline ';
                }

                var html = '<div class="'+cls+op.frmClass+'">';

                var _getCheck= function(_fld){
                    var _ret = _fld.must?'must '+_fld.check:_fld.check;
                    if (_fld.check){
                        return ' check="'+_ret+'"';
                    }
                    ret = +_ret;
                    if(_fld.mdl){
                        var arr = _fld.name.split('[')
                            ,mdl = now.cfg.check[_fld.mdl]
                            , fldName = arr[1].substr(0,arr[1].length-1);
                        if (mdl && mdl[arr[0]] && mdl[arr[0]][fldName]){
                            if (_ret != '') _ret+=' ';
                            _ret+=mdl[arr[0]][fldName];
                        }
                    }
                    return ' check="'+_ret+'"';
                };

                if(op.title && !op.dialog){
                    html+='<h4>'+op.title+'</h4>';
                }

                for(var i=0;i<fLen;i++){
                    var _fld = $.extend({}, _defField, op.fields[i])
                        ,_id = (_fld.id=='')?'__fld'+(_fieldId++) : _fld.id;
                    _fld['id'] = _id;
                    op.fields[i] = _fld;

                    var attr='';
                    $.each(_fld.attr,function(i,e){
                    	attr+=i+'="'+e+'" ';
                    });

					if(op.check){
						_check = _getCheck(_fld);
					}

                    html+=add_html[0]+'<label class="control-label" for="'+_id+'">'+_fld.text+'</label>';
                    html+=add_html[1];
                    if (!_fld.edit){
                        html+='<label style="padding-top:5px;" name="'+_fld.name+'"'+_check+' id="'+_id+'" '+attr+'>'+_fld.val+'</label>';
                    } else {
                        if (_fld.type == 'select') {
                            html+='<select name="'+_fld.name+'" class="'+_fld.css+'" id="'+_id+'" '+attr+'>';
                            if (_fld.selectData) {
                                if (_fld.selectAll){
                                    html+= '<option value="">'+_fld.selectAll+'</option>';
                                }
								if (typeof _fld.selectData == 'string') {
									var sltPara = {};
									if(_fld.selectPara){
										sltPara = _fld.selectPara;
									}
									now.cmd(_fld.selectData, sltPara, function(ret){
										$.each(ret.rows, function(key, val){
											var slt = _fld.val===key?' selected="selected"':'';
											html+='<option value="'+key+'"'+slt+'>'+val+'</option>';
										});
									},'',false);
								}else{
									$.each(_fld.selectData, function(key, val){
										var slt = _fld.val===key?' selected="selected"':'';
										html+='<option value="'+key+'"'+slt+'>'+val+'</option>';
									});
								}
                            }
                            html+='</select>';
                        }else if(_fld.type =='textarea') {
                            html+='<textarea name="'+_fld.name+'"'+_check+' class="'+_fld.css+'" id="'+_id+'" rows="'+_fld.rows+'" cols="'+_fld.cols+'" '+attr+'>'+_fld.val+'</textarea>';
                        } else if(_fld.type == 'div') {
                            html+='<div class="'+_fld.css+'" id="'+_id+'" '+attr+'></div>';
                        } else if(_fld.type == 'button') {
                            html+='<button class="btn" id="'+_fld.id+'" '+attr+'>'+_fld.val+'</button>';
                        } else if (_fld.type == 'div') {
                            html+='<div id="'+_fld.id+'" '+attr+'>'+_fld.val+'</div>';
                        } else {
                            html+='<input name="'+_fld.name+'" type="'+_fld.type+'" value="'+_fld.val+'"'+_check+' class="'+_fld.css+'" id="'+_id+'" '+attr+'/>';
                        }
                    }
                    html+=add_html[2];
                }
                var smtId = '__submit'+(_fieldId++);

                if (op.dialog) {
                    var tmp ='';
                    if (op.title) {
                        tmp+='<div class="modal-header">'
                            +'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                            +'<h3>'+op.title+'</h3>'
                            +'</div>';
                    }
                    tmp+='<div class="modal-body">'+html+'</div></div>';
					if(op.submit){
						tmp+='<div class="modal-footer">'
							+'<button class="btn btn-primary" id="'+smtId+'">'+op.submit+'</button>'
							+'</div>';
					}

                    el.addClass('modal hide fade').attr({
                        tabindex : '-1',
                        role : 'dialog',
                        'aria-hidden':'true'
                    }).html(tmp).modal({
                        backdrop : 'static',
                        show : false
                    });
                    $('body').append(el);
                } else {
					if(op.submit){
						html+=add_html[0]
								+ add_html[1]
								+ '<button class="btn btn-primary" id="'+smtId+'">'+op.submit+'</button>'
								+ add_html[2];
					}
                    el.html(html);
                }

                for(var i=0;i<fLen;i++){
                    var _fld = op.fields[i];
                    if (_fld['nui']){
                        $.each(_fld.nui, function(k, v){
                           $('#'+_fld.id)[k](v);
                        });
                    }
                }

                el.frm({
                   cmd : op.cmd,
                   para : op.para,
                   submit : '#'+smtId
                });
            }
    };

    $.fn.quickfrm = function (option) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('quickfrm')
          , options = $.extend({}, $.fn.quickfrm.defaults, typeof option == 'object' && option);

        if (!data) {
            $this.data('quickfrm', (data = new QuickFrm(this, options)));
            data._init();
        }

      });
    };

    $.fn.quickfrm.defaults = {
       fields : [],  //{name:'user[account]', mdl:'base', text:'帐号', check:'must str-6-20', type:'text', edit:true, title:'', id:''}
       cmd : '',
       submit : '提交', //空则不显示submit按钮
       dialog : false, //是否弹出框
       mask : '',      //是否遮住某个div
       para : {},      //额外参数，默认为空
       title : '',     //标题，默认为空
       direct : 'v',  //'v' 纵向  ,'h'横向
       frmClass : 'well',         //表单div的class
       check : true         //是否需要表单验证，默认要验证(一般作为搜索表单时，direct=h时，需要设置check为false，避免死循环)
    };

}(jQuery);

/**
 * 城市联动选择
 */
!function ($) {
    var SltTown = function(element, options) {
    	options.text = '';
        this.options = options;
        this.$element = $(element);
    };

    var townId = 0;
    var townArr = null;
    
    SltTown.prototype = {
          constructor: SltTown
        , _init : function() {
        	/* 初始化 */
        	var tid = 'town' + (townId++),
        	    el = this.$element,
        	    op = this.options,
        	    html = '';
        	
        	if (!townArr) {
                $.ajax({
                    url : '/static/js/data/town.min.js',
                    type : 'GET',
                    async : false,
                    dataType : 'json',
    				success : function(ret) {
    					townArr = ret;
    				}
                  });
        	}
        	
        	html+= '<select id="'+tid+'_A" style="width:150px">';
    		//省
    		$.each(townArr, function(key, val){
    			html+= '<option value="'+key+'">'+val.name+'</option>';
    		});
			html+= '</select>';
			html+= '<select id="'+tid+'_B" style="width:110px"></select>';
			html+= '<select id="'+tid+'_C" name="'+op.field+'" style="width:110px"></select>';
			el.html(html);

			$('#'+tid+'_A').change(function(){
				html = '';
				$.each(townArr[$(this).val()]['child'], function(key,val){
					html+='<option value="'+key+'">'+val.name+'</option>';
				});
				$('#'+tid+'_B').html(html).change();
			});

			$('#'+tid+'_B').change(function(){
				var val = $(this).val();
				html = '';
				$.each(townArr[val.substr(0,2)+'0000']['child'][val.substr(0,4)+'00']['child'], function(key,val){
					html+='<option value="'+val.code+'">'+val.name+'</option>';
				});
				$('#'+tid+'_C').html(html).change();
			});

			$('#'+tid+'_C').change(function(){
				op.data = $(this).val();
                op.text = $('#'+tid+'_A').find("option:selected").text() 
                			+ $('#'+tid+'_B').find("option:selected").text() 
                			+ $(this).find("option:selected").text();
                var e = $.Event('townChange');
                el.trigger(e, {data:op.data, text:op.text});
			});

    		//默认选中哪项
    		if(op.data){
    			$('#'+tid+'_A').val(op.data.substr(0,2)+'0000');
    			$('#'+tid+'_A').change();
    			$('#'+tid+'_B').val(op.data.substr(0,4)+'00');
    			$('#'+tid+'_B').change();
    			$('#'+tid+'_C').val(op.data);
    		}else{
    			$('#'+tid+'_A').change();
    			$('#'+tid+'_B').change();
    		}
        }, getTown : function() {
        	var op = this.options;
        	return [op.data, op.text];
        }
    };

    $.fn.slttown = function (option) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('slttown');

        if (!data) {
            var options = $.extend({}, $.fn.slttown.defaults, typeof option == 'object' && option);
            $this.data('slttown', (data = new SltTown(this, options)));
            data._init();
        }
      });
    };

    $.fn.slttown.defaults = {
        all: '',    //选择所有时候显示的文字
        data : '',  //当前选中的值
        field : ''   //字段名字
    };
}(jQuery);

/**
 * 数字输入按钮
 * 属性：decimal : 精度，默认0，为没有小数，1为1位小数
 *     negative : true/false 是否允许负数，默认为false
 * <input type="text" data-api="numinput" data-decimal="0" data-negative="false"/>
 */
!function ($) {
    var NumInput = function(element, options) {
        this.options = options;
        this.$element = $(element);
        this.allowed = '0123456789';
        this.reg = '[^0123456789';
    };

    NumInput.prototype = {
              constructor: NumInput
            , _init : function() {
                var self = this
                   , el = this.$element
                   , opt = this.options
                   , de = el.attr('data-decimal')
                   , neg = el.attr('data-negative');

                (de) && (opt.decimal = parseInt(de));
                (neg) && (opt.negative = (neg == 'true'));

                if (opt.negative) {
                    self.reg+='\\-';
                    self.allowed+='-';
                }
                if (opt.decimal > 0) {
                    self.reg+='\\.';
                    self.allowed+='.';
                }
                self.reg+=']';
                self.reg = new RegExp(self.reg, 'g');

                var check = function(){
                  var v = el.val().replace(self.reg, "")
                    ,vl = v.length;
                  if (v){
                      var dl = v.lastIndexOf('.');
                      if ( v.indexOf('.') != dl ) {
                          v = v.substring(0, dl) + v.substr(dl+1, vl);
                      }
                      dl = v.lastIndexOf('-');
                      if ( v.indexOf('-') != dl || v.indexOf('-') > 1) {
                          v = v.substring(0, dl) + v.substr(dl+1, vl);
                      }
                      dl = v.lastIndexOf('.');
                      if ( dl > 0 && vl - dl - 1 > opt.decimal ) {
                          v = v.substring(0, dl+1+opt.decimal);
                      }
                  }
                  el.val(v);
                };

                el.css('ime-mode', 'disabled').on('keyup', function(e) {
                    check();
                    e.preventDefault();
                }).on('cut paste', function(e){
                    return false;
                });
                check();
            }
    };

    $.fn.numinput = function (option) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('numinput');

        if (!data) {
            var options = $.extend({}, $.fn.numinput.defaults, typeof option == 'object' && option);
            $this.data('numinput', (data = new NumInput(this, options)));
            data._init();
        }
      });
    };

    $.fn.numinput.defaults = {
        decimal: 0
      , negative: false
    };

    $(document).on('keyup.numinput.data-api', '[data-api="numinput"]', function (e) {
        if(!$(this).data('numinput')){
            $(this).numinput({});
        }
      });
}(jQuery);

!function ($) {
    var _isIe = /msie/.test(navigator.userAgent.toLowerCase());
    var _flashVersion = function(){
        if(_isIe) {
            var key = 'ShockwaveFlash.ShockwaveFlash'
                ,axo = null;
            try {
                axo = new ActiveXObject(key+'.7');
            } catch(e) {
                try {
                    axo = new ActiveXObject(key+'.6');
                    return [6, 0, 21];
                } catch(e) {};

                try {
                    axo = new ActiveXObject(key);
                } catch(e) {};
            }
            if (axo != null) {
                return axo.GetVariable("$version").split(" ")[1].split(",");
            }
        } else {
            var p = navigator.plugins;
            var f = p['Shockwave Flash'];
            if (f && f.description) {
                return f.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split(".");
            } else if (p['Shockwave Flash 2.0']) {
                return ['2','0','0'];
            }
        }
        return [];
    }();
    var _flash_id = 0;

    var Flash = function(element, options){
        this.options = options;
        this.$element = $(element);
        this._init();
    };

    Flash.prototype = {
            constructor: Flash
          , _init : function() {
              var e = this.$element
                  , s = this.options
                  , a = s.availattrs
                  , p = s.availparams
                  , rv = s.version.split('.')  // Get required version array.
                  , o = '<object' // Open output string.
                  , attr = function(a,b){return ' '+a+'="'+b+'"';}
                  , param = function(a,b){return '<param name="'+a+'" value="'+b+'" />';};

              s['id'] = '_flash_'+(_flash_id++);
              s['name'] = s['id'];

              // Set codebase, if not supplied in the settings.
              if (!s.codebase) {
                  s.codebase = 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + rv.join(',');
              }

              // Use express install swf, if necessary.
              if (s.express) {
                  for (var i in cv) {
                      if (parseInt(cv[i]) > parseInt(rv[i])) {
                          break;
                      }
                      if (parseInt(cv[i]) < parseInt(rv[i])) {
                          s.src = s.express;
                      }
                  }
              }

              // Convert flashvars to query string.
              if (s.flashvars) {
                  s.flashvars = decodeURIComponent($.param(s.flashvars));
              }

              // Set browser-specific attributes
              a = _isIe ? a.concat(['classid', 'codebase']) : a.concat(['pluginspage','name']);

              // Add attributes to output buffer.
              for (k in a) {
                  var n = (k ==  $.inArray('src',a)) ? 'data' : a[k];
                  o += s[a[k]] ? attr(n, s[a[k]]) : '';
              };
              o += '>';

              // Add parameters to output buffer.
              for (k in p) {
                  var n = (k == $.inArray('src',p)) ? 'movie' : p[k];
                  o += s[p[k]] ? param(n, s[p[k]]) : '';
              };

              // Close and swap.
              o += '</object>';
              if (s.replace){
                e.replaceWith(o);
              } else {
                  e.html(o);
              }
          }, getSwf : function(){
              var movie = this.options.name;
              if (_isIe) {
                  return window[movie];
              } else {
                  return document[movie];
              }
          }
    };

    $.fn.flash = function (option, para, cb) {
          if (_flashVersion.length == 0) {
                alert('您需要先安装flash，才能进行操作');
                return;
          }
          return this.each(function () {
            var $this = $(this)
              , data = $this.data('flash')
              , os = (typeof option == 'string');

            if (!data) {
                var options = $.extend({}, $.fn.flash.defaults, typeof option == 'object' && option);
                $this.data('flash', (data = new Flash(this, options)));
            } else if (!os) {
                data.options =  $.extend({}, data.options, typeof option == 'object' && option);
                data._init();
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

    $.fn.flash.defaults = {
        replace : false, //是否进行替换，如果是进行了替换。那么替换后的dom就不会有fn.flash的方法了
        express : '',    //expressInstall.swf的路径
        width: 300,
        height: 200,
        classid: 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000',
        pluginspage: 'http://get.adobe.com/flashplayer',
        type: 'application/x-shockwave-flash',
        availattrs: [
            'id',
            'class',
            'width',
            'height',
            'src',
            'type'
        ],
        availparams: [
            'src',
            'bgcolor',
            'quality',
            'allowscriptaccess',
            'allowfullscreen',
            'flashvars',
            'wmode'
        ],
        version: '10.0.0'
    };
}(jQuery);

/**
 * 一个单文件上传组件：
 * 使用示例：
 * <div id="divUpload"></div>
 *
 * $('#divUpload').upload({
 *   btn : '选择上传文件',
 *   frmName : '隐藏表单的名字',
 *   frmId : '隐藏表单的id',
 *   filter : {'*.doc, *.docx':'文旦文件','*.png':'png图片文件'},
 *   alertErr : true, //默认为true，也就是指弹出错误提示
 *   fileSize : 120,  //文件大小
 *   fileNum : 1  //一次可上传多少个文件，1表示一个，0表示不限制，3表示最多3个。
 * }).on('selectOk', function(e){
 */
!function ($) {
    var _uploadId = 0;
    var _uploadTask = {};

    $._uploadSelectOk = function(id, data, name, size) {
        if (_uploadTask[id]){
            _uploadTask[id]['_selectOk'](data, name, size);
        }
    };
    $._uploadSelectErr = function(id, code, msg) {
        if (_uploadTask[id]){
            _uploadTask[id]['_selectErr'](code, msg);
        }
    };

    var Upload = function(element, options) {
        options.uploadId = '_upload_'+(_uploadId++);
        this.options = options;
        this.$element = $(element).attr('_nui_dispose','upload');
        _uploadTask[options.uploadId] = this;
        this._init();
    };

    Upload.prototype = {
            constructor: Upload
          , _init : function() {
              var el = this.$element
                  ,op = this.options
                  ,html = '';

              if(op.frmName) {
                  op.frmDataId = '_upload_data_'+(_uploadId++);
                  html+='<input type="hidden" name="'+op.frmName+'_data" id="'+op.frmDataId+'"/>';
                  op.frmNameId = '_upload_file_'+(_uploadId++);
                  html+='<input type="hidden" name="'+op.frmName+'_name" id="'+op.frmNameId+'" readOnly="readOnly"/>';
              }
              el.flash({
                  width : op.width + 2,
                  height : op.height + 2,
                  flashvars : {
                      id: op.uploadId,
                      fileSize : op.fileSize,
                      fileExt : op.fileExt,
                      fileDesc : op.fileDesc,
                      fileNum : op.fileNum
                  },
                  src :'static/swf/upload.swf'
              }).prepend(html);

          }, _selectOk: function(data, name, size) {
              var op = this.options;
              if(op.frmName){
                  $('#'+op.frmDataId).val(data);
                  $('#'+op.frmNameId).val(name);
              }
              this.$element.trigger($.Event('selectOk'), data);
          }, _selectErr: function(code, msg) {
              alert(msg);
//              if (this.options.alertMsg) {
//                  $.alertMsg('错误提示', msg);
//              }
              this.$element.trigger($.Event('selectErr'), code, msg);
          }, dispose : function(){
              delete _uploadTask[this.options.uploadId];
          }
    };

    $.fn.upload = function (option, para) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('upload')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.upload.defaults, typeof option == 'object' && option);
            $this.data('upload', (data = new Upload(this, options)));
        } else if (!os) {
            data.options =  $.extend({}, data.options, typeof option == 'object' && option);
            data.dispose();
            $(self._swf).remove();
            data._init();
        }

        if (os) {
            data[option](para);
        }
      });
    };

    $.fn.upload.defaults = {
        btn : '浏览文件',
        width : 70,
        height : 26,
        fontSize : 12,
        frmName : '',
        frmId : '',
        alertErr : true,
        fileExt    : '*.*',
        fileDesc   : '所有文件类型',
        fileSize : 120,
        fileNum : 1
    };
}(jQuery);

/**
 * 一个日期选择控件
 * 属性：
 * <input type="text" data-api="datepick" data-time="false"/>
 */
!function ($) {
    var _id = '_nui_datepick';
    var _uuid = 0;
    var _time = false;
    var DatePick = function(element, options) {
        this.options = options;
        this.$element = $(element).attr('_nui_dispose', 'datepick');
        this._init();
    };
    var _num = function(m){
        return m<10?'0'+m:m+'';
    };
    var _getYm = function(y, m) {//得到前一月或下一月
        y = (m<0)?y-1:( (m>12) ? y+1 : y);
        m = (m<0)?12:( (m > 12) ? 1 : m );
        return y+'-'+_num(m)+'-';
    };
    var _getYmd = function(d){
        var day = d || new Date()
            ,_y = day.getFullYear()   //年
            ,_m = day.getMonth()+1    //月
            ,_d = day.getDate();      //日
        return _y+'-'+_num(_m)+'-'+_num(_d);
    };

    DatePick.prototype = {
            constructor: DatePick
          , _init : function() {
              var el = this.$element
                  , os = el.offset()
                  ,op = this.options
                  ,_sltTime = '';

			  _time = op.time;
              op._uuid = _uuid++;
              el.on('click.'+op._uuid+'.datepick.data-api', function(e){
                  var val = el.val();
                  if (val){
                      $('#'+_id).data('day', val);
                  }
                  $('#'+_id).datecontainer('reload').css({
                      left:os.left,
                      top:os.top+10+el.height()
                  }).on('click.'+op._uuid+'.datepick.data-api', ".day a", function(e){
					  _sltTime = $(this).attr('ym')+_num($(this).text());
					  if(_time == true){
							_sltTime += ' '+$('#_date_hour').val() +':'+ $('#_date_minute').val() + ':00';
					  }
                      el.val(_sltTime);
                      $('#'+_id).off('click.'+op._uuid);
                      $('#'+_id).hide();
                  }).show();

                  e.preventDefault();
                  e.stopPropagation();
              });

              $('html').on('click.'+op._uuid+'.datepick.data-api', function(e){
                  $('#'+_id).off('click.'+op._uuid);
                  $('#'+_id).hide();
              });

          }, hidden : function (e){
              this.$element.hide();
          } , dispose : function(){
              $('html').off('click.'+op._uuid);
          }
    };

    $.fn.datepick = function (option, para) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('datepick');

        if (!data) {
            var options = $.extend({}, $.fn.datepick.defaults, typeof option == 'object' && option);
            $this.data('datepick', (data = new DatePick(this, options)));
        }

      });
    };

    $.fn.datepick.defaults = {
      time: false,
      data : ''
    };

    $(document).on('focus.datepick.data-api', '[data-api="datepick"]', function(e){
        if(!$(this).data('datepick')){
            $(this).datepick({});
        }
      });

    //初始化
    var DateContainer = function(element) {
        this.$element = $(element);
        this._init();
    };
    DateContainer.prototype = {
            constructor: DateContainer
          , _init : function() {
              var self = this
                  , el = this.$element;

              //设置默认时间
              el.data('day', _getYmd());

              //上一月
              $('.head a.pre', el).on('click', function(){
                  var arr = el.data('day').split('-')
                      , pday = new Date(arr[0], arr[1]-2, arr[2]);
                  el.data('day', _getYmd(pday));
                  self.reload();
              });

              //下一月
              $('.head a.next', el).on('click', function(){
                  var arr = el.data('day').split('-')
                      , pday = new Date(arr[0], parseInt(arr[1]), arr[2]);
                  el.data('day', _getYmd(pday));
                  self.reload();
              });
          }, reload : function(){
              var el = this.$element
               , day = new Date(el.data('day').replace(/-/g, '/'))
               , _y = day.getFullYear()   //年
               ,_m = day.getMonth()+1   //月
               ,_d = day.getDate()      //日
               ,_ttl = new Date(_y, _m, 0).getDate()      //本月共几天
               ,_pttl = new Date(_y, _m-1, 0).getDate()   //上月共几天
               , _bday = -new Date(_y, _m-1, 1).getDay()  //本月1日是周几，0为周日
               , _str = ''
               , _new = 0
               , _act
               , _currDay = new Date()
               , _currHour = _num(_currDay.getHours())
               , _currMinutes = _num(_currDay.getMinutes());

           //更新年月
           $('.title', el).text(_y+'年'+_num(_m)+'月');

           //更新日期
           $('.day', el).html('');
           for(var i=0; i<6; i++) {
               for(var j=0; j<7; j++) {
                   if (_bday < 0) {//上个月的时间
                       _str+='<a href="javascript:void(0)" class="unactive" ym='+_getYm(_y,_m-1)+'>'+(_pttl - (-_bday))+'</a>';
                       _bday = _bday + 1;
                   } else {
                       _bday = _bday + 1;
                       if (_bday > _ttl) {//下个月的时间
                           _new++;
                           _str+='<a href="javascript:void(0)" class="unactive" ym='+_getYm(_y,_m+1)+'>'+_new+'</a>';
                       } else {
                           _act = (_bday == _d)?'active':'';
                           _str+='<a href="javascript:void(0)" class="'+_act+'" ym='+_getYm(_y,_m)+'>'+_bday+'</a>';
                       }
                   }
               }
               if (_new > 0 || _bday == _ttl){
                   break;
               }
           }

			//时间选择设置
		   if(_time == true){
				$('#_date_hour').find('option[value='+_currHour+']').attr('selected','selected');
				$('#_date_minute').find('option[value='+_currMinutes+']').attr('selected','selected');
		   }else{
				$('._date_time').remove();
		   }

           $('.day', el).html(_str);
        }
    };
    $.fn.datecontainer = function(cmd, para) {
        return this.each(function() {
          var $this = $(this)
            , data = $this.data('datecontainer');
          if (!data) {
              $this.data('datecontainer', (data = new DateContainer(this)));
          }
          if (cmd){
              data[cmd](para);
          }
        });
      };

    var str = '<div id="'+_id+'" class="nui_datepick">' +
                '<div class="head">' +
                    '<a href="javascript:void(0);" class="pre"><i class="icon-chevron-left"></i></a>' +
                    '<a href="javascript:void(0);" class="title">2012年3月</a>' +
                    '<a href="javascript:void(0);" class="next"><i class="icon-chevron-right"></i></a>' +
                '</div>'+
                '<div class="body>">'+
                    '<div class="week">' +
                        '<span>日</span>' +
                        '<span>一</span>' +
                        '<span>二</span>' +
                        '<span>三</span>' +
                        '<span>四</span>' +
                        '<span>五</span>' +
                        '<span>六</span>' +
                    '</div><div class="clearfix"></div>' +
                    '<div class="day">' +
                    '</div>' +
                    '<div class="_date_time">' +
						'<select id="_date_hour" style="width:55px;">';
							for(var _i=0;_i<24;_i++){
								if(_i<10){
									str += '<option value="0'+_i+'">0'+_i+'</option>';
								}else{
									str += '<option value="'+_i+'">'+_i+'</option>';
								}
							}
	str += 					'</select>:' +
						'<select id="_date_minute" style="width:55px;">';
							for(var _i=0;_i<60;_i++){
								if(_i<10){
									str += '<option value="0'+_i+'">0'+_i+'</option>';
								}else{
									str += '<option value="'+_i+'">'+_i+'</option>';
								}
							}
	str += 					'</select>' +
						'</div>' +
                '</div>'+
              '</div>';
    $('body').append(str);
    $('#'+_id).datecontainer().on('click.datepick.data-api', function(e){
        e.preventDefault();
        e.stopPropagation();
    });

}(jQuery);

/**
 * 简单的图片显示
 * 可动态显示某个节点下的所有图片，或者传入额外的图片列表
 *
 * @author 金宁宝
 */
!function ($) {
	var PicShow = function(element, options) {
		this.options = options;
		this.$element = $(element);
		this._init();
	};

	PicShow.prototype = {
		constructor: PicShow
		,_init : function(e) {
			//图片显示的html代码
			this._getPicHtml();
		}, show : function(idx) {
		    $('#_picshow').modal('show');
		} ,_getPicHtml:function(){
			var op = this.options
			    ,self = this
				,el = this.$element
				,_html = ''
			    ,_imgArr = el.find('img').css({cursor:'pointer'}).on('click',function(){
			        self.show();
			    });

			_html = '<div class="carousel slide" id="_myCarousel">';
			_html += '<ol class="carousel-indicators">';
			$.each(_imgArr,function(key,imgObj){
				if(key == 0){
					_html += '<li data-slide-to="0" data-target="#_myCarousel" class="active"></li>';
				}else{
					_html += '<li data-slide-to="'+key+'" data-target="#_myCarousel" class=""></li>';
				}
			});
			_html += '</ol>';

			_html += '<div class="carousel-inner">';
			$.each(_imgArr,function(key,imgObj){
			    var _active = ''
			       ,_imgAlt = '';
				if(key == 0){
					_active = 'active';
				}
				if(imgObj.alt){
					_imgAlt = imgObj.alt;
				}
				_html += '<div class="item '+_active+'">';
				_html += '<img alt="'+_imgAlt+'" src="'+imgObj.src+'">';
				if(imgObj.alt){
					_html += '<div class="carousel-caption">'+imgObj.alt+'</div>';
				}
				_html += '</div>';
			});
			_html += '</div>';

			_html += '<a data-slide="prev" href="#_myCarousel" class="left carousel-control">‹</a>';
			_html += '<a data-slide="next" href="#_myCarousel" class="right carousel-control">›</a>';
			_html += '</div>';

			//显示弹窗
			var tmp ='';
			tmp+='<div class="modal-header">'
				+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
				+'<h3>'+op.title+'</h3>'
				+'</div>';
			tmp+='<div class="modal-body">'+_html+'</div></div>';

			$('body').append('<div id="_picshow" style="width:'+op.dialogWidth+'px;"></div>');
			$('#_picshow').addClass('modal hide fade in').attr({
				tabindex : '-1',
				role : 'dialog',
				'aria-hidden':'true'
			}).html(tmp).modal({
				backdrop : 'static',
				show: false
			});

			//初始化图片显示
			$('#_myCarousel').carousel();
		}
	};

	$.fn.picshow = function (option, para) {
		return this.each(function () {
			var $this = $(this)
				, data = $this.data('picshow')
				, os = (typeof option == 'string');

			if (!data) {
				var options = $.extend({}, $.fn.picshow.defaults, typeof option == 'object' && option);
				$this.data('picshow', (data = new PicShow(this, options)));
			} else if (!os) {
				data.options =  $.extend({}, data.options, typeof option == 'object' && option);
			}
		});
	};

	$.fn.picshow.defaults = {
		title:'picture show', //弹窗标题
		dialogWidth:'' //弹窗宽度
	};
}(jQuery);


/**
 * 一个颜色选择控件
 * 属性：
 * data : 当前默认颜色
 * 示例
 * <input type="text" data-api="colorpick"/>
 */
!function ($) {
    var _id = '_nui_colorpick';
    var _uuid = 0;

    var ColorPick = function(element) {
        this.options = {_uuid: _uuid++};
        this.$element = $(element);
        this._init();
    };

    ColorPick.prototype = {
            constructor: ColorPick
          , _init : function(e) {
              var el = this.$element
                  , os = el.offset()
                  ,op = this.options;

              el.on('click.'+op._uuid+'.colorpick.data-api', function(e){
                  var val = el.val();
                  $('#'+_id+' .head').text(val).css({'background-color':val});

                  $('#'+_id).css({
                      left:os.left,
                      top:os.top+10+el.height()
                  }).on('click.'+op._uuid+'.colorpick.data-api', ".body a", function(e){
                      el.val($(this).attr('_color'));
                      $('#'+_id).off('click.'+op._uuid).hide();
                  }).show();

                  e.preventDefault();
                  e.stopPropagation();
              });

              $('html').on('click.'+op._uuid+'.colorpick.data-api', function(e){
                  $('#'+_id).off('click.'+op._uuid).hide();
              });
          }
    };

    $.fn.colorpick = function () {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('colorpick');

        if (!data) {
            $this.data('colorpick', (data = new ColorPick(this)));
        }

      });
    };

    $(document).on('focus.colorpick.data-api', '[data-api="colorpick"]', function(e){
        if(!$(this).data('colorpick')){
            $(this).colorpick({});
        }
      });

    /*初始化*/
    var str = '<div id="'+_id+'" class="nui_colorpick">' +
                '<div class="head">' +
                '&nbsp;</div>'+
                '<div class="body">'+
                '</div>'+
              '</div>';
    $('body').append(str);
    str = '';
    var r,g,b,color;
    for(var i=1; i<7; i++){
        r = Math.round(255/i, 0).toString(16);
        for(var j=1; j<7; j++){
            g = Math.round(255/j, 0).toString(16);
            for(var k=1; k<7; k++){
                b = Math.round(255/k, 0).toString(16);
                color = '#'+r+g+b;
                str+='<a style="background-color:'+color+';" href="javascript:void(0);" _color="'+color+'">&nbsp;</a>';
            }
        }
    }
    $('#'+_id+' .body').html(str);
    $('#'+_id+' .body a').on('hover.colorpick.data-api', function(e){
        var _c = $(this).attr("_color");
        $('#'+_id+' .head').text(_c).css({'background-color':_c});
    });
}(jQuery);


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
            constructor: Grid
          , _init : function() { //初始化grid内容
              var el = this.$element
                 ,op = this.options
                 ,fl = op.fields.length
                 ,str='<table class="table table-hover table-striped';

              op.row && (fl+=1);
              op.check && (fl+=1);
              op.border && (str+=' table-bordered');
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
              el.html(str);

              $('th.check :checkbox', el).click(function(){
                  if ($(this).is(':checked')){
                      $('td.check :checkbox', el).attr('checked', 'checked');
                  } else {
                      $('td.check :checkbox', el).removeAttr('checked');
                  }
              });

			el.on('click', 'i.fdr-tgl', function(){
			    var $i = $(this)
					,$fid = $(this).attr('id');

                if ( $i.hasClass('icon-plus-sign') ){
                    $i.removeClass('icon-plus-sign').addClass('icon-minus-sign');
					el.find('tr[pClass='+$fid+']').show();
                } else if($i.hasClass('icon-minus-sign')) {
                    $i.removeClass('icon-minus-sign').addClass('icon-plus-sign');
                    $('.'+$fid).hide();
					el.find('.'+$fid).find('i.fdr-tgl').removeClass('icon-minus-sign').addClass('icon-plus-sign');
                }
			});

              this.reload();
          }, reload : function(ttl) { //刷新显示
        	  var self = this
				 ,el = this.$element
        	     ,op = this.options
        	     ,para = op.para;

              para.start = (op.nowPage -1) * op.size;

        	  if (typeof op.data == 'string' && op.data != '') {
                  para.size = op.size;
                  para.ttl = ttl?ttl:'y';
        	      now.cmd(op.data, para, function(ret){
        	          self._getBody(ret.rows);
					  if(!op.tree){
						self._getPage(ret.ttl);
					  }
        	      });
        	  } else {
                  self._getBody(op.data.slice(para.start, para.start+op.size));
				  if(!op.tree){
					self._getPage(op.data.length);
				  }
        	  }
        	  self._data._load = false;

			  el.find('input[type=checkbox]').attr('checked',false);

          }, _event : function(type, fid) {//抛出event
              if (fid == ''){
                  return;
              }
              var self = this
                  ,data = this._data.nowData;
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
          } , _getBody : function(rows){//得到主体数据

              this._data.nowData = rows;
              var html = ''
                  ,self = this
                  ,el = this.$element
                  ,op = this.options
                  ,nowPage = op.nowPage
                  ,ck = '';

			  var getHtml = function(json,indent,pClass,className){

				var html = '';
				$.each(json, function(idx, item){
				    var display = '';
					var fid = (op.fid&&item[op.fid])?item[op.fid]:'';

					if(op.tree && item[op.parentKey] != '' && !op.spread){
						display = 'display:none';
					}

					 html+='<tr _id="'+fid+'" class="'+className+'" pclass="'+pClass+'" style="'+display+'">';
					 if (op.row) {
						 html+='<td class="row">'+((nowPage-1)*op.size+idx+1)+'</td>';
					 }
					 if (op.check){
						 ck = (item['_check'])?' checked="checked"':'';
						 html+='<td class="check" style="width:3px"><input type="checkbox"'+ck+'></td>';
					 }
					 $.each(op.fields, function(i, f){
						var w=(f.width)?' style="width:'+f.width+'px;"':'';
						var suojin = '';
						var biaozhi = '';
						if(f.name == op.treeField){
							suojin = indent;
							if (item['_child']) {//有子节点
								if(op.spread){
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
					if (item['_child']) {//有子节点
						html+=getHtml(item['_child'],indent+'&nbsp;&nbsp;&nbsp;&nbsp;',fid,className+' '+fid);
					}

              });

			   return html;
			};

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

          }, _getPage : function(ttl){ //底部分页信息
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
          }, getRows : function(){
              return this._data.nowData;
          } ,getRow : function(id){
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
          }, getSelect : function() {//得到当前点击的行的数据
              return this._select;
          }, getCheck : function() {//得到选中的数据
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
        var $this = $(this)
          , data = $this.data('grid')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.grid.defaults, typeof option == 'object' && option);
            $this.data('grid', (data = new Grid(this, options)));
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

    $.fn.grid.defaults = {
      title: '',      //标题
      check : false,  //是否显示选择框
      border : false,

      tree : false, //是否是表格树，true是表格树,默认是普通表格
	  parentKey:'pid',//父id的key值，默认是pid
	  treeField:'name', //作为树主节点的字段名
	  spread: false,//是否展开子节点

      size : 15,
      nowPage : 1,
      fid : 'id',
      row : true,
      fields : [],
      data : '',
      css : 'nui_grid',
      para : {}
    };

}(jQuery);

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
            constructor: Repeat
          , _init : function() { //初始化repeat内容
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
          }, reload : function(ttl) { //刷新显示
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
          } , _getBody : function(ret){//得到主体数据
              this._data.nowData = ret;
              var html = ''
                  ,el = this.$element
                  ,op = this.options
                  ,_rowData = ''
                  ,_rowNum = '';

			  //计算行数
			  _rowNum = Math.ceil(this._data.nowData.length/op.col);
			  for(var i=0;i<_rowNum;i++){
				  html+='<tr>';
				  _rowData = this._data.nowData.splice(0,op.col);
				  $.each(_rowData, function(idx, item){
					if($.isFunction(op.render)){
						html+='<td>'+op.render(item)+'</td>';
					}else{
						now.tpl(op.render,item,function(ret){
							html+='<td>'+ret+'</td>';
						},false);
					}
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


/**
 * 横向的选择。类似select标签
 * @金宁宝
 */
!function ($) {
    var HSelect = function(element, options) {
        this.options = options;
        this.$element = $(element).addClass(options['css']);
        this._data = {load:false};
        this._init();
    };

    HSelect.prototype = {
            constructor: HSelect
          , _init : function() { //初始化HSelect内容
        	  var self = this
        		  ,el = this.$element;

			el.on('click', 'li._a_pill', function(){
				$(this).parent().find('li.active').removeClass('active');
				$(this).addClass('active');
				self._event('select');
			});

			this.reload();
          }, reload : function(ttl) { //刷新显示
        	  var self = this
        	     ,op = this.options
     	         ,para = op.para;

        	  if (typeof op.data == 'string' && op.data != '') {
        	      now.cmd(op.data, para, function(ret){
        	          self._getBody(ret);
        	      });
        	  } else {
                  self._getBody(op.data);
        	  }
          }, _event : function(type) {

				var self = this
				   ,el = this.$element
				   ,data = this._data.nowData
				   ,_fid=self.options.fid
				   ,_selectObj='';

				_selectObj = $('li.active',el);

				var search = function(json){
				   var ret = {};
				   $.each(json, function(key, value){
					   $.each(value.list, function(idx, node){
							$.each(_selectObj ,function(s,slt){
								if (slt.id == node[_fid]) {
									ret[$('li#'+slt.id,el).parent().attr('name')] = node[_fid];
								}
							});
					   });
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
                  ,op = this.options
                  ,_classNmae = '_a_pill';

              $.each(this._data.nowData, function(key, value){

				  html+='<div style="overflow:hidden;">';
				  if(value.title){
					html+='<dt style="float:left">'+value.title+' : </dt>';
				  }
				  html+='<ul class="nav nav-pills" style="float:left" name="'+value.name+'">';
				  if(value.all){
					html+='<li class="'+_classNmae+'"><a href="javascript:;" id="">'+value.all+'</a></li>';
				  }
				  $.each(value.list, function(idx, item){
					if(value.val == item[op.fid]){
						_classNmae = '_a_pill active';
					}else{
						_classNmae = '_a_pill';
					}
					 html+='<li id="'+item[op.fid]+'"  class="'+_classNmae+'"><a href="javascript:;">'+item.name+'</a></li>';
				  });
				  html+='</ul>';
				  html+='</div>';
              });

              el.html(html);
          }
    };

    $.fn.hselect = function (option, para, cb) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('hselect')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.hselect.defaults, typeof option == 'object' && option);
            $this.data('hselect', (data = new HSelect(this, options)));
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

    $.fn.hselect.defaults = {
      data : '',
      para : {},
      fid : 'id' //数据id名称
    };
}(jQuery);


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
          , _init : function() { //初始化Scroll内容
        	  var el = this.$element;

			el.on('click', 'div._prev', function(){
        	  var _allObj = ''
        	     ,_showObj = ''
        	     ,_firstId = ''
        	     ,_firstShowId = ''
        	     ,_lastShowId = '';

				_allObj = $('li.hvpage',el);
				_showObj = $('li.hvpage_show',el);

				if(_allObj.length > 0){
					_firstId = _allObj.get(0).id;
				}

				if(_showObj.length > 0){
					_firstShowId = _showObj.get(0).id;
					_lastShowId = _showObj.get(_showObj.length-1).id;

					if(_firstShowId != _firstId){
						$('#'+_firstShowId,el).prev().removeClass('hvpage_hide').addClass('hvpage_show');
						$('#'+_lastShowId,el).removeClass('hvpage_show').addClass('hvpage_hide');
					}
				}
			});

			el.on('click', 'div._next', function(){
        	  var _allObj = ''
        	     ,_showObj = ''
        	     ,_lastId = ''
        	     ,_firstShowId = ''
        	     ,_lastShowId = '';

				_allObj = $('li.hvpage',el);
				_showObj = $('li.hvpage_show',el);

				if(_allObj.length > 0){
					_lastId = _allObj.get(_allObj.length-1).id;
				}

				if(_showObj.length > 0){
					_firstShowId = _showObj.get(0).id;
					_lastShowId = _showObj.get(_showObj.length-1).id;
					if(_lastShowId != _lastId){
						$('#'+_firstShowId,el).removeClass('hvpage_show').addClass('hvpage_hide');
						$('#'+_lastShowId,el).next().removeClass('hvpage_hide').addClass('hvpage_show');
					}
				}
			});

			el.on('click', '#_viewHref', function(){
				el.trigger($.Event('viewAll'),'');
			});

			this.reload();
          }, reload : function(ttl) { //刷新显示
        	  var self = this
        	     ,op = this.options
                 ,para = op.para;

        	  if (typeof op.data == 'string' && op.data != '') {
				  para.all = 'y';
				  para.ttl = ttl?ttl:'y';
        	      now.cmd(op.data, para, function(ret){
        	          self._getBody(ret);
                  console.log("ret", ret);
        	      });
        	  } else {
                  self._getBody(op.data);
        	  }
          } , _getBody : function(ret){//得到主体数据
              this._data.nowData = ret.rows;
              var html = ''
                  ,el = this.$element
                  ,op = this.options
                  ,_classNmae = 'hvpage_show';

			  html+='<div>';
			  html+='<div class="_hvpage_other">';
			  html+='	<span class="hvpage_left">';
			  if(op.title != ''){
				html+=op.title;
			  }
			  html+='	</span>';

			  html+='	<span class="hvpage_right">';
			  if(op.ttl != ''){
				html+=op.ttl.replace('{ttl}',ret.ttl);
			  }
			  if(op.ttlTxt != ''){
				html+='&nbsp;&nbsp;<a id="_viewHref" href="javascript:;">'+op.ttlTxt+'</a>';
			  }
			  html+='	</span>';
			  html+='</div><br>';
			  html+='<div class="scrollbar" style="height: '+op.hvWidth+'px;">';
			  html+='	<div class="scrollbar_up _prev"></div>';
			  html+='	<div class="scrollbar_down _next"></div>';
			  html+='	<div class="scrollbar_con">';
			  html+='		<ul class="albumpicsdiv">';
              $.each(this._data.nowData, function(idx, item){
				 if(idx >= op.showNum){
					_classNmae = 'hvpage_hide';
				 }

				html+='<li id="'+item[op.fid]+'" class="hvpage '+_classNmae+'" style="width: '+op.liWidth+'px;">';
				if($.isFunction(op.render)){
					html+=op.render(item);
				}else{
					now.tpl(op.render,item,function(ret){
						html+=ret;
					},false);
				}
				html+='</li>';
              });
			  html+='		</ul>';
			  html+='	</div>';
			  html+='</div>';
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

/**
 * 下拉框
 * @金宁宝
 */
!function ($) {
    var DropSelect = function(element, options) {
        this.options = options;
        this.$element = $(element).addClass(options['css']);
        this._data = {load:false};
        this._init();
    };

    DropSelect.prototype = {
            constructor: DropSelect
          , _init : function() { //初始化Drop内容
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
          }, _getBody : function(ret){//得到主体数据
              this._data.nowData = ret.rows;
              var option = ''
                  ,el = this.$element
                  ,op = this.options;

              $.each(this._data.nowData, function(key, value){
					option += '<option value="'+value[op.fid]+'">'+value.name+'</option>';
              });

              el.html(html);
          }
    };

    $.fn.dropselect = function (option, para, cb) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('dropselect')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.dropselect.defaults, typeof option == 'object' && option);
            $this.data('dropselect', (data = new DropSelect(this, options)));
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

    $.fn.dropselect.defaults = {
      data : '',
      para : {},
      fid : 'id', //数据id名称
      width : 240 //组件宽度
    };
}(jQuery);

/**
 * 简单的所见即所得编辑器，使用的是kindeditor 属性：
 * simple = true/false 默认true，默认为简单编辑器
 * data = 数据内容
 *
 * 命令： getHtml/isEmpty/getText/setHtml/setText/appendHtml
 */
!function ($) {
    var Editor = function(element, options) {
        this.options = options;
        this.$element = $(element).attr('_nui_dispose','editor');
        if (!KindEditor) {
            $.ajax({
                url : options.editorJsPath ? options.editorJsPath : '/static/kindeditor/kindeditor.all.min.js',
                type : "GET",
                async : false,
                dataType : "script"
              });
        }
        this._init();
    };

    Editor.prototype = {
            constructor: Editor
          , _init : function() {
        	  var self = this
        	     ,el = self.$element
        	     ,op = this.options;
        	  if (el.attr('id')) {
        	      op.selector = '#'+el.attr('id');
        	  }
        	  self.dispose();
        	  self.editor = KindEditor.create(op.selector, this.options.keOpt);
        	  self.editor.html(op.data);
          }, dispose : function(){
              if (self.editor) {
                  KindEditor.remove(this.options.selector);
              }
          }, exec : function(cmd, para){
              if (this.editor) {
                  return this.editor[cmd](para);
              } else {
                  return '';
              }
          }
    };

    $.fn.editor = function (option, para, cb) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('editor')
              , os = (typeof option == 'string');

            if (!data) {
                var options = $.extend({}, $.fn.editor.defaults, typeof option == 'object' && option);
                $this.data('editor', (data = new Editor(this, options)));
            } else if (!os) {
                data.options = $.extend({}, data.options, typeof option == 'object' && option);
                data._init();
            }
            if (os) {
                if ( $.isFunction(para) ) {
                    if (data[option]) {
                        para(data[option]({}));
                    } else {
                        para(data['exec'](option));
                    }
                } else if($.isFunction(cb)) {
                    if (data[option]) {
                        cb(data[option](para));
                    } else {
                        cb(data['exec'](option, para));
                    }
                } else {
                    if (data[option]) {
                        data[option](para);
                    } else {
                        data['exec'](option, para);
                    }
                }
            }
      });
    };

    $.fn.editor.defaults = {
      keOpt : {
          resizeType : 1,
          allowPreviewEmoticons : false,
          allowImageUpload : false,
          items : [
              'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
              'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
              'insertunorderedlist', '|', 'emoticons', 'image', 'link']
          },
      data : ''
    };
}(jQuery);

});
