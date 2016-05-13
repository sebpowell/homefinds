module.exports = function(app) {
	var bookshelf = app.context.bookshelf,
	Promise = require('bluebird');

	var Category = bookshelf.Model.extend({
		tableName: "categories",
	});

	return bookshelf.model('Category', Category);
}
