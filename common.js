var Common = {};

Common.loadUserIfLoggedIn = function *(next, that)
{
	// see if user is logged in
	if(that.isAuthenticated())
	{
		// does user have permission to view this page?
		that.state.user = that.req.user.toJSON();
		yield next;
		return;
	}
	else
	{

		yield next;
	}
	
}

Common.loadCategoriesAndPartners = function *(next, that)
{
	var Category = that.app.context.models.Category;

	var Partner = that.app.context.models.Partner;

	that.state.categories = yield new Category().fetchAll();

	that.state.categories = that.state.categories.toJSON();

	that.state.partners = yield new Partner().fetchAll();

	that.state.partners = that.state.partners.toJSON();

	yield next;

	return;
}

module.exports = Common;