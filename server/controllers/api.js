var config = require('../../config').load(),
	controller = {};

controller.list = function(req, res) {
	var api = {
		LOGIN: {
			PATH: config.server.host + ':' + config.server.port + '/api/auth',
			METHOD: 'POST'
		},
		LOGOUT: {
			PATH: config.server.host + ':' + config.server.port + '/api/logout',
			METHOD: 'GET'
		},
		REFRESHTOKEN: {
			PATH: config.server.host + ':' + config.server.port + '/api/refreshToken',
			METHOD: 'GET'
		}
	};
	return res.status(config.httpStatus.ok).json(api);
}

module.exports = controller;
