module.exports = function(app) {
	var bookshelf = app.context.bookshelf,
	Promise = require('bluebird');

	var Partner = bookshelf.Model.extend({
		tableName: "partners",
	});

	return bookshelf.model('Partner', Partner);
}
