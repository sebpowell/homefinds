var router = require('koa-router')({prefix: '/user'}),
	Common = require('../common.js');


router.use(function *(next)
{
	// load user
	return yield Common.loadUserIfLoggedIn(next, this);
	
})
.get('/login', function *(next)
{
	return this.render('user/login');
})
.post('/login', function *(next)
{
	var ctx = this;
	
	yield this.app.context.passport.authenticate('local', function*(err, user, info)
	{	

		if (err) throw err;
		
		if (user === false)
		{
			ctx.state.error = "The email or password wasn't recognised!";
			return ctx.render('user/login');
			
		}
		else
		{
			yield ctx.login(user);
			return ctx.redirect('/users/' + user.get('id') + '/');
		}

	}).call(this, next);

})
.get('/login/facebook', facebookLoginHandler)
.get('/login/facebook/callback', facebookLoginHandler)
.post('/signup', function *(next)
{
	// create user by email address
	this.checkBody('email').notEmpty("This field is required.").isEmail("Please enter a valid email address.").toLowercase().trim();
	this.checkBody('code').optional().isAlphanumeric("Your invite code doesn't look valid").isLength();

	if(this.errors)
	{
		this.status = 400;
		this.body = {error: true, errors: this.errors, msg: "Please make sure the form is completed correctly"};
		return;
	}

	var User = this.app.context.models.User;

	// create user
	var u = yield new User({email: this.request.body.email}).fetch();

	if(u)
	{
		// user with this email already exists!
		this.status = 400;
		this.body = {
			error: true, 
			errors: [{email: "A user with this email address has already signed up. Please login."}], 
			msg: "A user with this email address has already signed up. Please login."
		};

		return;
	}

	// generate password
	const password = User.generatePassword();

	var newUser = yield new User({
		email: this.request.body.email,
		signup_code: this.request.body.code || null,
		password: User.hashPassword(password)
	}).save();

	// TODO: send welcome email
	console.log(password);

	this.body = {success: true};

})
/* ROUTES BELOW HERE ARE FOR LOGGED IN PEEPS ONLY, SO USER HAS TO BE AUTHENTICATED */
.get('/', function *(next)
{
	if(! this.state.user)
		return this.redirect('/user/login');

	// how many user have been referred?
	

	this.body = "Hello " + (this.state.user.first_name || "unnamed user");

})


function* facebookLoginHandler(next)
{
	var ctx = this;

	yield this.app.context.passport.authenticate('facebook', { scope: 'email'}, function*(err, user, info)
	{	

		if (err) throw err;
		
		if (user === false)
		{
			ctx.state.error = "Sorry, but we weren't able to log you in using Facebook";
			return ctx.render('user/login');
			
		}
		else
		{
			yield ctx.login(user);
			return ctx.redirect('/');
		}

	}).call(this, next);

}

function registerRoutes(app)
{
	app.use(router.routes());
	app.use(router.allowedMethods());
}

module.exports = registerRoutes;