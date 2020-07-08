$(".tab_content").hide();  
	$(".nav li:first").addClass("active").show(); 
	$(".tab_content:first").show();   
	$(".nav li").click(function() {  
		$li = $('ul>li');
		$li.bind('click',function(){
		$this=$(this);
		$this.addClass('active');
		$this.siblings().removeClass('active');
		});
			$(".nav li").removeClass("active");  
			$(this).addClass("active"); 
			$(".tab_content").hide();
			var activeTab = $(this).find("a").attr("href");   
			$(activeTab).fadeIn();  
			return false;  
	});  
