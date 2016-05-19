var router = require('koa-router')(),
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
.get('/', function *(next) {

	
	// console.log(cats);
	console.log(this.state.categories);

	return this.render('index');

})

function registerRoutes(app)
{
	app.use(router.routes());
	app.use(router.allowedMethods());
}

module.exports = registerRoutes;