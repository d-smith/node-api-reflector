(function() {


var getToken = require('../services/accessToken').getToken;

module.exports = function(lockSvc) {
	return {
		lock: function(request, response) {
			var authHeader = request.header('authorization');

			var token = getToken(authHeader);
			if(token == undefined) {
				response.status(401);
				response.send({'error': 'Authorization bearer token must accompany request'});
			} else {
				try {
					var workItemNo = request.param("workItemNo");
					console.log('Locking ' + workItemNo + ' under session ' + token);
					lockSvc.lock(token, workItemNo);
					response.send("");
				} catch(err) {
					if(err == lockSvc.noSuchItem) {
						response.status(404);
						response.send({'error':lockSvc.noSuchItem});
					} else if(err = lockSvc.otherUserHadLock) {
						response.status(409);
						response.send({'error':'Locked by some other dude since this morning'});
					} else {
						response.status(500);
						response.send({'error':'Unexpected server error of some sort occurred'});
					}
				}
			}
		},

		unlock: function(request, response) {
			console.log(request.headers);
			var authHeader = request.header('authorization');

			var token = getToken(authHeader);
			if(token == undefined) {
				response.status(401);
				response.send({'error': 'Authorization bearer token must accompany request'});
			} else {
				try {
					var workItemNo = request.param("workItemNo");
					lockSvc.unlock(token, workItemNo);
					response.send("");
				} catch(err) {
					if(err = lockSvc.otherUserHadLock) {
						response.status(409);
						response.send({'error':'Locked by some other dude since this morning'});
					} else {
						response.status(500);
						response.send({'error':'Unexpected server error of some sort occurred'});
					}
				}
			}
		}
	};
}

})();
