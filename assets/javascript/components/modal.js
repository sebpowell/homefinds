(function($) { 
	$.fn.modal = function(options, val)
	{
		var that = this;

		var settings = $.extend({
			modalHideClass: 'is-hidden',
			modalBackdropClass: '.modal-backdrop',
			positionVertical: true
			}, options);

		if(options === 'show')
		{
			return show(this);
		}
		else if(options === 'hide')
		{
			return hide(this);
		}
		else if(options === 'resize')
		{
			return resize(this);
		}
		else
		{
			return init();
		}

		function show(targetModal)
		{
			targetModal.trigger('show.ga.modal', [targetModal]);

			targetModal.removeClass(settings.modalHideClass)
			.css({
				marginLeft: -(targetModal.outerWidth() / 2),
				// marginTop: -(targetModal.outerHeight() / 2)
			});

			if(settings.positionVertical == true) {
				targetModal.css({marginTop: -(targetModal.outerHeight() / 2)})
			}


			// show modal backdrop
			$(settings.modalBackdropClass).removeClass(settings.modalHideClass);
			$('body').css('overflow', 'hidden');

			targetModal.trigger('shown.ga.modal', [targetModal]);

		}

		function hide(targetModal)
		{
			targetModal.trigger('hide.ga.modal', [targetModal]);

			targetModal.addClass(settings.modalHideClass)
			$(settings.modalBackdropClass).addClass(settings.modalHideClass);
			$('body').css('overflow', 'auto');

			targetModal.trigger('hidden.ga.modal', [targetModal]);
		}

		function resize(targetModal)
		{
			
			targetModal.css({
				marginLeft: -(targetModal.outerWidth() / 2),
				marginTop: -(targetModal.outerHeight() / 2)
			});
		}


		function init()
		{
			// Show target modal & add backdrop.
			$('[data-modal]').on('click', function(e)
			{
				e.preventDefault();
				//e.stopPropagation();
				
				var targetModalID = $(this).data('modal');

				// show modal
				return show($("#" + targetModalID));

			});

			that.each(function()
			{
				var modalEl = $(this);

				// add close handler
				$(this).find(".modal-close, .js-modal-close").on('click', function(e)
				{
					e.preventDefault();
					hide(modalEl);
					
				});
			});

			$(settings.modalBackdropClass).on('click', function(e)
			{
				that.each(function()
				{
					if(! $(this).hasClass(settings.modalHideClass))
						hide($(this));
				});

			});
		}

		
	};
})(jQuery);
