
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
