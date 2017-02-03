/*! functions.js */
var $ = require('jquery');

$.fn.slider = require('ui/slider.js');

var  callkami= require('ui/module1.js');
var  callkami2= require('ui/module2.js');



$(window).load(function() {
  var kami=callkami();

  
  var slider = $('.banner').slider({
    dots: true,
    fluid: true,
    arrows: true
  });

  $('.slider-arrow').click(function() {
    var fn = this.className.split(' ')[1];

    //  Either do slider.data('slider').next() or .prev() depending on the className
    slider.data('slider')[fn]();
  });

  
});


