import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { WrappedComponentProps } from 'react-intl';

type DashboardOwnProps = WrappedComponentProps;

interface DashboardStateProps {
  DashboardWidget: any;
  widgets: number[];
}

interface DashboardDispatchProps {
  selectWidgets?: () => void;
}

type DashboardProps = DashboardOwnProps &
  DashboardStateProps &
  DashboardDispatchProps;

const DashboardBase: React.SFC<DashboardProps> = ({
  DashboardWidget,
  selectWidgets,
  widgets,
}) => (
  <div>
    <Grid gutter="md">
      {widgets.map(widgetId => {
        const widget = selectWidgets[widgetId];
        return Boolean(widget.details.showHorizontal) ? (
          <GridItem sm={12} key={widgetId}>
            <DashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <DashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

export { DashboardBase };
