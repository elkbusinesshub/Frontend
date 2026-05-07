import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../../utils/axios/baseQuery'

export const superadminApi = createApi({
  reducerPath: 'superadminApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '/super-admin',
  }),
  endpoints: (builder) => ({
    // getUsersList: builder.query({
    //   query: ({ limit, offset, date, search }) => ({
    //     url: `/get-users?limit=${limit}&offset=${offset}&date=${date}&search=${search}`,
    //     method: 'GET',
    //   }),
    //   transformResponse: (res) => res?.data,
    //   providesTags: ['UserList'],
    // }),
    getUsersList: builder.query({
      query: ({ limit, offset, date, search }) => {
        const params = new URLSearchParams({
          limit,
          offset,
          ...(date && { date }), 
          ...(search && { search }),  
        })

        return {
          url: `/get-users?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (res) => res?.data,
      providesTags: ['UserList'],
    }),
    getAdbyId: builder.query({
      query: (id) => ({
        url: `/get-ad-by-id?id=${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res?.data,
      providesTags: ['AdDetail'],
    }),
    updateAd: builder.mutation({
      query: (payload) => ({
        url: '/update-ad',
        method: 'PUT',
        data: payload,
      }),
      transformResponse: (res) => res?.data,
      invalidatesTags: ['AdDetail'],
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: '/block_user',
        method: 'PUT',
        params: { id },
      }),
      transformResponse: (res) => res?.data,
      invalidatesTags: ['UserList'],
    }),
    getAdsList: builder.query({
      query: ({ date, location, limit, offset }) => ({
        url: `/get-admin-ads?date=${date}&location=${location}&limit=${limit}&offset=${offset}`,
        method: 'GET',
      }),
      providesTags: ['AdsList'],
    }),
    getAdsLocationList: builder.query({
      query: () => ({
        url: `/get-ad-locations`,
        method: 'GET',
      }),
    }),
    deleteAd: builder.mutation({
      query: (id) => ({
        url: `/delete-ad?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdsList'],
    }),
    makeAdmin: builder.mutation({
      query: (payload) => ({
        url: '/make_admin',
        method: 'POST',
        data: payload,
      }),
      transformResponse: (res) => res?.data,
      invalidatesTags: ['UserList'],
    }),
    getSalesUsersList: builder.query({
      // query: ({ limit, offset, date, search }) => ({
      //   url: `/get-sales-users?limit=${limit}&offset=${offset}`,
      //   method: 'GET',
      // }),
      query: ({ limit, offset, date, search }) => {
        const params = new URLSearchParams({
          limit,
          offset,
          ...(date && { date }), 
          ...(search && { search }),  
        })

        return {
          url: `/get-sales-users?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (res) => res?.data,
      providesTags: ['SalesUserList'],
    }),
    getSalesAdsList: builder.query({
      query: () => ({
        url: '/get_sales_ads',
        method: 'GET',
      }),
      transformResponse: (res) => res?.data,
      providesTags: ['SalesAdsList'],
    }),
    getSalesUsersById: builder.query({
      query: (id) => ({
        url: `/get-sales-user-by-id?id=${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res?.data,
    }),
    checkPhone: builder.query({
      query: (phone_number) => ({
        url: `/check-phone?phone_number=${phone_number}`,
        method: 'GET',
      }),
      transformResponse: (res) => res?.data,
    }),

    addPhone: builder.mutation({
      query: (payload) => ({
        url: '/add-phone',
        method: 'POST',
        data: payload,
      }),
      transformResponse: (res) => res?.data,
    }),
  }),
})

export const {
  useUpdateAdMutation,
  useGetAdbyIdQuery,
  useGetUsersListQuery,
  useBlockUserMutation,
  useGetAdsListQuery,
  useGetAdsLocationListQuery,
  useDeleteAdMutation,
  useMakeAdminMutation,
  useGetSalesUsersListQuery,
  useGetSalesAdsListQuery,
  useGetSalesUsersByIdQuery,
  useCheckPhoneQuery,
  useAddPhoneMutation
} = superadminApi
