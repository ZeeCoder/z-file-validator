var FileValidator = require('../../FileValidator');
var expect        = require('chai').expect;

module.exports = function() {
    describe('collective tests', function () {
        describe('size validation', function () {
            it('should return an error if the collective size is too small', function() {
                this.$input[0].files = [{size: 1024}, {size: 1024}];

                var validator = new FileValidator(this.$input, {
                    collective: {size: {min: '1M'}}
                });

                expect(validator.validate()).to.deep.equal([
                    'collective.small_filesize'
                ]);
            });

            it('should return an error if the collective size is too big', function() {
                this.$input[0].files = [{size: 1024*1024*4}, {size: 1024*1024*4}];

                var validator = new FileValidator(this.$input, {
                    collective: {size: {max: '5M'}}
                });

                expect(validator.validate()).to.deep.equal([
                    'collective.big_filesize'
                ]);
            });

            it('should return true if the collective size is in the allowed range', function() {
                this.$input[0].files = [{size: 1024*1024*2}, {size: 1024*1024*2}];

                var validator = new FileValidator(this.$input, {
                    collective: {size: {min: '4M', max: '5M'}}
                });

                expect(validator.validate()).to.equal(true);
            });
        });

        describe('count validation', function () {
            it('should return an error, if too few file is selected', function() {
                this.$input[0].files = [{}];

                var validator = new FileValidator(this.$input, {
                    collective: {count: {min: 2}}
                });

                expect(validator.validate()).to.deep.equal([
                    'collective.too_few_file'
                ]);
            });

            it('should return an error, if too much file is selected', function() {
                this.$input[0].files = [{}, {}, {}];

                var validator = new FileValidator(this.$input, {
                    collective: {count: {max: 2}}
                });

                expect(validator.validate()).to.deep.equal([
                    'collective.too_much_file'
                ]);
            });

            it('should return true if the file count is in the allowed range', function() {
                this.$input[0].files = [{}, {}];

                var validator = new FileValidator(this.$input, {
                    collective: {count: {min: 1, max: 2}}
                });

                expect(validator.validate()).to.equal(true);
            });
        });
    });
};
