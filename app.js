const koa = require('koa'),
	app = koa(),
	config = require('./config.js')


// setup database connection
var knex = require('knex')({
	client: 'mysql',
	connection: {
		host: config.get('database.ip'),
		user: config.get('database.username'),
		password : config.get('database.password'),
		port : config.get('database.port'),
		database: config.get('database.name'),
		charset  : 'utf8',
		timezone: "UTC"
	}
	});
	
// setup bookshelf (SQL ORM)	
app.context.bookshelf = require('bookshelf')(knex);
app.context.bookshelf.plugin('registry');
app.context.bookshelf.plugin('virtuals');

// setup models
app.context.models = 
{
	User: require('./models/user.js')(app)
};

// log everyting
app.use(function *(next)
{
	var start = new Date;
	yield next;
	var ms = new Date - start;
	console.log('%s %s - %s', this.method, this.url, ms);
});

// setup middleware
app.use(require('koa-cors')());
app.use(require('koa-bodyparser')());
app.use(require('koa-validate')());

// setup session
app.keys = ["oiu23r08FfhsQ;a[pwe09r90TIq"];
app.use(require('koa-session')(app));

// setup passport
app.context.passport = require('koa-passport');

require('./auth.js')(app);

app.use(app.context.passport.initialize());
app.use(app.context.passport.session());

// setup jade
const Jade = require('koa-jade')
const jade = new Jade({
	viewPath: './views',
	basedir: './views',
	debug: true,
	pretty: true,
	compileDebug: false,
	app: app,
	locals: config.get('view.locals')
});


// routes
require('./controllers/pageController.js')(app);
require('./controllers/userController.js')(app);

// static files
app.use(require('koa-static')(__dirname + '/assets'));

app.listen(config.get('server.port'));