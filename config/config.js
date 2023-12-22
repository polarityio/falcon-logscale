module.exports = {
  name: 'LogScale',
  acronym: 'LSC',
  description: `LogScale is a log management platform that provides real-time log analysis, search, and visualization.`,
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
      name: 'LogScale URL',
      description:
        'The base URL for the LogScale API including the schema (i.e., https://)',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'repositories',
      name: 'Data Sources',
      description:
        'A comma delimited list of LogScale repositories to query.  The default is all repositories.',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'searchQuery',
      name: 'LogScale Query',
      description: 'The query to run against LogScale.',
      default: '"{{ENTITY}}" | tail(10)',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'searchWindow',
      name: 'Start of Search Window',
      description:
        'With relative time, you specify the start and end time as a relative time such as 1minute or 24hours. LogScale supports this using relative time modifiers. LogScale treats the start and end times as relative times if you specify them as strings. Defaults to 7days',
      default: '7days',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
