/**
 * 一个单文件上传组件：
 * 使用示例：
 * <div id="divUpload"></div>
 *
 * $('#divUpload').upload({
 *   btn : '选择上传文件',
 *   frmName : '隐藏表单的名字',
 *   frmId : '隐藏表单的id',
 *   filter : {'*.doc, *.docx':'文旦文件','*.png':'png图片文件'},
 *   alertErr : true, //默认为true，也就是指弹出错误提示
 *   fileSize : 120,  //文件大小
 *   fileNum : 1  //一次可上传多少个文件，1表示一个，0表示不限制，3表示最多3个。
 * }).on('selectOk', function(e){
 */
!function ($) {
    var _uploadId = 0;
    var _uploadTask = {};

    $._uploadSelectOk = function(id, data, name, size) {
        if (_uploadTask[id]){
            _uploadTask[id]['_selectOk'](data, name, size);
        }
    };
    $._uploadSelectErr = function(id, code, msg) {
        if (_uploadTask[id]){
            _uploadTask[id]['_selectErr'](code, msg);
        }
    };

    var Upload = function(element, options) {
        options.uploadId = '_upload_'+(_uploadId++);
        this.options = options;
        this.$element = $(element).attr('_nui_dispose','upload');
        _uploadTask[options.uploadId] = this;
        this._init();
    };

    Upload.prototype = {
            constructor: Upload
          , _init : function() {
              var el = this.$element
                  ,op = this.options
                  ,html = '';

              if(op.frmName) {
                  op.frmDataId = '_upload_data_'+(_uploadId++);
                  html+='<input type="hidden" name="'+op.frmName+'_data" id="'+op.frmDataId+'"/>';
                  op.frmNameId = '_upload_file_'+(_uploadId++);
                  html+='<input type="hidden" name="'+op.frmName+'_name" id="'+op.frmNameId+'" readOnly="readOnly"/>';
              }
              el.flash({
                  width : op.width + 2,
                  height : op.height + 2,
                  flashvars : {
                      id: op.uploadId,
                      fileSize : op.fileSize,
                      fileExt : op.fileExt,
                      fileDesc : op.fileDesc,
                      fileNum : op.fileNum
                  },
                  src :'static/swf/upload.swf'
              }).prepend(html);

          }, _selectOk: function(data, name, size) {
              var op = this.options;
              if(op.frmName){
                  $('#'+op.frmDataId).val(data);
                  $('#'+op.frmNameId).val(name);
              }
              this.$element.trigger($.Event('selectOk'), data);
          }, _selectErr: function(code, msg) {
              alert(msg);
//              if (this.options.alertMsg) {
//                  $.alertMsg('错误提示', msg);
//              }
              this.$element.trigger($.Event('selectErr'), code, msg);
          }, dispose : function(){
              delete _uploadTask[this.options.uploadId];
          }
    };

    $.fn.upload = function (option, para) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('upload')
          , os = (typeof option == 'string');

        if (!data) {
            var options = $.extend({}, $.fn.upload.defaults, typeof option == 'object' && option);
            $this.data('upload', (data = new Upload(this, options)));
        } else if (!os) {
            data.options =  $.extend({}, data.options, typeof option == 'object' && option);
            data.dispose();
            $(self._swf).remove();
            data._init();
        }

        if (os) {
            data[option](para);
        }
      });
    };

    $.fn.upload.defaults = {
        btn : '浏览文件',
        width : 70,
        height : 26,
        fontSize : 12,
        frmName : '',
        frmId : '',
        alertErr : true,
        fileExt    : '*.*',
        fileDesc   : '所有文件类型',
        fileSize : 120,
        fileNum : 1
    };
}(jQuery);
