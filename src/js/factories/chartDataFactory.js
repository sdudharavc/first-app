angular.module('chartdatafactory',[])
.factory('ChartDataFactory', function($rootScope, GsmServices, _, $q, UtilsFactory, $timeout, ChartFactory) {
	 return {
		    getDataForChart: {
		        data: checkChartFordata
		    }
	 }
	 
	 function checkChartFordata(chart, widget, response) {
    	var defer = $q.defer();
    		var setting = response.responseObject.setting;
    		response = response.responseObject.data;
    		if(response && response.length!==0 && response!==null && response!==undefined){
      		var multiChartData = [];
     			for(r in response){
     				multiChartData[r] = {};
     				var returnData = [];
     				var metric = "";
     				_.each(response[r], function (data, i) {
     					if(chart== "pue_area_chart" || chart== "area_getwithoutpuehistory" ||chart==  "pue_bar_chart"  || chart == "bar_getwithoutpuehistory"
     						|| chart== "line_getwithoutpuehistory" || chart== "pue_line_chart"){
     						returnData[i]  = [moment(data.histroydate).valueOf(), parseFloat(data.value)];
     						metric = data.Metric;
     					}else{
     						returnData[i]  = [moment(data.DtStamp).valueOf(), parseFloat(data.MetricValue)];
     						if(chart == "area_thresold" || chart == "line_thresold" || chart== "bar_thresold"){
     							if((setting.feed==undefined || setting.feed=='null') && (setting.phase==undefined ||setting.phase=='null')){
     								metric = setting.walt_metrix 
     							}
     							else{
     								metric = setting.walt_metrix +"("+ setting.choices[r].feed + "-" +setting.choices[r].phase +")";
     							}
     						}
     						else{
     							metric = setting.sensortype;
     							 if(metric=="Temperature"){
     				            	if(setting.metrixtype=="Celsius"){metric = "°C";}
     				            	else{metric = "°F";}
     							 }
     							 else if(metric=="Airflow" || metric=="airflow"){metric = "CFM";}
     							 else if(metric=="Humidity"){metric = "%";}
     							 else{metric = data.SensorType}
     						}
     					}
     				});
     				if(chart == "area_thresold" || chart == "line_thresold" || chart== "bar_thresold"){
							multiChartData[r].name = setting.choices[r].powerMetriceItem.NamePath;
						}
						else if(chart== "pue_area_chart" || chart== "area_getwithoutpuehistory" || chart== "pue_bar_chart"  || chart == "bar_getwithoutpuehistory"
 						|| chart== "line_getwithoutpuehistory" || chart== "pue_line_chart"){
							multiChartData[r].name = setting.formula[r].formula.FormulaTitle;
						}
						else{
							multiChartData[r].name = setting.choices[r].sensor.NamePath;
						}
						if (chart == "pue_area_chart" || chart == "area_thresold" || chart== "area_getwithoutpuehistory" || chart== "area_sensor") {
							multiChartData[r].data = returnData;
//							multiChartData[r].dataLabels = {enabled: true,formatter:function() {return this.y;}};
 						multiChartData[r].type = 'area';
 						multiChartData[r].threshold = null;
 						multiChartData[r].tooltip = {valueDecimals: 2, valueSuffix : ' ' +metric}
						}
						 if (chart == "line_sensor" || chart == "line_thresold" || chart== "line_getwithoutpuehistory" || chart== "pue_line_chart") {
							multiChartData[r].data = returnData;
							/*multiChartData[r].dataLabels = {enabled: true,formatter:function() {return this.y;}};*/
 						multiChartData[r].type = 'line';
 						multiChartData[r].marker = {enabled: true, radius: 3};
 						multiChartData[r].shadow =  true;
 						multiChartData[r].tooltip = {valueDecimals: 2, valueSuffix : ' ' +metric}
						 }
						if (chart == "pue_bar_chart"  || chart == "bar_getwithoutpuehistory" || chart== "bar_sensor" || chart== "bar_thresold") {
							multiChartData[r].data = returnData;
//							multiChartData[r].dataLabels = {enabled: true,formatter:function() {return this.y;}};
 						multiChartData[r].type = 'column';
 						multiChartData[r].dataGrouping = {enabled:false};
 						multiChartData[r].tooltip = {valueDecimals: 2 ,  valueSuffix : ' ' +metric}
						}
     			}
     			multiChartData.sort(function (a, b) {
     				if(b.data && a.data)
     				return b.data.length - a.data.length;
     			});
     			defer.resolve(multiChartData);
    		}
    		else{
				multiChartData = null;
				defer.resolve(multiChartData);
    		}
         return defer.promise;
    }
});
