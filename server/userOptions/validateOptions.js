const { validateStringOptions, validateUrlOption } = require('./utils');

const validateOptions = async (options, callback) => {
  const stringOptionsErrorMessages = {
    url: '* Required',
    apiToken: '* Required',
    repositoryNames: '* Required',
    searchQuery: '* Required',
    startOfSearchWindow: '* Required'
  };

  const stringValidationErrors = validateStringOptions(
    stringOptionsErrorMessages,
    options
  );

  const urlValidationError = validateUrlOption(options);

  const errors = stringValidationErrors.concat(urlValidationError);

  callback(null, errors);
};

module.exports = validateOptions;
