angular.module('customwidget', [])
.controller('CustomWidgetCtrl', function ($scope, $rootScope, $modal, GsmServices, Notification, $interval, $confirm, Messages, $timeout, _, $rootScope, $filter, ngTableParams, Constants, UtilsFactory) {
 
		$scope.changeGraph = false;
            
            
		var timeFormat = "MMM DD, YYYY HH:mm:ss.ms";
		if(window.localStorage.getItem(Constants.TIME_FORMAT)=="12 Hour"){
			timeFormat = "MMM DD, YYYY hh:mm:ss.ms a";
		}
			
			
            $scope.deleteWidget = function (widget, index) {
            	$interval.cancel($scope.dashboardInterval);
                $confirm({title: "Delete widget", ok: 'Yes', cancel: 'No', text: Messages.DELETE_WIDGET_CONFIRMATION})
                        .then(function () {
                            var inputdata = {'widgetId': widget.childWidgets};
                            GsmServices.removeWidget(inputdata).success(function (response) {
                                if (response.responseCode == 200) {
                                	$timeout(function(){
                                		_.filter($scope.dashboard.widgetsData, function (data, i) {
                                            if (data.childWidgets == widget.childWidgets) {
                                                delete $scope.dashboard.widgetsData[i];
                                                $scope.dashboard.widgetsData = _.filter($scope.dashboard.widgetsData, function( element ) {
                                                	   return element !== undefined;
                                                });
                                                UtilsFactory.setWidgetPositionData(JSON.stringify($scope.dashboard.widgetsData));
                                                Notification.success({message: Messages.DELETE_WIDGET, delay: Constants.DELAY});
                                            	if($scope.intervals){
                                            		$interval.cancel($scope.intervals[widget.childWidgets])
                                            		delete $scope.intervals[widget.childWidgets];
                                            	}
                                            	$rootScope.userTimeIntervalForOtherController();
                                            }
                                        });
                                	},100)
                                }
                            });
                        }).catch(function(err){
                        	$rootScope.userTimeIntervalForOtherController();
	                    });
            };

            $scope.openSettings = function (widget, index) {
                var templete = 'src/template/widget_setting/commonSetting.html';
                if (widget.jsfunctionname == 'chart_cabinet') {
                    templete = 'src/template/widget_setting/cabinetInfoSetting.html';
                } else if (widget.jsfunctionname == 'pue_live' || widget.jsfunctionname == "gauge_getwithoutpuehistory") {
                    templete = 'src/template/widget_setting/pueGaugeSetting.html';
                } else if (widget.jsfunctionname == "pue_line_chart" || widget.jsfunctionname == "pue_bar_chart" || widget.jsfunctionname == "pue_area_chart") {
                    templete = 'src/template/widget_setting/pueHistorySetting.html';
                } else if (widget.jsfunctionname == "bar_sensor" || widget.jsfunctionname == "area_sensor" || widget.jsfunctionname == "line_sensor") {
                    templete = 'src/template/widget_setting/sensorHistorySetting.html';
                } else if (widget.jsfunctionname == 'bar_thresold' || widget.jsfunctionname == 'area_thresold' || widget.jsfunctionname == 'line_thresold') {
                    templete = 'src/template/widget_setting/powerMetriceHistorySetting.html';
                } else if (widget.jsfunctionname == 'getFloor') {
                    templete = 'src/template/widget_setting/getFloorSetting.html';
                } else if (widget.jsfunctionname == 'line_getwithoutpuehistory'|| widget.jsfunctionname == 'bar_getwithoutpuehistory' || widget.jsfunctionname == 'area_getwithoutpuehistory') {
                    templete = 'src/template/widget_setting/formulaHistorySetting.html';
                } else if (widget.jsfunctionname == 'getRackElevationData') {
                    templete = 'src/template/widget_setting/rackElevationSettings.html';
	            } else if (widget.jsfunctionname == 'chart_spider') {
	                templete = 'src/template/widget_setting/spiderChartSetting.html';
	            } else if (widget.jsfunctionname == 'chart_floor_spider') {
	                templete = 'src/template/widget_setting/spiderFloorChartSetting.html';
	            } else if (widget.jsfunctionname == 'walt_thresold') {
	                templete = 'src/template/widget_setting/powerMetriceGaugeSetting.html';
	            } else if (widget.jsfunctionname == 'sensor_gauge') {
	                templete = 'src/template/widget_setting/sensorGaugeSetting.html';
	            }
                $interval.cancel($scope.dashboardInterval);
                $modal.open({
                    scope: $scope,
                    templateUrl: templete,
                    controller: 'WidgetSettingsCtrl',
                    resolve: {
                        widget: function () {
                            return widget;
                        },
                        index: function () {
                            return index;
                        }
                    }
                });
            };

            $scope.copyWidget = function (widget, index) {
            	$interval.cancel($scope.dashboardInterval);
                $confirm({title: "Copy Widget", ok: 'Yes', cancel: 'No', text: Messages.COPY_WIDGET_CONFIRMATION})
                        .then(function () {
                            var inputdata = {'widgetId': widget.fk_tbl_dashboard_widget_master_id, 'dashboardId': $rootScope.selectedDashboardIdForAddWidget};
                            GsmServices.savedetail(inputdata).success(function (response) {
                                if (response.responseCode === 200) {
                                    $rootScope.$emit("createNewWidget", response.responseObject);
                                    $rootScope.userTimeIntervalForOtherController();
                                    Notification.success({message: Messages.COPY_WIDGET, delay: Constants.DELAY});
                                }
                            });
                        }).catch(function(err){
                        	$rootScope.userTimeIntervalForOtherController();
	                    });
            };


            $scope.changeWidget = function (convert, widget, index) {
                var newWidget = widget;
                var inputdata = {'widgetId': widget.childWidgets, 'convert': convert.masterId};
                GsmServices.changeGraph(inputdata).success(function (response) {
                    if (response.responseCode === 200) {
                        newWidget.functionName = response.responseObject.data[0].jsfunctionname;
                        newWidget.id = widget.childWidgets;
                        newWidget.fk_tbl_dashboard_widget_master_id = response.responseObject.data[0].id;
                        newWidget.convertableGraph = response.responseObject.convert;
                        $rootScope.$emit("getDataAfterConvert", newWidget, index);
                        Notification.success({message: Messages.CHANGEGRAPH, delay: Constants.DELAY});
                        if($scope.intervals){
                    		$interval.cancel($scope.intervals[widget.childWidgets])
                    		delete $scope.intervals[widget.childWidgets];
                    	}
                    }
                });
            }
            
            
            $scope.viewGrid = function (widget, index) {
            	$interval.cancel($scope.dashboardInterval);
                $rootScope.widgetGridName = widget;
                if (widget.jsfunctionname == 'pue_line_chart' || widget.jsfunctionname == "pue_bar_chart" || widget.jsfunctionname == "bar_sensor" 
                	|| widget.jsfunctionname == "line_sensor" || widget.jsfunctionname == "line_getwithoutpuehistory" || widget.jsfunctionname == "bar_getwithoutpuehistory" 
                		|| widget.jsfunctionname == "bar_thresold" || widget.jsfunctionname == "line_thresold" || widget.jsfunctionname == "pue_area_chart" || 
                		widget.jsfunctionname == "area_getwithoutpuehistory" || widget.jsfunctionname == "area_sensor" || widget.jsfunctionname == "area_thresold")
                {
                    var rowArray = [],date = [],count = 1;
                    for (var i = 0; i < widget.chart.data.length; i++) {
                        for (var j = 0; j < widget.chart.data[i].data.length; j++) {
                            var orignalDate = moment(widget.chart.data[i].data[j][0]).format(timeFormat);
                            if (date.indexOf(orignalDate) == -1) {
                                date.push(orignalDate);
                                rowArray.push({'SrNo' : count, 'Date': orignalDate});
                                count++;
                            }
                        }
                    }
                    
                    for(var i = 0; i < widget.chart.data.length; i++) {
                    	for (var j = 0; j < rowArray.length; j++) {
                    		rowArray[j][widget.chart.data[i].name] = "-";
                    	}
                    }
                    
                    for (var i = 0; i < widget.chart.data.length; i++) {
                        var data = [];
                        for (var j = 0; j < widget.chart.data[i].data.length; j++) {
                            var orignalDate = moment(widget.chart.data[i].data[j][0]).format(timeFormat);
                           if (rowArray[j] && rowArray[j].Date == orignalDate) {
                            rowArray[j][widget.chart.data[i].name] = widget.chart.data[i].data[j][1] + widget.chart.data[i].tooltip.valueSuffix;
                            } else {
                                var dateChecker = date.indexOf(orignalDate);
                                if (dateChecker != -1) {
                                    rowArray[dateChecker][widget.chart.data[i].name] = widget.chart.data[i].data[j][1] + widget.chart.data[i].tooltip.valueSuffix;
                                } else {
                                    rowArray[j][widget.chart.data[i].name] = "-";
                                }
                            }
                        }
                    }
                }
		
			angular.forEach(rowArray, function(row, index){
				row.Date = $filter('changeDateToUTC')(moment(row.Date).valueOf());
			    angular.forEach(row, function(element, key){
			      if (key.match('.') !== -1){ delete row[key]; var newKey = key.replace(/[$&+,:\[\];=?@#|'<>.^*()%!-\. ]+/g, "_"); row[newKey] = element;}
			    });
			  });
			gridDataForWidgetsPopup(rowArray);
	    }
	           
	    function gridDataForWidgetsPopup (data) {
	        $timeout(function () {
	            $scope.opts = {
	                backdrop: true,
	                backdropClick: true,
	                dialogFade: false,
	                keyboard: true,
	                templateUrl: 'src/template/gridDataForWidgets.html',
	                controller: gridDataForWidgetsPopupCtrl,
	                resolve: {} // empty storage
	            };
	
	            $scope.opts.resolve.items = function () {
	            		return data;
	            }
	            var modalInstance = $modal.open($scope.opts);
	            modalInstance.result.then(function () {
	            }, function () {
	            });
	        }, 500);
	    };
	          
	
		  function gridDataForWidgetsPopupCtrl($scope, $modalInstance, $rootScope, Notification, items, $templateCache, $timeout) {
		  	$scope.gridDataForWidgets = {
	                toolbar: ["pdf", "excel"],
	                dataSource: {data: items, pageSize: 10},
	                excel: {fileName: $rootScope.widgetGridName.name+".xlsx", filterable: true},
	                pdf: {
	                    allPages: true,
	                    avoidLinks: true,
	                    fileName: $rootScope.widgetGridName.name+".pdf",
	                    paperSize: "A4",
	                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
	                    landscape: true,
	                    repeatHeaders: true,
	                    template: ' <div class="page-template"><div class="header"><div style="float: right">Page #: pageNum # of #: totalPages #</div>'+
	                    	'Multi-page grid with automatic page breaking</div><div class="footer">Page #: pageNum # of #: totalPages #</div></div>',
	                    scale: 0.5
	                },
	                sortable: false, groupable: false, resizable: true, filterable: false,
	                pageable: {refresh: false, pageSizes: true, buttonCount: 5},columnMenu: true,
	            };
			  
		      $scope.gridClose = function () {
		          $modalInstance.dismiss('cancel');
		          $rootScope.userTimeIntervalForOtherController();
		      };
		  }
	     
})

