<!DOCTYPE html>

<html>
<head>
  <title>Permit Map</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

</head>
<body>

  <div class="container">
    <div class="weather-box well">
	     <img src="" alt="" id="wb__icon">
       <strong>
         <p id="wb__temp"></p>
       </strong>
       <p>The weather in
         <span id="wb__city"></span> is <span id="wb__desc"></span>
       </p>
	</div>

  <table class="table">
    <tr>
      <th>Day</th>
      <th>Low/High</th>
      <th>Weather</th>
    </tr>
  </table>

  </div>


  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.12.0/d3.js"></script>
  <script>
  var today = '<?php echo date("Y-m-d H:i:s");?>';

  </script>
  <script src="js/script.js"></script>
</body>
</html>
