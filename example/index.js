var phantomBrowser = require('../index');

var browser;

phantomBrowser.openBrowser()
  .then(function(b) {
    browser = b;
    return b.createTab();
  })
  .then(function(tab) {


    tab.ready()
      .then(tab.visit('http://github.com'))
      // .then(tab.wait(1000))
      .then(tab.run(function() {
        return $('meta[property="og:description"]').attr('content');
      }))
      .then(function(pageDescription) {
        console.log('Github Page description is: ');
        console.log(pageDescription + '\n');
        console.log('search "phantomjs" and wait 3 seconds\n');
      })
      .then(tab.run(function() {
        $('[name="q"]').val('phantomjs');
        $('[action="/search"]').submit();
      }))
      .then(tab.wait(3000))
      .then(tab.run(function() {
        return $('.repo-list-name').text();
      }))
      .then(function(firstResult) {
        console.log('The search result is: ');
        console.log(firstResult);
      })
      .then(function() {
        browser.actions.exit();
      });


  });