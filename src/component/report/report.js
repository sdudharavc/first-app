angular.module('report',[])
.controller('ReportCtrl',function($scope, $state, GsmServices, Notification, Constants, Messages, _,$timeout , $modal, $filter,$q, UtilsFactory) {

    $scope.clonedData = {};
    $scope.dataAfterDrop = [];
    $scope.selectedItemsFromTree = [];
    $scope.ListForTree = [];
    $scope.reportMetrics = [];

    var w_height = $(window).height();
    $(document).ready(function(){
 	  $('.organijation-tree-list').css('height', w_height / 1.5);
 	  $(".organijation-tree-list").mCustomScrollbar();
    });

    $scope.onDragComplete = function (dragItem, evt, index, parentIndex, grandParentIndex, floorName, cabinetName) {
		if(dragItem.org_type == "floor"){
			$scope.ListForTree[index].draggable = false;
			$scope.ListForTree[index].location = dragItem.org_name;
			dragItem.index = index;
		}
		else if(dragItem.org_type == "cabinet"){
			$scope.ListForTree[parentIndex].cabinet[index].draggable = false;
			$scope.ListForTree[parentIndex].cabinet[index].location = floorName + " >> " + dragItem.org_name;
			dragItem.index = index;
			dragItem.parentIndex = parentIndex;
		}
		else if(dragItem.org_type == "device"){
			$scope.ListForTree[grandParentIndex].cabinet[parentIndex].device[index].draggable = false;
			$scope.ListForTree[grandParentIndex].cabinet[parentIndex].device[index].org_name = dragItem.DeviceName;
			$scope.ListForTree[grandParentIndex].cabinet[parentIndex].device[index].location = floorName + " >> " + cabinetName  + " >> " + dragItem.DeviceName;
			dragItem.index = index;
			dragItem.parentIndex = parentIndex;
			dragItem.grandParentIndex = grandParentIndex;
		}
/*		dragItem.reportCheckBox = false;*/
		dragItem.powergearCheckBox = true;
		dragItem.breakerCheckBox = true;
		console.log($scope.selectedItemsFromTree);
        $scope.selectedItemsFromTree.push(dragItem);
    };

    $scope.onDragStart = function (data, evt) {
        $scope.clonedData = data;
    };
	
    GsmServices.organizationlist().success(function (response) {
	    if(response.responseCode == 200){
	    	$scope.ListForTree = response.responseObject.data;
	    	_.filter($scope.ListForTree, function(floor, i){$scope.ListForTree[i].draggable = true; $scope.ListForTree[i].OpenTree = false});
	    	_.filter(response.responseObject.reportMetrics, function(metric, i){$scope.reportMetrics[i] = {};$scope.reportMetrics[i].metric = metric;});
	    	_.filter($scope.reportMetrics, function(metric, i){
	    		$scope.reportMetrics[i].OpenTree = false;
	    		$scope.reportMetrics[i].metricType = [];
	    		$scope.reportMetrics[i].metricCheckBox = false;
	    		_.filter(response.responseObject.reportMetricsData, function(metricType, index){
	    			$scope.reportMetrics[i].metricType[index]= {};
	    			$scope.reportMetrics[i].metricType[index].metricType = metricType;
	    			$scope.reportMetrics[i].metricType[index].value = "0"; 
	    			$scope.reportMetrics[i].metricType[index].metricTypeCheckBox = false; 
	    			
	    			});
	    	});
	    	
	    	$scope.reporttypeData = response.responseObject.reporttypeData;
	    	$scope.data.reportType = $scope.reporttypeData[0];
		}
		else {
			Notification.error({message: response.responseMessage, delay: 3000});
		}
	}).error(function(err){
		Notification.error({message: err.message, delay: 3000});
	});
	
    var timeFormat = "MMM DD, YYYY";
	/*if(window.localStorage.getItem(Constants.TIME_FORMAT)=="12 Hour"){
		timeFormat = "MMM DD, YYYY hh:mm a";
	}*/
	
    $(function() {
		var start = moment().format(timeFormat);
		var end = moment().format(timeFormat);
		function cbb(start, end) {
			$('input[name="daterange"]').html(start + ' - ' + end);
			$scope.data.days = "";
		}

		$('input[name="daterange"]').daterangepicker(
			{
				startDate : start,
				endDate : end,
				locale : {format : timeFormat},
				drops : "left",
				ranges : {
					'Today' : [moment().format(timeFormat), moment().format(timeFormat) ],
					'Last 3 Days' : [moment().subtract(3, 'day').format(timeFormat), moment().format(timeFormat) ],
					'Last 7 Days' : [moment().subtract(7, 'days').format(timeFormat), moment().format(timeFormat) ],
					'Last 1 Month' : [moment().subtract(1, 'month').format(timeFormat), moment().format(timeFormat) ],
					'Last 6 Month' : [moment().subtract(6, 'month').format(timeFormat), moment().format(timeFormat) ],
					'Last 1 Year' : [moment().subtract(1, 'year').format(timeFormat), moment().format(timeFormat) ]
				}
			}, cbb);
	});
    
    $scope.getCabinetList = function (floor, index){
    	if($scope.ListForTree[index].OpenTree){
    		$scope.ListForTree[index].OpenTree = false;
    	}
    	else{
    		$scope.ListForTree[index].OpenTree = true;
    		var inputParam = {'org_fk' : floor.org_key}
        	GsmServices.cabinetlist(inputParam).success(function (response) {
    		    if(response.responseCode == 200){
    		    	$scope.ListForTree[index].cabinet = response.responseObject.data;
    		    	_.filter($scope.ListForTree[index].cabinet, function(cabinet, i){$scope.ListForTree[index].cabinet[i].draggable = true;  $scope.ListForTree[index].cabinet[i].OpenTree = false});
    			}
    			else {
    				Notification.error({message: response.responseMessage, delay: 3000});
    			}
    		}).error(function(err){
    			Notification.error({message: err.message, delay: 3000});
    		});
    	}
    }
    
    $scope.getDeviceList = function (cabinet, index, parentIndex){
    	if($scope.ListForTree[parentIndex].cabinet[index].OpenTree){
    		$scope.ListForTree[parentIndex].cabinet[index].OpenTree = false;
    	}
    	else{
    		$scope.ListForTree[parentIndex].cabinet[index].OpenTree = true;
	    	var inputParam = {'CabinetKey' : cabinet.org_fk_ext}
	    	GsmServices.devicelist(inputParam).success(function (response) {
			    if(response.responseCode == 200){
			    	$scope.ListForTree[parentIndex].cabinet[index].device = response.responseObject.data;
			    	_.filter($scope.ListForTree[parentIndex].cabinet[index].device, function(device, i){$scope.ListForTree[parentIndex].cabinet[index].device[i].draggable = true});
				}
				else {
					Notification.error({message: response.responseMessage, delay: 3000});
				}
			}).error(function(err){
				Notification.error({message: err.message, delay: 3000});
			});
    	}
    }
    
    /*$scope.tickUntickSelectedItemAll = function(countReportCheckBox){
    	if(countReportCheckBox){
    		_.filter($scope.selectedItemsFromTree, function(floor, i){$scope.selectedItemsFromTree[i].reportCheckBox = true});
    	}
    	else{
    		_.filter($scope.selectedItemsFromTree, function(floor, i){$scope.selectedItemsFromTree[i].reportCheckBox = false});
    	}
    }*/
    
    $scope.tickUntickMetricItemAll = function(metricCheckBox, index){
    	if(metricCheckBox){
    		_.filter($scope.reportMetrics[index].metricType, function(metricType, i){$scope.reportMetrics[index].metricType[i].metricTypeCheckBox = true; $scope.changemetricForBinary(true, i, index);});
    		$scope.reportMetrics[index].OpenTree = true;
    	}
    	else{
    		_.filter($scope.reportMetrics[index].metricType, function(metricType, i){$scope.reportMetrics[index].metricType[i].metricTypeCheckBox = false; $scope.changemetricForBinary(false, i, index);});
    	}
    }
    
    $scope.removeSelected = function(index, selectedItem){
    	undraggableSelectedItems(selectedItem);
    	$scope.selectedItemsFromTree.splice(index,1);
    }
    
    $scope.removeAllSelectedItem = function(){
    	_.filter($scope.selectedItemsFromTree, function(selectedItem, i){undraggableSelectedItems(selectedItem);});
    	$scope.selectedItemsFromTree = [];
    }
    
    
    function undraggableSelectedItems(selectedItem){
		if(selectedItem.org_type == "floor"){$scope.ListForTree[selectedItem.index].draggable = true;}
		else if(selectedItem.org_type == "cabinet"){$scope.ListForTree[selectedItem.parentIndex].cabinet[selectedItem.index].draggable = true;}
		else if(selectedItem.org_type == "device"){$scope.ListForTree[selectedItem.grandParentIndex].cabinet[selectedItem.parentIndex].device[selectedItem.index].draggable = true;}
    }
    
    $scope.getMetricItem = function(index){
    	if($scope.reportMetrics[index].OpenTree){$scope.reportMetrics[index].OpenTree = false;}
    	else{$scope.reportMetrics[index].OpenTree = true;}
    }
    
    
    $scope.changemetricForBinary = function(metricType, index, parentIndex){
    	if(metricType){metricType = "1";}
    	else{metricType = "0";}
    	$scope.reportMetrics[parentIndex].metricType[index].value = metricType;
    }
    
    function metricValueConversion(){
    	var metric = {AirFlow : '', Humidity : '', Temperature : '', KWatts : '', Amps : '', 
    	        Volts : '', VoltAmps : '', Efficiency : '', KWhr : ''}
    	_.filter($scope.reportMetrics, function(reportMetric, i){
    		_.filter(reportMetric.metricType, function(metricType, index){
    			if(i==0){metric.AirFlow = metric.AirFlow + metricType.value}
    			else if(i==1){metric.Humidity = metric.Humidity + metricType.value}
    			else if(i==2){metric.Temperature = metric.Temperature + metricType.value}
    			else if(i==3){metric.KWatts = metric.KWatts + metricType.value}
    			else if(i==4){metric.Amps = metric.Amps + metricType.value}
    			else if(i==5){metric.Volts = metric.Volts + metricType.value}
    			else if(i==6){metric.VoltAmps = metric.VoltAmps + metricType.value}
    			else if(i==7){metric.Efficiency = metric.Efficiency + metricType.value}
    			else if(i==8){metric.KWhr = metric.KWhr + metricType.value}
    			});
    	});
    	return metric;
    }
    
    $scope.previewGrid = function(data){
    	if($scope.selectedItemsFromTree.length!=0){
    		var startDate = $filter('DateDividerAndFormatterForDash')( data.dateRange)[0];
        	var endDate = $filter('DateDividerAndFormatterForDash')(data.dateRange)[1];
        	var inputParam = {'startDate' : startDate, 'endDate' : endDate, 'metric' :  metricValueConversion(), items: []};
        	_.filter($scope.selectedItemsFromTree, function(item, i){
        		inputParam.items[i] = {};
        		inputParam.items[i].org_key = item.org_key;
        		inputParam.items[i].org_type = item.org_type;
        		inputParam.items[i].powergearCheckBox = item.powergearCheckBox;
        		inputParam.items[i].breakerCheckBox = item.breakerCheckBox;
        	})
        	var item = {};
        	 var defer = $q.defer();
        	 UtilsFactory.setPreviewDataForGrid(JSON.stringify(inputParam));
        	GsmServices.previewList(inputParam).success(function (response) {
    		    if(response.responseCode == 200){
    		    	item = response.responseObject.data;
    		    	 defer.resolve(response.responseObject.data);
    			}
    			else {
    				Notification.error({message: response.responseMessage, delay: 3000});
    			}
    		}).error(function(err){
    			Notification.error({message: err.message, delay: 3000});
    		});
        	$timeout(function () {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: 'src/template/powerMetricReportGrid.html',
                    controller: previewGridCtrl,
                    resolve: {
                    } // empty storage
                };
                $scope.opts.resolve.item = function () {
                    return defer.promise;
                }
                
                $scope.opts.resolve.metric = function () {
                    return $scope.reportMetrics;
                }

                var modalInstance = $modal.open($scope.opts);
                modalInstance.result.then(function () {
                }, function () {
                });
            }, 500);
    	}
    	else{
    		Notification.error({message : Messages.PLEASE_ADD_ITEM_TO_PREVIEW_REPORT, delay : Constants.DELAY});
    	}
    	
    }
    
    var previewGridCtrl = function ($scope, $modalInstance, $modal, item, metric, $window, _) {
    	$scope.gridForPowerMetric = {
                toolbar: ["pdf", "excel"],
                excel: {fileName: "Power Report Grid.xlsx", filterable: true},
                pdf: {
                    allPages: true,
                    avoidLinks: true,
                    fileName: "Power Report Grid.pdf",
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: ' <div class="page-template"><div class="header"><div style="float: right">Page #: pageNum # of #: totalPages #</div>'+
                    	'Multi-page grid with automatic page breaking</div><div class="footer">Page #: pageNum # of #: totalPages #</div></div>',
                    scale: 0.5
                },
                sortable: true, groupable: true, resizable: true, filterable: true,
                pageable: {refresh: false, pageSizes: true, buttonCount: 5},
                columns: [
       		    	{ 	field: 'Org_name', title: 'Name', lockable: true, width :124,
       		    	},{ 	field: 'Level' , title : 'Level', lockable: true, width :100,
       		    	},{ 	field: 'AirFlowLive', title : 'Air Flow Live', lockable: true, width :124, hidden : !metric[0].metricType[2].metricTypeCheckBox, 
       		    				menu : metric[0].metricType[2].metricTypeCheckBox
       		    	},{ 	field: 'AirFlowMin', title : 'Air Flow Min', lockable: true, width :124, hidden : !metric[0].metricType[0].metricTypeCheckBox, 
		    				menu : metric[0].metricType[0].metricTypeCheckBox
       		    	},{ 	field: 'AirFlowMax', title : 'Air Flow Max', lockable: true, width :124, hidden : !metric[0].metricType[1].metricTypeCheckBox, 
		    				menu : metric[0].metricType[1].metricTypeCheckBox
       		    	},{ 	field: 'AirFlowAvg', title : 'Air Flow Avg', lockable: true, width :124, hidden : !metric[0].metricType[3].metricTypeCheckBox, 
		    				menu : metric[0].metricType[3].metricTypeCheckBox
       		    	},{ 	field: 'HumidityLive', title : 'Humidity Live', lockable: true, width :124, hidden : !metric[1].metricType[2].metricTypeCheckBox, 
		    				menu : metric[1].metricType[2].metricTypeCheckBox
       		    	},{ 	field: 'HumidityMin', title : 'Humidity Min', lockable: true, width :124, hidden : !metric[1].metricType[0].metricTypeCheckBox, 
		    				menu : metric[1].metricType[0].metricTypeCheckBox
       		    	},{ 	field: 'HumidityMax', title : 'Humidity Max', lockable: true, width :124, hidden : !metric[1].metricType[1].metricTypeCheckBox, 
		    				menu : metric[1].metricType[1].metricTypeCheckBox
       		    	},{ 	field: 'HumidityAvg', title : 'Humidity Avg', lockable: true, width :124, hidden : !metric[1].metricType[3].metricTypeCheckBox, 
		    				menu : metric[1].metricType[3].metricTypeCheckBox
       		    	},{ 	field: 'TemperatureLive', title : 'Temperature Live', lockable: true, width :124, hidden : !metric[2].metricType[2].metricTypeCheckBox, 
		    				menu : metric[2].metricType[2].metricTypeCheckBox
       		    	},{ 	field: 'TemperatureMin', title : 'Temperature Min', lockable: true, width :124, hidden : !metric[2].metricType[0].metricTypeCheckBox, 
		    				menu : metric[2].metricType[0].metricTypeCheckBox
       		    	},{ 	field: 'TemperatureMax', title : 'Temperature Max', lockable: true, width :124, hidden : !metric[2].metricType[1].metricTypeCheckBox, 
		    				menu : metric[2].metricType[1].metricTypeCheckBox
       		    	},{ 	field: 'TemperatureAvg', title : 'Temperature Avg', lockable: true, width :124, hidden : !metric[2].metricType[3].metricTypeCheckBox, 
		    				menu : metric[2].metricType[3].metricTypeCheckBox
       		    	},{ 	field: 'KWattsLive', title : 'KWatts Live', lockable: true, width :124, hidden : !metric[3].metricType[2].metricTypeCheckBox, 
		    				menu : metric[3].metricType[2].metricTypeCheckBox
       		    	},{ 	field: 'KWattsMin', title : 'KWatts Min', lockable: true, width :124, hidden : !metric[3].metricType[0].metricTypeCheckBox, 
		    				menu : metric[3].metricType[0].metricTypeCheckBox
       		    	},{ 	field: 'KWattsMax', title : 'KWatts Max', lockable: true, width :124, hidden : !metric[3].metricType[1].metricTypeCheckBox, 
		    				menu : metric[3].metricType[1].metricTypeCheckBox
       		    	},{ 	field: 'KWattsAvg', title : 'KWatts Avg', lockable: true, width :124, hidden : !metric[3].metricType[3].metricTypeCheckBox, 
		    				menu : metric[3].metricType[3].metricTypeCheckBox
       		    	},{ 	field: 'AmpsLive', title : 'Amps Live', lockable: true, width :124, hidden : !metric[4].metricType[2].metricTypeCheckBox, 
		    				menu : metric[4].metricType[2].metricTypeCheckBox
       		    	},{ 	field: 'AmpsMin', title : 'Amps Min', lockable: true, width :124, hidden : !metric[4].metricType[0].metricTypeCheckBox, 
		    				menu : metric[4].metricType[0].metricTypeCheckBox
       		    	},{ 	field: 'AmpsMax', title : 'Amps Max', lockable: true, width :124, hidden : !metric[4].metricType[1].metricTypeCheckBox, 
		    				menu : metric[4].metricType[1].metricTypeCheckBox
       		    	},{ 	field: 'AmpsAvg', title : 'Amps Avg', lockable: true, width :124, hidden : !metric[4].metricType[3].metricTypeCheckBox, 
		    				menu : metric[4].metricType[3].metricTypeCheckBox
       		    	},{ 	field: 'VoltsLive', title : 'Volts Live', lockable: true, width :124, hidden : !metric[5].metricType[2].metricTypeCheckBox, 
		    				menu : metric[5].metricType[2].metricTypeCheckBox
       		    	},{ 	field: 'VoltsMin', title : 'Volts Min', lockable: true, width :124, hidden : !metric[5].metricType[0].metricTypeCheckBox, 
		    				menu : metric[5].metricType[0].metricTypeCheckBox
       		    	},{ 	field: 'VoltsMax', title : 'Volts Max', lockable: true, width :124, hidden : !metric[5].metricType[1].metricTypeCheckBox, 
		    				menu : metric[5].metricType[1].metricTypeCheckBox
       		    	},{ 	field: 'VoltsAvg', title : 'Volts Avg', lockable: true, width :124, hidden : !metric[5].metricType[3].metricTypeCheckBox, 
		    				menu : metric[5].metricType[3].metricTypeCheckBox
       		    	},{ 	field: 'KVALive', title : 'KVA Live', lockable: true, width :124, hidden : !metric[6].metricType[2].metricTypeCheckBox, 
		    				menu : metric[6].metricType[2].metricTypeCheckBox
       		    	},{ 	field: 'KVAMin', title : 'KVA Min', lockable: true, width :124, hidden : !metric[6].metricType[0].metricTypeCheckBox, 
		    				menu : metric[6].metricType[0].metricTypeCheckBox
       		    	},{ 	field: 'KVAMax', title : 'KVA Max', lockable: true, width :124, hidden : !metric[6].metricType[1].metricTypeCheckBox, 
		    				menu : metric[6].metricType[1].metricTypeCheckBox
       		    	},{ 	field: 'KVAAvg', title : 'KVA Avg', lockable: true, width :124, hidden : !metric[6].metricType[3].metricTypeCheckBox, 
		    				menu : metric[6].metricType[3].metricTypeCheckBox
       		    	},{ 	field: 'EfficiencyLive', title : 'Efficiency Live', lockable: true, width :124, hidden : !metric[7].metricType[2].metricTypeCheckBox, 
		    				menu : metric[7].metricType[2].metricTypeCheckBox
       		    	},{ 	field: 'EfficiencyMin', title : 'Efficiency Min', lockable: true, width :124, hidden : !metric[7].metricType[0].metricTypeCheckBox, 
		    				menu : metric[7].metricType[0].metricTypeCheckBox
       		    	},{ 	field: 'EfficiencyMax', title : 'Efficiency Max', lockable: true, width :124, hidden : !metric[7].metricType[1].metricTypeCheckBox, 
		    				menu : metric[7].metricType[1].metricTypeCheckBox
       		    	},{ 	field: 'EfficiencyAvg', title : 'Efficiency Avg', lockable: true, width :124, hidden : !metric[7].metricType[3].metricTypeCheckBox, 
		    				menu : metric[7].metricType[3].metricTypeCheckBox
       		    	},{ 	field: 'KWhrLive', title : 'KWhr Live', lockable: true, width :124, hidden : !metric[8].metricType[2].metricTypeCheckBox, 
		    				menu : metric[8].metricType[2].metricTypeCheckBox
       		    	},{ 	field: 'KWhrMin', title : 'KWhr Min', lockable: true, width :124, hidden : !metric[8].metricType[0].metricTypeCheckBox, 
		    				menu : metric[8].metricType[0].metricTypeCheckBox
       		    	},{ 	field: 'KWhrMax', title : 'KWhr Max', lockable: true, width :124, hidden : !metric[8].metricType[1].metricTypeCheckBox, 
		    				menu : metric[8].metricType[1].metricTypeCheckBox
       		    	},{ 	field: 'KWhrAvg', title : 'KWhr Avg', lockable: true, width :124, hidden : !metric[8].metricType[3].metricTypeCheckBox, 
		    				menu : metric[8].metricType[3].metricTypeCheckBox
       		    	}],
       		    	columnMenu: true,
       		     dataSource: {data: item, pageSize: 10},
            };
    	
    	 
    	$scope.ok = function () {
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
});