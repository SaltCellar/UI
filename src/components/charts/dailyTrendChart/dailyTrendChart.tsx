import 'components/charts/common/charts-common.scss';

import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartLegend,
  ChartLegendTooltip,
  ChartLine,
  createContainer,
  getInteractiveLegendEvents,
} from '@patternfly/react-charts';
import { Title } from '@patternfly/react-core';
import { default as ChartTheme } from 'components/charts/chartTheme';
import { getCostRangeString, getDateRange } from 'components/charts/common/chartDatumUtils';
import {
  ChartSeries,
  getChartNames,
  getDomain,
  getLegendData,
  getResizeObserver,
  getTooltipLabel,
  initHiddenSeries,
  isDataAvailable,
  isDataHidden,
  isSeriesHidden,
} from 'components/charts/common/chartUtils';
import { createIntlEnv } from 'components/i18n/localeEnv';
import { getDate } from 'date-fns';
import messages from 'locales/messages';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { noop } from 'utils/noop';

import { chartStyles } from './dailyTrendChart.styles';

interface DailyTrendChartProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  currentData: any;
  forecastData?: any;
  forecastConeData?: any;
  height?: number;
  legendItemsPerRow?: number;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  padding?: any;
  showForecast?: boolean; // Show forecast legend regardless if data is available
  showInfrastructureLabel?: boolean; // Show supplementary cost labels
  showSupplementaryLabel?: boolean; // Show supplementary cost labels
  showUsageLegendLabel?: boolean; // The cost legend label is shown by default
  title?: string;
  units?: string;
}

interface State {
  cursorVoronoiContainer?: any;
  hiddenSeries: Set<number>;
  series?: ChartSeries[];
  width: number;
}

class DailyTrendChart extends React.Component<DailyTrendChartProps, State> {
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

