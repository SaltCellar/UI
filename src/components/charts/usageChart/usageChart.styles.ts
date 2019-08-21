import { StyleSheet } from '@patternfly/react-styles';
import {
  chart_color_green_100,
  chart_color_green_200,
  chart_color_green_300,
  chart_color_green_400,
  chart_color_green_500,
  global_disabled_color_100,
  global_disabled_color_200,
  global_FontFamily_sans_serif,
  global_FontSize_md,
  global_spacer_lg,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const chartStyles = {
  currentRequestData: {
    data: {
      fill: 'none',
      stroke: '#88D080',
      strokeDasharray: '3,3',
    },
  },
  currentUsageData: {
    data: {
      fill: 'none',
      stroke: '#A2DA9C',
    },
  },
  legend: {
    labels: {
      fontFamily: global_FontFamily_sans_serif.value,
      fontSize: 14,
    },
    minWidth: 175,
  },
  previousRequestData: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_200.value,
      strokeDasharray: '3,3',
    },
  },
  previousUsageData: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_200.value,
    },
  },
  // See: https://github.com/project-koku/koku-ui/issues/241
  currentColorScale: [
    chart_color_green_100.value,
    chart_color_green_200.value,
    chart_color_green_300.value,
    chart_color_green_400.value,
    chart_color_green_500.value,
  ],
  // TBD: No grey scale, yet
  previousColorScale: [
    global_disabled_color_200.value,
    global_disabled_color_100.value,
  ],
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
      padding: 15,
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
  chartContainer: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
    marginTop: global_spacer_lg.value,
  },
  legend: {
    display: 'inline-block',
    fontSize: global_FontSize_md.value,
    minHeight: '60px',
    minWidth: '175px',
    width: '50%',
  },
  legendTitle: {
    fontSize: global_FontSize_md.value,
    marginBottom: global_spacer_sm.value,
    marginTop: global_spacer_lg.value,
  },
});
