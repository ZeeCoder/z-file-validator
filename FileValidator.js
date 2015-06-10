var dom_config = require('z-dom-config');

function FileValidator($input, dataAttrName, callback) {
    var self = this;

    // Config setup
    this.config = dom_config.load($input, dataAttrName)
    if ($input.attr('accept') !== undefined) {
        this.config.accept = $input.attr('accept');
    }
    this.config.accept = this.config.accept.replace(' ', '').split(',');


    if (this.config.max_size !== undefined) {
        if (this.config.max_size.indexOf('Mb') !== -1) {
            this.config.max_size = parseInt(this.config.max_size.replace('Mb', '').replace(' ', '')) * 1024 * 1024;
        } else if (this.config.max_size.indexOf('Kb') !== -1) {
            this.config.max_size = parseInt(this.config.max_size.replace('Kb', '').replace(' ', '')) * 1024;
        } else {
            this.config.max_size = parseInt(this.config.max_size);
        }
    }

    $input.change(function() {
        var validationCode = 'no_file_selected';
        if ($(this).val() !== '') {
            validationCode = self.validate(this.files[0]);
        }

        callback.apply($input[0], [validationCode, $input[0].files[0], self.config]);

        if (validationCode !== true) {
            $(this).val('');
        }
    });
}

FileValidator.prototype.validate = function(file) {
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
            return 'bad_extension';
        }
    }

    if (
        this.config.max_size !== undefined &&
        file.size > this.config.max_size
    ) {
        return 'big_filesize';
    }

    return true;
};

module.exports = FileValidator;