  public componentDidUpdate(prevProps: DailyTrendChartProps) {
    if (
      prevProps.currentData !== this.props.currentData ||
      prevProps.forecastData !== this.props.forecastData ||
      prevProps.forecastConeData !== this.props.forecastConeData ||
      prevProps.previousData !== this.props.previousData
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
      currentData,
      forecastData,
      forecastConeData,
      previousData,
      showForecast,
      showInfrastructureLabel = false,
      showSupplementaryLabel = false,
      showUsageLegendLabel = false,
    } = this.props;

    const key = showUsageLegendLabel
      ? messages.ChartUsageLegendlabel
      : showSupplementaryLabel
      ? messages.ChartCostSupplementaryLegendLabel
      : showInfrastructureLabel
      ? messages.ChartCostInfrastructureLegendLabel
      : messages.ChartCostLegendLabel;

    const tooltipKey = showUsageLegendLabel
      ? messages.ChartUsageLegendTooltip
      : showSupplementaryLabel
      ? messages.ChartCostSupplementaryLegendTooltip
      : showInfrastructureLabel
      ? messages.ChartCostInfrastructureLegendTooltip
      : messages.ChartCostLegendTooltip;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    const series: ChartSeries[] = [
      {
        childName: 'previousCost',
        data: this.initDatumChildName(previousData, 'previousCost'),
        legendItem: {
          name: getCostRangeString(previousData, key, true, true, 1),
          symbol: {
            fill: chartStyles.previousColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(previousData, tooltipKey, false, false, 1),
        },
        isBar: true,
        style: {
          data: {
            fill: chartStyles.previousColorScale[0],
          },
        },
      },
      {
        childName: 'currentCost',
        data: this.initDatumChildName(currentData, 'currentCost'),
        legendItem: {
          name: getCostRangeString(currentData, key, true, false),
          symbol: {
            fill: chartStyles.currentColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(currentData, tooltipKey, false, false),
        },
        isBar: true,
        style: {
          data: {
            fill: chartStyles.currentColorScale[0],
          },
        },
      },
    ];

    if (showForecast) {
      series.push({
        childName: 'forecast',
        data: this.initDatumChildName(forecastData, 'forecast'),
        legendItem: {
          name: getCostRangeString(forecastData, messages.ChartCostForecastLegendTooltip, false, false),
          symbol: {
            fill: chartStyles.forecastDataColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(forecastData, messages.ChartCostForecastConeLegendTooltip, false, false),
        },
        isBar: true,
        isForecast: true,
        style: {
          data: {
            fill: chartStyles.forecastDataColorScale[0],
          },
        },
      });
      series.push({
        childName: 'forecastCone',
        data: this.initDatumChildName(forecastConeData, 'forecastCone'),
        legendItem: {
          name: getCostRangeString(forecastConeData, messages.ChartCostForecastConeLegendLabel, false, false),
          symbol: {
            fill: chartStyles.forecastConeDataColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(forecastConeData, messages.ChartCostForecastConeLegendTooltip, false, false),
        },
        isForecast: true,
        isLine: true,
        style: {
          data: {
            fill: chartStyles.forecastConeDataColorScale[0],
          },
        },
      });
    }
    const cursorVoronoiContainer = this.getCursorVoronoiContainer();
    this.setState({ cursorVoronoiContainer, series });
  };

  // Adds a child name to help identify hidden data series
  private initDatumChildName = (data: any, childName: string) => {
    data.map(datum => (datum.childName = childName));
    return data;
  };

  private getAdjustedContainerHeight = () => {
    const {
      adjustContainerHeight,
      height,
      containerHeight = height,
      showForecast,
      showInfrastructureLabel,
      showSupplementaryLabel,
    } = this.props;
    const { width } = this.state;

    let adjustedContainerHeight = containerHeight;
    if (adjustContainerHeight) {
      if (showForecast) {
        const maxWidth = showSupplementaryLabel || showInfrastructureLabel ? 850 : 700;
        if (width < maxWidth) {
          adjustedContainerHeight += 25;
        }
      }
    }
    return adjustedContainerHeight;
  };

  private getChart = (series: ChartSeries, index: number) => {
    const { hiddenSeries } = this.state;

    if (!series.isForecast) {
      const data = !hiddenSeries.has(index) ? series.data : [{ y: null }];

      if (series.isBar) {
        return (
          <ChartBar
            alignment="middle"
            data={data}
            key={series.childName}
            name={series.childName}
            style={series.style}
          />
        );
      } else if (series.isLine) {
        return <ChartLine data={data} key={series.childName} name={series.childName} style={series.style} />;
      }
    }
    return null;
  };

  private getForecastBarChart = (series: ChartSeries, index: number) => {
    const { hiddenSeries } = this.state;

    if (series.isForecast && series.isBar) {
      const data = !hiddenSeries.has(index) ? series.data : [{ y: null }];
      return (
        <ChartBar alignment="middle" data={data} key={series.childName} name={series.childName} style={series.style} />
      );
    }
    return null;
  };

  private getForecastLineChart = (series: ChartSeries, index: number) => {
    const { hiddenSeries } = this.state;

    if (series.isForecast && series.isLine) {
      const data = !hiddenSeries.has(index) ? series.data : [{ y: null }];
      return (
        <ChartBar
          alignment="middle"
          barWidth={1}
          data={data}
          key={series.childName}
          name={series.childName}
          style={series.style}
        />
      );
    }
    return null;
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
          bottom: 50,
          left: 8,
          right: 8,
          top: 8,
        }}
      />
    );
  };

  private getEndDate() {
    const { currentData, forecastData, previousData } = this.props;
    const previousDate = previousData ? getDate(getDateRange(previousData, true, true)[1]) : 0;
    const currentDate = currentData ? getDate(getDateRange(currentData, true, true)[1]) : 0;
    const forecastDate = forecastData ? getDate(getDateRange(forecastData, true, true)[1]) : 0;

    return currentDate > 0 || previousDate > 0 ? Math.max(currentDate, forecastDate, previousDate) : 31;
  }

  // Returns onMouseOver, onMouseOut, and onClick events for the interactive legend
  private getEvents() {
    const { hiddenSeries, series } = this.state;

    const result = getInteractiveLegendEvents({
      chartNames: getChartNames(series),
      isDataHidden: data => isDataHidden(series, hiddenSeries, data),
      isHidden: index => isSeriesHidden(hiddenSeries, index),
      legendName: 'legend',
      onLegendClick: props => this.handleLegendClick(props.index),
    });
    return result;
  }

  private getLegend = () => {
    const { legendItemsPerRow } = this.props;
    const { hiddenSeries, series, width } = this.state;

    // Todo: use PF legendAllowWrap feature
    return (
      <ChartLegend
        data={getLegendData(series, hiddenSeries)}
        gutter={20}
        height={25}
        itemsPerRow={legendItemsPerRow}
        name="legend"
        orientation={width > 150 ? 'horizontal' : 'vertical'}
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
      height,
      padding = {
        bottom: 50,
        left: 8,
        right: 8,
        top: 8,
      },
      title,
    } = this.props;
    const { cursorVoronoiContainer, hiddenSeries, series, width } = this.state;
    const intl = createIntlEnv();
    const domain = getDomain(series, hiddenSeries);
    const lastDate = this.getEndDate();

    const half = Math.floor(lastDate / 2);
    const _1stDay = 1;
    const _2ndDay = _1stDay + Math.floor(half / 2);
    const _3rdDay = _1stDay + half;
    const _4thDay = lastDate - Math.floor(half / 2);

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

    // Note: For tooltip values to match properly, chart groups must be rendered in the order given as legend data
    return (
      <>
        {title && (
          <Title headingLevel="h3" size="md">
            {title}
          </Title>
        )}
        <div className="chartOverride" ref={this.containerRef} style={{ height: this.getAdjustedContainerHeight() }}>
          <div style={{ height, width }}>
            <Chart
              containerComponent={container}
              domain={domain}
              events={this.getEvents()}
              height={height}
              legendAllowWrap
              legendComponent={this.getLegend()}
              legendData={getLegendData(series, hiddenSeries)}
              legendPosition="bottom-left"
              padding={padding}
              theme={ChartTheme}
              width={width}
            >
              {series && series.length > 0 && (
                <ChartGroup offset={11}>{series.map((s, index) => this.getChart(s, index))}</ChartGroup>
              )}
              {series && series.length > 0 && (
                <ChartGroup offset={11}>
                  <ChartBar data={[{ y: null }]} name="forcast_spacer" />
                  {series.map((s, index) => this.getForecastBarChart(s, index))}
                </ChartGroup>
              )}
              {series && series.length > 0 && (
                <ChartGroup offset={11}>
                  <ChartBar data={[{ y: null }]} name="forcast_cone_spacer" />
                  {series.map((s, index) => this.getForecastLineChart(s, index))}
                </ChartGroup>
              )}
              <ChartAxis style={chartStyles.xAxis} tickValues={[_1stDay, _2ndDay, _3rdDay, _4thDay, lastDate]} />
              <ChartAxis dependentAxis style={chartStyles.yAxis} />
            </Chart>
          </div>
        </div>
      </>
    );
  }
}

export { DailyTrendChart, DailyTrendChartProps };
