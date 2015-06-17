var dom_config = require('z-dom-config');

function FileValidator($input, dataAttrName, callback) {
    var self = this;


    // If this boolean variable equals true, then the validation function
    // returns all the possible error codes as an array.
    this.returnErrorsInArray = false;

    // Config setup
    this.config = dom_config.load($input, dataAttrName)
    if ($input.attr('accept') !== undefined) {
        this.config.accept = $input.attr('accept');
    }
    this.config.accept = this.config.accept.replace(' ', '').split(',');


    // Converting the min_size and max_size parameters to byte integers
    if (this.config.min_size !== undefined) {
        this.config.min_size = this.convertSize(this.config.min_size);
    }

    if (this.config.max_size !== undefined) {
        this.config.max_size = this.convertSize(this.config.max_size);
    }

    // Adding {} as the default to the size parameter
    this.config.size = this.config.size || {};

    // Converting possible "min" and "max" parameters inside the "size" parameter to
    // integer bytes. Also getting the values from the "min_size" and "max_size"
    // parameters, if there's no "min" and/or "max" parameters set in "size".
    if (this.config.size.min !== undefined) {
        this.config.size.min = this.convertSize(this.config.size.min);
    } else if (this.config.min_size !== undefined) {
        this.config.size.min = this.config.min_size;
    }

    if (this.config.size.max !== undefined) {
        this.config.size.max = this.convertSize(this.config.size.max);
    } else if (this.config.max_size !== undefined) {
        this.config.size.max = this.config.max_size;
    }

    $input.change(function() {
        var validationCodes = ['no_file_selected'];
        if ($(this).val() !== '') {
            validationCodes = self.validate(this.files[0]);
        }

        if (self.returnErrorsInArray) {
            callback.apply($input[0], [validationCodes, $input[0].files[0], self.config]);
        } else {
            var validationCode = validationCodes.length ? validationCodes[0] : true;
            callback.apply($input[0], [validationCode, $input[0].files[0], self.config]);
        }

        if (validationCodes.length) {
            $(this).val('');
        }
    });
}

FileValidator.prototype.convertSize = function(size, convertTo) {
    var integer = size;

    if (convertTo !== undefined) {
        if (convertTo === 'Mb') {
            integer = integer / 1024 / 1024;
        } else if (convertTo === 'Kb') {
            integer = integer / 1024;
        }
    } else {
        if (integer.indexOf('Mb') !== -1) {
            integer = parseInt(integer.replace('Mb', '').replace(' ', '')) * 1024 * 1024;
        } else if (integer.indexOf('Kb') !== -1) {
            integer = parseInt(integer.replace('Kb', '').replace(' ', '')) * 1024;
        } else {
            integer = parseInt(integer);
        }
    }

    return integer;
};

FileValidator.prototype.validate = function(file) {
    var errors = [];

    if (
        typeof this.config.accept !== 'undefined' &&
        this.config.accept instanceof Array
    ) {
        var accepted = false;
        var acceptLength = this.config.accept.length;
        for (var i = acceptLength - 1; i >= 0; i--) {
            if (this.config.accept[i].indexOf('/*') !== -1) {
                // "/*" pattern
                var regex = new RegExp(
                    this.config.accept[i].replace('/*', '\\/.*')
                , 'i');

                if (regex.exec(file.type) !== null) {
                    accepted = true;
                    break;
                }
            } else if (this.config.accept[i][0] === '.') {
                // ".ext" pattern
                var fileNameArr = file.name.split('.');
                if (('.' + fileNameArr[fileNameArr.length - 1]) === this.config.accept[i]) {
                    accepted = true;
                }
            } else {
                // media_type
                if (file.type === this.config.accept[i]) {
                    accepted = true;
                }
            }
        }

        if (accepted === false) {
            errors.push('bad_extension');
        }
    }

    if (
        this.config.size.max !== undefined &&
        file.size > this.config.size.max
    ) {
        errors.push('big_filesize');
    }

    if (
        this.config.size.min !== undefined &&
        file.size < this.config.size.min
    ) {
        errors.push('small_filesize');
    }

    return errors;
};

FileValidator.prototype.returnValidationCodesInArray = function() {
    this.returnErrorsInArray = true;
};

module.exports = FileValidator;
