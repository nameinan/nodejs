angular.module('authService',[])

.factory('Auth',function($http,$q,AuthToken){
	const authFactory= {};

	authFactory.login= function(name,password){
		return $http.post('/api/login', {
			name:name,
			password:password
		})
		.sucess(function(data){
			AuthToken.setToken(data.token);
			return data;
		})
	}


	authFactory.logout = function(){
		AuthToken.setToken();
	}

	authFactory.isLoggedIn= function(){
		 if (AuthToken.getToken()) {
		 	return true;
		 }else{
		 	return false;
		 }
	}

	authFactory.getUser = function(){
		if (AuthToken.getToken) {
			return $http.get('/api/me')
		}
		else{
			$q.reject({message:'Use has no token'});
		}
	}
	
	return authFactory;
})



.factory('AuthToken',function($window){
	const authFactory = {};
	authFactory.getToken= function(){
		return $window.localStorage.getItem('token');
	}

	authFactory.setToken = function(token){
        if (token) {
        	$window.localStorage.setItem('token',token);
        }else{
        	$window.localStorage.removeItem('token');
        }
	}

   return authFactory;
})




.factory('AuthInterceptor', function($q,$location,AuthToken){
	const interceptorFactory = {};
	interceptorFactory.request=function(config){
		var token = AuthToken.getToken();
		if (token) {
			config.header('x-access-token')=token;
		}
		return config;
	}
	interceptorFactory.responseError= function(response){
		if (response.status==403) {
			$location.path('/login');
			return $q.reject(response);
		}
	}
	return interceptorFactory;
});