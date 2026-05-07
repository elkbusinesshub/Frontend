import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../../utils/axios/baseQuery'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/admin',
  }),
  endpoints: (builder) => ({
    createAd: builder.mutation({
      query: (payload) => ({
        url: '/admin-ad-create',
        method: 'POST',
        data: payload,
      }),
      invalidatesTags: ['SalesUserList', 'SalesAdsList'],
    }),
    getSalesUsersList: builder.query({
      query: ({ limit, offset, search }) => {
        const params = new URLSearchParams({
          limit,
          offset,
          ...(search && { search }),
        })
        return {
          url: `/get_sales_users?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (res) => res?.data,
      providesTags: ['SalesUserList'],
    }),
    getSalesAdsList: builder.query({
      query: ({ limit, offset, search }) => {
        const params = new URLSearchParams({
          limit,
          offset,
          ...(search && { search }),
        })
        return {
          url: `/get_sales_ads?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (res) => res?.data,
      providesTags: ['SalesAdsList'],
    }),
  }),
})

export const {
  useCreateAdMutation,
  useGetSalesAdsListQuery,
  useGetSalesUsersListQuery,
} = adminApi
