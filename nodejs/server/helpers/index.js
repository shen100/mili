var helpers = {
	json: function(data) {
        data = data || {};
        return JSON.stringify(data);
    }
};

module.exports = helpers;