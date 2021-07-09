import 'components/charts/common/charts-common.scss';

import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartLegendTooltip,
  createContainer,
  getInteractiveLegendEvents,
} from '@patternfly/react-charts';
import { Title } from '@patternfly/react-core';
import { default as ChartTheme } from 'components/charts/chartTheme';
import { getCostRangeString } from 'components/charts/common/chartDatumUtils';
import { getDateRange } from 'components/charts/common/chartDatumUtils';
import {
  ChartSeries,
  getChartNames,
  getDomain,
  getLegendData,
  getResizeObserver,
  getTooltipLabel,
  initHiddenSeries,
  isDataAvailable,
  isSeriesHidden,
} from 'components/charts/common/chartUtils';
import { createIntlEnv } from 'components/i18n/localeEnv';
import { getDate } from 'date-fns';
import messages from 'locales/messages';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { noop } from 'utils/noop';

import { chartStyles, styles } from './historicalCostChart.styles';

interface HistoricalCostChartProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  currentCostData?: any;
  currentInfrastructureCostData?: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height: number;
  legendItemsPerRow?: number;
  padding?: any;
  previousCostData?: any;
  previousInfrastructureCostData?: any;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface State {
  cursorVoronoiContainer?: any;
  hiddenSeries: Set<number>;
  series?: ChartSeries[];
  width: number;
}

