const { queryLogsForAllRepositories } = require('./queries');

const searchEntities = async (entities, options) => {
  const logsForAllRepositories = await queryLogsForAllRepositories(entities, options);

  return { logsForAllRepositories };
};

module.exports = searchEntities;
