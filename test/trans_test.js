var trans = require('../trans');
var assert = require('assert');
var clone = require('clone');

describe('testing translator', function () {
    beforeEach(function() {
        this.trans = clone(trans);
        this.trans.defaultLocale = 'en';
        this.trans.locale = 'hu';
        this.trans.addData('en', {
            domain: {
                trans_key: 'trans_text - en',
                trans_key2: 'trans_text2 - en',
                trans_key3: 'params: %param1% %param2%'
            }
        });
        this.trans.addData('hu', {
            domain: {
                trans_key: 'trans_text - hu'
            }
        });
    });

    it('Should return "non_existent_key" when trying to translate a non-existent key', function() {
        assert.equal('non_existent_key', this.trans.trans('non_existent_key', null, 'domain'));
    });

    it('Should return "some_key" when trying to translate from a non-existent domain', function() {
        assert.equal('some_key', this.trans.trans('some_key', null, 'non_existent_domain'));
    });

    it('Should return "some_key" when trying to translate from a non-existent locale', function() {
        assert.equal('some_key', this.trans.trans('some_key', null, 'non_existent_domain', 'non_existent_locale'));
    });

    it('Should return "trans_text - hu"', function() {
        assert.equal('trans_text - hu', this.trans.trans('trans_key', null, 'domain'));
    });

    it('Should return "trans_text - en"', function() {
        assert.equal('trans_text - en', this.trans.trans('trans_key', null, 'domain', 'en'));
    });

    it('Should return "trans_text2 - en" when trying to translate a not-translated key', function() {
        assert.equal('trans_text2 - en', this.trans.trans('trans_key2', null, 'domain'));
    });

    it('Should return "trans_text2 - en" by falling back to the default locale', function() {
        assert.equal('trans_text2 - en', this.trans.trans('trans_key2', null, 'domain', 'hu'));
    });

    it('Should return "params: param1 param2" after transating with parameters', function() {
        assert.equal('params: param1 param2', this.trans.trans('trans_key3', {
            '%param1%': 'param1',
            '%param2%': 'param2'
        }, 'domain', 'en'));
    });

    it('Should return "new_domain_text" after adding new domain data to an existing locale', function() {
        this.trans.addDomainData('hu', 'new_domain', {
            new_domain_key: 'new_domain_text'
        });
        assert.equal('new_domain_text', this.trans.trans('new_domain_key', null, 'new_domain'));
    });

    it('Should return "new_domain_text" after adding new domain data to a new locale', function() {
        this.trans.addDomainData('ro', 'new_domain', {
            new_domain_key: 'new_domain_text'
        });
        assert.equal('new_domain_text', this.trans.trans('new_domain_key', null, 'new_domain', 'ro'));
    });
});
