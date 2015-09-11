/**
 * 简化$.dialog()的确认框
 */
$.confirm = function(msg, okfun,title,btn) {
    title= title || '请确定';
    btn = btn || '确定';
    $.dialog(title,msg,[{text:btn,primary:true,okfun:okfun}]);
};
