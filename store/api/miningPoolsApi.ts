import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MiningPool, MiningPoolDetails } from '../../types/miningPool';

export const miningPoolsApi = createApi({
  reducerPath: 'miningPoolsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
  }),
  tagTypes: ['MiningPool'],
  endpoints: (builder) => ({
    getMiningPools: builder.query<MiningPool[], void>({
      query: () => 'mining-pools',
      providesTags: ['MiningPool'],
    }),
    getMiningPoolDetails: builder.query<MiningPoolDetails, string>({
      query: (id) => `mining-pools/${id}`,
      providesTags: (result, error, id) => [{ type: 'MiningPool', id }],
    }),
  }),
});

export const { useGetMiningPoolsQuery, useGetMiningPoolDetailsQuery } = miningPoolsApi; 