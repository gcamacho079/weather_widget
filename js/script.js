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
				weatherApp.createDataArrays(data.forecast.simpleforecast.forecastday);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ": " + errorThrown);
			});
		},

		createDataArrays: function(json) {
			const lengthOfForecast = 5;
			console.log(json);
			let forecastDays = [];
			let date = "";
			for (i = 0; i < lengthOfForecast; i++) {
				date = json[i].date.weekday_short + " " + json[i].date.month + "/" + json[i].date.day;
				forecastDays.push(date);
			}
			weatherApp.buildForecastTable(forecastDays);
			console.log(forecastDays);
		},

		buildForecastTable: function(tableHeader) {
			tableHeader.forEach(function(element) {
				$("#forecast__days").append("<th>" + element + "</th>");
			});
		}
	}

	$(document).ready(weatherApp.onReady);
