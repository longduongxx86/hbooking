export const SERVICE_PATHS = {
  SERVICES: "/service",
  SERVICE: "/service/:id",
  SERVICE_MODIFY: "/service/modify",
} as const;

export const SERVICE_API_PATHS = {
  SERVICES: "/service",
  SERVICE: (serviceId: string | number) =>
    `/service/${serviceId}` as "/service/:service_id",
} as const;
