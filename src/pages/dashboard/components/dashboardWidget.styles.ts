import { global_spacer_2xl } from '@patternfly/react-tokens/dist/esm/global_spacer_2xl';
import { global_spacer_xl } from '@patternfly/react-tokens/dist/esm/global_spacer_xl';
import React from 'react';

export const chartStyles = {
  chartAltHeight: 250,
  chartHeight: 180,
  containerAltHeight: 250,
  containerTrendHeight: 180,
  containerUsageHeight: 180,
};

export const styles = {
  tabs: {
    marginTop: global_spacer_2xl.value,
  },
  tabItems: {
    marginTop: global_spacer_xl.value,
  },
} as { [className: string]: React.CSSProperties };
