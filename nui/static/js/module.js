!function ($) {
    var _mdl = {
      jsPath : '/',
      module : {},
      cache : {},
      stack : []
    };
    
    var setup = function(jsPath, defMdl) {
        _mdl.jsPath = jsPath;
        if ($.isArray(defMdl)){
            $.each(defMdl, function(idx, mdl) {
               require(mdl); 
            });
        }
    };
    
    var require = function(name) {
        if (!_mdl.cache[name]){
            _mdl.stack.push(name);
            $.ajax({
                url : _mdl.jsPath+name+'.js',
                async : false,
                dataType : 'script'
              });
        }
        return _mdl.module[name];
    };
    
    var define = function(cb) {
        var ret = cb(require)
            ,_name = _mdl.stack.pop();
        if (ret != undefined) {
            _mdl.module[_name] = ret;
        }
        _mdl.cache[_name] = 1;
    };
    
    window.define = define;
    window.setup = setup;
}(jQuery);