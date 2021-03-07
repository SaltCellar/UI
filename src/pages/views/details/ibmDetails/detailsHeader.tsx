import { Title } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getQuery, IbmQuery } from 'api/queries/ibmQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { IbmReport } from 'api/reports/ibmReports';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import { GroupBy } from 'pages/views/components/groupBy/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ibmProvidersQuery, providersSelectors } from 'store/providers';
import { ComputedIbmReportItemsParams, getIdKeyForGroupBy } from 'utils/computedReport/getComputedIbmReportItems';
import { getSinceDateRangeString } from 'utils/dateRange';
import { formatCurrency } from 'utils/formatValue';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  groupBy?: string;
  onGroupByClicked(value: string);
  report: IbmReport;
}

interface DetailsHeaderStateProps {
  queryString?: string;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
}

type DetailsHeaderProps = DetailsHeaderOwnProps & DetailsHeaderStateProps & WithTranslation;

const baseQuery: IbmQuery = {
  delta: 'cost',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
};

const groupByOptions: {
  label: string;
  value: ComputedIbmReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'project', value: 'project' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

const tagReportPathsType = TagPathsType.ibm;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps> {
  public render() {
    const { groupBy, onGroupByClicked, providers, providersError, report, t } = this.props;
    const showContent = report && !providersError && providers && providers.meta && providers.meta.count > 0;

    const hasCost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total;

    return (
      <header style={styles.header}>
        <div>
          <Title headingLevel="h2" style={styles.title} size="2xl">
            {t('navigation.ibm_details')}
          </Title>
          <GroupBy
            getIdKeyForGroupBy={getIdKeyForGroupBy}
            groupBy={groupBy}
            isDisabled={!showContent}
            onItemClicked={onGroupByClicked}
            options={groupByOptions}
            showTags
            tagReportPathsType={tagReportPathsType}
          />
        </div>
        {Boolean(showContent) && (
          <div style={styles.cost}>
            <Title headingLevel="h2" style={styles.costValue} size="4xl">
              {formatCurrency(hasCost ? report.meta.total.cost.total.value : 0)}
            </Title>
            <div style={styles.costLabel}>
              <div style={styles.costLabelUnit}>{t('ibm_details.total_cost')}</div>
              <div style={styles.costLabelDate}>{getSinceDateRangeString()}</div>
            </div>
          </div>
        )}
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<DetailsHeaderOwnProps, DetailsHeaderStateProps>((state, props) => {
  const queryString = getQuery(baseQuery);
  const providersQueryString = getProvidersQuery(ibmProvidersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.ibm, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.ibm, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ibm,
    providersQueryString
  );

  return {
    providers,
    providersError,
    providersFetchStatus,
    queryString,
  };
});

const DetailsHeader = withTranslation()(connect(mapStateToProps, {})(DetailsHeaderBase));

export { DetailsHeader, DetailsHeaderProps };
