/**
 * 简单的图片显示
 * 可动态显示某个节点下的所有图片，或者传入额外的图片列表
 *
 * @author 金宁宝
 */
!function ($) {
	var PicShow = function(element, options) {
		this.options = options;
		this.$element = $(element);
		this._init();
	};

	PicShow.prototype = {
		constructor: PicShow
		,_init : function(e) {
			//图片显示的html代码
			this._getPicHtml();
		}, show : function(idx) {
		    $('#_picshow').modal('show');
		} ,_getPicHtml:function(){
			var op = this.options
			    ,self = this
				,el = this.$element
				,_html = ''
			    ,_imgArr = el.find('img').css({cursor:'pointer'}).on('click',function(){
			        self.show();
			    });

			_html = '<div class="carousel slide" id="_myCarousel">';
			_html += '<ol class="carousel-indicators">';
			$.each(_imgArr,function(key,imgObj){
				if(key == 0){
					_html += '<li data-slide-to="0" data-target="#_myCarousel" class="active"></li>';
				}else{
					_html += '<li data-slide-to="'+key+'" data-target="#_myCarousel" class=""></li>';
				}
			});
			_html += '</ol>';

			_html += '<div class="carousel-inner">';
			$.each(_imgArr,function(key,imgObj){
			    var _active = ''
			       ,_imgAlt = '';
				if(key == 0){
					_active = 'active';
				}
				if(imgObj.alt){
					_imgAlt = imgObj.alt;
				}
				_html += '<div class="item '+_active+'">';
				_html += '<img alt="'+_imgAlt+'" src="'+imgObj.src+'">';
				if(imgObj.alt){
					_html += '<div class="carousel-caption">'+imgObj.alt+'</div>';
				}
				_html += '</div>';
			});
			_html += '</div>';

			_html += '<a data-slide="prev" href="#_myCarousel" class="left carousel-control">‹</a>';
			_html += '<a data-slide="next" href="#_myCarousel" class="right carousel-control">›</a>';
			_html += '</div>';

			//显示弹窗
			var tmp ='';
			tmp+='<div class="modal-header">'
				+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
				+'<h3>'+op.title+'</h3>'
				+'</div>';
			tmp+='<div class="modal-body">'+_html+'</div></div>';

			$('body').append('<div id="_picshow" style="width:'+op.dialogWidth+'px;"></div>');
			$('#_picshow').addClass('modal hide fade in').attr({
				tabindex : '-1',
				role : 'dialog',
				'aria-hidden':'true'
			}).html(tmp).modal({
				backdrop : 'static',
				show: false
			});

			//初始化图片显示
			$('#_myCarousel').carousel();
		}
	};

	$.fn.picshow = function (option, para) {
		return this.each(function () {
			var $this = $(this)
				, data = $this.data('picshow')
				, os = (typeof option == 'string');

			if (!data) {
				var options = $.extend({}, $.fn.picshow.defaults, typeof option == 'object' && option);
				$this.data('picshow', (data = new PicShow(this, options)));
			} else if (!os) {
				data.options =  $.extend({}, data.options, typeof option == 'object' && option);
			}
		});
	};

	$.fn.picshow.defaults = {
		title:'picture show', //弹窗标题
		dialogWidth:'' //弹窗宽度
	};
}(jQuery);
