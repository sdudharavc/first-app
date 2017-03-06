angular.module('widgetsetting', [])
	.controller('WidgetSettingsCtrl',function($scope, GsmServices, $modalInstance, widget, $rootScope, UtilsFactory, index, Messages, Notification, Constants, $timeout, $filter, $interval) {

		$scope.widget = widget;
		$scope.data = [];
		$scope.form = {};
		var inputdata = {};
		$scope.choices = [{id : 1}];
		$scope.data.checkFilter = false;
		var fromtextDate = undefined;
		UtilsFactory.setDateRange(null, widget.childWidgets);
		var timeFormat = "MMM DD, YYYY HH:mm";
		if (window.localStorage.getItem(Constants.TIME_FORMAT) == "12 Hour") {
			timeFormat = "MMM DD, YYYY hh:mm a";
		}

		function setDate(start, end) {
			$('input[name="daterange"]').daterangepicker({
				startDate : start, endDate : end, locale:{format : timeFormat},
				drops : "up",
				ranges : {'Today' : [moment().format(timeFormat), moment().format(timeFormat) ],
					'Last 3 Days' : [moment().subtract(3, 'day').format(timeFormat), moment().format(timeFormat) ],
					'Last 7 Days' : [moment().subtract(7, 'days').format(timeFormat), moment().format(timeFormat) ],
					'Last 1 Month' : [moment().subtract(1, 'month').format(timeFormat), moment().format(timeFormat) ],
					'Last 6 Month' : [moment().subtract(6, 'month').format(timeFormat), moment().format(timeFormat) ],
					'Last 1 Year' : [moment().subtract(1, 'year').format(timeFormat), moment().format(timeFormat) ]
				}
			});
		}

		$scope.datePickerChange = function(val) {
			var start = moment().subtract(parseInt(val), 'day').format(timeFormat);
			var end = moment().format(timeFormat);
			setDate(start, end);
		}

		$(function() {
			var start = moment().format(timeFormat);
			var end = moment().format(timeFormat);
			function cbb(start, end) {
				$('input[name="daterange"]').html(start + ' - ' + end);
				$scope.data.days = "";
			}

			if (UtilsFactory.getDateRange(widget.childWidgets) !== undefined && UtilsFactory.getDateRange(widget.childWidgets) !== null&& UtilsFactory.getDateRange(widget.childWidgets).length > 0) {
				start = UtilsFactory.getDateRange(widget.childWidgets)[0];
				end = UtilsFactory.getDateRange(widget.childWidgets)[1];
			}

			$('input[name="daterange"]').daterangepicker({
				startDate : start, endDate : end, locale:{format : timeFormat},
				drops : "up",
				ranges : {'Today' : [moment().format(timeFormat), moment().format(timeFormat) ],
					'Last 3 Days' : [moment().subtract(3, 'day').format(timeFormat), moment().format(timeFormat) ],
					'Last 7 Days' : [moment().subtract(7, 'days').format(timeFormat), moment().format(timeFormat) ],
					'Last 1 Month' : [moment().subtract(1, 'month').format(timeFormat), moment().format(timeFormat) ],
					'Last 6 Month' : [moment().subtract(6, 'month').format(timeFormat), moment().format(timeFormat) ],
					'Last 1 Year' : [moment().subtract(1, 'year').format(timeFormat), moment().format(timeFormat) ]
				}
			}, cbb);
		});

		$scope.addNewChoice = function() {
			if ($scope.choices.length < 5) {
				var newItemNo = $scope.choices.length + 1;
				if (widget.jsfunctionname === "pue_line_chart" || widget.jsfunctionname === "pue_area_chart" || widget.jsfunctionname === "pue_bar_chart") {
					var pueData = JSON.parse(UtilsFactory.getHistoryGraphData(widget.childWidgets));
					$scope.choices.push({'id' : newItemNo, 'form' : {'formula' : pueData.widgetSetting.formula}});
				} else if (widget.jsfunctionname === 'bar_thresold' || widget.jsfunctionname === 'line_thresold' || widget.jsfunctionname === 'area_thresold') {
					var thresoldData = JSON.parse(UtilsFactory.getHistoryGraphData(widget.childWidgets));
					$scope.choices.push({'id' : newItemNo,'form' : {'checkFilter' : false, 'datacenter' : thresoldData.widgetSetting.datacenter,'cabinet' : [],'floor' : [],
						'powerMetriceItem' : getpowermetricitemnewchoice(newItemNo)}
					});
				} else if (widget.jsfunctionname == 'chart_spider') {
					$scope.choices.push({'id' : newItemNo, 'form' : {'cabinet' : []}});
				} else if (widget.jsfunctionname == 'chart_floor_spider') {
					$scope.choices.push({'id' : newItemNo,'form' : {'floor' : []}});
				} else if (widget.jsfunctionname == "line_sensor" || widget.jsfunctionname == "area_sensor" || widget.jsfunctionname == "bar_sensor") {
					var sensorData = JSON.parse(UtilsFactory.getHistoryGraphData(widget.childWidgets));
					$scope.choices.push({'id' : newItemNo, 'form' : {'datacenter' : sensorData.widgetSetting.datacenter, 'floor' : [], 'cabinet' : [], 'sensor' : $scope.form.sensorList}});
				} else if (widget.jsfunctionname === "line_getwithoutpuehistory" || widget.jsfunctionname === "bar_getwithoutpuehistory" || widget.jsfunctionname === "area_getwithoutpuehistory") {
					var withoutPueHistory = JSON.parse(UtilsFactory.getHistoryGraphData(widget.childWidgets));
					$scope.choices.push({'id' : newItemNo, 'form' : {'formula' : withoutPueHistory.widgetSetting.formula}});
				}
			} else {
				Notification.error({message : Messages.FIELD_LIMIT_REACHED,delay : Constants.DELAY});
			}
		};

		$scope.endDateBeforeRender = endDateBeforeRender
		$scope.endDateOnSetTime = endDateOnSetTime
		$scope.startDateBeforeRender = startDateBeforeRender
		$scope.startDateOnSetTime = startDateOnSetTime

		function startDateOnSetTime() {$scope.$broadcast('start-date-changed');}

		function endDateOnSetTime() {$scope.$broadcast('end-date-changed');}

		function startDateBeforeRender($dates) {
			if ($scope.dateRangeEnd) {
				var activeDate = moment($scope.dateRangeEnd);
				$dates.filter(function(date) {return date.localDateValue() >= activeDate.valueOf()}).forEach(function(date) {date.selectable = false;})
			}
		}

		function endDateBeforeRender($view, $dates) {
			if ($scope.dateRangeStart) {
				var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');
				$dates.filter(function(date) {return date.localDateValue() <= activeDate.valueOf()}).forEach(function(date) {date.selectable = false;})
			}
		}

		$scope.removeChoice = function(id) {
			var lastItem = $scope.choices.length - 1;
			$scope.choices.splice(lastItem);
		};

		$scope.initializeForm = function() {
			$scope.form = {widgetname : widget.widgetname, name : widget.name, sizeX : widget.sizeX, sizeY : widget.sizeY, col : widget.col, row : widget.row,
				jsfunctionname : widget.jsfunctionname
			}
		}

		$scope.getMetrixValue = function(value) {
			if (value !== undefined && value !== null) {
				var inputParam = {"threshold_type" : value.walt_threshold_type};
				GsmServices.getMetrix(inputParam).success(function(response) {
					$scope.form.metrix = response;
				});
			}
		}

		$scope.resetThresholdGauge = function(id) {
			if (id) {
				$scope.choices[id - 1].datacenter = undefined;
				$scope.choices[id - 1].floor = undefined;
				$scope.choices[id - 1].cabinet = undefined;
				if ($scope.choices[id - 1].form == undefined) {$scope.choices[id - 1].form = {};}
				$scope.choices[id - 1].form.floor = [];
				$scope.choices[id - 1].form.cabinet = [];
				if ($scope.choices[id - 1] && !$scope.choices[id - 1].checkFilter) {
					$scope.getpowermetricitemForChoice($scope.choices[id - 1], $scope.data);
				}
			} else {
				$scope.data.datacenter = {};
				$scope.data.floor = {};
				$scope.data.cabinet = {};
				if (!$scope.data.checkFilter) {$scope.getpowermetricitem($scope.data);}
			}
		}

		$scope.getpowermetricitem = function(value) {
			if (value !== undefined && value.walt_threshold_type !== undefined && value.walt_metrix !== undefined) {
				if ((value.cabinet == undefined || value.cabinet.length == 0) && (value.floor == undefined || value.floor.length == 0) && (value.datacenter == undefined || value.datacenter.length == 0)) {
					var inputParam = {"threshold_type" : value.walt_threshold_type, "walt_metrix" : value.walt_metrix};
					GsmServices.getpowermetricitem(inputParam).success(function(response) {
						$scope.form.powerMetriceItem = response.responseObject.data;
					});
				} else if (value.cabinet != undefined && value.cabinet.CabinetKey != undefined) {
					$scope.getnodebycabinetForGauge(value);
				} else if (value.floor != undefined && value.floor.FloorKey != undefined) {
					$scope.getnodebyfloorForGauge(value);
				} else if (value.datacenter != undefined && value.datacenter.DCKey != undefined) {
					$scope.getnodebydcForGauge(value);
				}
			}
		}

		$scope.getpowermetricitemForChoice = function(value, data) {
			if (value == null && data.walt_threshold_type !== undefined && data.walt_metrix !== undefined) {
				value = {};
				var inputParam = {"threshold_type" : data.walt_threshold_type, "walt_metrix" : data.walt_metrix};
				GsmServices.getpowermetricitem(inputParam).success(function(response) {
					_.filter($scope.choices,function(choice,i) {
						// $scope.choices[i].form = {};
						$scope.choices[i].form.powerMetriceItem = response.responseObject.data;
						// $scope.choices[i].datacenter = undefined;
						// $scope.choices[i].floor = undefined;
						// $scope.choices[i].cabinet = undefined;
						// $scope.choices[i].powerMetriceItem = undefined;
					});
								});
			} else if (value !== null) {
				if ((value.cabinet == undefined || value.cabinet.length == 0) && (value.floor == undefined || value.floor.length == 0) && (value.datacenter == undefined || value.datacenter.length == 0)
						&& data.walt_threshold_type !== undefined && data.walt_metrix !== undefined) {
					var inputParam = {"threshold_type" : data.walt_threshold_type, "walt_metrix" : data.walt_metrix};
					GsmServices.getpowermetricitem(inputParam).success(function(response) {
						$scope.choices[value.id - 1].form.powerMetriceItem = response.responseObject.data;
					});
				} else if (value.cabinet != undefined && value.cabinet.CabinetKey != undefined) {
					$scope.getnodebycabinet(value);
				} else if (value.floor != undefined && value.floor.FloorKey != undefined) {
					$scope.getnodebyfloor(value);
				} else if (value.datacenter != undefined && value.datacenter.DCKey != undefined) {
					$scope.getnodebydc(value);
				}
			}
		}

		function getpowermetricitemnewchoice(id) {
			if ($scope.data.walt_threshold_type && $scope.data.walt_metrix) {
				var inputParam = {"threshold_type" : $scope.data.walt_threshold_type,"walt_metrix" : $scope.data.walt_metrix};
				GsmServices.getpowermetricitem(inputParam).success(function(response) {
					$scope.choices[id - 1].form.powerMetriceItem = response.responseObject.data;
				});
			}
		}

		$scope.getMetrixForGauge = function(value) {
			if (value !== undefined && value !== null) {
				var inputParam = {"threshold_type" : value.walt_threshold_type};
				GsmServices.getMetrix(inputParam).success(function(response) {
					$scope.form.metrix = response;
				});
			}
		}

		$scope.getnodebydc = function(value) {
			if (value !== undefined && value !== null && $scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
				if (value.datacenter) {
					var inputParam = {"dcKey" : value.datacenter.DCKey, 'type' : $scope.data.walt_threshold_type, 'metrix' : $scope.data.walt_metrix};
					GsmServices.getnodebydc(inputParam).success(function(response) {
						$scope.choices[value.id - 1].form.powerMetriceItem = response.responseObject.data;
					});
				} else if ($scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
					$scope.choices[value.id - 1].form.floor = undefined;
					$scope.choices[value.id - 1].form.cabinet = undefined;
					$scope.choices[value.id - 1].floor = undefined;
					$scope.choices[value.id - 1].cabinet = undefined;
					$scope.getpowermetricitemForChoice(null, $scope.data)
				}
			}
		}

		$scope.getnodebyfloor = function(value) {
			if (value !== undefined && value !== null && value.datacenter && $scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
				if (value.floor) {
					var inputParam = {'floorid' : value.floor.FloorKey, 'type' : $scope.data.walt_threshold_type, 'metrix' : $scope.data.walt_metrix};
					GsmServices.getnodebyfloor(inputParam).success(function(response) {
						$scope.choices[value.id - 1].form.powerMetriceItem = response.responseObject.data;
					});
				} else if ($scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
					$scope.choices[value.id - 1].form.cabinet = undefined;
					$scope.choices[value.id - 1].cabinet = undefined;
					$scope.getnodebydc(value);
				}
			}
		}

		$scope.getnodebycabinet = function(value) {
			if (value !== undefined && value !== null && value.datacenter !== undefined && value.floor !== undefined && $scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
				if (value.cabinet) {
					var inputParam = {"cabinetKey" : value.cabinet.CabinetKey, 'type' : $scope.data.walt_threshold_type, 'metrix' : $scope.data.walt_metrix};
					GsmServices.getnodebycabinet(inputParam).success(function(response) {
						$scope.choices[value.id - 1].form.powerMetriceItem = response.responseObject.data;
					});
				} else if ($scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
					$scope.getnodebyfloor(value);
				}
			}
		}

		$scope.getnodebydcForGauge = function(value) {
			if (value !== undefined && value !== null && $scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
				if (value.datacenter) {
					var inputParam = {"dcKey" : value.datacenter.DCKey, 'type' : $scope.data.walt_threshold_type, 'metrix' : $scope.data.walt_metrix};
					GsmServices.getnodebydc(inputParam).success(function(response) {
						$scope.form.powerMetriceItem = response.responseObject.data;
					});
				} else if ($scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
					$scope.form.floorlist = undefined;
					$scope.form.cabinet = undefined;
					$scope.data.floor = undefined;
					$scope.data.cabinet = undefined;
					$scope.getpowermetricitem($scope.data);
				}
			}
		}

		$scope.getnodebyfloorForGauge = function(value) {
			if (value !== undefined && value !== null && value.datacenter && $scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
				if (value.floor) {
					var inputParam = {'floorid' : value.floor.FloorKey, 'type' : $scope.data.walt_threshold_type, 'metrix' : $scope.data.walt_metrix};
					GsmServices.getnodebyfloor(inputParam).success(function(response) {
						$scope.form.powerMetriceItem = response.responseObject.data;
					});
				} else if ($scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
					$scope.form.cabinet = undefined;
					$scope.data.cabinet = undefined;
					$scope.getnodebydcForGauge(value);
				}
			}
		}

		$scope.getnodebycabinetForGauge = function(value) {
			if (value !== undefined && value !== null && value.datacenter !== undefined && value.floor !== undefined && $scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
				if (value.cabinet) {
					var inputParam = {"cabinetKey" : value.cabinet.CabinetKey, 'type' : $scope.data.walt_threshold_type, 'metrix' : $scope.data.walt_metrix};
					GsmServices.getnodebycabinet(inputParam).success(function(response) {
						$scope.form.powerMetriceItem = response.responseObject.data;
					});
				} else if ($scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
					$scope.getnodebyfloorForGauge(value);
				}
			}
		}

		$scope.getnodebydcForSensor = function(value) {
			if (value !== undefined && value !== null && $scope.data.sensortype !== undefined) {
				if (value.datacenter) {
					var inputParam = {"dcKey" : value.datacenter.DCKey, 'type' : 'Envsensor', 'sensortype' : $scope.data.sensortype};
					GsmServices.getnodebydc(inputParam).success(function(response) {
						$scope.choices[value.id - 1].form.sensor = response.responseObject.data;
					});
				} else if ($scope.data.walt_threshold_type !== undefined && $scope.data.walt_metrix !== undefined) {
					$scope.choices[value.id - 1].form.floorlist = undefined;
					$scope.choices[value.id - 1].form.cabinet = undefined;
					$scope.choices[value.id - 1].floor = undefined;
					$scope.choices[value.id - 1].cabinet = undefined;
					$scope.getpowermetricitemForChoice(null,$scope.data)
				}
			}
		}

		$scope.getnodebyfloorForSensor = function(value) {
			if (value !== undefined && value !== null && $scope.data.sensortype !== undefined) {
				if (value.floor) {
					var inputParam = {"floorid" : value.floor.FloorKey,	'type' : 'Envsensor', 'sensortype' : $scope.data.sensortype};
					GsmServices.getnodebyfloor(inputParam).success(function(response) {
						$scope.choices[value.id - 1].form.sensor = response.responseObject.data;
					});
				} else if (value == 'null') {
					_.filter($scope.choices, function(choice, i) {
						$scope.getnodebyfloorForSensor(choice);
					});
				} else {
					if ($scope.choices[value.id - 1].form !== undefined) {
						$scope.choices[value.id - 1].form.cabinet = undefined;
					}
					$scope.choices[value.id - 1].cabinet = undefined;
					$scope.getnodebydcForSensor(value);

				}

			}
		}

		$scope.getnodebycabinetForSensor = function(value) {
			if (value !== undefined && value !== null && $scope.data.sensortype !== undefined) {
				if (value.cabinet) {
					var inputParam = {"cabinetKey" : value.cabinet.CabinetKey, 'type' : 'Envsensor', 'sensortype' : $scope.data.sensortype};
					GsmServices.getnodebycabinet(inputParam).success(function(response) {
						$scope.choices[value.id - 1].form.sensor = response.responseObject.data;
					});
				} else {
					$scope.getnodebyfloorForSensor(value);
				}
			}
		}

		$scope.getnodebydcForGaugeForSensor = function(value) {
			if (value !== undefined && value !== null && value.sensortype !== undefined) {
				if (value.datacenter) {
					var inputParam = {"dcKey" : value.datacenter.DCKey, 'type' : 'Envsensor', 'sensortype' : value.sensortype};
					GsmServices.getnodebydc(inputParam).success(function(response) {
						$scope.form.sensor = response.responseObject.data;
					});
				} else {
					$scope.form.floorlist = undefined;
					$scope.form.cabinet = undefined;
					$scope.data.floor = undefined;
					$scope.data.cabinet = undefined;
				}
			}
		}

		$scope.getnodebyfloorForGaugeForSensor = function(value) {
			if (value !== undefined && value !== null && value.sensortype != undefined) {
				if (value.floor) {
					var inputParam = {"floorid" : value.floor.FloorKey, 'type' : 'Envsensor', 'sensortype' : value.sensortype};
					GsmServices.getnodebyfloor(inputParam).success(function(response) {
						$scope.form.sensor = response.responseObject.data;
					});
				} else {
					$scope.form.cabinet = undefined;
					$scope.data.cabinet = undefined;
					$scope.getnodebydcForGaugeForSensor(value);
				}
			}
		}

		$scope.getnodebycabinetForGaugeForSensor = function(value) {
			if (value !== undefined && value !== null && value.sensortype != undefined) {
				if (value.cabinet) {
					var inputParam = {"cabinetKey" : value.cabinet.CabinetKey, 'type' : 'Envsensor', 'sensortype' : value.sensortype};
					GsmServices.getnodebycabinet(inputParam).success(function(response) {
						$scope.form.sensor = response.responseObject.data;
					});
				} else {
					$scope.getnodebyfloorForGaugeForSensor(value);
				}
			}
		}

		$scope.getsensorbyfloor = function(value, id) {
			if (value !== undefined && value !== null) {
				var inputParam = {"FloorKey" : value.FloorKey};
				GsmServices.getsensorbyfloor(inputParam).success(function(response) {
					if (response.responseCode == 200) {
						if (widget.jsfunctionname == "sensor_gauge") {
							$scope.form.sensorList = response.responseObject.data;
							$scope.form.sensor = $scope.form.sensorList;
						} else {
							_.filter($scope.choices,function(row,id) {
								$scope.form.sensorList = response.responseObject.data;
								$scope.choices[id].form = {}
								$scope.choices[id].form.sensor = $scope.form.sensorList;
							})
						}
					} else {
						$scope.form.sensor = response.responseObject;
					}
				});
			} else {
				if (widget.jsfunctionname == "sensor_gauge") {
					$scope.form.sensorList = [];
					$scope.form.sensor = $scope.form.sensorList;
				} else {
					_.filter($scope.choices,function(row, id) {
						$scope.form.sensorList = [];
						$scope.choices[id].form = {}
						$scope.choices[id].form.sensor = $scope.form.sensorList;
					})
				}
			}
		}

		$scope.getsensorbyfloorusingcabinet = function(value, floor, id) {
			if (value !== undefined && value !== null && $scope.form.sensorList !== undefined && $scope.form.sensorList !== null) {
				if (widget.jsfunctionname == "sensor_gauge") {
					$scope.form.sensor = _.filter($scope.form.sensorList, function(row) {
												return row.CabinetName == value.CabinetName;
											});
				} else {
					$scope.choices[id - 1].form = {}
					$scope.choices[id - 1].form.sensor = _.filter($scope.form.sensorList,function(row) {
																return row.CabinetName == value.CabinetName;
															});
				}
			} else {
				$scope.getsensorbyfloor(floor);
			}
		}

		$scope.getFloor = function(value, id) {
			if (value !== undefined && value !== null) {
				if (id !== null && id !== undefined) {
					var inputdata = {'dcId' : value.DCKey}
					GsmServices.getFloorList(inputdata).success(function(response) {
						$scope.choices[id].form = {};
						$scope.choices[id].form.floorlist = response.responseObject.data;
					});
				} else {
					var inputdata = {'dcId' : value.DCKey}
					GsmServices.getFloorList(inputdata).success(function(response) {
						$scope.form.floorlist = response.responseObject.data;
					});
				}
			}
		}

		$scope.getCabinet = function(value, id) {
			if (value !== undefined && value !== null) {
				if (id !== null && id !== undefined) {
					var inputdata = {'FloorKey' : value.FloorKey};
					GsmServices.getCabinets(inputdata).success(function(response) {
						$scope.choices[id].form.cabinet = response.responseObject.data;
					});
				} else {
					var inputdata = {'FloorKey' : value.FloorKey};
					GsmServices.getCabinets(inputdata).success(function(response) {
						$scope.form.cabinet = response.responseObject.data;
					});
				}
			}
		}

		if (widget.jsfunctionname === "walt_thresold") {
			var thresoldData = JSON.parse(UtilsFactory.getWaltThresholdData(widget.childWidgets));
			if (thresoldData.setting.powerMetriceItem !== undefined) {
				$scope.initializeForm();
				$scope.data = {
					datacenter : thresoldData.setting.datacenter,
					floor : thresoldData.setting.floor,
					cabinet : thresoldData.setting.cabinet,
					walt_threshold_type : thresoldData.setting.walt_threshold_type,
					feed : thresoldData.setting.feed,
					phase : thresoldData.setting.phase,
					walt_metrix : thresoldData.setting.walt_metrix,
					updateInterval : thresoldData.setting.update_interval.intervalType,
					checkFilter : thresoldData.setting.checkFilter,
					powerMetriceItem : thresoldData.setting.powerMetriceItem,
					headerColorInput : thresoldData.setting.headerColorInput,
					dayformax : thresoldData.setting.dayformax
				};
				if ($scope.data.dayformax == 'NULL') {
					$scope.data.dayformax = null;
				}
				$scope.form.datacenter = thresoldData.widgetSetting.dataCenter;
				if ($scope.data.floor && $scope.data.floor.FloorName) {
					$scope.getFloor($scope.data.datacenter);
				}
				if ($scope.data.cabinet && $scope.data.cabinet.CabinetName) {
					$scope.getCabinet($scope.data.floor);
				}
				if ($scope.data.walt_threshold_type) {
					$scope.getMetrixForGauge($scope.data);
				}
				if ($scope.data.powerMetriceItem) {
					$timeout(function() {
						$scope.getpowermetricitem($scope.data);
					}, 10)
				}

				if ($scope.data.feed == 'null' && $scope.data.phase == 'null') {
					$scope.data.feed = undefined;
					$scope.data.phase = undefined;
				}

				$scope.form.threshold_type = thresoldData.widgetSetting.thresoldType;
				$scope.form.feed = thresoldData.widgetSetting.feed;
				$scope.form.phase = thresoldData.widgetSetting.phase;
				$scope.form.updateInterval = thresoldData.widgetSetting.timeInterval;
				console.log($scope.form,$scope.data.powerMetriceItem);
				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = thresoldData.setting.update_interval.intervalTime;
				}
			} else {
				$scope.initializeForm();
				$scope.form.datacenter = thresoldData.widgetSetting.dataCenter;
				$scope.form.feed = thresoldData.widgetSetting.feed;
				$scope.form.phase = thresoldData.widgetSetting.phase;
				$scope.form.updateInterval = thresoldData.widgetSetting.timeInterval;
				$scope.form.threshold_type = thresoldData.widgetSetting.thresoldType;
			}
		} else if (widget.jsfunctionname === 'bar_thresold' || widget.jsfunctionname === 'line_thresold' || widget.jsfunctionname === 'area_thresold') {
			var thresoldData = JSON.parse(UtilsFactory.getHistoryGraphData(widget.childWidgets));
			if (thresoldData.setting !== null && thresoldData.setting.walt_threshold_type !== undefined) {
				$scope.initializeForm();
				$scope.data = {walt_threshold_type : thresoldData.setting.walt_threshold_type, walt_metrix : thresoldData.setting.walt_metrix, datatype : thresoldData.setting.datatype, 
							dateRange : $filter('DateAdderAndFormatter')(thresoldData.setting.dateRangeFrom, thresoldData.setting.dateRangeTo),	updateInterval : thresoldData.setting.update_interval.intervalType
				};
				if (thresoldData.setting.days != 'null' && thresoldData.setting.days != undefined) {
					$scope.data.days = thresoldData.setting.days;
				} else {
					$scope.data.days = "";
				}

				if ($scope.data.datatype == "Average" || $scope.data.datatype == "Minimum" || $scope.data.datatype == "Maximum") {
					$scope.data.subdatatype = thresoldData.setting.subdatatype;
				}
				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = thresoldData.setting.update_interval.intervalTime;
				}

				$scope.form.datatype = thresoldData.widgetSetting.datatype;
				$scope.form.feed = thresoldData.widgetSetting.feed;
				$scope.form.phase = thresoldData.widgetSetting.phase;
				$scope.form.subdatatype = thresoldData.widgetSetting.subdatatype;
				$scope.form.threshold_type = thresoldData.widgetSetting.thresoldType;
				$scope.form.updateInterval = thresoldData.widgetSetting.timeInterval;
				var dateRange = [$filter('DateAdderAndFormatter')(thresoldData.setting.dateRangeFrom), $filter('DateAdderAndFormatter')(thresoldData.setting.dateRangeTo) ];
				UtilsFactory.setDateRange(dateRange,widget.childWidgets);
				if ($scope.data.walt_metrix) {
					$scope.getMetrixValue($scope.data)
				}
				_.each(
								thresoldData.setting.choices,
								function(choice, i) {
									$scope.choices[i] = {};
									$scope.choices[i].id = i + 1;
									$scope.choices[i].form = {};
									$scope.choices[i].checkFilter = choice.checkFilter;
									$scope.choices[i].datacenter = choice.datacenter;
									$scope.choices[i].floor = choice.floor;
									$scope.choices[i].cabinet = choice.cabinet;
									$scope.choices[i].powerMetriceItem = choice.powerMetriceItem;
									$scope.choices[i].feed = choice.feed;
									$scope.choices[i].phase = choice.phase;
									if ($scope.choices[i].feed == 'null' && $scope.choices[i].phase == 'null') {
										$scope.choices[i].feed = undefined;
										$scope.choices[i].phase = undefined;
									}

									if ($scope.choices[i].datacenter) {
										$scope.getFloor($scope.choices[i].datacenter,i)
									}
									if ($scope.choices[i].floor && $scope.choices[i].floor.length !== 0) {
										$timeout(function() {
													$scope.getCabinet($scope.choices[i].floor,i);
										}, 10)
									}

									if ($scope.choices[i].cabinet && $scope.choices[i].cabinet.length !== 0) {
										$timeout(function() {
													$scope.getnodebycabinet($scope.choices[i]);
										}, 10)
									} else if ($scope.choices[i].floor && $scope.choices[i].floor.length !== 0) {
										$timeout(function() {
													$scope.getnodebyfloor($scope.choices[i]);
										}, 10)
									} else {
										$timeout(function() {
													$scope.getnodebydc($scope.choices[i]);
										}, 10)
									}

								})
				$scope.form.datacenter = thresoldData.widgetSetting.datacenter;
			} else {
				$scope.initializeForm();
				$scope.choices[0].form = {};
				$scope.form.threshold_type = thresoldData.widgetSetting.thresoldType;
				$scope.form.datacenter = thresoldData.widgetSetting.datacenter;
				$scope.form.feed = thresoldData.widgetSetting.feed;
				$scope.form.phase = thresoldData.widgetSetting.phase;
				$scope.form.datatype = thresoldData.widgetSetting.datatype;
				$scope.form.subdatatype = thresoldData.widgetSetting.subdatatype;
				$scope.form.updateInterval = thresoldData.widgetSetting.timeInterval;
			}
		} else if (widget.jsfunctionname === "getFloor") {
			var floorData = JSON.parse(UtilsFactory.getFloorImage(widget.childWidgets));
			if (floorData.setting !== null && floorData.setting.datacenter !== undefined) {
				$scope.initializeForm();
				$scope.data = {datacenter : floorData.setting.datacenter,floor : floorData.setting.floor,updateInterval : floorData.setting.update_interval.intervalType};
				$scope.form.datacenter = floorData.widgetSetting.dataCenter;
				if ($scope.data.floor) {
					$scope.getFloor($scope.data.datacenter);
				}

				$scope.form.updateInterval = floorData.widgetSetting.updateInterval;
				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = floorData.setting.update_interval.intervalTime;
				}
			} else {
				$scope.initializeForm();
				$scope.form.datacenter = floorData.widgetSetting.dataCenter;
				$scope.form.updateInterval = floorData.widgetSetting.updateInterval;
			}
		} else if (widget.jsfunctionname === 'chart_spider') {
			var spiderdata = JSON.parse(UtilsFactory.getSpiderchartData(widget.childWidgets));
			if (spiderdata.setting !== null && spiderdata.setting.cabinet !== undefined) {
				$scope.initializeForm();
				$scope.data = {datacenter : spiderdata.setting.datacenter, floor : spiderdata.setting.floorlist, updateInterval : spiderdata.setting.update_interval.intervalType};
				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = spiderdata.setting.update_interval.intervalTime;
				}
				$scope.form.datacenter = spiderdata.widgetSetting.datacenter;
				$scope.form.updateInterval = spiderdata.widgetSetting.timeInterval;
				if ($scope.data.floor) {
					$scope.getFloor($scope.data.datacenter)
				}

				_.each(spiderdata.setting.cabinet, function(choice,i) {
					$scope.choices[i] = {};
					$scope.choices[i].id = i + 1;
					$scope.choices[i].form = {};
					$scope.choices[i].cabinet = choice.cabinet;
					if ($scope.choices[i].cabinet) {
						$scope.getCabinet($scope.data.floor);
					}
				})

			} else {
				$scope.initializeForm();
				$scope.form.datacenter = spiderdata.widgetSetting.datacenter;
				$scope.form.updateInterval = spiderdata.widgetSetting.timeInterval;
			}
		} else if (widget.jsfunctionname === 'chart_floor_spider') {

			var spiderFloordata = JSON.parse(UtilsFactory.getSpiderchartData(widget.childWidgets));
			if (spiderFloordata.setting !== null && spiderFloordata.setting.floor !== undefined) {
				$scope.initializeForm();
				$scope.data = {datacenter : spiderFloordata.setting.datacenter,updateInterval : spiderFloordata.setting.update_interval.intervalType};
				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = spiderFloordata.setting.update_interval.intervalTime;
				}
				$scope.form.datacenter = spiderFloordata.widgetSetting.datacenter;
				$scope.form.updateInterval = spiderFloordata.widgetSetting.timeInterval;

				_.each(spiderFloordata.setting.floor, function(choice, i) {
					$scope.choices[i] = {};
					$scope.choices[i].id = i + 1;
					$scope.choices[i].form = {};
					$scope.choices[i].floor = choice.floor;
					if ($scope.choices[i].floor) {
						$scope.getFloor($scope.data.datacenter)
					}
				})
			} else {
				$scope.initializeForm();
				$scope.form.datacenter = spiderFloordata.widgetSetting.datacenter;
				$scope.form.updateInterval = spiderFloordata.widgetSetting.timeInterval;
			}
		} else if (widget.jsfunctionname === "pue_line_chart" || widget.jsfunctionname === "pue_area_chart" || widget.jsfunctionname === "pue_bar_chart") {
			var pueData = JSON.parse(UtilsFactory.getHistoryGraphData(widget.childWidgets));
			if (pueData.setting !== null && pueData.setting.formula !== "null" && pueData.setting.formula !== undefined) {
				$scope.initializeForm();
				_.each(
						pueData.setting.formula,
						function(choice, i) {
							$scope.choices[i] = {};
							$scope.choices[i].id = i + 1;
							$scope.choices[i].form = {};
							$scope.choices[i].formula = choice.formula;
							$scope.choices[i].form.formula = pueData.widgetSetting.formula;

					})
				$scope.data = {dateRange : $filter('DateAdderAndFormatter')(pueData.setting.dateRangeFrom,pueData.setting.dateRangeTo), datatype : pueData.setting.datatype, updateInterval : pueData.setting.update_interval.intervalType};
				if (pueData.setting.days != 'null' && pueData.setting.days != undefined) {
					$scope.data.days = pueData.setting.days;
				} else {
					$scope.data.days = "";
				}

				if ($scope.data.datatype == "Average" || $scope.data.datatype == "Minimum" || $scope.data.datatype == "Maximum") {
					$scope.data.subdatatype = pueData.setting.subdatatype;
				}

				var dateRange = [$filter('DateAdderAndFormatter')(pueData.setting.dateRangeFrom),$filter('DateAdderAndFormatter')(pueData.setting.dateRangeTo) ];
				UtilsFactory.setDateRange(dateRange, widget.childWidgets);
				$scope.form.updateInterval = pueData.widgetSetting.timeInterval;
				$scope.form.datatype = pueData.widgetSetting.datatype;
				$scope.form.subdatatype = pueData.widgetSetting.subdatatype;
				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = pueData.setting.update_interval.intervalTime;
				}
			} else {
				$scope.initializeForm();
				$scope.form.updateInterval = pueData.widgetSetting.timeInterval;
				$scope.choices[0].form = {}
				$scope.choices[0].form.formula = pueData.widgetSetting.formula;
				$scope.form.datatype = pueData.widgetSetting.datatype;
				$scope.form.subdatatype = pueData.widgetSetting.subdatatype;
			}
		} else if (widget.jsfunctionname === "line_getwithoutpuehistory" || widget.jsfunctionname === "bar_getwithoutpuehistory" || widget.jsfunctionname === "area_getwithoutpuehistory") {
			var withoutPueHistory = JSON.parse(UtilsFactory.getHistoryGraphData(widget.childWidgets));
			if (withoutPueHistory.setting !== null && withoutPueHistory.setting.formula !== "null" && withoutPueHistory.setting.formula !== undefined) {
				$scope.initializeForm();
				_.each(
						withoutPueHistory.setting.formula,
						function(choice, i) {
							$scope.choices[i] = {};
							$scope.choices[i].id = i + 1;
							$scope.choices[i].form = {};
							$scope.choices[i].formula = choice.formula;
							$scope.choices[i].form.formula = withoutPueHistory.widgetSetting.formula;
					})
				$scope.data = {dateRange : $filter('DateAdderAndFormatter')(withoutPueHistory.setting.dateRangeFrom,withoutPueHistory.setting.dateRangeTo), datatype : withoutPueHistory.setting.datatype,updateInterval : withoutPueHistory.setting.update_interval.intervalType};

				if ($scope.data.datatype == "Average" || $scope.data.datatype == "Minimum" || $scope.data.datatype == "Maximum") {
					$scope.data.subdatatype = withoutPueHistory.setting.subdatatype;
				}
				if (withoutPueHistory.setting.days != 'null' && withoutPueHistory.setting.days != undefined) {
					$scope.data.days = withoutPueHistory.setting.days;
				} else {
					$scope.data.days = "";
				}
				$scope.form.updateInterval = withoutPueHistory.widgetSetting.timeInterval;
				$scope.form.datatype = withoutPueHistory.widgetSetting.datatype;
				$scope.form.subdatatype = withoutPueHistory.widgetSetting.subdatatype;
				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = withoutPueHistory.setting.update_interval.intervalTime;
				}
				var dateRange = [$filter('DateAdderAndFormatter')(withoutPueHistory.setting.dateRangeFrom),$filter('DateAdderAndFormatter')(withoutPueHistory.setting.dateRangeTo) ];
				UtilsFactory.setDateRange(dateRange,widget.childWidgets);
			} else {
				$scope.initializeForm();
				$scope.form.updateInterval = withoutPueHistory.widgetSetting.timeInterval;
				$scope.choices[0].form = {}
				$scope.choices[0].form.formula = withoutPueHistory.widgetSetting.formula;
				$scope.form.datatype = withoutPueHistory.widgetSetting.datatype;
				$scope.form.subdatatype = withoutPueHistory.widgetSetting.subdatatype;
			}
		} else if (widget.jsfunctionname == "line_sensor" || widget.jsfunctionname == "area_sensor" || widget.jsfunctionname == "bar_sensor") {
			var sensorData = JSON.parse(UtilsFactory.getHistoryGraphData(widget.childWidgets));
			if (sensorData.setting !== null && sensorData.setting.choices !== undefined) { 
				$scope.initializeForm();
				$scope.data = {dateRange : $filter('DateAdderAndFormatter')(sensorData.setting.dateRangeFrom,sensorData.setting.dateRangeTo),sensortype : sensorData.setting.sensortype,datatype : sensorData.setting.datatype,metrixtype : sensorData.setting.metrixtype,updateInterval : sensorData.setting.update_interval.intervalType};
				if ($scope.data.metrixtype == 'null') {
					$scope.data.metrixtype = undefined;
				}
				if ($scope.data.datatype == "Average" || $scope.data.datatype == "Minimum"  || $scope.data.datatype == "Maximum") {
					$scope.data.subdatatype = sensorData.setting.subdatatype;
				}
				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = sensorData.setting.update_interval.intervalTime;
				}
				if (sensorData.setting.days != 'null' && sensorData.setting.days != undefined) {
					$scope.data.days = sensorData.setting.days;
				} else {
					$scope.data.days = "";
				}
				$scope.form.datacenter = sensorData.widgetSetting.datacenter;
				$scope.form.datatype = sensorData.widgetSetting.datatype;
				$scope.form.sensortype = sensorData.widgetSetting.sensortype;
				$scope.form.subdatatype = sensorData.widgetSetting.subdatatype;
				$scope.form.metrixtype = sensorData.widgetSetting.metrixtype;
				$scope.form.updateInterval = sensorData.widgetSetting.timeInterval;
				var dateRange = [$filter('DateAdderAndFormatter')(sensorData.setting.dateRangeFrom),$filter('DateAdderAndFormatter')(sensorData.setting.dateRangeTo) ];
				UtilsFactory.setDateRange(dateRange,widget.childWidgets);
				_.each(
								sensorData.setting.choices,
								function(choice, i) {
									$scope.choices[i] = {};
									$scope.choices[i].id = i + 1;
									$scope.choices[i].form = {};
									$scope.choices[i].datacenter = choice.datacenter;
									$scope.choices[i].floor = choice.floor;
									$scope.choices[i].cabinet = choice.cabinet;
									$scope.choices[i].sensor = choice.sensor;
									if ($scope.choices[i].datacenter) {
										$scope.getFloor($scope.choices[i].datacenter,i);
									}
									if ($scope.choices[i].floor) {
										$timeout(function() {
													$scope.getCabinet($scope.choices[i].floor,i);
										}, 10)
									}
									if ($scope.choices[i].cabinet) {
										$timeout(function() {
													$scope.getnodebycabinetForSensor($scope.choices[i]);
												}, 10)
									} else if ($scope.choices[i].floor) {
										$timeout(function() {
													$scope.getnodebyfloorForSensor($scope.choices[i]);
										}, 10)
									} else {
										$timeout(function() {
													$scope.getnodebydcForSensor($scope.choices[i]);
										}, 10)
									}
								})
			} else {
				$scope.initializeForm();
				$scope.form.datatype = sensorData.widgetSetting.datatype;
				$scope.form.sensortype = sensorData.widgetSetting.sensortype;
				$scope.form.subdatatype = sensorData.widgetSetting.subdatatype;
				$scope.form.metrixtype = sensorData.widgetSetting.metrixtype;
				$scope.form.datacenter = sensorData.widgetSetting.datacenter;
				$scope.form.updateInterval = sensorData.widgetSetting.timeInterval;
			}
		} else if (widget.jsfunctionname === "sensor_gauge") {
			var SensorGaugeData = JSON.parse(UtilsFactory.getSensorGaugeData(widget.childWidgets));
			if (SensorGaugeData.setting.Sensor !== undefined) {
				$scope.initializeForm();
				$scope.data = {datacenter : SensorGaugeData.setting.datacenter,  floor : SensorGaugeData.setting.floor, cabinet : SensorGaugeData.setting.cabinet, sensortype : SensorGaugeData.setting.sensortype, metrixtype : SensorGaugeData.setting.metrixtype, sensor : SensorGaugeData.setting.Sensor, updateInterval : SensorGaugeData.setting.update_interval.intervalType, headerColorInput : SensorGaugeData.setting.headerColorInput, dayformax : SensorGaugeData.setting.dayformax};
				if ($scope.data.dayformax == 'NULL') {
					$scope.data.dayformax = null;
				}
				$scope.form.datacenter = SensorGaugeData.widgetSetting.dataCenter;
				$scope.form.floorlist = SensorGaugeData.widgetSetting.floor;
				if ($scope.data.datacenter) {
					$scope.getFloor($scope.data.datacenter);
				}
				if ($scope.data.metrixtype == 'null') {
					$scope.data.metrixtype = undefined;
				}
				if ($scope.data.floor != null || $scope.data.floor != undefined) { 
					$scope.getCabinet($scope.data.floor);
				}
				if ($scope.data.cabinet) {
					$timeout(function() {
								$scope.getnodebycabinetForGaugeForSensor($scope.data);
					}, 10)
				} else if ($scope.data.floor) {
					$timeout(function() {
								$scope.getnodebyfloorForGaugeForSensor($scope.data);
					}, 10)
				} else {
					$timeout(function() {
								$scope.getnodebydcForGaugeForSensor($scope.data);
					}, 10)
				}

				$scope.form.threshold_type = SensorGaugeData.widgetSetting.thresoldType;
				$scope.form.sensortype = SensorGaugeData.widgetSetting.sensortype;
				$scope.form.metrixtype = SensorGaugeData.widgetSetting.metrixtype;
				$scope.form.updateInterval = SensorGaugeData.widgetSetting.updateInterval;
				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = SensorGaugeData.setting.update_interval.intervalTime;
				}
			} else {
				$scope.initializeForm();
				$scope.form.datacenter = SensorGaugeData.widgetSetting.dataCenter;
				$scope.form.sensortype = SensorGaugeData.widgetSetting.sensortype;
				$scope.form.metrixtype = SensorGaugeData.widgetSetting.metrixtype;
				$scope.form.updateInterval = SensorGaugeData.widgetSetting.updateInterval;
			}
		} else if (widget.jsfunctionname === 'getRackElevationData') {
			var rackElevationData = JSON.parse(UtilsFactory.getRackElevationChartData());
			if (rackElevationData.setting !== null && rackElevationData.setting !== undefined && rackElevationData.setting.datacenter !== undefined) {
				$scope.initializeForm();
				$scope.data = {datacenter : rackElevationData.setting.datacenter,floor : rackElevationData.setting.floorlist, cabinet : rackElevationData.setting.cabinet,updateInterval : rackElevationData.setting.update_interval.intervalType};
				$scope.form.datacenter = rackElevationData.widgetSetting.dataCenter;
				if ($scope.data.floor) {
					$scope.getFloor($scope.data.datacenter)
				}
				if ($scope.data.cabinet) {
					$scope.getCabinet($scope.data.floor);
				}
				$scope.form.updateInterval = rackElevationData.widgetSetting.updateInterval;
				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = rackElevationData.setting.update_interval.intervalTime;
				}
			} else {
				$scope.initializeForm();
				$scope.form.datacenter = rackElevationData.widgetSetting.dataCenter;
				$scope.form.updateInterval = rackElevationData.widgetSetting.updateInterval;
			}
		} else if (widget.jsfunctionname === "chart_cabinet") {
			var infoData = JSON.parse(UtilsFactory.getInfoChartData(widget.childWidgets));
			if (infoData.setting != null && infoData.setting.datacenter !== undefined) {
				$scope.initializeForm();
				$scope.data = {datacenter : infoData.setting.datacenter,floor : infoData.setting.floor,cabinet : infoData.setting.cabinet,updateInterval : infoData.setting.update_interval.intervalType};
				$scope.form.datacenter = infoData.widgetSetting.dataCenter;
				if ($scope.data.floor) {
					$scope.getFloor($scope.data.datacenter);
				}
				if ($scope.data.cabinet) {
					$scope.getCabinet($scope.data.floor);
				}
				$scope.form.updateInterval = infoData.widgetSetting.timeInterval;

				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = infoData.setting.update_interval.intervalTime;
				}
			} else {
				$scope.initializeForm();
				$scope.form.datacenter = infoData.widgetSetting.dataCenter;
				$scope.form.updateInterval = infoData.widgetSetting.timeInterval;
			}
		} else if (widget.jsfunctionname === "pue_live" || widget.jsfunctionname === "gauge_getwithoutpuehistory") {
			var pueData = JSON.parse(UtilsFactory.getPueData(widget.childWidgets));
			if (pueData.setting !== null && pueData.setting.formula !== undefined) {
				$scope.initializeForm();
				$scope.data = {formula : pueData.setting.formula,updateInterval : pueData.setting.update_interval.intervalType,headerColorInput : pueData.setting.headerColorInput,dayformax : pueData.setting.dayformax};
				if ($scope.data.dayformax == 'NULL') {
					$scope.data.dayformax = null;
				}
				$scope.form.formula = pueData.widgetSetting.formula;
				$scope.form.updateInterval = pueData.widgetSetting.timeInterval;
				if ($scope.data.updateInterval == "Minute" || $scope.data.updateInterval == "Second" || $scope.data.updateInterval == "Hour") {
					$scope.form.time = pueData.setting.update_interval.intervalTime;
				}
			} else {
				$scope.initializeForm();
				$scope.form.formula = pueData.widgetSetting.formula;
				$scope.form.updateInterval = pueData.widgetSetting.timeInterval;
			}
		} else {
			$scope.form = widget;
		}

		$scope.dismiss = function() {
			$modalInstance.dismiss();
		};

		$scope.setSaveSettings = function() {
			console.log('form', $scope.form);
			inputdata.widgetsData = {'sizeX' : $scope.form.sizeX,'sizeY' : $scope.form.sizeY,'col' : $scope.form.col,'row' : $scope.form.row,'id' : ($scope.form.jsfunctionname == 'getRackElevationData') ? $rootScope.rackChildId: widget.childWidgets,'name' : $scope.form.name,'widgetname' : $scope.form.widgetname,'functionName' : widget.jsfunctionname};
			return inputdata;
		}

		$scope.SaveSettingForWidget = function(data, form) {
			if (!form.$invalid) {
				if (widget.jsfunctionname == "getRackElevationData") {
					inputdata.DashType = 1;
				} else {
					inputdata.DashType = 0;
				}
				if (widget.jsfunctionname === "getFloor") {
					inputdata = $scope.setSaveSettings();
					if (data.floor != 'undefined' || data.floor != '') {
						data.floor.FloorImage = "";
						data.floor.FloorImage64 = "";
					}
					inputdata.settings = {'datacenter' : data.datacenter,'floor' : data.floor,'update_interval' : {'intervalType' : data.updateInterval,'intervalTime' : $scope.form.time}};
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									});
				} else if (widget.jsfunctionname === "walt_thresold") {
					inputdata = $scope.setSaveSettings();
					if (data.walt_threshold_type != "AggPower") {
						data.feed = 'null';
						data.phase = 'null';
					}
					if (data.dayformax == undefined || data.dayformax == 'null') {
						data.dayformax = null;
					}
					inputdata.widgetsData.widgetname = data.powerMetriceItem.NamePath;
					inputdata.settings = {'datacenter' : data.datacenter,'floor' : data.floor,'cabinet' : data.cabinet,'walt_threshold_type' : data.walt_threshold_type,'walt_metrix' : data.walt_metrix,'feed' : data.feed, 'phase' : data.phase,'checkFilter' : data.checkFilter,'powerMetriceItem' : data.powerMetriceItem,'dayformax' : data.dayformax,'update_interval' : {'intervalType' : data.updateInterval,'intervalTime' : $scope.form.time},'headerColorInput' : typeof data.headerColorInput == undefined ? 'false': data.headerColorInput};
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									});
				} else if (widget.jsfunctionname === "sensor_gauge") {
					inputdata = $scope.setSaveSettings();
					if (data.sensortype != "Temperature") {
						data.metrixtype = 'null';
					}
					if (data.dayformax == undefined || data.dayformax == 'null') {
						data.dayformax = null;
					}
					inputdata.widgetsData.widgetname = data.sensor.NamePath;
					inputdata.settings = {'datacenter' : data.datacenter,'floor' : data.floor,'cabinet' : data.cabinet,'sensortype' : data.sensortype,'metrixtype' : data.metrixtype,'Sensor' : data.sensor,'dayformax' : data.dayformax,'update_interval' : {'intervalType' : data.updateInterval,'intervalTime' : $scope.form.time},'headerColorInput' : typeof data.headerColorInput == undefined ? 'false': data.headerColorInput};
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									});
				} else if (widget.jsfunctionname === "chart_cabinet") {
					inputdata = $scope.setSaveSettings();
					inputdata.settings = {'datacenter' : data.datacenter,'floor' : data.floor,'cabinet' : data.cabinet,'update_interval' : {'intervalType' : data.updateInterval,'intervalTime' : $scope.form.time}};
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									});
				} else if (widget.jsfunctionname === "pue_live" || widget.jsfunctionname === "gauge_getwithoutpuehistory") {
					inputdata = $scope.setSaveSettings();
					inputdata.widgetsData.widgetname = data.formula.FormulaTitle;
					if (data.dayformax == undefined || data.dayformax == 'null') {
						data.dayformax = null;
					}
					inputdata.settings = {'formula' : data.formula,'dayformax' : data.dayformax,'update_interval' : {'intervalType' : data.updateInterval, 'intervalTime' : $scope.form.time},'headerColorInput' : typeof data.headerColorInput == undefined ? 'false': data.headerColorInput};
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									});
				} else if (widget.jsfunctionname === "bar_thresold" || widget.jsfunctionname === 'line_thresold' || widget.jsfunctionname === 'area_thresold') {
					inputdata = $scope.setSaveSettings();
					if (data.datatype == "Actual") {
						data.subdatatype = 'null';
					}

					inputdata.settings = {'walt_threshold_type' : data.walt_threshold_type,'walt_metrix' : data.walt_metrix,'choices' : $scope.choices,'days' : data.days,'dateRangeFrom' : $filter('DateDividerAndFormatter')(data.dateRange)[0],'dateRangeTo' : $filter('DateDividerAndFormatter')(data.dateRange)[1],'datatype' : data.datatype,'subdatatype' : data.subdatatype,'update_interval' : {'intervalType' : data.updateInterval,'intervalTime' : $scope.form.time}};

					if (data.walt_threshold_type != "AggPower") {
						_.filter(inputdata.settings.choices,function(choice, i) {
									inputdata.settings.choices[i].feed = 'null';
									inputdata.settings.choices[i].phase = 'null';
								});
					}
					_.filter(inputdata.settings.choices, function(choice, i) {
						inputdata.settings.choices[i].form = {};
					});
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									});
				} else if (widget.jsfunctionname === "chart_spider") {
					inputdata = $scope.setSaveSettings();
					if (data.floor != 'undefined' || data.floor != '') {
						data.floor.FloorImage = "";
						data.floor.FloorImage64 = "";
					}
					inputdata.settings = {'datacenter' : data.datacenter,'floorlist' : data.floor,'cabinet' : $scope.choices,'update_interval' : {'intervalType' : data.updateInterval,'intervalTime' : $scope.form.time}};
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									});
				} else if (widget.jsfunctionname === "chart_floor_spider") {
					inputdata = $scope.setSaveSettings();
					inputdata.settings = {'datacenter' : data.datacenter,'floor' : $scope.choices,'update_interval' : {'intervalType' : data.updateInterval,'intervalTime' : $scope.form.time}};
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									});
				} else if (widget.jsfunctionname === "pue_line_chart" || widget.jsfunctionname === "pue_bar_chart" || widget.jsfunctionname === "pue_area_chart") {
					inputdata = $scope.setSaveSettings();
					if (data.datatype == "Actual") {
						data.subdatatype = 'null';
					}
					inputdata.settings = {'formula' : $scope.choices};
					inputdata.settings.days = data.days;
					inputdata.settings.dateRangeFrom = $filter('DateDividerAndFormatterForDash')(data.dateRange)[0];
					inputdata.settings.dateRangeTo = $filter('DateDividerAndFormatterForDash')(data.dateRange)[1];
					inputdata.settings.datatype = data.datatype;
					inputdata.settings.subdatatype = data.subdatatype;
					inputdata.settings.update_interval = {'intervalType' : data.updateInterval,'intervalTime' : $scope.form.time}
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									}).error(function(ex) {
								Notification.error({message : ex.message,delay : Constants.DELAY});
							});
				} else if (widget.jsfunctionname === "area_sensor" || widget.jsfunctionname === "bar_sensor" || widget.jsfunctionname === "line_sensor") {
					inputdata = $scope.setSaveSettings();
					if ($scope.data.sensortype != "Temperature") {
						$scope.data.metrixtype = 'null';
					}
					if (data.datatype == "Actual") {
						data.subdatatype = 'null';
					}
					inputdata.settings = {'choices' : $scope.choices,'sensortype' : data.sensortype,'metrixtype' : data.metrixtype};
					inputdata.settings.days = data.days;
					inputdata.settings.datatype = data.datatype;
					inputdata.settings.subdatatype = data.subdatatype;
					inputdata.settings.dateRangeFrom = $filter('DateDividerAndFormatter')(data.dateRange)[0];
					inputdata.settings.dateRangeTo = $filter('DateDividerAndFormatter')(data.dateRange)[1];
					inputdata.settings.update_interval = {'intervalType' : data.updateInterval,'intervalTime' : $scope.form.time};
					_.filter(inputdata.settings.choices, function(choice, i) {
						inputdata.settings.choices[i].form = {};
					});
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									}).error(function(ex) {
								Notification.error({message : ex.message,delay : Constants.DELAY});
							});
				} else if (widget.jsfunctionname === "line_getwithoutpuehistory" || widget.jsfunctionname === "bar_getwithoutpuehistory" || widget.jsfunctionname === "area_getwithoutpuehistory") {
					inputdata = $scope.setSaveSettings();
					if (data.datatype == "Actual") {
						data.subdatatype = 'null';
					}
					inputdata.settings = {'formula' : $scope.choices};
					_.filter(inputdata.settings.formula, function(choice, i) {
						inputdata.settings.formula[i].form = {};
					});
					inputdata.settings.days = data.days;
					inputdata.settings.dateRangeFrom = $filter('DateDividerAndFormatterForDash')(data.dateRange)[0];
					inputdata.settings.dateRangeTo = $filter('DateDividerAndFormatterForDash')(data.dateRange)[1];
					inputdata.settings.datatype = data.datatype;
					inputdata.settings.subdatatype = data.subdatatype;
					inputdata.settings.update_interval = {'intervalType' : data.updateInterval,'intervalTime' : $scope.form.time}
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									}).error(function(ex) {
								Notification.error({message : ex.message,delay : Constants.DELAY});
							});
				} else if (widget.jsfunctionname === 'getRackElevationData') {
					inputdata = $scope.setSaveSettings();
					inputdata.widgetsData.name = widget.name;
					inputdata.widgetsData.widgetname = widget.widgetname;
					if (widget.id == undefined || widget.id == '') {
						inputdata.id = $rootScope.rackChildId;
						widget.id = $rootScope.rackChildId;
					}
					if (data.floor != 'undefined' || data.floor != '') {
						data.floor.FloorImage = "";
						data.floor.FloorImage64 = "";
					}
					inputdata.settings = {'datacenter' : data.datacenter,'floorlist' : data.floor,'cabinet' : data.cabinet,'update_interval' : {'intervalType' : data.updateInterval,'intervalTime' : $scope.form.time}};
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;
					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getCabinetDataAfterSave",inputdata.widgetsData,response.responseObject);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									}).error(function(ex) {
								Notification.error({message : ex.message,delay : Constants.DELAY});
							});
				} else {
					inputdata = $scope.setSaveSettings();
					if ($scope.form.jsfunctionname === "chart_notes") {
						inputdata.settings = {'title' : widget.data.title,'description' : widget.data.description};
					}
					if ($scope.form.jsfunctionname === "chart_label") {
						inputdata.settings = {'label' : widget.data.label};
					}
					inputdata.dashboardId = $rootScope.selectedDashboardIdForAddWidget;

					GsmServices.save_widget_setting(inputdata).success(function(response) {
										$scope.dismiss();
										$rootScope.$emit("getWidgetDataAfterSave",inputdata.widgetsData,index);
										if ($scope.intervals) {
											$interval.cancel($scope.intervals[widget.childWidgets])
											delete $scope.intervals[widget.childWidgets];
										}
									}).error(function(ex) {
								Notification.error({message : ex.message,delay : Constants.DELAY});
							});
				}
			} else if (form.name.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_TITLE_FIELD,delay : Constants.DELAY});
			} else if (form.widgetName && form.widgetName.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_SUB_TITLE_FIELD,delay : Constants.DELAY});
			} else if (form.formula && form.formula.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_FORMULA_FIELD,delay : Constants.DELAY});
			} else if (form.sensortype && form.sensortype.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_SENSOR_TYPE_FIELD,delay : Constants.DELAY});
			} else if (form.metrixtype && form.metrixtype.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_TEMPERATURE_TYPE_FIELD,delay : Constants.DELAY});
			} else if (form.thresholdType && form.thresholdType.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_THRESHOLD_TYPE_FIELD,delay : Constants.DELAY});
			} else if (form.feed && form.feed.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_FEED_FIELD,delay : Constants.DELAY});
			} else if (form.phase && form.phase.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_PHASE_FIELD,delay : Constants.DELAY});
			} else if (form.metrix && form.metrix.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_METRIC_FIELD,delay : Constants.DELAY});
			} else if (form.datatype && form.datatype.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_DATA_TYPE_FIELD,delay : Constants.DELAY});
			} else if (form.subdatatype && form.subdatatype.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_SUB_DATA_TYPE_FIELD,delay : Constants.DELAY});
			} else if (form.datacenter && form.datacenter.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_DATACENTER_FIELD,delay : Constants.DELAY});
			} else if (form.floor && form.floor.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_FLOOR_FIELD,delay : Constants.DELAY});
			} else if (form.cabinet && form.cabinet.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_CABINET_FIELD,delay : Constants.DELAY});
			} else if (form.sensor && form.sensor.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_SENSOR_FIELD,delay : Constants.DELAY});
			} else if (form.powerMetriceItem && form.powerMetriceItem.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_Item_FIELD,delay : Constants.DELAY});
			} else if (form.daterange && form.daterange.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_DATE_RANGE_FIELD,delay : Constants.DELAY});
			} else if (form.UpdateIntervalArray && form.UpdateIntervalArray.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_UPDATE_INTERVAL_FIELD,delay : Constants.DELAY});
			} else if (form.time && form.time.$invalid) {
				Notification.error({message : Messages.PLEASE_FILL_INPUTS_FOR_TIME_FIELD,delay : Constants.DELAY});
			} else {
				Notification.error({message : Messages.PLEASE_FILL_MANDATORY_FIELDS,delay : Constants.DELAY});
			}
		}
	})
