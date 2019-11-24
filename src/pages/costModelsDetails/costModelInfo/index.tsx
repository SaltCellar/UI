import { TabContent } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { CostModel, CostModelProvider } from 'api/costModels';
import React from 'react';
import MarkupCard from '../components/markup';
import PriceListTable from '../components/priceListTable';
import SourceTable from '../components/sourceTable';
import { styles } from '../costModelsDetails.styles';
import Header from './header';

interface Props {
  providers: CostModelProvider[];
  rates: any[];
  goBack: () => void;
  markup: { value: string };
  current: CostModel;
}

interface State {
  tabIndex: number;
}

class CostModelInformation extends React.Component<Props, State> {
  public tabRefs = [
    React.createRef<HTMLElement>(),
    React.createRef<HTMLElement>(),
    React.createRef<HTMLElement>(),
  ];
  constructor(props) {
    super(props);
    this.state = { tabIndex: 0 };
  }
  public render() {
    const { providers, rates, goBack, current } = this.props;
    return (
      <div className={css(styles.sourceSettings)}>
        <Header
          goBack={goBack}
          tabRefs={this.tabRefs}
          tabIndex={this.state.tabIndex}
          onSelectTab={tabIndex => this.setState({ tabIndex })}
        />
        <div className={css(styles.content)}>
          {current.source_type === 'OpenShift Container Platform' ? (
            <>
              <TabContent
                eventKey={0}
                id="refPriceList"
                ref={this.tabRefs[0]}
                hidden={this.state.tabIndex !== 0}
              >
                <div className={css(styles.costmodelsContainer)}>
                  <PriceListTable
                    costModel={current.name}
                    assignees={providers.map(p => p.name)}
                    rates={rates}
                    current={current}
                  />
                </div>
              </TabContent>
              <TabContent
                eventKey={1}
                id="refMarkup"
                ref={this.tabRefs[1]}
                hidden={this.state.tabIndex !== 1}
              >
                <MarkupCard current={current} />
              </TabContent>
              <TabContent
                eventKey={2}
                id="refSources"
                ref={this.tabRefs[2]}
                hidden={this.state.tabIndex !== 2}
              >
                <div className={css(styles.costmodelsContainer)}>
                  <SourceTable costModel={current} providers={providers} />
                </div>
              </TabContent>
            </>
          ) : (
            <>
              <TabContent
                eventKey={0}
                id="refMarkup"
                ref={this.tabRefs[0]}
                hidden={this.state.tabIndex !== 0}
              >
                <MarkupCard current={current} />
              </TabContent>
              <TabContent
                eventKey={1}
                id="refSources"
                ref={this.tabRefs[1]}
                hidden={this.state.tabIndex !== 1}
              >
                <div className={css(styles.costmodelsContainer)}>
                  <SourceTable costModel={current} providers={providers} />
                </div>
              </TabContent>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default CostModelInformation;
