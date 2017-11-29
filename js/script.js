const weatherApp = {

		onReady: function() {
			const zipCode = 97266;
			weatherApp.callForecast(zipCode);
		},

		callForecast: function(zip) {
			const wundergroundURL = "http://api.wunderground.com/api/ab855c8f628983eb/forecast10day/q/" + zip + ".json"
			$.ajax ({
				dataType: 'json',
				url: wundergroundURL
			}).done(function(data) {
				console.log(data);
				weatherApp.createDataArray(data.forecast.simpleforecast.forecastday);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ": " + errorThrown);
			});
		},

		createDataArray: function(json) {
			const lengthOfForecast = 5;
			console.log(json);
		}
	}

	$(document).ready(weatherApp.onReady);
