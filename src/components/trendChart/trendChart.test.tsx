jest.mock('date-fns/format');

import { Report } from 'api/reports';
import formatDate from 'date-fns/format';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import {
  VictoryArea,
  VictoryGroup,
  VictoryVoronoiContainerProps,
} from 'victory';
import { TrendChart, TrendChartProps } from './trendChart';
import { TrendChartLegendItem } from './trendChartLegendItem';
import { TrendChartTitle } from './trendChartTitle';
import * as utils from './trendChartUtils';

const currentMonthReport: Report = createReport('1-15-18');
const previousMonthReport: Report = createReport('12-15-17');

jest.spyOn(utils, 'transformReport');
jest.spyOn(utils, 'getTooltipLabel');

const transformReport = utils.transformReport as jest.Mock;
const getTooltipLabel = utils.getTooltipLabel as jest.Mock;

const props: TrendChartProps = {
  title: 'Trend Title',
  height: 100,
  formatDatumValue: jest.fn(),
  current: currentMonthReport,
  previous: previousMonthReport,
};

test('reports are formatted to datums', () => {
  const view = shallow(<TrendChart {...props} />);
  expect(transformReport).toBeCalledWith(currentMonthReport);
  expect(transformReport).toBeCalledWith(previousMonthReport);
  const charts = view.find(VictoryArea);
  expect(charts.length).toBe(2);
  expect(charts.at(0).prop('data')).toMatchSnapshot('previous month data');
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

test('null previous and current reports are handled', () => {
  const view = shallow(
    <TrendChart {...props} current={null} previous={null} />
  );
  expect(transformReport).toBeCalledWith(null);
  expect(transformReport).toBeCalledWith(null);
  const charts = view.find(VictoryArea);
  expect(charts.length).toBe(0);
});

test('legends are created for current and previous data', () => {
  const view = shallow(<TrendChart {...props} />);
  const legends = view.find(TrendChartLegendItem);
  expect(legends.length).toBe(2);
  expect(legends.at(0).prop('data')).toMatchSnapshot('current month data');
  expect(legends.at(1).prop('data')).toMatchSnapshot('previous month data');
});

test('chart title is displayed and passed to chart container', () => {
  const view = shallow(<TrendChart {...props} />);
  expect(view.find(TrendChartTitle).prop('children')).toBe(props.title);
  expect(getChartContainerProps(view).title).toBe(props.title);
});

test('height from props is used', () => {
  const view = shallow(<TrendChart {...props} />);
  expect(view.find(VictoryGroup).prop('height')).toBe(props.height);
});

test('labels formats with datum and value formatted from props', () => {
  const view = shallow(<TrendChart {...props} />);
  const datum: utils.TrendChartDatum = {
    x: 1,
    y: 1,
    date: '1-1-1',
  };
  getChartContainerProps(view).labels(datum);
  expect(getTooltipLabel).toBeCalledWith(datum, props.formatDatumValue);
  expect(props.formatDatumValue).toBeCalledWith(datum.y);
  expect(formatDate).toBeCalledWith(datum.date, expect.any(String));
  expect(view.find(VictoryGroup).prop('height')).toBe(props.height);
});

test('labels ignores datums without a date', () => {
  const view = shallow(<TrendChart {...props} />);
  const datum: utils.TrendChartDatum = {
    x: 1,
    y: 1,
    date: '',
  };
  const value = getChartContainerProps(view).labels(datum);
  expect(value).toBe('');
  expect(props.formatDatumValue).not.toBeCalled();
  expect(formatDate).not.toBeCalled();
});

function getChartContainerProps(
  view: ShallowWrapper
): VictoryVoronoiContainerProps {
  const group = view.find(VictoryGroup);
  return group.props().containerComponent.props;
}

function createReport(date: string): Report {
  return {
    data: [
      {
        date,
        values: [{ date, total: 1, units: 'unit' }],
      },
    ],
  };
}
