<div class="card-header maze-header">
    <h3>Mazes</h3>
</div>
<div class="card-body">
    <div class="row">
        <div class="col-3 text-center">
            Navigate to the player <i class="far fa-square"></i> to the <i class="fas fa-caret-up text-danger fa-2x"></i>. Avoidong all white walls.

            <div class="form-group">
              <label for="coord">Circle Co-Ordinate</label>
              <input type="text" class="form-control" name="coord" id="coord" aria-describedby="coord-help" placeholder="A4" pattern="[A-Fa-f]{1}[1-6]{1}" maxlength="2" onkeyup="checkCoord();">
              <small id="coord-help" class="form-text text-muted">Use This to Search for a Maze.</small>
            </div>
        </div>
        <div class="col-9 text-center">
            <table class="table table-borderless">
                <tr>
                    <td><img src="./images/a1a4.png" class="mazeImage" alt="A1A4"></td>
                    <td><img src="./images/c4d1.png" class="mazeImage" alt="C4D1"></td>
                    <td><img src="./images/c5e1.png" class="mazeImage" alt="C5E1"></td>
                </tr>
                <tr>
                    <td><img src="./images/a5c2.png" class="mazeImage" alt="A5C2"></td>
                    <td><img src="./images/b4e2.png" class="mazeImage" alt="B4E2"></td>
                    <td><img src="./images/b1b6.png" class="mazeImage" alt="B1B6"></td>
                </tr>
                <tr>
                    <td><img src="./images/a2f3.png" class="mazeImage" alt="A2F3"></td>
                    <td><img src="./images/d6e3.png" class="mazeImage" alt="D6E3"></td>
                    <td><img src="./images/d4f4.png" class="mazeImage" alt="D4F4"></td>
                </tr>
            </table>
        </div>
    </div>
</div>