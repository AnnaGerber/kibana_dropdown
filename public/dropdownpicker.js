// dropdown control for filtering dashboards
import VisSchemasProvider from 'ui/vis/schemas';
define(function (require) {
  require('ui/registry/vis_types').register(DropdownVisProvider);
  require('plugins/kibana_dropdown/dropdownpicker.less');
  require('plugins/kibana_dropdown/dropdownController');
  require('ui-select');
  function DropdownVisProvider(Private) {
    const TemplateVisType = Private(require('ui/template_vis_type/template_vis_type'));
    var Schemas = Private(VisSchemasProvider);

    return new TemplateVisType({
      name: 'dropdownpicker',
      title: 'Dropdown Picker',
      icon: 'fa-caret-square-o-down',
      description: 'In-dashboard dropdown filter widget',
      template: require('plugins/kibana_dropdown/dropdown.html'),
      params: {
        editor: require('plugins/kibana_dropdown/dropdownOptions.html')
      },
      requiresSearch: true,
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'count',
          title: 'Count',
          min: 1,
          max: 1,
          aggFilter: ['avg']
          
        },
        {
          group: 'buckets',
          name: 'dropdownfield',
          title: 'Field to filter on',
          min: 1,
          max: 1,
          aggFilter: '!geohash_grid'
        }
      ])
    });
  }

  return DropdownVisProvider;
});
