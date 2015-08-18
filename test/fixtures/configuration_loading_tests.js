var FileValidator = require('../../FileValidator');
var expect        = require('chai').expect;

module.exports = function() {
    describe('configuration loading tests', function () {
        it('should load the configuration object as the second parameter', function() {
            var validator = new FileValidator(this.$confTestInput, {
                a: {
                    useless: true
                },
                configuration: true
            });

            expect(validator.getConfig()).to.deep.equal({
                a: {
                    useless: true
                },
                configuration: true
            });
        });

        it('should load the configuration from a data-attribute', function() {
            var validator = new FileValidator(this.$confTestInput, 'configuration');

            expect(validator.getConfig()).to.deep.equal({
                a: {
                    useless: true
                },
                configuration: true
            });
        });

        it('should prefer the "accept" data-attribute over the "accept" config param', function() {
            this.$input[0].setAttribute('accept', 'image/*');
            var validator = new FileValidator(this.$input, {
                accept: 'image/png, image/jpg'
            });

            expect(validator.getConfig()).to.deep.equal({
                accept: [
                    'image/*'
                ]
            });
        });

        it('should convert the "accept" config parameter to an array', function() {
            var validator = new FileValidator(this.$input, {
                accept: 'image/png, image/jpg, .png, .jpg, images/*'
            });

            expect(validator.getConfig()).to.deep.equal({
                accept: [
                    'image/png',
                    'image/jpg',
                    '.png',
                    '.jpg',
                    'images/*'
                ]
            });
        });
    });
};
