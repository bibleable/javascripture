$(".bookSelect a").bind("mousemove touchmove",function(e){e.preventDefault();alert("h");var t=parseInt($(this).data("chapters"),10),n=e.clientX-$(this).offset().left,r=$(this).width()/t,i=Math.ceil(n/r);if(isNaN(i))return!1;i>t&&(i=t);var s=$(this).attr("href").split("chapter="),o=s[0]+"chapter="+i;$(this).attr("href",o).find(".chapter").text(i)});$(".bookSelect a").bind("touchend",function(e){e.preventDefault();window.location.href=$(this).attr("href")});