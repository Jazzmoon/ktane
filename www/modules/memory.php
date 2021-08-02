<div class="card-header memory-header">
    <h3>Memory</h3>
</div>
<div class="card-body">
    <div class="row">
        <div class="col-6 text-center">
            <h4>Stage 1</h4>
            <div>
              <p class="before1">. Press <strong>2nd Position</strong></p>
              <p class="before2">. Press <strong>2nd Position</strong></p>
              <p class="before3">. Press <strong>3rd Position</strong></p>
              <p class="before4">. Press <strong>4th Position</strong></p>
            </div>
        </div>
        <div class="col-6 text-center">
            <h4>Stage 2</h4>
            <div>
              <p class="before1">. Press Button <strong>Labeled 4</strong></p>
              <p class="before2">. Press Same <strong>Position as Stage 1</strong></p>
              <p class="before3">. Press <strong>1st Position</strong></p>
              <p class="before4">. Press Same <strong>Position as Stage 1</strong></p>
            </div>
        </div>
    </div>
    <hr />
    <div class="row">
        <div class="col-6 text-center">
            <h4>Stage 3</h4>
            <div>
              <p class="before1">.Press Same <strong>Label as Stage 2</strong> </p>
              <p class="before2">. Press Same <strong>Label as Stage 1</strong></p>
              <p class="before3">. Press  <strong>3rd Position</strong></p>
              <p class="before4">. Press Button <strong>Labeled 4</strong></p>
            </div>
        </div>
        <div class="col-6 text-center">
            <h4>Stage 4</h4>
            <div>
              <p class="before1">. Press Same <strong>Position as Stage 1</strong> </p>
              <p class="before2">. Press <strong>1st Position</strong></p>
              <p class="before3">. Press Same <strong>Position as Stage 2</strong></p>
              <p class="before4">. Press Same <strong>Position as Stage 2</strong></p>
            </div>
        </div>
    </div>
    <hr />
    <div class="row">
        <div class="col-6 text-center">
            <h4>Stage 5</h4>
            <div>
                <p class="before1">. Press Same <strong>Label as Stage 1</strong></p>
                <p class="before2">. Press Same <strong>Label as Stage 2</strong></p>
                <p class="before3">. Press Same <strong>Label as Stage 4</strong></p>
                <p class="before4">. Press Same <strong>Label as Stage 3</strong></p>
            </div>
        </div>
        <div class="col-6 text-center">
            <h4 class="float-left">Table</h4><h4 class="float-right">Change Labels: <input type="checkbox" onchange="switchLabelPos();" id="labelCheck"></h4>
            <table border="1" width="100%">
              <col width="32%">
              <col width="17%">
              <col width="17%">
              <col width="17%">
              <col width="17%">
              <thead>
                <th>Stage</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
              </thead>
              <tbody>
                <tr>
                  <th>Label</th>
                  <td><input type="number" class="form-control memoryInput text-center" min="1" max="4" step="1" onkeyup="checkInputNumber('label1');" id="label1" tabindex="1"></td>
                  <td><input type="number" class="form-control memoryInput text-center" min="1" max="4" step="1" onkeyup="checkInputNumber('label2');" id="label2" tabindex="3"></td>
                  <td><input type="number" class="form-control memoryInput text-center" min="1" max="4" step="1" onkeyup="checkInputNumber('label3');" id="label3" tabindex="5"></td>
                  <td><input type="number" class="form-control memoryInput text-center" min="1" max="4" step="1" onkeyup="checkInputNumber('label4');" id="label4" tabindex="7"></td>
                </tr>
                <tr>
                  <th>Position</th>
                  <td><input type="number" class="form-control memoryInput text-center" min="1" max="4" step="1" onkeyup="checkInputNumber('pos1');" id="pos1" tabindex="2"></td>
                  <td><input type="number" class="form-control memoryInput text-center" min="1" max="4" step="1" onkeyup="checkInputNumber('pos2');" id="pos2" tabindex="4"></td>
                  <td><input type="number" class="form-control memoryInput text-center" min="1" max="4" step="1" onkeyup="checkInputNumber('pos3');" id="pos3" tabindex="6"></td>
                  <td><input type="number" class="form-control memoryInput text-center" min="1" max="4" step="1" onkeyup="checkInputNumber('pos4);" id="pos4" tabindex="8"></td>
                </tr>
              </tbody>
            </table>
            <script>
              function checkInputNumber(inputName) {
                let thisInput = $(`#${inputName}`);
                if(thisInput.val() !== "") {
                  if(thisInput.val() > 4) {
                    thisInput.val("4");
                  } else if(thisInput.val() < 1) {
                    thisInput.val("1");
                  }
                }
              }
            </script>
        </div>
    </div>
</div>