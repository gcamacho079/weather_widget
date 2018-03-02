"use strict";

var weatherApp = {

	init: function init() {
		weatherApp.findLocation();
	},

	apiCall: function apiCall(url, requestType) {
		return $.ajax({
			dataType: 'JSON',
			type: requestType,
			url: url
		});
	},

	findLocation: function findLocation() {
		var locationPromise = weatherApp.apiCall("https://www.googleapis.com/geolocation/v1/geolocate?key=" + config.GOOGLE_KEY, "POST");

		$.when(locationPromise).done(function (data) {
			weatherApp.getWeatherInfo(data.location.lat + "," + data.location.lng);
		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log("now we call the error function");
		});
	},

	getWeatherInfo: function getWeatherInfo(latlong) {
		var weatherPromise = weatherApp.apiCall(weatherEndpoint = "http://api.wunderground.com/api/" + config.WUNDERGROUND_KEY + "/forecast10day/q/" + latlong + ".json", "GET");
		var advisoryPromise = weatherApp.apiCall("http://api.wunderground.com/api/" + config.WUNDERGROUND_KEY + "/alerts/q/" + latlong + ".json", "GET");

		$.when(weatherPromise, advisoryPromise).done(function (forecast, advisories) {
			weatherApp.createForecastArrays(forecast[0].forecast.simpleforecast.forecastday);
			if (advisories[0].alerts.length !== 0) {
				weatherApp.processAlerts(advisories.alerts);
			}
		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log(textStatus + ": " + errorThrown);
		});
	},

	/*********
 DATA PROCESSING
 *********/

	createForecastArrays: function createForecastArrays(json) {
		var forecastDays = [];
		var highLow = [];
		var weatherIcon = [];
		var conditions = [];
		var rain = [];
		var wind = [];
		for (var i = 0; i < 5; i++) {
			// Days in forecast
			forecastDays.push(json[i].date.weekday_short + " " + json[i].date.month + "/" + json[i].date.day);
			highLow.push("<span class='low-temp'>" + json[i].low.fahrenheit + "\xB0</span> | <span class='high-temp'>" + json[i].high.fahrenheit + "\xB0</span>");
			weatherIcon.push([json[i].icon_url, json[i].icon]);
			conditions.push(json[i].conditions);
			rain.push(json[i].qpf_allday.in);
			wind.push(json[i].avewind.mph);
		}
		weatherApp.buildForecastTable(forecastDays, highLow, weatherIcon, conditions, rain, wind);
	},

	processAlerts: function processAlerts(alertData) {
		var allAlerts = [];
		alertData.forEach(function (thisAlert) {
			allAlerts.push([thisAlert.description, thisAlert.message, thisAlert.expires]);
		});
		weatherApp.buildAlertBox(allAlerts);
	},

	/*********
 POPULATING DOM
 *********/

	buildForecastTable: function buildForecastTable(forecastDays, highLow, weatherIcon, conditions, rain, wind) {
		forecastDays.forEach(function (element) {
			$("#forecast__days").append("<th>" + element + "</th>");
		});
		highLow.forEach(function (element) {
			$("#forecast__temps").append("<td>" + element + "</td>");
		});
		weatherIcon.forEach(function (element) {
			$("#forecast__icon").append("<td><img src='" + element[0] + "' alt='" + element[1] + "'></td>");
		});
		conditions.forEach(function (element) {
			$("#forecast__conditions").append("<td>" + element + "</td>");
		});
		rain.forEach(function (element) {
			$("#forecast__rain").append("<td><i class='fa fa-tint raindrop-icon' aria-hidden='true'></i> " + element + "\" rain</td>");
		}), wind.forEach(function (element) {
			$("#forecast__wind").append("<td><i class='fa fa-leaf leaf-icon' aria-hidden='true'></i> " + element + " mph wind</td>");
		});
	},

	buildAlertBox: function buildAlertBox(alerts) {
		//alerts = [["Heat Advisory", "this is a message about a crazy heat wave", "7:00 AM CDT on July 07, 2012"]];
		$(".advisory-box").toggle();
		alerts.forEach(function (element) {
			$("#advisory-messages").append("<p><strong>" + element[0] + "</strong>: " + element[1] + "<br><small>(Expires on " + element[2] + "</small>)</p>");
		});
	}
};

$(document).ready(weatherApp.init);