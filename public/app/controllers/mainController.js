angular.module('MainCtrl',[])

.controller('MainController',function($rootScope,$location,Auth){

   const vm = this;
   vm.loggedIn= Auth.isLoggedIn();

   $rootScope.$on('$routeChangeStart',function(){
   		vm.loggedIn= Auth.isLoggedIn();
   		Auth.getUser()
   		    .then(function(data){
   		    	vm.user= data;
   		    });

   });


   vm.doLogin = function(){
   	 vm.processing = true;
   	 vm.error ="";
   	 Auth.login(vm.loginData.name, vm.loginData.password)
   	     .success(function(data){
   	     	vm.processing=false;

   	     	Auth.getUser()
   	     	    .then(function(data){
   	     	    	vm.user=data;
   	     	    });

   	     	if (data.success) {
   	     		$location.path('/');
   	     	}else{
   	     		vm.error=data.message;
   	     	}  
   	    });
   }


   vm.doLogout = function(){
   	  Auth.logout();
   	  $location.path('/logout');

   }

});