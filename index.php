<!DOCTYPE html>

<html>
<head>
  <title>Permit Map</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

  <link rel="stylesheet" href="css/style.css">

</head>
<body>

  <div class="container forecast-container">
    <h3 class="forecast-container__heading">Weather Forecast for </h3>
    <div class="table-responsive">
      <table class="table" id="forecast-table">
        <tr id="forecast__days">
          <!--Insert Days from API Call-->
        </tr>
        <tr id="forecast__temps">
        </tr>
        <tr id="forecast__icon">
        </tr>
        <tr id="forecast__conditions">
        </tr>
        <tr id="forecast__rain">
        </tr>
        <tr id="forecast__wind">
        </tr>
      </table>

    </div>

    <div class="alert alert-danger advisory-box" role="alert">
      <h4>Current Weather Advisories</h4>
      <div id="advisory-messages">
      </div>
    </div>
  </div>


  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.12.0/d3.js"></script>
  <script src="js/script.js"></script>
</body>
</html>
