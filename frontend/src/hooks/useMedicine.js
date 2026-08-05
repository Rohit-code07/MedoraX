import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedicines, addMedicine, updateMedicine, deleteMedicine, getMedicine } from "../api/medicine.api.js";

export const useMedicines = () => {
  return useQuery(["medicines"], () => getMedicines().then(res => res.data));
};

export const useMedicine = (id) => {
  return useQuery(["medicine", id], () => getMedicine(id).then(res => res.data), { enabled: !!id });
};

export const useAddMedicine = () => {
  const qc = useQueryClient();
  return useMutation(addMedicine, {
    onSuccess: () => qc.invalidateQueries(["medicines"])
  });
};

export const useUpdateMedicine = () => {
  const qc = useQueryClient();
  return useMutation(({id, body}) => updateMedicine(id, body), {
    onSuccess: () => qc.invalidateQueries(["medicines"])
  });
};

export const useDeleteMedicine = () => {
  const qc = useQueryClient();
  return useMutation((id) => deleteMedicine(id), {
    onSuccess: () => qc.invalidateQueries(["medicines"])
  });
};
