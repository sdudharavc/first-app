angular.module('setting',[])
.controller('SettingCtrl',function($scope, $state, GsmServices, Notification, Constants, Messages, $timeout, $modal, $rootScope, $confirm, spinnerService, PageConfig, UtilsFactory,
		$filter) {
	 
	$scope.intervalType = ["Second", "Minute", "Hour"];
	$scope.timeFormat = ["12 Hour", "24 Hour"];
    $scope.currentTab = "dblist";
    var databseList = null;
    var widgetList = null;
    var dashboardAdminList = null;
    $scope.dashboardAdminSettingListForTab = false;
    $scope.dashboardAdminSettingList = false;
    $scope.widgetListLength = false;
    $scope.dashboardListLength = false;
    $scope.sliderActive = true;
    $scope.data = {};
    spinnerService._unregisterAll();
    if(UtilsFactory.getWidgetPositionData()){
		UtilsFactory.setWidgetPositionData([]);
	}
    
	$rootScope.$on('newDbAdded', function () {
		$scope.getDatabaseListdb();
     })
	
	$scope.gotoDashboardSetting = function(){
		$scope.currentTab = "dashboardSetting";
		GsmServices.getdashbordsetting().success(function(response){
			if(response.responseObject.data.value){
				$scope.data.intervalDashboardType= response.responseObject.data.value.intervalDashboardType;
				$scope.data.intervalAlertType= response.responseObject.data.value.intervalAlertType;
				$scope.data.intervalDashboardModeForCrtical= response.responseObject.data.value.intervalDashboardModeForCrtical;
				$scope.data.dashboardInterval= $filter('ReverseTimeToMilliSeconds')(response.responseObject.data.value.intervalDashboardType , response.responseObject.data.value.dashboardInterval);
				$scope.data.alertInterval= $filter('ReverseTimeToMilliSeconds')(response.responseObject.data.value.intervalAlertType , response.responseObject.data.value.alertInterval);
				$scope.data.timeFormat= response.responseObject.data.value.timeFormat;
				$scope.data.theme= response.responseObject.data.value.theme;
				if(window.localStorage.getItem(Constants.THEME)){
					window.localStorage.removeItem(Constants.THEME)
				}
				window.localStorage.setItem(Constants.THEME, $scope.data.theme);
				if(window.localStorage.getItem(Constants.TIME_FORMAT)){
					window.localStorage.removeItem(Constants.TIME_FORMAT)
				}
				window.localStorage.setItem(Constants.TIME_FORMAT, $scope.data.timeFormat);
			}
		})
	}
	
	
	$scope.getChangeLog = function(){
		 var inputparam = {'version' : Constants.RELEASE_VERSION}
		GsmServices.getChangeLog(inputparam).success(function (response) {
			$scope.changeLog = "***New Development(s)***" + "\n\n";
			if(response.responseCode == 200){
				for(var i=0;i<response.responseObject.data.length;i++){
	       			$scope.changeLog +=  response.responseObject.data[i];
				}
			}
			else{
   				$scope.changeLog = "Could not fetch Change Log!";
			}
		});
	}
	
	$scope.updateDashboardSetting = function(data, form){
		if (!form.$invalid) {
			var inputParams = {value : {'dashboardInterval' : $filter('TimeToMilliSeconds')(data.intervalDashboardType , data.dashboardInterval),
				'alertInterval' : $filter('TimeToMilliSeconds')(data.intervalAlertType , data.alertInterval), 'intervalDashboardType' : data.intervalDashboardType,
				'intervalAlertType' : data.intervalAlertType, 'timeFormat' : data.timeFormat, 'intervalDashboardModeForCrtical' : data.intervalDashboardModeForCrtical, 'theme' : data.theme}};
			
			GsmServices.updateDashboardSetting(inputParams).success(function(response){
				if(response.responseCode==200){
					if(window.localStorage.getItem(Constants.THEME)){
						window.localStorage.removeItem(Constants.THEME)
					}
					window.localStorage.setItem(Constants.THEME, data.theme);
					if(window.localStorage.getItem(Constants.THEME)!=null && window.localStorage.getItem(Constants.THEME) == 'cyan'){
          	    	  	$rootScope.theme = Constants.CYAN;
              	    } else if(window.localStorage.getItem(Constants.THEME)!=null && window.localStorage.getItem(Constants.THEME) == 'darkBlue'){
              	    	$rootScope.theme = Constants.DARK_BLUE;
              	    }else {
              	    	$rootScope.theme = Constants.BLACK_WHITE;
              	    }
					if(window.localStorage.getItem(Constants.TIME_FORMAT)){
						window.localStorage.removeItem(Constants.TIME_FORMAT)
					}
					window.localStorage.setItem(Constants.TIME_FORMAT, data.timeFormat);
					Notification.success({message : response.responseMessage, delay : Constants.DELAY });
					$state.go(PageConfig.DASHBOARD);
				}
				else{
					Notification.error({message : response.responseMessage, delay : Constants.DELAY });
				}
			})
		}else if (form.intervalDashboardType && form.intervalDashboardType.$invalid) {
			Notification.error({message : Messages.PLEASE_FILL_DASHBOARD_INTERVAL_FIELD, delay : Constants.DELAY});
		} 
		else if (form.dashboardInterval && form.dashboardInterval.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_DASHBOARD_TIME_FIELD, delay : Constants.DELAY});
		} 
		else if (form.intervalAlertType && form.intervalAlertType.$invalid) {
			Notification.error({message : Messages.PLEASE_FILL_ALERT_INTERVAL_FIELD, delay : Constants.DELAY});
		} 
		else if (form.timeFormat && form.timeFormat.$invalid) {
			Notification.error({message : Messages.PLEASE_FILL_TIME_FORMAT_FIELD, delay : Constants.DELAY});
		}
		else if (form.alertInterval && form.alertInterval.$invalid) {
			Notification.error({message : Messages.PLEASE_FILL_ALERT_TIME_FIELD, delay : Constants.DELAY});
		} 
		else{
			Notification.error({message : Messages.PLEASE_FILL_MANDATORY_FIELDS,delay : Constants.DELAY });
		}
		
	}
	
	$scope.gotoDashboard = function(){
		$state.go(PageConfig.DASHBOARD);
	}
	
	$scope.gotoDbList = function(){
		$scope.currentTab = "dblist";
		$scope.getDatabaseListdb();
	}
	
	$scope.gotoAbout = function(){
		$scope.currentTab = "about";
		GsmServices.getdbversion().success(function (response) {
			$scope.dbversion = "DB version : " + response.responseObject.data;
		   });
		 $scope.appVersion = Constants.APP_VERSION;
    	 $scope.norlinxSpeciality = Constants.NORLINX_SPECIALITY;
    	 $scope.norlinxAbout = Constants.NORLINX_ABOUT;
	}
	
	$scope.gotoDashboardAdminSetting = function(changeTab){
		$scope.dashboardAdminSettingList = true;
		if(changeTab){
			$scope.currentTab = "dashboardadminsetting";	
		}
		GsmServices.listdashpermission().success(function(response){
			if(response.responseCode == 200 && response.responseObject.data[0]!=undefined){
				$scope.dashboardAdminSettingList = true;
				_.filter(response.responseObject.data, function(userlist, i){
						 if(response.responseObject.data[i].AllowReadDashboard==0){
							 response.responseObject.data[i].disableRead = true;
						 }else if(response.responseObject.data[i].AllowReadDashboard!=0){
							 response.responseObject.data[i].disableRead = false;
						 }
						 if(response.responseObject.data[i].AllowWriteDashboard==0){
							 response.responseObject.data[i].disableWrite =true;
						 }else if(response.responseObject.data[i].AllowWriteDashboard!=0){
							 response.responseObject.data[i].disableWrite = false;
						 }
						if(userlist.read_write_status == null){
							response.responseObject.data[i].AllowReadDashboardForGrid = false;
							response.responseObject.data[i].AllowWriteDashboardForGrid = false;
            			}
            			else if(userlist.read_write_status == 1){
            				response.responseObject.data[i].AllowReadDashboardForGrid = true;
							response.responseObject.data[i].AllowWriteDashboardForGrid = true;
            			}
            			else if(userlist.read_write_status == 0){
            				response.responseObject.data[i].AllowReadDashboardForGrid = true;
							response.responseObject.data[i].AllowWriteDashboardForGrid = false;
            			}
				});
				dashboardAdminList = response.responseObject.data;
			      $scope.checkReadWriteStatus(dashboardAdminList);
			      $scope.gridOptionsForDashboardAdmin = {
			              sortable: true, groupable: true, resizable: true, filterable: true,
			              pageable: {refresh: false, pageSizes: true, buttonCount: 5},
			              columns: [
			              	/*{ 	title:'Sr no.',  width:100,lockable: true, template: "<div >{{cellIndex()}}</div>",
			  		    	},*/{ 	title: "Dashboard", field: 'name', width: 120,lockable: true, 
			  		    	},{ 	title: "User", field: 'assigned_user_firstname' ,  width:120,lockable: true, template: '<div ng-bind="dataItem.assigned_user_firstname+\' \'+dataItem.assigned_user_lastname"></div>'
			  		    	},{ 	title: "Read", width:120, lockable: true, template: '<div class="admin-check-boxes"><label for="{{dataItem.id}}\'read\'" class="check-size cheked-color" ng-class="{\'disabledInputCheckBoxForUser\' :dataItem.disableRead}">'+
			  	    			'<input class="gridInputButton" id="{{dataItem.id}}\'read\'" type="checkbox" ng-model="dataItem.AllowReadDashboardForGrid" ng-disabled="dataItem.disableRead"'
			  	    			+'ng-click="(dataItem.AllowWriteDashboardForGrid ==true && dataItem.AllowReadDashboardForGrid ==false) ? dataItem.AllowWriteDashboardForGrid=false : nothing;checkReadWriteStatus(gridOptionsForDashboardAdmin.dataSource.data)">'
			  	    			+'<span class="ic"></span></label></div>',
			  	    			headerTemplate:'<div class="admin-check-boxes"><label for="\'read\'" class="check-size cheked-color">'+
				    			'<input class="gridInputButton" id="\'read\'" type="checkbox" ng-model=\'countReadCheck\' ng-click=\'tickUntickAll("read", countReadCheck, $event)\'>'
				    			+'<span class="ic"></span>Read</label></div>',
			  		    	},{ 	title: "Write", width:140,lockable: true,
			  		    		template: '<div  class="admin-check-boxes" ><label for="{{dataItem.id}}\'write\'" class="check-size cheked-color " ng-class="{\'disabledInputCheckBoxForUser\' :dataItem.disableWrite}">'
			  	    			+'<input class="gridInputButton" id="{{dataItem.id}}\'write\'" type="checkbox" ng-model="dataItem.AllowWriteDashboardForGrid" ng-disabled="dataItem.disableWrite"' 
			  	    			+'ng-click="dataItem.AllowReadDashboardForGrid=true; checkReadWriteStatus(gridOptionsForDashboardAdmin.dataSource.data)">'
			  	    			+'<span class="ic"></span></label></div>',
			  	    			headerTemplate: '<div class="admin-check-boxes"><label for="\'write\'" class="check-size cheked-color">'+
			  	    			'<input class="gridInputButton" id="\'write\'" type="checkbox" ng-model=\'countWriteCheck\' ng-click=\'tickUntickAll("write", countWriteCheck, $event)\'>'
			  	    			+'<span class="ic"></span>Write</label></div>',
			  		    	},{ title: 'Update', width: 150, lockable: true,
					    		template: '<div><a type="button" class="gridSetButtonColor" ng-click=\'updateDashboardAdmin(dataItem, true);\'>Update Permission</a><div>'
					    	}],
			  		    	columnMenu: true,
			     		    dataSource: {data: dashboardAdminList, pageSize: 14},
			          };
			     /* $(".ui-grid-viewport").mCustomScrollbar({
                      axis: "y" // horizontal scrollbar
                  });*/
	     	}
			else{
				$scope.dashboardAdminSettingList = false;
			}
		}).error(function(e){
			$scope.dashboardAdminSettingList = false;
  		});
	}
	
	$scope.gotoDashboardAdminShow = function(){
		GsmServices.dashbordlist().success(function(response){
				if(response.responseCode == 200 && response.responseObject[0]!=undefined){
					$scope.dashboardAdminSettingListForTab = true;
		     	}
			}).error(function(e){
	  		});
	};
	$scope.gotoDashboardAdminShow();
	
	$rootScope.$on('adddashpermission',function(event){
		$scope.gotoDashboardAdminSetting();
	})
	
	
	 $scope.checkReadWriteStatus = function(dashboardAdminList){
		var countRead = 0, countWrite = 0;
		_.filter(dashboardAdminList, function(list, i){
			if(list.AllowReadDashboardForGrid==true){countRead = countRead + 1;}
			if(list.AllowWriteDashboardForGrid==true){countWrite = countWrite + 1;}
		})
		if(dashboardAdminList.length==countRead){$scope.countReadCheck = true;
		}else{$scope.countReadCheck = false;}
		if(dashboardAdminList.length==countWrite){$scope.countWriteCheck = true;}
		else{$scope.countWriteCheck = false;}
	}
	
	$scope.tickUntickAll = function(value, status, event){
		var grid = $(event.target).closest("[kendo-grid]").data("kendoGrid");
        var items = grid.dataSource.data();
		_.filter(items, function(row, i){
			if(value=="read"){
				$scope.gridOptionsForDashboardAdmin.dataSource.data[i].AllowReadDashboardForGrid = row.AllowReadDashboardForGrid = status ? true : false;
				if(row.AllowWriteDashboardForGrid ==true && row.AllowReadDashboardForGrid ==false){
					$scope.gridOptionsForDashboardAdmin.dataSource.data[i].AllowWriteDashboardForGrid = row.AllowWriteDashboardForGrid= false; 
				}
			}
			else if(value=="write"){
				if(row.AllowWriteDashboard==1){
					$scope.gridOptionsForDashboardAdmin.dataSource.data[i].AllowWriteDashboardForGrid = row.AllowWriteDashboardForGrid = status ? true : false;
					//	$scope.gridOptionsForDashboardAdmin.dataSource.data[i].AllowReadDashboardForGrid = row.AllowReadDashboardForGrid = status ? true : false;
				}
				else{
					$scope.gridOptionsForDashboardAdmin.dataSource.data[i].AllowWriteDashboardForGrid = row.AllowWriteDashboardForGrid = false;	
					$scope.gridOptionsForDashboardAdmin.dataSource.data[i].AllowReadDashboardForGrid = row.AllowReadDashboardForGrid = status ? true : false;
				}
			}
		});
		$scope.checkReadWriteStatus($scope.gridOptionsForDashboardAdmin.dataSource.data);
	}
	
	$scope.updateDashboardAdmin = function(data, value){
		spinnerService.show('html5spinnerSettting');
		var read_write_status = null;
		var user_list = [];
		if(value){
			if(data.AllowReadDashboardForGrid == true && data.AllowWriteDashboardForGrid==true){
				read_write_status = 1;
			}
			else if(data.AllowReadDashboardForGrid == true && (data.AllowWriteDashboardForGrid == false || data.AllowWriteDashboardForGrid == undefined)){
				read_write_status = 0;
			}
			user_list = [{'id':data.dash_id,'user_id' : data.assigned_user_id,'read_write_status':read_write_status}];
			var input = {'user_list': user_list};
		}
		else{
			_.filter($scope.gridOptionsForDashboardAdmin.dataSource.data,function(row, i){
				user_list[i] = {};
				var read_write_status = null;
				if(row.AllowReadDashboardForGrid == true && row.AllowWriteDashboardForGrid ==true){
					read_write_status = 1;
				}
				else if(row.AllowReadDashboardForGrid == true && (row.AllowWriteDashboardForGrid == false || row.AllowWriteDashboardForGrid	 == undefined)){
					read_write_status = 0;
				}
				user_list[i].id = row.dash_id
				user_list[i].user_id = row.assigned_user_id;
				user_list[i].read_write_status = read_write_status;
				
			})
			var input = {'user_list': user_list};
		}
		
        GsmServices.updatedashpermission(input).success(function (response) {
        	if(response.responseCode == 200){
            		spinnerService.hide('html5spinnerSettting');
        			Notification.success({message: response.responseMessage, delay: 3000});
        	}
        	else {
        		spinnerService.hide('html5spinnerSettting');
        		Notification.error({message: response.responseMessage, delay: 3000});
        	}
        }).error(function(err){
        	spinnerService.hide('html5spinnerSettting');
        	Notification.error({message: err.message, delay: 3000});
        });
	}
	
	$scope.addDashboardAdminUserPopup = function () {
    	var template='src/template/addDashboardAdminUserPopup.html';
            $scope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                /*size: 'lg',*/
                templateUrl: template,
                controller: AddDashboardAdminUserPopupCtrl,
                resolve: {
                } // empty storage
            };
            var modalInstance = $modal.open($scope.opts);
            modalInstance.result.then(function () {
            }, function () {
            });
    };

    var AddDashboardAdminUserPopupCtrl = function ($scope, $modalInstance, $modal, $window,$rootScope, GsmServices) {
    	$scope.data = {};
		GsmServices.dashbordlist().success(function(response){
			if(response.responseCode == 200 && response.responseObject[0]!=undefined){
				$scope.dashboardList = response.responseObject;
	     	}
		}).error(function(e){
      		  
  		});
  		GsmServices.searchuser().success(function (response) {
  			_.filter(response.responseObject.data, function(userlist, i){
  				if(response.responseCode == 200 && response.responseObject.data[0]!=undefined){
					if(userlist.AllowReadDashboard == 1){
						response.responseObject.data[i].AllowReadDashboard = true;
	      			}else{
	      				response.responseObject.data[i].AllowReadDashboard = false;
	      			}
	      			if(userlist.AllowWriteDashboard == 1){
	      				response.responseObject.data[i].AllowWriteDashboard = true;
	      			}
	      			else {
	      				response.responseObject.data[i].AllowWriteDashboard = false;
	      			}
  				}
  			});
  			$scope.userList = response.responseObject.data;
  		}).error(function(e){
      		  
  		});
  		
  		$scope.readWriteStatus = function(user){
  			if(user.AllowReadDashboard){
  				$scope.disableRead = false;
  				$scope.data.AllowReadDashboard = user.AllowReadDashboard;
  			}else if(!user.AllowReadDashboard){
  				$scope.disableRead = true;
  				$scope.data.AllowWriteDashboard = false;
  			}
  			if(user.AllowWriteDashboard){
  				$scope.disableWrite = false;
  				$scope.data.AllowWriteDashboard = user.AllowWriteDashboard;
  			}else if(!user.AllowWriteDashboard){
  				$scope.disableWrite = true;
  				$scope.data.AllowWriteDashboard = false;
  			}
  		}
  		
    	$scope.adddashpermission = function(data, form){
			if(!form.$invalid){
				$modalInstance.dismiss('cancel');
				spinnerService.show('html5spinnerSettting');
				var read_write_status = null;
				if(data.AllowReadDashboard == true && data.AllowWriteDashboard==true){
					read_write_status = 1;
				}
				else if(data.AllowReadDashboard == true && (data.AllowWriteDashboard == false || data.AllowWriteDashboard == undefined)){
					read_write_status = 0;
				}
				var input = {'dashbord_id':data.dashboard.dash_id,'user_id' : data.user.UserID,'read_write_status':read_write_status};
                GsmServices.adddashpermission(input).success(function (response) {
                	if(response.responseCode == 200){
                			$rootScope.$emit("adddashpermission");
	                		spinnerService.hide('html5spinnerSettting');
                			Notification.success({message: response.responseMessage, delay: 3000});
                	}
                	else {
                		spinnerService.hide('html5spinnerSettting');
                		Notification.error({message: response.responseMessage, delay: 3000});
                	}
                }).error(function(err){
                	spinnerService.hide('html5spinnerSettting');
                	Notification.error({message: err.message, delay: 3000});
                });
		    	}else{
		    		Notification.error({message: Messages.PLEASE_FILL_MANDATORY_FIELDS, delay: 3000});
		    	}
		    }
    	
    	$scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
	
	
	$scope.getDatabaseListdb = function(){
		$scope.dashboardListLength = true;
		GsmServices.getDatabaselistdb().success(function (response) {
	     	if(response.responseCode == 200){
	     		databseList = response.responseObject.data;
	     		$scope.dashboardListLength = true;
			      /*$(".ui-grid-viewport").mCustomScrollbar({
                      axis: "y" // horizontal scrollbar
                  });*/
			      $scope.gridOptions = {
		              sortable: true, groupable: false, resizable: true, filterable: true,
		              pageable: {refresh: false, pageSizes: true, buttonCount: 5},
		              columns: [
		              	/*{ 	title:'Sr no.',  width:100,lockable: true, template: "<div >{{dataItem}}</div>",
		  		    	},*/{ 	title: "Host", field: 'host' ,  width: 120,lockable: true, template: '<div ng-class="{\'selectedDb\': dataItem.defaultdb ==\'0\'}" ng-click=\'setDefaultConn( dataItem);\' '
		  	    			+'ng-bind="dataItem.host"></div>', 
		  		    	},{ 	title: "Database", field: 'dbname',  width:120, lockable: true,template: '<div ng-class="{\'selectedDb\': dataItem.defaultdb ==\'0\'}" ng-click=\'setDefaultConn( dataItem);\' '
		  	    			+'ng-bind="dataItem.dbname"></div>',
		  		    	},{ 	title: "User Name", field: 'username' ,  width:120,lockable: true, template: '<div ng-class="{\'selectedDb\': dataItem.defaultdb ==\'0\'}" ng-click=\'setDefaultConn( dataItem);\' '
		  	    			+'ng-bind="dataItem.username"></div>'
		  	    		}],
		  		    	/*},{ 	title: "Is Default", field: 'defaultdb' ,  width:120,lockable: true, template: '<div ng-class="{\'selectedDb\': dataItem.defaultdb ==\'0\'}" ng-click=\'setDefaultConn( dataItem);\' '
		  	    			+' ><strong ng-if="dataItem.defaultdb == 0" style="font-weight:normal !important;">Yes</strong> <strong ng-if="dataItem.defaultdb==1" style="font-weight:normal !important;">No</strong></div>'
		  		    	}],*/
		  		    	columnMenu: true,
		     		    dataSource: {data: databseList, pageSize: 14},
		          };
	     	}
	     	else {
	     		$scope.dashboardListLength = false;
	     		Notification.error({message: response.responseMessage, delay: 3000});
	     	}
	     }).error(function(err){
	    	 $scope.dashboardListLength = false;
	     	Notification.error({message: err.message, delay: 3000});
	     });
	}
	$scope.getDatabaseListdb();
	
	$scope.gotoWidgetSetting = function(){
		$scope.currentTab = "widgetsetting";
		$scope.widgetListLength = true;
		GsmServices.getwidgetlist().success(function (response) {
	     	if(response.responseCode == 200){
	     		$scope.widgetListLength = true;
	     		 widgetList = response.responseObject.data;
			  	$scope.gridOptionsForWidget = {
			              sortable: true, groupable: false, resizable: true, filterable: true,
			              pageable: {refresh: false, pageSizes: true, buttonCount: 5},
			              columns: [
			              	/*{ 	title:'Sr no.',  width:100,lockable: true, template: "<div >{{dataItem}}</div>",
			  		    	},*/{ 	title: "Name", field: 'name' ,  width: 120,lockable: true, 
			  		    	},{ 	title: "Height", field: 'height' ,  width:120,lockable: true
			  		    	},{ 	title: "Width", field: 'width' ,  width:120,lockable: true
			  		    	},{ 	title: "Min width", field: 'minsizex' ,  width:140,lockable: true,
			  		    	},{ 	title: "Min height", field: 'minsizey' ,  width:100,lockable: true
			  		    	},{ 	title: "Actions", width:120,lockable: true, template: "<div ng-click=\"updateWidgetPopup(dataItem)\"><i class=\"fa fa-pencil-square-o\"></i></div>"
			  		    	}],
			  		    	columnMenu: true,
			     		    dataSource: {data: widgetList, pageSize: 14},
			          };
			      /*$(".gridSetting .ui-grid-viewport").mCustomScrollbar({
                      axis: "y" // horizontal scrollbar
                  });*/
	     	}
	     	else {
	     		$scope.widgetListLength = false;
	     		Notification.error({message: response.responseMessage, delay: 3000});
	     	}
	     }).error(function(err){
	    	 $scope.widgetListLength = false;
	     	Notification.error({message: err.message, delay: 3000});
	     });
	}
			  
	 $scope.addDbPopup = function () {
        	var template='src/template/addDbPopup.html';
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    templateUrl: template,
                    controller: AddDbPopupCtrl,
                    resolve: {
                    } // empty storage
                };

                var modalInstance = $modal.open($scope.opts);
                modalInstance.result.then(function () {
                }, function () {
                });
        };

        var AddDbPopupCtrl = function ($scope, $modalInstance, $modal, $window,$rootScope) {
        	$scope.createDb = function(data, form){
				if(!form.$invalid){
					$modalInstance.dismiss('cancel');
					spinnerService.show('html5spinnerSettting');
					var input = {'host':data.host,'db':data.dbname,'username':data.username, 'password':data.password};
	                GsmServices.createDatabase(input).success(function (response) {
	                	if(response.responseCode == 200){
	                		$rootScope.$emit('newDbAdded', response);
		                		spinnerService.hide('html5spinnerSettting');
	                			Notification.success({message: response.responseMessage, delay: 3000});
	                	}
	                	else {
	                		spinnerService.hide('html5spinnerSettting');
	                		Notification.error({message: response.responseMessage, delay: 3000});
	                	}
	                }).error(function(err){
	                	spinnerService.hide('html5spinnerSettting');
	                	Notification.error({message: err.message, delay: 3000});
	                });
			    	}else{
			    		Notification.error({message: Messages.PLEASE_FILL_MANDATORY_FIELDS, delay: 3000});
			    	}
			    }
        }
	            
        $scope.setDefaultConn = function(data){
        	if(data.defaultdb == 0){
        		setDefaultConnectionConfirm(data);
        	}else{
        		$confirm({title: "Set Database", ok: 'Yes', cancel: 'No', text: Messages.SET_DATABASE})
             	.then(function() {
             		setDefaultConnectionConfirm(data);
             	});
        	}
	    }
        
        function setDefaultConnectionConfirm(data){
        	var input = {'id':data.id};
            GsmServices.setdefaultconn(input).success(function (response) {
            	if(response.responseCode == 200){
            		$rootScope.$emit('newDbAdded', response);
            		$state.go(PageConfig.SITE_LIST);
            		Notification.success({message: response.responseMessage, delay: 3000});
            	}
            	else {
            		Notification.error({message: response.responseMessage, delay: 3000});
            	}
            }).error(function(err){
            	Notification.error({message: err.message, delay: 3000});
            });
        }
	            
        $scope.deletedb = function(index, data){
			 $confirm({title: "Delete Database", ok: 'Yes', cancel: 'No', text: Messages.DELETE_DATABASE})
             	.then(function() {
			    		   var input = {'dbid':data.id};
			                GsmServices.deletedb(input).success(function (response) {
			                	if(response.responseCode == 200){
			       				 $scope.gridOptions.data.splice(index,1);
				                		Notification.success({message: response.responseMessage, delay: 3000});
			                	}
			                	else {
			                		Notification.error({message: response.responseMessage, delay: 3000});
			                	}
			                }).error(function(err){
			                	Notification.error({message: err.message, delay: 3000});
			                });
             	});
        }
	
	 $scope.saveSetting = function(data, form){
		if(!form.$invalid){
	    		   var input = {'host':data.host,'db':data.dbname,'username':data.username,'password':data.password};
	                GsmServices.setdbsetting(input).success(function (response) {
	                	if(response.responseCode == 200){
		                		Notification.success({message: response.responseMessage, delay: 3000});
		                		$state.go(PageConfig.LOGIN);
	                	}
	                	else {
	                		Notification.error({message: response.responseMessage, delay: 3000});
	                	}
	                }).error(function(err){
	                	Notification.error({message: err.message, delay: 3000});
	                });
	    	}else{
	    		Notification.error({message: Messages.PLEASE_FILL_MANDATORY_FIELDS, delay: 3000});
	    	}
	    }
	 
	 
	 $scope.updateWidgetPopup = function (rowData) {
     	var template='src/template/updateWidgetPopup.html';
             $scope.opts = {
                 backdrop: true,
                 backdropClick: true,
                 dialogFade: false,
                 keyboard: true,
                 templateUrl: template,
                 controller: updateWidgetPopupCtrl,
                 resolve: {
                 } // empty storage
             };
             $scope.opts.resolve.rowData = function () {
                 return rowData;
             }

             var modalInstance = $modal.open($scope.opts);
             modalInstance.result.then(function () {
             }, function () {
             });
     };

     var updateWidgetPopupCtrl = function ($scope, $modalInstance, $modal, rowData, $window,$rootScope) {
    	 $scope.data = rowData;
     	$scope.UpdateWidgetSetting = function(data, form){
				if(!form.$invalid){
					$modalInstance.dismiss('cancel');
					spinnerService.show('html5spinnerSettting');
					var input = {'id': data.id,'height': data.height,'width':data.width, 'minsizex':data.minsizex, 'minsizey': data.minsizey};
	                GsmServices.widgetedit(input).success(function (response) {
	                	if(response.responseCode == 200){
		                		spinnerService.hide('html5spinnerSettting');
	                			Notification.success({message: response.responseMessage, delay: 3000});
	                	}
	                	else {
	                		spinnerService.hide('html5spinnerSettting');
	                		Notification.error({message: response.responseMessage, delay: 3000});
	                	}
	                }).error(function(err){
	                	spinnerService.hide('html5spinnerSettting');
	                	Notification.error({message: err.message, delay: 3000});
	                });
			    	}else if(form.height && form.height.$invalid){
			    		Notification.error({message: Messages.PLEASE_FILL_HEIGHT_FIELDS, delay: 3000});
			    	}else if(form.width && form.width.$invalid){
			    		Notification.error({message: Messages.PLEASE_FILL_WIDTH_FIELDS, delay: 3000});
			    	}else if(form.minsizex && form.minsizex.$invalid){
			    		Notification.error({message: Messages.PLEASE_FILL_MINSIZEX_FIELDS, delay: 3000});
			    	}else if(form.minsizey && form.minsizey.$invalid){
			    		Notification.error({message: Messages.PLEASE_FILL_MINSIZEY_FIELDS, delay: 3000});
			    	}
			    }
     }
     
     
     

});