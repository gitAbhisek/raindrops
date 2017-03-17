$(document).ready(function(){

	var i = 0;
	var image = $("img");
	var temp, temp_f;
	var isday;
	var condition;
	var city;
	var region;
	var localTime;
	var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	$("#frontCover").css("height", window.innerHeight);
	
	function dummy(){
		image.eq(3).fadeOut();
		image.eq(2).fadeOut();
		image.eq(1).fadeOut();
		setInterval(changeImage, 4000);
	}

	function changeImage(){
		image.eq((i+1)%4).fadeIn("slow");
		image.eq(i%4).fadeOut("slow");
		i++;
	}

	function display1(){
		var i = new Date(localTime);
		var child = "<div id='current'>" + 
						"<div id='city_temp'>" + 
							"<p class='change'>" + temp + " &degC</p>" +
							"<p>" + city + "</p>" +
							"<p id='region'>" + region + "</p>" +
							"<p>" + day[i.getDay()] + "</p>" +
						"</div>" +
						"<div id='condition'>" +
							"<img src='pngClouds/" + condition + " " + isday + ".png'>" +
							"<p>" + condition + "</p>" +
						"</div>" + 
						"<div id='extra'>" + 
							"<div class='info'>" + 
								"<p>" + humidity + " %</p>" +
								"<p>Humidity</p>" +
							"</div>" +
							"<div class='info'>" + 
								"<p>" + precipitation + " mm</p>" + 
								"<p>Precipitation</p>" +
							"</div>" + 
							"<div class='info'>" +
								"<p>" + wind + " Kmph</p>" +
								"<p>Wind</p>" +
							"</div>" +
						"</div>" +
					"</div>";
		$("#body").append(child);
	}

	function display2(array){
		$("#body").append("<p id='label'>FORECAST</p><div id='separator'></div><div id='forecast'></div>");
		for(var i=1; i<array.length; i++){
			var currentDay = new Date(array[i].date);
			var child = "<div class='days'>" + 
							"<div class='forVerticalAlignment fordays'>" + 
								day[currentDay.getDay()] +
							"</div>" +
							"<div class='forVerticalAlignment change'>" + 
								array[i].day.avgtemp_c +
							" &degC</div>" +
							"<div class='forVerticalAlignment'>" + 
								array[i].day.maxwind_kph +
							" Kmph</div>" +
							"<div class='forVerticalAlignment'>" + 
								array[i].day.totalprecip_mm +
							" mm</div>" +
							"<div>" + 
								"<img class='foreImage' src='pngClouds/" + array[i].day.condition.text + " 1" + ".png'>" +
							"</div>" +
							"<div class='foreCondition forVerticalAlignment'>" +
								array[i].day.condition.text +
							"</div>" +
						"</div>";
			$("#forecast").append(child);
		}
		printWeather();
	}

	function loadWeather(){

		var apixu = "https://api.apixu.com/v1/current.json?key=%20b74b269fc49b4ccf9b8195510172101&q=";
		var forecast = "http://api.apixu.com/v1/forecast.json?key=%20b74b269fc49b4ccf9b8195510172101&q=";
		$("#result").html("Searching, Please Wait...").slideDown();
		city = $("input").eq(0).val();
		apixu += city;
		forecast += city + '&days=8';
		$('#body').empty();
		$('#body').css('left', '120%');
		$.get(apixu, function(r){
			if(!r.error){
				temp = r.current.temp_c;
				temp_f = r.current.temp_f; 
				condition = r.current.condition.text;
				isday = r.current.is_day;
				region = r.location.region;
				wind = r.current.wind_kph;
				humidity = r.current.humidity;
				precipitation = r.current.precip_mm;
				localTime = r.location.localtime.substr(0, 10);
				display1();
				$.get(forecast, function(r){
					display2(r.forecast.forecastday);
				})
			}
			else{
				$("#result").html("City Name Unknown !!!<br>Search With Different Keyword");
			}
		});
		return false;
	}

	function printWeather(){
		$("#search p").slideUp();
		$("#result").slideUp();
		$("#search").animate({
			marginTop: '0%'
		}, 500);

		$("#body").css("display", "block").animate({
			left: '0%'
		}, 1000);
	}

	function formSubmit(){
		loadWeather();
		return false;
	}

	setTimeout(dummy, 3000);
	$("form").on("submit", formSubmit);

	$("button").eq(0).click(function(){
		$(".change").html(temp + ' &degC');
		$("button").eq(1).removeClass("newClass");
		$(this).addClass("newClass");
	});

	$("button").eq(1).click(function(){
		$(".change").html(temp_f + ' &degF');
		$("button").eq(0).removeClass("newClass");
		$(this).addClass("newClass");
	});

});