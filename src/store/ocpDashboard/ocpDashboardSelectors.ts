import { RootState } from 'store/rootReducer';
import {
  getQueryForWidget,
  ocpDashboardDefaultFilters,
  ocpDashboardStateKey,
  ocpDashboardTabFilters,
} from './ocpDashboardCommon';

export const selectOcpDashboardState = (state: RootState) =>
  state[ocpDashboardStateKey];

export const selectWidgets = (state: RootState) =>
  selectOcpDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectOcpDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...ocpDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ocpDashboardTabFilters,
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
