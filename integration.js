'use strict';
const {
  logging: { setLogger, getLogger },
  errors: { parseErrorToReadableJson }
} = require('polarity-integration-utils');

const { buildIgnoreResults, organizeEntities } = require('./server/dataTransformations');

const { validateOptions } = require('./server/userOptions');
const searchEntities = require('./server/searchEntities');
const assembleLookupResults = require('./server/assembleLookupResults');
const { splitCommaSeparatedUserOption } = require('./server/userOptions/utils');

const doLookup = async (entities, options, cb) => {
  const Logger = getLogger();
  try {
    Logger.debug({ entities }, 'Entities');

    const parsedUserOptions = {
      ...options,
      parsedRepositoryNames: splitCommaSeparatedUserOption('repositoryNames', options)
    };

    const { searchableEntities, nonSearchableEntities } = organizeEntities(entities);

    const { logsForAllRepositories } = await searchEntities(
      searchableEntities,
      parsedUserOptions
    );

    Logger.trace({ logsForAllRepositories });

    const lookupResults = assembleLookupResults(
      entities,
      logsForAllRepositories,
      parsedUserOptions
    );

    const ignoreResults = buildIgnoreResults(nonSearchableEntities);

    Logger.trace({ lookupResults, ignoreResults }, 'Lookup Results');

    cb(null, lookupResults.concat(ignoreResults));
  } catch (error) {
    const err = parseErrorToReadableJson(error);

    Logger.error({ error, formattedError: err }, 'Get Lookup Results Failed');
    cb({ detail: error.message || 'Lookup Failed', err });
  }
};

module.exports = {
  startup: setLogger,
  validateOptions,
  doLookup
};
