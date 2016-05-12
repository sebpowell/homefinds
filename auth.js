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
			return new User({id: id})
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
		return new User({email: username.toLowerCase()})
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

	var FacebookStrategy = require('passport-facebook').Strategy;

	passport.use(new FacebookStrategy({
		clientID: app.context.config.get('facebook.clientid'),
		clientSecret: app.context.config.get('facebook.clientsecret'),
		callbackURL: "http://8aca8f0d.ngrok.io/user/login/facebook/callback",
		profileURL: 'https://graph.facebook.com/v2.6/me?fields=id,name,email,age_range,birthday,first_name,gender,last_name',
    	enableProof: false
	},
		function(accessToken, refreshToken, profile, cb)
		{
			// make sure there is an id and an email
			if((! profile.id) || (! profile.emails)  || (profile.emails.length == 0))
			{
				return cb("Your Facebook profile doesn't have an email address, so you can't login. Please try the email method!", user);
			}
			
			// create user or log in
			return new User({fb_id: profile.id})
			.fetch({require: true})
			.then(function(user)
			{
				
				// user already exists
				return cb(null, user);
			})
			.catch(User.NotFoundError, function(err)
			{
				// does user exist with this email already?
				return new User({email: profile.emails[0].value.toLowerCase()})
				.fetch()
				.then(function(emailUser)
				{

					var fields = {
						fb_id: profile.id,
						fb_access_token: accessToken,
						first_name: profile.name.givenName,
						last_name: profile.name.familyName,
						gender: User.GENDER.UNKNOWN,
						email: profile.emails[0].value.toLowerCase()
					};

					if(profile.gender == 'male')
						fields.gender = User.GENDER.MALE;
					else if(profile.gender == 'female')
						fields.gender = User.GENDER.FEMALE;

					if(emailUser)
					{
						// update user with FB ID
						return emailUser.save(fields);
					}
					else
					{
						// create user!
						return new User().save(fields);
					}

				})
				.then(function(user)
				{
					return cb(null, user);
				})
				
			});

		}
	));
}
