import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { ComputedOcpReportItem } from 'utils/computedReport/getComputedOcpReportItems';

interface ClusterViewOwnProps {
  item: ComputedOcpReportItem;
}

type ClusterViewProps = ClusterViewOwnProps & InjectedTranslateProps;

class ClusterViewBase extends React.Component<ClusterViewProps> {
  public render() {
    const { item } = this.props;

    if (!item.clusters) {
      return null;
    }
    return item.clusters.map((cluster, index) => (
      <div key={`cluster-${index}`}>{cluster}</div>
    ));
  }
}

const ClusterView = translate()(connect()(ClusterViewBase));

export { ClusterView, ClusterViewBase };
