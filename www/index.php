<!doctype html>
<html lang="en">

<head>
  <title>Better Bomb Manual</title>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <!-- Mdl Lite -->
  <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
  <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

  <!-- Font Awesome 5 -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <script defer src="https://use.fontawesome.com/releases/v5.1.1/js/all.js"
    integrity="sha384-BtvRZcyfv4r0x/phJt9Y9HhnN5ur1Z+kZbKVgzVBAlQZX4jvAuImlIz+bG7TS00a" crossorigin="anonymous">
  </script>



  <!-- User Styles -->
  <link rel="stylesheet" href="./styles.css">
  <link rel="stylesheet" href="./switch.css">
</head>

<body>
  <div id="navbar">
    <!-- Colored mini FAB button -->
    <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--fab mdl-button--mini-fab">
      <i class="fas fa-bars"></i>
    </button>
    <div class="nav-content" style="display: none;">
      <div id="nav-bbm">Better Bomb Manual</div>
      <a href="#wires">Simple Wires</a>
      <a href="#button">Buttons</a>
      <a href="#symbols">Symbols/Keypad</a>
      <a href="#simon">Simon Says</a>
      <a href="#wof1">Who's on First Pt.1</a>
      <a href="#wof2">Who's on First P2.2</a>
      <a href="#memory">Memory</a>
      <a href="#morse">Morse Code</a>
      <a href="#compwires">Complicated Wires</a>
      <a href="#wireseq">Wire Sequences</a>
      <a href="#maze">Mazes</a>
      <a href="#password">Passwords</a>
      <a href="#knobs">Needy Knob</a>
      <a onclick="resetModules()">Reset Modules</a>
    </div>
  </div>
  <main>
    <div class="card bg-light mt-3" id="splash">
      <?php include("./modules/splash.php"); ?>
    </div>
    <div class="card bg-light mt-2" id="wires">
      <?php include("./modules/simpwires.php"); ?>
    </div>
    <div class="card bg-light mt-2" id="button">
      <?php include("./modules/buttons.php"); ?>
    </div>
    <div class="card bg-light mt-2" id="symbols">
      <?php include("./modules/symbols.php"); ?>
    </div>
    <div id="simon" class="card bg-light mt-2">
      <?php include("./modules/simon.php"); ?>
    </div>
    <div id="wof1" class="card bg-light mt-2">
      <?php include("./modules/wof1.php"); ?>
    </div>
    <div id="wof2" class="card bg-light mt-2">
      <?php include("./modules/wof2.php"); ?>
    </div>
    <div id="memory" class="card bg-light mt-2">
      <?php include("./modules/memory.php"); ?>
    </div>
    <div id="morse" class="card bg-light mt-2">
      <?php include("./modules/morse.php"); ?>
    </div>
    <div id="compwires" class="card bg-light mt-2">
      <?php include("./modules/compwires.php"); ?>
    </div>
    <div id="wireseq" class="card bg-light mt-2">
      <?php include("./modules/wireseq.php"); ?>
    </div>
    <div id="maze" class="card bg-light mt-2">
      <?php include("./modules/maze.php"); ?>
    </div>
    <div id="password" class="card bg-light mt-2">
      <?php include("./modules/passwords.php"); ?>
    </div>
    <div id="knobs" class="card bg-light mt-2">
      <?php include("./modules/knobs.php"); ?>
    </div>
    <div class="pb-5 pt-5"></div>
  </main>
  <footer>
    <div id="bombInfo" onchange="bombInfoChanged();">
      <div class="row">
        <div class="col-4">Battery Count:</div>
        <div class="col-4">Serial Number:</div>
        <div class="col-4">Ports and Lights:</div>
      </div>
      <div class="row">
        <div class="col-4"><input id="batteryCount" class="form-control" type="number" min="0" placeholder="Battery Count" onkeyup="bombInfoChanged();"></div>
        <div class="col-4">
          <label for="even">Serial Even:</label>
          <input type="checkbox" name="even" id="even">
          <br>
          <label for="vowel">Serial Vowel: </label>
          <input type="checkbox" name="vowel" id="vowel">
        </div>
        <div class="col-4">
          <label for="parallel">Parallel Port</label>
          <input type="checkbox" name="parallel" id="parallel">
          <br>
          <label for="car">CAR: </label>
          <input type="checkbox" name="car" id="car">
          <label for="frk"><span style="color: orange">|</span> FRK: </label>
          <input type="checkbox" name="frk" id="frk">
        </div>
      </div>
    </div>
  </footer>
  <!-- jQuery first, then Popper.js, then Bootstrap JS -->
  <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js'></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js">
  </script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js">
  </script>

  <!-- Optional JavaScript -->
  <script src="./scripts.js"></script>
</body>