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

    var current = 0;

    if(isNaN(level)){
      // not a number
      current = getLevelFromString(level);
    } else {
      current = parseInt(level);
    }

    return current;
  });

  function getLevelFromString(level) {
    switch(level.toLowerCase()){
      case 'expert':
      case 'master':
        return 5;
      case 'advanced':
        return 4;
      case 'intermediate':
        return 3;
      case 'novice':
        return 2;
      case 'beginner':
        return 1;
      default:
        return 3;
    }
  }

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
