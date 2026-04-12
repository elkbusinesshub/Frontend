import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../utils/axios/baseQuery";

export const placeApi = createApi({
  reducerPath: "placeApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/place",
  }),
  endpoints: (builder) => ({
    getPlaceSearch: builder.query({
      query: (payload) => ({
        url: "/place_search",
        method: "POST",
        data: payload
      }),
      transformResponse: (res) => res?.data,
      providesTags: ["LocationList"],
    }),
    getPlace: builder.mutation({
      query: (payload) => ({
        url: "/get_place",
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
    }),
    
  }),
});

export const { useGetPlaceSearchQuery, useGetPlaceMutation } = placeApi;
