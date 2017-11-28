const weatherApp = {

		onReady: function() {
			const zipCode = 97266;
			weatherApp.callWeather(zipCode);
			weatherApp.callForecast(zipCode);
		},

		callWeather: function(zip) {
			const currentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&units=imperial&APPID=5d9bc196ef530b2e4b0ed9abf5c104eb";
			$.ajax({
				dataType: 'json',
				url: currentWeatherURL
			}).done(function(data) {
				weatherApp.gatherWeather(data); // Sends data to fxn for processing
				weatherApp.getTimeZone(data.coord.lat, data.coord.lon); // Runs thru Google API call to find out timezone
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ": " + errorThrown);
			});
		},

		gatherWeather: function(json) {
			const weatherIcon = "https://openweathermap.org/img/w/" + json.weather[0].icon + ".png";
			const cityName = json.name;
			const mainWeather = json.weather[0].main;
			const weatherDescription = json.weather[0].description;
			const temperature = json.main.temp;
			weatherApp.populateDOM(weatherIcon, cityName, mainWeather, weatherDescription, temperature);
		},

		callForecast: function(zip) {
			const fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast?zip=" + zip + "&units=imperial&APPID=5d9bc196ef530b2e4b0ed9abf5c104eb";
			$.ajax ({
				dataType: 'json',
				url: fiveDayURL
			}).done(function(data) {
				weatherApp.startingTomorrow(data.list);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ": " + errorThrown);
			});
		},

		startingTomorrow: function(forecast) {
			console.log("This works");
		},

		getTimeZone: function(x, y) {
			console.log("Get time");
			googleURL = "https://maps.googleapis.com/maps/api/timezone/json?location=" + x + "," + y  + "&timestamp=1331161200&key=AIzaSyDtazfalnTvCqfFtLfg5hquBhQRwyQhBys"
			$.ajax({
				dataType: 'json',
				url: googleURL
			}).done(function(data) {
				console.log(data);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ": " + errorThrown);
			});
		},

		populateDOM: function(icon, city, weather, description, temp) {
			$("#wb__city").text(city);
			$("#wb__desc").text(description);
			$("#wb__icon").attr("src", icon);
			$("#wb__temp").text(temp);
			//$(".weather-box").toggle();
		},

		createSVG: function() {
		}
	}

	$(document).ready(weatherApp.onReady);
