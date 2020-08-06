import { global_BackgroundColor_light_100 } from '@patternfly/react-tokens/dist/esm/global_BackgroundColor_light_100';
import { global_spacer_lg } from '@patternfly/react-tokens/dist/esm/global_spacer_lg';
import { global_spacer_md } from '@patternfly/react-tokens/dist/esm/global_spacer_md';
import { global_spacer_sm } from '@patternfly/react-tokens/dist/esm/global_spacer_sm';
import { global_spacer_xl } from '@patternfly/react-tokens/dist/esm/global_spacer_xl';
import React from 'react';

export const styles = {
  headerDescription: {
    width: '97%',
    wordWrap: 'break-word',
  },
  content: {
    paddingTop: global_spacer_xl.value,
    height: '182vh',
  },
  costmodelsContainer: {
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
    backgroundColor: global_BackgroundColor_light_100.value,
    paddingBottom: global_spacer_md.value,
    paddingTop: global_spacer_md.value,
  },
  headerCostModel: {
    padding: global_spacer_lg.var,
    paddingBottom: 0,
    backgroundColor: global_BackgroundColor_light_100.value,
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
