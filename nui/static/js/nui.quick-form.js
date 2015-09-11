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
       check : '',      //额外的检查项
       attr : '',       //特殊属性  {'data-api':'datepick',placeholder:"最大操作时间"}
       rows : '3',     //只在textarea有效
       cols : '30',     //只在textarea有效
       css : 'input-medium'
    };

    QuickFrm.prototype = {
        constructor: QuickFrm, 

        _init : function() {

            var self = this,
              el = self.$element,
              op = self.options,
                //字段数
              fLen = op.fields.length,
              _check = '';

            var add_html=['','',''];

            var cls='';

            if (op.direct=='v') {
                // 竖直渲染表单
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


            console.info("/data/home/linzh/wwwroot/momo.im/test.momo.im/htdocs/js_lab/nui/static/js/nui.quick-form.js", 89, _defField);
            for(var i=0;i<fLen;i++){

                var _fld = $.extend({}, _defField, op.fields[i])
                    ,_id = (_fld.id=='') ? '__fld'+(_fieldId++) : _fld.id;

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

            console.log("选项：", op);
            console.log("元素：", el);
            el.frm({
               // 表单action
               cmd : op.cmd,
               // 表单额外参数
               para : op.para,
               submit : '#'+smtId
            });
        }
    };

    $.fn.quickfrm = function (option) {
        return this.each(function () {
            var $this = $(this), 
              // Quickform 对象
              data = $this.data('quickfrm'), 

              options = $.extend(
                {}, 
                $.fn.quickfrm.defaults, 
                typeof option == 'object' && option
              );

            if (!data) {
                $this.data('quickfrm', (data = new QuickFrm(this, options)));
                // 执行初始化操作
                data._init();
            }
        });
    };

       /*
        * {
        * name:'user[account]', 
        * mdl:'base', 
        * text:'帐号', 
        * check:'must str-6-20', 
        * type:'text', 
        * edit:true, 
        * title:'', 
        * id:''
        * nui: {
        *       fun: para
        *   }
        * }
        *
        */ 
    $.fn.quickfrm.defaults = {
       fields : [],  
       cmd : '',
       submit : '提交', //空则不显示submit按钮
       dialog : false, //是否弹出框
       mask : '',      //是否遮住某个div
       para : {},      //额外参数，默认为空
       title : '',     //标题，默认为空
       direct : 'h',  //'v' 纵向  ,'h'横向
       frmClass : 'well',         //表单div的class
       check : true         //是否需要表单验证，默认要验证(一般作为搜索表单时，direct=h时，需要设置check为false，避免死循环)
    };

}(jQuery);
