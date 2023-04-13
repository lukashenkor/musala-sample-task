import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";


export const appAPI = createApi({
  reducerPath: "appAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  tagTypes: ["Device", "Gateway"],
  endpoints: (build) => ({
    fetchAllDevices: build.query({
      query: () => ({
        url: "/devices",
      }),
      providesTags: ["Device"],
    }),
    fetchAllGateways: build.query({
      query: () => ({
        url: "/gateways",
      }),
      providesTags: ["Gateway"],
    }),
    createNewDevice: build.mutation({
      query: (device) => ({
        url: '/devices',
        method: "POST",
        body: device,
      }),
      invalidatesTags: ["Device", "Gateway"],
    }),
    createNewGateway: build.mutation({
      query: (gateway) => ({
        url: "/gateways",
        method: "POST",
        body: gateway,
      }),
      invalidatesTags: ["Device", "Gateway"],
    }),
    addDeviceToGateway: build.mutation({
      query: ({gatewayId, deviceId}) => ({
        url: `/gateways/${gatewayId}/addDevice`,
        method: "PATCH",
        body: {deviceId},
      }),
      invalidatesTags: ["Gateway", "Device"],
    }),
    deleteDevice: build.mutation({
      query: (deviceId) => ({
        url: `/devices/${deviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Device", "Gateway"],
    }),
    deleteGateway: build.mutation({
      query: (gatewayId) => ({
        url: `/gateways/${gatewayId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Device", "Gateway"],
    }),
  }),
});
