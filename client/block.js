polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  logsForAllRepositories: Ember.computed.alias('details.logsForAllRepositories'),
  queryLink: Ember.computed.alias('details.queryLink'),
  readableJson: {},
  init() {
    this.makeJsonReadable();
    this._super(...arguments);
    this.get('logsForAllRepositories').forEach((log, index) => {
      this.set(`logsForAllRepositories.${index}.__activeTab`, 'showFields');
    });
  },
  actions: {
    changeTab: function (tabName, index) {
      this.set(`logsForAllRepositories.${index}.__activeTab`, tabName);
    }
  },
  makeJsonReadable: function () {
    const results = this.get('logsForAllRepositories');
    results.forEach((result, index) => {
      this.set(
        'readableJson.' + index,
        this.syntaxHighlight(JSON.stringify(result, null, 4))
      );
    });
  },
  syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      }
    );
  }
});
