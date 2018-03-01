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
			if (data.alerts.length !== 0) { //Remove ! to test formatting of alert
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
		let rain = [];
		let wind = [];
		for (i = 0; i < 5; i++) { // Days in forecast
			forecastDays.push(json[i].date.weekday_short + " " + json[i].date.month + "/" + json[i].date.day);
			highLow.push("<span class='low-temp'>" + json[i].low.fahrenheit + "\xB0</span> | <span class='high-temp'>" + json[i].high.fahrenheit + "\xB0</span>");
			weatherIcon.push([json[i].icon_url, json[i].icon]);
			conditions.push(json[i].conditions);
			rain.push(json[i].qpf_allday.in);
			wind.push(json[i].avewind.mph);
		}
		weatherApp.buildForecastTable(forecastDays, highLow, weatherIcon, conditions, rain, wind);
	},

	processAlerts: function(alertData) {
		let allAlerts = [];
		alertData.forEach(function(thisAlert) {
			allAlerts.push([thisAlert.description, thisAlert.message, thisAlert.expires]);
		});
		weatherApp.buildAlertBox(allAlerts);
	},

	/*********
	POPULATING DOM
	*********/

	buildForecastTable: function(forecastDays, highLow, weatherIcon, conditions, rain, wind) {
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
		});
		rain.forEach(function(element) {
			$("#forecast__rain").append("<td><i class='fa fa-tint raindrop-icon' aria-hidden='true'></i> " + element + "\" rain</td>");
		}),
		wind.forEach(function(element) {
			$("#forecast__wind").append("<td><i class='fa fa-leaf leaf-icon' aria-hidden='true'></i> " + element + " mph wind</td>");
		})
	},

	buildAlertBox: function(alerts) {
		//alerts = [["Heat Advisory", "this is a message about a crazy heat wave", "7:00 AM CDT on July 07, 2012"]];
		$(".advisory-box").toggle();
		alerts.forEach(function(element) {
			$("#advisory-messages").append("<p><strong>" + element[0] + "</strong>: " + element[1] + "<br><small>(Expires on " + element[2] + "</small>)</p>")
		})
	}
}

$(document).ready(weatherApp.onReady);
