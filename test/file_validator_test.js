var jsdom                       = require('jsdom');
var fs                          = require('fs');
var expect                      = require('chai').expect;
var FileValidator               = require('../FileValidator');
var size_tests                  = require('./fixtures/size_tests');
var configuration_loading_tests = require('./fixtures/configuration_loading_tests');
var individual_tests            = require('./fixtures/individual_tests');
var collective_tests            = require('./fixtures/collective_tests');
var general_tests               = require('./fixtures/general_tests');
var function_tests              = require('./fixtures/function_tests');

describe('testing FileValidator', function () {
    beforeEach(function(done) {
        var self = this;
        jsdom.env(
            fs.readFileSync(__dirname + '/fixtures/index.html', 'utf-8'),
            function (err, windowObj) {
                global.window = windowObj;
                global.document = windowObj.document;
                global.HTMLElement = windowObj.HTMLElement;
                global.jQuery = global.$ = require('jquery');

                self.$confTestInput = $('#conf-test-input');
                self.$input = $('#input');
                self.$input[0].removeAttribute('accept');

                done();
            }
        );
    });

    configuration_loading_tests();
    size_tests();

    individual_tests();
    collective_tests();
    function_tests();
    general_tests();
});
