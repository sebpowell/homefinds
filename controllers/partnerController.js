var router = require('koa-router')({prefix: '/partner'}),
	Promise = require('bluebird'),
	Common = require('../common.js'),
	_ = require('underscore');

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
	
	console.log(this.state.partners);

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
	return this.render('partner/new');
})
.post('/new', function *(next)
{

	this.checkBody('name').notEmpty("This field is required.");
	this.checkBody('website').notEmpty("This field is required.");
	this.checkBody('code').notEmpty("This field is required.");
	this.checkBody('title').notEmpty("This field is required.");
	this.checkBody('description').notEmpty("This field is required.");
	this.checkBody('terms').notEmpty("This field is required.");
	    
 	if(this.errors)
	{
		this.status = 400;
		this.body = {error: true, errors: this.errors, msg: "Please make sure the form is completed correctly"};
		return;
	}

   	var newPartner = new this.app.context.models.Partner(
   	{
		name: this.request.body.name,
		website: this.request.body.website,
		code: this.request.body.code,
		title: this.request.body.title,
		description: this.request.body.description,
		terms: this.request.body.terms
	});

   	yield newPartner.save();

   	var reg = /category-([0-9]+)/i,
   	Category  = this.app.context.models.Category,
   	bookshelf = this.app.context.bookshelf;

   	var categories = _.map(this.request.body, function(val, key)
   	{
   		if(! reg.test(key))
			return null;

		return reg.exec(key)[1];
   	});

   	categories = _.filter(categories, function(c)
   	{
   		return c !== null;
   	});

   	// add categories
   	yield Promise.map(categories, function(catId, key)
   	{
   		// load category
   		return new Category({id: catId})
   		.fetch({require: true})
   		.then(function(cat)
   		{
   			// add to db
   			return bookshelf.knex('categories_partners')
   			.insert({
   				category_id: cat.get('id'),
   				partner_id: newPartner.get('id')
   			})
   			.return(true);
   		})

	});

   	this.body = {success: true};

   	return;
   	
});

function registerRoutes(app)
{
	app.use(router.routes());
	app.use(router.allowedMethods());
}

module.exports = registerRoutes;