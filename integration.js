'use strict';

const { map } = require('lodash/fp');
const { setLogger, getLogger } = require('./src/logger');
const { parseErrorToReadableJSON } = require('./src/errors');
const { PolarityResult } = require('./src/create-result-object');
const { polarityRequest } = require('./src/polarity-request');

let Logger = null;

const startup = (logger) => {
  Logger = logger;
  setLogger(Logger);
};

async function doLookup(entities, options, cb) {
  const Logger = getLogger();
  setRequestOptions(options);

  try {
    const repositories = options.repositories.split(',');
    const processedOptions = processRepositories(repositories);
    const entitiesWithOpts = entities.map((entity) => ({
      entity,
      requestOptions: processedOptions
    }));
    const responses = await searchLogs(entitiesWithOpts);

    const lookupResults = map(processLookupResults, responses);
    Logger.trace({ lookupResults }, 'lookupResults');
    return cb(null, lookupResults);
  } catch (err) {
    const error = parseErrorToReadableJSON(err);
    Logger.error(err);
    return cb(error);
  }
}

function setRequestOptions(options) {
  polarityRequest.setOptions(options);
  polarityRequest.setHeader('content-type', 'application/json');
}

function processRepositories(repositories) {
  return repositories.map((item) => {
    const [repository, token] = item.split(':');
    return { repository, token };
  });
}

function processLookupResults(results) {
  return results[0].results.length <= 0
    ? new PolarityResult().createNoResultsObject(results[0].entity)
    : new PolarityResult().createResultsObject(results);
}

async function searchLogs(entitiesWithOpts) {
  try {
    return await Promise.all(entitiesWithOpts.map(processSingleEntity));
  } catch (err) {
    Logger.error({ err }, 'Error running query');
    throw err;
  }
}

async function processSingleEntity(singleEntityWithRequestOptions) {
  const { requestOptions, entity } = singleEntityWithRequestOptions;
  return Promise.all(requestOptions.map((opts) => sendEntityRequest(entity, opts)));
}

async function sendEntityRequest(entity, opts) {
  const { token, repository } = opts;
  setAuthorizationHeader(token);

  const searchQuery = polarityRequest.options.searchQuery.replace(
    /{{ENTITY}}/gi,
    entity.value
  );

  try {
    const response = await polarityRequest.send({
      method: 'POST',
      url: `${polarityRequest.options.url}/api/v1/repositories/${repository}/query`,
      body: {
        queryString: searchQuery,
        start: polarityRequest.options.searchWindow,
        end: 'now'
      }
    });

    const data = response[0].result.body;
    return { entity, results: data };
  } catch (err) {
    Logger.error({ err }, 'Error in sendEntityRequest');
    throw err;
  }
}

function setAuthorizationHeader(token) {
  polarityRequest.setHeader('Authorization', `Bearer ${token}`);
}

function validateOptions(userOptions, cb) {
  const errors = [];

  if (typeof userOptions.url.value === 'string') {
    userOptions.url.value = userOptions.url.value.replace(/\/+$/, '');
  }

  if (
    typeof userOptions.url.value !== 'string' ||
    (typeof userOptions.url.value === 'string' && userOptions.url.value.length === 0)
  ) {
    errors.push({ key: 'url', message: 'You must provide a valid URL' });
  }

  if (
    typeof userOptions.repositories.value !== 'string' ||
    (typeof userOptions.repositories.value === 'string' &&
      userOptions.repositories.value.length === 0)
  ) {
    errors.push({
      key: 'repositories',
      message: 'You must provide at least one repository with its associated token'
    });
  }

  return cb(null, errors);
}

module.exports = {
  startup,
  doLookup,
  validateOptions
};
