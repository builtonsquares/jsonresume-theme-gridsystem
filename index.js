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

  Handlebars.registerHelper('lowercase', function (str) {
    if(str && typeof str === 'string') {
      return str.toLowerCase();
    }
    return str;
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
      var filepath = path.join(partialsDir, filename);
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
