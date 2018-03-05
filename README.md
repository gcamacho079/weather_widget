# Bootstrap 5 Day Weather Forecast Table

This weather widget uses the Weather Underground and Google Geolocation APIs to build a responsive Bootstrap weather forecast table.

![Screenshot of 5 day weather forecast](/images/screenshot.png)

## Configuration

To configure with your own API keys, place a file called config.js inside the dist folder.

Then, include the following code:

```javascript
var config = {
  GOOGLE_KEY: /* Insert Geolocation API key string here */,
  WUNDERGROUND_KEY: /* Insert Weather Underground API key string here /*
}
```
