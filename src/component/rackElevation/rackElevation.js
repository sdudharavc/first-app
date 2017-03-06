angular.module('rackelevation', [])
        .controller('RackElevationCtrl', function ($scope, $rootScope, GsmServices, $state, UtilsFactory, Notification, Constants, Messages, PageConfig, spinnerService) {


            $scope.sliderActive = true;
            $scope.configureCabinet = true;
            $scope.widget = {}
            $scope.widget.jsfunctionname = "getRackElevationData";
            $scope.widget.widgetname = "Rack";
            $scope.widget.name = "Cabinet";
            $scope.selectedMetric = "";
            $scope.cabinetList = [];
            $scope.cabintListCount = null;
            $scope.cabinetIndex = null;
            selectedRackId = null;
            rackIdToDisplay = 0;
            $scope.metricShow = 1;
            $scope.frontRear = 'front';

//            var metricShowArray = {value:"1",maxValue:"2",VoltAmps:"3",Watts:"4"};
            var metricShowArray = {value: "1", Amps: "2", PowerFactor: "3", VoltAmps: "4", Watts: "5"};
            $scope.colorArray = {0: "rack_red_red", 1: "rack_red_yellow", 2: "rack_yellow_yellow", 3: "rack_lightblue_red", 4: "rack_darkblue_darkblue", 5: "rack_lightblue_darkblue", 6: "rack_yellow_red", 7: "rack_lightblue_yellow", 8: "rack_yellow_darkblue", 9: "rack_red_darkblue"}

            spinnerService._unregisterAll();

            $scope.rackElevationdata = [];
            $scope.rackDetail = [];
            /**/

            function get_rack_elevation_data(selectedRackId) {
                $rootScope.rackChildId = selectedRackId;
                var inputparam = {'rackId': selectedRackId};
                GsmServices.get_rack_elevation_data(inputparam).success(function (response) {


                    spinnerService.hide('html5spinnerRackElevation');
                    UtilsFactory.setRackElevationChartData(JSON.stringify(response.responseObject));
                    for (var i = 0; i < response.responseObject.data.rackAllGSMUKey.length; i++) {
                        if (response.responseObject.setting.cabinet.CabinetKey == response.responseObject.data.rackAllGSMUKey[i].CabinetKey) {
                            $scope.cabinetIndex = i;
                        }
                    }
                    $scope.cabinetList = response.responseObject.data.rackAllGSMUKey;
                    $scope.cabintListCount = response.responseObject.data.rackAllGSMUKey.length;
                    $scope.visibility = response.responseObject.data.VisibilityType;
                    $scope.metricValue = response.responseObject.data.rackMetricValues;
                    $scope.sensorData = response.responseObject.data.sensorData;
                    $scope.sensorTop = 5;
                    $scope.rackElevationdata[rackIdToDisplay] = {};
                    $scope.rackColor = response.responseObject.data.rackColors;
                    $scope.rackDetail['siteDetail'] = response.responseObject.data.rackSiteDetail;
                    $scope.rackDetail['TempValues'] = response.responseObject.data.rackTempValues;
                    $scope.rackElevationdata[rackIdToDisplay].totalNoRackSlot = 252;
                    $scope.rackElevationdata[rackIdToDisplay].metricData = response.responseObject.data.newRpcData;
//                    console.log("chekc", $scope.rackElevationdata[rackIdToDisplay].metricData);
//                    console.log("chekc", $scope.rackElevationdata[rackIdToDisplay].metricData.rpcDataArray[0].rackDetail.rpc_name);
                    _.filter($scope.rackElevationdata[rackIdToDisplay].metricData, function (rpc, i) {
                        $scope.rackElevationdata[rackIdToDisplay].metricData[i].data = false;
                    })
                    delete $scope.rackElevationdata[rackIdToDisplay].viewImg;
                    $scope.rackElevationdata[rackIdToDisplay].viewImg = {};
                    $scope.rackElevationdata[rackIdToDisplay].deviceColor = {}
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.img = [];
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.style = [];
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.color = [];
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.device = [];
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.deviceTemp = [];
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.img = [];
                    _.filter(response.responseObject.data.rackElevationData, function (viewImg, i) {
                        var StartPos = parseInt(response.responseObject.data.rackElevationData[i].StartPos);
//                        console.log("response.responseObject.data.rackElevationData[i].EndPos",response.responseObject.data.rackElevationData[i].EndPos);
                        var EndPos = parseInt(response.responseObject.data.rackElevationData[i].EndPos);
//                        console.log("EndPos", EndPos)
                        var deviceName = response.responseObject.data.rackElevationData[i].DeviceName;
                        var deviceHeight = response.responseObject.data.rackElevationData[i].Heightu;
                        var image = response.responseObject.data.rackElevationData[i].FrontRearShapeImage64;//FrontRearShapeImage64==rear // ShapeImage64 == front
                        var postion = EndPos + 1;
//                        console.log("EndPos",EndPos)
                        if (parseInt(EndPos) % 6 != 0) {
                            var part = EndPos / 6;
                            postion = parseInt(part) * 6;
                            postion = parseInt(postion) - 6;
                        }
//                        $scope.frontRear = 'yeys';
//                        console.log('postion',postion)
                        var height = 23 * deviceHeight;
                        var marginTop = -(height - 7.12);
//                        console.log('Position',postion)
                        if (!isNaN(postion)) {
                            if(postion == 84){
//                                console.log('84 EndPos',EndPos);
                            }
//                            $scope.rackElevationdata[rackIdToDisplay].viewImg.img[postion] = 'data:image/png;base64,' + image;
                            $scope.rackElevationdata[rackIdToDisplay].viewImg.img[postion] = 'data:image/png;base64,' + image;
                            $scope.rackElevationdata[rackIdToDisplay].viewImg.color[postion] = response.responseObject.data.rackElevationData[i].InvColor;
                            $scope.rackElevationdata[rackIdToDisplay].viewImg.style[postion] = height;
                            $scope.rackElevationdata[rackIdToDisplay].viewImg.device[postion] = deviceName;
                        }

//                        console.log("rack elevation", $scope.rackElevationdata);
//                        $scope.rackElevationdata[rackIdToDisplay].viewImg.deviceTemp[postion] = response.responseObject.data.sensorData[i];
                    })
                    console.log("rack elevation", $scope.rackElevationdata[0].viewImg.img[84]);
                }).error(function () {
                });
            }
            $scope.handleRearFront = function (option) {
                $scope.rackElevationdata = [];
                var getRackData = JSON.parse(UtilsFactory.getRackElevationChartData());
                $scope.visibility = getRackData.data.VisibilityType;
                $scope.metricValue = getRackData.data.rackMetricValues;
                $scope.rackElevationdata[rackIdToDisplay] = {};
                $scope.rackColor = getRackData.data.rackColors;
                $scope.rackDetail['siteDetail'] = getRackData.data.rackSiteDetail;
                $scope.rackDetail['TempValues'] = getRackData.data.rackTempValues;
                $scope.rackElevationdata[rackIdToDisplay].totalNoRackSlot = 252;
                $scope.rackElevationdata[rackIdToDisplay].metricData = getRackData.data.newRpcData;
                _.filter($scope.rackElevationdata[rackIdToDisplay].metricData, function (rpc, i) {
                    $scope.rackElevationdata[rackIdToDisplay].metricData[i].data = false;
                })
                $scope.rackElevationdata[rackIdToDisplay].viewImg = {};
                $scope.rackElevationdata[rackIdToDisplay].deviceColor = {}
                $scope.rackElevationdata[rackIdToDisplay].viewImg.img = [];
                $scope.rackElevationdata[rackIdToDisplay].viewImg.style = [];
                $scope.rackElevationdata[rackIdToDisplay].viewImg.color = [];
                $scope.rackElevationdata[rackIdToDisplay].viewImg.device = [];
                console.log("getRackData", getRackData);
                _.filter(getRackData.data.rackElevationData, function (viewImg, i) {
                    var StartPos = parseInt(getRackData.data.rackElevationData[i].StartPos);
                    var EndPos = parseInt(getRackData.data.rackElevationData[i].EndPos);
                    var deviceName = getRackData.data.rackElevationData[i].DeviceName;
                    var deviceHeight = getRackData.data.rackElevationData[i].Heightu;
                    if (option == 'rear') {
                        $scope.frontRear = 'rear';
                        var image = getRackData.data.rackElevationData[i].ShapeImage64;
                    } else {
                        $scope.frontRear = 'front';
                        var image = getRackData.data.rackElevationData[i].FrontRearShapeImage64;
                    }
                    var postion = EndPos + 1;
                    if (parseInt(EndPos) % 6 != 0) {
                        var part = EndPos / 6;
                        postion = parseInt(part) * 6;
                        postion = parseInt(postion) - 6;
                    }
//                        $scope.frontRear = 'yeys';
                    var height = 23 * deviceHeight;
                    var marginTop = -(height - 7.12);
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.img[postion] = 'data:image/png;base64,' + image;
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.color[postion] = getRackData.data.rackElevationData[i].InvColor;
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.style[postion] = height;
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.device[postion] = deviceName;
                })

            }
            var inputparam = {DashType: '1'};
            GsmServices.racklist(inputparam).success(function (response) {
                if (response.responseCode == 200) {
                    spinnerService.show('html5spinnerRackElevation');
                    $scope.configureCabinet = false;
                    $rootScope.rackChildId = response.responseObject[0].childWidgets;
                    get_rack_elevation_data(response.responseObject[0].childWidgets);
                } else {
                    $scope.configureCabinet = true;
                    get_rack_elevation_data(null);
                }

            }).error(function () {
                $scope.configureCabinet = true;
                get_rack_elevation_data(null);
            });

            var getCabinetDataAfterSaveListener = $rootScope.$on('getCabinetDataAfterSave', function (event, widget, response) {
                $scope.configureCabinet = false;
                get_rack_elevation_data(response.data.last_insert_id);
            });

            $scope.$on('$destroy', getCabinetDataAfterSaveListener);


            $scope.rpcCollapse = function (metric, index) {
                console.log($scope.rackElevationdata[rackIdToDisplay].metricData, index)
                $scope.rackElevationdata[rackIdToDisplay].metricData.rpcDataArray[index] = !metric;

            }

            $scope.changeMetric = function (param) {
                $scope.metricShow = metricShowArray[param];
            }
            $scope.handleCabinetSlider = function (param) {
                if (param == "P") {
                    $scope.cabinetIndex = $scope.cabinetIndex - 1;
                } else {
                    $scope.cabinetIndex = $scope.cabinetIndex + 1
                }
                var postData = {'cabinet': $scope.cabinetList[$scope.cabinetIndex], 'childId': $rootScope.rackChildId};
                GsmServices.getCabinetRackElevation(postData).success(function (response) {
                    $scope.rackElevationdata = [];
//                    $scope.cabinetList = response.responseObject.data.rackAllGSMUKey;
                    $scope.cabinetList = response.responseObject.data.rackAllGSMUKey;
                    $scope.cabintListCount = response.responseObject.data.rackAllGSMUKey.length;
                    $scope.visibility = response.responseObject.data.VisibilityType;
                    $scope.metricValue = response.responseObject.data.rackMetricValues;
                    $scope.sensorData = response.responseObject.data.sensorData;
                    $scope.sensorTop = 5;
                    $scope.rackElevationdata[rackIdToDisplay] = {};
                    $scope.rackColor = response.responseObject.data.rackColors;
                    $scope.rackDetail['siteDetail'] = response.responseObject.data.rackSiteDetail;
                    $scope.rackDetail['TempValues'] = response.responseObject.data.rackTempValues;
                    $scope.rackElevationdata[rackIdToDisplay].totalNoRackSlot = 252;
                    $scope.rackElevationdata[rackIdToDisplay].metricData = response.responseObject.data.newRpcData;
//                    console.log("chekc", $scope.rackElevationdata[rackIdToDisplay].metricData);
//                    console.log("chekc", $scope.rackElevationdata[rackIdToDisplay].metricData.rpcDataArray[0].rackDetail.rpc_name);
                    _.filter($scope.rackElevationdata[rackIdToDisplay].metricData, function (rpc, i) {
                        $scope.rackElevationdata[rackIdToDisplay].metricData[i].data = false;
                    })
                    $scope.rackElevationdata[rackIdToDisplay].viewImg = {};
                    $scope.rackElevationdata[rackIdToDisplay].deviceColor = {}
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.img = [];
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.style = [];
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.color = [];
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.device = [];
                    $scope.rackElevationdata[rackIdToDisplay].viewImg.deviceTemp = [];
                    _.filter(response.responseObject.data.rackElevationData, function (viewImg, i) {
                        var StartPos = parseInt(response.responseObject.data.rackElevationData[i].StartPos);
                        var EndPos = parseInt(response.responseObject.data.rackElevationData[i].EndPos);
                        var deviceName = response.responseObject.data.rackElevationData[i].DeviceName;
                        var deviceHeight = response.responseObject.data.rackElevationData[i].Heightu;
                        var image = response.responseObject.data.rackElevationData[i].FrontRearShapeImage64;//FrontRearShapeImage64==rear // ShapeImage64 == front
                        var postion = EndPos + 1;
                        if (parseInt(EndPos) % 6 != 0) {
                            var part = EndPos / 6;
                            postion = parseInt(part) * 6;
                            postion = parseInt(postion) - 6;
                        }
//                        $scope.frontRear = 'yeys';
                        var height = 23 * deviceHeight;
                        var marginTop = -(height - 7.12);
                        $scope.rackElevationdata[rackIdToDisplay].viewImg.img[EndPos] = 'data:image/png;base64,' + image;
                        $scope.rackElevationdata[rackIdToDisplay].viewImg.color[postion] = response.responseObject.data.rackElevationData[i].InvColor;
                        $scope.rackElevationdata[rackIdToDisplay].viewImg.style[postion] = height;
                        $scope.rackElevationdata[rackIdToDisplay].viewImg.device[postion] = deviceName;
//                        console.log("rack elevation", $scope.rackElevationdata);
//                        $scope.rackElevationdata[rackIdToDisplay].viewImg.deviceTemp[postion] = response.responseObject.data.sensorData[i];
                    })
                    console.log('$scope.rackElevationdata', $scope.rackElevationdata);
                }).error(function () {
                    console.log('ERROR')
//                    $scope.configureCabinet = true;
//                    get_rack_elevation_data(null);
                });
            }
        })