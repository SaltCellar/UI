import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartVoronoiContainer,
  getInteractiveLegendEvents,
  getInteractiveLegendItemStyles,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { default as ChartTheme } from 'components/charts/chartTheme';
import {
  getCostRangeString,
  getDateRange,
  getMaxValue,
  getTooltipContent,
  getTooltipLabel,
} from 'components/charts/commonChart/chartUtils';
import getDate from 'date-fns/get_date';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory';
import { chartStyles, styles } from './trendChart.styles';

interface TrendChartProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  currentData: any;
  height?: number;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  padding?: any;
  showUsageLegendLabel?: boolean; // The cost legend label is shown by default
  title?: string;
  units?: string;
}

interface TrendChartData {
  name?: string;
}

interface TrendChartLegendItem {
  name?: string;
  symbol?: any;
}

interface TrendChartSeries {
  childName?: string;
  data?: [TrendChartData];
  legendItem?: TrendChartLegendItem;
  style?: VictoryStyleInterface;
}

interface State {
  hiddenSeries: Set<number>;
  series?: TrendChartSeries[];
  width: number;
}

class TrendChart extends React.Component<TrendChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
    hiddenSeries: new Set(),
    width: 0,
  };

  public componentDidMount() {
    setTimeout(() => {
      if (this.containerRef.current) {
        this.setState({ width: this.containerRef.current.clientWidth });
      }
      window.addEventListener('resize', this.handleResize);
    });
    this.initDatum();
  }

  public componentDidUpdate(prevProps: TrendChartProps) {
    if (
      prevProps.currentData !== this.props.currentData ||
      prevProps.previousData !== this.props.previousData
    ) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  private initDatum = () => {
    const {
      currentData,
      previousData,
      showUsageLegendLabel = false,
    } = this.props;

    const key = showUsageLegendLabel
      ? 'chart.usage_legend_label'
      : 'chart.cost_legend_label';

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    this.setState({
      series: [
        {
          childName: 'previousCost',
          data: previousData,
          legendItem: {
            name: getCostRangeString(previousData, key, true, true, 1),
            symbol: {
              type: 'minus',
            },
          },
          style: chartStyles.previousMonth,
        },
        {
          childName: 'currentCost',
          data: currentData,
          legendItem: {
            name: getCostRangeString(currentData, key, true, false),
            symbol: {
              type: 'minus',
            },
          },
          style: chartStyles.currentMonth,
        },
      ],
    });
  };

  private handleResize = () => {
    if (this.containerRef.current) {
      this.setState({ width: this.containerRef.current.clientWidth });
    }
  };

  private getChart = (series: TrendChartSeries, index: number) => {
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

  private getDomain() {
    const { currentData, previousData } = this.props;
    const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };

    const maxCurrent = currentData ? getMaxValue(currentData) : 0;
    const maxPrevious = previousData ? getMaxValue(previousData) : 0;
    const maxValue = Math.max(maxCurrent, maxPrevious);
    const max = maxValue > 0 ? Math.ceil(maxValue + maxValue * 0.1) : 0;

    if (max > 0) {
      domain.y = [0, max];
    }
    return domain;
  }

  private getEndDate() {
    const { currentData, previousData } = this.props;
    const previousDate = previousData
      ? getDate(getDateRange(previousData, true, true)[1])
      : 0;
    const currentDate = currentData
      ? getDate(getDateRange(currentData, true, true)[1])
      : 0;

    return currentDate > 0 || previousDate > 0
      ? Math.max(currentDate, previousDate)
      : 31;
  }

  private getLegend = () => {
    const { width } = this.state;

    // Todo: use PF legendAllowWrap feature
    return (
      <ChartLegend
        colorScale={chartStyles.legendColorScale}
        data={this.getLegendData()}
        gutter={10}
        height={25}
        name="legend"
        orientation={width > 150 ? 'horizontal' : 'vertical'}
        style={chartStyles.legend}
      />
    );
  };

  private getTooltipLabel = ({ datum }) => {
    const { formatDatumValue, formatDatumOptions, units } = this.props;
    return getTooltipLabel(
      datum,
      getTooltipContent(formatDatumValue),
      formatDatumOptions,
      'date',
      units
    );
  };

  // Interactive legend

  // Hide each data series individually
  private handleLegendClick = props => {
    // Todo: Leave one legend item visible at all times?
    // const { hiddenSeries, series } = this.state;
    // const leaveVisible = hiddenSeries.size === series.length - 1;
    // if (leaveVisible && !this.isSeriesHidden(props.index)) {
    //   return;
    // }
    if (!this.state.hiddenSeries.delete(props.index)) {
      this.state.hiddenSeries.add(props.index);
    }
    this.setState({ hiddenSeries: new Set(this.state.hiddenSeries) });
  };

  // Returns true if at least one data series is available
  private isDataAvailable = () => {
    const { series } = this.state;

    // API data may not be available (e.g., on 1st of month)
    const unavailable = [];
    if (series) {
      series.forEach((s: any, index) => {
        if (this.isSeriesHidden(index) || (s.data && s.data.length === 0)) {
          unavailable.push(index);
        }
      });
    }
    return unavailable.length === (series ? series.length : 0);
  };

  // Returns true if data series is hidden
  private isSeriesHidden = index => {
    const { hiddenSeries } = this.state; // Skip if already hidden
    return hiddenSeries.has(index);
  };

  // Returns groups of chart names associated with each data series
  private getChartNames = () => {
    const { series } = this.state;
    const result = [];

    if (series) {
      series.map((serie, index) => {
        // Each group of chart names are hidden / shown together
        result.push(serie.childName);
      });
    }
    return result as any;
  };

  // Returns onMouseOver, onMouseOut, and onClick events for the interactive legend
  private getEvents = () => {
    const result = getInteractiveLegendEvents({
      chartNames: this.getChartNames(),
      isHidden: this.isSeriesHidden,
      legendName: 'legend',
      onLegendClick: this.handleLegendClick,
    });
    return result;
  };

  // Returns legend data styled per hiddenSeries
  private getLegendData = () => {
    const { hiddenSeries, series } = this.state;
    if (series) {
      const result = series.map((s, index) => {
        return {
          ...s.legendItem, // name property
          ...getInteractiveLegendItemStyles(hiddenSeries.has(index)), // hidden styles
        };
      });
      return result;
    }
  };

  public render() {
    const {
      adjustContainerHeight,
      height,
      containerHeight = height,
      padding,
      title,
    } = this.props;
    const { series, width } = this.state;

    const isDataAvailable = this.isDataAvailable();
    const container = (
      <ChartVoronoiContainer
        allowTooltip={!isDataAvailable}
        constrainToVisibleArea
        labels={!isDataAvailable ? this.getTooltipLabel : undefined}
        voronoiDimension="x"
      />
    );
    const domain = this.getDomain();
    const endDate = this.getEndDate();
    const midDate = Math.floor(endDate / 2);

    const adjustedContainerHeight = adjustContainerHeight
      ? width > 400
        ? containerHeight
        : containerHeight + 75
      : containerHeight;

    return (
      <div
        className={css(styles.chartContainer)}
        ref={this.containerRef}
        style={{ height: adjustedContainerHeight }}
      >
        <div>{title}</div>
        <Chart
          containerComponent={container}
          domain={domain}
          events={this.getEvents()}
          height={height}
          legendComponent={this.getLegend()}
          legendData={this.getLegendData()}
          legendPosition="bottom-left"
          padding={padding}
          theme={ChartTheme}
          width={width}
        >
          {series &&
            series.map((s, index) => {
              return this.getChart(s, index);
            })}
          <ChartAxis
            style={chartStyles.xAxis}
            tickValues={[1, midDate, endDate]}
          />
          <ChartAxis dependentAxis style={chartStyles.yAxis} />
        </Chart>
      </div>
    );
  }
}

export { TrendChart, TrendChartProps };
