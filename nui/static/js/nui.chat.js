/**
 * 简单的聊天实现，支持1对1和群聊
 */
!function ($) {
    var nowChat = null;

    $._chatReady = function(){
        nowChat._initOk();
    };
    $._chatLoginOk = function(){
        nowChat._loginOk();
    };
    $._chatClose = function(){
        nowChat._chatClose();
    };
    $._chatErr = function(code, msg) {
        nowChat._chatErr(code, msg);
    };
    $._chatData = function(data) {
        nowChat._chatData(data);
    };

    var Chat = function(element, options) {
        if (nowChat) {
            alert('同时只能存在一个聊天实例');
        }
        this.options = options;
        this.$element = $(element);
        this.swf = null;
        nowChat = this;
        this._init();
    };
    Chat.prototype = {
        constructor: Chat
       , _init : function() {
           var el=this.$element;
           el.flash({
               width : 0,
               height : 0,
               src :'static/swf/chat.swf'
           });
       } ,_initOk : function() {
           var self = this
               , el = this.$element
               , op = this.options;

           el.flash('getSwf', function(swf){
               self.swf = swf;
               swf.initChat(op.host, op.port, op.uid, op.name, op.rand, op.code, op.group);
           });

       } , _loginOk : function(){
           var e = $.Event('chatLoginOk');
           this.$element.trigger(e);
       }, _chatErr: function(code, msg){
           var e = $.Event('chatErr');
           this.$element.trigger(e, code, msg);
       }, _chatClose : function() {
           var e = $.Event('chatClose');
           this.$element.trigger(e);
       }, _chatData : function(data){
           var e = $.Event('chatData');
           this.$element.trigger(e, data);
       }, sendMsg : function(para) {
           this.swf.sendMsg(para.to, para.msg);
       } ,dispose : function(){
           this.$element.html('');
           nowchat = null;
       }
    };
    $.fn.chat = function (option, para,cb) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('chat')
            , os = (typeof option == 'string');

          if (!data) {
              var options = $.extend({}, $.fn.chat.defaults, typeof option == 'object' && option);
              $this.data('chat', (data = new Chat(this, options)));
          } else if (!os) {
              data.options =  $.extend({}, data.options, typeof option == 'object' && option);
          }

          if (os) {
              data[option](para);
          }
        });
      };

      $.fn.chat.defaults = {
          host : '127.0.0.1',
          port : 2008,
          uid : '',
          name : '',
          group : '',
          rand : '',
          code : ''
      };

}(jQuery);
