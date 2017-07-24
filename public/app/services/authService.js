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
			retur data;
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
			$q.reject({message:'Use has no token'})
		}
	}


});