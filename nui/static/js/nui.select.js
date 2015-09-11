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
