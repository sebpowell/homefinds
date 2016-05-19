(function($) { 
	$.fn.ajaxForm = function(options, val)
	{
		var that = this;

		var settings = $.extend(
		{
			serialiseEls: 'input, select, textarea',
			ignoreEls: ".js-no-serialise, input[type='submit']",
			successHandler: onSuccess,
			errorHandler: onError,
			validationHandler: function(){ return true;},
			url: null
		}, options);

		
		return init();

		function init()
		{
			// watch for form submission
			that.each(function()
			{
				var formEl = $(this);
				formEl.on('submit', $.proxy(onSubmit, formEl));
			});

		}

		function onSubmit(event)
		{
			event.preventDefault();

			var dat = {};

			$(event.currentTarget).find(settings.serialiseEls).each(function()
			{
				var el = $(this);

				if(el.is(settings.ignoreEls) || (! el.attr('name')) || (! el.val()))
					return;

				if(el.is("[type='checkbox']"))
				{
					if(el.is(':checked'))
						dat[el.attr('name')] = 'on';
				}
				else
				{
					dat[el.attr('name')] = el.val();	
				}
				
			});

			if(! settings.validationHandler(dat))
				return;

			// post form to url specified in settings, or (if not set), the action attribute on the form
			// if that isn't set either, post to the current url
			$.post(settings.url || $(event.currentTarget).attr('action') || window.location, dat)
			.done($.proxy(settings.successHandler, this))
			.fail($.proxy(settings.errorHandler, this));
		}

		function onSuccess(data)
		{
			if(! data.success)
				return settings.errorHandler.call(this, data);

			this.find(".alert").addClass("show");
			this.trigger("reset");
			this.find(".form-feedback").addClass("is-hidden");
		}

		function onError(data)
		{
			var that = this;

			this.find(".form-feedback").addClass("is-hidden");

			var errorObj = null;

			if(data.errors && (data.errors.length > 0))
				errorObj = data.errors;
			else if(data.responseJSON && data.responseJSON.errors && (data.responseJSON.errors.length > 0))
				errorObj = data.responseJSON.errors;

			if(errorObj)
			{
				$.each(errorObj, function(key, value)
				{
					
					that.find("[name='" + Object.keys(value)[0] + "']")
					.next(".form-feedback").removeClass("is-hidden")
					.text(value[Object.keys(value)[0]]);
				});
			}
			
		}

		
	};
})(jQuery);
