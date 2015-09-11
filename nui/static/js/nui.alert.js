!function ($) {

var _int = -1;

var _msg = '<div id="_nui_mask" class="nui_mask hide"></div>';

// 在body后加上msg
$('body').append(_msg);

var _alert = '<div id="_nui_alertmsg" class="nui_alertmsg alert alert-block hide">'
    +'<button type="button" class="close">&times;</button>'
    +'<h4></h4><span></span></div>';

$('body').append(_alert);

var _act = '<div id="_nui_actmsg" class="nui_actmsg alert alert-block alert-success hide">'
    +'<button type="button" class="close">&times;</button>'
    +'<h4></h4><span></span></div>';
$('body').append(_act);

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

/**
 * 弹出错误警告信息
 */
$.alertMsg = function(title, msg){
    var el = $('#_nui_alertmsg');
    // 渲染标题
    $('h4', el).html(title);
    // 渲染详细文本
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

}(jQuery);
