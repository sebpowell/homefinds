var router = require('koa-router')(),
	Common = require('../common.js');

router.use(function *(next)
{
	return yield Common.loadUserIfLoggedIn(next, this);
	
})
.use(function *(next)
{
	var category = this.app.context.models.Category;

	var partner = this.app.context.models.Partner;

	this.state.categories = yield new category().fetchAll();

	this.state.categories = this.state.categories.toJSON();

	this.state.partners = yield new partner().fetchAll();

	this.state.partners = this.state.partners.toJSON();

	yield next;

	return;
	
})
.get('/', function *(next) {

	
	// console.log(cats);
	console.log(this.state.categories);

	return this.render('index');

})

.get('/admin/categories', function *(next) {

	return this.render('admin/categories');
})

.post('/admin/categories', function *(next) {

   	var newCategory = new this.app.context.models.Category({
   		name: this.request.body.category
   	});

   	this.checkBody('name').notEmpty("This field is required.");

   	if (this.errors) {
	    this.status = 400;
	    this.body = this.errors;
	    return;
	}

	else {
		yield newCategory.save();
		this.body = {success: true};
	}
})

.get('/admin/partners', function *(next) {
	return this.render('admin/partners');
})

.post('/admin/partners', function *(next) {

	var newPartner = new this.app.context.models.Partner({
			name: this.request.body.name,
			website: this.request.body.website,
			code: this.request.body.code,
			title: this.request.body.title,
			description: this.request.body.description,
			terms: this.request.body.terms
		});

	this.checkBody('name').notEmpty("This field is required.");
	this.checkBody('website').notEmpty("This field is required.");
	this.checkBody('code').notEmpty("This field is required.");
	this.checkBody('title').notEmpty("This field is required.");
	this.checkBody('description').notEmpty("This field is required.");
	this.checkBody('terms').notEmpty("This field is required.");
	    
    if (this.errors) {
        this.status = 400;
        this.body = this.errors;
        return;
   	}

   	else {
   		yield newPartner.save();
   		this.body = {success: true};
   	}
});




function registerRoutes(app)
{
	app.use(router.routes());
	app.use(router.allowedMethods());
}

module.exports = registerRoutes;