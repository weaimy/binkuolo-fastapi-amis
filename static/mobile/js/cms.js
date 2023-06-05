/*验证码点击*/
$("#verify").click(function()
{
	var src=$(this).attr("src");
	src+=((src.indexOf("?")>0)?'&':'?')+'&rnd='+Math.round();
	$(this).attr("src",src);
	$("#code").val("");
});

/*搜索为空检查*/
function checksearch(that)
{
	if($.trim(that.keyword.value)=='')
	{
		sdcms.warn('请输入关键字');
		return false;
	}
}

$(function()
{
	/*赞一下、踩一下*/
	if($(".digs").length>0)
	{
		$(".digs").click(function()
		{
			var url=$(this).data("url");
			var token=$(this).data("token");
			var that=this;
			$.ajax(
			{
				   type:"post",
				   url:url,
				   data:"token="+token,
				   dataType:"json",
				   error:function(e){alert(e.responseText)},
				   success:function(d)
				   {
					   if(d.state=='success')
					   {
						   $(that).find("em").html(d.msg);
					   }
					   else
					   {
						   sdcms.error(d.msg)
					   }
				   }
			})
			
		});
	}
	
	/*付款方式*/
	if($("#orderpay").length>0)
	{
		$("#orderpay li").click(function()
		{
			var config=$(this).find("img").data("config");
			$("#payway").val(config);
			$(this).siblings().removeClass('active').end().addClass('active');
		})	
	}

})
