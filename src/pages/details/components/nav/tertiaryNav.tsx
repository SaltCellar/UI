import { Nav, NavItem, NavList } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

export const enum TertiaryNavItem {
  aws = 'aws',
  azure = 'azure',
}

export const getIdKeyForNavItem = (navItem: TertiaryNavItem) => {
  switch (navItem) {
    case TertiaryNavItem.aws:
      return 'aws';
    case TertiaryNavItem.azure:
      return 'azure';
  }
};

interface TertiaryNavOwnProps {
  activeItem: TertiaryNavItem;
}

interface AvailableNavItem {
  navItem: TertiaryNavItem;
}

type TertiaryNavProps = TertiaryNavOwnProps &
  InjectedTranslateProps &
  RouteComponentProps<void>;

export class TertiaryNavBase extends React.Component<TertiaryNavProps> {
  private getAvailableNavItems = () => {
    const availableTabs = [
      {
        navItem: TertiaryNavItem.aws,
      },
      {
        navItem: TertiaryNavItem.azure,
      },
    ];
    return availableTabs;
  };

  private getNavItemTitle = (navItem: TertiaryNavItem) => {
    const { t } = this.props;

    if (navItem === TertiaryNavItem.aws) {
      return t('aws_details.title');
    } else if (navItem === TertiaryNavItem.azure) {
      return t('azure_details.title');
    }
  };

  private getNavItem = (navItem: TertiaryNavItem, index: number) => {
    const { activeItem } = this.props;
    const navItemKey = getIdKeyForNavItem(navItem);

    return (
      <NavItem
        key={navItemKey}
        itemId={navItemKey}
        isActive={activeItem === navItem}
      >
        {this.getNavItemTitle(navItem)}
      </NavItem>
    );
  };

  // tslint:disable-next-line:no-empty
  public handleOnSelect = selectedItem => {
    const { history } = this.props;
    const pathName = history.location.pathname.split('/');
    pathName[pathName.length - 1] = undefined;

    let prefix = pathName[0];
    if (pathName[1]) {
      prefix += `/${pathName[1]}`;
    }

    if (selectedItem.itemId === TertiaryNavItem.aws) {
      history.replace(`${prefix}/aws`);
    } else if (selectedItem.itemId === TertiaryNavItem.azure) {
      history.replace(`${prefix}/azure`);
    }
  };

  public render() {
    const availableNavItems: AvailableNavItem[] = this.getAvailableNavItems();

    return (
      <Nav onSelect={this.handleOnSelect} variant="tertiary">
        <NavList>
          {availableNavItems.map((val, index) =>
            this.getNavItem(val.navItem, index)
          )}
        </NavList>
      </Nav>
    );
  }
}

const TertiaryNav = withRouter(translate()(TertiaryNavBase));

export { TertiaryNav };
