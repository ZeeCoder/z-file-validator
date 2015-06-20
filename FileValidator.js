'use strict';

var dom_config = require('z-dom-config');
var _ = {
    has: require('lodash/object/has')
};

function FileValidator($input, dataAttrNameOrConfig) {
    // If this boolean variable equals true, then the validation function
    // returns all the possible error codes as an array.
    this.$input = $input;
    this.inputResetOnError = true;
    this.doHaveCollectiveErrors = false;

    // Getting the configuration
    if (typeof dataAttrNameOrConfig === 'string') {
        this.config = dom_config.load($input, dataAttrNameOrConfig)
    } else {
        this.config = dataAttrNameOrConfig;
    }

    // The "accept" attribute has higher priority, than the "accept" config
    // parameter
    if (this.$input.attr('accept') !== undefined) {
        this.config.accept = this.$input.attr('accept');
    }
    // Converting it to an array
    if (this.config.accept !== undefined) {
        this.config.accept = this.config.accept.replace(/ /g, '').split(',');
    }

    this.normaliseConfigSizes();
}

FileValidator.prototype.getConfig = function() {
    return this.config;
};

FileValidator.prototype.hasCollectiveErrors = function() {
    return this.doHaveCollectiveErrors;
};

FileValidator.prototype.normaliseConfigSizes = function() {
    // Adding {} as the default to the size parameter
    // this.config.size = this.config.size || {};

    // Converting possible "min" and "max" parameters inside the "size"
    // parameter to integer bytes.
    if (_.has(this.config, 'size.min') === true) {
        this.config.size.min = this.convertSize(this.config.size.min);
    }

    if (_.has(this.config, 'size.max') === true) {
        this.config.size.max = this.convertSize(this.config.size.max);
    }

    // Converting possible "min" and "max" parameters inside the
    // "collective.size" parameter to integer bytes.
    if (_.has(this.config, 'collective.size.min') === true) {
        this.config.collective.size.min = this.convertSize(this.config.collective.size.min);
    }

    if (_.has(this.config, 'collective.size.max') === true) {
        this.config.collective.size.max = this.convertSize(this.config.collective.size.max);
    }
};

FileValidator.prototype.convertSize = function(size, convertTo) {
    if (convertTo !== undefined) {
        if (typeof size !== 'number') {
            size = parseInt(size);
        }

        if (convertTo === 'Mb' || convertTo === 'M') {
            size = size / 1024 / 1024;
        } else if (convertTo === 'Kb' || convertTo === 'K') {
            size = size / 1024;
        }
    } else {
        if (typeof size !== 'string') {
            size = String(size);
        }

        if (size.indexOf('Mb') !== -1) {
            size = parseInt(size.replace('Mb', '').replace(' ', '')) * 1024 * 1024;
        } else if (size.indexOf('M') !== -1) {
            size = parseInt(size.replace('M', '').replace(' ', '')) * 1024 * 1024;
        } else if (size.indexOf('Kb') !== -1) {
            size = parseInt(size.replace('Kb', '').replace(' ', '')) * 1024;
        } else if (size.indexOf('K') !== -1) {
            size = parseInt(size.replace('K', '').replace(' ', '')) * 1024;
        } else {
            size = parseInt(size);
        }
    }

    return size;
};

FileValidator.prototype.setInputResetOnError = function(inputResetOnError) {
    this.inputResetOnError = inputResetOnError === true;

    return this;
};

FileValidator.prototype.getCollectiveSizeByFiles = function(files) {
    var sum = 0;
    for (var i = 0; i < files.length; i++) {
        sum += files[i].size;
    }

    return sum;
};

FileValidator.prototype.validate = function() {
    var files = this.$input[0].files;

    // Checking for global errors
    var errors = [];

    if (
        _.has(this.config, 'collective.count.max') === true &&
        !this.getIfMaxFileCountIsValid(files, this.config.collective.count.max)
    ) {
        errors.push('collective.too_much_file');
    }

    if (
        _.has(this.config, 'collective.count.min') === true &&
        !this.getIfMinFileCountIsValid(files, this.config.collective.count.min)
    ) {
        errors.push('collective.too_few_file');
    }

    if (
        _.has(this.config, 'collective.size.max') === true &&
        !this.getIfCollectiveMaxFileSizeIsValid(files, this.config.collective.size.max)
    ) {
        errors.push('collective.big_filesize');
    }

    if (
        _.has(this.config, 'collective.size.min') === true &&
        !this.getIfCollectiveMinFileSizeIsValid(files, this.config.collective.size.min)
    ) {
        errors.push('collective.small_filesize');
    }

    this.doHaveCollectiveErrors = errors.length > 0;

    // If no collective errors found, then check every file for errors
    if (errors.length === 0) {
        var errors = [];

        for (var i = 0; i < files.length; i++) {
            var validationResponse = this.validateFile(files[i], this.config);
            if (validationResponse !== true) {
                errors.push([validationResponse, files[i]]);
            }
        }
    }

    if (this.inputResetOnError === true && errors.length > 0) {
        this.$input.val('');
    }

    return errors.length > 0 ? errors : true;
};

FileValidator.prototype.validateFile = function(file, config) {
    var errors = [];

    if (
        _.has(config, 'size.max') === true &&
        !this.getIfMaxFileSizeIsValid(file, config.size.max)
    ) {
        errors.push('big_filesize');
    }

    if (
        _.has(config, 'size.min') === true &&
        !this.getIfMinFileSizeIsValid(file, config.size.min)
    ) {
        errors.push('small_filesize');
    }

    if (
        config.accept !== undefined &&
        !this.getIfFileTypeIsValid(file, config.accept)
    ) {
        errors.push('bad_file_type');
    }

    return errors.length > 0 ? errors : true;
};

FileValidator.prototype.getIfCollectiveMaxFileSizeIsValid = function(files, maxSize) {
    return maxSize >= this.getCollectiveSizeByFiles(files);
};

FileValidator.prototype.getIfCollectiveMinFileSizeIsValid = function(files, minSize) {
    return minSize <= this.getCollectiveSizeByFiles(files);
};

FileValidator.prototype.getIfMaxFileCountIsValid = function(files, maxCount) {
    return files.length <= maxCount;
};

FileValidator.prototype.getIfMinFileCountIsValid = function(files, minCount) {
    return files.length >= minCount;
};

FileValidator.prototype.getIfMaxFileSizeIsValid = function(file, maxSize) {
    return file.size <= maxSize;
};

FileValidator.prototype.getIfMinFileSizeIsValid = function(file, minSize) {
    return file.size >= minSize;
};

// Based on: http://www.w3schools.com/tags/att_input_accept.asp
FileValidator.prototype.getIfFileTypeIsValid = function(file, accept) {
    var acceptLength = accept.length;
    for (var i = acceptLength - 1; i >= 0; i--) {
        if (accept[i].indexOf('/*') !== -1) {
            // "/*" pattern, ex: "image/*"
            var regex = new RegExp(
                accept[i].replace('/*', '\\/.*')
            , 'i');

            if (regex.exec(file.type) !== null) {
                return true;
            }
        } else if (accept[i][0] === '.') {
            // ".ext" pattern, ex: ".png"
            var fileNameArr = file.name.split('.');
            if (('.' + fileNameArr[fileNameArr.length - 1]) === accept[i]) {
                return true;
            }
        } else if (file.type === accept[i]) {
            // media type, ex: "image/png"
            return true;
        }
    }

    return false;
};

module.exports = FileValidator;
