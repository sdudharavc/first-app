angular.module('dashboard', [])
        .controller('DashboardCtrl', function ($scope, $rootScope, $timeout, ChartFactory, GsmServices, $modal, $timeout, Notification,
                $confirm, $q, UtilsFactory, $location, Messages, $interval, Constants, ChartDataFactory, $state) {
            
            $scope.dashboards = [];
            $scope.dashboards.widgets = [];
            $scope.dashboard = [];
            $scope.dashboard.widgets = [];
            $scope.info = [];
            /* $scope.itemList = "1"; */
            $scope.dashId = "0";
            $scope.editDashboardName = true;
            var changedPositionDashboard = [];
            $scope.intervals = [];
            $scope.dashboardInterval;
            $scope.alertInterval;
            var idForChangeDashboard = 0;
            $scope.dataFoundForDashboard = true;
            $scope.dashboardIconSlide = false;
            $scope.selectedDashboardName= " ";
            $scope.AllowWriteDashboardForCreate = true;
            
            	
            
            if(UtilsFactory.getWidgetPositionData().length!=0){
        		UtilsFactory.setWidgetPositionData("");
        	}
            
            $scope.dashboardIconSlideOpenClose = function(){
            	$scope.dashboardIconSlide = !$scope.dashboardIconSlide;
            }
            /*
			 * $scope.owl = {items: ["item 1", "item 2"],options: {loop:
			 * true,nav: false}};
			 */
            
           /*
			 * $(document).ready(function(){
			 * $('body').on('click','.dots',function(){
			 * $(this).parent().toggleClass('dashboardIconSlide');
			 * if($('.dSpecificWidget').hasClass('dashboardIconSlide')){ var
			 * i=10; $('.dashboardIconSlide .dTopIcons').each(function(){ i+=35;
			 * $(this).css('right' , i); }); } else{
			 * $('.dTopIcons').each(function(){$(this).css('right' , 0);}); }
			 * $(this).show(); }); });
			 */
            
           $rootScope.userTimeIntervalForOtherController = function(){
        	   $scope.userTimeInterval().then(function(response){
                    if(response){$scope.dashboardInterval =  $interval(dashboardIntervalCall, response.dashboardInterval,  1, true, response.intervalDashboardModeForCrtical);}
               });
           }
    		
    		$scope.userTimeInterval = function(){
    			var defer = $q.defer();
    			GsmServices.getdashbordsetting().success(function(response){
    				if(response.responseObject.data.value){
        				defer.resolve(response.responseObject.data.value);
    				}
    				else{
    					defer.resolve(false);
    				}
    			})
    			return defer.promise;
            }
    		
    		 $scope.userTimeInterval().then(function(response){
    			 if(response){$scope.alertInterval = $interval(siteAlert, response.alertInterval);}
             });
    		
    		 function siteAlert (){
            	if(window.localStorage.getItem(Constants.accessToken) && $state.is('dashboard')){
            		GsmServices.get_alerts_data().success(function (response) {
                		if(response.responseCode==200){
                			$scope.siteAlertData = {'countCriticalAlertData' : [], 'countWarningAlertData' : [], 'countFailAlertData' : [], 'countInventoryAlertData' : []};
                			var cc = 0, cw = 0, cf = 0, ci = 0; 
                			_.filter(response.responseObject.data.allalert, function(alert, i){
                				if(alert.Alert ==='CriticalMax' || alert.Alert === 'CriticalMin'){
                					$scope.siteAlertData.countCriticalAlertData[cc] = alert;
                					cc++;
                				}
                				if(alert.Alert ==='WarningMax' || alert.Alert === 'WarningMin'){
                					$scope.siteAlertData.countWarningAlertData[cw] = alert;
                					cw++;
                				}
                			});
                		}
                		_.filter(response.responseObject.data.failalert, function(alert, i){
                			$scope.siteAlertData.countFailAlertData[cf] = alert;
                			cf++;
                		});
                		_.filter(response.responseObject.data.inventoryalert, function(alert, i){
                			$scope.siteAlertData.countInventoryAlertData[ci] = alert;
                			ci++;
                		});
    	             }).error(function(){siteAlert();});
            	}else{
            		$interval.cancel($scope.alertInterval);
            	}
            }
            siteAlert();
            
            $scope.gridsterOptions = {
                margins: [10, 10], columns: 10, pushing: true, floating: true, swapping: true, width: 'auto',minSizeX: 2,minSizeY : 2, outerMargin: true, mobileBreakPoint: 900,
                mobileModeEnabled: true, colWidth: 'auto', rowHeight: 'match',
                draggable: {
                    handle: '.box-header',
                    start: function (event, $element, widget) {},
                    resize: function (event, $element, widget) {},
                    stop: function (event, $element, widget) {
                    }
                },
                resizable: {
                    enabled: true, handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
                    start: function (event, $element, widget) {$scope.intializeGridsterDrageAndResize(widget);},
                    resize: function (event, $element, widget) { $scope.intializeGridsterDrageAndResize(widget);},
                    stop: function (event, $element, widget) {$timeout(function () {$scope.intializeGridsterDrageAndResize(widget);}, 800)}
                },
            };
            
            function lockUnlock(value, readWriteStatus, AllowReadDashboard, AllowWriteDashboard){
            		if(readWriteStatus != null){
                		$scope.readWriteStatusForDash = readWriteStatus;
                	}
                	else{
                		if(AllowReadDashboard==1 && AllowWriteDashboard==1){
                			$scope.readWriteStatusForDash = 1;
                		}
                		else if(AllowReadDashboard==1 && AllowWriteDashboard==0){
                			$scope.readWriteStatusForDash = 0;
                		}
                	}
                	if(value=="0" || $scope.readWriteStatusForDash==0){
                		$scope.gridsterOptions.resizable.enabled = false;
                    	$scope.gridsterOptions.draggable.enabled = false;	
                	}else if(value=="1" && $scope.readWriteStatusForDash==1){
                		$scope.gridsterOptions.resizable.enabled = true;
                    	$scope.gridsterOptions.draggable.enabled = true;
                	}
            }
            
            $scope.lock = function(value, dashId){
            	var inputparam = {'id' :dashId };
            	if($scope.readWriteStatusForDash==1){
            		GsmServices.lockdash(inputparam).success(function(response){
	    				var index = 0;
	            		_.filter($scope.dashboards, function(data, i){
	            			if(data.id==dashId){index = i-1;
	            				if(index == -1){index=0;}}
	            		});
	            		$scope.saveAll(dashId, "lock");
	    				lockUnlock(value, $scope.dashboards[index].read_write_status, $scope.dashboards[index].AllowReadDashboard, $scope.dashboards[index].AllowWriteDashboard);
	                 	 _.filter($scope.dashboard.widgetsData, function (widget) {
	            			 $timeout(function(){
	            				 $scope.intializeGridsterDrageAndResize(widget);
	            			 }, 300);
	            		 });
            		});
            	}
            }
            
            $scope.intializeGridsterDrageAndResize = function (widget) {
                $scope.triggerResizeEvent(widget);
            }

            $scope.refreshAllWidgetdata = function(){
            	siteAlert();
            	_.filter($scope.dashboard.widgetsData, function (widget, i) {
            		$timeout(function(){
            			$scope.getWidgetdata(widget, i);
            			Notification.success({message: Messages.REFRESH_DASHBOARD, delay: Constants.DELAY});
            		},200);
            		
                });
            }
            
            $scope.$on('gridster-resized', function (sizes, gridster) {
        		 _.filter($scope.dashboard.widgetsData, function (widget) {
        			 $timeout(function(){
        				 $scope.intializeGridsterDrageAndResize(widget);
        			 }, 300);
        		 });
            });

            $scope.init = function () {
                GsmServices.getdashlist().success(function (response) {
                	if(response.responseCode == 200){
                		$scope.dashboards = response.responseObject.data;
 	             	   $scope.userTimeInterval().then(function(response){
 	                       if(response){$scope.dashboardInterval =  $interval(dashboardIntervalCall, response.dashboardInterval,  1, true, response.intervalDashboardModeForCrtical);}
 	             	   });
 	             	   if (response.responseObject.data && response.responseObject.data[0]) {
 	             		   if(window.localStorage.getItem('selectedDashboard')){
 	                    		$scope.selectedDashboardId = JSON.parse(window.localStorage.getItem('selectedDashboard')).id;
 		                        $scope.selectedDashboardName = JSON.parse(window.localStorage.getItem('selectedDashboard')).name;
 	             		   }
 	             		   else{
 	             			   $scope.selectedDashboardId = response.responseObject.data[0].id;
 	             			   $scope.selectedDashboardName = response.responseObject.data[0].name;
 	             		   }
 	             		   $scope.changeDashboard($scope.selectedDashboardId);
 	             	   }
 	             	   else{
 	             		 $scope.selectedDashboardName = "";
 	             	   }
                	}
                	else{
                		 $scope.selectedDashboardName = "";
                		Notification.error({message: response.responseMessage, delay: 3000});
        	     	}
        	     }).error(function(err){
        	    	 $scope.selectedDashboardName = "";
        	     	Notification.error({message: err.message, delay: 3000});
        	     });
            }
            	
            $scope.gridClose = function(){
            	$rootScope.userTimeIntervalForOtherController();
            }
            
            function dashboardIntervalCall(alertMode){
            	if( $scope.dashboards!=undefined && $scope.dashboards.length>0 && $state.is('dashboard')){
            		if($rootScope.selectedDashboardIdForAddWidget==undefined || $rootScope.selectedDashboardIdForAddWidget==null){
            			idForChangeDashboard = 0;
            		}
            		else{
            			 _.filter($scope.dashboards, function(dashboard, i){
            				if(dashboard.id == $rootScope.selectedDashboardIdForAddWidget){
            					idForChangeDashboard = i;
            				} 
            			}); 
            		}
                	if(idForChangeDashboard >= $scope.dashboards.length-1){
                		idForChangeDashboard = $scope.dashboards[0].id;
                	}else {
                		idForChangeDashboard = $scope.dashboards[idForChangeDashboard+ 1].id;
                	}
                	var checkCritical = _.find($scope.dashboard.widgetsData, function(widget, i){ 
                		if(widget.jsfunctionname=="pue_live" || widget.jsfunctionname=="walt_thresold" || widget.jsfunctionname=="gauge_getwithoutpuehistory" 
                			|| widget.jsfunctionname=="sensor_gauge"  && widget.data!=undefined && alertMode==true){
                			return widget.data.headerColor == true; 
                		}
                	});
                	if(checkCritical==undefined){
                		$scope.changeDashboard(idForChangeDashboard);
                	}
            	}
            	else if( $scope.dashboards!=undefined && $scope.dashboards.length>0 && !$state.is('dashboard')){
            		$interval.cancel($scope.dashboardInterval);
            	}
            }
            
            $rootScope.$on('createDashboard', function (event, newDashboard) {
	                $scope.dashboards = newDashboard.data;
	                $scope.selectedDashboardId = $scope.dashboards[$scope.dashboards.length - 1].id;
	                $scope.selectedDashboardName = $scope.dashboards[$scope.dashboards.length - 1].name;
	                if(window.localStorage.getItem('selectedDashboard')){
	                	window.localStorage.removeItem('selectedDashboard');
	                }
	                window.localStorage.setItem('selectedDashboard', JSON.stringify({id: $scope.selectedDashboardId, name :$scope.selectedDashboardName }));
	                $rootScope.selectedDashboardIdForAddWidget = $scope.selectedDashboardId;
	                $scope.dashboard = {};
	                $scope.dashboard.widgetsData = {};
	                $scope.dataFoundForDashboard = false;
	                $scope.AllowWriteDashboardForCreate = true;
	                UtilsFactory.setWidgetPositionData(JSON.stringify($scope.dashboard.widgetsData));
            });

            function checkSavePosition(){
            	if(UtilsFactory.getWidgetPositionData().length!=0){
            		changedPositionDashboard = JSON.parse(UtilsFactory.getWidgetPositionData());
            	}
            	if(changedPositionDashboard.length==0 || changedPositionDashboard[0] == undefined){
            		var status = true;
            	}
            	else{
            		var status = false;
            		var stop = false;
            		_.filter(changedPositionDashboard, function(widget, i){
            			if(stop==false && $scope.dashboard.widgetsData && $scope.dashboard.widgetsData[i]){
                				if(widget.col == $scope.dashboard.widgetsData[i].col && widget.row == $scope.dashboard.widgetsData[i].row && 
                        				widget.sizeX  == $scope.dashboard.widgetsData[i].sizeX && widget.sizeY == $scope.dashboard.widgetsData[i].sizeY){
                        			status = true;
                        			stop = false;
                        		}
                        		else{
                        			 status = false;
                        			 stop = true;
                			}
            			}
                	});
            	}
            	return status;
            }
            
            $scope.changeDashboard = function (id) {
            	status = checkSavePosition();
            	if(status=='true' || !$scope.gridsterOptions.resizable.enabled){
            		$scope.changeDashboard2(id);
            	}
            	else{
            		$interval.cancel($scope.dashboardInterval);
            		 $confirm({title: "Save Dashboard", ok: 'Yes', cancel: 'No', text: Messages.POSITION_WIDGET_CHANGED_SETTING})
	                    .then(function() {
	                   	 	$scope.saveAll($rootScope.selectedDashboardIdForAddWidget);
	                   	 	$scope.changeDashboard2(id);
	                   	 	$rootScope.userTimeIntervalForOtherController();
	                    }).catch(function(err){
	                    	$scope.changeDashboard2(id);
	                    	$rootScope.userTimeIntervalForOtherController();
	                    });
            	}
            }
            
            $scope.changeDashboard2 = function(id){
            	$scope.editDashboardName = true;
            	$scope.dataFoundForDashboard = true;
            	$scope.selectedDashboardId = id;
            	$scope.dashboard.widgetsData = {};
            	_.each($scope.intervals, function(interval){
            		$interval.cancel(interval)
            	});
            	$scope.intervals.length = 0;
                $rootScope.selectedDashboardIdForAddWidget = id;
                
                $scope.widgetList = {};
            	if(id!=null){
                    var param = {'dashboard_id': id}
                    GsmServices.getdashlist(param).success(function (response) {
                    		$scope.selectedDashboardName = response.responseObject.data[0].name;
                    		lockUnlock(response.responseObject.data[0].lockstatus, response.responseObject.data[0].read_write_status, response.responseObject.data[0].AllowReadDashboard,
                    				response.responseObject.data[0].AllowWriteDashboard);
                    		$scope.userid = response.responseObject.data[0].created_user_id;
                    		if(response.responseObject.data[0].AllowReadDashboard==1 && response.responseObject.data[0].AllowWriteDashboard==1){
                    			$scope.AllowWriteDashboardForCreate = true;
                    		}
                    		else if(response.responseObject.data[0].AllowReadDashboard==1 && response.responseObject.data[0].AllowWriteDashboard==0){
                    			$scope.AllowWriteDashboardForCreate = false;
                    		}
                    		UtilsFactory.setWidgetPositionData(JSON.stringify($scope.dashboard.widgetsData));
                            if(window.localStorage.getItem('selectedDashboard')){
        	                	window.localStorage.removeItem('selectedDashboard');
        	                }
        	                window.localStorage.setItem('selectedDashboard', JSON.stringify({id: id, name :$scope.selectedDashboardName }));
                            if (response.responseCode == 200 && response.responseObject.data[0] != undefined && response.responseObject.data[0].detail.length > 0) {
                            	$scope.dataFoundForDashboard = true;
                                $scope.widgetList = response.responseObject.data[0].detail;
                                if ($scope.widgetList != 'undefined' && $scope.widgetList.length > 0) {
                                    for (j in $scope.widgetList) {
                                        // skelton of widget intialized
                                        $scope.dashboard.widgetsData[j] = {};
                                        $scope.dashboard.widgetsData[j].chart = {};
                                        $scope.dashboard.widgetsData[j].col = parseInt($scope.widgetList[j].col);
                                        $scope.dashboard.widgetsData[j].row = parseInt($scope.widgetList[j].row);
                                        $scope.dashboard.widgetsData[j].sizeX = parseInt($scope.widgetList[j].width);
                                        $scope.dashboard.widgetsData[j].sizeY = parseInt($scope.widgetList[j].height);
                                        $scope.dashboard.widgetsData[j].minSizeX = parseInt($scope.widgetList[j].minsizex);
                                        $scope.dashboard.widgetsData[j].minSizeY = parseInt($scope.widgetList[j].minsizey);
                                        $scope.dashboard.widgetsData[j].jsfunctionname = $scope.widgetList[j].jsfunctionname;
                                        $scope.dashboard.widgetsData[j].name = $scope.widgetList[j].name;
                                        $scope.dashboard.widgetsData[j].fk_tbl_dashboard_widget_master_id = $scope.widgetList[j].fk_tbl_dashboard_widget_master_id;
                                        $scope.dashboard.widgetsData[j].widgetname = $scope.widgetList[j].widgetname;
                                        $scope.dashboard.widgetsData[j].childWidgets = $scope.widgetList[j].childWidgets;
                                        $scope.dashboard.widgetsData[j].style = $scope.widgetList[j].pos_setting;
                                        $scope.dashboard.widgetsData[j].api_url = $scope.widgetList[j].api_url;
                                        $scope.dashboard.widgetsData[j].showLoading = true;
                                        $scope.dashboard.widgetsData[j].convertableGraph = $scope.widgetList[j].convertableGraph;
                                        if($scope.widgetList[j].convertableGraph != undefined){
                                        	$scope.dashboard.widgetsData[j].changeGraphIcon = $scope.widgetList[j].convertableGraph.length == 0 ? false : true;
                                        }else{
                                        	 $scope.dashboard.widgetsData[j].changeGraphIcon  = false;
                                        }
                                        $scope.dashboard.widgetsData[j].chart.api = {};
                                        
                                        if ($scope.widgetList[j].jsfunctionname === "chart_notes") {
                                            $scope.dashboard.widgetsData[j].setting = {'title': $scope.widgetList[j].setting.title, 'description': $scope.widgetList[j].setting.description};
                                        }
                                        if ($scope.widgetList[j].jsfunctionname === "chart_label" && $scope.widgetList[j].setting !=null && $scope.widgetList[j].setting.label !== undefined) {
                                            $scope.dashboard.widgetsData[j].data.label = $scope.widgetList[j].setting.label;
                                        }
                                        // resizing event
                                        $scope.triggerResizeEvent($scope.dashboard.widgetsData[j]);
                                    }
                                    UtilsFactory.setWidgetPositionData(JSON.stringify($scope.dashboard.widgetsData));
                                }
                            }
                            else{
                            	$scope.dataFoundForDashboard = false;
                            }
                    }).error(function(){
                    	$scope.dataFoundForDashboard = false;
                    	$scope.changeDashboard2(id);
                    })
            	}
            }
            
            var getWidgetDataAfterSaveListener = $rootScope.$on('getWidgetDataAfterSave', function (event, widget, index) {
            	widget.jsfunctionname = widget.functionName;
            	widget.childWidgets = widget.id;
            	if($scope.dashboard.widgetsData!==undefined && $scope.dashboard.widgetsData[index]!==undefined){
            		$scope.dashboard.widgetsData[index].name = widget.name;
                    $scope.dashboard.widgetsData[index].widgetname = widget.widgetname;
                	$scope.getWidgetdata(widget, index);
            	}
            });
            
            $scope.$on('$destroy', getWidgetDataAfterSaveListener); 
            
            $rootScope.$on('getDataAfterConvert', function (event, widget, index) {
            	widget.jsfunctionname = widget.functionName;
            	widget.childWidgets = widget.id;
            	if($scope.dashboard.widgetsData[index]!==undefined){
            		$scope.dashboard.widgetsData[index].name = widget.name;
                        $scope.dashboard.widgetsData[index].widgetname = widget.widgetname;
                        $scope.dashboard.widgetsData[index].convertableGraph = widget.convertableGraph;
                        $scope.dashboard.widgetsData[index].changeGraphIcon = widget.convertableGraph.length > 0 ? true : false;
                	$scope.getWidgetdata(widget, index);	
            	}
            })
            
            $scope.$on('rackView', function (event, response, index) {
            	if($scope.dashboard.widgetsData !== undefined){
            		$scope.dashboard.widgetsData[index].data.rackElevationData = response.responseObject.data.rackElevationData[0];
                    /*
					 * _.filter($scope.dashboard.widgetsData[index].data,
					 * function(img, i){
					 * $scope.dashboard.widgetsData[index].data[i] = null; })
					 */
            		$scope.dashboard.widgetsData[index].data.img = [];
                    $scope.dashboard.widgetsData[index].data.style = [];
                    
                    for (var i = 0; i < response.responseObject.data.rackElevationData.length; i++) {
                        var rackPosition = response.responseObject.data.rackElevationData[i].newRackElevationData.ConnectionX1;
                        var deviceName = response.responseObject.data.rackElevationData[i].newRackElevationData.DeviceName;
                        var deviceHeight = response.responseObject.data.rackElevationData[i].newRackElevationData.Heightu;
                        image = response.responseObject.data.rackElevationData[i].imageDisplay;
                        if (rackPosition > 6) {
                            rackPosition = Math.round(rackPosition / 6);
                        } else {
                            rackPosition = 0;
                        }
                        var height = 14.24 * deviceHeight;
	                     var marginTop = -(height - 7.12);
                        $scope.dashboard.widgetsData[index].data.img[rackPosition+1] = 'data:image/png;base64,' + image ;
                        $scope.dashboard.widgetsData[index].data.style[rackPosition+1] = {"height": height + 'px',"margin-top":marginTop + 'px'};
                    }
                    $scope.dashboard.widgetsData[index].data.viewName = response.responseObject.data.viewName;
            	}
            });
            

            function getIntervalTime(update_interval, liveInterval){
	           	 var intervalTime = 240000000000000;
	          		 if(update_interval.intervalType === "Live"){
	          			 intervalTime = liveInterval;
	          		 }
	          		 else if(update_interval.intervalType === "Second"){
	          			 intervalTime = 1000 * update_interval.intervalTime;
	          		 }
	          		 else if(update_interval.intervalType === "Minute"){
	          			 intervalTime = 1000 * 60 * update_interval.intervalTime;
	          		 }
	          		 else if(update_interval.intervalType === "Hour"){
	          			 intervalTime = 1000 * 60 * 60 * update_interval.intervalTime;
	          		 }
	          	  return intervalTime;
            }
            
            function intervalgetwidgetdata(widget, index){
            	if($scope.intervals[widget.childWidgets]){$interval.cancel($scope.intervals[widget.childWidgets])};
	            	if(widget!==undefined && index!==undefined && $scope.dashboard.widgetsData && $scope.dashboard.widgetsData!==undefined && $state.is('dashboard')){
	            		$timeout(function(){
	            			$scope.getWidgetdata(widget, index, false);
            		},400);
            	}else if(widget!==undefined && index!==undefined && $scope.dashboard.widgetsData && $scope.dashboard.widgetsData!==undefined && !$state.is('dashboard')){
            		_.each($scope.intervals, function(interval){
                		$interval.cancel(interval)
                	})
            	}
            }
            
            $scope.getWidgetdata = function (widget, index, value) {
            	$timeout(function(){
            		if(value == undefined){value = true;}
            		if($scope.intervals[widget.childWidgets]){$interval.cancel($scope.intervals[widget.childWidgets])};
            		if($scope.dashboard.widgetsData[index].data==undefined){
            			$scope.dashboard.widgetsData[index].data = {};	
            		}
	            	$scope.dashboard.widgetsData[index].showLoading= value;
	                $scope.dashboard.widgetsData[index].lastUpdated = new Date();
	                if (widget.jsfunctionname === "chart_spider") {
	                	 var inputParam = {"childWidgets": widget.childWidgets}; 
	                	 GsmServices.getuspace(inputParam).success(function (response) {
	                		 UtilsFactory.setSpiderchartData(JSON.stringify(response.responseObject), widget.childWidgets);
	                		 if(response.responseObject.setting.length!=0){
		               			 $scope.dashboard.widgetsData[index].configureWidget = true;
		               		 }else{
		               			 $scope.dashboard.widgetsData[index].configureWidget = false;
		               		 }
	                		 if(response.responseObject.data!==undefined && response.responseObject.data.length!== 0){
		                		 ChartFactory.spiderChart.data(widget, response.responseObject).then(function(response2){
		                			$scope.dashboard.widgetsData[index].dataFound = true;
			                        $scope.dashboard.widgetsData[index].showLoading= false;
			                        $scope.dashboard.widgetsData[index].retryError= false;
			                        $scope.$apply;
			                        $timeout(function(){
			                        	$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
			                        },1);
			                        var update_interval = response.responseObject.setting.update_interval;
			             			if(update_interval){
		                        		var time = getIntervalTime(update_interval, Constants.UPDATE_INTERVAL_LIVE);
		                        		if($scope.intervals[widget.childWidgets]){
		                        			$interval.cancel($scope.intervals[widget.childWidgets]);
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        		else{
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        	}
		                		 })
	                		 }
	                		 else{
	                			 $scope.dashboard.widgetsData[index].dataFound = false;
	                			 $scope.dashboard.widgetsData[index].showLoading= false;
	                			 $scope.dashboard.widgetsData[index].retryError= false;
			                     $scope.$apply;
			                     $scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
	                		 }
	                	 }).error(function(e){
	                		 	$scope.dashboard.widgetsData[index].showLoading= false;
	 		      		 		$scope.dashboard.widgetsData[index].retryError= true;
	 		      		 		$scope.getWidgetdata(widget, index);
	                	 });
	                } else if (widget.jsfunctionname === "chart_floor_spider") {
		               	 var inputParam = {"childWidgets": widget.childWidgets}; 
		            	 GsmServices.getubyfloor(inputParam).success(function (response) {
		            		 UtilsFactory.setSpiderchartData(JSON.stringify(response.responseObject), widget.childWidgets);
		            		 if(response.responseObject.setting.length!=0){
		               			 $scope.dashboard.widgetsData[index].configureWidget = true;
		               		 }else{
		               			 $scope.dashboard.widgetsData[index].configureWidget = false;
		               		 }
		            		 if(response.responseObject.data!==undefined && response.responseObject.data.length!== 0){
		                		 ChartFactory.spiderFloorChart.data(widget, response.responseObject).then(function(response2){
		                			 $scope.dashboard.widgetsData[index].dataFound = true;
			                        $scope.dashboard.widgetsData[index].showLoading= false;
			                        $scope.dashboard.widgetsData[index].retryError= false;
			                        $scope.$apply;
			                        $timeout(function(){$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);},1);
			                        var update_interval = response.responseObject.setting.update_interval;
			             			if(update_interval){
		                        		var time = getIntervalTime(update_interval, Constants.UPDATE_INTERVAL_LIVE);
		                        		if($scope.intervals[widget.childWidgets]){
		                        			$interval.cancel($scope.intervals[widget.childWidgets]);
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        		else{
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        	}
		                		 })
		            		 }
		            		 else{
		            			 	$scope.dashboard.widgetsData[index].dataFound = false;
			                        $scope.dashboard.widgetsData[index].showLoading= false;
			                        $scope.dashboard.widgetsData[index].retryError= false;
			                        $scope.$apply;
		                        	$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
		            		 }
		            	 }).error(function(e){
		            		 	$scope.dashboard.widgetsData[index].showLoading= false;
				      		 	$scope.dashboard.widgetsData[index].retryError= true;
				      		 	$scope.getWidgetdata(widget, index);
		            	 });
	            } 
	            else if (widget.jsfunctionname === "line_thresold" || widget.jsfunctionname === "area_thresold" || widget.jsfunctionname === "bar_thresold" ||
	            		widget.jsfunctionname === "pue_line_chart" || widget.jsfunctionname === "pue_area_chart" || widget.jsfunctionname === "pue_bar_chart" || 
	            		widget.jsfunctionname === "line_getwithoutpuehistory" || widget.jsfunctionname === "area_getwithoutpuehistory"  || widget.jsfunctionname === "bar_getwithoutpuehistory" ||
	            		widget.jsfunctionname === "line_sensor" || widget.jsfunctionname === "area_sensor" || widget.jsfunctionname === "bar_sensor") {
	            	var inputParam = {"childWidgets": widget.childWidgets};
	              	 GsmServices.getHistoryGraphsData(inputParam, widget.jsfunctionname).success(function (response) {
	              		if(response.responseObject.setting.length!=0){
	               			 $scope.dashboard.widgetsData[index].configureWidget = true;
	               		 }else{
	               			 $scope.dashboard.widgetsData[index].configureWidget = false;
	               		 }
	              		 UtilsFactory.setHistoryGraphData(JSON.stringify(response.responseObject), widget.childWidgets);
		           		 ChartDataFactory.getDataForChart.data(widget.jsfunctionname, widget, response).then(function(data){
				             		$scope.dashboard.widgetsData[index].chart.data = data;
				             		if(data==null){
				             			$scope.dashboard.widgetsData[index].dataFound = false;
				             		}
				             		else{
			             				ChartFactory.lineBarAreaHighChartStock.data(widget, data, response.responseObject.data[0]);
				             			$scope.dashboard.widgetsData[index].dataFound = true;
				             			if($scope.intervals[widget.childWidgets]){
				             				delete $scope.intervals[widget.childWidgets];
				             			}
				             			var update_interval = response.responseObject.setting.update_interval;
				             			if(update_interval){
			                        		var time = getIntervalTime(update_interval, Constants.UPDATE_INTERVAL_LIVE_FOR_HISTORY);
			                        		if($scope.intervals[widget.childWidgets]){
			                        			$interval.cancel($scope.intervals[widget.childWidgets]);
			                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
			                        		}
			                        		else{
			                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
			                        		}
			                        	}
				             		}
				             		$scope.dashboard.widgetsData[index].showLoading= false;
				             		$scope.dashboard.widgetsData[index].retryError= false;
				             		$scope.$apply;
				             		$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
				                });
		           	 }).error(function(e){
			           		$scope.dashboard.widgetsData[index].showLoading= false;
			      		 	$scope.dashboard.widgetsData[index].retryError= true;
			      		 	$scope.getWidgetdata(widget, index);
		           	 });
	           }else if (widget.jsfunctionname === "chart_map") {
	                    ChartFactory.mapChart.data(widget);
           			 	$scope.dashboard.widgetsData[index].configureWidget = true;
	                    $scope.dashboard.widgetsData[index].showLoading= false;
	                    $scope.dashboard.widgetsData[index].dataFound = true;
	                    $scope.$apply;
	                    $scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
            } else if (widget.jsfunctionname === "walt_thresold") {
	                    ChartFactory.waltThresholdChart.data(widget).then(function(response){
	                    	if(response=="NaN"){
	                    		$scope.dashboard.widgetsData[index].dataFound = false;
	                    		$scope.dashboard.widgetsData[index].configureWidget = false;
	                    		$scope.dashboard.widgetsData[index].retryError= false;
	                    	}
	                    	else if(response=="error"){ 
	                    		$scope.dashboard.widgetsData[index].retryError= true;
	                    		 $scope.dashboard.widgetsData[index].configureWidget = true;
	                    		$scope.dashboard.widgetsData[index].dataFound = true;
	                    		$scope.dashboard.widgetsData[index].showLoading= false;
	                    		$scope.getWidgetdata(widget, index);
	                    	}else{
		                    	UtilsFactory.setGaugeUI(response, widget.childWidgets);
		                    	data = JSON.parse(UtilsFactory.getWaltThresholdData(widget.childWidgets));
		                    	 $scope.dashboard.widgetsData[index].configureWidget = true;
		                    	$scope.dashboard.widgetsData[index].retryError= false;
		                    	if(data.data!==undefined && data.data.length!== 0){
		                    		
		                    		$scope.dashboard.widgetsData[index].data.CriticalMax = data.data[0].CriticalMax;
		                    		$scope.dashboard.widgetsData[index].data.WarnMax = data.data[0].WarnMax;
		                    		$scope.dashboard.widgetsData[index].data.CriticalMin = data.data[0].CriticalMin;
		                    		$scope.dashboard.widgetsData[index].data.WarnMin = data.data[0].WarnMin;
		                    		if((parseFloat(data.data[0].CriticalMax)==0 || data.data[0].CriticalMax==null)  && (parseFloat(data.data[0].WarnMax)==0 || data.data[0].WarnMax==null) && 
		                    				(parseFloat(data.data[0].CriticalMin)==0 || data.data[0].CriticalMin==null) && (parseFloat(data.data[0].WarnMin)==0 || data.data[0].WarnMin==null)){
		                    			$scope.dashboard.widgetsData[index].data.headerColor = false;
		                    		}
		                    		else{
		                    			if(parseFloat(data.data[0].MetricValue) > parseFloat(data.data[0].CriticalMax) || parseFloat(data.data[0].MetricValue) < parseFloat(data.data[0].CriticalMin)){
		                    				$scope.dashboard.widgetsData[index].data.headerColor = true;
		                    			}
		                    			else{
		                    				$scope.dashboard.widgetsData[index].data.headerColor = false;
		                    			}
		                    		}
		                    		
		                    		$scope.dashboard.widgetsData[index].data.headerColorInput = data.setting.headerColorInput;
	                    			$scope.dashboard.widgetsData[index].data.img = data.setting.walt_metrix;
	                    			$scope.dashboard.widgetsData[index].widgetname = data.setting.powerMetriceItem.NamePath;
	                    			if($scope.dashboard.widgetsData[index].data.img == "Humidity"){
	                    				$scope.dashboard.widgetsData[index].data.metric = "%";
	                    			}
	                    			else{
	                    				$scope.dashboard.widgetsData[index].data.metric = data.setting.walt_metrix;
	                    			}
		                    		$scope.dashboard.widgetsData[index].dataFound = true;
		                    		$scope.dashboard.widgetsData[index].showLoading= false;
		                    		$scope.$apply;
		                        	$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
		                        	var update_interval = data.setting.update_interval;
			             			if(update_interval){
		                        		var time = getIntervalTime(update_interval, Constants.UPDATE_INTERVAL_LIVE);
		                        		if($scope.intervals[widget.childWidgets]){
		                        			$interval.cancel($scope.intervals[widget.childWidgets]);
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        		else{
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        	}
		                    	}else{
		                    		$scope.dashboard.widgetsData[index].data.CriticalMax = "-";
		                			$scope.dashboard.widgetsData[index].data.CriticalMin = "-";
		            				$scope.dashboard.widgetsData[index].data.WarnMax = "-";
		            				$scope.dashboard.widgetsData[index].dataFound = false;
		        					$scope.dashboard.widgetsData[index].data.WarnMin = "-";
		        					$scope.dashboard.widgetsData[index].showLoading= false;
		        					$scope.$apply;
		                        	$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
		                    	}
	                    	}
	                    	
	                    	$scope.dashboard.widgetsData[index].showLoading= false;
		                    $scope.$apply;
		                    $scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
	                    });
	                } else if (widget.jsfunctionname === "sensor_gauge") {
	                    ChartFactory.sensorGaugeChart.data(widget).then(function(response){
	                    	if(response=="NaN"){
	                    		$scope.dashboard.widgetsData[index].dataFound = false;
	                    		$scope.dashboard.widgetsData[index].configureWidget = false;
	                    		$scope.dashboard.widgetsData[index].retryError= false;
	                    	}else if(response=="error"){
	                    		$scope.dashboard.widgetsData[index].retryError= true;
	                    		$scope.dashboard.widgetsData[index].dataFound = true;
	                    		$scope.dashboard.widgetsData[index].configureWidget = true;
	                    		$scope.dashboard.widgetsData[index].showLoading= false;
	                    		$scope.getWidgetdata(widget, index);
	                    	}
	                    	else{
		                    	UtilsFactory.setGaugeUI(response, widget.childWidgets);
		                    	$scope.dashboard.widgetsData[index].retryError= false;
		                    	$scope.dashboard.widgetsData[index].configureWidget = true;
		                    	data = JSON.parse(UtilsFactory.getSensorGaugeData(widget.childWidgets));
		                    	if(data.data!==undefined && data.data.length!== 0){
		                    		$scope.dashboard.widgetsData[index].data = data.data[0];
		                    		if((parseFloat(data.data[0].CriticalMax)==0 || data.data[0].CriticalMax==null)  && (parseFloat(data.data[0].WarnMax)==0 || data.data[0].WarnMax==null) && 
		                    				(parseFloat(data.data[0].CriticalMin)==0 || data.data[0].CriticalMin==null) && (parseFloat(data.data[0].WarnMin)==0 || data.data[0].WarnMin==null)){
		                    			$scope.dashboard.widgetsData[index].data.headerColor = false;
		                    		}
		                    		else{
		                    			if(parseFloat(data.data[0].metricvalue) > parseFloat(data.data[0].CriticalMax) || parseFloat(data.data[0].metricvalue) < parseFloat(data.data[0].CriticalMin)){
		                    				$scope.dashboard.widgetsData[index].data.headerColor = true;
		                    			}
		                    			else{
		                    				$scope.dashboard.widgetsData[index].data.headerColor = false;
		                    			}
		                    		}
		                    		$scope.dashboard.widgetsData[index].data.headerColorInput = data.setting.headerColorInput;
		                    		$scope.dashboard.widgetsData[index].widgetname = data.setting.Sensor.NamePath;
		                    		$scope.dashboard.widgetsData[index].data.img = response.metric;
		                    		if($scope.dashboard.widgetsData[index].data.img == "Humidity"){
	                    				$scope.dashboard.widgetsData[index].data.metric = "%";
	                    			}
	                    			else{
	                    				$scope.dashboard.widgetsData[index].data.metric = data.setting.walt_metrix;
	                    			}
		                    		$scope.dashboard.widgetsData[index].showLoading= false;
		                    		$scope.dashboard.widgetsData[index].dataFound = true;
		                            $scope.$apply;
		                        	$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
		                        	var update_interval = data.setting.update_interval;
			             			if(update_interval){
		                        		var time = getIntervalTime(update_interval, Constants.UPDATE_INTERVAL_LIVE);
		                        		if($scope.intervals[widget.childWidgets]){
		                        			$interval.cancel($scope.intervals[widget.childWidgets]);
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        		else{
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        	}
		                    	}else{
		                    		$scope.dashboard.widgetsData[index].data.CriticalMax = "-";
		                			$scope.dashboard.widgetsData[index].data.CriticalMin = "-";
		                			$scope.dashboard.widgetsData[index].dataFound = false;
		            				$scope.dashboard.widgetsData[index].data.WarnMax = "-";
		        					$scope.dashboard.widgetsData[index].data.WarnMin = "-";
		        					$scope.dashboard.widgetsData[index].showLoading= false;
		                            $scope.$apply;
		                        	$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);			
		                    	}
	                    	}
	                    	$scope.dashboard.widgetsData[index].showLoading= false;
		                    $scope.$apply;
		                    $scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
	                    });
	                } 
			         else if (widget.jsfunctionname === "pue_live" || widget.jsfunctionname === "gauge_getwithoutpuehistory") {
		                    ChartFactory.pueLive.data(widget).then(function(response){
		                    	if(response=="NaN"){
		                    		$scope.dashboard.widgetsData[index].dataFound = false;
		                    		$scope.dashboard.widgetsData[index].configureWidget = false;
		                    		$scope.dashboard.widgetsData[index].retryError= false;
		                    	}else if(response=="error"){
		                    		$scope.dashboard.widgetsData[index].retryError= true;
		                    		$scope.dashboard.widgetsData[index].configureWidget = true;
		                    		$scope.dashboard.widgetsData[index].dataFound = true;
		                    		$scope.dashboard.widgetsData[index].showLoading= false;
		                    		$scope.getWidgetdata(widget, index);
		                    	}
		                    	else{
		                    		data = JSON.parse(UtilsFactory.getPueData(widget.childWidgets));
		                    		$scope.dashboard.widgetsData[index].retryError= false;
		                    		$scope.dashboard.widgetsData[index].configureWidget = true;
			                    	UtilsFactory.setGaugeUI(response, widget.childWidgets);
	                           	if(data.data!==undefined && data.data.length!== 0){
	                           		$scope.dashboard.widgetsData[index].data = data.data[0];
	                           		if((parseFloat(data.data[0].CriticalMax)==0 || data.data[0].CriticalMax==null)  && (parseFloat(data.data[0].WarnMax)==0 || data.data[0].WarnMax==null) && 
		                    				(parseFloat(data.data[0].CriticalMin)==0 || data.data[0].CriticalMin==null) && (parseFloat(data.data[0].WarnMin)==0 || data.data[0].WarnMin==null)){
		                    			$scope.dashboard.widgetsData[index].data.headerColor = false;
		                    		}
		                    		else{
		                    			if(parseFloat(data.data[0].value) > parseFloat(data.data[0].CriticalMax) || parseFloat(data.data[0].value) < parseFloat(data.data[0].CriticalMin)){
		                    				$scope.dashboard.widgetsData[index].data.headerColor = true;
		                    			}
		                    			else{
		                    				$scope.dashboard.widgetsData[index].data.headerColor = false;
		                    			}
		                    		}
	                           		$scope.dashboard.widgetsData[index].data.headerColorInput = data.setting.headerColorInput;
	                           		$scope.dashboard.widgetsData[index].data.img = response.metric;
	                           		$scope.dashboard.widgetsData[index].widgetname = data.setting.formula.FormulaTitle;
	                           		if($scope.dashboard.widgetsData[index].data.img == "Humidity"){
	                    				$scope.dashboard.widgetsData[index].data.metric = "%";
	                    			}
	                    			else{
	                    				$scope.dashboard.widgetsData[index].data.metric = data.setting.walt_metrix;
	                    			}
	                           		$scope.dashboard.widgetsData[index].showLoading= false;
	                           		$scope.dashboard.widgetsData[index].dataFound = true;
	                                  $scope.$apply;
	                               	$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
	                           	}else{
	                           		$scope.dashboard.widgetsData[index].data.CriticalMax = "-";
	                       			$scope.dashboard.widgetsData[index].data.CriticalMin = "-";
	                       			$scope.dashboard.widgetsData[index].dataFound = false;
	                   				$scope.dashboard.widgetsData[index].data.WarnMax = "-";
	               					$scope.dashboard.widgetsData[index].data.WarnMin = "-";
	               					$scope.dashboard.widgetsData[index].showLoading= false;
	                                   $scope.$apply;
	                               	$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);			
	                           	}
			                    	if(data.data!==undefined && data.data.length!== 0){
				             			$scope.dashboard.widgetsData[index].dataFound = true;
				             			var update_interval = data.setting.update_interval;
				             			if(update_interval){
			                        		var time = getIntervalTime(update_interval, Constants.UPDATE_INTERVAL_LIVE);
			                        		if($scope.intervals[widget.childWidgets]){
			                        			$interval.cancel($scope.intervals[widget.childWidgets]);
			                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
			                        		}
			                        		else{
			                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
			                        		}
			                        	}
				             		}
				             		else{
				             			$scope.dashboard.widgetsData[index].dataFound = false;
				             		}
		                    	}
		                    	$scope.dashboard.widgetsData[index].showLoading= false;
			                    $scope.$apply;
			                    $scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
		                    });
		                } else if (widget.jsfunctionname === "chart_notes") {
				         	ChartFactory.chartnotes.data(widget).then(function(data){
	               			 	$scope.dashboard.widgetsData[index].configureWidget = true;
				         		$scope.dashboard.widgetsData[index].data.title = data.setting.title;
				         		$scope.dashboard.widgetsData[index].data.description =  data.setting.description;
				         		$scope.dashboard.widgetsData[index].dataFound = true;
				         		 $scope.dashboard.widgetsData[index].showLoading= false;
				 			 });
			         }else if (widget.jsfunctionname === "chart_label") {
				         	ChartFactory.chartlabel.data(widget).then(function(data){
				         		$scope.dashboard.widgetsData[index].configureWidget = true;
				         		if(data.setting == null){
				         			$scope.dashboard.widgetsData[index].data.label = "Add Label";
				         			$scope.dashboard.widgetsData[index].showLoading= false;
				         			$scope.dashboard.widgetsData[index].dataFound = true;
				         		}
				         		else{
				         			$scope.dashboard.widgetsData[index].dataFound = true;
				         			$scope.dashboard.widgetsData[index].data.label = data.setting.label;
				         			$scope.dashboard.widgetsData[index].showLoading= false;
				         		}
				 			 });
			         }
			         else if (widget.jsfunctionname == 'getRackElevationData') {
			        	 $scope.dashboard.widgetsData[index].data.labels = [];
			        	 $scope.dashboard.widgetsData[index].data.data = [];
	
			        	 $scope.dashboard.widgetsData[index].data.rackElevation = '';
			        	 $scope.dashboard.widgetsData[index].data.rackSiteDetail = '';
			        	 $scope.dashboard.widgetsData[index].data.rackMetricValues = '';
			        	 $scope.dashboard.widgetsData[index].data.rackAvailableUSpace = '';
			        	 $scope.dashboard.widgetsData[index].data.rackDeviceColor = '';
			        	 $scope.dashboard.widgetsData[index].data.rackAllGSMUKey = '';
			             $scope.dashboard.widgetsData[index].data.totalNoRackSlot = 42;
			             $scope.dashboard.widgetsData[index].data.rackView = 'front';
			             $scope.dashboard.widgetsData[index].data.viewName = 'Front Side';
			             $scope.dashboard.widgetsData[index].data.rackUSlot = 6;
			             $scope.dashboard.widgetsData[index].data.selectedForApproval = [2, 10];
			             var inputParam = {"childWidgets": widget.childWidgets};
			             GsmServices.get_rack_elevation_data(inputParam).success(function (response) {
			            	 if(response.responseObject.setting.length!=0){
			            		 $scope.dashboard.widgetsData[index].configureWidget = true;
			            	 }
			            	 else{
			            		 $scope.dashboard.widgetsData[index].configureWidget = false;
			            	 }
			            	 UtilsFactory.setRackElevationChartData(JSON.stringify(response.responseObject), widget.childWidgets);
			            	 if(response.responseObject.data!=undefined && response.responseObject.data.availPosition!=undefined){
				            	 $scope.dashboard.widgetsData[index].data.rackElevationData = response.responseObject.data.rackElevationData[0];
				            	 /*
									 * if($scope.dashboard.widgetsData[index].data.img &&
									 * $scope.dashboard.widgetsData[index].data.img.length>0)
									 */
				            	/*
								 * _.filter($scope.dashboard.widgetsData[index].data.img,
								 * function(img, i){
								 * $scope.dashboard.widgetsData[index].data.img[i] =
								 * null; console.log() })
								 */
				            	 $scope.dashboard.widgetsData[index].data.img = [];
				            	 $scope.dashboard.widgetsData[index].data.style = [];
				                 for (var i = 0; i < response.responseObject.data.rackElevationData.length; i++) {
				                     var rackPosition = response.responseObject.data.rackElevationData[i].newRackElevationData.ConnectionX1;
				                     var deviceName = response.responseObject.data.rackElevationData[i].newRackElevationData.DeviceName;
				                     var deviceHeight = response.responseObject.data.rackElevationData[i].newRackElevationData.Heightu;
				                     var image = response.responseObject.data.rackElevationData[i].imageDisplay;
				                     if (rackPosition > 6) {
			                             rackPosition = parseInt(Math.round(rackPosition / 6));
				                     } else {
				                         rackPosition = 0;
				                     }
				                     var height = 14.24 * deviceHeight;
				                     var marginTop = -(height - 7.12);
				                     $scope.dashboard.widgetsData[index].data.img[rackPosition+1] = 'data:image/png;base64,' + image ;
				                     $scope.dashboard.widgetsData[index].data.style[rackPosition+1] = {"height": height + 'px',"margin-top":marginTop + 'px'};
				                 }
				                 $scope.dashboard.widgetsData[index].data.rackTempValues = response.responseObject.data.rackTempValues;
				                 $scope.dashboard.widgetsData[index].data.newConnectionX1Position = response.responseObject.data.newConnectionX1Position;
				                 $scope.dashboard.widgetsData[index].data.rackSiteDetail = response.responseObject.data.rackSiteDetail[0];
				                 $scope.dashboard.widgetsData[index].data.rackMetricValues = response.responseObject.data.rackMetricValues;
				                 $scope.dashboard.widgetsData[index].data.rackAvailableUSpace = response.responseObject.data.rackAvailableUSpace[0];
				                 $scope.dashboard.widgetsData[index].data.rackDeviceColor = response.responseObject.data.rackDeviceColor;
				                 $scope.dashboard.widgetsData[index].data.rackAllGSMUKey = response.responseObject.data.rackAllGSMUKey;
				                 $scope.dashboard.widgetsData[index].data.rackNewRPCData = response.responseObject.data.newRpcData;
				                 $scope.dashboard.widgetsData[index].data.viewName = response.responseObject.data.viewName;
				                 $scope.dashboard.widgetsData[index].data.sensorData = response.responseObject.data.sensorData;
				                 $scope.dashboard.widgetsData[index].data.availPosition = response.responseObject.data.availPosition;
				                 $scope.dashboard.widgetsData[index].dataFound = true;
				                 $scope.dashboard.widgetsData[index].data.index = index;
				                 var update_interval = response.responseObject.setting.update_interval;
		             				if(update_interval){
		                        		var time = getIntervalTime(update_interval, Constants.UPDATE_INTERVAL_LIVE);
		                        		if($scope.intervals[widget.childWidgets]){
		                        			$interval.cancel($scope.intervals[widget.childWidgets]);
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        		else{
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        	}
			            	 }
			            	 else{
			            		 $scope.dashboard.widgetsData[index].dataFound = false;
			            	 }
			                 $scope.dashboard.widgetsData[index].showLoading= false;
			                 $scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
			             });
			         }
			         else if (widget.jsfunctionname === "getFloor") {
	                             var inputParam = {"childWidgets": widget.childWidgets};
	                             GsmServices.getFloorImage(inputParam).success(function (response) {
	                            	 if(response.responseObject.setting.length!=0){
	    			            		 $scope.dashboard.widgetsData[index].configureWidget = true;
	    			            	 }
	    			            	 else{
	    			            		 $scope.dashboard.widgetsData[index].configureWidget = false;
	    			            	 }
				            	 	UtilsFactory.setFloorImage(JSON.stringify(response.responseObject), widget.childWidgets);
		                        	if(response.responseObject.data[0] !== undefined && response.responseObject.data[0].FloorImage != null){
		                        		$scope.dashboard.widgetsData[index].dataFound = true;
		                        		$scope.dashboard.widgetsData[index].data.imgData = response.responseObject.data[0].FloorImage;
		                        		$scope.dashboard.widgetsData[index].showLoading= false;
		   			            	 	$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
		   			            	 	var update_interval = response.responseObject.setting.update_interval;
			             				if(update_interval){
			                        		var time = getIntervalTime(update_interval, Constants.UPDATE_INTERVAL_LIVE);
			                        		if($scope.intervals[widget.childWidgets]){
			                        			$interval.cancel($scope.intervals[widget.childWidgets]);
			                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
			                        		}
			                        		else{
			                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
			                        		}
			                        	}
		                        	}
		                        	else{
		                        		$scope.dashboard.widgetsData[index].showLoading= false;
		                        		$scope.dashboard.widgetsData[index].dataFound = false;
		   			            	 	$scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
		                        	}
				             });
			         }
			         else if (widget.jsfunctionname === 'chart_cabinet') {
			             if ($scope.dashboard.widgetsData[index].data.cabinet === undefined) {
			            	 $scope.dashboard.widgetsData[index].data.cabinet = {};
			            	 $scope.dashboard.widgetsData[index].data.cabinetSetting = {};
			             }
			             var inputParam = {"childWidgets": widget.childWidgets};
			             GsmServices.getInfoData(inputParam).success(function (response) {
			            	 if(response.responseObject.setting && response.responseObject.setting.length!=0){
			            		 $scope.dashboard.widgetsData[index].configureWidget = true;
			            	 }
			            	 else{
			            		 $scope.dashboard.widgetsData[index].configureWidget = false;
			            	 }
			            	 if(response.responseObject.data[0]!==undefined){
			            		 $scope.dashboard.widgetsData[index].dataFound = true;
				                 UtilsFactory.setInfoChartData(JSON.stringify(response.responseObject), widget.childWidgets);
				                 $scope.dashboard.widgetsData[index].data.cabinet[widget.childWidgets] = response.responseObject.data[0];
				                 $scope.dashboard.widgetsData[index].data.cabinetSetting[widget.childWidgets] = response.responseObject.setting;
				                 $scope.dashboard.widgetsData[index].showLoading= false;
				                 $scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
				                 var update_interval = response.responseObject.setting.update_interval;
		             				if(update_interval){
		                        		var time = getIntervalTime(update_interval, Constants.UPDATE_INTERVAL_LIVE);
		                        		if($scope.intervals[widget.childWidgets]){
		                        			$interval.cancel($scope.intervals[widget.childWidgets]);
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        		else{
		                        			$scope.intervals[widget.childWidgets] = $interval(intervalgetwidgetdata, time, 1, true, widget, index);
		                        		}
		                        	}
			            	 }
			            	 else{
			            		 $scope.dashboard.widgetsData[index].dataFound = false;
			            		 UtilsFactory.setInfoChartData(JSON.stringify(response.responseObject), widget.childWidgets);
			            		 $scope.dashboard.widgetsData[index].data.cabinetSetting[widget.childWidgets] = response.responseObject.setting;
			            		 $scope.dashboard.widgetsData[index].showLoading= false;
				                 $scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
			            	 }
			             });
			         }
			         else if (widget.jsfunctionname == 'chart_digital') {
			             var inputParam = {"childWidgets": widget.childWidgets};
			             GsmServices.getThresoldData(inputParam).success(function (response) {
		            		 $scope.dashboard.widgetsData[index].configureWidget = true;
			            	 $scope.dashboard.widgetsData[index].dataFound = true;
			                 var meterResponse = response.data.result;
			                 $scope.dashboard.widgetsData[index].showLoading= false;
			                 $scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
			             })
			         }
	                $scope.intializeGridsterDrageAndResize($scope.dashboard.widgetsData[index]);
            	},100);
            }

            $scope.addwidget = function (widgetId) {
                var inputdata = {'widgetId': widgetId, 'dashboardId': $rootScope.selectedDashboardIdForAddWidget};
                GsmServices.savedetail(inputdata).success(function (response) {
                    if (response.responseCode === 200) {
                        $rootScope.$emit("createNewWidget", response.responseObject);
                        Notification.success({message: Messages.SUCCESSFULLY_ADDED_WIDGET, delay: Constants.DELAY});
                    }
                });
            }
            
            $rootScope.$on('createNewWidget', function (event, dashboardList) {
                var insertWidgetId = 0;
                if ($scope.dashboard.widgetsData === undefined) {
                    $scope.dashboard.widgetsData = [];
                } else {
                    insertWidgetId = Object.keys($scope.dashboard.widgetsData).length;
                }
                $scope.widgetList = {};
                var selectedDashboard = _.find(dashboardList.data, function (dash) {
                    return dash.id == dashboardList.lastId;
                });
                var getWidgetId = (selectedDashboard.detail.length) - 1;
                var newWidget = selectedDashboard.detail[getWidgetId];
                if (dashboardList.data.length > 0 && insertWidgetId !== undefined) {
                    $scope.dataFoundForDashboard = true;
                    $scope.dashboard.widgetsData[insertWidgetId] = {chart : {},
                    		childWidgets : newWidget.childWidgets,
                    		chart : {api : {}},
                    		col : parseInt(newWidget.col),
                    		sizeY : parseInt(newWidget.height),
                            minSizeX : parseInt(newWidget.minsizex),
                            minSizeY : parseInt(newWidget.minsizey),
                            jsfunctionname : newWidget.jsfunctionname,
                            name : newWidget.name,
                            fk_tbl_dashboard_widget_master_id : newWidget.fk_tbl_dashboard_widget_master_id,
                            widgetname : newWidget.widgetname,
                            style : newWidget.pos_setting,
                            row : parseInt(newWidget.row),
                            sizeX : parseInt(newWidget.width),
                            api_url : newWidget.api_url,
                            showLoading : true,
                            convertableGraph : newWidget.convertableGraph,};
                    if(newWidget.convertableGraph != undefined){
                    	$scope.dashboard.widgetsData[insertWidgetId].changeGraphIcon = newWidget.convertableGraph.length == 0 ? false : true;
                    }else{
                    	 $scope.dashboard.widgetsData[insertWidgetId].changeGraphIcon  = false;
                    }
                    if (newWidget.jsfunctionname === "chart_notes") {
                        $scope.dashboard.widgetsData[insertWidgetId].setting = {'title': newWidget.setting.title, 'description': newWidget.setting.description};
                    }
                    if (newWidget.jsfunctionname === "chart_label" && newWidget.setting != null && newWidget.setting.label != undefined) {
                        $scope.dashboard.widgetsData[insertWidgetId].data.label = newWidget.setting.label;
                    }
                    $scope.widgetList = $scope.dashboard.widgetsData;
                    $scope.triggerResizeEvent($scope.dashboard.widgetsData[insertWidgetId]);
                }

            });

            // clear dashboard widgets
            $scope.clearDashboardWidgets = function () {
            	$interval.cancel($scope.dashboardInterval);
                $confirm({title: "Clear Dashboard", ok: 'Yes', cancel: 'No', text: Messages.CLEAR_DASHBOARD_CONFIRMATION})
                    .then(function () {
                        if (typeof $scope.dashboard.widgetsData[0] != 'undefined') {
                            var inputdata = {'dashboardId': $rootScope.selectedDashboardIdForAddWidget};
                            GsmServices.clearWidget(inputdata).success(function (response) {
                                if (response.responseCode == 200) {
                                    $scope.dashboard.widgetsData = [];
                                    UtilsFactory.setWidgetPositionData(JSON.stringify($scope.dashboard.widgetsData));
                                    Notification.success({message: Messages.CLEARED_DASHBOARD_WIDGET, delay: Constants.DELAY});
                                    _.each($scope.intervals, function(interval){
                                		$interval.cancel(interval)
                                	})
                                	$scope.intervals.length = 0;
                             	   	$scope.userTimeInterval().then(function(response){
                                       if(response){$scope.dashboardInterval =  $interval(dashboardIntervalCall, response.dashboardInterval,  1, true, response.intervalDashboardModeForCrtical);}
                                  });
                                }
                            });
                        } else {
                            Notification.success({message: Messages.EMPTY_DASHBOARD, delay: Constants.DELAY});
                     	   	$scope.userTimeInterval().then(function(response){
                               if(response){$scope.dashboardInterval =  $interval(dashboardIntervalCall, response.dashboardInterval,  1, true, response.intervalDashboardModeForCrtical);}
                          });
                        }
                    });
            };

            // edit notes and labels
            $scope.EditNote = function (widget, index) {
            	$interval.cancel($scope.dashboardInterval);
                if ($scope.dashboard.widgetsData[index].editMode === undefined || !$scope.dashboard.widgetsData[index].editMode) {
                    $scope.dashboard.widgetsData[index].editMode = true;
                } else {
                    $scope.dashboard.widgetsData[index].editMode = false;
                }
            }

            // save notes and labels
            $scope.SaveNote = function (widget, index) {
                if (!$scope.dashboard.widgetsData[index].editMode) {
                    $scope.dashboard.widgetsData[index].editMode = true;
                } else {
                    $scope.dashboard.widgetsData[index].editMode = false;
                }
                var inputdata = {};
                inputdata.widgetsData = {
                        'sizeX': widget.sizeX,
                        'sizeY': widget.sizeY,
                        'col': widget.col,
                        'row': widget.row,
                        'id': widget.childWidgets,
                        'name': widget.name,
                        'widgetname': widget.widgetname,
                        'functionName': widget.jsfunctionname
                    };
                inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget ;
                inputdata.settings = widget.data ;
                GsmServices.save_widget_setting(inputdata).success(function (response) {
                	Notification.success({message: Messages.NOTE_SAVED_SUCCESSFULLY, delay: Constants.DELAY});
                	$rootScope.userTimeIntervalForOtherController();
                });
            }
            
            // adding new widgets popup
            $scope.addWidgetPopup = function (selectedDashboardId) {
                if (selectedDashboardId) {
                	$interval.cancel($scope.dashboardInterval);
                	var pop2info = [];
                    GsmServices.gethtml().success(function (response) {
                        if (response.responseCode == 200) {
                            if (response.responseObject.data.length > 0) {
                               pop2info = response.responseObject.data;
                            }
                        }
                    });
                    $timeout(function () {
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            templateUrl: 'src/template/addWidgetPopup.html',
                            controller: addWidgetPopupCtrl,
                            resolve: {
                            } // empty storage
                        };
                        $scope.opts.resolve.item = function () {
                            return pop2info;
                        }

                        var modalInstance = $modal.open($scope.opts);
                        modalInstance.result.then(function () {
                        }, function () {
                        });
                    }, 500);
                } else {
                    Notification.success({message: Messages.SelectDashboard_FIRST, delay: Constants.DELAY});
                }
            };

            var addWidgetPopupCtrl = function ($scope, $modalInstance, $modal, item, $window, _) {
                $scope.tabshow = 1;
                $scope.charts =_.filter(item, function(widget){ return widget.type== "Charts"; });
                $scope.gauges =_.filter(item, function(widget){ return widget.type== "Gauge"; });
                $scope.others =_.filter(item, function(widget){ return widget.type== "Other"; });
                $scope.ok = function () {
                    $modalInstance.close();
             	   /*
					 * $scope.userTimeInterval().then(function(response){
					 * if(response){$scope.dashboardInterval =
					 * $interval(dashboardIntervalCall,
					 * response.dashboardInterval, 1, true,
					 * response.intervalDashboardModeForCrtical);} });
					 */
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
             	   /*
					 * $scope.userTimeInterval().then(function(response){
					 * if(response){$scope.dashboardInterval =
					 * $interval(dashboardIntervalCall,
					 * response.dashboardInterval, 1, true,
					 * response.intervalDashboardModeForCrtical);} });
					 */
                };
            }
            

            $scope.createDashboardPopup = function () {
            	  var userList;
        		GsmServices.searchuser().success(function (response) {
        			_.filter(response.responseObject.data, function(userlist, i){
        				if(userlist.AllowReadDashboard == 1){
							response.responseObject.data[i].AllowReadDashboard = true;
							response.responseObject.data[i].disableRead = false;
            			}else{
            				response.responseObject.data[i].AllowReadDashboard = false;
            				response.responseObject.data[i].disableRead = true;
            			}
            			if(userlist.AllowWriteDashboard == 1){
            				response.responseObject.data[i].AllowWriteDashboard = true;
            				response.responseObject.data[i].disableWrite = false;
            			}
            			else {
            				response.responseObject.data[i].AllowWriteDashboard = false;
            				response.responseObject.data[i].disableWrite = true;
            			}
        			});
        			userList = response.responseObject.data;
        		}).error(function(e){
            		  
        		});
            	$interval.cancel($scope.dashboardInterval);
                $timeout(function () {
                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        templateUrl: 'src/template/createDashboard.html',
                        controller: createDashboardPopupCtrl,
                        resolve: {} // empty storage
                    };

                    $scope.opts.resolve.items = function () {
                    		return userList
                    }
                    var modalInstance = $modal.open($scope.opts);
                    modalInstance.result.then(function () {
                    }, function () {
                    });
                }, 500);
            };


            function createDashboardPopupCtrl($scope, $modalInstance, $rootScope, Notification, items, $templateCache) {
            	
            	 $scope.checkReadWriteStatus = function(dashboardAdminList){
         			var countRead = 0, countWrite = 0;
         			_.filter(dashboardAdminList, function(list, i){
         				if(list.AllowReadDashboard==true){countRead = countRead + 1;}
         				if(list.AllowWriteDashboard==true){countWrite = countWrite + 1;}
         			})
         			if(dashboardAdminList.length==countRead){$scope.countReadCheck = true;
         			}else{$scope.countReadCheck = false;}
         			if(dashboardAdminList.length==countWrite){$scope.countWriteCheck = true;}
         			else{$scope.countWriteCheck = false;}
                 }
            	 $scope.checkReadWriteStatus(items);
            	/*
				 * $scope.gridOptionsForCreateDashboard = { data: items,
				 * enableHorizontalScrollbar : 1, enableVerticalScrollbar : 1,
				 * enableColumnResizing: true, exporterMenuCsv: false,
				 * exporterMenuAllData : false, exporterMenuVisibleData : false,
				 * enableGridMenu: true, columnDefs: [{ name:'Sr no.',
				 * cellTemplate: '<div
				 * ng-bind="grid.renderContainers.body.visibleRowCache.indexOf(row)+1"
				 * class="ui-grid-cell-contents"></div>', enableFiltering:
				 * false, filter: {noTerm: true}, enableSorting: false, width:
				 * 80 }, { name: 'User', width:"*", field: "FirstName",
				 * resizable: true,groupable: true, cellTemplate: '<div
				 * class="ui-grid-cell-contents"
				 * ng-bind="row.entity.FirstName+\' \'+row.entity.LastName"></div>' }, {
				 * field: 'Read', cellTemplate: '<div
				 * class="ui-grid-cell-contents admin-check-boxes"><label
				 * for="{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}\'+read\'" '
				 * +'class="check-size cheked-color"
				 * ng-class="{\'disabledInputCheckBoxForUser\'
				 * :row.entity.disableRead}">'+ '<input class="gridInputButton"
				 * id="{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}\'+read\'"
				 * type="checkbox" ng-model="row.entity.AllowReadDashboard" '
				 * +'ng-disabled="row.entity.disableRead"
				 * ng-click="(row.entity.AllowWriteDashboard ==true &&
				 * row.entity.AllowReadDashboard ==false) ?' +'
				 * row.entity.AllowWriteDashboard=false : nothing"> <span
				 * class="ic"></span></label><div>', headerCellTemplate: '<div
				 * class="ui-grid-cell-contents admin-check-boxes"><label
				 * for="\'+read\'" class="check-size cheked-color">'+ '<input
				 * class="gridInputButton" id="\'+read\'" type="checkbox"
				 * ng-model=\'grid.appScope.countReadCheck\' '
				 * +'ng-click=\'grid.appScope.tickUntickAll("read",
				 * grid.appScope.countReadCheck)\'> <span class="ic"></span>Read</label></div>',
				 * width: 80, enableFiltering: false, filter: {noTerm: true},
				 * enableSorting: false },{ field: 'Write', cellTemplate:'<div
				 * class="ui-grid-cell-contents admin-check-boxes" ><label
				 * for="{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}\'+write\'" '
				 * +'class="check-size cheked-color "
				 * ng-class="{\'disabledInputCheckBoxForUser\'
				 * :row.entity.disableWrite}">' +'<input
				 * class="gridInputButton"
				 * id="{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}\'+write\'"
				 * type="checkbox" ng-model="row.entity.AllowWriteDashboard"' +'
				 * ng-disabled="row.entity.disableWrite"
				 * ng-click="(row.entity.AllowReadDashboard ==false ||
				 * row.entity.AllowReadDashboard == undefined) ?
				 * row.entity.AllowReadDashboard=true : '
				 * +'row.entity.AllowReadDashboard=true"> <span class="ic"></span></label><div>',
				 * headerCellTemplate: '<div class="ui-grid-cell-contents
				 * admin-check-boxes"><label for="\'+write\'" class="check-size
				 * cheked-color">'+ '<input class="gridInputButton"
				 * id="\'+write\'" type="checkbox"
				 * ng-model=\'grid.appScope.countWriteCheck\'
				 * ng-click=\'grid.appScope.tickUntickAll("write",
				 * grid.appScope.countWriteCheck)\'>' +'<span class="ic"></span>Write</label></div>',
				 * width: 80, enableFiltering: false, filter: {noTerm: true},
				 * enableSorting: false }], onRegisterApi: function(gridApi){
				 * $scope.gridApi = gridApi; } };
				 */
            	
            	$scope.gridOptionsForCreateDashboard = {
			              sortable: true, groupable: true, resizable: true, filterable: true,
			              pageable: {refresh: false, pageSizes: true, buttonCount: 5},
			              columns: [
			              	/*
							 * { title:'Sr no.', width:100,lockable: true,
							 * template: "<div >{{cellIndex()}}</div>", },
							 */{ 	title: "User", field: 'FirstName' ,  width:120,lockable: true, template: '<div ng-bind="dataItem.FirstName+\' \'+dataItem.LastName"></div>'
			  		    	},{ 	title: "Read", width:120, lockable: true, template: '<div class="admin-check-boxes"><label for="{{dataItem.UserID}}\'read\'" class="check-size cheked-color" ng-class="{\'disabledInputCheckBoxForUser\' :dataItem.disableRead}">'+
			  	    			'<input class="gridInputButton" id="{{dataItem.UserID}}\'read\'" type="checkbox" ng-model="dataItem.AllowReadDashboard" ng-disabled="dataItem.disableRead"'
			  	    			+'ng-click="(dataItem.AllowWriteDashboard ==true && dataItem.AllowReadDashboard ==false) ? dataItem.AllowWriteDashboard=false : nothing;checkReadWriteStatus(gridOptionsForCreateDashboard.dataSource.data)">'
			  	    			+'<span class="ic"></span></label></div>',
			  	    			headerTemplate:'<div class="admin-check-boxes"><label for="\'read\'" class="check-size cheked-color">'+
				    			'<input class="gridInputButton" id="\'read\'" type="checkbox" ng-model=\'countReadCheck\' ng-click=\'tickUntickAll("read", countReadCheck, $event)\'>'
				    			+'<span class="ic"></span>Read</label></div>',
			  		    	},{ 	title: "Write", width:140,lockable: true,
			  		    		template: '<div  class="admin-check-boxes" ><label for="{{dataItem.UserID}}\'write\'" class="check-size cheked-color " ng-class="{\'disabledInputCheckBoxForUser\' :dataItem.disableWrite}">'
			  	    			+'<input class="gridInputButton" id="{{dataItem.UserID}}\'write\'" type="checkbox" ng-model="dataItem.AllowWriteDashboard" ng-disabled="dataItem.disableWrite"' 
			  	    			+'ng-click="dataItem.AllowReadDashboard=true; checkReadWriteStatus(gridOptionsForCreateDashboard.dataSource.data)">'
			  	    			+'<span class="ic"></span></label></div>',
			  	    			headerTemplate: '<div class="admin-check-boxes"><label for="\'write\'" class="check-size cheked-color">'+
			  	    			'<input class="gridInputButton" id="\'write\'" type="checkbox" ng-model=\'countWriteCheck\' ng-click=\'tickUntickAll("write", countWriteCheck, $event)\'>'
			  	    			+'<span class="ic"></span>Write</label></div>',
			  		    	}],
			  		    	columnMenu: true,
			     		    dataSource: {data: items, pageSize: 14},
			          };
            	
            	$scope.tickUntickAll = function(value, status, event){
            		var grid = $(event.target).closest("[kendo-grid]").data("kendoGrid");
                    var items = grid.dataSource.data();
            		_.filter(items, function(row, i){
            			if(value=="read"){
            				$scope.gridOptionsForCreateDashboard.dataSource.data[i].AllowReadDashboard = row.AllowReadDashboard = status ? true : false;
            				if(row.AllowWriteDashboard ==true && row.AllowReadDashboard ==false){
            					$scope.gridOptionsForCreateDashboard.dataSource.data[i].AllowWriteDashboard = row.AllowWriteDashboard = false; 
            				}
            			}
            			else if(value=="write"){
            				if(row.disableWrite===false){
            					$scope.gridOptionsForCreateDashboard.dataSource.data[i].AllowWriteDashboard = row.AllowWriteDashboard = status ? true : false;
        						$scope.gridOptionsForCreateDashboard.dataSource.data[i].AllowReadDashboard = row.AllowReadDashboard = status ? true : false;
            				}
            				else{
            					$scope.gridOptionsForCreateDashboard.dataSource.data[i].AllowWriteDashboard = row.AllowWriteDashboard = false;
            					$scope.gridOptionsForCreateDashboard.dataSource.data[i].AllowReadDashboard = row.AllowReadDashboard = status ? true : false;
            				}
            			}
            		});
            		/* $scope.checkReadWriteStatus($scope.gridOptionsForCreateDashboard.data); */
            	}
            	
                $scope.createNewDashboard = function (data) {
                    if (data !== undefined && data.txtDashName) {
                    	var userlist = {};
                    	_.filter($scope.gridOptionsForCreateDashboard.dataSource.data, function(user, i){
                    			if(user.AllowReadDashboard == true && user.AllowWriteDashboard==true){
                    				userlist[i] = {};
                    				userlist[i].read_write_status = 1;
                    				userlist[i].user_id = user.UserID;
                    			}
                    			else if(user.AllowReadDashboard == true && (user.AllowWriteDashboard == false || user.AllowWriteDashboard == undefined)){
                    				userlist[i] = {};
                    				userlist[i].read_write_status = 0;
                    				userlist[i].user_id = user.UserID;
                    			}
                    	});
                        var inputData = {'title': data.txtDashName, 'user_list' :userlist};
                        GsmServices.create(inputData).success(function (response) {
                            if (response.responseCode == 200) {
                                $rootScope.$emit("createDashboard", response.responseObject);
                                $modalInstance.close('closed');
                                Notification.success({message: Messages.DASHBOARD_CREATED_SUCCESSFULLY, delay: Constants.DELAY});
                            } else if (response.responseCode == 400) {
                                Notification.error({message: response.responseMessage, delay: Constants.DELAY});
                            }
                            $rootScope.userTimeIntervalForOtherController();
                        });
                    } else {
                        Notification.error({message: Messages.EMPTY_DASHBOARD_NAME, delay: Constants.DELAY});
                    }
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                    $rootScope.userTimeIntervalForOtherController();
                };
            }
       
            $scope.alertDataListingModel = function (data, popupData) {
                
                var checkModal = false;
                var defer = $q.defer();
                GsmServices.getdashbordsetting().success(function (response) {
                    checkModal = (response.responseCode == 500) ? false : true;
                    if (response.responseObject.data && response.responseCode != 500) {
                        defer.resolve(response.responseObject.data.grid_option);
                    } else {
                        defer.resolve(false);
                    }
                })

            	$interval.cancel($scope.dashboardInterval);
            	var template='src/template/alertDataListing.html';
            	var modalName = "";
            	if(data=="fail"){modalName = "Fail Over Alert";}
            	else if(data=="inventory"){modalName = "Inventory Alert";}
            	else if(data == "warning"){modalName = "Warning Alert";}
            	else{modalName = "Critical Alert";}
            	
                    $timeout(function () {
                        if(checkModal===true){
                            $scope.opts = {
                                backdrop: true,
                                backdropClick: true,
                                dialogFade: false,
                                keyboard: true,
                                templateUrl: template, 
                                controller: AlertDataListingCtrl,
                                resolve: {
                                /*
								 * 'item' : popupData, 'name' : modalName
								 */
                                } // empty storage
                            };
                            $scope.opts.resolve.item = function () {
                                return popupData;
                            }
                            $scope.opts.resolve.dashboardSetting = function () {
                                return defer.promise;
                            }
                            $scope.opts.resolve.name = function () {
                                return modalName;
                            }
                            var modalInstance = $modal.open($scope.opts);
                            modalInstance.result.then(function () {
                            }, function () {
                            });
                        }
                    }, 500);
                
            };

            var AlertDataListingCtrl = function ($scope, $modalInstance, $modal, item, name, $window, $timeout, dashboardSetting) {
                $scope.modelName = name;
                console.log(dashboardSetting);
                if(dashboardSetting==null){
                	dashboardSetting = {};
                	dashboardSetting.fOA = null;
                	dashboardSetting.inv = null;
                	dashboardSetting.warCrit = null;
                }
                $scope.GridBram = {};
                if(name == "Warning Alert" || name == "Critical Alert" ){
                	$scope.gridOptionsForAlerts = {
                            toolbar: ["pdf", "excel"],
                            excel: {fileName: name + ".xlsx", filterable: true},
                            pdf: {
                                allPages: true,
                                avoidLinks: true,
                                fileName: name+ ".pdf",
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
                            	{field: 'Alert',  width:100,lockable: true, template: "<div ng-bind=\"dataItem.Alert\" "
                            		+"ng-class=\"{'alertRed' : dataItem.Alert == 'CriticalMax','alertYellow' : dataItem.Alert == 'WarningMax',"
                            		+"'alertLightBlue' : dataItem.Alert == 'WarningMin', 'alertPurple' : dataItem.Alert == 'CriticalMin'}\"></div>"
             		    	},{ 	field: 'Type' ,  width:120,lockable: true,
             		    	},{ 	field: 'Metric' ,  width:100,lockable: true,
             		    	},{ 	field: 'Name' , width:"*", minWidth: 120,lockable: true,
             		    	},{ 	title: "Floor Plan", field: 'FloorName' ,  width:120,lockable: true,
             		    	},{ 	title: "Cabinet", field: 'CabinetName' ,  width:120,lockable: true,
             		    	},{ 	field: 'AlertDateTime' ,  width:140,lockable: true, template: "<div ng-bind=\"(dataItem.AlertDateTime | changeDateToUTC)\"></div>"
             		    	},{ 	field: 'Value' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.Value | number: 2)\"></div>"
             		    	},{ 	field: 'EmailStatus' ,  width:120,lockable: true,
             		    	},{ 	field: 'CriticalMax' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.CriticalMax | number: 2)\"></div>"
             		    	},{ 	field: 'WarnMax' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.WarnMax | number: 2)\"></div>"
             		    	},{ 	field: 'WarnMin' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.WarnMin | number: 2)\"></div>"
             		    	},{ 	field: 'CriticalMin' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.CriticalMin | number: 2)\"></div>"
             		    	},{ 	field: 'AlertDifference' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.AlertDifference | number: 2)\"></div>"
             		    	},{ 	field: 'Severity' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.Severity | number: 2)\"></div>"
             		    	},{ 	field: 'GraphDays1' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.GraphDays1 | number: 2)\"></div>"
             		    	},{ 	field: 'GraphDays2' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.GraphDays2 | number: 2)\"></div>"
             		    	},{ 	field: 'GraphDays3' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.GraphDays3 | number: 2)\"></div>"
             		    	}],
               		    	columnMenu: true,
                   		    dataSource: {data: item, pageSize: 10},
                        };
                	$timeout(function(){
                		if(dashboardSetting.warCrit){
                    		$scope.GridBram.setOptions(JSON.parse(dashboardSetting.warCrit));
                    	}
                	}, 1000)
                	
                }
                
                
                /*
				 * $scope.save = function () { savedState =
				 * kendo.stringify($scope.GridBram.getOptions());
				 * console.log(test);
				 *  }
				 */
                

                $scope.saveState = function(type){
                	 var kenDoUiOption = kendo.stringify($scope.GridBram.getOptions());
                	if(type == "Warning Alert" || type == "Critical Alert" ){
                		var inputParams = {grid_option : {warCrit : kenDoUiOption, fOA : dashboardSetting.fOA, inv : dashboardSetting.inv}};
                	}
                	else if (type== "Fail Over Alert"){
                		var inputParams = {grid_option : {fOA : kenDoUiOption, warCrit : dashboardSetting.warCrit, inv : dashboardSetting.inv}};
                	}
                	else if (type== "Inventory Alert"){
                		var inputParams = {grid_option : {fOA : dashboardSetting.fOA, warCrit : dashboardSetting.warCrit, inv : kenDoUiOption}};
                	}
         			GsmServices.updateDashboardSetting(inputParams).success(function(response){
         				if(response.responseCode==200){
         					Notification.success({message : response.responseMessage, delay : Constants.DELAY });
         				}
         				else{
         					Notification.error({message : response.responseMessage, delay : Constants.DELAY });
         				}
         			})
                }
                /*
				 * $("#save").click(function (e) { e.preventDefault();
				 * localStorage["kendo-grid-options"] =
				 * kendo.stringify($scope.gridOptionsForAlerts.getOptions());
				 * });
				 */
                /*
				 * $timeout(function(){$(".ui-grid-viewport").mCustomScrollbar({
				 * axis: "xy" // horizontal scrollbar });}, 10);
				 */
                if(name == "Fail Over Alert" ){
                	$scope.gridOptionsForAlerts = {
                            toolbar: ["pdf", "excel"],
                            excel: {fileName: name + ".xlsx", filterable: true},
                            pdf: {
                                allPages: true,
                                avoidLinks: true,
                                fileName: name+ ".pdf",
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
                            	{ 	field: 'Alert',  width:100,lockable: true,
                 		    	},{ 	title: "Floor Plan", field: 'FloorName' , width:"*", minWidth: 120,lockable: true,
                 		    	},{ 	title: "Cabinet", field: 'CabinetName' ,  width:120,lockable: true, 
                 		    	},{ 	field: 'AlertDateTime' ,  width:140,lockable: true, template: "<div ng-bind=\"(dataItem.AlertDateTime | changeDateToUTC)\"></div>"
                 		    	},{ 	field: 'FailOverSituation' ,  width:120,lockable: true,
                 		    	},{ 	field: 'Source1' ,  width:120,lockable: true,
                 		    	},{ 	field: 'Source2' ,  width:120,lockable: true, 
                 		    	},{ 	field: 'SourceReading1' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.SourceReading1 | number: 2)\"></div>"
                 		    	},{ 	field: 'SourceReading2' ,  width:120,lockable: true, template: "<div ng-bind=\"(dataItem.SourceReading2 | number: 2)\"></div>"
                 		    	},{ 	field: 'SourceReadingDate1' ,  width:140,lockable: true, template: "<div ng-bind=\"(dataItem.SourceReadingDate1 | changeDateToUTC)\"></div>"
                 		    	},{ 	field: 'SourceReadingDate2' ,  width:140,lockable: true, template: "<div ng-bind=\"(dataItem.SourceReadingDate2 | changeDateToUTC)\"></div>"
                 		    	},{ 	field: 'EmailStatus' ,  width:120,lockable: true,
                 		    	}],
               		    	columnMenu: true,
                   		    dataSource: {data: item, pageSize: 10},
                        };
                	$timeout(function(){
                		if(dashboardSetting.fOA){
                    		$scope.GridBram.setOptions(JSON.parse(dashboardSetting.fOA));
                    	}
                	}, 1000)
                }
               
                
                if(name == "Inventory Alert" ){
                	$scope.gridOptionsForAlerts = {
                            toolbar: ["pdf", "excel"],
                            excel: {fileName: name + ".xlsx", filterable: true},
                            pdf: {
                                allPages: true,
                                avoidLinks: true,
                                fileName: name+ ".pdf",
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
                            	{ 	field: 'Operation',  width:100,lockable: true
                		    	},{ 	title: "Floor Plan", field: 'FloorName' ,  width:"*", minWidth: 120,lockable: true
                		    	},{ 	title: "Cabinet", field: 'CabinetName' ,  width:120,lockable: true
                		    	},{ 	title: "Device", field: 'DeviceName' ,  width:120,lockable: true
                		    	},{ 	field: 'NotificationDate' ,  width:140,lockable: true, template: "<div ng-bind=\"(dataItem.NotificationDate | changeDateToUTC)\"></div>"
                		    	},{ 	title: "Site", field: 'SiteName' ,  width:100,lockable: true
                		    	},{ 	field: 'Status' ,  width:120,lockable: true
                		    	},{ 	field: 'UPosition' ,  width:120,lockable: true,  template: "<div ng-bind=\"(dataItem.UPosition | number: 2)\"></div>"
                		    	}],
               		    	columnMenu: true,
                   		    dataSource: {data: item, pageSize: 10},
                        };
                	$timeout(function(){
                		if(dashboardSetting.inv){
                    		$scope.GridBram.setOptions(JSON.parse(dashboardSetting.inv));
                    	}
                	}, 1000)
                }

                $scope.ok = function () {
                    $modalInstance.close();
                    $rootScope.userTimeIntervalForOtherController();
                };
                
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                    $rootScope.userTimeIntervalForOtherController();
                };
                
            }
            
            
            $scope.rackPositionPopup = function (data) {
            	$interval.cancel($scope.dashboardInterval);
            	var template= "";
            	template='src/template/rackPositionPopup.html';
            	
                $timeout(function () {
                    $scope.opts = {
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: true,
                        templateUrl: template, 
                        controller: rackPositionPopupCtrl,
                        resolve: {
                        } // empty storage
                    };
                    $scope.opts.resolve.item = function () {
                        return data;
                    }

                    var modalInstance = $modal.open($scope.opts);
                    modalInstance.result.then(function () {
                    }, function () {
                    });
                }, 500);
            };

            var rackPositionPopupCtrl = function ($scope, $modalInstance, $modal, item, $window) {
                $scope.item = item;
               
                $scope.ok = function () {
                    $modalInstance.close();
             	   	$scope.userTimeInterval().then(function(response){
                       if(response){$scope.dashboardInterval =  $interval(dashboardIntervalCall, response.dashboardInterval,  1, true, response.intervalDashboardModeForCrtical);}
             	   	});
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
             	   	$scope.userTimeInterval().then(function(response){
                       if(response){$scope.dashboardInterval =  $interval(dashboardIntervalCall, response.dashboardInterval,  1, true, response.intervalDashboardModeForCrtical);}
             	   	});
                };
                
            }
            
            
            $scope.deleteDashboard = function(id){
            	$interval.cancel($scope.dashboardInterval);
            	$confirm({title: "Delete Dashboard", ok: 'Yes', cancel: 'No', text: Messages.DELETE_DASHBOARD_CONFIRMATION})
                .then(function () {
                		if(id!=undefined){
                			var input = {"dashboardId" : id };
			            	GsmServices.deletedashboard(input).success(function(data){
			            		var index = 0;
			            		$scope.dashboards = _.filter($scope.dashboards, function(data, i){  
			            			if(data.id==id){index = i-1;
			            				if(index == -1){index=0;}}
			            			return data.id !== id; 
			            		});
			            		if ($scope.dashboards.length!==0) {
			                        $scope.selectedDashboardId = $scope.dashboards[index].id;
			                        $scope.selectedDashboardName = $scope.dashboards[index].name;
			                        $scope.changeDashboard2($scope.selectedDashboardId);
			                    }
			            		else{
			            			 $scope.selectedDashboardName = "";
			            		}
			            		 Notification.success({message: Messages.DASHBOARD_DELETED_SUCCESSFULLY, delay: Constants.DELAY});
			            		 _.each($scope.intervals, function(interval){
			                 		$interval.cancel(interval)
			                 	})
			                 	$scope.intervals.length = 0;
			            		 $scope.userTimeInterval().then(function(response){
			                         if(response){$scope.dashboardInterval =  $interval(dashboardIntervalCall, response.dashboardInterval,  1, true, response.intervalDashboardModeForCrtical);}
			               	   	});
			            	}).error(function(err){
				     	     	Notification.error({message: err.message, delay: 3000});
			     	     });
                		}
                		else{
	            			Notification.error({message: Messages.DASHBOARD_NOT_SELECTED, delay: Constants.DELAY});
	            		}
                }).catch(function(err){
                	$rootScope.userTimeIntervalForOtherController();
                });
            }
            
            
            $scope.editDashboard = function(){
            	if($scope.gridsterOptions.resizable.enabled){
            		$interval.cancel($scope.dashboardInterval);
                	$scope.editDashboardName = false;
            	}
            }
            
            $scope.updateDashboard = function(id, name){
            	var input = {"dashboardId" : id, 'title': name, created_user_id :$scope.userid};
            	GsmServices.update(input).success(function(response){
            		if(response.responseCode==200){
            			$scope.editDashboardName = true;
            			_.filter($scope.dashboards, function(data, i){ 
            				if(data.id==id){
            					$scope.dashboards[i].name = name;
            					$scope.selectedDashboardName= name
            				}
            			});
            			$rootScope.userTimeIntervalForOtherController();
                		Notification.success({message: response.responseMessage, delay: Constants.DELAY});
            		}
            		else{
                		Notification.error({message: response.message, delay: Constants.DELAY});
            		}
            		
            	});
            }
            
            
            $scope.getRackView = function (isFrontImage, widget, index) {
                var inputParam = {"isFrontImage": isFrontImage, "childWidgets": widget.childWidgets};
                GsmServices.get_rack_elevation_data(inputParam).success(function (response) {
                	$scope.$emit('rackView', response, index);
                });
            }

            $scope.getValue = function (index) {
                var test = _.contains($scope.newConnectionX1Position, index);
            }
           
            $scope.imageEnlargePopup = function (data) {
            	$interval.cancel($scope.dashboardInterval);
                	var template= "";
                	template='src/template/imageEnlargePopup.html';
                    $timeout(function () {
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            keyboard: true,
                            templateUrl: template, 
                            controller: imageEnlargePopupCtrl,
                            resolve: {
                            } // empty storage
                        };
                        $scope.opts.resolve.item = function () {
                            return data;
                        }
                        var modalInstance = $modal.open($scope.opts);
                        modalInstance.result.then(function () {
                        }, function () {
                        });
                    }, 500);
            };
            
            var imageEnlargePopupCtrl = function ($scope, $rootScope, $modalInstance, $modal, item, $window) {
                $scope.imgData = item;
                
                $timeout(function(){
                	 var img = document.getElementById('imageEnlarge'); 
                	 $scope.imageIntialWidth = img.width;
                	 $scope.imageStockWidth = img.width;
                },10);
               
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                    $rootScope.userTimeIntervalForOtherController();
                };
            }
            
            $scope.mapFloorListPopup = function (data) {
            	$interval.cancel($scope.dashboardInterval);
            	$rootScope.countpopvalue = 2;
            		var input = {'dcId': data};
                    $rootScope.mapFloorList = [];
                    GsmServices.getFloorList(input).success(function (response) {
	                    if(response.data.length>0){
	                    	$rootScope.mapFloorList = response.data;
	                    	var template= "";
		                	template='src/template/mapFloorListPopup.html';
		                        $scope.opts = {
		                            backdrop: true,
		                            backdropClick: true,
		                            dialogFade: false,
		                            keyboard: true,
		                            templateUrl: template, 
		                            controller: mapFloorListPopupCtrl,
		                            resolve: {
		                            } // empty storage
		                        };
		                        $scope.opts.resolve.item = function () {
		                            return data;
		                        }
		                        var modalInstance = $modal.open($scope.opts);
		                        modalInstance.result.then(function () {
		                        }, function () {
		                        });
	                    }
                    });
            };

            var mapFloorListPopupCtrl = function ($scope, $modalInstance, $modal, item, $window) {
                $scope.item = item;
                $rootScope.countpopvalue = 1;
                $scope.ok = function () {
                    $modalInstance.close();
                    $scope.userTimeInterval().then(function(response){
                        if(response){$scope.dashboardInterval =  $interval(dashboardIntervalCall, response.dashboardInterval,  1, true, response.intervalDashboardModeForCrtical);}
              	   	});
                };
                $scope.cancelmapFloorListPopup = function () {
                    $modalInstance.dismiss('cancel');
                    $scope.userTimeInterval().then(function(response){
                        if(response){$scope.dashboardInterval =  $interval(dashboardIntervalCall, response.dashboardInterval,  1, true, response.intervalDashboardModeForCrtical);}
              	   	});
                };
                
// $scope.getDataFloorListData = function (data) {
// $scope.cancelmapFloorListPopup();
// $scope.mapFloorDataPopup(data);
// }
                $scope.mapFloorDataPopup = function (data) {
               	 $rootScope.mapFloorListData = [];
                    $rootScope.mapFloorListData = data;
                    var inputparam = {FloorKey : data.FloorKey};
                    GsmServices.getMapFloorImage(inputparam).success(function (response) {
                    });
	               	var template= "";
	               	template='src/template/mapFloorDataPopup.html';
                   $scope.opts = {
                       backdrop: true,
                       backdropClick: true,
                       dialogFade: false,
                       keyboard: true,
                       templateUrl: template, 
                       controller: mapFloorDataPopupCtrl,
                       resolve: {
                       } // empty storage
                   };
                   $scope.opts.resolve.item = function () {
                       return data;
                   }

                   var modalInstance = $modal.open($scope.opts);
                   modalInstance.result.then(function () {
                   }, function () {
                   });
               };

               var mapFloorDataPopupCtrl = function ($scope, $modalInstance, $modal, item, $window) {
                   $scope.item = item;
                   $scope.ok = function () {
                       $modalInstance.close();
                   };
                   $scope.cancel = function () {
                       $modalInstance.dismiss('cancel');
                   };
               }
            }
            
            $scope.saveAll = function (id, from) {
                var inputdata = {'dashboardWidgets': $scope.dashboard.widgetsData, 'dashboardId': id};
                GsmServices.savePosition(inputdata).success(function (response) {
                    if (response.responseCode == 200) {
                    	UtilsFactory.setWidgetPositionData(JSON.stringify($scope.dashboard.widgetsData));
                    	if(from==undefined){
                    		Notification.success({message: Messages.SAVE_ALL_SETTING, delay: Constants.DELAY});	
                    	}
                    }
                });

            }

            
            $('body').on('click', '.list-heading', function () {
                $('.sidebar-main-hading li').removeClass('menu-active');
                $(this).closest('li').addClass('menu-active');

            });
            $('body').on('click', '.sidebar-sub-list li', function () {
                $('.sidebar-sub-list li').removeClass('sub-active');
                $(this).toggleClass('sub-active');
            });
            
            $('.right-sidebar-list li:even').addClass('even');
            $('.right-sidebar-list li:odd').addClass('odd');
            $rootScope.countpopvalue = 1;
            $('body').on('click', '.mapClick', function () {
	                var id  = $(this).attr('data-id');
	                if($rootScope.countpopvalue == 1){
	                	$rootScope.countpopvalue = 2;
	                	$scope.mapFloorListPopup(id);
	            	}
               });
            
            
            $scope.gotoDbList = function(){
          $scope.currentTab = "dblist";
          $scope.dashboardListLength = true;
          GsmServices.getDatabaselistdb().success(function (response) {
               if(response.responseCode == 200){
                $scope.databseList = response.responseObject.data;
                
            
                                            }
               
               });
                
          GsmServices.getsitelist().success(function(response){
           if(response.responseCode == 200){
            $scope.siteList = response.responseObject.data;
            
           }
          });
                
            }
            
            // triger resize the first call chart UI space
            $scope.triggerResizeEvent = function (widget) {
                $timeout(function () {
                	 window.dispatchEvent(new Event('resize'));
                    if (widget !== undefined && widget.jsfunctionname === 'chart_map') {
                        $('#map' + widget.childWidgets).css('height', $('.set-style-li-' + widget.childWidgets).height() - 17);
                        $('#map' + widget.childWidgets).css('width', $('.set-style-li-' + widget.childWidgets).width() - 30);
                        $('#map' + widget.childWidgets).css('marginLeft', 15);
                    }
                    else if (widget !== undefined && widget.jsfunctionname === 'getFloor') {
                        $('#floorImage' + widget.childWidgets).css('height', $('.set-style-li-' + widget.childWidgets).height() - 17);
                        $('#floorImage' + widget.childWidgets).css('width', $('.set-style-li-' + widget.childWidgets).width() - 30);
                        $('#floorImage' + widget.childWidgets).css('marginLeft', 15);
                    }
                    else if (widget !== undefined && (widget.jsfunctionname === 'sensor_gauge' || widget.jsfunctionname === 'pue_live' 
                    			|| widget.jsfunctionname ==='gauge_getwithoutpuehistory' || widget.jsfunctionname === 'walt_thresold')) {
                        $('#meter' + widget.childWidgets).css('height', $('.set-style-li-' + widget.childWidgets).closest('li').height()-95);
                    }
                }, 500);
                $timeout(function(){
                	if (widget != undefined) {
                        $('.set-style-li-' + widget.childWidgets).closest('.box-content').css('height', $('.set-style-li-' + widget.childWidgets).closest('li').height()-55);
                    }
                },500);
            }
            
            angular.element(window).on('resize', function (e) {
                $scope.$broadcast('resize');
            });
            
            
           
            $('body').on("click",'.mapFloorListClick',function(){
                             
                $scope.data;
                var inputdata = {'dcId': "1"};
                GsmServices.getFloorList(inputdata).success(function (response) {
                	
                	data = response.responseObject.data;
                });
                
                
                 $timeout(function () {
                     $scope.opts = {
                         backdrop: true,
                         backdropClick: true,
                         dialogFade: false,
                         keyboard: true,
                         templateUrl: 'src/template/gridDataForWidgets.html',
                         controller: gridDataForMapFloorListPopupCtrl,
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
               });
            
               
               function gridDataForMapFloorListPopupCtrl($scope, $modalInstance, $rootScope, Notification, items, $templateCache, $timeout) {
            	   
            	   $scope.gridDataForWidgets = {
       	                toolbar: ["pdf", "excel"],
       	                dataSource: {data:items, pageSize: 10},
       	                excel: {fileName: "abc"+".xlsx", filterable: true},
       	                pdf: {
       	                    allPages: true,
       	                    avoidLinks: true,
       	                    fileName: "abc"+".pdf",
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
               
                   
            // We want to manually handle `window.resize` event in each
			// directive.
            // So that we emulate `resize` event using $broadcast method and
			// internally subscribe to this event in each directive
            // Define event handler
           /*
			 * $scope.events = { resize: function (e, scope) { $timeout(function () {
			 * scope.api.update() }, 200) } };
			 */

            

            // We want to hide the charts until the grid will be created and all
			// widths and heights will be defined.
            // So that use `visible` property in config attribute
            /*
			 * $scope.config = {visible: false}; $timeout(function () {
			 * $scope.config.visible = true; }, 400);
			 */ 
        })