import {
  EmptyState as PfEmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { MoneyCheckAltIcon } from '@patternfly/react-icons';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { styles } from './noRatesState.styles';

interface Props extends WrappedComponentProps {
  cluster: string;
}

const NoRatesStateBase: React.SFC<Props> = ({ intl, cluster }) => {
  return (
    <div style={styles.container}>
      <PfEmptyState>
        <EmptyStateIcon icon={MoneyCheckAltIcon} />
        <Title size={TitleSize.lg}>
          {intl.formatMessage({ id: 'no_rates_state.title' })}
        </Title>
        <EmptyStateBody>
          {intl.formatMessage({ id: 'no_rates_state.desc' }, { cluster })}
        </EmptyStateBody>
      </PfEmptyState>
    </div>
  );
};

export const NoRatesState = injectIntl(NoRatesStateBase);
