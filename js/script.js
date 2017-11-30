const weatherApp = {

	onReady: function() {
		weatherApp.findLocation();
	},

	/*********
	API CALLS
	*********/

	findLocation: function() {
		$.ajax ({
			dataType: 'json',
			type: 'POST',
			url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBQOajYnXKHb3V49oeaD2o4oeRiWuXV0uc"
		}).done(function(data) {
			weatherApp.getWeatherInfo(data.location.lat + "," + data.location.lng);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus + ": " + errorThrown);
		});
	},

 	getWeatherInfo: function(latlong) {
		// Wunderground Forecast
		$.ajax ({
			dataType: 'json',
			url: "http://api.wunderground.com/api/ab855c8f628983eb/forecast10day/q/" + latlong + ".json"
		}).done(function(data) {
			weatherApp.createForecastArrays(data.forecast.simpleforecast.forecastday);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus + ": " + errorThrown);
		});

		// Wunderground Advisories
		$.ajax ({
			dataType: 'json',
			url: "http://api.wunderground.com/api/ab855c8f628983eb/alerts/q/" + latlong + ".json"
		}).done(function(data) {
			console.log(data);
			if (data.alerts.length == 0) { //Remove ! to test formatting of alert
				weatherApp.processAlerts(data.alerts);
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus + ": " + errorThrown);
		});
	},

	/*********
	DATA PROCESSING
	*********/

	createForecastArrays: function(json) {
		let forecastDays = [];
		let highLow = [];
		let weatherIcon = [];
		let conditions = [];
		for (i = 0; i < 5; i++) { // Days in forecast
			forecastDays.push(json[i].date.weekday_short + " " + json[i].date.month + "/" + json[i].date.day);
			highLow.push(json[i].low.fahrenheit + "\xB0 | " + json[i].high.fahrenheit + "\xB0");
			weatherIcon.push([json[i].icon_url, json[i].icon]);
			conditions.push(json[i].conditions);
		}
		weatherApp.buildForecastTable(forecastDays, highLow, weatherIcon, conditions);
	},

	processAlerts: function(alertData) {
		console.log(alertData);
		let allAlerts = [];
		alertData.forEach(function(thisAlert) {
			allAlerts.push([thisAlert.description, thisAlert.message, thisAlert.expires]);
		});
		weatherApp.buildAlertBox(allAlerts);
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
	},

	buildAlertBox: function(alerts) {
		alerts = [["Heat Advisory", "this is a message about a crazy heat wave", "7:00 AM CDT on July 07, 2012"]];
		$(".advisory-box").toggle();
		alerts.forEach(function(element) {
			$("#advisory-messages").append("<p><strong>" + element[0] + "</strong>: " + element[1] + "<br><small>(Expires on " + element[2] + "</small>)</p>")
		})
	}
}

$(document).ready(weatherApp.onReady);
