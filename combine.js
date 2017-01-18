var fs = require('fs');
var CleanCSS = require('clean-css');
// var combine = require('css-combine');

var input = [
  'styles/reset.css',
  'node_modules/reflex-grid/css/reflex.min.css',
  'styles/layout.css',
  'styles/typography.css'
];
var output = 'style.css';

var opts = {
  aggressiveMerging: false,
  inline: 'all',
  level: {
    1: {
      all: false
    }
  }
};

new CleanCSS(opts).minify(input, function (error, minified) {

  fs.truncate(output, 0, function() {
    fs.writeFile(output, minified.styles, function(err) {
      if (err){
        throw err;
      }
      console.log('Styles written to '+output);
    });
  });
});
// function combineCss() {
//   combine(index).pipe(
//     fs.createWriteStream(output)
//   );
// }

// combineCss();