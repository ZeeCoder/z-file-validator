var FileValidator = require('../../FileValidator');
var expect        = require('chai').expect;

module.exports = function() {
    describe('general tests', function () {
        it('should return true, if no validation error occured', function() {
            this.$input[0].files = [{
                name: 'test.png',
                type: 'image/png',
                size: 1024 * 1024 * 2 // 2M
            }, {
                name: 'test2.png',
                type: 'image/png',
                size: 1024 * 1024 // 1M
            }];

            var validator = new FileValidator(this.$input, {
                accept: 'image/*',
                size: {min: '1M', max: '3M'}
            });

            expect(validator.validate()).to.equal(true);
        });

        it('should reset the input value if an error occured', function() {
            this.$input.val('something');
            this.$input[0].files = [{
                size: 1024 * 1024 * 2 // 2M
            }];

            var validator = new FileValidator(this.$input, {
                size: {max: '1M'}
            });

            expect(this.$input.val()).to.equal('something');
            validator.validate();
            expect(this.$input.val()).to.equal('');
        });
    });
};
