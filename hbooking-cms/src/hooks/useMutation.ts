import {
  UseMutationOptions,
  UseMutationResult,
  useMutation as useMutationTanstack,
} from "@tanstack/react-query";
import { useEffect } from "react";
import axios from "axios";
import { useToast } from "@/shared/components/ui/use-toast";

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationOptions: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const mutation = useMutationTanstack(mutationOptions);
  const { toast } = useToast();

  useEffect(() => {
    if (mutation.error && axios.isAxiosError(mutation.error)) {
      toast({
        variant: "destructive",
        title: "Lỗi hệ thống",
        description: "Vui lòng liên hệ với quản trị viên",
      });
    }
  }, [mutation.error, toast]);

  return mutation;
}
