# z-file-validator
[![npm version](https://badge.fury.io/js/z-file-validator.svg)](http://badge.fury.io/js/z-file-validator)

This module does a little bit of validation on a file input using the File Api.

(It only works well with a single file.)

**Note:** the plugin itself doesn't check for [File API support](http://caniuse.com/#feat=fileapi),
so the examples will assume that Modernizr is available for such a task.

Since this is a CommonJS module, it must be used alongside with [Browserify](http://browserify.org/), or
something similar, like [WebPacker](http://webpack.github.io/).

## Example, explanation
```html
<!--
    For convenience, "max_size" can be given in numbers (bytes) or numbers
    suffixed with either "Kb" or "Mb".
-->
<input type="file" class="js-file-validator" data-js-file-validator='{
    "max_size": "5Mb"
}' accept="image/*">
<div class="js-file-validator__label">
    <!-- This element will be used to report what the validator returned. -->
<div>

<!--
    "accept" could be provided by the JSON configuration, but as an attribute,
    most browsers will render the browsing window so that the selectable files
    are already filtered.
    Still, the following can be used for testing purposes.
-->
<input type="file" class="js-file-validator" data-js-file-validator='{
    "max_size": "5Mb",
    "accept": "image/*"
}'>
<div class="js-file-validator__label">
    <!-- This element will be used to report what the validator returned. -->
<div>
```

```js
var FileValidator = require('z-file-validator');

// Suppose we have Modernizr
if (Modernizr.filereader) {
    // Create a new object for every file input element
    $('.js-file-validator').each(function() {
        new FileValidator($(this), 'js-file-validator', function(validationCode, file, config) {
            // Doing something based on the arguments, where
            //     - "validationCode" is one of the error codes listed a bit later,
            //     - "file" is the file object the validator got from the checked input element,
            //     - "config" is the configuration parsed from the `data-*` attribute.

            // With all this information, any kind of (translated) error message
            // could be placed in it's proper place, like: "The max filesize is 5Mb!"

            // A simple example would be:

            if (validationCode === true) {
                // The input file is valid, so let's show the file's name in the label element
                validationCode = file.name;
            }

            // Selects "js-file-validator__label"
            // If this is an error code, then it could be easily replaced with a
            // proper message
            $(this).next().text(validationCode);
        });
    });
}
```

## Validation error codes
 - big_filesize - based on the "max_size" configuration,
 - bad_extension - based on the "accept" configuration,
 - no_file_selected - If a file was selected before, but after another browsing the user hits `esc`, then this error code will be returned.

## Testing
Tests are in a work-in-progress state.

## License
[MIT](LICENSE)
