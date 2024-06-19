import w from "@/config/ward.json";
import d from "@/config/district.json";
import p from "@/config/province.json";
import { useMemo, useState } from "react";

const useAddressLocal = () => {
  const [provinceState, setProvinceState] = useState("");
  const [districtState, setDistrictState] = useState("");

  const provinceLocal = useMemo(() => {
    return p.map((pl) => ({ ...pl, value: pl.id })) || [];
  }, []);

  const districtLocal = useMemo(() => {
    if (provinceState) {
      return d
        .filter((dl) => `${dl.province_id}` === provinceState)
        .map((dl) => ({ ...dl, value: dl.id }));
    }
    return [];
  }, [provinceState]);

  const wardLocal = useMemo(() => {
    if (districtState) {
      return w
        .filter((wl) => `${wl.district_id}` === districtState)
        .map((wl) => ({ ...wl, value: wl.id }));
    }

    return [];
  }, [districtState]);

  const handleUpdateProvince = (id: string) => {
    setProvinceState(id);
  };

  const handleUpdateDistrict = (id: string) => {
    setDistrictState(id);
  };

  return {
    provinceLocal,
    districtLocal,
    wardLocal,
    handleUpdateProvince,
    handleUpdateDistrict,
  };
};

export const getAddressText = (
  privinceId: number,
  districtId: number,
  wardId: number
) => {
  const provinceText = p.find((pl) => pl.id === privinceId)?.name;
  const districtText = d.find(
    (dl) => dl.id === districtId && dl.province_id === privinceId
  )?.name;
  const wardText = w.find(
    (wl) => wl.id === wardId && wl.district_id === districtId
  )?.name;

  return {
    wardText,
    districtText,
    provinceText,
  };
};

export default useAddressLocal;
