import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../utils/axios/baseQuery";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/chat",
  }),
  endpoints: (builder) => ({
    getChatList: builder.query({
      query: ({authUserId, otherUserId}) => ({
        url: `/get_chat?authUserId=${authUserId}&otherUserId=${otherUserId}`,
        method: "GET",
      }),
      transformResponse: (res) => res?.data,
      providesTags: ["ChatList"],
    }),
  }),
});

export const {
  useGetChatListQuery
} = chatApi;
