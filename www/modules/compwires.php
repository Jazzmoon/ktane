<div class="card-header compwires-header">
    <div class="float-left">
        <h3>Complicated Wires</h3>
    </div>
    <div class="float-right">
        <label for="assistedTable">Enable Assisted Table</label>
        <input type="checkbox" name="assistedTable" id="assistedTable" onchange="enableAssistedTable();" checked>
    </div>
</div>

<div class="card-body">
    <div class="row">

        <div class="col-9">
            <table class="table table-bordered text-center">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th colspan="2"><i class="fas fa-circle fa-3x"></i></th>
                        <th colspan="2"><i class="fas fa-circle text-warning fa-3x"></i></th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row"><img src="./images/white.jpg" alt="White Wire" class="compWireImg"></th>
                    <td class="wireCut"><i class="fas fa-check fa-3x"></i></td>
                    <td class="wireCut"><i class="fas fa-check fa-3x"></i></td>
                    <td class="wireDontCut"><i class="fas fa-times fa-3x"></i></td>
                    <td class="wireBattery ifBatteryMore2"><i class="fas fa-battery-full fa-3x"></i></td>
                </tr>
                <tr>
                    <th scope="row"><img src="./images/red.jpg" alt="Red Wire" class="compWireImg"><img src="./images/white-red.jpg" alt="Red-White Wire" class="compWireImg"></th>
                    <td class="wireSerial ifSerial"><i class="fas fa-barcode fa-3x"></i></td>
                    <td class="wireCut"><i class="fas fa-check fa-3x"></i></td>
                    <td class="wireBattery ifBatteryMore2"><i class="fas fa-battery-full fa-3x"></i></td>
                    <td class="wireBattery ifBatteryMore2"><i class="fas fa-battery-full fa-3x"></i></td>
                </tr>
                <tr>
                    <th scope="row"><img src="./images/blue.jpg" alt="Blue Wire" class="compWireImg"><img src="./images/white-blue.jpg" alt="Blue-White Wire" class="compWireImg"></th>
                    <td class="wireSerial ifSerial"><i class="fas fa-barcode fa-3x"></i></td>
                    <td class="wireDontCut"><i class="fas fa-times fa-3x"></i></td>
                    <td class="wireParallel ifParallel"><i class="fab fa-usb fa-3x"></i></td>
                    <td class="wireParallel ifParallel"><i class="fab fa-usb fa-3x"></i></td>
                </tr>
                <tr>
                    <th scope="row"><img src="./images/red-blue.jpg" alt="Red-Blue Wire" class="compWireImg"></th>
                    <td class="wireSerial ifSerial"><i class="fas fa-barcode fa-3x"></i></td>
                    <td class="wireParallel ifParallel"><i class="fab fa-usb fa-3x"></i></td>
                    <td class="wireSerial ifSerial"><i class="fas fa-barcode fa-3x"></i></td>
                    <td class="wireDontCut"><i class="fas fa-times fa-3x"></i></td>
                </tr>
                <tr>
                    <th scope="row"></th>
                    <td><i class="far fa-star fa-3x"></i></td>
                    <td><i class="fas fa-star fa-3x"></i></td>
                    <td><i class="far fa-star fa-3x"></i></td>
                    <td><i class="fas fa-star fa-3x"></i></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="col-3 pl-0">
            <div class="legend text-center">
                <h4><u>Legend</u></h4>
                <table id="compLegend" width="100%">
                    <tr style="border-bottom: 1px solid black;">
                        <td class="text-left"><i class="fas fa-check fa-2x text-success"></i></td>
                        <td class="text-right">Cut</td>
                    </tr>
                    <tr style="border-bottom: 1px solid black;">
                        <td class="text-left"><i class="fas fa-times fa-2x text-danger"></i></td>
                        <td class="text-right">Dont Cut</td>
                    </tr>
                    <tr style="border-bottom: 1px solid black;">
                        <td class="text-left"><i class="fas fa-battery-full fa-2x text-warning"></i></td>
                        <td class="text-right">Cut If 2+ Battery</td>
                    </tr>
                    <tr style="border-bottom: 1px solid black;">
                        <td class="text-left"><i class="fas fa-barcode fa-2x text-purple"></i></td>
                        <td class="text-right">Cut If Serial Even</td>
                    </tr>
                    <tr>
                        <td class="text-left"><i class="fab fa-usb fa-2x text-info"></i></td>
                        <td class="text-right">Cut If Parallel Port</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>