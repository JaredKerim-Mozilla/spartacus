var helpers = require('../helpers');

helpers.startCasper('/mozpay', function(){
  helpers.injectSinon();
  helpers.fakeVerificationSuccess();
  // Make pinStateCheck return false for pin.
  helpers.fakePinData({pin: true});
  // Make create-pin API call return 204
  helpers.fakePinData({pin: true}, 'POST', 400, '/mozpay/v1/api/pin/check/');
});

casper.test.begin('Enter Pin API call returns 400', {
  test: function(test) {

    casper.waitForUrl('/mozpay/login', function() {
      helpers.logInAsNewUser();
    });

    casper.waitForUrl('/mozpay/enter-pin', function() {
      test.assertVisible('.pinbox', 'Pin entry widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitUntilVisible('.err-msg', function() {
      test.assertVisible('.err-msg', 'Error message should be shown as pin is invalid.');
    });

    casper.run(function() {
      test.done();
    });
  },
});
