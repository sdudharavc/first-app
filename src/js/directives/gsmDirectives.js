angular.module('gsm.directives', ['dynamic', 'errsrc'])
.directive('noSpecialChar', function() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, modelCtrl) {
    	  var html = element.find('input').prevObject[0];
    	  html.onkeydown = function(e) {
			    if(!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) 
			      || e.keyCode == 8 ||  (e.keyCode > 36 && e.keyCode < 41))) {
			        return false;
			    }
			}
      }
    }
})

.directive('ngMouseWheelDown', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
            	        var event = window.event || event; // old IE support
            	        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            	        if(delta < 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelDown);
                            });
                          event.returnValue = false;
                          if(event.preventDefault) event.preventDefault();                        
                       }
            });
        };
})

.directive('ngMouseWheelUp', function() {
        return function(scope, element, attrs) {
            element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
            	        var event = window.event || event; // old IE support
            	        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
            	        if(delta > 0) {
                            scope.$apply(function(){
                                scope.$eval(attrs.ngMouseWheelUp);
                            });
                          event.returnValue = false;
                          if(event.preventDefault) event.preventDefault();                        
                       }
            });
        };
})

 .directive('toggleFullscreen', function(Browser) {
        return {
                link: link,
                restrict: 'A'
            };

        function link(scope, element) {
          // Not supported under IE
          if( Browser.msie ) {
            element.addClass('hide');
          }
          else {
            element.on('click', function (e) {
                e.preventDefault();

                if (screenfull.enabled) {
                  
                  screenfull.toggle();
                  
                  // Switch icon indicator
                  if(screenfull.isFullscreen)
                    $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
                  else
                    $(this).children('em').removeClass('fa-compress').addClass('fa-expand');
                } else {
                  $.error('Fullscreen not enabled');
                }

            });
          }
        }
    })
    
.service('Browser', function($window){
      return $window.jQBrowser;
    });
