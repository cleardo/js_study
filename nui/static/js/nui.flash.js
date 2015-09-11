!function ($) {
    var _isIe = /msie/.test(navigator.userAgent.toLowerCase());
    var _flashVersion = function(){
        if(_isIe) {
            var key = 'ShockwaveFlash.ShockwaveFlash'
                ,axo = null;
            try {
                axo = new ActiveXObject(key+'.7');
            } catch(e) {
                try {
                    axo = new ActiveXObject(key+'.6');
                    return [6, 0, 21];
                } catch(e) {};

                try {
                    axo = new ActiveXObject(key);
                } catch(e) {};
            }
            if (axo != null) {
                return axo.GetVariable("$version").split(" ")[1].split(",");
            }
        } else {
            var p = navigator.plugins;
            var f = p['Shockwave Flash'];
            if (f && f.description) {
                return f.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split(".");
            } else if (p['Shockwave Flash 2.0']) {
                return ['2','0','0'];
            }
        }
        return [];
    }();
    var _flash_id = 0;

    var Flash = function(element, options){
        this.options = options;
        this.$element = $(element);
        this._init();
    };

    Flash.prototype = {
            constructor: Flash
          , _init : function() {
              var e = this.$element
                  , s = this.options
                  , a = s.availattrs
                  , p = s.availparams
                  , rv = s.version.split('.')  // Get required version array.
                  , o = '<object' // Open output string.
                  , attr = function(a,b){return ' '+a+'="'+b+'"';}
                  , param = function(a,b){return '<param name="'+a+'" value="'+b+'" />';};

              s['id'] = '_flash_'+(_flash_id++);
              s['name'] = s['id'];

              // Set codebase, if not supplied in the settings.
              if (!s.codebase) {
                  s.codebase = 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=' + rv.join(',');
              }

              // Use express install swf, if necessary.
              if (s.express) {
                  for (var i in cv) {
                      if (parseInt(cv[i]) > parseInt(rv[i])) {
                          break;
                      }
                      if (parseInt(cv[i]) < parseInt(rv[i])) {
                          s.src = s.express;
                      }
                  }
              }

              // Convert flashvars to query string.
              if (s.flashvars) {
                  s.flashvars = decodeURIComponent($.param(s.flashvars));
              }

              // Set browser-specific attributes
              a = _isIe ? a.concat(['classid', 'codebase']) : a.concat(['pluginspage','name']);

              // Add attributes to output buffer.
              for (k in a) {
                  var n = (k ==  $.inArray('src',a)) ? 'data' : a[k];
                  o += s[a[k]] ? attr(n, s[a[k]]) : '';
              };
              o += '>';

              // Add parameters to output buffer.
              for (k in p) {
                  var n = (k == $.inArray('src',p)) ? 'movie' : p[k];
                  o += s[p[k]] ? param(n, s[p[k]]) : '';
              };

              // Close and swap.
              o += '</object>';
              if (s.replace){
                e.replaceWith(o);
              } else {
                  e.html(o);
              }
          }, getSwf : function(){
              var movie = this.options.name;
              if (_isIe) {
                  return window[movie];
              } else {
                  return document[movie];
              }
          }
    };

    $.fn.flash = function (option, para, cb) {
          if (_flashVersion.length == 0) {
                alert('您需要先安装flash，才能进行操作');
                return;
          }
          return this.each(function () {
            var $this = $(this)
              , data = $this.data('flash')
              , os = (typeof option == 'string');

            if (!data) {
                var options = $.extend({}, $.fn.flash.defaults, typeof option == 'object' && option);
                $this.data('flash', (data = new Flash(this, options)));
            } else if (!os) {
                data.options =  $.extend({}, data.options, typeof option == 'object' && option);
                data._init();
            }
            if (os) {
                if ( $.isFunction(para) ) {
                    para(data[option]({}));
                } else if($.isFunction(cb)) {
                    cb(data[option](para));
                } else {
                    data[option](para);
                }
            }
          });
    };

    $.fn.flash.defaults = {
        replace : false, //是否进行替换，如果是进行了替换。那么替换后的dom就不会有fn.flash的方法了
        express : '',    //expressInstall.swf的路径
        width: 300,
        height: 200,
        classid: 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000',
        pluginspage: 'http://get.adobe.com/flashplayer',
        type: 'application/x-shockwave-flash',
        availattrs: [
            'id',
            'class',
            'width',
            'height',
            'src',
            'type'
        ],
        availparams: [
            'src',
            'bgcolor',
            'quality',
            'allowscriptaccess',
            'allowfullscreen',
            'flashvars',
            'wmode'
        ],
        version: '10.0.0'
    };
}(jQuery);
