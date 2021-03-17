import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { parseQuery, Query, tagPrefix } from 'api/queries/query';
import { Tag } from 'api/tags/tag';
import { uniq, uniqBy } from 'lodash';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { styles } from './groupBy.styles';

interface GroupByTagOwnProps {
  groupBy?: string;
  isDisabled?: boolean;
  onItemClicked(value: string);
  options: {
    label: string;
    value: string;
  }[];
  tagReport: Tag;
}

interface GroupByTagState {
  currentItem?: string;
  isGroupByOpen: boolean;
}

type GroupByTagProps = GroupByTagOwnProps & WithTranslation;

class GroupByTagBase extends React.Component<GroupByTagProps> {
  protected defaultState: GroupByTagState = {
    isGroupByOpen: false,
  };
  public state: GroupByTagState = { ...this.defaultState };

  constructor(props: GroupByTagProps) {
    super(props);
    this.handleGroupByClear = this.handleGroupByClear.bind(this);
    this.handleGroupBySelect = this.handleGroupBySelect.bind(this);
    this.handleGroupByToggle = this.handleGroupByToggle.bind(this);
  }

  public componentDidMount() {
    this.setState({
      currentItem: this.getCurrentGroupBy(),
    });
  }

  public componentDidUpdate(prevProps: GroupByTagProps) {
    const { groupBy } = this.props;
    if (prevProps.groupBy !== groupBy) {
      this.setState({ currentItem: this.getCurrentGroupBy() });
    }
  }

  private getGroupByItems = () => {
    const { tagReport } = this.props;

    if (!(tagReport && tagReport.data)) {
      return [];
    }

    // If the key_only param is used, we have an array of strings
    let hasTagKeys = false;
    for (const item of tagReport.data) {
      if (item.hasOwnProperty('key')) {
        hasTagKeys = true;
        break;
      }
    }

    // Workaround for https://github.com/project-koku/koku/issues/1797
    let data = [];
    if (hasTagKeys) {
      const keepData = tagReport.data.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ type, ...keepProps }: any) => keepProps
      );
      data = uniqBy(keepData, 'key');
    } else {
      data = uniq(tagReport.data);
    }

    return data.map(item => {
      const tagKey = hasTagKeys ? item.key : item;
      return <SelectOption key={item.key} value={tagKey} />;
    });
  };

  private getCurrentGroupBy = () => {
    const queryFromRoute = parseQuery<Query>(location.search);
    const groupByKeys = queryFromRoute && queryFromRoute.group_by ? Object.keys(queryFromRoute.group_by) : [];

    let groupBy: string;
    for (const key of groupByKeys) {
      const index = key.indexOf(tagPrefix);
      if (index !== -1) {
        groupBy = key.slice(tagPrefix.length);
        break;
      }
    }
    return groupBy;
  };

  private handleGroupByClear = () => {
    this.setState({
      currentItem: undefined,
    });
  };

  private handleGroupBySelect = (event, selection) => {
    const { onItemClicked } = this.props;

    this.setState({
      currentItem: selection,
      isGroupByOpen: false,
    });
    if (onItemClicked) {
      onItemClicked(`${tagPrefix}${selection}`);
    }
  };

  private handleGroupByToggle = isGroupByOpen => {
    this.setState({ isGroupByOpen });
  };

  public render() {
    const { isDisabled, t } = this.props;
    const { currentItem, isGroupByOpen } = this.state;

    return (
      <div style={styles.groupBySelector}>
        <Select
          aria-label={t('group_by.tag_key_aria_label')}
          isDisabled={isDisabled}
          onClear={this.handleGroupByClear}
          onToggle={this.handleGroupByToggle}
          onSelect={this.handleGroupBySelect}
          isOpen={isGroupByOpen}
          placeholderText={t('group_by.tag_key_placeholder')}
          selections={currentItem}
          variant={SelectVariant.typeahead}
        >
          {this.getGroupByItems()}
        </Select>
      </div>
    );
  }
}

const GroupByTag = withTranslation()(GroupByTagBase);

export { GroupByTag, GroupByTagProps };
