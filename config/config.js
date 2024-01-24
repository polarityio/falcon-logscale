module.exports = {
  name: 'Falcon-LogScale',
  acronym: 'FLS',
  description:
    'Falcon LogScale is a log management platform that provides real-time log analysis, search, and visualization.',
  entityTypes: ['*'],
  defaultColor: 'light-blue',
  styles: ['./client/styles.less'],
  block: {
    component: {
      file: './client/block.js'
    },
    template: {
      file: './client/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: ''
  },
  logging: {
    level: 'info'
  },
  options: [
    {
      key: 'url',
      name: 'Falcon LogScale URL',
      description:
        'The base URL for the Falcon LogScale Instance including the schema (i.e., https://)',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'apiToken',
      name: 'Personal API Token',
      description:
        'Your Personal API Token.  Profile Icon -> Manage your account -> Personal API token',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'repositoryNames',
      name: 'Repository Names',
      description:
        'A comma delimited list of Falcon LogScale repositories you want to search. To view your repositories click the Falcon Icon in the upper left of the dashboard.',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'searchQuery',
      name: 'LogScale Query',
      description:
        'The query string that will be used to get log data from across the repositories that were entered in the \'Repositories\' user option. The default is: "{{ENTITY}}" | tail(10), this will return the 10 latest logs.',
      default: '"{{ENTITY}}" | tail(10)',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'startOfSearchWindow',
      name: 'Start of Search Window',
      description:
        'How far back you wish to return logs from. #years, #months, #days, or #hours. This option defaults to `7days`.',
      default: '7days',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};

