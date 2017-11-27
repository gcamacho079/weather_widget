const weatherAlert = {

		onReady: function() {
			weatherAlert.getWeather();
		},

		getWeather: function() {
      const zipCode = 97266;
			const apiURL = "http://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + "&units=imperial&APPID=5d9bc196ef530b2e4b0ed9abf5c104eb";
			$.ajax({
				dataType: 'json',
				url: apiURL
			}).done(function(data) {
				weatherAlert.constructDOM(data);

			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ": " + errorThrown);
			});

		},

		constructDOM: function(json) {
			const weatherIcon = "https://openweathermap.org/img/w/" + json.weather[0].icon + ".png";
			const cityName = json.name;
			const mainWeather = json.weather[0].main;
			const weatherDescription = json.weather[0].description;
			const temperature = json.main.temp;
			weatherAlert.populateDOM(weatherIcon, cityName, mainWeather, weatherDescription, temperature);
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

	$(document).ready(weatherAlert.onReady);
