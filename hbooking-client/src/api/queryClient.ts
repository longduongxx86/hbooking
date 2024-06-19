import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: 3000,
      staleTime: 1000 * 5,
    },
  },
});

export default queryClient;
