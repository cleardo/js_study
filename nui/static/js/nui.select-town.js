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
          constructor: SltTown, 
          _init : function() {
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
