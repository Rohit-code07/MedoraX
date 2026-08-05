import { useQuery } from "@tanstack/react-query";
import { getAnalytics, getStreak, getWeeklyRate, getBestMedicine, getMostMissed, getWeeklyChart, getMedicineRate, getHeatmap } from "../api/analytics.api";

export const useAnalytics = (id) => useQuery(["analytics", id], () => getAnalytics(id).then(res=>res.data), {enabled:!!id});
export const useStreak = (id) => useQuery(["streak", id], () => getStreak(id).then(res=>res.data), {enabled:!!id});
export const useWeeklyRate = (id) => useQuery(["weeklyRate", id], () => getWeeklyRate(id).then(res=>res.data), {enabled:!!id});
export const useBestMedicine = (id) => useQuery(["bestMedicine", id], () => getBestMedicine(id).then(res=>res.data), {enabled:!!id});
export const useMostMissed = (id) => useQuery(["mostMissed", id], () => getMostMissed(id).then(res=>res.data), {enabled:!!id});
export const useWeeklyChart = (id) => useQuery(["weeklyChart", id], () => getWeeklyChart(id).then(res=>res.data), {enabled:!!id});
export const useMedicineRate = (id) => useQuery(["medicineRate", id], () => getMedicineRate(id).then(res=>res.data), {enabled:!!id});
export const useHeatmap = () => useQuery(["heatmap"], () => getHeatmap().then(res=>res.data));
