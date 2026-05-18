import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../utils/axios/baseQuery";

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/common",
  }),
  endpoints: (builder) => ({
    uploadAdImage: builder.mutation({
      query: (payload) => {
        return {
          url: "/upload-image",
          method: "POST",
          data: payload,
        };
      },
    //   transformResponse: (res) => res?.data,
    }),
  }),
});

export const { useUploadAdImageMutation } = commonApi;