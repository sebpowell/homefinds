var router = require('koa-router')({prefix: '/category'}),
	Common = require('../common.js');

router.use(function *(next)
{
	// load user
	return yield Common.loadUserIfLoggedIn(next, this);
	
})
.use(function *(next)
{
	// load  categories/partners
	return yield Common.loadCategoriesAndPartners(next, this);
})
.get('/', function *(next)
{
	
	console.log(this.state.categories);

	return this.render('index');

})
/* ROUTES BELOW HERE ARE ADMIN ONLY, SO USER HAS TO BE AUTHENTICATED */
.use(function *(next)
{
	console.log("TODO: check user is admin");

	return yield next;
})
.get('/new', function *(next)
{

	return this.render('category/new');
})
.post('/new', function *(next)
{

	this.checkBody('name').notEmpty("This field is required.");

	if(this.errors)
	{
		this.status = 400;
		this.body = {error: true, errors: this.errors, msg: "Please make sure the form is completed correctly"};
		return;
	}

	var newCategory = new this.app.context.models.Category({
		name: this.request.body.name
	});

	yield newCategory.save();

	this.body = {success: true};
	
})

function registerRoutes(app)
{
	app.use(router.routes());
	app.use(router.allowedMethods());
}

module.exports = registerRoutes;