import { useSearchParams as useSearchParametersRaw } from "react-router-dom";

export type QueryParameters = {
  [k: string]: string;
};

export function useSearchParameters() {
  const [searchParameters, setSearchParameters] = useSearchParametersRaw();

  const onSearch = (search: Record<string, string | number | string[]>) => {
    const parameters: QueryParameters = {};

    for (const [key, value] of Object.entries(search)) {
      const parameterValue = value.toString();

      if (parameterValue) {
        parameters[key] = parameterValue;
      } else {
        delete parameters[key];
      }
    }

    setSearchParameters(parameters);
  };

  const searchParametersCamelCase = Object.fromEntries(searchParameters);

  return { searchParameters: searchParametersCamelCase, onSearch };
}
