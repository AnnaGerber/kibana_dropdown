// dropdown control for filtering dashboards
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import { VisSchemasProvider } from 'ui/vis/editors/default/schemas';
//import { TemplateVisTypeProvider } from 'ui/template_vis_type/template_vis_type';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { CATEGORY } from 'ui/vis/vis_category';

VisTypesRegistryProvider.register(DropdownVisProvider);
require('plugins/kibana_dropdown/dropdownpicker.less');
require('plugins/kibana_dropdown/dropdownController');
require('ui-select');
function DropdownVisProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);
  const Schemas = Private(VisSchemasProvider);

  return VisFactory.createAngularVisualization({
    name: 'dropdownpicker',
    type: 'dropdownpicker',
    title: 'Dropdown Picker',
    icon: 'fa-caret-square-o-down',
    category: CATEGORY.OTHER,
    description: 'In-dashboard dropdown filter widget',
    visConfig: {
      template: require('plugins/kibana_dropdown/dropdown.html'),
    },
    editorConfig: {
      optionsTemplate: require('plugins/kibana_dropdown/dropdownOptions.html'),
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
    },
    responseHandler: 'none'
  });
}

export default DropdownVisProvider;