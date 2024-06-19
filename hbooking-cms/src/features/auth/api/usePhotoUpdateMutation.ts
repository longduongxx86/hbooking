import { api } from "@/api/api";
import { AUTH_API_PATHS } from "../constants";
import { useMutation } from "@/hooks/useMutation";
import { CommonReponse, Photo } from "@/types";

type RequestBody = {
  requestBody: FormData;
};

type ResponseBody = {
  data: {
    photos: Photo[];
  } & CommonReponse;
};

const mutationFunction = ({ requestBody }: RequestBody) => {
  return api.put<ResponseBody, ResponseBody>(
    AUTH_API_PATHS.UPDATE_PHOTOS,
    requestBody,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const usePhotoUpdateMutation = () => {
  return useMutation({ mutationFn: mutationFunction });
};
