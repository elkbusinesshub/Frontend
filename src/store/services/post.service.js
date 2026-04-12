import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../utils/axios/baseQuery";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/post",
  }),
  endpoints: (builder) => ({
    getRentCategoryList: builder.query({
      query: (payload) => ({
        url: "/rent_category_posts",
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
      providesTags: ["AdCategoryList"],
    }),
    createPost: builder.mutation({
      query: (payload) => ({
        url: "/create_post",
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
      invalidatesTags: ["MyAds"],
    }),
    getRecentUnsavedAds: builder.query({
      query: () => ({
        url: "/get_recent_unsaved_ad",
        method: "GET",
      }),
      transformResponse: (res) => res?.data,
      providesTags: ["UnsavedAds"],
    }),
    getMyAds: builder.query({
      query: () => ({
        url: "/my_ads",
        method: "GET",
      }),
      transformResponse: (res) => res?.data,
      providesTags: ["MyAds"],
    }),
    uploadAdImage: builder.mutation({
      query: ({ad_id, ad_stage, ad_status, data}) => ({
        url: `/upload_ad_image?ad_id=${ad_id}&ad_stage=${ad_stage}&ad_status=${ad_status}`,
        method: "POST",
        data: data,
      }),
      transformResponse: (res) => res?.data,
    }),
     updateAdAddress: builder.mutation({
      query: (payload) => ({
        url: `/update_ad_address`,
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
    }),
     getAdDetails: builder.query({
      query: (payload) => ({
        url: "/get_ad_details",
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
    }),
    addWishlist: builder.mutation({
      query: (payload) => ({
        url: "/add_to_wishlist",
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
    }),
    
     recommendedPost: builder.query({
      query: (payload) => ({
        url: "/recomented_posts",
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
    }),
    rentCategoryPost: builder.query({
      query: (payload) => ({
        url: "/rent_category_posts",
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
    }),
    searchAd:  builder.query({
      query: (payload) => ({
        url: "/search_ad",
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
    }),
    bestServiceProvider:  builder.query({
      query: (payload) => ({
        url: "/best_service_providers",
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
    }),



    
  }),
});

export const {
  useGetRentCategoryListQuery,
  useCreatePostMutation,
  useGetRecentUnsavedAdsQuery,
  useGetMyAdsQuery,
  useUploadAdImageMutation,
  useUpdateAdAddressMutation,
  useGetAdDetailsQuery,
  useAddWishlistMutation,
  useRecommendedPostQuery,
  useRentCategoryPostQuery,
  useSearchAdQuery,
  useBestServiceProviderQuery
} = postApi;
