import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReminders, createReminder, updateReminder } from "../api/reminder.api";

export const useReminders = () => {
  return useQuery(["reminders"], () => getReminders().then(res => res.data));
};

export const useCreateReminder = () => {
  const qc = useQueryClient();
  return useMutation(createReminder, {
    onSuccess: () => qc.invalidateQueries(["reminders"])
  });
};

export const useUpdateReminder = () => {
  const qc = useQueryClient();
  return useMutation(({id, body}) => updateReminder(id, body), {
    onSuccess: () => qc.invalidateQueries(["reminders"])
  });
};
