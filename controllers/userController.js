var router = require('koa-router')({prefix: '/user'});

router.get('/', function *(next)
{
	console.log(this.app.context.User);

	this.body = "Hello user";

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

function registerRoutes(app)
{
	app.use(router.routes());
	app.use(router.allowedMethods());
}

module.exports = registerRoutes;