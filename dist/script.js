"use strict";

var weatherModel = {

	init: function init() {
		weatherModel.findLocation();
	},

	apiCall: function apiCall(url, requestType) {
		return $.ajax({
			dataType: 'JSON',
			type: requestType,
			url: url
		});
	},

	findLocation: function findLocation() {
		var locationPromise = weatherModel.apiCall("https://www.googleapis.com/geolocation/v1/geolocate?key=" + config.GOOGLE_KEY, "POST");

		$.when(locationPromise).done(function (data) {
			weatherModel.getWeatherInfo(data.location.lat + "," + data.location.lng);
		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log(textStatus + ": " + errorThrown);
			weatherController.handleError("googleLocation", "Sorry, there was an error finding your location. Please contact a site administrator.");
		});
	},

	getWeatherInfo: function getWeatherInfo(latlong) {
		var weatherPromise = weatherModel.apiCall("http://api.wunderground.com/api/" + config.WUNDERGROUND_KEY + "/forecast10day/q/" + latlong + ".json", "GET");
		var advisoryPromise = weatherModel.apiCall("http://api.wunderground.com/api/" + config.WUNDERGROUND_KEY + "/alerts/q/" + latlong + ".json", "GET");

		$.when(weatherPromise, advisoryPromise).done(function (forecast, advisories) {
			weatherController.createForecastArrays(forecast[0].forecast.simpleforecast.forecastday);
			if (advisories[0].alerts.length !== 0) {
				weatherController.processAlerts(advisories.alerts);
			}
		}).fail(function (jqXHR, textStatus, errorThrown) {
			console.log(textStatus + ": " + errorThrown);
			weatherController.handleError("weather", "Sorry, there was an error obtaining your forecast. Please contact a site administrator.");
		});
	}

	/*****
 	Controller/Data Processing **************************************************/

};var weatherController = {
	createForecastArrays: function createForecastArrays(json) {
		var numberOfDays = 5;
		var forecastDays = [];
		var highLow = [];
		var weatherIcon = [];
		var conditions = [];
		var rain = [];
		var wind = [];
		for (var i = 0; i < numberOfDays; i++) {
			forecastDays.push(json[i].date.weekday_short + " " + json[i].date.month + "/" + json[i].date.day);
			highLow.push("<span class='low-temp'>" + json[i].low.fahrenheit + "\xB0</span> | <span class='high-temp'>" + json[i].high.fahrenheit + "\xB0</span>");
			weatherIcon.push([json[i].icon_url, json[i].icon]);
			conditions.push(json[i].conditions);
			rain.push(json[i].qpf_allday.in);
			wind.push(json[i].avewind.mph);
		}
		weatherView.buildForecastTable(forecastDays, highLow, weatherIcon, conditions, rain, wind);
	},

	processAlerts: function processAlerts(alertData) {
		var allAlerts = [];
		alertData.forEach(function (thisAlert) {
			allAlerts.push([thisAlert.description, thisAlert.message, thisAlert.expires]);
		});
		weatherView.buildAlertBox(allAlerts);
	},

	handleError: function handleError(errorType, errorMessage) {
		weatherView.showErrorMessage(errorType, errorMessage);
	}

	/*****
 	Forecast View ***************************************************************/

};var weatherView = {
	buildForecastTable: function buildForecastTable(forecastDays, highLow, weatherIcon, conditions, rain, wind) {
		$(".loader-div").hide();

		forecastDays.forEach(function (element, index) {
			$("#forecast__days").append("<th>" + element + "</th>");
			$("#forecast__temps").append("<td>" + highLow[index] + "</td>");
			$("#forecast__icon").append("<td><img src='" + weatherIcon[index][0] + "' alt='" + element[1] + "'></td>");
			$("#forecast__conditions").append("<td>" + conditions[index] + "</td>");
			$("#forecast__rain").append("<td><i class='fa fa-tint raindrop-icon' aria-hidden='true'></i> " + rain[index] + "\" rain</td>");
			$("#forecast__wind").append("<td><i class='fa fa-leaf leaf-icon' aria-hidden='true'></i> " + wind[index] + " mph wind</td>");
		});
	},

	buildAlertBox: function buildAlertBox(alerts) {
		$(".forecast-container").append("<div class='alert alert-danger advisory-box' role='alert'> <h4>Current Weather Advisories</h4> <div id='advisory-messages'> </div> </div>");
		alerts.forEach(function (element) {
			$("#advisory-messages").append("<p><strong>" + element[0] + "</strong>: " + element[1] + "<br><small>(Expires on " + element[2] + "</small>)</p>");
		});
	},

	showErrorMessage: function showErrorMessage(typeOfError, message) {
		$(".loader-div").hide();
		$("#forecast-table").hide();
		$(".forecast-container").append("<p>" + message + "</p>");
	}
};

$(document).ready(weatherModel.init);