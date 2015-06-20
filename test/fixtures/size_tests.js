var FileValidator = require('../../FileValidator');
var expect        = require('chai').expect;

module.exports = function() {
    describe('size conversion tests', function() {
        it('should convert strings suffixed with "M" to bytes', function() {
            var validator;
            validator = new FileValidator(this.$input, {
                collective: {
                    size: {
                        min: '1M',
                        max: '2M'
                    }
                },
                size: {
                    min: '1M',
                    max: '2M'
                }
            });

            expect(validator.getConfig()).to.deep.equal({
                collective: {
                    size: {
                        min: 1024 * 1024,
                        max: 1024 * 1024 * 2
                    }
                },
                size: {
                    min: 1024 * 1024,
                    max: 1024 * 1024 * 2
                }
            });
        });

        it('should convert strings suffixed with "Mb" to bytes', function() {
            var validator;
            validator = new FileValidator(this.$input, {
                collective: {
                    size: {
                        min: '1Mb',
                        max: '2Mb'
                    }
                },
                size: {
                    min: '1Mb',
                    max: '2Mb'
                }
            });

            expect(validator.getConfig()).to.deep.equal({
                collective: {
                    size: {
                        min: 1024 * 1024,
                        max: 1024 * 1024 * 2
                    }
                },
                size: {
                    min: 1024 * 1024,
                    max: 1024 * 1024 * 2
                }
            });
        });

        it('should convert strings suffixed with "K" to bytes', function() {
            var validator;
            validator = new FileValidator(this.$input, {
                collective: {
                    size: {
                        min: '1024K',
                        max: '2048K'
                    }
                },
                size: {
                    min: '1024K',
                    max: '2048K'
                }
            });

            expect(validator.getConfig()).to.deep.equal({
                collective: {
                    size: {
                        min: 1024 * 1024,
                        max: 1024 * 1024 * 2
                    }
                },
                size: {
                    min: 1024 * 1024,
                    max: 1024 * 1024 * 2
                }
            });
        });

        it('should convert strings suffixed with "Kb" to bytes', function() {
            var validator;
            validator = new FileValidator(this.$input, {
                collective: {
                    size: {
                        min: '1024Kb',
                        max: '2048Kb'
                    }
                },
                size: {
                    min: '1024Kb',
                    max: '2048Kb'
                }
            });

            expect(validator.getConfig()).to.deep.equal({
                collective: {
                    size: {
                        min: 1024 * 1024,
                        max: 1024 * 1024 * 2
                    }
                },
                size: {
                    min: 1024 * 1024,
                    max: 1024 * 1024 * 2
                }
            });
        });

        it('should leave integers assuming they represent bytes already', function() {
            var validator;
            validator = new FileValidator(this.$input, {
                collective: {
                    size: {
                        min: 1024 * 1024,
                        max: 1024 * 1024 * 2
                    }
                },
                size: {
                    min: 1024 * 1024,
                    max: 1024 * 1024 * 2
                }
            });

            expect(validator.getConfig()).to.deep.equal({
                collective: {
                    size: {
                        min: 1024 * 1024,
                        max: 1024 * 1024 * 2
                    }
                },
                size: {
                    min: 1024 * 1024,
                    max: 1024 * 1024 * 2
                }
            });
        });

        it('should convert properly, even if the number and suffix are separated by space', function() {
            var validator;
            validator = new FileValidator(this.$input, {
                size: {
                    min: '1 Mb',
                    max: '2048 Kb'
                }
            });

            expect(validator.getConfig()).to.deep.equal({
                size: {
                    min: 1024 * 1024,
                    max: 1024 * 1024 * 2
                }
            });
        });
    });
};
