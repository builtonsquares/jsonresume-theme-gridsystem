(function () {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var Handlebars = require('handlebars');
  var moment = require('moment');

  var iconHash = {
    'behance':        'fa fa-behance-square',
    'bitbucket':      'fa fa-bitbucket-square',
    'codepen':        'fa fa-codepen-square',
    'facebook':       'fa fa-facebook-square',
    'github':         'fa fa-github-square',
    'google-plus':    'fa fa-google-plus-square',
    'linkedin':       'fa fa-linkedin-square',
    'medium':         'fa fa-medium',
    'reddit':         'fa fa-reddit-square',
    'stack-overflow': 'fa fa-stack-overflow',
    'stack-exchange': 'fa fa-stack-exchange',
    'twitter':        'fa fa-twitter-square',
    'vimeo':          'fa fa-vimeo-square',
    'link':           'fa fa-external-link-square',
    'phone':          'fa fa-phone-square',
    'email':          'fa fa-envelope-square'
  };

  var dateMYfmt = 'MMM YYYY';

  function getIcon(network) {
    var icon = iconHash[network.toLowerCase().replace(' ', '-')];
    return icon || 'fa fa-external-link-square';
  }

  Handlebars.registerHelper('dateMY', function(date) {
    return moment(date.toString(), ['YYYY-MM-DD']).format(dateMYfmt);
  });

  Handlebars.registerHelper('faIcon', function(str) {
    var out = getIcon(str);
    return new Handlebars.SafeString(out);
  });

  Handlebars.registerHelper('spaceToBR', function(str) {
    var out = str.replace(' ', '<br>');
    return new Handlebars.SafeString(out);
  });

  Handlebars.registerHelper('stripHTTP', function(str) {
    var regexp = new RegExp('https*:\/\/');
    return str.replace(regexp, '');
  });

  Handlebars.registerHelper('skillMeter', function(level) {

    var current,
      meter = '',
      total = 5;

    if(isNaN(level)){
      // not a number
      switch(level.toLowerCase()){
        case 'expert':
        case 'master':
          current = 5;
          break;
        case 'advanced':
          current = 4;
          break;
        case 'intermediate':
          current = 3;
          break;
        case 'novice':
          current = 2;
          break;
        case 'beginner':
          current = 1;
          break;
        default:
          current = 3;
          break;
      }
    } else {
      current = parseInt(level);
    }

    for (var i = 0; i < total; i++) {
      if (i < current) {
        meter += '<i class="fa fa-circle" aria-hidden="true"></i>&nbsp;'
      } else {
        meter += '<i class="fa fa-circle-o" aria-hidden="true"></i>&nbsp;'
      }
    }

    return new Handlebars.SafeString(meter);
  });




  function render(resume) {
    var css = fs.readFileSync(__dirname + '/style.css', 'utf-8');
    var tpl = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');
    var partialsDir = path.join(__dirname, 'partials');
    var filenames = fs.readdirSync(partialsDir);

    filenames.forEach(function (filename) {
      var matches = /^([^.]+).hbs$/.exec(filename);
      if (!matches) {
        return;
      }
      var name = matches[1];
      var filepath = path.join(partialsDir, filename)
      var template = fs.readFileSync(filepath, 'utf8');

      Handlebars.registerPartial(name, template);
    });
    return Handlebars.compile(tpl)({
      css: css,
      resume: resume
    });
  }

  module.exports = {
    render: render
  };


})();
