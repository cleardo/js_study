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
