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

module.exports = Common;