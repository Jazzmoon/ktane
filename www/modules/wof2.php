<div class="card-header wof2-header">
        <h3>Who's On First - Page 2</h3>
      </div>
      <div class="card-body">
        <input class="form-control mb-1" type="text" onkeyup="lookInTable()" id="wofSearch" placeholder="Search Term">
        <table id="wof2Table" class="table table-striped table-sm">
          <tbody>
            <tr>
              <th scope="row">BLANK</th>
              <td>WAIT, RIGHT, OKAY, MIDDLE, BLANK</td>
            </tr>
            <tr>
              <th scope="row">DONE</th>
              <td>SURE, UH HUH, NEXT, WHAT?, YOUR, UR, YOU'RE, HOLD, LIKE, YOU, U, YOU ARE, UH UH, DONE</td>
            </tr>
            <tr>
              <th scope="row">FIRST</th>
              <td>LEFT, OKAY, YES, MIDDLE, NO, RIGHT, NOTHING, UHHH, WAIT, READY, BLANK, WHAT, PRESS, FIRST</td>
            </tr>
            <tr>
              <th scope="row">HOLD</th>
              <td>YOU ARE, U, DONE, UH UH, YOU, UR, SURE, WHAT?, YOU'RE, NEXT, HOLD</td>
            </tr>
            <tr>
              <th scope="row">LEFT</th>
              <td>RIGHT, LEFT</td>
            </tr>
            <tr>
              <th scope="row">LIKE</th>
              <td>YOU'RE, NEXT, U, UR, HOLD, DONE, UH UH, WHAT?, UH HUH, YOU, LIKE</td>
            </tr>
            <tr>
              <th scope="row">MIDDLE</th>
              <td>BLANK, READY, OKAY, WHAT, NOTHING, PRESS, NO, WAIT, LEFT, MIDDLE</td>
            </tr>
            <tr>
              <th scope="row">NEXT</th>
              <td>WHAT?, UH HUH, UH UH, YOUR, HOLD, SURE, NEXT</td>
            </tr>
            <tr>
              <th scope="row">NO</th>
              <td>BLANK, UHHH, WAIT, FIRST, WHAT, READY, RIGHT, YES, NOTHING, LEFT, PRESS, OKAY, NO</td>
            </tr>
            <tr>
              <th scope="row">NOTHING</th>
              <td>UHHH, RIGHT, OKAY, MIDDLE, YES, BLANK, NO, PRESS, LEFT, WHAT, WAIT, FIRST, NOTHING</td>
            </tr>
            <tr>
              <th scope="row">OKAY</th>
              <td>MIDDLE, NO, FIRST, YES, UHHH, NOTHING, WAIT, OKAY</td>
            </tr>
            <tr>
              <th scope="row">PRESS</th>
              <td>RIGHT, MIDDLE, YES, READY, PRESS</td>
            </tr>
            <tr>
              <th scope="row">READY</th>
              <td>YES, OKAY, WHAT, MIDDLE, LEFT, PRESS, RIGHT, BLANK, READY</td>
            </tr>
            <tr>
              <th scope="row">RIGHT</th>
              <td>YES, NOTHING, READY, PRESS, NO, WAIT, WHAT, RIGHT</td>
            </tr>
            <tr>
              <th scope="row">SURE</th>
              <td>YOU ARE, DONE, LIKE, YOU'RE, YOU, HOLD, UH HUH, UR, SURE</td>
            </tr>
            <tr>
              <th scope="row">U</th>
              <td>UH HUH, SURE, NEXT, WHAT?, YOU'RE, UR, UH UH, DONE, U</td>
            </tr>
            <tr>
              <th scope="row">UHHH</th>
              <td>READY, NOTHING, LEFT, WHAT, OKAY, YES, RIGHT, NO, PRESS, BLANK, UHHH</td>
            </tr>
            <tr>
              <th scope="row">UH HUH</th>
              <td>UH HUH</td>
            </tr>
            <tr>
              <th scope="row">UH UH</th>
              <td>UR, U, YOU ARE, YOU'RE, NEXT, UH UH</td>
            </tr>
            <tr>
              <th scope="row">UR</th>
              <td>DONE, U, UR</td>
            </tr>
            <tr>
              <th scope="row">WAIT</th>
              <td>UHHH, NO, BLANK, OKAY, YES, LEFT, FIRST, PRESS, WHAT, WAIT</td>
            </tr>
            <tr>
              <th scope="row">WHAT</th>
              <td>UHHH, WHAT</td>
            </tr>
            <tr>
              <th scope="row">WHAT?</th>
              <td>YOU, HOLD, YOU'RE, YOUR, U, DONE, UH UH, LIKE, YOU ARE, UH HUH, UR, NEXT, WHAT?</td>
            </tr>
            <tr>
              <th scope="row">YES</th>
              <td>OKAY, RIGHT, UHHH, MIDDLE, FIRST, WHAT, PRESS, READY, NOTHING, YES</td>
            </tr>
            <tr>
              <th scope="row">YOU</th>
              <td>SURE, YOU ARE, YOUR, YOU'RE, NEXT, UH HUH, UR, HOLD, WHAT?, YOU</td>
            </tr>
            <tr>
              <th scope="row">YOU'RE</th>
              <td>YOU, YOU'RE</td>
            </tr>
            <tr>
              <th scope="row">YOU ARE</th>
              <td>YOUR, NEXT, LIKE, UH HUH, WHAT?, DONE, UH UH, HOLD, YOU, U, YOU'RE, SURE, UR, YOU ARE</td>
            </tr>
            <tr>
              <th scope="row">YOUR</th>
              <td>UH UH, YOU ARE, UH HUH, YOUR</td>
            </tr>
          </tbody>
        </table>
      </div>
      <script>
        function lookInTable() {
          if (toggleAssistVal == true) {
          let searchTerm = $("#wofSearch").val();
          $("#wof2Table").children().first().children().each(function () {
            let rowName = $(this).children().first().text();
            if(searchTerm == "") {
              $(this).removeClass("hidden")
            } else {
            if (rowName.toLowerCase().includes(searchTerm.toLowerCase()) || rowName.replace("'", "").replace(" ", "").toLowerCase().includes(searchTerm.toLowerCase())) {
              $(this).removeClass("hidden")
            } else {
              $(this).addClass("hidden")
            }
          }
          })
        } else {
          $("#wof2Table").children().first().children().each(function() {
              $(this).removeClass("hidden")
        })
      }
    }
      </script>