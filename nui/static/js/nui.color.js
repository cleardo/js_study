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
