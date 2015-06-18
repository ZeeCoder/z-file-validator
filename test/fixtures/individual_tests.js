var FileValidator = require('../../FileValidator');
var expect        = require('chai').expect;

module.exports = function() {
    describe('individual tests', function () {
        describe('size validation', function () {
            it('should return an error if the size is too small', function() {
                this.$input[0].files = [{size: 0}];

                var validator = new FileValidator(this.$input, {
                    size: {min: '1M'}
                });

                expect(validator.validate()).to.deep.equal([
                    [
                        ['small_filesize'],
                        this.$input[0].files[0]
                    ]
                ]);
            });

            it('should return an error if the size is too big', function() {
                this.$input[0].files = [{size: '2M'}];

                var validator = new FileValidator(this.$input, {
                    size: {max: '1M'}
                });

                expect(validator.validate()).to.deep.equal([
                    [
                        ['big_filesize'],
                        this.$input[0].files[0]
                    ]
                ]);
            });
        });

        describe('type validation', function () {
            it('should return an error if the extension is not in the accepted ones', function() {
                this.$input[0].files = [{name: 'test.pdf'}];

                var validator = new FileValidator(this.$input, {
                    accept: '.png, .jpg'
                });

                expect(validator.validate()).to.deep.equal([
                    [
                        ['bad_file_type'],
                        this.$input[0].files[0]
                    ]
                ]);
            });

            it('should return an error if the mime type is not accepted by the wildcard', function() {
                this.$input[0].files = [{type: 'application/pdf'}];

                var validator = new FileValidator(this.$input, {
                    accept: 'image/*'
                });

                expect(validator.validate()).to.deep.equal([
                    [
                        ['bad_file_type'],
                        this.$input[0].files[0]
                    ]
                ]);
            });

            it('should return an error if the mime type is not in the accepted ones', function() {
                this.$input[0].files = [{type: 'application/pdf'}];

                var validator = new FileValidator(this.$input, {
                    accept: 'image/png'
                });

                expect(validator.validate()).to.deep.equal([
                    [
                        ['bad_file_type'],
                        this.$input[0].files[0]
                    ]
                ]);
            });

            it('should return true for accepted extensions', function() {
                this.$input[0].files = [{name: 'test.png'}];

                var validator = new FileValidator(this.$input, {
                    accept: '.png'
                });

                expect(validator.validate()).to.equal(true);
            });

            it('should return true for accepted mime types', function() {
                this.$input[0].files = [{type: 'image/png'}];

                var validator = new FileValidator(this.$input, {
                    accept: 'image/png'
                });

                expect(validator.validate()).to.equal(true);
            });

            it('should return true for accepted mime type wildcards', function() {
                this.$input[0].files = [{type: 'image/jpg'}];

                var validator = new FileValidator(this.$input, {
                    accept: 'image/*'
                });

                expect(validator.validate()).to.equal(true);
            });
        });

        describe('misc', function () {
            it('should be able to return multiple errors for multiple files', function() {
                this.$input[0].files = [{type: 'image/jpg'}, {type: 'image/jpg'}];

                var validator = new FileValidator(this.$input, {
                    accept: 'image/png'
                });

                expect(validator.validate()).to.deep.equal([
                    [
                        ['bad_file_type'],
                        {type: 'image/jpg'}
                    ],
                    [
                        ['bad_file_type'],
                        {type: 'image/jpg'}
                    ]
                ]);
            });
        });
    });
};
