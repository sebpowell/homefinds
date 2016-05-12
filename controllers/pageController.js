var router = require('koa-router')({prefix: '/'}),
	Common = require('../common.js');

router.use(function *(next)
{
	return yield Common.loadUserIfLoggedIn(next, this);
	
})
.get('/', function *(next)
{
	return this.render('index');
});

function registerRoutes(app)
{
	app.use(router.routes());
	app.use(router.allowedMethods());
}

module.exports = registerRoutes;