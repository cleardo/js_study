define(function(require){

    var Modal = function(){
    };

    Modal.prototype = {
        constructor: Modal,
        /**
         * @author 王军
         * 静态案例
         */
        jing : {
            init : function(para){
                $('#divMain').tpl('demo/modal/jing',{}, function(ret){                	
                	$('#btn_show_code').click(function(){
                		$('#code').toggle('normal');
                	});
                	prettyPrint();
                });
                $('#divNext').tpl('demo/modal/usage', function(ret){
                    prettyPrint();
                });
            },
            dispose : function(){

            }
        },
        /**
         * @author 王军
         * 动态演示
         */
        dong : {
            init : function(para){
                $('#divMain').tpl('demo/modal/dong', function(ret){
                	$('#btn_show_code').click(function(){
                		$('#code').toggle('normal');
                	});
                    prettyPrint();
                });
                $('#divNext').tpl('demo/modal/usage', function(ret){
                    prettyPrint();
                });
            },
            dispose : function(){

            }
        }
    };

    return new Modal();
});