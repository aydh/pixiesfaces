;(function () {
	
	'use strict';



	// iPad and iPod detection	
	var isiPad = function(){
		return (navigator.platform.indexOf("iPad") != -1);
	};

	var isiPhone = function(){
	    return (
			(navigator.platform.indexOf("iPhone") != -1) || 
			(navigator.platform.indexOf("iPod") != -1)
	    );
	};

	// Burger Menu
	var burgerMenu = function() {

		$('body').on('click', '.js-pixies-nav-toggle', function(event){

			event.preventDefault();

			if ( $('#navbar').is(':visible') ) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');	
			}

			
			
		});

	};


	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500);
			
			return false;
		});
	
	};


	var gotoSection = function() {

		$('.js-gotoSection').on('click', function(event){
			
			event.preventDefault();

			var section = $(this).data('nav-section'),
				navbar = $('#navbar');
				
			if ( $('[data-section="' + section + '"]').length ) {
				$('html, body').animate({
					scrollTop: $('[data-section="' + section + '"]').offset().top - 40
				}, 500);
		   }
			
			return false;
		});
	
	};

	// Page Nav
	var clickMenu = function() {
		$('#navbar a:not([class="external"])').click(function(event){
			var section = $(this).data('nav-section'),
				navbar = $('#navbar');

				if ( $('[data-section="' + section + '"]').length ) {
			    	$('html, body').animate({
			        	scrollTop: $('[data-section="' + section + '"]').offset().top - 40
			    	}, 500);
			   }

		    if ( navbar.is(':visible')) {
		    	navbar.removeClass('in');
		    	navbar.attr('aria-expanded', 'false');
		    	$('.js-pixies-nav-toggle').removeClass('active');
		    }

		    event.preventDefault();
		    return false;
		});


	};

	// Reflect scrolling in navigation
	var navActive = function(section) {

		var $el = $('#navbar > ul');
		$el.find('li').removeClass('active');
		$el.each(function(){
			$(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
		});

	};

	var navigationSection = function() {

		var $section = $('section[data-section]');
		
		$section.waypoint(function(direction) {
		  	
		  	if (direction === 'down') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
	  		offset: '150px'
		});

		$section.waypoint(function(direction) {
		  	if (direction === 'up') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
		  	offset: function() { return -$(this.element).height() + 200; }
		});

	};

	// Window Scroll
	var windowScroll = function() {
		var lastScrollTop = 0;

		$(window).scroll(function(event){

		   	var header = $('#pixies-header'),
				scrlTop = $(this).scrollTop(),
				navbrand = $('#navbar-brand');


			if ( scrlTop > 500 ) {
				header.addClass('navbar-fixed-top pixies-animated slideInDown');
		    	navbrand.attr('visibility', ':visible');

			} else if ( scrlTop <= 500) {
		    	navbrand.attr('visibility', ':hidden');
				if ( header.hasClass('navbar-fixed-top') ) {
					header.removeClass('slideInDown');
					header.addClass('slideOutUp');
					setTimeout(function(){
						header.removeClass('navbar-fixed-top pixies-animated slideInDown slideOutUp');
					}, 100 );
				}
			} 
			
		});
	};


	// Animations
	// Home

	var homeAnimate = function() {
		if ( $('#pixies-home').length > 0 ) {	

			$('#pixies-home').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {


					setTimeout(function() {
						$('#pixies-home .to-animate').each(function( k ) {
							var el = $(this);
							
							setTimeout ( function () {
								el.addClass('fadeInUp animated');
							},  k * 200, 'easeInOutExpo' );
							
						});
					}, 200);

					
					$(this.element).addClass('animated');
						
				}
			} , { offset: '80%' } );

		}
	};


	var introAnimate = function() {
		if ( $('#pixies-intro').length > 0 ) {	

			$('#pixies-intro').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {


					setTimeout(function() {
						$('#pixies-intro .to-animate').each(function( k ) {
							var el = $(this);
							
							setTimeout ( function () {
								el.addClass('fadeInRight animated');
							},  k * 200, 'easeInOutExpo' );
							
						});
					}, 1000);

					
					$(this.element).addClass('animated');
						
				}
			} , { offset: '80%' } );

		}
	};

	var workAnimate = function() {
		if ( $('#pixies-work').length > 0 ) {	

			$('#pixies-work').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {


					setTimeout(function() {
						$('#pixies-work .to-animate').each(function( k ) {
							var el = $(this);
							
							setTimeout ( function () {
								el.addClass('fadeInUp animated');
							},  k * 200, 'easeInOutExpo' );
							
						});
					}, 200);

					
					$(this.element).addClass('animated');
						
				}
			} , { offset: '80%' } );

		}
	};

	/*
	var instaAnimate = function() {
		if ( $('#pixies-insta').length > 0 ) {	

			$('#pixies-insta').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {


					setTimeout(function() {
						$('#pixies-insta .to-animate').each(function( k ) {
							var el = $(this);
							
							setTimeout ( function () {
								el.addClass('fadeInUp animated');
							},  k * 200, 'easeInOutExpo' );
							
						});
					}, 200);

					
					$(this.element).addClass('animated');
						
				}
			} , { offset: '80%' } );

		}
	};
	*/

	var testimonialAnimate = function() {
		var testimonial = $('#pixies-testimonials');
		if ( testimonial.length > 0 ) {	

			testimonial.waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {

					var sec = testimonial.find('.to-animate').length,
						sec = parseInt((sec * 200) - 400);

					setTimeout(function() {
						testimonial.find('.to-animate').each(function( k ) {
							var el = $(this);
							
							setTimeout ( function () {
								el.addClass('fadeInUp animated');
							},  k * 200, 'easeInOutExpo' );
							
						});
					}, 200);

					setTimeout(function() {
						testimonial.find('.to-animate-2').each(function( k ) {
							var el = $(this);
							
							setTimeout ( function () {
								el.addClass('fadeInDown animated');
							},  k * 200, 'easeInOutExpo' );
							
						});
					}, sec);

					
					$(this.element).addClass('animated');
						
				}
			} , { offset: '80%' } );

		}
	};

	var servicesAnimate = function() {
		var services = $('#pixies-services');
		if ( services.length > 0 ) {	

			services.waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {

					var sec = services.find('.to-animate').length,
						sec = parseInt((sec * 200) + 400);

					setTimeout(function() {
						services.find('.to-animate').each(function( k ) {
							var el = $(this);
							
							setTimeout ( function () {
								el.addClass('fadeInUp animated');
							},  k * 200, 'easeInOutExpo' );
							
						});
					}, 200);

					setTimeout(function() {
						services.find('.to-animate-2').each(function( k ) {
							var el = $(this);
							
							setTimeout ( function () {
								el.addClass('bounceIn animated');
							},  k * 200, 'easeInOutExpo' );
							
						});
					}, sec);


					
					$(this.element).addClass('animated');
						
				}
			} , { offset: '80%' } );

		}
	};

	var contactAnimate = function() {
		var contact = $('#pixies-contact');
		if ( contact.length > 0 ) {	

			contact.waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {

					setTimeout(function() {
						contact.find('.to-animate').each(function( k ) {
							var el = $(this);
							
							setTimeout ( function () {
								el.addClass('fadeInUp animated');
							},  k * 200, 'easeInOutExpo' );
							
						});
					}, 200);

					$(this.element).addClass('animated');
						
				}
			} , { offset: '80%' } );

		}
	};

	var errorAnimate = function() {
		if ( $('#pixies-error').length > 0 ) {	

			$('#pixies-error').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {


					setTimeout(function() {
						$('#pixies-error .to-animate').each(function( k ) {
							var el = $(this);
							
							setTimeout ( function () {
								el.addClass('fadeInUp animated');
							},  k * 200, 'easeInOutExpo' );
							
						});
					}, 200);

					
					$(this.element).addClass('animated');
						
				}
			} , { offset: '80%' } );

		}
	};
	
	/*
	var loadInsta = function() {

		const instarow = document.getElementById('insta');

		var request = new XMLHttpRequest();
		request.open('GET', 'https://www.pixiesfaces.com/.netlify/functions/instagram', true);
		request.onload = function () {
		
		  // Begin accessing JSON data here
		  var insta = JSON.parse(this.response);
		  if (request.status >= 200 && request.status < 400) {
			for (let image of insta.data) {
			//insta.data.forEach(image => {
			  if (image.media_type === 'VIDEO') continue;
			  
			  const div1 = document.createElement('div');
			  div1.setAttribute('class', 'col-md-4 col-sm-6 col-xxs-12');
			  instarow.appendChild(div1);
		
			  const a = document.createElement('a');
			  a.setAttribute('class', 'pixies-insta-item');
			  a.setAttribute('href', image.permalink);
			  div1.appendChild(a);
		
			  const img = document.createElement('img');
			  img.setAttribute('class', 'img-responsive');
			  img.setAttribute('alt', image.caption);
			  img.setAttribute('src', image.media_url);
			  a.appendChild(img);
		
			  //const div2 = document.createElement('div');
			  //div2.setAttribute('class', 'pixies-text');
			  //a.appendChild(div2);
		
			  //const p = document.createElement('p');
			  //const captionArray = image.caption.split("#");
			  //p.textContent = captionArray[0];
			  //div2.appendChild(p);
		
			  //const div3 = document.createElement('div');
			  //div3.setAttribute('class', 'clearfix visible-sm-block');
			  //instarow.appendChild(div3);
			//});
			};
		  } else {
			const errorMessage = document.createElement('marquee');
			errorMessage.textContent = `Gah, it's not working!`;
			app.appendChild(errorMessage);
		  }
		}
		
		request.send();
	};
	*/

	var gtagEnquiryEvent = function () {
		// Gets a reference to the form element, assuming
		// it contains the ID attribute "signup-form".
		var form = document.getElementById('pixies-enquiry-form');

		if(typeof(form) != 'undefined' && form != null){
			console.log('Found enquiry form');
			// Adds a listener for the "submit" event.
			form.addEventListener('submit', function(event) {

				// Prevents the browser from submitting the form
				// and thus unloading the current page.
				event.preventDefault();

				// Creates a timeout to call submitForm after one second.
				setTimeout(submitForm, 1000);

				// Monitors whether or not the form has been submitted.
				// This prevents the form from being submitted twice in cases
				// where the event callback function fires normally.
				var formSubmitted = false;

				function submitForm() {
					if (!formSubmitted) {
					formSubmitted = true;
					form.submit();
					}
				}

				// Sends the event to Google Analytics and
				// resubmits the form once the hit is done.
				gtag('event', 'generate_lead', {
					'event_callback': submitForm
				});
			});
		} else {
			console.log('No enquiry form found');
		}

	}
	
	// Document on load.
	$(function(){

		gtagEnquiryEvent();

		//loadInsta();

		burgerMenu();

		clickMenu();

		windowScroll();

		navigationSection();

		goToTop();
		gotoSection();

		// Animations
		homeAnimate();
		introAnimate();
		//instaAnimate();
		workAnimate();
		testimonialAnimate();
		servicesAnimate();
		contactAnimate();
		errorAnimate();
		

	});


}());