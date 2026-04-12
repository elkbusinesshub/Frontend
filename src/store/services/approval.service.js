import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../utils/axios/baseQuery";

export const approvalApi = createApi({
  reducerPath: "approvalApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/approval",
  }),
  endpoints: (builder) => ({
    getApprovalsList: builder.query({
      query: (payload) => ({
        url: "/list-for-admin",
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
      providesTags: ["ApprovalList"],
    }),
    RejectApproval: builder.mutation({
      query: (payload) => ({
        url: "/reject",
        method: "POST",
        data: payload,
      }),
      transformResponse: (res) => res?.data,
      invalidatesTags: ["ApprovalList"],
    }),
  }),
});

export const { useGetApprovalsListQuery, useRejectApprovalMutation } =
  approvalApi;