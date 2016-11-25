# kibana_dropdown

Dropdown widget for Kibana dashboards.

Useful for embedded dashboards to provide basic filtering on specific fields.

![Dropdown](dropdown.png?raw=true "Dropdown Dashboard Widget")


To use this widget with analysed fields, create a keyword mapping e.g:

"speaker_name":{
  "type":"text",
  "fields": {
    "keyword": {
      "type":"keyword","ignore_above":256
    }
  }
}

To set up the dropdown widget, create a Visualisation of type 'Dropdown Picker'

![Configure Dropdown Picker](dropdownconfigure.png?raw=true "Configure Dropdown Picker")

In the visualisation options, you can set whether the dropdown is allowed to be blank. If this is true, you can hit escape while the dropdown is open to close it without selecting a value.

---

## development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment.