var phantom = require('phantom');
var RSVP = require('rsvp');

function openBrowser() {
  return new RSVP.Promise(function(resolve, reject) {

    phantom.create(function (phantomInstance) {
      var browser = _newBrowser(phantomInstance);
      resolve(browser);
    });

  });
}

function _newBrowser(phantomInstance) {

  function createTab() {
    return new RSVP.Promise(function (resolve, reject) {

      phantomInstance.createPage(function (phantomPage) {
        var tab = _newTab(phantomPage);
        resolve(tab);
      });

    });
  }

  return {
    actions: phantomInstance,
    createTab: createTab
  };
}

function _newTab(phantomPage) {

  function ready() {
    return new RSVP.Promise(function(resolve, reject) {
      resolve();
    });
  }

  function visit(url) {
    return function() {
      return new RSVP.Promise(function (resolve, reject) {
        phantomPage.open(url, function (status) {
          resolve(status);
        });
      });
    }
  }

  function run(script) {
    return function() {
      return new RSVP.Promise(function(resolve, reject) {
        phantomPage.evaluate(script, function(result) {
          resolve(result)
        })
      });
    };
  }

  function wait(delay) {
    return function() {
      return new RSVP.Promise(function (resolve, reject) {
        setTimeout(resolve, delay);
      });
    };
  }

  return {
    ready: ready,
    visit: visit,
    run: run,
    wait: wait
  }
}

module.exports = {
  openBrowser: openBrowser
};