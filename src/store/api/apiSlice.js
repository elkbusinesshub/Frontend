import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}/api`, 
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem('elk_authorization_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['MyAds'],

  endpoints: (builder) => ({
   
    getMyAds: builder.query({
      query: () => `/my_ads`,
      providesTags: ['MyAds'],
    }),

    deleteAd: builder.mutation({
      query: (adId) => ({
        url: `/delete-ad?id=${adId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MyAds'],

      async onQueryStarted(adId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getMyAds', undefined, (draft) => {
            return draft.filter((ad) => ad.id !== adId && ad.ad_id !== adId);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); 
        }
      },
    }),
  }),
});

export const {
  useGetMyAdsQuery,
  useDeleteAdMutation,
} = apiSlice;
