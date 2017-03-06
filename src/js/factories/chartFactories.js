angular.module('chartfactory',[])
.factory('ChartFactory', function($rootScope, GsmServices, _,$q, UtilsFactory, $timeout, Constants) {
  return {
    sensorGaugeChart: {
        data: sensorGaugeChartData
    },
    mapChart: {
        data: mapChartData
    },
    waltThresholdChart: {
        data: waltThresholdChartData
    },
    chartnotes: {
        data: chartnotesData
    },
    chartlabel: {
        data: chartlabelData
    },
    lineBarAreaHighChartStock:{
        data: lineBarAreaHighChartStockData
    },
   informationChart: {
		data: informationChartData
    },
    pueLive:{
        data : pueData
    },
	spiderChart: {
		data: spiderChartData
	},
	spiderFloorChart: {
		data: spiderFloorChartData
	}
  };
  
  
  function spiderChartData(action, data){
			  var defer = $q.defer();
			  var cabinetName =  [];
			  var uspace = {};
			  var converted = [];
			  usepaceCountfor1 = [];
			  usepaceCountfor2 = [];
			  usepaceCountfor3 = [];
			  usepaceCountfor4 = [];
			  usepaceCountfor5 = [];
			  _.each(data.setting.cabinet, function(cabinet,i){
				  cabinetName[i] = cabinet.cabinet.CabinetName;
			  });
			  _.each(data.data, function(cabinet,i){
				  converted[i] = {}
				  converted[i].usspace = [];
				  usepaceCountfor1[i] = 0;
				  usepaceCountfor2[i] = 0;
				  usepaceCountfor3[i] = 0;
				  usepaceCountfor4[i] = 0;
				  usepaceCountfor5[i] = 0;
				 
				  if(cabinet.AvailU_Dtl == undefined || cabinet.AvailU_Dtl[0]==""){
					  usepaceCountfor1[i] = 42;
					  usepaceCountfor2[i] = 21;
					  usepaceCountfor3[i] = 14;
					  usepaceCountfor4[i] = 10;
					  usepaceCountfor5[i] = 8;
				  }else{
					  _.each(cabinet.AvailU_Dtl, function(uspace, j){
						  first = uspace.split("-");
						  converted[i].usspace[j] = {}
						  converted[i].usspace[j].val = first[1]-first[0];
						  converted[i].usspace[j].usspaceCountfor1 = parseInt(converted[i].usspace[j].val/1);
						  converted[i].usspace[j].usspaceCountfor2 = parseInt(converted[i].usspace[j].val/2)
						  converted[i].usspace[j].usspaceCountfor3 = parseInt(converted[i].usspace[j].val/3)
						  converted[i].usspace[j].usspaceCountfor4 = parseInt(converted[i].usspace[j].val/4)
						  converted[i].usspace[j].usspaceCountfor5 = parseInt(converted[i].usspace[j].val/5)
						  usepaceCountfor1[i] = usepaceCountfor1[i] +converted[i].usspace[j].usspaceCountfor1;
						  usepaceCountfor2[i] = usepaceCountfor2[i] +converted[i].usspace[j].usspaceCountfor2;
						  usepaceCountfor3[i] = usepaceCountfor3[i] +converted[i].usspace[j].usspaceCountfor3;
						  usepaceCountfor4[i] = usepaceCountfor4[i] +converted[i].usspace[j].usspaceCountfor4;
						  usepaceCountfor5[i] = usepaceCountfor5[i] +converted[i].usspace[j].usspaceCountfor5;
					  })
				  }
			  })
			  var spiderChart = Highcharts.chart('spider' + action.childWidgets, {
				  colors: ['#0daee6', '#56964a', '#f45b5b', '#b618e2', '#ffa000'],
			        chart: {polar: true,type: 'line'},
			        title: {text: '',},
			        pane: {size: '85%'},
	 				xAxis: {categories: cabinetName,tickmarkPlacement: 'on',lineWidth: 0},
			        yAxis: {gridLineInterpolation: 'polygon',lineWidth: 0,min: 0},
					tooltip: {
			            shared: true,
			            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
			        },
			        plotOptions: {
		                series: {
		                    events: {
		                    	legendItemClick: function(event) {
		                    			var count = 0, index = [];
		                    			var series = this.chart.series;
		                    			for (var i = 0; i < series.length; i++){
		                    				if(series[i].visible){index[count] = i;count ++; }
		                    			}
		                    			if(count==1){
		                    				if(index[0]!=this.index){
		                    					if(this.visible){this.hide();
			                    				}else{this.show();}
		                    				}
		                    			}
		                    			else{
		                    				if(this.visible){this.hide();
		                    				}else{this.show();}}
		                    			 return false;
		                    	}
		                    }
		                }
		            },
			        legend: {
			        	itemStyle: {color: '#E0E0E3'},
			            itemHoverStyle: {color: '#FFF'},
			            itemHiddenStyle: {color: '#606063'},
			        	align: 'center',
			            verticalAlign: 'top',
			            y: 0,
			            layout: 'horizontal'
			        },
			        series: [{name: 'U space for 1u', data: usepaceCountfor1, pointPlacement: 'on'},
			        	{name: 'U space for 2u', data: usepaceCountfor2, pointPlacement: 'on'}, 
			        	{name: 'U space for 3u', data: usepaceCountfor3, pointPlacement: 'on'}, 
			        	{name: 'U space for 4u', data: usepaceCountfor4, pointPlacement: 'on'},
			        	{name: 'U space for 5u', data: usepaceCountfor5, pointPlacement: 'on'}]
			    });
	  defer.resolve(spiderChart);
	  return defer.promise;
  }
  
  function spiderFloorChartData(action, data){
			  var defer = $q.defer();
			  var floorName =  [];
			  AvailU = [];
			  MaxU = [];
			  UsedU = [];
			  _.each(data.setting.floor, function(floor,i){
				  floorName[i] = floor.floor.FloorName;
			  });
			  _.each(data.data, function(floor,i){
				  AvailU[i] = 0;
				  MaxU[i] = 0;
				  UsedU[i] = 0;
				  if(floor.length!==0){
					  AvailU[i] = parseInt(floor.AvailU);
					  MaxU[i] = parseInt(floor.MaxU);
					  UsedU[i] = parseInt(floor.UsedU);
				  }
			  })
			  var spiderChart = Highcharts.chart('spider' + action.childWidgets, {
				  	colors: ['#0daee6', '#56964a', '#f45b5b', '#b618e2', '#ffa000'],
			        chart: {polar: true,type: 'line'},
			        title: {text: '',},
			        pane: {size: '85%'},
	 				xAxis: {
			            categories: floorName,
			            tickmarkPlacement: 'on',
			            lineWidth: 0,endOnTick: false
			        },
			        yAxis: {gridLineInterpolation: 'polygon',lineWidth: 0,min: 0},
					tooltip: {
			            shared: true,
			            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
			        },
			        plotOptions: {
		                series: {
		                    events: {
		                    	legendItemClick: function(event) {
		                    		var count = 0, index = [];
	                    			var series = this.chart.series;
	                    			for (var i = 0; i < series.length; i++){
	                    				if(series[i].visible){index[count] = i;count ++; }
	                    			}
	                    			if(count==1){
	                    				if(index[0]!=this.index){
	                    					if(this.visible){this.hide();
		                    				}else{this.show();}
	                    				}
	                    			}
	                    			else{
	                    				if(this.visible){this.hide();
	                    				}else{this.show();}}
	                    			 return false;
		                    	}
		                    }
		                }
		            },
			        legend: {
			        	itemStyle: {color: '#E0E0E3'},
			            itemHoverStyle: {color: '#FFF'},
			            itemHiddenStyle: {color: '#606063'},
			        	align: 'center',
			            verticalAlign: 'top',
			            y: 0,
			            layout: 'horizontal'
			        },
			        series: [{name: 'Available u space', data: AvailU, pointPlacement: 'on'}, 
			        	{name: 'Maximum u space', data: MaxU, pointPlacement: 'on'},
			        	{name: 'Used u space', data: UsedU, pointPlacement: 'on'}]
			    });
	  defer.resolve(spiderChart);
	  return defer.promise;
  }
  
  
  function lineBarAreaHighChartStockData(action, data, maxMin){
	  if(maxMin!==undefined){
		  var wmin = Math.abs(maxMin[0].wmin);
	      var wmax = Math.abs(maxMin[0].wmax);
	      var cmin = Math.abs(maxMin[0].cmin);
	      var cmax = Math.abs(maxMin[0].cmax);
	      var max = cmax, min = 0 ;
	  }
	  else{
		  var wmin = 0, wmax = 0, cmin = 0, cmax = 0;
	  }
	 
	  if(cmax == 0 && cmin == 0 && wmax == 0 && wmin == 0){
		  var max = null, min = null ;
	  }
	  
	    _.filter(data, function(series, i){
			  _.filter(series.data, function(values, i){
				  if(Math.abs(values[1])>max){
					  max = Math.abs(values[1]);
				  }
			  });
	    });
	    
	    var timeFormat = "%b %e, %Y %H:%M:%S %A";
		if(window.localStorage.getItem(Constants.TIME_FORMAT)=="12 Hour"){
			timeFormat = "%b %e, %Y %l:%M:%S %p %A";
		}
	  $(function () {
       var chart = Highcharts.stockChart('lineAreaBar'+ action.childWidgets, {
    	   chart: {alignTicks: false},
           legend: {enabled: true, verticalAlign : "top", align : "right"},
            series: data,
            rangeSelector: {
            	 inputEnabled:false,
            	 buttonTheme: {visibility: 'hidden'},labelStyle: {visibility: 'hidden'},
            	/*buttons: [
	            	{type: 'week',count: 1,text: '1W'},{type: 'week',count: 3,text: '3W'},{type: 'month',count: 1,text: '1M'},{type: 'month',count: 3,text: '3M'},
	            	{type: 'year',count: 1,text: '1Y'},{type: 'all',text: 'All'}],selected: 6*/
            },
            plotOptions: {
                series: {
                    events: {
                    	legendItemClick: function(event) {
                    		var count = 0, index = [], activeSeries = [], vis = 0;
                			var series = this.chart.series;
                			for (var i = 0; i < series.length-1; i++){
                				if(series[i].visible){index[count] = i;count ++;activeSeries[count-1] = series[i] }
                			}
                			if(count==1){
                				if(index[0]!=this.index){
                					if(this.visible){this.hide();
                    				}else{this.show();}
                				}
                			}
                			else{
                				if(this.visible){this.hide();
                				}else{this.show();}
                			}
                			for (var i = 0; i < series.length-1; i++){if(series[i].visible){vis ++;activeSeries[vis-1] = series[i] }}
                			max = Math.abs(maxMin[0].cmax);
                			_.filter(activeSeries, function(series, i){
							  _.filter(series.data, function(values, i){
								  if(values.y>max){max = values.y;}
							  });
                			});
                			chart.yAxis[0].setExtremes(0,max)
                			 return false;
                    	}
                    }
                }
            },
            xAxis: {
                dateTimeLabelFormats:{millisecond: '%l:%M:%S %p',second: '%l:%M:%S %p',minute: '%l:%M %p',hour: '%l:%M %p',day: '%e %b',week: '%e %b',month: '%b \'%y',year: '%Y'},
                labels: {
                    formatter: function() {
                  	  	var d = new Date(this.value);
                        d =Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
                        return Highcharts.dateFormat(this.dateTimeLabelFormat, d);
                    },
                }
            },
            yAxis: {
            		min: 0, max: max,
                    plotLines: [
                    	/*{id: 'limit-wmin',color: 'yellow',dashStyle: 'ShortDash',width: 1,value: wmin,zIndex: 10,label : {text : 'Warning Min',x:45, style: {fontSize: '9px',color: 'white'}}},*/ 
                    	{id: 'limit-wmax',color: 'yellow',dashStyle: 'ShortDash',width: 1,value: wmax,zIndex: 7,label : {text : 'Warning Max : ' + wmax,x:0, style: {fontSize: '9px',color: 'white'}}},
                    	/*{id: 'limit-cmin',color: '#FF0000',dashStyle: 'ShortDash',width: 1,value: cmin,zIndex: 10,label : {text : 'Critical Min',x:0, style: {fontSize: '9px',color: 'white'}}}, */
                    	{id: 'limit-cmax',color: '#FF0000',dashStyle: 'ShortDash',width: 1,value: cmax,zIndex: 7,label : {text : 'Critical Max : ' + cmax,x:75, style: {fontSize: '9px',color: 'white'}}}
                	]
                },
            tooltip: {
                shared: true,
                formatter: function() {
                    var d = new Date(this.x);
                    d =Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
                    var s = '<b>' + Highcharts.dateFormat(timeFormat, d) + '</b>';
                    $.each(this.points, function(i, point) {
                        s += '<br/>' + point.series.name + ': ' + point.y + ' ' + point.series.options.tooltip.valueSuffix;
                    });
                    return s;
                },
            },
            scrollbar: {
                barBackgroundColor: 'gray',
                barBorderRadius: 7,
                barBorderWidth: 0,
                buttonBackgroundColor: 'gray',
                buttonBorderWidth: 0,
                buttonBorderRadius: 7,
                trackBackgroundColor: 'none',
                trackBorderWidth: 1,
                trackBorderRadius: 8,
                trackBorderColor: '#CCC'
            },
        });
       return chart;
	  });
  }
 
  function chartnotesData(action){
	  var defer = $q.defer();
	   var inputParam = {"childWidgets": action.childWidgets}; 
		  GsmServices.getchartnotes(inputParam).success(function (response) {
			  defer.resolve(response.responseObject.data[0]);
		  });
 	 return defer.promise;
  }
  
  function chartlabelData(action){
	  var defer = $q.defer();
	   var inputParam = {"childWidgets": action.childWidgets}; 
		  GsmServices.getchartlabels(inputParam).success(function (response) {
			  defer.resolve(response.data[0])
		  });
 	 return defer.promise;
  }
  
  function sensorGaugeChartData(action){
	   var defer = $q.defer();
	   var inputParam = {"childWidgets": action.childWidgets};
	    GsmServices.getSensorData(inputParam).success(function (response) {
                UtilsFactory.setSensorGaugeData(JSON.stringify(response.responseObject), action.childWidgets)
                var meterResponse = response.responseObject.data[0];
                var setting = response.responseObject.setting;
                var point=0, startValue = 0, point1 = 6, point2 = 10, point3 = 14, point4 = 20, metric = "", endValue = 20;
    	    	if(meterResponse !== undefined && meterResponse.metricvalue !== undefined && meterResponse.metricvalue !== undefined && !isNaN(parseFloat(meterResponse.metricvalue))){
    	    		if(meterResponse.CriticalMin == null){meterResponse.CriticalMin = 0}
    	    		if(meterResponse.WarnMin == null){meterResponse.WarnMin = 0;}
    	    		if(meterResponse.WarnMax == null){meterResponse.WarnMax = 0;}
    	    		if(meterResponse.CriticalMax == null){meterResponse.CriticalMax = 0;}
    	    		if(meterResponse.metricvalue == null){meterResponse.metricvalue = "";}
    	    		if(meterResponse.MaxValue == null){meterResponse.MaxValue = 0;}
		        	point = parseFloat(parseFloat(meterResponse.metricvalue).toFixed(3));
		        	metric = response.responseObject.setting.sensortype;
		        	if(metric=="Temperature"){
		        		if(response.responseObject.setting.metrixtype=="Celsius"){metric = "°C";}
		        		else{metric = "°F";}
		        	}
		        	else if(metric=="Airflow" || metric=="airflow"){metric = "CFM";}
		        	point1 = parseFloat(meterResponse.CriticalMin);
		        	point2 = parseFloat(meterResponse.WarnMin);
		        	point3 = parseFloat(meterResponse.WarnMax);
		        	point4 = parseFloat(meterResponse.CriticalMax);
			        pointMaxEarlierValue = parseFloat(parseFloat(meterResponse.MaxValue).toFixed(3));
			        maxDays = response.responseObject.setting.dayformax;
			        if(point<0){point = 0;}
		        	if(maxDays<0){maxDays = 0;}
		        	if(point1<0){point1 = 0;}
		        	if(point2<0){point1 = 0;point2 = 0;}
		        	if(point3<0){point1 = 0;point2 = 0;point3 = 0;}
		        	if(point4<0){point1 = 0;point2 = 0;point3 = 0;point4 = 0;}
			        endValue = point4;
			        if(point4 <point){endValue = point;}
			        if(endValue< pointMaxEarlierValue){endValue = pointMaxEarlierValue;}
			        if(endValue == 0 ){endValue = 20;}
		  			var endColor = "#D50000";
		  			if((point1==0 || point1==null)  && (point2==0 || point2==null) && (point3==0 || point3==null) && (point4==0 || point4==null)){
		  				endColor = "GREEN";
		  			}
		  			var secondEndColor = "#FFEA00";
		  			if((point1==0 || point1==null)  && (point2==0 || point2==null) && (point3==0 || point3==null)){
		  				secondEndColor = "GREEN";
		  			}
		  			endValue = Math.ceil((((parseFloat(endValue) + parseFloat(endValue)/10))));
		  			var gaugeChart = UtilsFactory.getGaugeUI(action.childWidgets);
		  			if(gaugeChart){
		  				gaugeChart = gaugeOldWidget(gaugeChart, action.childWidgets, point, point1, point2, point3, point4, startValue, endValue, secondEndColor, 
		  						endColor, metric, pointMaxEarlierValue, maxDays, setting.dayformax);
				        defer.resolve(gaugeChart);
		  			}
		  			else{
		  				var gaugeChart = gaugeNewWidget (action.childWidgets, point, point1, point2, point3, point4, startValue, endValue, secondEndColor, 
		  						endColor, metric, pointMaxEarlierValue, maxDays, setting.dayformax);
		  				gaugeChart.metric = metric;
		  				defer.resolve(gaugeChart);     
		  			}
    	    	}
	          else{
	        	  defer.resolve("NaN");     
	          }
	         }).error(function(e){
			  		defer.resolve("error");  
		     });
	     return defer.promise;
	  }
  
  function waltThresholdChartData(action){
	   var defer = $q.defer();
	   var inputParam = {"childWidgets": action.childWidgets};
	    GsmServices.getThresoldData(inputParam).success(function (response) {
	    	var data = response.responseObject.data[0];
	    	var setting = response.responseObject.setting;
	    	UtilsFactory.setWaltThresholdData(JSON.stringify(response.responseObject), action.childWidgets);
	    	var point=0, startValue = 0, point1 = 6, point2 = 10, point3 = 14, point4 = 20, metric = "", endValue = 20;
	    	if(data !== undefined && data.MetricValue !== undefined && data.MetricValue !== null && !isNaN(parseFloat(data.MetricValue))){
		    		metric = setting.walt_metrix;
		    		if(metric=="Airflow" || metric=="airflow"){metric = "CFM";}
		    		feed = setting.feed;
		    		phase = setting.phase;
		    		if(feed!='null' && phase !='null'){
		    			metric = setting.walt_metrix; + "\n" + "(" + feed +"-"+ phase + ")";
		    		}
	    			if(data.CriticalMin == null){data.CriticalMin = 0}
		        	if(data.WarnMin == null){data.WarnMin = 0;}
		        	if(data.WarnMax == null){data.WarnMax = 0;}
		        	if(data.CriticalMax == null){data.CriticalMax = 0;}
		        	if(data.MetricValue == null){data.MetricValue = "";}
		        	if(data.MaxValue == null){data.MaxValue = 0;}
		        	point = parseFloat(parseFloat(data.MetricValue).toFixed(3));
	     	    	point1 = parseFloat(data.CriticalMin);
	     	    	point2 = parseFloat(data.WarnMin);
	     	    	point3 = parseFloat(data.WarnMax);
	     	    	point4 = parseFloat(data.CriticalMax);
	     	    	pointMaxEarlierValue = parseFloat(parseFloat(data.MaxValue).toFixed(3));
		        	maxDays = setting.dayformax;
		        	if(point<0){point = 0;}
	        	 	if(maxDays<0){maxDays = 0;}
	        	 	if(point1<0){point1 = 0;}
	        	 	if(point2<0){point1 = 0;point2 = 0;}
	        	 	if(point3<0){point1 = 0;point2 = 0;point3 = 0;}
	        	 	if(point4<0){point1 = 0;point2 = 0;point3 = 0;point4 = 0;}
		        	endValue = point4;
		        	if(point4 <point){endValue = point;}
	     	    	if(endValue< pointMaxEarlierValue){endValue = pointMaxEarlierValue;}
	     	    	if(endValue == 0 ){endValue = 20;}
	     	    	var endColor = "#D50000";
	     	    	if((point1==0 || point1==null)  && (point2==0 || point2==null) && (point3==0 || point3==null) && (point4==0 || point4==null)){
	     	    		endColor = "GREEN";
	     	    	}
	     	    	var secondEndColor = "#FFEA00";
		  			if((point1==0 || point1==null)  && (point2==0 || point2==null) && (point3==0 || point3==null)){
		  				secondEndColor = "GREEN";
		  			}
		  			endValue = Math.ceil((((parseFloat(endValue) + parseFloat(endValue)/10))));
	  			var gaugeChart = UtilsFactory.getGaugeUI(action.childWidgets);
	  			if(gaugeChart){
	  				 gaugeChart = gaugeOldWidget(gaugeChart, action.childWidgets, point, point1, point2, point3, point4, startValue, endValue, 
	  						 secondEndColor, endColor, metric, pointMaxEarlierValue, maxDays, setting.dayformax);
	  				 defer.resolve(gaugeChart);
		          }
	          else{
	        	  var gaugeChart = gaugeNewWidget (action.childWidgets, point, point1, point2, point3, point4, startValue, endValue, secondEndColor, 
	        			  endColor, metric, pointMaxEarlierValue, maxDays, setting.dayformax);
	        	  gaugeChart.metric = metric;
	        	  defer.resolve(gaugeChart);     
	            }
	    	}
	          else{defer.resolve("NaN");     }
	     }).error(function(e){defer.resolve("error");  });
	    return defer.promise;
  }
  
  function pueData(action){
	  var defer = $q.defer();
	  var inputParam = {"childWidgets": action.childWidgets, 'jsfunctionname': action.jsfunctionname};
	  GsmServices.getPueLive(inputParam).success(function (response) {
		  		var data = response.responseObject.data[0];
		    	var setting = response.responseObject.setting;
		  		UtilsFactory.setPueData(JSON.stringify(response.responseObject), action.childWidgets);
		  		var point=0, startValue = 0, point1 = 6, point2 = 10, point3 = 14, point4 = 20, metric = "", endValue = 20;
	  			if(data !== undefined && data.value !== undefined && data.value !== null && !isNaN(parseFloat(data.value))){
			  			var gaugeChart = UtilsFactory.getGaugeUI(action.childWidgets);
			  			if(data.CriticalMin == null){data.CriticalMin = 0;}
			  			if(data.WarnMin == null){data.WarnMin = 0;}
			  			if(data.WarnMax == null){data.WarnMax = 0;}
			  			if(data.CriticalMax == null){data.CriticalMax = 0;}
			  			if(data.Metric == null){data.Metric = "";}
			  			if(data.MaxValue == null){data.MaxValue = 0;}
			  	  		point = parseFloat(parseFloat(data.value).toFixed(3));
			            metric = data.Metric;
			            point1 = parseFloat(data.CriticalMin);
			            point2 = parseFloat(data.WarnMin);
			            point3 = parseFloat(data.WarnMax);
			            point4 = parseFloat(data.CriticalMax);
			            pointMaxEarlierValue = parseFloat(parseFloat(data.MaxValue).toFixed(3));
			            maxDays = setting.dayformax;
			            if(point<0){point = 0;}
		        	 	if(maxDays<0){maxDays = 0;}
		        	 	if(point1<0){point1 = 0;}
		        	 	if(point2<0){point1 = 0;point2 = 0;}
		        	 	if(point3<0){point1 = 0;point2 = 0;point3 = 0;}
		        	 	if(point4<0){point1 = 0;point2 = 0;point3 = 0;point4 = 0;}
		  	  			endValue = point4;
			  			if(point4 <point){endValue = point;}
			  			if(endValue< pointMaxEarlierValue){endValue = pointMaxEarlierValue;}
			  			if(endValue == 0 ){endValue = 20;}
			  			if(metric=="Airflow" || metric=="airflow"){metric = "CFM";}
			  			var endColor = "#D50000";
			  			if((point1==0 || point1==null)  && (point2==0 || point2==null) && (point3==0 || point3==null) && (point4==0 || point4==null)){
			  				endColor = "GREEN";
			  			}
			  			var secondEndColor = "#FFEA00";
			  			if((point1==0 || point1==null)  && (point2==0 || point2==null) && (point3==0 || point3==null)){
			  				secondEndColor = "GREEN";
			  			}
			  			endValue = Math.ceil((((parseFloat(endValue) + parseFloat(endValue)/10))));
		  			if(point <2 && point > 1){
		  				startValue = 1;
		  				endValue = 2;
		  				if(point1 <= 1 ){point1 = 1;}
		  				if(point2 <= 1){point2 = 1;}
		  				if(point3 <= 1){point3 = 1;}
		  				if(point4 <= 1){point4 = 1;}
		  				if(point4>=2){point4 = 2;}
		  				if(point3>=2){point3 = 2;}
		  				if(point2>=2){point2 = 2;}
		  				if(point1>=2){point1 = 2;}
		  				if(pointMaxEarlierValue>=2){pointMaxEarlierValue = 2;}
		  				if(pointMaxEarlierValue<=1){pointMaxEarlierValue = 1;}
		  			} 
		        	if(gaugeChart){
			  			 gaugeChart = gaugeOldWidget(gaugeChart, action.childWidgets, point, point1, point2, point3, point4, startValue, endValue, secondEndColor,
			  					 endColor, metric, pointMaxEarlierValue, maxDays, setting.dayformax);
		        		 defer.resolve(gaugeChart);
		        	 }
		        	 else{
		        		 var gaugeChart = gaugeNewWidget(action.childWidgets, point, point1, point2, point3, point4, startValue, endValue, secondEndColor, 
		        				 endColor, metric, pointMaxEarlierValue, maxDays, setting.dayformax);
		        		 gaugeChart.metric = metric;
		        		  defer.resolve(gaugeChart);     
		            }
	  			}
	  			else{return defer.resolve("NaN");}
			  	}).error(function(e){defer.resolve("error");});
          return defer.promise;
  }
  
  function gaugeNewWidget (childWidgets, point, point1, point2, point3, point4, startValue, endValue, secondEndColor, endColor, metric, pointMaxEarlierValue, maxDays, maxEnableDisable){
	  if(maxEnableDisable=='NULL'){
		  maxEnableDisable = 0
	  }
	  else{
		  maxEnableDisable = 1
	  }
		 return AmCharts.makeChart('meter' + childWidgets, {
	          "type": "gauge",
	          "theme": "black",
	          "thousandsSeparator": "",
	          "axes": [{
	              "axisThickness": 1, "axisAlpha": 0, "tickAlpha": 0, "fontSize" : 8,
	              "bands": [{"color": "#D50000", "innerRadius": "95%", "startValue": startValue, "endValue": point1
		                }, {"color": "#FFEA00","innerRadius": "95%","startValue": point1, "endValue": point2
		                }, {"color": "GREEN", "innerRadius": "95%", "startValue": point2, "endValue": point3
		                }, {"color": secondEndColor, "innerRadius": "95%", "startValue": point3, "endValue": point4
		                }, {"color": endColor, "innerRadius": "95%","startValue": point4, "endValue": endValue
	                }],
	              "bottomText": point +"\n"+ metric,
	              "bottomTextYOffset": -20,
	              "startValue": startValue,
                  "usePrefixes": true,
	              "endValue": endValue
	          }],
	          "arrows": [{"title" : "Live Value", "value" : point, "color" : "#fff"},
	        	  {alpha:maxEnableDisable, borderAlpha : maxEnableDisable,nailAlpha : maxEnableDisable,nailBorderAlpha : maxEnableDisable,"title" : maxDays + " day's Max Value", 
	        	  "value":pointMaxEarlierValue, "color": "#6b6b6b", "innerRadius": "0%", "nailRadius": 8, "radius": "45%",}
	          ],
	          "balloon": {"adjustBorderColor": true, "color": "#000000", "cornerRadius": 5,"fillColor": "#FFFFFF"},
	          "listeners": [{
	                "event": "rendered",
	                "method": function(event) {
	                  var chart = event.chart;
	                  var text = "";
	                  for(var i = 0; i < chart.arrows.length; i++) {
	                    var arrow = chart.arrows[i];
	                    text += arrow.title + ": " + arrow.value + "<br />";
	                  }
	                  for(var i = 0; i < chart.axes[0].bands.length; i++) {
	                    chart.axes[0].bands[i].balloonText = text;
	                  }
	                }}],
	      "export": {"enabled": true}
	  });
  }
  
  function gaugeOldWidget(gaugeChart, childWidgets, point, point1, point2, point3, point4, startValue, endValue, secondEndColor, endColor, metric, pointMaxEarlierValue, maxDays, maxEnableDisable){
	  if(maxEnableDisable=='NULL'){
		  maxEnableDisable = 0
	  }
	  else{
		  maxEnableDisable = 1
	  }
	  gaugeChart.arrows[0].setValue(point);
		 gaugeChart.arrows[1].setValue(pointMaxEarlierValue);
		 gaugeChart.arrows[1].alpha = maxEnableDisable
		 gaugeChart.arrows[1].borderAlpha = maxEnableDisable
		 gaugeChart.arrows[1].nailAlpha = maxEnableDisable
		 gaugeChart.arrows[1].nailBorderAlpha = maxEnableDisable
		 gaugeChart.arrows[1].title = maxDays + " day's Max Value";
		 gaugeChart.axes[0].setBottomText(point +"\n"+ metric);
		 gaugeChart.axes[0].bands[0].setStartValue(startValue);
		 gaugeChart.axes[0].bands[0].setEndValue(point1);
		 gaugeChart.axes[0].bands[1].setStartValue(point1);
		 gaugeChart.axes[0].bands[1].setEndValue(point2);
		 gaugeChart.axes[0].bands[2].setStartValue(point2);
		 gaugeChart.axes[0].bands[2].setEndValue(point3);
		 gaugeChart.axes[0].bands[3].setStartValue(point3);
		 gaugeChart.axes[0].bands[3].color = secondEndColor;
		 gaugeChart.axes[0].bands[3].setEndValue(point4);
		 gaugeChart.axes[0].bands[4].setStartValue(point4);
		 gaugeChart.axes[0].bands[4].color = endColor;
		 gaugeChart.axes[0].bands[4].setEndValue(endValue);
		 gaugeChart.axes[0].startValue = startValue;
		 gaugeChart.axes[0].endValue = endValue;
		 gaugeChart.write('meter' + childWidgets);
		 gaugeChart.metric = metric;
		 return gaugeChart;
  }
  
  function mapChartData(action){
      GsmServices.getDataCenter().success(function (response) {
    	  response = response.responseObject;
          var locations = [];
          var res = response.data;
          for (var i = 0; i < response.data.length; i++) {
        	  
        	  36.032466
                   var Lattitude = (response.data[i].Lattitude == 0 || response.data[i].Lattitude == null) ?  36.032466 : response.data[i].Lattitude;
                  var Longitude = (response.data[i].Longitude == 0 || response.data[i].Lattitude == null) ?  -78.498190 : response.data[i].Longitude;
                  if (i==0) {
                	  Lattitude = (response.data[i].Lattitude == 0 || response.data[i].Lattitude == null) ?  36.032466 : response.data[i].Lattitude;
                	  Longitude = (response.data[i].Longitude == 0 || response.data[i].Lattitude == null) ?  -78.498190 : response.data[i].Longitude;
                  }
                  if (i==1) {
                	  Lattitude = (response.data[i].Lattitude == 0 || response.data[i].Lattitude == null) ?  36.032466 : response.data[i].Lattitude;
                	  Longitude = (response.data[i].Longitude == 0 || response.data[i].Lattitude == null) ?  -78.498190 : response.data[i].Longitude;
                  }
                  if (i==2) {
                	  Lattitude = (response.data[i].Lattitude == 0 || response.data[i].Lattitude == null) ?  36.032466 : response.data[i].Lattitude;
                	  Longitude = (response.data[i].Longitude == 0 || response.data[i].Lattitude == null) ?  -78.498190 : response.data[i].Longitude;
                  }
                  if (i==3) {
                	  Lattitude = (response.data[i].Lattitude == 0 || response.data[i].Lattitude == null) ?  36.032466 : response.data[i].Lattitude;
                	  Longitude = (response.data[i].Longitude == 0 || response.data[i].Lattitude == null) ?  -78.498190 : response.data[i].Longitude;
                  }
                  if (i==4) {
                	  Lattitude = (response.data[i].Lattitude == 0 || response.data[i].Lattitude == null) ?  36.032466 : response.data[i].Lattitude;
                	  Longitude = (response.data[i].Longitude == 0 || response.data[i].Lattitude == null) ?  -78.498190 : response.data[i].Longitude;
                  }
                  
                  
              var dataCenterName = '<a ng-click="callMapGrid()" class="mapFloorListClick colorBlack" data-id="'+response.data[i].DCKey+'"><div>Data center : ' 
              + response.data[i].DCName + '</div>' + '<div>Floor count : ' + response.data[i].NoofFloor+ '</div>'  + '<div>Cabinet count : ' + response.data[i].cabinet_cnt + '</div>'
              + '<div class="criticalAlert">Crtical Alert : ' + response.data[i].CriticalAlerts + '</div>' + '<div class="warningAlert">Warning Alert : ' + response.data[i].WarningAlerts + '</div>'
              + '<div class="failOverAlert">Fail Over Alert : ' + response.data[i].FailOverAlerts + '</div></a>';

              var DAddress1 = response.data[i].DAddress1;
              var address = response.data[i].DAddress1 + ', ' + response.data[i].DCity + ', ' + response.data[i].DState + ', ' + response.data[i].DCountry;
              var array = [dataCenterName, Lattitude, Longitude, parseInt(i) + 1, 'Steven F. Morris', DAddress1, address, 'coming sun'];
              locations.push(array);
          }

          var map = new google.maps.Map(document.getElementById('map'+action.childWidgets), {
        	  mapTypeId: google.maps.MapTypeId.ROADMAP, 
          });
          var infowindow = new google.maps.InfoWindow();

          var marker = [], i;

                  
         // locations.push(["a",6.9271,79.8612]);
          /* locations.push(["b",39.9042,116.4074]);*/
            
          for (i = 0; i < locations.length; i++) {
              marker[i] = new google.maps.Marker({
                  position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                  map: map
              });
              google.maps.event.addListener(marker[i], 'click', (function (marker, i) {
                  return function () {
                	  infowindow.setContent(locations[i][0], locations[i][6]);
                	  //infowindow.setContent(content);
                      infowindow.open(map, marker[i]);
                  }
              })(marker, i));
          }
          
          var bounds = new google.maps.LatLngBounds();
          for (var i = 0; i < marker.length; i++) {bounds.extend(marker[i].getPosition());}
          
          
          resize();

          google.maps.event.addDomListener(window, 'resize',
            resize);
          
          
        
          
          function resize() {
        	  map.fitBounds(bounds);
        	}
          
          
          
          
      }).error(function(e){
      });
  }
	
    function informationChartData(action) {
            var inputParam = {"childWidgets": action.childWidgets};
            GsmServices.getInfoData(inputParam).success(function (response) {
                UtilsFactory.setInfoChartData(JSON.stringify(response.data.widgetSetting), action.childWidgets);
                $rootScope.info = response.data.result;
            });
            return true;
        }
    })
