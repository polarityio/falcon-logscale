const { getLogger } = require('./logger');

class PolarityResult {
  createEmptyBlock(entity) {
    return {
      entity: entity,
      data: {
        summary: [],
        details: []
      }
    };
  }

  createResultsObject(apiResponse) {
    return {
      entity: apiResponse[0].entity,
      data: {
        summary: createSummary(apiResponse[0]),
        details: apiResponse[0]
      }
    };
  }

  createNoResultsObject(entity) {
    return {
      entity,
      data: null
    };
  }
}

function createSummary(apiResponse) {
  const tags = [];
  tags.push(`Logs: ${apiResponse.results.length}`);
  return tags;
}

module.exports = { PolarityResult };
