var sdcms=[];

sdcms.auto=function(js)
{
	var jsroot=js[js.length-1].src.substring(0,js[js.length-1].src.lastIndexOf("/")+1);
	var src=(document.getElementsByTagName('script')[document.getElementsByTagName('script').length-1].src); 
	var checklang=[];
	if(src.indexOf("?")!=-1)
	{
		var str=src.substr(src.indexOf('?')+1);
		var strs=str.split("&");
		var req=new Object();
		for(var i=0;i<strs.length;i++)
		{ 
			checklang[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
		}
	}
	jsroot=jsroot.replace(document.location.origin,"");
	
	var langname='cn';
	if(checklang.lan!=undefined)
	{
		langname=checklang.lan;
	}
	document.write('<script src="'+jsroot+'lan/'+langname+'.js'+'"></script>');
};

/*自动加载语言包*/
sdcms.auto(document.scripts);

/*表单验证规则，可修改*/
sdcms.rules=function()
{
	return ui_rule;
};

sdcms.language=function()
{
	return ui_lan;
};

sdcms.success=function(text,align,title,color,progress,time)
{
	$.success({title:title,text:text,align:align,color:color,progress:progress,time:time});
};

sdcms.error=function(text,align,title,color,progress,time)
{
	$.error({title:title,text:text,align:align,color:color,progress:progress,time:time});
};

sdcms.warn=function(text,align,title,color,progress,time)
{
	$.warn({title:title,text:text,align:align,color:color,progress:progress,time:time});
};

sdcms.loading=function(text,align,title,color,progress,time)
{
	$.loading({title:title,text:text,align:align,color:color,progress:progress,time:time});
};

$(function()
{
	/*轮播必备：自定义事件*/
	$.event.special.UiTransitionEnd=
	{
		bindType:'transitionend',
		delegateType:'transitionend',
		handle:function(e)
		{
			if($(e.target).is(this))
			{
				return e.handleObj.handler.apply(this,arguments);
			}
		}
    };
	$(document).on("click",".ui-homepage",function()
	{
		if(document.all)
		{
            document.body.style.behavior="url(#default#homepage)";
            document.body.setHomePage(document.URL);
        }
		else
		{
            alert(sdcms.language()['homepage'])
        }
	});
	$(document).on("click",".ui-favorite",function()
	{
		var url=document.URL;
        var title=document.title;
        try
		{
            window.external.addFavorite(url,title);
        }
		catch(e)
		{
            try
			{
                window.sidebar.addPanel(title,url,"");
            }
			catch(e)
			{
                alert(sdcms.language()['favorite']);
            }
        }
	});
    $(document).on("click",".ui-back",function()
	{
		window.history.go(-1);
	});
	$(document).on("click",".ui-backtop",function()
	{
		if($(document).scrollTop()>50)
		{
			$("body,html").animate({scrollTop:0},1000);
		}
        return false;
	});
	
	$(document).on("click",".ui-refresh",function()
	{
		window.location.reload();
	});
	$(document).on("click",".ui-print",function()
	{
		window.print();
	});
	$(document).on("click",".ui-copy",function()
	{
		var target=$(this).data("target");
		var type=$(this).data("type") || 0;
		var tips=$(this).attr("data-tips") || '复制成功';
		if(type==0)
		{
			$(target).select();
			document.execCommand("Copy");
		}
		else
		{
			var $temp=$("<input style='position:absolute;left:-9999px;top:-9999px;'>");
			$("body").append($temp);
			$temp.val($(target).html()).select();
			document.execCommand("copy");
			$temp.remove();
		}
		sdcms.success(tips);
	});
	$(document).on("click",".ui-close",function()
	{
		 window.close();
	});
	/*表单中全选/取消*/
	$(document).on("click",".checkall",function()
	{
		var result=this.checked;
		$(this).closest("form").find(":checkbox").each(function()
		{
			if(!$(this).closest("label").hasClass("ui-switch"))
			{
				this.checked=result;
			}
		})
	});

	/*文本框自动高度*/
	$('.ui-form-limit').each(function()
	{
		this.setAttribute('style','height:'+(this.scrollHeight)+'px;overflow-y:hidden;');
	}).on('input',function()
	{
		this.style.height='auto';this.style.height=(this.scrollHeight)+'px';
		/*字数限制开始*/
		var e=$(this);
		var $max=(e.attr("data-max") || 255);
		var $target=e.attr("data-target");
		if($target==null)
		{
			$target=e.closest(".ui-form-group").find(".ui-form-limit-text");
		}
		else
		{
			$target=$($target);
		}
		var str=e.val();
		if(str.length>$max)
		{
			e.val(str.substring(0,$max));
		}
		var $min=str.length;
		if($min>$max){$min=$max;}
		$target.html("<span>"+$min+"</span>/"+$max);
		/*字数限制结束*/
	});

	$(".ui-form-submit").each(function()
	{
		var e=$(this);
		var type=e.attr("data-type") || 1;
		var hide=e.attr("data-hide") || 1;
		var show=e.attr("data-show") || 0;
		if(type==2)
		{
			show=0;
		}
		/*添加相关属性*/
		e.closest("form").attr("data-type",type);
		e.closest("form").attr("data-hide",hide);
		e.closest("form").attr("data-show",show);
	});
	$(":input").blur(function()
	{
		var e=$(this);
		var type=e.closest("form").attr("data-type");
		var hide=e.closest("form").attr("data-hide");
		var align=e.closest("form").attr("data-align");
		if(type==2)
		{
			if($(this).val()=='')
			{
				return false;
			}
			else
			{
				$input(e,type,hide,align);
			}
		}
		else
		{
			$input(e,type,hide,align);
		}
    });
	$input=function(e,formtype,formhide,formalign)
	{
		if(formtype==null){formtype=1;}
		if(formhide==null){formhide=1;}
		if(formalign==null || formalign==''){formalign='top-right'}
		var isvalidator=0;
		if(formhide==1)
		{
			if(e.closest(".ui-form-group").find(".ui-radio").length==0 && e.closest(".ui-form-group").find(".ui-checkbox").length==0)
			{
				if(!(e.is(":hidden") || e.is(":disabled") ))
				{
					isvalidator=1;
				}
			}
			else
			{
				if(!e.closest(".ui-form-group").is(":hidden"))
				{
					isvalidator=1;
				}
			}			
		}
		else
		{
			isvalidator=1;
		}
		if(isvalidator==1)
		{
			var name=e.attr("name");
			if(e.attr("data-rule"))
			{
				var ismsg=0;
				if(e.closest(".ui-form-group").find(".error-msg").length>0)
				{
					ismsg=1;
				}
				var $checkdata=e.attr("data-rule");
				$checkdata=$checkdata.split(":");
				var $label=$checkdata[0];
				if($label.indexOf("required")>=0)
				{
					$label='';
					$checkdata=$checkdata[0];
				}
				else
				{
					$label=$checkdata[0];
					$checkdata=$checkdata[1];
				}
				var $checkvalue=e.val();
				var $checkstate=true;
				var $checktext="";
				if(e.attr("placeholder")==$checkvalue)
				{
					$checkvalue=$label;
				}
				if($checkvalue!="" || e.attr("data-rule").indexOf("required")>=0)
				{
					var $data=$checkdata.split(";");
					for(var i=0;i<$data.length;i++)
					{
						if($data[i]!='')
						{
							var result=$formcheck(e,$data[i],$checkvalue,$label);
							if(result!=true)
							{
								$checkstate=false;
								$checktext=result;
								break;
							}
						}
					}
				}
				if($checkstate)
				{
					e.closest(".ui-form-group").find(".error-msg").fadeOut(300,function(){$(this).remove();});
					setTimeout(function(){e.closest(".ui-form-group").removeClass("ui-check-error");},300)
					if(formtype>1)
					{
						/*验证成功后移除提示，防止提示还在页面上*/
						$(".ui-toast").remove();
					}
					return true;
				}
				else
				{
					/*添加滚动页面效果*/
					if($(e).css("display")=="block")
					{
						$("body,html").stop().animate({scrollTop:$(e).offset().top-100},1000);
					}
					
					e.closest(".ui-form-group").addClass("ui-check-error");
					if(formtype==1)
					{
						if(ismsg==0)
						{
							e.closest(".ui-form-group").append('<span class="error-msg ui-am-scale-up">'+$checktext+"</span>");
						}
						else
						{
							e.closest(".ui-form-group").find(".error-msg").html($checktext);
						}
					}
					else
					{
						e.closest(".ui-form-group").find(".ui-form-icon").css({"top":"45%"})
						$.warn({text:$checktext,align:formalign});
					}
					return false;
				}
			}
		}
		else
		{
			return true;
		}
	};
	
    $formcheck=function(element,type,value,label)
	{
        $value=value.replace(/(^\s*)|(\s*$)/g,"");
		var rules=sdcms.rules();
		var data=rules[type];
		if(data)
		{
			if(data[0].test($value))
			{
				return true;
			}
			else
			{
				return data[1].replace("{0}",label);
			}
		}
		else
		{
			if(type=='checked')
			{
				var radio=element.closest("form").find('input[name="'+element.attr("name")+'"]:checked').length;
				if(radio==0)
				{
					return sdcms.language()['checked']+label;
				}
				else
				{
					return true;
				}
			}
			var rRule=/(\w+)(?:\[\s*(.*?\]?)\s*\]|\(\s*(.*?\)?)\s*\))?/;
			var parts=rRule.exec(type);
			if(parts)
			{
				method=parts[1];
				params=parts[2] || parts[3];
				switch(method)
				{
					case "length":
						var length=element.closest("form").find('input[name="'+element.attr("name")+'"]:checked').length;
						var $test=params.split("#");
						var where=params;
						var text=sdcms.language()['length']+params;
						if($test.length==2)
						{
							 where=$test[0];
							 text=$test[1];
						}
						if(!eval(length+where))
						{
							return text;
						}
						break;
					case "min":
						if(parseFloat($value)<parseFloat(params))
						{
							return sdcms.language()['min']+params;
						}
						break;
					case "max":
						if(parseFloat($value)>parseFloat(params))
						{
							return sdcms.language()['max']+params;
						}
						break;
					case "between":
						var $num=params.split(",");
						var $min=0;
						var $max=params;
						if($num.length==2)
						{
							$min=$num[0];
							$max=$num[1];
						}
						if(parseFloat($value)<parseFloat($min) || parseFloat($value)>parseFloat($max))
						{
							return $.format(sdcms.language()['between'],[$min,$max])
						}
						break;
					case "match":
						var old=$("#"+params);
						var oldval=old.val();
						var oldlabel=old.attr("data-rule").split(":")[0];
						if(oldval!=$value)
						{
							return $.format(sdcms.language()['match'],[label,oldlabel])
						}
						break;
					case "ajax":
						var result='';
						var token=element.data("token") || '';
						$.ajax(
						{
							type:"post",
							async:false,
							dataType:'json',
							url:params,
							data:'token='+token+'&backval='+encodeURIComponent($value),
							error:function(e){alert(e.responseText);},
							success:function(d)
							{
								if(d.state=='error')
								{
									result=d.msg;
								}
							}
						});
						if(result!='')
						{
							return result;
						}
						break;
				}
			}
			return true;
		}
    };
	
	$(document).on("click",".ui-form-submit",function()
	{
		var e=$(this);
		var type=e.attr("data-type") || 1;
		var hide=e.attr("data-hide") || 1;
		var show=e.attr("data-show") || 0;
		var align=e.attr("data-align");
		var error=e.attr("data-error") || '';
		if(type==2)
		{
			show=0;
		}
		/*添加相关属性*/
		e.closest("form").attr("data-type",type);
		e.closest("form").attr("data-hide",hide);
		e.closest("form").attr("data-show",show);
		e.closest("form").attr("data-align",align);
		e.closest("form").attr("data-error",error);
		
		var total=1;
		e.closest("form").find(":input[data-rule]").each(function()
		{
			var result=$input($(this),type,hide,align,error);
			if(!result)
			{
				total=0;
				if(show==0)
				{
					$(this).first().focus().select();
					return false;
				}
			}
			else
			{
				total=total*1;
			}
		});
		if(total==0)
		{
			return false;
		}
	});
	
	$(document).on("click",".ui-form-reset",function()
	{
		$(this).closest("form").find(".error-msg").remove();
        $(this).closest("form").find(".ui-form-group").removeClass("ui-check-error");
		$(this).closest("form")[0].reset();
	});
	
	$star=function(e)
	{
		if(e.html()!="")
		{
			return;
		}
		var num=e.attr("data-num") || 0;
		var maxnum=e.attr("data-max") || 5;
		var target=e.attr("data-target");
		var star_full=e.attr("data-full") || '★';
		var star_empty=e.attr("data-empty") || '☆';
		
		var setfull=function(num)
		{
			if(num>0)
			{
				e.find(".ui-star-item").removeClass("ui-star-full").html(star_empty);
				for(i=1;i<=num;i++)
				{
					e.find(".ui-star-item").eq(i-1).addClass("ui-star-full").html(star_full);
				}
			}
			if(target!=null && num>0)
			{
				$(target).val(num);
			} 
		};
		for(i=0;i<maxnum;i++)
		{
			e.append('<div class="ui-star-item">'+star_empty+'</div>')
		}
		setfull(num);
		e.find(".ui-star-item").hover(function()
		{
			$(this).addClass("ui-star-active").prevAll().addClass("ui-star-active");
		},function()
		{
			$(this).removeClass("ui-star-active").prevAll().removeClass("ui-star-active");
		});
		e.find(".ui-star-item").click(function()
		{
			num=$(this).prevAll().length+1;
			setfull(num);
		})
	};
	
	/*星星评分*/
	$(".ui-star").each(function()
	{
		$star($(this));
	});

	/*选项卡*/
	$(".ui-tabs-nav li").each(function()
	{
		var e=$(this);
		var type=e.closest(".ui-tabs").attr("data-type");
		/*是否为链接*/
		var href=e.closest(".ui-tabs").attr("data-href") || 0;
		if(href==1)
		{
			return;
		}
		if(type=='hover')
		{
			e.mouseover(function()
			{
				$tabs(e);
			});
		}
		else
		{
			e.click(function()
			{
				$tabs(e);
				return false;
			});
		}
	});
	$tabs=function(e)
	{
		var index=$(e).index();
		$(e).addClass("active").siblings().removeClass("active");
		if($(e).closest(".ui-tabs").children(".ui-tabs-body").length>0)
		{
			$(e).closest(".ui-tabs").children(".ui-tabs-body").children(".ui-tabs-content").children(".ui-tabs-pane").removeClass("active").eq(index).addClass("active");
		}
		else
		{
			$(e).closest(".ui-tabs").children(".ui-tabs-content").children(".ui-tabs-pane").removeClass("active").eq(index).addClass("active");
		}
	};
	
	/*模态窗口*/
	$(document).on("click",".ui-modal-show",function()
	{
		var e=$(this);
		$modal(e,'show');
	});
	$modal=function(e,opentype)
	{
		var target=e.attr("data-target") || e;
		$mask=$('<div class="ui-modal-mask"></div>');
		$body=$(target);
		if(target!=null && opentype=='show')
		{
			$("body").append($mask);
			$mask.fadeIn(function(){$(this).css("display","block")});
			var x=parseInt($(window).width()-$body.outerWidth())/2;
			var y=parseInt($(window).height()-$body.outerHeight())/2;
			if(!$body.hasClass("animated"))
			{
				y-=50;
			}
			$body.css({"left":x,"top":y,"display":"block"});
			if(!$body.hasClass("animated"))
			{
				$body.addClass("ui-modal-in").fadeIn();
			}
			/*拖拽开始*/
			$body.Udrag({handle:".ui-modal-title"});
			/*拖拽结束*/
		}
		
		var close=function()
		{
			$body.removeClass("ui-modal-in").addClass("ui-modal-out").fadeOut(function(){$(this).removeClass("ui-modal-out").css("display","none");setTimeout(function(){$mask.fadeOut(function(){$(".ui-modal-mask").remove()});},10);});
		};
		$body.find(".ui-modal-close").click(function()
		{
            close();
        });
		$mask.click(function()
		{
			close();
        });
		if(opentype=='close')
		{
			close();
		}
	};
	
	$banner=function(e)
	{
		var $li=e.find(".ui-carousel-item");
		var time=(e.attr("data-time") || 5)*1000;
		var arrow=e.attr("data-arrow") || true;
		var way=e.attr("data-way") || 'default';
		var flash=e.attr("data-flash") || false;
		var page=e.attr("data-page") || false;
		var total=$li.length;
		/*如果只有1条，则不轮播*/
		if(total<=1){return;}
		if(flash)
		{
			e.addClass("ui-carousel-flash");
			e.append('<div class="ui-carousel-control"><div class="ui-carousel-title"></div></div>');
			var title=e.find(".ui-carousel-item").eq(0).find("img").attr("data-title");
			if(title!=null)
			{
				e.find(".ui-carousel-title").html(title);
			}
		}
		/*初始索引值*/
		var index=0;
		var timer;
		
		function autoplay()
		{
			timer=setInterval(function(){play_next();},time);
		}	
		function play_prev()
		{
			index--;
			if(index<0){index=total-1;}
			$carousel(e,total,index,'prev',way,flash,page);
		}
		function play_next()
		{
			index++;
			if(index>=total){index=0;}
			$carousel(e,total,index,'next',way,flash,page);
		}
		/*鼠标移入移出*/
		e.on('mouseenter',function()
		{
			clearInterval(timer);
		}).on('mouseleave',function()
		{
			autoplay();
		});
		/*检查是否支持触屏*/
		var touchSupported='ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;	
		if(touchSupported)
		{
			var start=0;
			var end=0;
			e.on('touchstart',function(event)
			{
				clearInterval(timer);
				/*触摸开始时记录一下手指所在的坐标x*/
				start=event.originalEvent.touches[0].clientX;
			});
			e.on('touchmove',function(event)
			{
				clearInterval(timer);
				/*离开屏幕一瞬间的坐标x*/
				end=event.originalEvent.touches[0].clientX;
			});
			e.on('touchend',function(event) 
			{
				clearInterval(timer);
				allowClick=true;
				/*获取差值*/
				var distance=Math.abs(start-end);
				/*当差值大于30说明有方向的变化*/
				if(distance>30)
				{
					if(start>end)
					{
						play_next();
					}
					else
					{
						play_prev();
					}
				}
			});
		}
		
		/*如果开启了左右箭头*/
		if(arrow==true)
		{
			if(e.find(".ui-carousel-prev").length==0)
			{
				e.append('<a class="ui-carousel-prev" href="javascript:;"><span class="ui-carousel-prev-icon"></span></a>');
			}
			var $prev=e.find(".ui-carousel-prev");
			
			if(e.find(".ui-carousel-next").length==0)
			{
				e.append('<a class="ui-carousel-next" href="javascript:;"><span class="ui-carousel-next-icon"></span></a>');
			}
			var $next=e.find(".ui-carousel-next");
			$prev.click(function()
			{
				clearInterval(timer);
				play_prev();
			});
			$next.click(function()
			{
				clearInterval(timer);
				play_next();
			});
		}
		
		if(page==false)
		{
			/*指示器*/
			if(e.find(".ui-carousel-page").length==0)
			{
				var html='';
				html+='<ul class="ui-carousel-page">';
				html+='	<li data-num="0" class="active"></li>';
				for(i=1;i<total;i++)
				{
					html+='	<li data-num="'+i+'"></li>';
				}
				html+='</ul>';
				if(flash)
				{
					e.find(".ui-carousel-control").append(html);
				}
				else
				{
					e.append(html);
				}
			}
		}
		else
		{
			var html='';
			html+='<div class="ui-carousel-pagenum">1/'+total+'</div>';
			e.append(html);
		}
		e.find(".ui-carousel-page li").click(function()
		{
			clearInterval(timer);
			var num=$(this).attr("data-num");
			/*获取不到索引值，重新获取*/
			var index=e.find(".ui-carousel-item.active").index();
			$carousel(e,total,num,(index>num)?'prev':'next',way,flash,page);
		});
		/*自动播放*/
		autoplay();
		if(flash==true)
		{
			var title=e.find(".ui-carousel-item").eq(0).find("img").attr("data-title");
			if(title!=null)
			{
				e.find(".ui-carousel-title").html(title);
			}
		}
	};

	$carousel=function(e,total,index,direction,way,flash,page)
	{
		if(way=='default')
		{
			var NEXT,LEFT;
			if(direction=='next')
			{
				NEXT='next';
				LEFT='left';
			}
			else
			{
				NEXT='prev';
				LEFT='right';
			}
			var $active=e.find(".ui-carousel-item.active");
			var activeIndex=$active.index();
			var delta=(direction=='prev')?-1:1;
			var itemIndex=(activeIndex+delta)%total;
			var $next=e.find(".ui-carousel-item").eq(itemIndex);
		
			$next.addClass("ui-carousel-item-"+NEXT);
			$next[0].offsetWidth;/*重要，缺少的话就无法实现效果*/
			$active.addClass("ui-carousel-item-"+LEFT);
			$next.addClass("ui-carousel-item-"+LEFT);
			$active.one('UiTransitionEnd',function()
			{
				$active.removeClass(['active',"ui-carousel-item-"+LEFT].join(' '));
				$next.removeClass(["ui-carousel-item-"+NEXT,"ui-carousel-item-"+LEFT].join(' ')).addClass('active');
			});
		}
		else
		{
			e.find(".ui-carousel-item").eq(index).fadeIn(function(){$(this).addClass("active");}).siblings().fadeOut(function(){$(this).removeClass("active")});
		}
		/*指示器*/
		e.find(".ui-carousel-page li").eq(index).addClass("active").siblings().removeClass("active");
		
		if(page)
		{
			e.find(".ui-carousel-pagenum").html((index+1)+'/'+total);
		}
		
		if(flash)
		{
			var title=e.find(".ui-carousel-item").eq(index).find("img").attr("data-title");
			if(title!=null)
			{
				e.find(".ui-carousel-title").html(title);
			}
		}
	};
	
	/*轮播*/
	$(".ui-carousel").each(function()
	{
		$banner($(this));
	});
	
	/*侧边栏*/
	$(document).on("click",".ui-offside-show",function()
	{
		/*关闭已打开的*/
		$offside($(this),'show');
	});
	$offside=function(e,opentype)
	{
		var target=e.attr("data-target") || e;
		var $push=e.attr("data-push") || false;
		var $pos=e.attr("data-pos") || 0;
		$mask=$('<div class="ui-offside-mask"></div>');
		$body=$(target);
		if(target!=null && opentype=='show')
		{
			var isleft=$body.hasClass("ui-offside-left");
			/*防止重复创建背景*/
			if($(".ui-offside-mask").length<=0)
			{
				$("body").append($mask).parent().css("overflow","hidden");
				$mask.fadeIn(function(){$(this).css("display","block")});
			}
			var width=$body.outerWidth();
			var height=$body.outerHeight();
			if($body.hasClass("ui-offside-left"))
			{
				$body.css({"left":0});
				if($push){$("body").animate({"marginLeft":width});}
			}
			if($body.hasClass("ui-offside-right"))
			{
				$body.css({"right":0});
				if($push){$("body").animate({"marginRight":width});}
			}
			if($body.hasClass("ui-offside-top"))
			{
				$body.css({"top":0});
				if($push){$("body").animate({"marginTop":height});}
			}
			if($body.hasClass("ui-offside-bottom"))
			{
				$body.css({"bottom":0});
			}
			$body.addClass("ui-offside-in");
		}
		var close=function()
		{
			$("body").parent().css("overflow","auto");
			var width=$body.outerWidth()+$pos;
			var height=$body.outerHeight()+$pos;
			$body.removeClass("ui-offside-in");
			if($body.hasClass("ui-offside-left"))
			{
				$body.css({"left":-width});
				if($push){$("body").animate({"marginLeft":0});}
			}
			if($body.hasClass("ui-offside-right"))
			{
				$body.css({"right":-width});
				if($push){$("body").animate({"marginRight":0});}
			}
			if($body.hasClass("ui-offside-top"))
			{
				$body.css({"top":-height});
				if($push){$("body").animate({"marginTop":0});}
			}
			if($body.hasClass("ui-offside-bottom"))
			{
				$body.css({"bottom":-height});
				if($push){$("body").animate({"marginBottom":0});}
			}
			$mask.fadeOut(function(){$(this).remove()});
			setTimeout(function(){$(".ui-offside-mask").remove();},300)
		};
		$body.find(".ui-offside-close").click(function()
		{
            close();
        });
		$mask.click(function()
		{
			close();
        })
		if(opentype=='close')
		{
			close();
		}
	};
	
	/*下拉菜单*/
	$(".ui-dropdown-show").each(function()
	{
		var e=$(this);
		e.click(function(event)
		{
			$(".ui-dropdown").css({"display":"none"});
			event.stopPropagation();
			$dropdown(e);
		});
	});
	$dropdown=function(e)
	{
		var align=e.attr("data-align");
		var target=e.attr("data-target");
		$html=$(target)
		switch(align)
		{
			case "left":
			case "top":
			case "right":
			case "bottom":
			case "bottom-left":
			case "top-left":
			case "right-top":
				break;
			default:
				align="bottom-left";
				break;
		}
		var classname="ui-dropdown-"+align;
		if(target!=null)
		{
			if($html.css("display")=='none')
			{
				var x=0;
				var y=0;
				switch(align)
				{
					case "left":
						x=e.offset().left-$html.outerWidth()-10;
						y=e.offset().top-$html.outerHeight()/2+e.outerHeight()/2;
						break;
					case "top":
						x=e.offset().left-$html.outerWidth()/2+e.outerWidth()/2;
						y=e.offset().top-$html.outerHeight()-10;
						break;
					case "right":
						x=e.offset().left+e.outerWidth()+10;
						y=e.offset().top-$html.outerHeight()/2+e.outerHeight()/2;
						break;
					case "bottom":
						x=e.offset().left-$html.outerWidth()/2+e.outerWidth()/2;
						y=e.offset().top+e.outerHeight()+10;
						break;
					case "top-left":
						x=e.offset().left;
						y=e.offset().top-$html.outerHeight()-10;
						break;
					case "bottom-left":
						x=e.offset().left;
						y=e.offset().top+e.outerHeight()+10;
						break;
					case "right-top":
						x=e.offset().left+e.outerWidth()+10;
						y=e.offset().top;
						break;
				}
				$html.addClass(classname).css({"left":x+"px","top":y+"px","position":"absolute","display":"block"});
			}
			else
			{
				$html.removeClass(classname).css({"display":"none"});
			}
		}
	};
	/*空白处点击*/
	$(document).click(function(event)
	{
		var $html=$('.ui-dropdown');
		if($html)
		{
			if(!$html.is(event.target) && $html.has(event.target).length===0)
			{
				var classname=$html.attr("class");
				if(classname!=null)
				{
					var data=classname.split(" ");
					for(var i=0;i<data.length;i++)
					{
						if(data[i]!=="ui-dropdown")
						{
							$html.removeClass(data[i]);
						}
					}
				}
				$html.css({"display":"none"});
			}
		}
	});
	
	/*提示*/
	$(".ui-tips").each(function()
	{
		var e=$(this);
		var type=e.attr("data-type");
		if(type!='click')
		{
            type="hover"
        }
		if(type=='hover')
		{
			e.mouseover(function()
			{
				$tips(e);
			});
		}
		else
		{
			e.click(function()
			{
				$tips(e);
			});
		}
	});
	$tips=function(e)
	{
		var align=e.attr("data-align");
		var title=e.attr("title") || e.attr("data-title") || '';
		var pic=e.attr("data-pic");
		var width=e.attr("data-width");
		var color=e.attr("data-color") || '';
		var x=0;
		var y=0;
		switch(align)
		{
			case "left":
			case "right":
			case "bottom":
			case "bottom-left":
			case "top-left":
			case "right-top":
				break;
			default:
				align="top";
				break;
		}
		var str=title;
		if(pic!=null)
		{
			str='<img src="'+pic+'"><div class="ui-tips-title">'+title+'</div>';
		}
		var html='<div class="ui-tips-show">'+str+'</div>';
		$html=$(html)
		$("body").append($html);
		if(width!=null)
		{
			$html.css({"width":width})
		}
		if(color!='')
		{
			$html.addClass('ui-tips-'+color);
		}
		switch(align)
		{
			case "left":
				x=e.offset().left-$html.outerWidth()-10;
				y=e.offset().top-$html.outerHeight()/2+e.outerHeight()/2;
				break;
			case "top":
				x=e.offset().left-$html.outerWidth()/2+e.outerWidth()/2;
                y=e.offset().top-$html.outerHeight()-10;
				break;
			case "right":
				x=e.offset().left+e.outerWidth()+10;
                y=e.offset().top-$html.outerHeight()/2+e.outerHeight()/2;
				break;
			case "bottom":
				x=e.offset().left-$html.outerWidth()/2+e.outerWidth()/2;
                y=e.offset().top+e.outerHeight()+10;
				break;
			case "top-left":
				x=e.offset().left;
                y=e.offset().top-$html.outerHeight()-10;
				break;
			case "bottom-left":
				x=e.offset().left;
                y=e.offset().top+e.outerHeight()+10;
				break;
			case "right-top":
				x=e.offset().left+e.outerWidth()+10;
                y=e.offset().top;
				break;
		}
		var classname="ui-tips-"+align;
		$html.addClass(classname);
		$html.css({"left":x+"px","top":y+"px","position":"absolute"});
		e.mouseout(function()
		{
			$html.remove();
		});
	};
	
	/*导航*/
	$(".ui-nav ul li").each(function()
	{
		var e=$(this)
		var ishave=0;
		if(e.hasClass("active"))
		{
			ishave=1;
		}
		e.hover(function()
		{
			if(ishave==0)
			{
				$(this).addClass("active");
			}
		},function()
		{
			if(ishave==0)
			{
				$(this).removeClass("active");
			}
		});
	});

	/*折叠面板*/
	$(".ui-collapse .ui-card-header").each(function()
	{
		var e=$(this);
		var type=e.closest(".ui-collapse").attr("data-type");
		if(type=='hover')
		{
			e.mouseover(function()
			{
				$collapse(e,'hover');
			});
		}
		else
		{
			e.click(function()
			{
				$collapse(e,'click');
			});
		}
	});
	$collapse=function(e,type)
	{
		if(!e.closest(".ui-card").children(".ui-card-header").hasClass("active") || type=='hover')
		{
			e.closest(".ui-card").siblings().children(".ui-card-header").removeClass("active");
			e.closest(".ui-card").children(".ui-card-header").addClass("active");
			e.closest(".ui-card").children(".ui-card-body").stop(true).slideDown(300);
			e.closest(".ui-card").siblings().children(".ui-card-body").stop(true).slideUp(300);
		}
		else
		{
			e.closest(".ui-card").children(".ui-card-header").removeClass("active");
			e.closest(".ui-card").children(".ui-card-body").stop(true).slideUp(300);
		}
	};
	
	/*折叠菜单*/
	$(document).on("click",".ui-collapse-menu-title",function()
	{
		var type=$(this).data("type") || 0;
		if(type==1)
		{
			event.preventDefault();
			$(this).toggleClass("active").siblings(".ui-collapse-menu-title").removeClass("active");
			$(this).next(".ui-collapse-menu-body").stop(true).slideToggle(300).siblings(".ui-collapse-menu-body").slideUp(300);
		}
	});
	$(document).on("click",".ui-collapse-menu-title i",function()
	{
		var type=$(this).parent().data("type") || 0;
		if($(this).find("i") && type==0)
		{
			$(this).parent().toggleClass("active").siblings(".ui-collapse-menu-title").removeClass("active");
			$(this).parent().next(".ui-collapse-menu-body").stop(true).slideToggle(300).siblings(".ui-collapse-menu-body").slideUp(300);
		}
	});
	/*Fixed*/
	$(".ui-fixed").each(function()
	{
        var e=$(this);
		var width=e.outerWidth();
        var align=e.attr("data-align") || "fixed-top";
		var classname=e.attr("data-hover") || "";
        var top=e.attr("data-offset");
		var parent=e.data("parent") || '';
		top=(top==null)?(e.offset().top):(e.offset().top-parseInt(top));
        $(window).bind("scroll",function()
		{
            var thistop=top-$(window).scrollTop();
			if(align=="fixed-top")
			{
                if(thistop<0)
				{
					e.addClass("ui-fixed-top").css({"width":width,"left":"auto","right":"auto"});
					e.addClass(classname)
					if(parent)
					{
						$(parent).css({"position":"relative","overflow":"hidden"})
						if($(window).scrollTop()-($(parent).offset().top+$(parent).height()-e.height())>0)
						{
							var h=$(parent).height()-e.height();
							e.css({"position":"absolute",top:h+"px"});
						}
						else
						{
							e.css({"position":"fixed",top:""});
						}
					}
				}
				else
				{
					e.removeClass("ui-fixed-top");
					e.removeClass("ui-"+classname);
					if(parent)
					{
						$(parent).css({"position":""});
						e.css({"position":"",top:""});
					}
				}
            }
            
			if(e.hasClass("ui-topbar-opacity"))
			{
				if($(window).scrollTop()>10)
				{
					e.addClass("ui-topbar-show");
					e.css({"position":"fixed"});
				}
				else
				{
					e.removeClass("ui-topbar-show");
					e.css({"position":"relative"});
				}
			}
            var thisbottom=top-$(window).scrollTop()-$(window).height();
			if(align=="fixed-bottom")
			{
				if(thisbottom>0)
				{
					e.addClass("ui-fixed-bottom").css({"width":width,"left":"auto","right":"auto"});
					e.addClass(classname)
				}
				else
				{
					e.removeClass("ui-fixed-bottom");
					e.removeClass(classname)
				}
			} 
        });
    });
	$(".ui-fixed-top").each(function()
	{
		var e=$(this);
		var height=e.outerHeight();
		var old=e.prop("outerHTML");
		var cname=e.attr("data-class") || '';
		var html='<div class="ui-fixed-warp '+cname+'" style="height:'+(height)+'px">'+old+'</div>';
		e.prop("outerHTML",html);
	});
	
	$(".ui-fixed-bottom").each(function()
	{
		var e=$(this);
		var height=e.outerHeight();
		var old=e.prop("outerHTML");
		var cname=e.attr("data-class") || '';
		var html='<div class="ui-fixed-warp '+cname+'" style="height:'+(height)+'px">'+old+'</div>';
		e.prop("outerHTML",html);
	});
	
	/*步骤条*/
	$(".ui-step").each(function()
	{
		var total=$(this).find(".ui-step-item").length;
		var num=$(this).find(".ui-step-item.active").length;
		$(this).parent().find(".ui-step-progress").animate({"width":(num/total)*100+"%"})
	});
	
	/*滚动*/
	$(".ui-scroll").each(function()
	{
		var e=$(this);
		var $ul=e.attr("data-ul") || 'ul';
		var $li=e.attr("data-li") || 'li';
		var $speed=e.attr("data-speed") || 1000;
		var $line=e.attr("data-line") || 1;
		var $max=e.attr("data-max") || 1;
		var $time=e.attr("data-time") || 3;
		var $align=e.attr("data-align") || 'up';
		var $width=e.attr("data-width") || '';
		var $height=e.attr("data-height") || '';
		var $list=e.find($ul);
		var $Lwidth=$list.find($li+":first").outerWidth(true);
		var $Lheight=$list.find($li+":first").outerHeight(true);
		var lineH=$Lheight;
		var upHeight=0-$line*lineH;
		var lineW=$Lwidth;
		var upWidth=0-$line*lineW;
		if(e.find($li).length<=$line)
		{
			return;
		}
		if($align=='up')
		{
			if($height=='')
			{
				$height=$line*$Lheight;
			}
			e.css({"height":$height});
			var scrollUp=function()
			{
				$list.animate({marginTop:upHeight},$speed,function()
				{
					for(var i=0;i<$line;i++)
					{
						$list.find($li+":first").appendTo($list);
					}
					$list.css({marginTop:0});
				});
			}
			window.setInterval(scrollUp,$time*1000);
		}
		else
		{
			if($width=='')
			{
				$width=$max*$Lwidth;
			}
			if($height=='')
			{
				$height=$Lheight;
			}
			e.css({"width":$width,"height":$height});
			var scrollLeft=function()
			{
				$list.animate({marginLeft:upWidth},$speed,function()
				{
					for(var i=0;i<$line;i++)
					{
						$list.find($li+":first").appendTo($list);
					}
					$list.css({marginLeft:0});
				});
			}
			window.setInterval(scrollLeft,$time*1000);
		}
	});
	
	/*灯箱*/
	$(document).on("click",".ui-lightbox",function(event)
	{
		/*阻止点击事件*/
		event.preventDefault();
		var e=$(this);
		var data=[];
		var step=0;
		$lightbox(e,data,step);
	});
	$lightbox=function(e,data,step)
	{
		var fname=e.attr("data-name") || 'ui-lightboxs';
		var ftitle=(e.attr("data-title") || e.attr("title")) || '';
		var fmode=e.attr("data-mode") || 'image';
		var fwidth=e.attr("data-width") || '650';
		var fheight=e.attr("data-height") || '450';
		var fhide=e.attr("data-hide") || false;
		var id=e.attr("data-id");
		var fpic=$("#"+id).val() || e.attr("href");
		var fauto=e.attr("data-auto") || '';
		if(fpic==null)
		{
			sdcms.warn("没有找到图片");
			return false;
		}
		/*遍历寻找相同的name*/
		var realWidth=0;
        var realHeight=0;
		var width=$(window).width()*80/100;
		var height=$(window).height()*80/100;
		var j=0;
		$(".ui-lightbox").each(function(i)
		{
			var l=$(this);
			var name=l.attr("data-name") || 'ui-lightboxs';
			if(name==null)
			{
				name='lightbox';
			}
			if(l.attr("data-mode")=='video')
			{
				name='lightbox-video';
			}
			if(l.attr("data-mode")=='iframe')
			{
				name='lightbox-iframe';
			}
			
			var title=(l.attr("data-title") || l.attr("title")) || '';
			var pic=l.attr("href");
			var hide=(l.attr("data-hide") || false);
			if(name==fname)
			{
				var arr=[];
				arr['title']=title;
				arr['pic']=pic;
				arr['hide']=hide;
				if(fmode=='image')
				{
					var img=new Image();
					img.src=pic;
					$(img).on('load',function()
					{
						realWidth=this.width;
						realHeight=this.height;
						if(realWidth>width || realHeight>height)
						{
							var ww=realWidth/width;
							var hh=realHeight/height;
							if(ww>hh)
							{
								realWidth=width;
								realHeight=parseInt(realHeight/ww);
							}
							else
							{
								realHeight=height;
								realWidth=parseInt(realWidth/hh);
							}
						}
						arr['w']=realWidth;
						arr['h']=realHeight;
					});
				}
				else
				{
					arr['w']=fwidth;
					arr['h']=fheight;
				}
				data.push([arr]);
				if(ftitle==title && fpic==pic)
				{
					step=j;
				}
				j++;
			}
		});

		var total=data.length;
		var $mask=$('<div class="ui-lightbox-mask"></div>');
		if(total>=0)
		{
			$("body").append($mask);
			$mask.fadeIn(function(){$(this).css("display","block")});
			if(fmode=='image')
			{
				if(total==1)
				{
					$warp=$('<div class="ui-lightbox-warp"><div class="ui-lightbox-image"><img src="'+fpic+'" class="ui-lightbox-image-url" /><div class="ui-lightbox-bottom"><i class="ui-lightbox-num">'+(step+1)+'/'+total+'</i><div class="ui-lightbox-text ui-text-hide">'+ftitle+'</div></div></div><div class="ui-lightbox-close ui-rotate">×</div></div>');
				}
				else
				{
					$warp=$('<div class="ui-lightbox-warp"><div class="ui-lightbox-image"><img src="'+fpic+'" class="ui-lightbox-image-url" /><div class="ui-lightbox-left"></div><div class="ui-lightbox-right"></div><div class="ui-lightbox-bottom"><i class="ui-lightbox-num">'+(step+1)+'/'+total+'</i><div class="ui-lightbox-text ui-text-hide">'+ftitle+'</div></div></div><div class="ui-lightbox-close ui-rotate">×</div></div>');
				}
			}
			else if(fmode=='video')
			{
				$warp=$('<div class="ui-lightbox-warp"><div class="ui-lightbox-video"><video src="'+fpic+'" class="ui-lightbox-image-url" controls '+fauto+' style="width:auto;" /></video></div><div class="ui-lightbox-close ui-rotate">×</div></div>');
			}
			else
			{
				$warp=$('<div class="ui-lightbox-warp"><div class="ui-lightbox-iframe"><iframe src="'+fpic+'" class="ui-lightbox-image-url" scrolling="auto" frameborder="0" border="0" /></iframe></div><div class="ui-lightbox-close ui-rotate">×</div></div>');
			}
			$("body").append($warp);
			if(fhide)
			{
				$warp.find(".ui-lightbox-bottom").addClass("ui-hide");
			}
			var lefter=$warp.find(".ui-lightbox-left");
			var righter=$warp.find(".ui-lightbox-right");
			var num=0;
			var isclick=0;
			if(isclick==0)
			{
				if(fmode=='image')
				{
					var img=new Image();
					img.src=fpic;
					$(img).on('load',function()
					{
						realWidth=this.width;
						realHeight=this.height;
						if(realWidth>width || realHeight>height)
						{
							var ww=realWidth/width;
							var hh=realHeight/height;
							if(ww>hh)
							{
								realWidth=width;
								realHeight=parseInt(realHeight/ww);
							}
							else
							{
								realHeight=height;
								realWidth=parseInt(realWidth/hh);
							}
						}
						$warp.find(".ui-lightbox-image-url").animate({"width":realWidth,"height":realHeight},800);
						
						var x=($(window).width()/2)-(realWidth/2)-5;
						var y=(($(window).height()-realHeight)/2)-5;
						$warp.animate({"left":x,"top":y});
						$warp.find(".ui-lightbox-bottom").animate({"width":"100%","height":"40px"},1000);	
					});
				}
				else
				{
					$warp.find(".ui-lightbox-image-url").animate({"width":fwidth,"height":fheight},800);
					var x=($(window).width()/2)-(fwidth/2)-5;
					var y=(($(window).height()-fheight)/2)-5;
					$warp.animate({"left":x,"top":y});
				}
			}
			if(step>0)
			{
				num=step;
			}
			lefter.click(function()
			{
				num--;
				if(num<=-1)
				{
					num=total-1;
				}
				var url=data[num][0].pic;
				var text=data[num][0].title;
				var widths=data[num][0].w;
				var heights=data[num][0].h;
				var hide=data[num][0].hide;
				
				$warp.find(".ui-lightbox-image-url").attr("src",url).animate({"width":widths,"height":heights},800);
				$warp.find(".ui-lightbox-text").html(text);
				$warp.find(".ui-lightbox-num").html((num+1)+'/'+total);
				var x=($(window).width()/2)-(widths/2)-5;
				var y=($(window).height()/2)-(heights/2)-5;
				$warp.animate({"left":x,"top":y})
				if(hide=='true')
				{
					$warp.find(".ui-lightbox-bottom").addClass("ui-hide").css({"display":"none"});
				}
				else
				{
					$warp.find(".ui-lightbox-bottom").removeClass("ui-hide").css({"display":"block"});
				}
				isclick=1;
			});
			righter.click(function()
			{
				num++;
				if(num>=total)
				{
					num=0;
				}
				var url=data[num][0].pic;
				var text=data[num][0].title;
				var widths=data[num][0].w;
				var heights=data[num][0].h;
				var hide=data[num][0].hide;
				$warp.find(".ui-lightbox-image-url").attr("src",url).animate({"width":widths,"height":heights},800);
				$warp.find(".ui-lightbox-text").html(text);
				$warp.find(".ui-lightbox-num").html((num+1)+'/'+total);
				if(widths<100 || heights<100)
				{
					$warp.find(".ui-lightbox-bottom").css({"display":"none"});
				}
				else
				{
					$warp.find(".ui-lightbox-bottom").css({"display":"block"});
				}
				var x=($(window).width()/2)-(widths/2)-5;
				var y=($(window).height()/2)-(heights/2)-5;
				$warp.animate({"left":x,"top":y})
				if(hide=='true')
				{
					$warp.find(".ui-lightbox-bottom").addClass("ui-hide").css({"display":"none"});
				}
				else
				{
					$warp.find(".ui-lightbox-bottom").removeClass("ui-hide").css({"display":"block"});
				}
				isclick=1;
			});
			var close=function()
			{
				$("body").parent().css("overflow","auto");$warp.fadeOut(function(){$(this).remove()});setTimeout(function(){$mask.fadeOut(function(){$(this).remove();});},300);
			};
			$mask.click(function(){if(fmode=='image'){close();}});
			$warp.find(".ui-lightbox-close").click(function(){close();});
		}
	};
	/*滚动动画*/
	$scrollspy=function(e)
	{
		var am=e.attr("data-am") || 'ui-am-fade';
		var loop=e.attr("data-loop") || false;
		var time=e.attr("data-time") || 0;
		var top=e.offset().top;
		var thistop=top-$(window).scrollTop();
		if(thistop<$(window).height())
		{
			if(parseInt(time)==0)
			{
				e.addClass(am);
			}
			else
			{
				setTimeout(function(){e.addClass(am);},time)
			}
		}
		else
		{
			if(loop)
			{
				if(parseInt(time)==0)
				{
					e.addClass(am);
				}
				else
				{
					setTimeout(function(){e.removeClass(am);},time)
				}
			}
		}
	};
	$(".ui-scrollspy").each(function()
	{
		$scrollspy($(this));
	});
	
	/*滚动导航*/
	function scrollnav()
	{
		$(".ui-scrollnav a").each(function()
		{
			var e=$(this);
			var t=e.closest(".ui-scrollnav");
			var target=t.attr("data-target") || window;
			var top=t.attr("data-offset") || 0;
			$(target).bind("scroll",function()
			{
				var thistop=$(e.attr("href")).offset().top-$(window).scrollTop();
				if(thistop-top<0)
				{
					t.find('li').removeClass("active");
					e.parents('li').addClass("active");
				};
			});
		});
	}

	/*滚动导航点击*/
	$(document).on("click",".scrollnav li",function()
	{
		event.preventDefault();
		var e=$(this);
		var target=e.find("a").attr("href");
		var top=$(target).offset().top;
		var offset=e.closest(".ui-scrollnav").data('offset') || 50;
		var index=e.index();
		$("body,html").animate({scrollTop:top-offset},1000);
		$(this).siblings().removeClass('active').end().addClass('active');
	});
	
	$(window).scroll(function()
	{
		for(var i=0;i<$(".ui-scrollnav li").length;i++)
		{
			if($(window).scrollTop() > $($(".ui-scrollnav li").eq(i).find("a").attr("href")).offset().top - 60)
			{
				if(!$(".ui-scrollnav li").eq(i).hasClass("active"))
				{
					$(".ui-scrollnav li").eq(i).siblings().removeClass('active').end().addClass('active');
				}
			}
		};
		
		/*数字回滚*/
		if($('.ui-rock').length>0)
		{ 
	        if($(".ui-rock").offset().top-$(window).scrollTop()>$(window).height())
			{
				$('.ui-rock').each(function(){$(this).countTo();});
			}
	    };
		
		/*滚动动画*/
		$(".ui-scrollspy").each(function()
		{
			$scrollspy($(this));
		});
	});

	/*Extend*/
	var tipsid=0;
	var dialogid=0;
	var toastid=0;
	$.extend(
	{
		/*占位符*/
		format:function(result,data)
		{
			if(data.length==0)
			{
				return result;
			}
			var i=data.length+1;
			while(--i)
			{
				result=result.replace('{'+i+'}',data[i-1]);
			}
			return result;
		},
		tips:function(opt)
		{
			var defaults={
				text:'',
				id:'',
				align:'top',
				time:5,
				name:'',
				color:''
			};
			var config=$.extend({},defaults,opt);
			var e=$(config.id);
			var x=0;
			var y=0;
			tipsid++;

			var name=tipsid;
			if(config.name!='')
			{
				name=config.name;
			}
			var color='';
			if(config.color!=null)
			{
				color=' ui-tips-'+config.color;
			}
			var html='<div class="ui-tips-show'+color+'" id="tips_'+name+'">'+config.text+'</div>';
			$html=$(html);
			$("body").append($html);
			switch(config.align)
			{
				case "left":
					x=e.offset().left-$html.outerWidth()-10;
					y=e.offset().top-$html.outerHeight()/2+e.outerHeight()/2;
					break;
				case "top":
					x=e.offset().left-$html.outerWidth()/2+e.outerWidth()/2;
					y=e.offset().top-$html.outerHeight()-10;
					break;
				case "right":
					x=e.offset().left+e.outerWidth()+10;
					y=e.offset().top-$html.outerHeight()/2+e.outerHeight()/2;
					break;
				case "bottom":
					x=e.offset().left-$html.outerWidth()/2+e.outerWidth()/2;
					y=e.offset().top+e.outerHeight()+10;
					break;
				case "top-left":
					x=e.offset().left;
					y=e.offset().top-$html.outerHeight()-10;
					break;
				case "bottom-left":
					x=e.offset().left;
					y=e.offset().top+e.outerHeight()+10;
					break;
				case "right-top":
					x=e.offset().left+e.outerWidth()+10;
					y=e.offset().top;
					break;
			}
			var classname="ui-tips-"+config.align;
			$html.addClass(classname);
			
			$html.css({"left":x+"px","top":y+"px","position":"absolute"});
			var $tipsid=$("#tips_"+name);
			if(config.time>0)
			{
				setTimeout(function(){$tipsid.remove();},config.time*1000);
			}
		},
		toast:function(opt)
		{
			var defaults={
				title:'',
				text:'',
				align:'center',
				subject:false,
				color:'',
				icon:'',
				progress:'true',
				time:3,
				type:0,
			};
			/*移除其他*/
			/*$(".ui-toast").remove();*/
			toastid++;
			var config=$.extend({},defaults,opt);
			var html='';
			if(config.type==1)
			{
				toastid='loading'
			}
			html+='<div class="ui-toast" id="toast_'+toastid+'">';
			if(config.subject||config.title!='')
			{
				html+='<div class="ui-toast-header">';
				html+='<div class="ui-toast-title">'+config.title+'</div>';
				html+='<div class="ui-toast-close ui-rotate">×</div>';          
				html+='</div>';
			}
			var icon='';
			var icon_progress='';
			switch(config.icon)
			{
				case "success":
					icon='<span class="ui-icon-check-circle success"></span>';
					icon_progress=' ui-progress-success';
					break;
				case "error":
					icon='<span class="ui-icon-close-circle error"></span>';
					icon_progress=' ui-progress-error';
					break;
				case "warn":
					icon='<span class="ui-icon-warning-circle warn"></span>';
					icon_progress=' ui-progress-warn';
					break;
				case "reload":
					icon='<span class="ui-loading"></span>';
					icon_progress=' ui-progress-loading';
					break;
			}
			var icon_name=(config.icon)?'ui-toast-body-icon':'';
			html+='<div class="ui-toast-body '+icon_name+'">'+icon+config.text+'</div>';
			
			if(config.progress=='true'&&config.time>0)
			{
				html+='<div class="ui-toast-footer">';
				html+='<div class="ui-progress ui-progress-lt ui-progress-toast"><div class="ui-progress-bar'+icon_progress+'" style="width:100%" id="progress-bar-'+toastid+'"></div></div>';
				html+='</div>';
			}
			if(config.type==1)
			{
				html+='<div class="ui-toast-footer">';
				html+='<div class="ui-progress ui-progress-lt ui-progress-toast-loading"><div class="ui-progress-bar'+icon_progress+'" style="width:0%"></div></div>';
				html+='</div>';
			}
			html+='</div>';
			$html=$(html);
			if(config.align=='center')
			{
				$(".ui-toast").remove();
			}
			var warp='<div class="ui-toast-warp ui-toast-warp-'+config.align+'"></div>';
			$warp=$(warp);
			
			if($(".ui-toast-warp-"+config.align).length==0&&config.align!='center')
			{
				$("body").append($warp);
			}
			if(config.align!='center')
			{
				$(".ui-toast-warp-"+config.align).prepend($html);
			}
			if(config.color!='')
			{
				$html.addClass('ui-toast-'+config.color);
			}
			if(config.align=='center' || config.align=='top-center' || config.align=='bottom-center')
			{
				$("body").append($html);
				$html.css({"position":"fixed"});
			}
			$html.addClass("ui-toast-in");
			var total=$(".ui-toast").length;
			var x=$(window).width()/2 -($html.outerWidth()/2);
			var y=$(window).height()/2 -($html.outerHeight()/2);
			if(config.align=='center')
			{
				$html.css({"top":y,"left":x});
			}
			if(config.align=='top-center')
			{
				$html.css({"top":0,"left":x});
			}
			if(config.align=='bottom-center')
			{
				$html.css({"bottom":0,"left":x});
			}
			var $toast=$("#toast_"+toastid);
			if(config.time>0)
			{
				setTimeout(function(){$toast.slideUp(300,function(){$(this).remove()});},config.time*1000);
				if(config.progress=='true')
				{
					var step=100;
					function backprogress(id,num)
					{
						if(step>=0)
						{
							var p=100/num/10/2;
							$("#"+id).css({"width":step+"%"});
							step=step-p;
							setTimeout(function(){backprogress(id,num);},50); 
						}
					}
					backprogress("progress-bar-"+toastid,config.time);
				}
			}
			$toast.find(".ui-toast-close").click(function()
			{
				$toast.slideUp(300,function(){$(this).remove()});
			})
		},
		toastclose:function()
		{
			$(".ui-toast").remove();
		},
		dialog:function(opt)
		{
			var that=this;
			var defaults=
			{
				title:'',
				text:'',
				align:'center',
				time:0,
				ok:null,
				okval:sdcms.language()['ok'],
				oktheme:'ui-btn-blue',
				cancel:null,
				cancelval:sdcms.language()['cancel'],
				cancelshow:true,
				width:'',
				height:'',
				inputval:'',
				inputholder:'',
				maxlength:255,
				rows:6,
				tips:'',
				type:0,/*0：文字，1：单行文本框，2：多行文本框，3：框架，4：图片*/
				footer:true,
				mask:true,
				ismobile:0,
				payway:'',/*支付方式*/
				theme:'',
				am:null
			};
			/*关闭所有提示*/
			$.toastclose();
			
			dialogid++;
			var config=$.extend({},defaults,opt);
			$mask=$(".ui-dialog-mask");
			if(config.mask)
			{
				if($(".ui-dialog-mask").length==0)
				{
					$mask=$('<div class="ui-dialog-mask"></div>');
					$("body").append($mask);
					$mask.fadeIn(function(){$(this).css("display","block")});
				}
				else
				{
					$mask=$(".ui-dialog-mask");
				}
			}
			if(config.am==null || config.am=='')
			{
				config.am='ui-dialog-in';
			}
			
			if(config.payway!='')
			{
				config.payway=' ui-dialog-'+config.payway;
				config.footer=false;
			}
			
			if(config.theme!='')
			{
				config.theme=' ui-dialog-'+config.theme;
			}
			
			var html='';
			if(config.ismobile==0)
			{
				html+='<div class="ui-dialog'+config.theme+config.payway+'" id="dialog_'+dialogid+'">';
			}
			else
			{
				html+='<div class="ui-dialog-mobile ui-dialog'+config.theme+config.payway+'" id="dialog_'+dialogid+'">';
			}
			
			if(config.subject || config.title!='')
			{
				html+='<div class="ui-dialog-header">';
				html+='<div class="ui-dialog-title">'+config.title+'</div>';
				html+='<div class="ui-dialog-close ui-rotate">×</div>';          
				html+='</div>';
			}
			var $dialogbody='';
			var dialogpadding='';
			switch(config.type)
			{
				case 1:
					$dialogbody='<input type="text" class="ui-dialog-text ui-form-ip" placeholder="'+config.inputholder+'" maxlength="'+config.maxlength+'" value="'+config.inputval+'">';
					dialogpadding=' ui-dialog-body-input';
					if(config.tips!='')
					{
						$dialogbody+='<div class="ui-mt">'+config.tips+'</div>';
					}
					break;
				case 2:
					$dialogbody=''+config.text+'<textarea rows="'+config.rows+'" class="ui-dialog-text ui-form-ip" placeholder="'+config.inputholder+'">'+config.inputval+'</textarea>';
					dialogpadding=' ui-dialog-body-input';
					if(config.tips!='')
					{
						$dialogbody+='<div class="ui-mt">'+config.tips+'</div>';
					}
					break;
				case 3:
					$dialogbody='<iframe src="'+config.text+'" id="ui-dialog-iframe" frameborder="0" border="0" scrolling="auto" allowtransparency="false" marginwidth="0" marginheight="0"></iframe>';
					dialogpadding=' ui-dialog-body-iframe';
					break;
				default:
					$dialogbody=config.text;
					break;
			}
			html+='<div class="ui-dialog-body'+dialogpadding+'">'+$dialogbody+'</div>';
			if(config.footer)
			{
				if(config.ismobile==0)
				{
					html+='<div class="ui-dialog-footer"><button class="ui-btn '+config.oktheme+' ui-dialog-ok">'+config.okval+'</button>';
					if(config.cancelshow)
					{
						html+='<button class="ui-btn ui-dialog-cancel ui-ml">'+config.cancelval+'</button>';
					}
					html+='</div>';
				}
				else
				{
					html+='<div class="ui-dialog-footer-mobile">';
					if(config.cancelshow)
					{
						html+='<button class="ui-dialog-cancel">'+config.cancelval+'</button>';
					}
					html+='<button class="ui-dialog-ok">'+config.okval+'</button></div>';
				}
			}
			html+='</div>';
			$dialog=$(html);
			$("body").append($dialog);
	
			if(config.width!=null)
			{
				$dialog.css({"width":config.width});
			}
			if(config.height!=null)
			{
				if(config.type==3)
				{
					if(config.height.indexOf("%")>=0)
					{
						var h=config.height.replace("%","");
						config.height=$(window).height()*h/100;
					}
					$dialog.find("#ui-dialog-iframe").css({"height":config.height});
					$dialog.find(".ui-dialog-footer").css({"border-width":"0"});
				}
				else
				{
					$dialog.css({"height":config.height});
				}
			}
			var x=0;
			var y=0;
			switch(config.align)
			{
				case "top-left":
					$dialog.css({"top":"0","left":"0","position":"fixed"});
					break;
				case "top-right":
					$dialog.css({"top":"0","left":($(window).width()-$dialog.outerWidth()),"position":"fixed"});
					break;
				case "bottom-left":
					$dialog.css({"top":($(window).height()-$dialog.outerHeight()),"left":"0","position":"fixed"});
					break;
				case "bottom-right":
					$dialog.css({"top":($(window).height()-$dialog.outerHeight()),"left":($(window).width()-$dialog.outerWidth()),"position":"fixed"});
					break;
				default:
					x=($(window).width()-$dialog.outerWidth())/2;
					y=($(window).height()-$dialog.outerHeight())/2;
					$dialog.css({"top":y,"left":x,"position":"fixed"});
					break;
			}
			$dialog.addClass(config.am);
			
			/*拖拽开始*/
			$dialog.Udrag({handle:".ui-dialog-title"});
			/*拖拽结束*/
			
			that.close=function()
			{
				$dialog.removeClass(config.am).addClass("ui-dialog-out");
				if(config.mask)
				{
					$mask.fadeOut(300,function(){$(this).remove()});
				}
			};
			that.inputval=function()
			{
				return $dialog.find(".ui-dialog-text").val();
			};
			that.iframe=function()
			{
				return $dialog.find("iframe");
			};
			$dialog.find(".ui-dialog-close").click(function()
			{
				that.close();
			});
			$dialog.find(".ui-dialog-cancel").click(function()
			{
				if(typeof config.cancel=="function")
				{
					config.cancel(that);
				}
				else
				{
					that.close();
				}
			});
			$dialog.find(".ui-dialog-ok").click(function()
			{
				if(typeof config.ok=="function")
				{
					config.ok(that);
				}
			});
			if(config.time>0)
			{
				setTimeout(function(){that.close();},config.time*1000)
			};
		},
		dialogclose:function()
		{
			$mask=$('.ui-dialog-mask');
			$dialog=$('.ui-dialog');

			$dialog.fadeOut(function(){$(this).remove()});
			$mask.fadeOut(function(){$(this).remove()});
		},
		dialogbox:function(opt)
		{
			$.dialog(
			{
				title:opt.title,
				text:opt.text,
				align:(opt.align || 'center'),
				time:opt.time,
				ok:opt.ok,
				okval:opt.okval,
				oktheme:opt.oktheme,
				cancel:opt.cancel,
				cancelval:opt.cancelval,
				cancelshow:opt.cancelshow,
				width:opt.width,
				height:opt.height,
				inputval:opt.inputval,
				inputholder:opt.inputholder,
				maxlength:opt.maxlength,
				rows:opt.rows || 6,
				tips:opt.tips || '',
				type:(opt.type || 1),
				footer:opt.footer,
				mask:opt.mask,
				ismobile:opt.ismobile,
				am:opt.am || '',
			});
		},
		success:function(opt)
		{
			$.toast(
			{
				title:opt.title,
				text:opt.text,
				icon:'success',
				align:opt.align,
				color:opt.color,
				progress:opt.progress,
				time:opt.time || 3
			});
		},
		error:function(opt)
		{
			$.toast(
			{
				title:opt.title,
				text:opt.text,
				icon:'error',
				align:opt.align,
				color:opt.color,
				progress:opt.progress,
				time:opt.time || 3
			});
		},
		warn:function(opt)
		{
			$.toast(
			{
				title:opt.title,
				text:opt.text,
				icon:'warn',
				align:opt.align,
				color:opt.color,
				progress:opt.progress,
				time:opt.time || 3
			});
		},
		loading:function(opt)
		{
			$.toast(
			{
				title:opt.title,
				text:opt.text,
				icon:'reload',
				align:opt.align,
				color:opt.color,
				progress:opt.progress,
				time:0,
				type:1
			});
		},
		progress:function(opt)
		{
			if(opt=='close')
			{
				$("#toast_loading").slideUp(function(){$(this).remove()});
			}
			else
			{
				$(".ui-progress-toast-loading .ui-progress-bar").css({"width":opt})
			}
		},
	});
	
	/*表单验证*/
	$.fn.form=function(opt)
	{
		var defaults={
			type:1,
			hide:1,
			show:0,
			align:null,
			before:null,
			error:null,
			result:function(){},
		};
		
		var config=$.extend({},defaults,opt);

		if(config.type==2)
		{
			config.show=0;
		}
		var e=$(this);
		/*添加相关属性*/
		e.attr("data-type",config.type);
		e.attr("data-hide",config.hide);
		e.attr("data-show",config.show);
		e.attr("data-align",config.align);
		
		$(e).submit(function()
		{
			if(config.before&& typeof config.before=="function")
			{
				if(!config.before(e))
				{
					return false;
				}
			}
			var total=1;
			e.find(":input[data-rule]").each(function()
			{
				var result=$input($(this),config.type,config.hide,config.align);
				if(!result)
				{
					total=0;
					if(config.show==0)
					{
						$(this).first().focus().select();
						return false;
					}
				}
				else
				{
					total=total*1;
				}
			})
			if(total==1)
			{
				if(config.result&& typeof config.result=="function")
				{
					config.result(e);
				}
			}
			return false;
		}); 
    };
	$.fn.inputnumber=function(opt)
	{
		var defaults={
			minval:1,
			maxval:9999,
			step:1,
			value:1,
			align:'right',
			disabled:0,
			after:null
		};
		var config=$.extend({},defaults,opt);
		this.each(function()
		{
			var e=$(this);
			var $min=config.minval;
			var $max=config.maxval;
			var $step=config.step;
			var $align=config.align;
			var $disabled=config.disabled;
			var $after=config.after;
			if(e.attr("data-min")!=null)
			{
				$min=e.attr("data-min");
			}
			if(e.attr("data-max")!=null)
			{
				$max=e.attr("data-max");
			}
			if(e.attr("data-step")!=null)
			{
				$step=e.attr("data-step");
			}
			if(e.attr("data-align")!=null)
			{
				$align=e.attr("data-align");
			}
			if(e.attr("data-disabled")!=null)
			{
				$disabled=e.attr("data-disabled");
			}
			function changenum(d,e)
			{
				var value=Number($val)*10000;
				var _val;
				if(d=='-')
				{
					_val=(value-parseFloat($step)*10000)/10000;
				}
				else if(d=='+')
				{
					_val=(value+parseFloat($step)*10000)/10000;
				}
				else
				{
					_val=(d*10000)/10000;
				}
				if( _val<$min)
				{
					_val=$min;
				}
				if(_val>$max)
				{
					_val=$max;
				}
				$val=_val;
				if(parseFloat($val)<=parseFloat($min))
				{
					e.closest(".ui-inputnumber-wrap").find(".ui-inputnumber-min").addClass("ui-inputnumber-disabled");
				}
				else
				{
					e.closest(".ui-inputnumber-wrap").find(".ui-inputnumber-min").removeClass("ui-inputnumber-disabled");
				}
				if(parseFloat($val)>=parseFloat($max))
				{
					e.closest(".ui-inputnumber-wrap").find(".ui-inputnumber-max").addClass("ui-inputnumber-disabled");
				}
				else
				{
					e.closest(".ui-inputnumber-wrap").find(".ui-inputnumber-max").removeClass("ui-inputnumber-disabled");
				}
				e.val($val);
				e.closest(".ui-inputnumber-wrap").find(".ui-inputnumber-text").val($val);
				/*回调函数*/
				if($after && typeof $after=="function")
				{
					$after(e,$val);
				}
			}
			var $val=e.val();
			e.attr("readonly",true).css({"width":0,"border":0,"margin-left":"-2px"})
			e.wrap('<div class="ui-inputnumber-wrap ui-inputnumber-'+$align+'"></div>');
			if($align=='right')
			{
				e.closest(".ui-inputnumber-wrap").append('<input class="ui-inputnumber-text" value="'+$val+'" style="border:0;width:auto;padding:0;width:50px;background:none;line-height:1;"><span class="ui-inputnumber-min"><i class="ui-icon-line"></i></span><span class="ui-inputnumber-max"><i class="ui-icon-plus"></i></span>');
			}
			else
			{

				e.closest(".ui-inputnumber-wrap").append('<span class="ui-inputnumber-min"><i class="ui-icon-line"></i></span><input class="ui-inputnumber-text" value="'+$val+'" style="border:0;width:auto;padding:0;width:50px;background:none;line-height:1;"><span class="ui-inputnumber-max"><i class="ui-icon-plus"></i></span>');
			}
			/*默认文本为只读，不可以修改，除非配置：sdcms.inputnumber=true;
			if(sdcms.inputnumber==undefined)
			{
				e.closest(".ui-inputnumber-wrap").find(".ui-inputnumber-text").attr("readonly","readonly");
			}*/
			if(parseFloat($val)<=parseFloat($min))
			{
				e.closest(".ui-inputnumber-wrap").find(".ui-inputnumber-min").addClass("ui-inputnumber-disabled");
			}
			if(parseFloat($val)>=parseFloat($max))
			{
				e.closest(".ui-inputnumber-wrap").find(".ui-inputnumber-max").addClass("ui-inputnumber-disabled");
			}
			if($disabled==1)
			{
				e.closest(".ui-inputnumber-wrap").addClass("disabled");
			}
			else
			{
				e.closest(".ui-inputnumber-wrap").find(".ui-inputnumber-min").click(function()
				{
					if(!$(this).hasClass("ui-inputnumber-disabled"))
					{
						changenum('-',e);
					}
				})
				e.closest(".ui-inputnumber-wrap").find(".ui-inputnumber-max").click(function()
				{
					if(!$(this).hasClass("ui-inputnumber-disabled"))
					{
						changenum('+',e);
					}
				})
				e.closest(".ui-inputnumber-wrap").find(".ui-inputnumber-text").blur(function()
				{
					if(!$(this).hasClass("ui-inputnumber-disabled"))
					{
						changenum($(this).val(),e);
					}
				})
			}
		})
		return this;
	};
	$.fn.step=function(opt)
	{
		var e=this;
		var defaults={
			data:[],
			theme:'blue',
			align:'top',
			index:1,
			arrow:false,
			time:500,
		};
		var config=$.extend({},defaults,opt);
		var total=config.data.length;
		var percent=(config.index/total)*100+"%";
		var tpl='';
		var aligns='ui-step-'+((config.align=='top')?'':'bottom');
		tpl+='<div class="ui-step-wrap '+aligns+' ui-step-'+config.theme+'">';
		tpl+='	<div class="ui-step-bg"></div>';
		tpl+='	<div class="ui-step-progress"></div>';
		tpl+='	<div class="ui-step">';
		$.each(config.data,function(i,t)
		{
			tpl+='<div class="ui-step-item';
			if(i<=config.index-1)
			{
				tpl+=' active';
			}
			if(config.arrow)
			{
				if(i==config.index-1)
				{
					tpl+=' ui-step-arrow';
				}
			}
			tpl+='">';
			if(config.align=='top')
			{
				tpl+='<div class="ui-step-num">'+(i+1)+'</div>';
				tpl+='<div class="ui-step-title">'+(t)+'</div>';
			}
			else
			{
				tpl+='<div class="ui-step-title">'+(t)+'</div>';
				tpl+='<div class="ui-step-num">'+(i+1)+'</div>';
			}
			tpl+='</div>';
		})
		tpl+='	</div>';
		tpl+='</div>';
		e.html(tpl);
		e.find(".ui-step-progress").animate({"width":percent},config.time)
	};
	$.fn.backtime=function(opt)
	{
		var e=this;
		var defaults={'time':60};
		var config=$.extend({},defaults,opt);
		var oldtext=e['html']();
		var backgo=function(t0)
		{
			e['attr']("disabled",true);
			e['html']("<span class='ui-text-red ui-mr-sm'>"+t0+"</span>"+sdcms.language()['backtime']+"");
			t0=t0-1;
			if(t0>=0)
			{
				window.setTimeout(function(){backgo(t0)},1000);
			}
			else
			{
				e['attr']("disabled",false);
				e['html'](oldtext);
			}
		};
		backgo(config.time);
	};
	$.fn.endtime=function(fn)
	{
		var e=this;
		var num=0;
		$(e).each(function()
		{
			num++;
			var that=$(this);
			var time=that.attr("data-time") || 0;
			var endTime=new Date(parseInt(time)*1000);
			var nMS=endTime.getTime()-new Date().getTime();
			if(parseFloat(nMS)<=0)
			{
				that.html(sdcms.language()['over']);
				if(fn&& typeof fn=="function")
				{
					fn(that);
				}
			}
			else
			{
				setInterval(function()
				{
					$(e).each(function()
					{
						var that=$(this);
						var time=that.attr("data-time") || 0;
						var endTime=new Date(parseInt(time)*1000);
						var nMS=endTime.getTime()-new Date().getTime();
						var myD=Math.floor(nMS/(1000 * 60 * 60 * 24));
						var myH=Math.floor(nMS/(1000*60*60)) % 24;
						var myM=Math.floor(nMS/(1000*60)) % 60;
						var myS=Math.floor(nMS/1000) % 60;
						var str='';
						if(myD>0)
						{
							str="<i>"+myD+"</i>"+sdcms.language()['day']+"<i>"+myH+"</i>"+sdcms.language()['hour']+"<i>"+myM+"</i>"+sdcms.language()['minute']+"<i>"+myS+"</i>"+sdcms.language()['second']+"";
						}
						else if(myH> 0)
						{
							str="<i>"+myH+"</i>"+sdcms.language()['hour']+"<i>"+myM+"</i>"+sdcms.language()['minute']+"<i>"+myS+"</i>"+sdcms.language()['second']+"";
						}
						else if(myM>0)
						{
							str="<i>"+myM+"</i>"+sdcms.language()['minute']+"<i>"+myS+"</i>"+sdcms.language()['second']+"";
						}
						else
						{
							str="<i>"+myS+"</i>"+sdcms.language()['second']+"";
						}
						if(nMS>0)
						{
							that.html(str);
						}
						else
						{
							if(fn&& typeof fn=="function")
							{
								fn(that);
							}
						}
					});
				},1000);
			}
		})
    };
	$.fn.page=function(opt)
	{
		var defaults=
		{
			totalnum:0,
			totalpage:0,
			thispage:1,
			num:3,
			total:sdcms.language()['total'],
			pre:sdcms.language()['pre'],
			next:sdcms.language()['next'],
			home:sdcms.language()['home'],
			last:sdcms.language()['last'],
			clickpage:1,
			ismobile:0,
			callback:function(){}
		};
		var config=$.extend({},defaults,opt);
		this.each(function()
		{
			var e=$(this);
			var show=function(e,$page,ismobile)
			{
				var total=parseInt(config.totalnum);
				var totalpage=parseInt(config.totalpage);
				if($page>totalpage)
				{
					$page=1;
				}
				var thispage=$page;
				if(total==0 || totalpage==1)
				{
					e.html('');
					return;
				}
				if(ismobile==0)
				{
					var $i=parseInt(config.num);
					var $begin=parseInt(thispage);
					var $end=parseInt(thispage);
				
					while(1==1)
					{
						if($begin>1)
						{
							$begin=$begin-1;
							$i=$i-1;
						}
						if($i>1 && $end<totalpage)
						{
							$end=$end+1;
							$i=$i-1;
						}
						
						if(($begin<=1 && $end>=totalpage) || $i<=1)
						{
							break;
						}
					}
					var html='<ul>';
					html+='<li><a data-page="0">'+config.total+config.totalnum+'</a></li>';
					if(thispage>1)
					{
						html+='<li><a href="javascript:;" data-page="'+(parseInt(thispage)-1)+'">'+config.pre+'</a></li>';
					}
					
					if($begin!=1)
					{
						html+='<li><a href="javascript:;" data-page="1">1...</a></li>';
					}
					
					for($i=$begin;$i<=$end;$i++)
					{
						if($i==thispage)
						{
							html+='<li class="active"><a href="javascript:;" data-page="'+$i+'">'+thispage+'</a></li>';
						}
						else
						{
							html+='<li><a href="javascript:;" data-page="'+$i+'">'+$i+'</a></li>';
						}
					}
					if($end!=totalpage)
					{
						html+='<li><a href="javascript:;" data-page="'+totalpage+'">...'+totalpage+'</a></li>';
					}
					if(thispage<totalpage)
					{
						html+='<li><a href="javascript:;" data-page="'+(parseInt(thispage)+1)+'">'+config.next+'</a></li>';
					}
					html+='<li><a data-page="0">'+thispage+'/'+config.totalpage+'</a></li>';
					html+='</ul>';
					e.html(html);
				}
				else
				{
					var html='<ul>';
					if(thispage==1)
					{
						html+='<li><a data-page="0">'+config.home+'</a></li>';
					}
					else
					{
						html+='<li><a href="javascript:;" data-page="1">'+config.home+'</a></li>';
					}
					
					if(thispage>1)
					{
						html+='<li><a href="javascript:;" data-page="'+(parseInt(thispage)-1)+'">'+config.pre+'</a></li>';
					}
					else
					{
						html+='<li><a data-page="'+(parseInt(thispage)-1)+'">'+config.pre+'</a></li>';
					}
					if(thispage < totalpage)
					{
						html+='<li><a href="javascript:;" data-page="'+(parseInt(thispage)+1)+'">'+config.next+'</a></li>';
					}
					else
					{
						html+='<li><a data-page="0">'+config.next+'</a></li>';
					}
					if(thispage!=totalpage)
					{

						html+='<li><a href="javascript:;" data-page="'+totalpage+'">'+config.last+'</a></li>';
					}
					else
					{
						html+='<li data-page="0"><a data-page="'+totalpage+'">'+config.last+'</a></li>';
					}
					html+='<li><a data-page="0">'+thispage+'/'+config.totalpage+'</a></li>';
					e.html(html);
				}

			}
			/*初次渲染*/
			show(e,config.thispage,config.ismobile);
			
			/*点击事件*/
			e.find("li a").click(function(event)
			{
				var pnum=$(this).attr("data-page");
				if(pnum!=0)
				{
					config.clickpage=pnum;
					event.preventDefault();
					e.html('');
					/*重新渲染*/
					e.page(
					{
						'totalnum':config.totalnum,
						'totalpage':config.totalpage,
						'thispage':pnum,
						'num':config.num,
						'total':config.total,
						'pre':config.pre,
						'next':config.next,
						'home':config.home,
						'last':config.last,
						'clickpage':config.clickpage,
						'ismobile':config.ismobile,
						'callback':config.callback
					});
				}
			});
			
			/*回调事件*/
			if(typeof config.callback=="function")
			{
				config.callback(config);
			}
		});
		
	};
	
	
	$.fn.star=function()
	{
		
	};
	
	/*打开或关闭某个modal*/
	$.fn.modal=function(type)
	{
		var e=$(this);
		$modal(e,type);
	};
	/*打开或关闭某个offside*/
	$.fn.offside=function(type)
	{
		var e=$(this);
		$offside(e,type);
	};
	/*数字滚动*/
	$.fn.countTo=function(opt) 
	{
		opt=opt || {};
		return $(this).each(function () 
		{
			var defaults={from:0,to:0,speed:1000,refreshInterval:100,decimals:0};
			var settings=$.extend({},defaults,{from:$(this).data('from'),to:$(this).data('to'),speed:$(this).data('speed'),refreshInterval:$(this).data('refresh'),decimals:$(this).data('decimals')},opt);
			var loops=Math.ceil(settings.speed/settings.refreshInterval),
					increment=(settings.to-settings.from)/loops;
			var self=this,$self=$(this),loopCount=0,value=settings.from,data=$self.data('countTo') || {};
			$self.data('countTo',data);
			if(data.interval)
			{
				clearInterval(data.interval);
			}
			data.interval=setInterval(updateTimer,settings.refreshInterval);
			$self.html(value.toFixed(0));
			function updateTimer()
			{
				value+=increment;
				loopCount++;
				$self.html(value.toFixed(0));
				if(loopCount>=loops)
				{
					$self.removeData('countTo');
					clearInterval(data.interval);
					value=settings.to;
				}
			}
		});
	};
	
	/*拖拽开始*/
	$.fn.Udrag=function(opt)
	{
		var call={handle:null};
		var ufn=new Udragfn(this,opt);
		ufn.options=(opt)?$.extend(call,opt):call;
		var ele=ufn.$element;
		ufn.init(ele[0]);
	};

	var Udragfn=function(ele,opt)
	{
		this.$element=ele;
		this.options=opt;
	};
	Udragfn.prototype=
	{
		init:function(obj)
		{
			var self=this;
			self.options=self.options;
			self.handle=$(self.options.handle);
			self._start=false;
			self._move=false;
			self._end=false;
			self.disX=0;
			self.disY=0;
			self.handle.on("mousedown",function(ev)
			{
				self.start(ev,obj);
				obj.setCapture && obj.setCapture();
				return false;
			});
			$(document).on("mousemove",function(ev){
				self.move(ev,obj);
			});
			$(document).on("mouseup",function (ev){
				self.end(ev,obj);
			});
		},
		start:function(ev,obj)
		{
			var self=this;
			self.moved=obj;
			self._start=true;

			var oEvent=ev || event;
			self.disX=oEvent.clientX-obj.offsetLeft;
			self.disY=oEvent.clientY-obj.offsetTop;
		},
		move:function(ev,obj)
		{
			var self=this;
			if(self._start!=true || obj!=self.moved)
			{
				return false
			}
			self._move=true;
			var oEvent=ev || event;
			var l=oEvent.clientX-self.disX;
			var t=oEvent.clientY-self.disY;
			if(l<0)
			{
				l=0;
			}

			if(l>$(window).width()-$(obj).width())
			{
				l=$(window).width()-$(obj).width();
			}
			if(t<-50)
			{
				t=-50;
			}
			if(t>$(window).height()-$(obj).height()-50)
			{
				t=$(window).height()-$(obj).height()-50;
			}
			$(obj).css({left:l+'px',top:t+'px'})
		},
		end:function(ev,obj)
		{
			var self=this;
			if(self._start!=true)
			{
				return false
			}
			$(obj).find(self.options.handle).unbind("onmousemove");
			$(obj).find(self.options.handle).unbind("onmouseup");
			obj.releaseCapture && obj.releaseCapture();
			self._start=false;
		}
	};
	/*拖拽结束*/
	
	$(".ui-bar").animate({"right":0},"slow");
	
	$('.ui-rock').each(function(){$(this).countTo();});

})