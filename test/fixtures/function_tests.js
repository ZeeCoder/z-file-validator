var FileValidator = require('../../FileValidator');
var expect        = require('chai').expect;

module.exports = function() {
    describe('#hasCollectiveErrors', function () {
        it('should return true, if the returned validation response contains collective errors', function() {
            this.$input[0].files = [{}, {}]; // two "files"

            var validator = new FileValidator(this.$input, {
                collective: {count: {max: 1}}
            });

            expect(validator.hasCollectiveErrors()).to.equal(false);
            validator.validate();
            expect(validator.hasCollectiveErrors()).to.equal(true);
        });
    });

    describe('#setInputResetOnError', function () {
        it('should switch on or off input resetting on error, depending on the bool parameter', function() {
            this.$input[0].files = [{
                size: 1024 * 1024 * 2 // 2M
            }];

            var validator = new FileValidator(this.$input, {
                size: {max: '1M'}
            }).setInputResetOnError(false);

            this.$input.val('something');
            validator.validate();
            expect(this.$input.val()).to.equal('something');

            validator.setInputResetOnError(true);
            validator.validate();
            expect(this.$input.val()).to.equal('');
        });
    });
};
