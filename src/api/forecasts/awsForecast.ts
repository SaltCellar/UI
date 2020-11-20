import axios from 'axios';

import { Forecast, ForecastType } from './forecast';

export const ForecastTypePaths: Partial<Record<ForecastType, string>> = {
  [ForecastType.cost]: 'forecasts/aws/costs/',
};

export function runForecast(forecastType: ForecastType, query: string) {
  const path = ForecastTypePaths[forecastType];
  return axios.get<Forecast>(`${path}?${query}`);
}
// forecasts/aws/costs/?filter[resolution]=daily&filter[time_scope_units]=month&filter[time_scope_value]=-1