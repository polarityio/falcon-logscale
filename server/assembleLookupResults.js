const {
  flow,
  get,
  size,
  eq,
  map,
  some,
  filter,
  uniqWith,
  isEqual,
  flatMap
} = require('lodash/fp');
const { createQueryString } = require('./dataTransformations');

const assembleLookupResults = (entities, logsForAllRepositories, options) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      logsForAllRepositories,
      options
    );

    const resultsFound = some(size, resultsForThisEntity);

    const lookupResult = {
      entity,
      data: resultsFound
        ? {
            summary: createSummaryTags(resultsForThisEntity, options),
            details: resultsForThisEntity
          }
        : null
    };

    return lookupResult;
  }, entities);

const getResultForThisEntity = (entity, results) =>
  flow(
    filter(flow(get('entity.value'), eq(entity.value))),
    flatMap(get('result')),
    uniqWith(isEqual)
  )(results);

const getResultsForThisEntity = (entity, logsForAllRepositories, options) => ({
  logsForAllRepositories: getResultForThisEntity(entity, logsForAllRepositories),
  queryLink: `${
    options.url
  }/humio-organization-usage/search?live=false&query=${encodeURIComponent(
    createQueryString(entity, options)
  )}&start=${options.startOfSearchWindow}`
});

const createSummaryTags = ({ logsForAllRepositories }, options) =>
  [].concat(size(logsForAllRepositories) ? `Logs: ${size(logsForAllRepositories)}` : []);

module.exports = assembleLookupResults;
