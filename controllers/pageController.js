var router = require('koa-router')({prefix: '/'});

router.get('/', function *(next)
{
	return this.render('index');

});

function registerRoutes(app)
{
	app.use(router.routes());
	app.use(router.allowedMethods());
}

module.exports = registerRoutes;