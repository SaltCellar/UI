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
import { getDateRange } from 'components/charts/common/chartDatumUtils';
import { getUsageRangeString } from 'components/charts/common/chartDatumUtils';
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

import { chartStyles, styles } from './historicalUsageChart.styles';

interface HistoricalUsageChartProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  currentLimitData?: any;
  currentRequestData?: any;
  currentUsageData: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height: number;
  legendItemsPerRow?: number;
  padding?: any;
  previousLimitData?: any;
  previousRequestData?: any;
  previousUsageData?: any;
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

class HistoricalUsageChart extends React.Component<HistoricalUsageChartProps, State> {
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

  public componentDidUpdate(prevProps: HistoricalUsageChartProps) {
    if (
      prevProps.currentLimitData !== this.props.currentLimitData ||
      prevProps.currentRequestData !== this.props.currentRequestData ||
      prevProps.currentUsageData !== this.props.currentUsageData ||
      prevProps.previousLimitData !== this.props.previousLimitData ||
      prevProps.previousRequestData !== this.props.previousRequestData ||
      prevProps.previousUsageData !== this.props.previousUsageData
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
      currentLimitData,
      currentRequestData,
      currentUsageData,
      previousLimitData,
      previousRequestData,
      previousUsageData,
    } = this.props;

    const limitKey = messages.ChartLimitLegendLabel;
    const limitTooltipKey = messages.ChartLimitLegendTooltip;
    const requestKey = messages.ChartRequestsLegendLabel;
    const requestTooltipKey = messages.ChartRequestsLegendTooltip;
    const usageKey = messages.ChartUsageLegendlabel;
    const usageTooltipKey = messages.ChartUsageLegendTooltip;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    const series: ChartSeries[] = [
      {
        childName: 'previousUsage',
        data: previousUsageData,
        legendItem: {
          name: getUsageRangeString(previousUsageData, usageKey, true, true, 1),
          symbol: {
            fill: chartStyles.previousColorScale[0],
            type: 'minus',
          },
          tooltip: getUsageRangeString(previousUsageData, usageTooltipKey, false, false, 1),
        },
        style: {
          data: {
            ...chartStyles.previousUsageData,
            stroke: chartStyles.previousColorScale[0],
          },
        },
      },
      {
        childName: 'currentUsage',
        data: currentUsageData,
        legendItem: {
          name: getUsageRangeString(currentUsageData, usageKey, true, false),
          symbol: {
            fill: chartStyles.currentColorScale[0],
            type: 'minus',
          },
          tooltip: getUsageRangeString(currentUsageData, usageTooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentUsageData,
            stroke: chartStyles.currentColorScale[0],
          },
        },
      },
      {
        childName: 'previousRequest',
        data: previousRequestData,
        legendItem: {
          name: getUsageRangeString(previousRequestData, requestKey, true, true, 1),
          symbol: {
            fill: chartStyles.previousColorScale[1],
            type: 'dash',
          },
          tooltip: getUsageRangeString(previousRequestData, requestTooltipKey, false, false, 1),
        },
        style: {
          data: {
            ...chartStyles.previousRequestData,
            stroke: chartStyles.previousColorScale[1],
          },
        },
      },
      {
        childName: 'currentRequest',
        data: currentRequestData,
        legendItem: {
          name: getUsageRangeString(currentRequestData, requestKey, true, false),
          symbol: {
            fill: chartStyles.currentColorScale[1],
            type: 'dash',
          },
          tooltip: getUsageRangeString(currentRequestData, requestTooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentRequestData,
            stroke: chartStyles.currentColorScale[1],
          },
        },
      },
      {
        childName: 'previousLimit',
        data: previousLimitData,
        legendItem: {
          name: getUsageRangeString(previousLimitData, limitKey, true, true, 1),
          symbol: {
            fill: chartStyles.previousColorScale[2],
            type: 'minus',
          },
          tooltip: getUsageRangeString(previousLimitData, limitTooltipKey, false, false, 1),
        },
        style: {
          data: {
            ...chartStyles.previousLimitData,
            stroke: chartStyles.previousColorScale[2],
          },
        },
      },
      {
        childName: 'currentLimit',
        data: currentLimitData,
        legendItem: {
          name: getUsageRangeString(currentLimitData, limitKey, true, false),
          symbol: {
            fill: chartStyles.currentColorScale[2],
            type: 'minus',
          },
          tooltip: getUsageRangeString(currentLimitData, limitTooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentLimitData,
            stroke: chartStyles.currentColorScale[2],
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
          bottom: 130,
          left: 8,
          right: 8,
          top: 8,
        }}
      />
    );
  };

  private getEndDate() {
    const { currentRequestData, currentUsageData, previousRequestData, previousUsageData } = this.props;
    const currentRequestDate = currentRequestData ? getDate(getDateRange(currentRequestData, true, true)[1]) : 0;
    const currentUsageDate = currentUsageData ? getDate(getDateRange(currentUsageData, true, true)[1]) : 0;
    const previousRequestDate = previousRequestData ? getDate(getDateRange(previousRequestData, true, true)[1]) : 0;
    const previousUsageDate = previousUsageData ? getDate(getDateRange(previousUsageData, true, true)[1]) : 0;

    return currentRequestDate > 0 || currentUsageDate > 0 || previousRequestDate > 0 || previousUsageDate > 0
      ? Math.max(currentRequestDate, currentUsageDate, previousRequestDate, previousUsageDate)
      : 31;
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
    const itemsPerRow = legendItemsPerRow ? legendItemsPerRow : width > 900 ? chartStyles.itemsPerRow : 2;

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
        bottom: 130,
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
      ? width > 900
        ? containerHeight - 50
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

export { HistoricalUsageChart, HistoricalUsageChartProps };
