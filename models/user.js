module.exports = function(app)
{
	var bookshelf = app.context.bookshelf,
	scrypt = require('scrypt'),
	_ = require('underscore'),
	Promise = require('bluebird');

	var passwordParam = scrypt.paramsSync(0.1);

	// skip some dodgy letters/numbers
	var alphaNums = "abcdefghjklmnpqrstuvwxy23456789".toUpperCase().split("");

	var User = bookshelf.Model.extend({
		tableName: "users",
		
		hasTimestamps: ['created_at', 'updated_at'],

		initialize: function(a, b)
		{
    		this.once('creating', function(model, attr, options)
    		{
    			// when first creating, make sure share code is added
    			if(! model.get('share_code'))
    				model.set('share_code', User.generatePassword(5));

    			return attr;
    		})
    	},

		checkPassword: function(password)
		{
			var hashBuffer = new Buffer(this.get('password'), 'base64');

			return scrypt.verifyKdfSync(hashBuffer, password);
		}
	},
	{
		GENDER: {
			MALE: 1,
			FEMALE: 2,
			RATHER_NOT_SAY: 4,
			UNKNOWN: 0
		},

		hashPassword: function(password)
		{
			return scrypt.kdfSync(password, passwordParam).toString("base64");
		},

		generatePassword: function(length)
		{
			var password = [];
		
			if(! length)
				length = 8;

			for(var i = 0; i < length; i++)
			{
				password.push(alphaNums[Math.floor(Math.random() * alphaNums.length)]);
			}
			
			return password.join("");

		}
	});

	return bookshelf.model('User', User);
}