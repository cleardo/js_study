// 对话框
var _dialog ='<div class="modal hide fade" id="_nui_dialog">'
    +'<div class="modal-header">'
    +'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
    +'<h3></h3>'
    +'</div>';

_dialog+='<div class="modal-body"></div>';

_dialog+='<div class="modal-footer"></div>' + '</div>';

$('body').append(_dialog);

// 对话框关闭按钮
$('.close', $('#_nui_dialog')).on('click', function(e){
    $('#_nui_dialog').modal('hide');
});

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
        // 加载按钮
        primary='';
        if(e.primary){
            primary='btn-primary';
        }
        footer+='<button class="btn '+primary+'" name="'+e.text+'">'+e.text+'</button>';
    });

    $('.modal-footer', $('#_nui_dialog')).html(footer);

    $.each(btn,function(i,e){
        $('.modal-footer', $('#_nui_dialog'))
            .find('button[name='+e.text+']')
            .on('click',function(){
                if(typeof e.okfun!="undefined"){
                    e.okfun();
                }
                $('#_nui_dialog').modal('hide');
            }
        );
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
