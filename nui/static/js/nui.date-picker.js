/**
 * 一个日期选择控件
 * 属性：
 * <input type="text" data-api="datepick" data-time="false"/>
 */
!function ($) {
    var _id = '_nui_datepick';
    var _uuid = 0;
    var _time = false;
    var DatePick = function(element, options) {
        this.options = options;
        this.$element = $(element).attr('_nui_dispose', 'datepick');
        this._init();
    };
    var _num = function(m){
        return m<10?'0'+m:m+'';
    };
    var _getYm = function(y, m) {//得到前一月或下一月
        y = (m<0)?y-1:( (m>12) ? y+1 : y);
        m = (m<0)?12:( (m > 12) ? 1 : m );
        return y+'-'+_num(m)+'-';
    };
    var _getYmd = function(d){
        var day = d || new Date()
            ,_y = day.getFullYear()   //年
            ,_m = day.getMonth()+1    //月
            ,_d = day.getDate();      //日
        return _y+'-'+_num(_m)+'-'+_num(_d);
    };

    DatePick.prototype = {
            constructor: DatePick
          , _init : function() {
              var el = this.$element
                  , os = el.offset()
                  ,op = this.options
                  ,_sltTime = '';

			  _time = op.time;
              op._uuid = _uuid++;
              el.on('click.'+op._uuid+'.datepick.data-api', function(e){
                  var val = el.val();
                  if (val){
                      $('#'+_id).data('day', val);
                  }
                  $('#'+_id).datecontainer('reload').css({
                      left:os.left,
                      top:os.top+10+el.height()
                  }).on('click.'+op._uuid+'.datepick.data-api', ".day a", function(e){
					  _sltTime = $(this).attr('ym')+_num($(this).text());
					  if(_time == true){
							_sltTime += ' '+$('#_date_hour').val() +':'+ $('#_date_minute').val() + ':00';
					  }
                      el.val(_sltTime);
                      $('#'+_id).off('click.'+op._uuid);
                      $('#'+_id).hide();
                  }).show();

                  e.preventDefault();
                  e.stopPropagation();
              });

              $('html').on('click.'+op._uuid+'.datepick.data-api', function(e){
                  $('#'+_id).off('click.'+op._uuid);
                  $('#'+_id).hide();
              });

          }, hidden : function (e){
              this.$element.hide();
          } , dispose : function(){
              $('html').off('click.'+op._uuid);
          }
    };

    $.fn.datepick = function (option, para) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('datepick');

        if (!data) {
            var options = $.extend({}, $.fn.datepick.defaults, typeof option == 'object' && option);
            $this.data('datepick', (data = new DatePick(this, options)));
        }

      });
    };

    $.fn.datepick.defaults = {
      time: false,
      data : ''
    };

    $(document).on('focus.datepick.data-api', '[data-api="datepick"]', function(e){
        if(!$(this).data('datepick')){
            $(this).datepick({});
        }
      });

    //初始化
    var DateContainer = function(element) {
        this.$element = $(element);
        this._init();
    };
    DateContainer.prototype = {
            constructor: DateContainer
          , _init : function() {
              var self = this
                  , el = this.$element;

              //设置默认时间
              el.data('day', _getYmd());

              //上一月
              $('.head a.pre', el).on('click', function(){
                  var arr = el.data('day').split('-')
                      , pday = new Date(arr[0], arr[1]-2, arr[2]);
                  el.data('day', _getYmd(pday));
                  self.reload();
              });

              //下一月
              $('.head a.next', el).on('click', function(){
                  var arr = el.data('day').split('-')
                      , pday = new Date(arr[0], parseInt(arr[1]), arr[2]);
                  el.data('day', _getYmd(pday));
                  self.reload();
              });
          }, reload : function(){
              var el = this.$element
               , day = new Date(el.data('day').replace(/-/g, '/'))
               , _y = day.getFullYear()   //年
               ,_m = day.getMonth()+1   //月
               ,_d = day.getDate()      //日
               ,_ttl = new Date(_y, _m, 0).getDate()      //本月共几天
               ,_pttl = new Date(_y, _m-1, 0).getDate()   //上月共几天
               , _bday = -new Date(_y, _m-1, 1).getDay()  //本月1日是周几，0为周日
               , _str = ''
               , _new = 0
               , _act
               , _currDay = new Date()
               , _currHour = _num(_currDay.getHours())
               , _currMinutes = _num(_currDay.getMinutes());

           //更新年月
           $('.title', el).text(_y+'年'+_num(_m)+'月');

           //更新日期
           $('.day', el).html('');
           for(var i=0; i<6; i++) {
               for(var j=0; j<7; j++) {
                   if (_bday < 0) {//上个月的时间
                       _str+='<a href="javascript:void(0)" class="unactive" ym='+_getYm(_y,_m-1)+'>'+(_pttl - (-_bday))+'</a>';
                       _bday = _bday + 1;
                   } else {
                       _bday = _bday + 1;
                       if (_bday > _ttl) {//下个月的时间
                           _new++;
                           _str+='<a href="javascript:void(0)" class="unactive" ym='+_getYm(_y,_m+1)+'>'+_new+'</a>';
                       } else {
                           _act = (_bday == _d)?'active':'';
                           _str+='<a href="javascript:void(0)" class="'+_act+'" ym='+_getYm(_y,_m)+'>'+_bday+'</a>';
                       }
                   }
               }
               if (_new > 0 || _bday == _ttl){
                   break;
               }
           }

			//时间选择设置
		   if(_time == true){
				$('#_date_hour').find('option[value='+_currHour+']').attr('selected','selected');
				$('#_date_minute').find('option[value='+_currMinutes+']').attr('selected','selected');
		   }else{
				$('._date_time').remove();
		   }

           $('.day', el).html(_str);
        }
    };
    $.fn.datecontainer = function(cmd, para) {
        return this.each(function() {
          var $this = $(this)
            , data = $this.data('datecontainer');
          if (!data) {
              $this.data('datecontainer', (data = new DateContainer(this)));
          }
          if (cmd){
              data[cmd](para);
          }
        });
      };

    var str = '<div id="'+_id+'" class="nui_datepick">' +
                '<div class="head">' +
                    '<a href="javascript:void(0);" class="pre"><i class="icon-chevron-left"></i></a>' +
                    '<a href="javascript:void(0);" class="title">2012年3月</a>' +
                    '<a href="javascript:void(0);" class="next"><i class="icon-chevron-right"></i></a>' +
                '</div>'+
                '<div class="body>">'+
                    '<div class="week">' +
                        '<span>日</span>' +
                        '<span>一</span>' +
                        '<span>二</span>' +
                        '<span>三</span>' +
                        '<span>四</span>' +
                        '<span>五</span>' +
                        '<span>六</span>' +
                    '</div><div class="clearfix"></div>' +
                    '<div class="day">' +
                    '</div>' +
                    '<div class="_date_time">' +
						'<select id="_date_hour" style="width:55px;">';
							for(var _i=0;_i<24;_i++){
								if(_i<10){
									str += '<option value="0'+_i+'">0'+_i+'</option>';
								}else{
									str += '<option value="'+_i+'">'+_i+'</option>';
								}
							}
	str += 					'</select>:' +
						'<select id="_date_minute" style="width:55px;">';
							for(var _i=0;_i<60;_i++){
								if(_i<10){
									str += '<option value="0'+_i+'">0'+_i+'</option>';
								}else{
									str += '<option value="'+_i+'">'+_i+'</option>';
								}
							}
	str += 					'</select>' +
						'</div>' +
                '</div>'+
              '</div>';
    $('body').append(str);
    $('#'+_id).datecontainer().on('click.datepick.data-api', function(e){
        e.preventDefault();
        e.stopPropagation();
    });

}(jQuery);

