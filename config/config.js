module.exports = {
  name: 'Falcon-LogScale',
  acronym: 'LSC',
  description: `Falcon LogScale is a log management platform that provides real-time log analysis, search, and visualization.`,
  entityTypes: ['IPv4', 'IPv6', 'hash', 'email', 'domain', 'cve'],
  styles: ['./styles/styles.less'],
  defaultColor: 'light-blue',
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
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
      name: 'Flacon LogScale URL',
      description:
        'The base URL for the Falcon LogScale API including the schema (i.e., https://)',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'repositories',
      name: 'Repositories',
      description:
        'A comma delimited list of Falcon LogScale repositories with the associated API tokens. This the list of repositories that will be queried in the Falcon LogScale instance. The list is a string in this format: repository_1:token,repository_2:token.',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'searchQuery',
      name: 'LogScale Query',
      description:
        'The query string that will be used to get log data from across the repositories that were entered in the "Repositories" user option. The defaul is: "{{ENTITY}}" | tail(10), this will return the 10 latest logs.',
      default: '"{{ENTITY}}" | tail(10)',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'searchWindow',
      name: 'Start of Search Window',
      description: 'Earliest time to search for logs. This option defaults to 7 days.',
      default: '7days',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
