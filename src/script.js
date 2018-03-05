const weatherModel = {

	init: function() {
		weatherModel.findLocation();
	},

	apiCall: (url, requestType) => {
		return $.ajax({
			dataType: 'JSON',
			type: requestType,
			url: url
		});
	},

	findLocation: () => {
		var locationPromise = weatherModel.apiCall(
			"https://www.googleapis.com/geolocation/v1/geolocate?key=" + config.GOOGLE_KEY,
			"POST"
		);

		$.when(locationPromise).done(function(data) {
			weatherModel.getWeatherInfo(data.location.lat + "," + data.location.lng);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log("now we call the error function");
		});
	},

 	getWeatherInfo: (latlong) => {
		var weatherPromise = weatherModel.apiCall(
			"http://api.wunderground.com/api/" + config.WUNDERGROUND_KEY + "/forecast10day/q/" + latlong + ".json",
			"GET"
		);
		var advisoryPromise = weatherModel.apiCall(
			"http://api.wunderground.com/api/" + config.WUNDERGROUND_KEY + "/alerts/q/" + latlong + ".json",
			"GET"
		);

		$.when(
			weatherPromise,
			advisoryPromise
		).done(function(forecast, advisories) {
			weatherController.createForecastArrays(forecast[0].forecast.simpleforecast.forecastday);
			if (advisories[0].alerts.length !== 0) {
				weatherController.processAlerts(advisories.alerts);
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus + ": " + errorThrown);
		});
	}
}

/*****
	Controller/Data Processing **************************************************/

const weatherController = {
	createForecastArrays: function(json) {
		const numberOfDays = 5;
		let forecastDays = [];
		let highLow = [];
		let weatherIcon = [];
		let conditions = [];
		let rain = [];
		let wind = [];
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

	processAlerts: function(alertData) {
		let allAlerts = [];
		alertData.forEach(function(thisAlert) {
			allAlerts.push([thisAlert.description, thisAlert.message, thisAlert.expires]);
		});
		weatherView.buildAlertBox(allAlerts);
	}
}

/*****
	Forecast View ***************************************************************/

const weatherView = {
	buildForecastTable: function(forecastDays, highLow, weatherIcon, conditions, rain, wind) {
		forecastDays.forEach(function(element, index) {
			$("#forecast__days").append("<th>" + element + "</th>");
			$("#forecast__temps").append("<td>" + highLow[index] + "</td>");
			$("#forecast__icon").append("<td><img src='" + weatherIcon[index][0] + "' alt='" + element[1] + "'></td>");
			$("#forecast__conditions").append("<td>" + conditions[index] + "</td>");
			$("#forecast__rain").append("<td><i class='fa fa-tint raindrop-icon' aria-hidden='true'></i> " + rain[index] + "\" rain</td>");
			$("#forecast__wind").append("<td><i class='fa fa-leaf leaf-icon' aria-hidden='true'></i> " + wind[index] + " mph wind</td>");
		});
	},

	buildAlertBox: function(alerts) {
		$(".advisory-box").toggle();
		alerts.forEach(function(element) {
			$("#advisory-messages").append("<p><strong>" + element[0] + "</strong>: " + element[1] + "<br><small>(Expires on " + element[2] + "</small>)</p>")
		})
	},

	showErrorMessage: function(typeOfError, message) {

	}
}

$(document).ready(weatherModel.init);
