<div class="card-header button-header">
        <div class="float-left">
          <h3>Buttons</h3>
        </div>
        <div class="float-right">
          <label for="buttonGray">Enable Grey Out</label>
          <input type="checkbox" name="buttonGray" id="buttonGray" onchange="enableButtonGray();" checked>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-9">
            <table border="1" class="tablebuttons text-center" width="100%" height="100%">
              <tr>
                <!-- Button Names -->
                <td></td>
                <td>ABORT</td>
                <td>DETONATE <br>>=2 BAT</td>
                <td>DETONATE <br>&lt;2 BAT</td>
                <td>HOLD</td>
                <td>PRESS</td>
              </tr>
              <tr>
                <td><span class="text-danger">RED</span></td>
                <td class="buttonCheck buttonCCheck">C</td>
                <td class="buttonPress buttonDetMoreBat">P</td>
                <td class="buttonHold buttonDetLessBat">H</td>
                <td class="buttonPress">P</td>
                <td class="buttonCheck buttonCCheck">C</td>
              </tr>
              <tr>
                <td><span class="text-primary">BLUE</span></td>
                <td class="buttonHold">H</td>
                <td class="buttonPress buttonDetMoreBat">P</td>
                <td class="buttonHold buttonDetLessBat">H</td>
                <td class="buttonCheck buttonCCheck">C</td>
                <td class="buttonCheck buttonCCheck">C</td>
              </tr>
              <tr>
                <td>WHITE <br>W/ CAR</td>
                <td class="buttonHold buttonLightCar">H</td>
                <td class="buttonPress buttonDetMoreBat buttonLightCar">P</td>
                <td class="buttonHold buttonDetLessBat buttonLightCar">H</td>
                <td class="buttonHold buttonLightCar">H</td>
                <td class="buttonHold buttonLightCar">H</td>
              </tr>
              <tr>
                <td>WHITE <br>W/O CAR</td>
                <td class="buttonCheck buttonNoLightCar buttonCCheck">C</td>
                <td class="buttonPress buttonDetMoreBat buttonNoLightCar">P</td>
                <td class="buttonHold buttonDetLessBat buttonNoLightCar">H</td>
                <td class="buttonCheck buttonNoLightCar buttonCCheck">C</td>
                <td class="buttonCheck buttonNoLightCar buttonCCheck">C</td>
              </tr>
              <tr>
                <td>ELSE</td>
                <td class="buttonCheck buttonCCheck">C</td>
                <td class="buttonPress buttonDetMoreBat">P</td>
                <td class="buttonHold buttonDetLessBat">H</td>
                <td class="buttonCheck buttonCCheck">C</td>
                <td class="buttonCheck buttonCCheck">C</td>
              </tr>
            </table>
          </div>
          <div class="col-3 pl-0">
            <div class="legend text-center">
              <h4><u>Legend</u></h4>
              <table width="100%">
                <tr style="border-bottom: 1px solid black;">
                  <td class="text-left">P</td>
                  <td class="text-right">Press & Release</td>
                </tr>
                <tr style="border-bottom: 1px solid black;">
                  <td class="text-left">H</td>
                  <td class="text-right">Hold & Refer Below</td>
                </tr>
                <tr>
                  <td class="text-left">C</td>
                  <td class="text-right">3+ Bat & FRK: Press<br>Else: Hold & Refer Below</td>
                </tr>
              </table>
            </div>
            <div class="legend pb-1 pt-1 pl-1 pr-1">
              <h4>Release When Time has:</h4>
              <div class="stripDiv">
                <div class="blueStrip">BLUE</div><span class="stripNumbers">4</span>
                <div class="yellowStrip">YELLOW</div><span class="stripNumbers">5</span>
                <div class="elseStrip">ELSE</div><span class="stripNumbers">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>