const {
  requests: { createRequestWithDefaults },
  logging: { getLogger }
} = require('polarity-integration-utils');

const { parallelLimit } = require('async');
const { map, get, getOr, filter, flow, negate, isEmpty } = require('lodash/fp');

const requestWithDefaults = createRequestWithDefaults({
  config: require('../config/config'),
  roundedSuccessStatusCodes: [200],
  requestOptionsToOmitFromLogsKeyPaths: ['Authorization', 'options'],
  preprocessRequestOptions: ({ options, route, ...requestOptions }) => ({
    ...requestOptions,
    options,
    url: `${options.url}/api/v1/${route}`,
    headers: {
      ...requestOptions.headers,
      Authorization: `Bearer ${options.apiToken}`
    },
    json: true
  })
});

const createRequestsInParallel =
  (requestWithDefaults) =>
  async (
    requestsOptions,
    responseGetPath,
    limit = 10,
    onlyReturnPopulatedResults = true
  ) => {
    const unexecutedRequestFunctions = map(
      ({ entity, ...requestOptions }) =>
        async () => {
          const response = await requestWithDefaults(requestOptions);
          const result = responseGetPath ? get(responseGetPath, response) : response;
          return entity ? { entity, result } : result;
        },
      requestsOptions
    );

    const results = await parallelLimit(unexecutedRequestFunctions, limit);

    return onlyReturnPopulatedResults
      ? filter(
          flow((result) => getOr(result, 'result', result), negate(isEmpty)),
          results
        )
      : results;
  };

const requestsInParallel = createRequestsInParallel(requestWithDefaults);

module.exports = {
  requestWithDefaults,
  requestsInParallel
};
