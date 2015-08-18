# z-file-validator
[![Build Status](https://travis-ci.org/ZeeCoder/z-file-validator.svg?branch=master)](https://travis-ci.org/ZeeCoder/z-file-validator)
[![npm version](https://badge.fury.io/js/z-file-validator.svg)](http://badge.fury.io/js/z-file-validator)

This module was written to handle client-side file input validation, using the
File API.

**Notes:**

 - the plugin itself doesn't check for [File API support](http://caniuse.com/#feat=fileapi),
so the examples will assume that you have something under your belt to handle
that. (Like [Modernizr](http://modernizr.com).)
 - Although I use jQuery in the examples for convenience, the module itself does
 not depend on jQuery!

Since this is a CommonJS module, it must be used alongside with [Browserify](http://browserify.org/), or
something similar, like [WebPacker](http://webpack.github.io/).

## Example, explanation
```html
<!--
    For convenience, sizes can be given as byte integers, or as numbers suffixed
    with one of the following: "Mb", "M", "Kb", "K".
    (Separating the numbers and the suffixes is also allowed, so "1024 K" will
    work just fine.)
    After the module loads the configuration, these will automatically be
    converted to byte integers. (In the example below, "5M" will be converted
    to 5242880)
-->
<!--
    Providing the configuration through a data-* attribute is optional.
    (Explained later in detail.)
-->
<input type="file" id="input" data-configuration='{
    "collective": {
        "size": {
            "min": "1M",
            "max": "20M"
        },
        "count": {
            "min": 1,
            "max": 3
        }
    },
    "size": {
        "min": "1024K",
        "max": "4M"
    }
}' accept="image/*" multiple>

<!--
    Exmplanation for the configuration options:
        - collective: These validations are running considering all the
            selected files.
        - "size" and "accept": These validations run for each selected file
            individually.
        - the "accept" attribute: this could also be provided by the JSON
            configuration, but as an attribute, most browsers will render the
            browsing window so that the selectable files are already filtered.
            Still, it can be used for testing purposes.
-->
```

```js
var FileValidator = require('z-file-validator');

// Suppose we have Modernizr
if (Modernizr.filereader) {
    // Saving the jQuery object for later use.
    var $input = $('#input');

    // Initializing a FileValidator for the input
    // It also accepts HTMLElement objects, providing a jQuery object here  is
    // optional.
    var validator = new FileValidator($input, 'configuration');
    // Where
    // $input          - The DOM input element selected by jQuery.
    // 'configuration' - The data- attribute's name. Now it expects a
    //                   `data-configuration` attribute to contain a valid
    //                   JSON configuration.
    //                   This could also be an object instead, in which case
    //                   there's no need for the data-* attribute.

    // By default, if the `validator.validate()` returns an error, the validator
    // also resets the file input. If you want to keep the selected value
    // regardless of the validation result, then just use the following:
    // `validator.setInputResetOnError(false);`
    // before running the validation.

    // Validate the input on change
    $input.on('change', function() {
        var validationResponse = validator.validate();

        // If you need the loaded configuration to have more sensible error
        // messages, you can just use the following:
        var usedConfig = validator.getConfig();

        if (validationResponse === true) {
            // No problems were detected :thumbsup:
        } else {
            // An error occured, which can be a collective error, or a specific
            // problem with one - or some - of the files.
            if (validator.hasCollectiveErrors() === true) {
                // In this case, `validationResponse` is an array of error code
                // strings.
                // Ex: `["collective.big_filesize", "collective.too_much_file"]`
            } else {
                // In this case, `validationResponse` is an array of arrays,
                // where each contains 2 elements: an array of error codes,
                // and the file data which was fetched from the FileApi.
                // Ex:
                // `[
                //     [
                //         ["big_filesize"],
                //         File
                //     ],
                //     [
                //         ["small_filesize", "bad_type"],
                //         File
                //     ]
                // ]`
            }
        }
    });
}
```

## Validation error codes

### Collective
 - "collective.big_filesize"
 - "collective.small_filesize"
 - "collective.too_few_file"
 - "collective.too_much_file"

### Individual
 - "big_filesize"
 - "small_filesize"
 - "bad_file_type"

## Advanced usage

Most of the FileValidator methods can be used individually, if needed.

For example: with the `validateFile` method, it's possible to validate only a
specific File:

```js
var FileValidator = require('z-file-validator');

var validationResponse = FileValidator.prototype.validateFile(
    $('#input')[0].files[1], // Validating only the second selected file
    {size: {max: '5M'}} // It should be no bigger than 5M
);

console.log(validationResponse);
// -> ["big_filesize"] or
// -> true
```

## License
[MIT](LICENSE)
