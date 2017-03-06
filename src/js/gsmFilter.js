angular.module('gsm.filters', [])
		
.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++) {
            input.push(i);
        }
        return input;
    };
})

.filter('contains', function() {
    return function (array, needle) {
        return array.indexOf(needle) >= 0;
    };
})

.filter('reverse', function() {
	return function(items) {
		return items.slice().reverse();
	};
})

.filter('reverseAnything', function() {
	return function(items) {
	    if(typeof items === 'undefined') { return; }
	    return angular.isArray(items) ?
	        items.slice().reverse() : // If it is an array, split and reverse it
	        (items + '').split('').reverse().join(''); // else make it a string (if it isn't already), and reverse it
	};
})

.filter('relativeTime', function() {
    return function(items){
    	if(items !=null && items!= undefined)
    	return moment(items).fromNow(); // 5 years ago
    }
})

.filter('changeDateToUTC', function(Constants) {
    return function(items){
    	if(items !=null && items!= undefined)
    		if(window.localStorage.getItem(Constants.TIME_FORMAT)=="12 Hour"){
    			return moment(items).format("MMM DD, YYYY hh:mm a"); 
    		}else{
    			return moment(items).format("MMM DD, YYYY HH:mm"); 
    		}
    	
    }
})

.filter('formatToOneDigit', function() {
    return function(item){
    	if(item !=null && item!= undefined){
    		var first = item.split(" ");
        	var sendData = parseInt(first[0]).toFixed(1);
        	return sendData +" "+ first[1]; 
    	}
    }
})

.filter('DateDividerAndFormatter', function() {
    return function(item){
    	if(item !=null && item!= undefined){
    		var first = item.split("-");
    		var time = [];
    		time[0] = moment(moment(first[0]).valueOf()).format("MM/DD/YYYY HH:mm:ss");
    		time[1] = moment(moment(first[1]).valueOf()).format("MM/DD/YYYY HH:mm:ss");
        	return time; 
    	}
    }
})


.filter('DateAdderAndFormatter', function(Constants) {
    return function(item){
    	if(item !=null && item!= undefined){
    		if(window.localStorage.getItem(Constants.TIME_FORMAT)=="12 Hour"){
    			return moment(moment(item).valueOf()).format("MMM DD, YYYY hh:mm a");
    		}else{
    			return moment(moment(item).valueOf()).format("MMM DD, YYYY HH:mm");
    		}
    	}
    }
})

.filter('DateForSetBox', function(Constants) {
    return function(item, item2){
    	if(item!==undefined || item2!==undefined){
    		var time = [];
    		if(window.localStorage.getItem(Constants.TIME_FORMAT)=="12 Hour"){
    			time[0] = moment(moment(item).valueOf()).format("MMM DD, YYYY hh:mm a");
        		time[1] = moment(moment(item2).valueOf()).format("MMM DD, YYYY hh:mm a");
    		}else{
    			time[0] = moment(moment(item).valueOf()).format("MMM DD, YYYY HH:mm");
        		time[1] = moment(moment(item2).valueOf()).format("MMM DD, YYYY HH:mm");
    		}
    		var first = time[0].concat(" - ").concat(time[1]);
        	return first; 
    	}
    }
})


.filter('DateDividerAndFormatterForDash', function() {
	return function(item){
    	if(item!==undefined){
    		var first = item.split("-");
    		var time = [];
    		time[0] = moment(moment(first[0]).valueOf()).format("YYYY-MM-DD HH:mm:ss.0");
    		time[1] = moment(moment(first[1]).valueOf()).format("YYYY-MM-DD HH:mm:ss.0");
        	return time; 
    	}
    }
})


.filter('TimeToMilliSeconds', function() {
	return function(type, value){
		if(type === "Second"){
			value = 1000 * value;
  		 }
  		 else if(type === "Minute"){
  			value = 1000 * 60 * value;
  		 }
  		 else if(type === "Hour"){
  			value = 1000 * 60 * 60 * value;
  		 }
    	return value; 
    }
})

.filter('ReverseTimeToMilliSeconds', function() {
	return function(type, value){
		if(type === "Second"){
			value =  value/1000;
  		 }
  		 else if(type === "Minute"){
  			value =  value/(1000 * 60) ;
  		 }
  		 else if(type === "Hour"){
  			value =  value/ (1000 * 60 * 60);
  		 }
    	return value; 
    }
})

.filter('JSONStringify', function() {
	return function(data){
    	return JSON.stringify(data); 
    }
})