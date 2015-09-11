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
