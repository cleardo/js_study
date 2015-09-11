define(function(require){
	var doc = function(){
		
	};
	
	doc.prototype = {
		constructor : doc,
		index : {
			init : function(para){
				//绑定菜单操作
                var el = $('#menulist');
                el.on('shown', function () {
                    $('li.active', el).removeClass('active');
                    var $mdl = $('.in', el)
                        , mdl = $mdl.attr('id').substr(3)
                        , $menu = $('li:eq(0)',$mdl).addClass('active')
                        , menu = $('a', $menu).attr('menu');
                    
                    var cls = require('demo/'+mdl);
                    cls[menu].init();
                });
                
                $('a[menu]', el).click(function(){
                    var $a = $(this)
                        , $p = $a.parent()
                        , mdl = $p.parent().parent().parent().attr('id').substr(3)
                        , cls = require('demo/'+mdl);
                    
                    $('li.active', el).removeClass('active');
                    $p.addClass('active');
                    cls[$a.attr('menu')].init();
                });
                var modal = require('demo/modal');
                modal.jing.init();
			},
			dispose : function(){
                
            }
		}
	};
	return new doc();
});