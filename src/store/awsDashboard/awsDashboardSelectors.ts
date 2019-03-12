import { RootState } from 'store/rootReducer';
import {
  awsDashboardDefaultFilters,
  awsDashboardStateKey,
  awsDashboardTabFilters,
  getQueryForWidget,
} from './awsDashboardCommon';

export const selectAwsDashboardState = (state: RootState) =>
  state[awsDashboardStateKey];

export const selectWidgets = (state: RootState) =>
  selectAwsDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectAwsDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...awsDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...awsDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };

  return {
    previous: getQueryForWidget(widget, {
      ...filter,
      time_scope_value: -2,
    }),
    current: getQueryForWidget(widget, filter),
    tabs: getQueryForWidget(widget, {
      ...tabsFilter,
      resolution: 'monthly',
    }),
  };
};
