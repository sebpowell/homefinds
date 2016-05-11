module.exports = function(app)
{
	var bookshelf = app.context.bookshelf,
	scrypt = require('scrypt'),
	_ = require('underscore'),
	Promise = require('bluebird');

	var passwordParam = scrypt.paramsSync(0.1);

	var User = bookshelf.Model.extend({
		tableName: "users",
		
		hasTimestamps: ['created_at', 'updated_at'],

		checkPassword: function(password)
		{
			var hashBuffer = new Buffer(this.get('password'), 'base64');

			return scrypt.verifyKdfSync(hashBuffer, password);
		}
	},
	{
		genPassword: function(password)
		{
			return scrypt.kdfSync(password, passwordParam).toString("base64");
		}
	});

	return bookshelf.model('User', User);
}