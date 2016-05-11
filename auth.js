module.exports = function(app)
{
	var passport = require('koa-passport'),
	User = app.context.models.User;

	passport.serializeUser(function(user, done)
	{
		done(null, user.id)
	})

	passport.deserializeUser(function(id, done)
	{
		try
		{
			User({id: id})
			.fetch({require: true})
			.then(function(user)
			{
				done(null, user);
			})
			.catch(function(err)
			{
				console.log(err);
				done(null, false);
			})
			
		}
		catch(err)
		{
			console.log(err);
			done(null, false);
		}
		
	})

	var LocalStrategy = require('passport-local').Strategy;

	passport.use(new LocalStrategy(function(username, password, done)
	{
		
		// retrieve user	
		User({email: username.toLowerCase()})
		.fetch({require: true})
		.then(function(user)
		{
			console.log(user);

			if(! user)
			{
				return done(null, false);
			}
			

			// check password
			if(user.checkUserPassword(password))
			{
				return done(null, user);
			}
			else
			{
				return done(null, false);
			}
		})
		.catch(function(err)
		{
			console.log(err);
			return done(null, false);
		});


	}));
}
