require('ui-select');
import { FilterBarQueryFilterProvider } from 'ui/filter_bar/query_filter';

define(function (require) {
  const module = require('ui/modules').get('kibana/kibana_dropdown', ['ui.select']);
  module.controller('KbnDropdownVisController', function ($scope, $rootScope, Private) {
    const queryFilter = Private(FilterBarQueryFilterProvider);
    $rootScope.plugin = {
      dropdownPlugin: {}
    };
    $scope.dropdownValues = [];
    $scope.dropdown = { selected: [] };
    $scope.disabled = false;
    $scope.config = {
      title: 'Dropdown'
    };

    const findFilter = function () {
      const filters = queryFilter.getFilters();
      const fieldParam = $scope.vis.aggs.bySchemaName.dropdownfield[0].params.field;
      const matchingFilter = filters.find(function (f) {
        return f.meta.field === fieldParam.$$spec.name;
      });
      return matchingFilter;
    };

/*    $scope.onOpenClose = function(isOpenClose) {
      if (isOpenClose) {
        var matchingFilter = findFilter()
        if (matchingFilter) {
          queryFilter.removeFilter(matchingFilter)
        }
      } else if (this.$select.selected) {
        $scope.filter(this.$select.selected.key || this.$select.selected)
      }
    }*/
    $scope.filter = function (val) {
      console.log('filtering on ', val);
      if (val) {
        const fieldParam = $scope.vis.aggs.bySchemaName.dropdownfield[0].params.field;
        const visFilter = {
          meta: {
            negate: false,
            field: fieldParam.name,
            index: $scope.vis.indexPattern.title
          },
          query: {
            query_string: {
            }
          }
        };
        visFilter.query.query_string.default_field = fieldParam.name;
        visFilter.query.query_string.query = $scope.prepareQueryString(val);
        queryFilter.addFilters(visFilter);
      }
    };
    $scope.onClose = function (isOpen) {
      if(!isOpen) {
        $scope.onSelect();
      }
    };
    $scope.onSelect = function () {
      const matchingFilter = findFilter();
      if(matchingFilter) {
        queryFilter.removeFilter(matchingFilter);
      }
      const selected = $scope.dropdown.selected;
      if(selected && selected.length > 0) {
        $scope.filter(selected || this.$item);
      }
    };
    $scope.onRemove = function () {
      $scope.onSelect();
    };
    $scope.prepareQueryString = function (val) {
      if(!Array.isArray(val)) {
        val = [val];
      }
      let query = '"';
      val.forEach(function (item) {
        query += item.key + '" OR "';
      });
      return query.slice(0, -5);
    };

    $scope.disableEditsTrigger = function () {
      if($scope.vis.params.disableEdits) {
        const filterValueArray = $scope.vis.params.defaultFilters.split(',');
        $scope.dropdown.selected = [];
        let FLAG = false;
        if(filterValueArray) {
          filterValueArray.forEach(function (value) {
            value = value.trim();
            if(value !== '') {
              FLAG = true;
              $scope.dropdown.selected.push({ key: value.trim() });
            }
          });
        }
        if(FLAG) {
          $scope.onSelect();
        }
      }
    };

    $scope.$watch('vis.params.disableEdits', function () {
      $scope.disableEditsTrigger();
    });

    $scope.$watch('vis.params.defaultFilters', function () {
      $scope.disableEditsTrigger();
    });

    $scope.$watch('vis.params.title', function (title) {
      $scope.config.title = title;
    });
/*    var findInDropdown = function (d) {
        return $scope.dropdown.selected ? $scope.dropdown.selected.every(function(element){
          if(d.key === element.key){
            return true;
          }
        }) || false : false;
    }*/

    const fillDocCount = function (dropdownValues) {
      dropdownValues.forEach(function (element) {
        for(let i = 0; i < $scope.dropdown.selected.length; i++) {
          if(element.key === $scope.dropdown.selected[i].key) {
            $scope.dropdown.selected[i].doc_count = element.doc_count;
            return;
          }
        }
      });
    };

/*    var otherValuesExist = function (d) {
        for(var i =0; i < $scope.dropdown.selected.length; i++){
          if(d.key === $scope.dropdown.selected[i].key){
            return false;
          }
        }
        return true;
    }*/
    $scope.$watch('esResponse', function (resp) {
      if (resp && resp.aggregations) {
        $scope.dropdownValues = Object.values(resp.aggregations[1].buckets).map(function (a) {
          if($scope.dropdown.selected.indexOf(a) < 0) {
            return a;
          }
        });
        if($scope.vis.params.disableEdits) {
          fillDocCount($scope.dropdownValues);
        }
        const matchingFilter = findFilter();
        // if there is no matching filter, add one
        if (!matchingFilter) {
          if($scope.dropdown.selected !== null ||
            $scope.dropdown.selected !== undefined ||
            $scope.dropdown.selected.length !== 0) {
            if($scope.vis.params.disableEdits) {
              $scope.onSelect();
            } else {
              $scope.dropdown.selected = [];
            }
          }
        }
        // if there is a matching filter make sure it matches the selection
/*        if (matchingFilter) {
          $scope.dropdown.selected = matchingFilter.meta.value;
        }*/
        // the selected thing might not be in the dropdownValues anymore
        // select the first thing in the list if nothing else is selected
/*        var otherValues = $scope.dropdownValues.find(otherValuesExist);
        if($scope.vis.params.disableEdits && !!otherValues) {
          $scope.filter($scope.dropdown.selected);
          return;
        }*/
/*        if (!$scope.vis.params.allowBlank) {
          if(($scope.dropdown.selected === undefined) ||
              $scope.dropdown.selected === null) {
            if ($scope.dropdownValues[0]) {
              $scope.dropdown.selected = $scope.dropdownValues[0];
              $scope.filter($scope.dropdown.selected);
            }
          }
        } */
      }
    });
  });
});
