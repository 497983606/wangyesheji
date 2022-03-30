//centerBox 
$(document).ready(function(){
centerHeight()
	function centerHeight(){
		windowHeight = $(window).height();
		centerBoxHeight = $('#rdgCenter').height();
		$('#rdgCenter').css('margin-top',(windowHeight-centerBoxHeight)/2+'px')
		centerBoxHeights = $('#im').height();
		$('#im').css('top',(windowHeight-centerBoxHeights)/2+'px')
                               }	
	$(window).resize(function(){centerHeight()});
        
	});
//boxResize

	var layout1 = $('#layout_01,#layout_02,#layout_03,#centerBox,.scene1_layout_box,#endBox,#layout_04,#layout_05,#layout_06,.me1-bg,#me1pic-bg,#me2pic-bg,.me1msg');
		function windWH(){
			var windowHeight = $(window).height();
			    windowWidth = $(window).width();
			layout1.css('height',windowHeight+'px');
			$('.maskNav').css('height',windowHeight-56+'px')
			if(windowHeight<304){$('.me1msg').show()}else{$('.me1msg').hide()};
			if(windowHeight<550||windowWidth/windowHeight<1){$('#mask').show();$('#mask').find('a').hide();}else{$('#mask').hide()};
			}
			
		windWH();
		$(window).resize(function(){windWH()});
	//mask close
	$('#close').click(function(){$('#mask').hide()});

//nav
$(function(){
	var i = 0;
	$('#im,#nav_bnt,#mobBnt').click(function(){	
			i++;	
		if(i%2){
			$(this).css('background-position','bottom center');
			$('#mask_nav').fadeIn(200);
			$('#layout_01,#layout_02,#layout_03,#layout_04,#layout_05').css('animation-play-state','paused');
			}else{
				$(this).css('background-position','top center');
				$('#mask_nav').fadeOut(200);
				$('#layout_01,#layout_02,#layout_03,#layout_04,#layout_05').css('animation-play-state','running');
				}
		});
	$('#cutOne,#mobBnt').click(function(){
		$('#fallPageOne').fadeOut(1000);
		$('#fallPageTwo').fadeIn(3000);
		});
//waves
      Waves.displayEffect();
	});
$(function(){
		var i = 0;
		$('#mobile').click(function()
		{	i++
			if(i%2){
			$('.maskNav').slideDown(300,function(){$('.list').hide(0)})
			$(this).text('CLOSE');
			$('html').css('overflow','hidden');
			
			}else{
				$('.maskNav').slideUp(300)
				$(this).text('MENU');
				$('html').css('overflow-y','scroll');
				$('.list').show(0);
				}
		});
		
	});
