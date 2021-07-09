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

import { chartStyles } from './dailyCostChart.styles';

interface DailyCostChartProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  currentCostData: any;
  currentInfrastructureCostData?: any;
  forecastConeData?: any;
  forecastData?: any;
  forecastInfrastructureConeData?: any;
  forecastInfrastructureData?: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height?: number;
  legendItemsPerRow?: number;
  padding?: any;
  previousInfrastructureCostData?: any;
  previousCostData?: any;
  showForecast?: boolean; // Show forecast legend regardless if data is available
  title?: string;
}

interface State {
  cursorVoronoiContainer?: any;
  hiddenSeries: Set<number>;
  series?: ChartSeries[];
  width: number;
}

class DailyCostChart extends React.Component<DailyCostChartProps, State> {
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

  public componentDidUpdate(prevProps: DailyCostChartProps) {
    if (
      prevProps.currentInfrastructureCostData !== this.props.currentInfrastructureCostData ||
      prevProps.currentCostData !== this.props.currentCostData ||
      prevProps.forecastConeData !== this.props.forecastConeData ||
      prevProps.forecastData !== this.props.forecastData ||
      prevProps.forecastInfrastructureConeData !== this.props.forecastInfrastructureConeData ||
      prevProps.forecastInfrastructureData !== this.props.forecastInfrastructureData ||
      prevProps.previousInfrastructureCostData !== this.props.previousInfrastructureCostData ||
      prevProps.previousCostData !== this.props.previousCostData
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
      currentInfrastructureCostData,
      currentCostData,
      forecastConeData,
      forecastData,
      forecastInfrastructureConeData,
      forecastInfrastructureData,
      previousInfrastructureCostData,
      previousCostData,
      showForecast,
    } = this.props;

    const costKey = messages.ChartCostLegendLabel;
    const costInfrastructureKey = messages.ChartCostInfrastructureLegendLabel;
    const costInfrastructureTooltipKey = messages.ChartCostInfrastructureLegendTooltip;
    const costTooltipKey = messages.ChartCostLegendTooltip;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    const series: ChartSeries[] = [
      {
        childName: 'previousCost',
        data: this.initDatumChildName(previousCostData, 'previousCost'),
        legendItem: {
          name: getCostRangeString(previousCostData, costKey, true, true, 1),
          symbol: {
            fill: chartStyles.previousColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(previousCostData, costTooltipKey, false, false, 1),
        },
        isLine: true,
        style: {
          data: {
            stroke: chartStyles.previousColorScale[0],
          },
        },
      },
      {
        childName: 'currentCost',
        data: this.initDatumChildName(currentCostData, 'currentCost'),
        legendItem: {
          name: getCostRangeString(currentCostData, costKey, true, false),
          symbol: {
            fill: chartStyles.currentColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(currentCostData, costTooltipKey, false, false),
        },
        isBar: true,
        style: {
          data: {
            fill: chartStyles.currentColorScale[0],
          },
        },
      },
      {
        childName: 'previousInfrastructureCost',
        data: this.initDatumChildName(previousInfrastructureCostData, 'previousInfrastructureCost'),
        legendItem: {
          name: getCostRangeString(previousInfrastructureCostData, costInfrastructureKey, true, true, 1),
          symbol: {
            fill: chartStyles.previousColorScale[1],
            type: 'dash',
          },
          tooltip: getCostRangeString(previousInfrastructureCostData, costInfrastructureTooltipKey, false, false, 1),
        },
        isLine: true,
        style: {
          data: {
            stroke: chartStyles.previousColorScale[1],
          },
        },
      },
      {
        childName: 'currentInfrastructureCost',
        data: this.initDatumChildName(currentInfrastructureCostData, 'currentInfrastructureCost'),
        legendItem: {
          name: getCostRangeString(currentInfrastructureCostData, costInfrastructureKey, true, false),
          symbol: {
            fill: chartStyles.currentInfrastructureColorScale[1],
            type: 'dash',
          },
          tooltip: getCostRangeString(currentInfrastructureCostData, costInfrastructureTooltipKey, false, false),
        },
        isBar: true,
        style: {
          data: {
            fill: chartStyles.currentInfrastructureColorScale[1],
          },
        },
      },
    ];

    if (showForecast) {
      series.push({
        childName: 'forecast',
        data: this.initDatumChildName(forecastData, 'forecast'),
        legendItem: {
          name: getCostRangeString(forecastData, messages.ChartCostForecastLegendLabel, false, false),
          symbol: {
            fill: chartStyles.forecastDataColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(forecastData, messages.ChartCostForecastLegendTooltip, false, false),
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
        childName: 'forecastInfrastructure',
        data: this.initDatumChildName(forecastInfrastructureData, 'forecastInfrastructure'),
        legendItem: {
          name: getCostRangeString(
            forecastInfrastructureData,
            messages.ChartCostInfrastructureForecastLegendLabel,
            false,
            false
          ),
          symbol: {
            fill: chartStyles.forecastInfrastructureDataColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(
            forecastInfrastructureData,
            messages.ChartCostInfrastructureForecastLegendTooltip,
            false,
            false
          ),
        },
        isBar: true,
        isForecast: true,
        style: {
          data: {
            fill: chartStyles.forecastInfrastructureDataColorScale[0],
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
            type: 'triangleLeft',
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
      series.push({
        childName: 'forecastInfrastructureCone',
        data: this.initDatumChildName(forecastInfrastructureConeData, 'forecastInfrastructureCone'),
        legendItem: {
          name: getCostRangeString(
            forecastInfrastructureConeData,
            messages.ChartCostInfrastructureForecastConeLegendLabel,
            false,
            false
          ),
          symbol: {
            fill: chartStyles.forecastInfrastructureConeDataColorScale[0],
            type: 'triangleLeft',
          },
          tooltip: getCostRangeString(
            forecastInfrastructureConeData,
            messages.ChartCostInfrastructureForecastConeLegendTooltip,
            false,
            false
          ),
        },
        isForecast: true,
        isLine: true,
        style: {
          data: {
            fill: chartStyles.forecastInfrastructureConeDataColorScale[0],
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
    const { adjustContainerHeight, height, containerHeight = height, showForecast } = this.props;
    const { width } = this.state;

    let adjustedContainerHeight = containerHeight;
    if (adjustContainerHeight) {
      if (showForecast) {
        if (width > 675 && width < 1175) {
          adjustedContainerHeight += 25;
        } else if (width > 450 && width < 675) {
          adjustedContainerHeight += 50;
        } else if (width <= 450) {
          adjustedContainerHeight += 75;
        }
      } else {
        if (width > 450 && width < 725) {
          adjustedContainerHeight += 25;
        } else if (width <= 450) {
          adjustedContainerHeight += 50;
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
          bottom: 75,
          left: 8,
          right: 8,
          top: 8,
        }}
      />
    );
  };

  private getEndDate() {
    const {
      currentInfrastructureCostData,
      currentCostData,
      forecastData,
      previousInfrastructureCostData,
      previousCostData,
    } = this.props;
    const currentInfrastructureDate = currentInfrastructureCostData
      ? getDate(getDateRange(currentInfrastructureCostData, true, true)[1])
      : 0;
    const currentCostDate = currentCostData ? getDate(getDateRange(currentCostData, true, true)[1]) : 0;
    const forecastCostDate = forecastData ? getDate(getDateRange(forecastData, true, true)[1]) : 0;
    const previousInfrastructureDate = previousInfrastructureCostData
      ? getDate(getDateRange(previousInfrastructureCostData, true, true)[1])
      : 0;
    const previousUsageDate = previousCostData ? getDate(getDateRange(previousCostData, true, true)[1]) : 0;

    return currentInfrastructureDate > 0 ||
      currentCostDate > 0 ||
      previousInfrastructureDate > 0 ||
      previousUsageDate > 0
      ? Math.max(
          currentInfrastructureDate,
          currentCostDate,
          forecastCostDate,
          previousInfrastructureDate,
          previousUsageDate
        )
      : 31;
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
    const { hiddenSeries, series } = this.state;

    return (
      <ChartLegend
        data={getLegendData(series, hiddenSeries)}
        height={25}
        gutter={20}
        name="legend"
        responsive={false}
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
                <ChartGroup offset={5.5}>{series.map((s, index) => this.getChart(s, index))}</ChartGroup>
              )}
              {series && series.length > 0 && (
                <ChartGroup offset={5.5}>{series.map((s, index) => this.getForecastBarChart(s, index))}</ChartGroup>
              )}
              {series && series.length > 0 && (
                <ChartGroup offset={5.5}>{series.map((s, index) => this.getForecastLineChart(s, index))}</ChartGroup>
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

export { DailyCostChart, DailyCostChartProps };
