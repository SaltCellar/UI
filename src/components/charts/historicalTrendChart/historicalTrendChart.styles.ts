import { StyleSheet } from '@patternfly/react-styles';
import {
  global_disabled_color_200,
  global_FontFamily_sans_serif,
  global_spacer_2xl,
  global_spacer_lg,
  global_spacer_sm,
  chart_color_green_100,
  chart_color_green_200,
  chart_color_green_300,
  chart_color_green_400,
  chart_color_green_500
} from '@patternfly/react-tokens';

export const chartStyles = {
  // See: https://github.com/project-koku/koku-ui/issues/241
  colorScale: [
    // '#A2DA9C',
    // '#88D080',
    // '#6EC664',
    // '#519149',
    // '#3C6C37'
    chart_color_green_100.value,
    chart_color_green_200.value,
    chart_color_green_300.value,
    chart_color_green_400.value,
    chart_color_green_500.value
  ],
  currentMonth: {
    data: {
      fill: 'none',
      stroke: '#A2DA9C',
    },
  },
  legend: {
    labels: {
      fontFamily: global_FontFamily_sans_serif.value,
      fontSize: 12,
    },
  },
  itemsPerRow: 0,
  previousMonth: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_200.value,
    },
  },
  yAxis: {
    axisLabel: {
      padding: 15,
    },
    grid: {
      stroke: 'none',
    },
    ticks: {
      stroke: 'none',
    },
    tickLabels: {
      fontSize: 0,
    },
  },
  xAxis: {
    axisLabel: {
      padding: 40,
    },
    grid: {
      stroke: 'none',
    },
    ticks: {
      stroke: 'none',
    },
  },
};

export const styles = StyleSheet.create({
  chart: {
    marginTop: global_spacer_sm.value,
  },
  chartContainer: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
  legendContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  legend: {
    paddingTop: global_spacer_2xl.value,
    marginLeft: '300px;',
  },
  title: {
    marginLeft: '-' + global_spacer_lg.value,
  },
});
