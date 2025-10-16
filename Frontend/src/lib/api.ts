import { FilterState } from '@/components/FiltersSection';

export interface AdvisoryResponse {
  recommendation: string;
  weather_data: any;
  soil_data: any;
  market_data: any;
  yield_data: any;
  timestamp: string;
}

export const fetchAdvisory = async (filters?: FilterState): Promise<AdvisoryResponse> => {
  try {
    const response = await fetch('http://localhost:8000/api/advisory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters || {}),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch advisory');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};