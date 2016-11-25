const PLUGIN_NAME = 'kibana_dropdown';


export default function (kibana) {
  return new kibana.Plugin({
    uiExports: {
      visTypes: ['plugins/kibana_dropdown/dropdownpicker']
    }
  });
};