class HistoricalCostChart extends React.Component<HistoricalCostChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  private observer: any = noop;

  public state: State = {
    hiddenSeries: new Set(),
    width: 0,
  };

  public componentDidMount() {
    this.initDatum();
    this.observer = getResizeObserver(this.containerRef.current, this.handleResize);
  }

  public componentDidUpdate(prevProps: HistoricalCostChartProps) {
    if (
      prevProps.currentCostData !== this.props.currentCostData ||
      prevProps.currentInfrastructureCostData !== this.props.currentInfrastructureCostData ||
      prevProps.previousCostData !== this.props.previousCostData ||
      prevProps.previousInfrastructureCostData !== this.props.previousInfrastructureCostData
    ) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    if (this.observer) {
      this.observer();
    }
  }

  private initDatum = () => {
    const {
      currentCostData,
      currentInfrastructureCostData,
      previousCostData,
      previousInfrastructureCostData,
    } = this.props;

    const costKey = messages.ChartCostLegendLabel;
    const costInfrastructureKey = messages.ChartCostInfrastructureLegendLabel;
    const costInfrastructureTooltipKey = messages.ChartCostInfrastructureLegendTooltip;
    const costTooltipKey = messages.ChartCostLegendTooltip;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    const series: ChartSeries[] = [
      {
        childName: 'previousCost',
        data: previousCostData,
        legendItem: {
          name: getCostRangeString(previousCostData, costKey, true, true, 1),
          symbol: {
            fill: chartStyles.previousColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(previousCostData, costTooltipKey, false, false, 1),
        },
        style: {
          data: {
            ...chartStyles.previousCostData,
            stroke: chartStyles.previousColorScale[0],
          },
        },
      },
      {
        childName: 'currentCost',
        data: currentCostData,
        legendItem: {
          name: getCostRangeString(currentCostData, costKey, true, false),
          symbol: {
            fill: chartStyles.currentColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(currentCostData, costTooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentCostData,
            stroke: chartStyles.currentColorScale[0],
          },
        },
      },
      {
        childName: 'previousInfrastructureCost',
        data: previousInfrastructureCostData,
        legendItem: {
          name: getCostRangeString(previousInfrastructureCostData, costInfrastructureKey, true, true, 1),
          symbol: {
            fill: chartStyles.previousColorScale[1],
            type: 'dash',
          },
          tooltip: getCostRangeString(previousInfrastructureCostData, costInfrastructureTooltipKey, false, false, 1),
        },
        style: {
          data: {
            ...chartStyles.previousInfrastructureCostData,
            stroke: chartStyles.previousColorScale[1],
          },
        },
      },
      {
        childName: 'currentInfrastructureCost',
        data: currentInfrastructureCostData,
        legendItem: {
          name: getCostRangeString(currentInfrastructureCostData, costInfrastructureKey, true, false),
          symbol: {
            fill: chartStyles.currentColorScale[1],
            type: 'dash',
          },
          tooltip: getCostRangeString(currentInfrastructureCostData, costInfrastructureTooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentInfrastructureCostData,
            stroke: chartStyles.currentColorScale[1],
          },
        },
      },
    ];
    const cursorVoronoiContainer = this.getCursorVoronoiContainer();
    this.setState({ cursorVoronoiContainer, series });
  };

  private getChart = (series: ChartSeries, index: number) => {
    const { hiddenSeries } = this.state;
    return (
      <ChartArea
        data={!hiddenSeries.has(index) ? series.data : [{ y: null }]}
        interpolation="monotoneX"
        key={series.childName}
        name={series.childName}
        style={series.style}
      />
    );
  };

  // Returns CursorVoronoiContainer component
  private getCursorVoronoiContainer = () => {
    const { formatDatumValue, formatDatumOptions } = this.props;

    // Note: Container order is important
    const CursorVoronoiContainer: any = createContainer('voronoi', 'cursor');

    return (
      <CursorVoronoiContainer
        cursorDimension="x"
        labels={({ datum }) => getTooltipLabel(datum, formatDatumValue, formatDatumOptions)}
        mouseFollowTooltips
        voronoiDimension="x"
        voronoiPadding={{
          bottom: 120,
          left: 8,
          right: 8,
          top: 8,
        }}
      />
    );
  };

  private getEndDate() {
    const { currentInfrastructureCostData, previousInfrastructureCostData } = this.props;
    const currentRequestDate = currentInfrastructureCostData
      ? getDate(getDateRange(currentInfrastructureCostData, true, true)[1])
      : 0;
    const previousRequestDate = previousInfrastructureCostData
      ? getDate(getDateRange(previousInfrastructureCostData, true, true)[1])
      : 0;

    return currentRequestDate > 0 || previousRequestDate > 0 ? Math.max(currentRequestDate, previousRequestDate) : 31;
  }

  // Returns onMouseOver, onMouseOut, and onClick events for the interactive legend
  private getEvents() {
    const { hiddenSeries, series } = this.state;

    const result = getInteractiveLegendEvents({
      chartNames: getChartNames(series),
      isHidden: index => isSeriesHidden(hiddenSeries, index),
      legendName: 'legend',
      onLegendClick: props => this.handleLegendClick(props.index),
    });
    return result;
  }

  private getLegend = () => {
    const { legendItemsPerRow } = this.props;
    const { hiddenSeries, series, width } = this.state;

    const itemsPerRow = legendItemsPerRow ? legendItemsPerRow : width > 700 ? chartStyles.itemsPerRow : 2;

    return (
      <ChartLegend
        data={getLegendData(series, hiddenSeries)}
        height={25}
        gutter={20}
        itemsPerRow={itemsPerRow}
        name="legend"
      />
    );
  };

  // Hide each data series individually
  private handleLegendClick = (index: number) => {
    const hiddenSeries = initHiddenSeries(this.state.series, this.state.hiddenSeries, index);
    this.setState({ hiddenSeries });
  };

  private handleResize = () => {
    const { width } = this.state;
    const { clientWidth = 0 } = this.containerRef.current || {};

    if (clientWidth !== width) {
      this.setState({ width: clientWidth });
    }
  };

  public render() {
    const {
      adjustContainerHeight,
      height,
      containerHeight = height,
      padding = {
        bottom: 120,
        left: 8,
        right: 8,
        top: 8,
      },
      title,
      xAxisLabel,
      yAxisLabel,
    } = this.props;
    const { cursorVoronoiContainer, hiddenSeries, series, width } = this.state;
    const intl = createIntlEnv();
    const domain = getDomain(series, hiddenSeries);
    const endDate = this.getEndDate();
    const midDate = Math.floor(endDate / 2);

    const adjustedContainerHeight = adjustContainerHeight
      ? width > 700
        ? containerHeight - 25
        : containerHeight
      : containerHeight;

    // Clone original container. See https://issues.redhat.com/browse/COST-762
    const container = cursorVoronoiContainer
      ? React.cloneElement(cursorVoronoiContainer, {
          disable: !isDataAvailable(series, hiddenSeries),
          labelComponent: (
            <ChartLegendTooltip
              legendData={getLegendData(series, hiddenSeries, true)}
              title={datum => intl.formatMessage(messages.ChartDayOfTheMonth, { day: datum.x })}
            />
          ),
        })
      : undefined;

    return (
      <div className="chartOverride" ref={this.containerRef}>
        <Title headingLevel="h2" style={styles.title} size="xl">
          {title}
        </Title>
        <div style={{ ...styles.chart, height: adjustedContainerHeight }}>
          <div style={{ height, width }}>
            <Chart
              containerComponent={container}
              domain={domain}
              events={this.getEvents()}
              height={height}
              legendComponent={this.getLegend()}
              legendData={getLegendData(series, hiddenSeries)}
              legendPosition="bottom"
              padding={padding}
              theme={ChartTheme}
              width={width}
            >
              {series &&
                series.map((s, index) => {
                  return this.getChart(s, index);
                })}
              <ChartAxis label={xAxisLabel} style={chartStyles.xAxis} tickValues={[1, midDate, endDate]} />
              <ChartAxis dependentAxis label={yAxisLabel} style={chartStyles.yAxis} />
            </Chart>
          </div>
        </div>
      </div>
    );
  }
}

export { HistoricalCostChart, HistoricalCostChartProps };
