angular.module('utilsfactory', [])
        .factory('UtilsFactory', function () {
            var alertsData = [];
            var waltThresholdData = [];
            var spiderchartData = []
            var infoChartData = [];
            var sensorGaugeData = [];
            var pueData = [];
            var floorImage = [];
            var gaugeUI = [];
            var rackElevationChartData = [];
            var widgetPositionData = [];
            var dateRange = [];
            var historyGraphData = [];
            var refreshgaugeData = [];
            var previewDataForGrid = [];

            return {
                setAlertsData: function (data, widgetId) {
                    alertsData[widgetId] = data;
                },
                getAlertsData: function (widgetId) {
                    return alertsData[widgetId];
                },
                setWaltThresholdData: function (data, widgetId) {
                    waltThresholdData[widgetId] = data;
                },
                getWaltThresholdData: function (widgetId) {
                    return waltThresholdData[widgetId];
                },
                setSensorGaugeData: function (data, widgetId) {
                    sensorGaugeData[widgetId] = data;
                },
                getSensorGaugeData: function (widgetId) {
                    return sensorGaugeData[widgetId];
                },
                setInfoChartData: function (data, widgetId) {
                    infoChartData[widgetId] = data;
                },
                getInfoChartData: function (widgetId) {
                    return infoChartData[widgetId];
                },
                setSensorGaugeData:function (data, widgetId) {
                    sensorGaugeData[widgetId] = data;
                },
                        getSensorGaugeData: function (widgetId) {
                            return sensorGaugeData[widgetId];
                        },
                        setPueData: function (data, widgetId) {
                            pueData[widgetId] = data;
                        },
                getPueData: function (widgetId) {
                    return pueData[widgetId];
                },
                setFloorImage: function (data, widgetId) {
                    floorImage[widgetId] = data;
                },
                getFloorImage: function (widgetId) {
                    return floorImage[widgetId];
                },
                setGaugeUI: function (data, widgetId) {
                    gaugeUI[widgetId] = data;
                },
                getGaugeUI: function (widgetId) {
                    return gaugeUI[widgetId];
                },
                setRackElevationChartData: function (data) {
                    rackElevationChartData = data;
                },
                getRackElevationChartData: function () {
                    return rackElevationChartData;
                },
                setSpiderchartData: function (data, widgetId) {
                    spiderchartData[widgetId] = data;
                },
                getSpiderchartData: function (widgetId) {
                    return spiderchartData[widgetId];
                },
                setWidgetPositionData: function (data) {
                    widgetPositionData = data;
                },
                getWidgetPositionData: function () {
                    return widgetPositionData;
                },
                setDateRange: function (data, widgetId) {
                    dateRange[widgetId] = data;
                },
                getDateRange: function (widgetId) {
                    return dateRange[widgetId];
                },
                setHistoryGraphData: function (data, widgetId) {
                    historyGraphData[widgetId] = data;
                },
                getHistoryGraphData: function (widgetId) {
                    return historyGraphData[widgetId];
                },
                setRefreshgaugeData: function (data, widgetId) {
                    refreshgaugeData[widgetId] = data;
                },
                getRefreshgaugeData: function (widgetId) {
                    return refreshgaugeData[widgetId];
                },
                setPreviewDataForGrid: function (data) {
                    previewDataForGrid = data;
                },
                getPreviewDataForGrid: function () {
                    return previewDataForGrid;
                }


            }
        });