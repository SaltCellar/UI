import { AzureHistoricalDataWidget } from './azureHistoricalDataCommon';
import { computeUsageWidget, costWidget, storageUsageWidget } from './azureHistoricalDataWidgets';

export type AzureHistoricalDataState = Readonly<{
  widgets: Record<number, AzureHistoricalDataWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AzureHistoricalDataState = {
  currentWidgets: [costWidget.id, computeUsageWidget.id, storageUsageWidget.id],
  widgets: {
    [costWidget.id]: costWidget,
    [computeUsageWidget.id]: computeUsageWidget,
    [storageUsageWidget.id]: storageUsageWidget,
  },
};

export function azureHistoricalDataReducer(state = defaultState): AzureHistoricalDataState {
  return state;
}
