const weatherApp = {

		onReady: function() {
			const zipCode = 99827;
			weatherApp.callForecast(zipCode);
			weatherApp.callAlerts(zipCode);
		},

		/*********
		 API CALLS
		 *********/

		callForecast: function(zip) {
			const wundergroundURL = "http://api.wunderground.com/api/ab855c8f628983eb/forecast10day/q/" + zip + ".json"
			$.ajax ({
				dataType: 'json',
				url: wundergroundURL
			}).done(function(data) {
				weatherApp.createForecastArrays(data.forecast.simpleforecast.forecastday);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ": " + errorThrown);
			});
		},

		callAlerts: function(zip) {
			const alertURL = "http://api.wunderground.com/api/ab855c8f628983eb/alerts/q/" + zip + ".json"
			$.ajax ({
				dataType: 'json',
				url: alertURL
			}).done(function(data) {
				if (data.alerts.length !== 0) {
					console.log("Now there's something to work with");
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ": " + errorThrown);
			});
		},

		/*********
		 DATA PROCESSING
		 *********/

		createForecastArrays: function(json) {
			const lengthOfForecast = 5;
			let forecastDays = [];
			let highLow = [];
			let weatherIcon = [];
			let conditions = [];
			for (i = 0; i < lengthOfForecast; i++) {
				forecastDays.push(json[i].date.weekday_short + " " + json[i].date.month + "/" + json[i].date.day);
				highLow.push(json[i].low.fahrenheit + "\xB0 | " + json[i].high.fahrenheit + "\xB0");
				weatherIcon.push([json[i].icon_url, json[i].icon]);
				conditions.push(json[i].conditions);
			}
			weatherApp.buildForecastTable(forecastDays, highLow, weatherIcon, conditions);
		},

		/*********
		 POPULATING DOM
		 *********/

		buildForecastTable: function(forecastDays, highLow, weatherIcon, conditions) {
			forecastDays.forEach(function(element) {
				$("#forecast__days").append("<th>" + element + "</th>");
			});
			highLow.forEach(function(element) {
				$("#forecast__temps").append("<td>" + element + "</td>");
			});
			weatherIcon.forEach(function(element) {
				$("#forecast__icon").append("<td><img src='" + element[0] + "' alt='" + element[1] + "'></td>")
			});
			conditions.forEach(function(element) {
				$("#forecast__conditions").append("<td>" + element + "</td>");
			})
		}
	}

	$(document).ready(weatherApp.onReady);
