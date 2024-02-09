const { flow, map, flatMap } = require('lodash/fp');
const { requestsInParallel } = require('../request');
const { createQueryString } = require('../dataTransformations');

const queryLogsForAllRepositories = async (entities, options) =>
  flow(
    flatMap((entity) =>
      map(
        (repositoryName) => ({
          entity,
          method: 'POST',
          route: `repositories/${repositoryName}/query`,
          body: {
            queryString: createQueryString(entity, options),
            start: options.searchWindow,
            end: 'now'
          },
          options
        }),
        options.parsedRepositoryNames
      )
    ),
    async (queryLogsForAllRepositoriesRequests) =>
      await requestsInParallel(queryLogsForAllRepositoriesRequests, 'body')
  )(entities);

module.exports = queryLogsForAllRepositories;
