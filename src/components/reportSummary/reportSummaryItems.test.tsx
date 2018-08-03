import { shallow } from 'enzyme';
import React from 'react';
import * as utils from 'utils/getComputedReportItems';
import {
  ReportSummaryItems,
  ReportSummaryItemsProps,
} from './reportSummaryItems';

jest.spyOn(utils, 'getComputedReportItems');

const props: ReportSummaryItemsProps = {
  report: { data: [] },
  idKey: 'date',
  labelKey: 'account',
  children: jest.fn(() => null),
};

test('computes report items', () => {
  shallow(<ReportSummaryItems {...props} />);
  expect(utils.getComputedReportItems).toBeCalledWith({
    report: props.report,
    idKey: props.idKey,
    labelKey: props.labelKey,
  });
  expect(props.children).toBeCalledWith({ items: [] });
});

test('returns null if a report is not present', () => {
  shallow(<ReportSummaryItems {...props} report={null} />);
  expect(utils.getComputedReportItems).not.toBeCalled();
  expect(props.children).not.toBeCalled();
});

test('does not update if the report is unchanged', () => {
  const view = shallow(<ReportSummaryItems {...props} />);
  view.setProps(props as any);
  expect(utils.getComputedReportItems).toHaveBeenCalledTimes(1);
  expect(props.children).toHaveBeenCalledTimes(1);
});
