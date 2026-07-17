import {
  ClipboardCheck,
  ShieldAlert,
  Timer,
  CheckCircle2,
  PawPrint,
  HeartHandshake,
  Percent,
  MessageSquareWarning,
  Stethoscope,
} from "lucide-react";

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const adoptionTrend = MONTHS.map((m, i) => ({
  month: m,
  adoptions: Math.round(28 + i * 3.4 + Math.sin(i) * 6),
  applications: Math.round(40 + i * 4.1 + Math.cos(i) * 5),
}));

export const adoptionStatus = [
  { name: "Approved", value: 412, color: "var(--chart-1)" },
  { name: "Pending", value: 96, color: "var(--chart-3)" },
  { name: "In Review", value: 58, color: "var(--chart-2)" },
  { name: "Rejected", value: 24, color: "var(--chart-4)" },
];

export const dogVsCat = MONTHS.slice(0, 8).map((m, i) => ({
  month: m,
  Dogs: Math.round(18 + i * 2.2 + Math.sin(i) * 4),
  Cats: Math.round(14 + i * 1.8 + Math.cos(i) * 3),
}));

export const topBreeds = [
  { name: "Aspin (Mixed)", value: 186 },
  { name: "Puspin (Mixed)", value: 164 },
  { name: "Shih Tzu", value: 71 },
  { name: "Labrador Retriever", value: 58 },
  { name: "Persian", value: 44 },
  { name: "Beagle", value: 33 },
];

export const rescueByMonth = MONTHS.map((m, i) => ({
  month: m,
  cases: Math.round(14 + Math.sin(i / 1.5) * 6 + i * 0.6),
}));

export const rescueStatus = [
  { name: "Completed", value: 268, color: "var(--chart-6)" },
  { name: "Ongoing", value: 41, color: "var(--chart-3)" },
  { name: "Pending", value: 19, color: "var(--chart-4)" },
];

export const rescueCategories = [
  { name: "Stray", value: 154, color: "var(--chart-1)" },
  { name: "Injured", value: 98, color: "var(--chart-4)" },
  { name: "Abandoned", value: 76, color: "var(--chart-3)" },
];

export const rescueResponseTrend = MONTHS.slice(0, 8).map((m, i) => ({
  month: m,
  minutes: Math.round(38 - i * 1.6 + Math.sin(i) * 3),
}));

export const reportsByMonth = MONTHS.map((m, i) => ({
  month: m,
  reports: Math.round(20 + Math.cos(i / 1.3) * 7 + i * 0.4),
}));

export const reportsByStatus = [
  { name: "Resolved", value: 301, color: "var(--chart-6)" },
  { name: "In Progress", value: 64, color: "var(--chart-2)" },
  { name: "Pending", value: 27, color: "var(--chart-4)" },
];

export const reportsByCategory = [
  { name: "Stray Animal", value: 148 },
  { name: "Animal Abuse", value: 52 },
  { name: "Injured Animal", value: 97 },
  { name: "Noise Complaint", value: 38 },
  { name: "Abandonment", value: 61 },
];

export const activeBarangays = [
  { name: "Barangay Poblacion", reports: 84, resolved: 92 },
  { name: "Barangay Bucana", reports: 67, resolved: 88 },
  { name: "Barangay Matina", reports: 59, resolved: 95 },
  { name: "Barangay Talomo", reports: 51, resolved: 81 },
  { name: "Barangay Buhangin", reports: 44, resolved: 90 },
];

export const mapPins = [
  { id: 1, type: "rescue", x: 22, y: 28, label: "Rescue â€” Bucana", count: 12 },
  { id: 2, type: "rescue", x: 61, y: 18, label: "Rescue â€” Buhangin", count: 8 },
  { id: 3, type: "adoption", x: 38, y: 52, label: "Adoption â€” Matina", count: 15 },
  { id: 4, type: "adoption", x: 74, y: 46, label: "Adoption â€” Talomo", count: 9 },
  { id: 5, type: "report", x: 50, y: 70, label: "Reports â€” Poblacion", count: 21 },
  { id: 6, type: "report", x: 16, y: 66, label: "Reports â€” Agdao", count: 11 },
  { id: 7, type: "rescue", x: 84, y: 74, label: "Rescue â€” Toril", count: 6 },
];

export const dogsVsCats = [
  { name: "Dogs", value: 612, color: "var(--chart-1)" },
  { name: "Cats", value: 438, color: "var(--chart-2)" },
];

export const breedDistribution = [
  { name: "Aspin", value: 320 },
  { name: "Puspin", value: 268 },
  { name: "Shih Tzu", value: 84 },
  { name: "Labrador", value: 61 },
  { name: "Persian", value: 47 },
  { name: "Others", value: 270 },
];

export const ageDistribution = [
  { name: "Puppy/Kitten", value: 214 },
  { name: "Young", value: 356 },
  { name: "Adult", value: 388 },
  { name: "Senior", value: 92 },
];

export const sexDistribution = [
  { name: "Male", value: 548, color: "var(--chart-1)" },
  { name: "Female", value: 502, color: "var(--chart-5)" },
];

export const availableVsAdopted = [
  { name: "Available", value: 264, color: "var(--chart-3)" },
  { name: "Adopted", value: 590, color: "var(--chart-6)" },
  { name: "Under Treatment", value: 76, color: "var(--chart-4)" },
];

export const shelterCapacity = [
  { name: "Main Shelter â€” Bucana", used: 82, total: 100 },
  { name: "Satellite Shelter â€” Talomo", used: 41, total: 60 },
  { name: "Quarantine Wing", used: 14, total: 25 },
];

export const healthStatus = [
  { name: "Healthy", value: 872, color: "var(--chart-6)" },
  { name: "Under Treatment", value: 76, color: "var(--chart-3)" },
  { name: "Critical", value: 12, color: "var(--chart-4)" },
];

export const vaccinationCoverage = 78;

export const heartRateSummary = MONTHS.slice(0, 8).map((m, i) => ({
  month: m,
  avgBpm: Math.round(96 + Math.sin(i) * 6),
}));

export const commonConditions = [
  { name: "Skin Disease", value: 64 },
  { name: "Parvovirus", value: 38 },
  { name: "Malnutrition", value: 51 },
  { name: "Fracture", value: 22 },
  { name: "Ear Infection", value: 45 },
];

export const vetVisitsPerMonth = MONTHS.map((m, i) => ({
  month: m,
  visits: Math.round(30 + Math.cos(i / 1.4) * 8 + i * 0.5),
}));

export const performanceMetrics = [
  { label: "Adoption Approval Rate", value: "84.2%", change: 3.1, icon: ClipboardCheck },
  { label: "Rescue Completion Rate", value: "91.6%", change: 1.4, icon: ShieldAlert },
  { label: "Avg. Rescue Response Time", value: "27 min", change: -8.2, icon: Timer },
  { label: "Avg. Adoption Processing Time", value: "4.3 days", change: -5.6, icon: Timer },
  { label: "Report Resolution Rate", value: "88.9%", change: 2.7, icon: CheckCircle2 },
];

export const recentAnalytics = [
  { metric: "Total Adoptions", current: "590", previous: "541", change: 9.1, trend: "up" },
  { metric: "Active Rescue Cases", current: "41", previous: "53", change: -22.6, trend: "down" },
  { metric: "Community Reports", current: "392", previous: "358", change: 9.5, trend: "up" },
  { metric: "Animals Under Treatment", current: "76", previous: "84", change: -9.5, trend: "down" },
  { metric: "Avg. Adoption Processing Time", current: "4.3 days", previous: "4.6 days", change: -6.5, trend: "down" },
  { metric: "Vaccination Coverage", current: "78%", previous: "73%", change: 6.8, trend: "up" },
];

export const sparklineData = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({
    i,
    v: Math.round(40 + Math.sin(i / 1.6 + seed) * 18 + i * 1.4),
  }));

export const summaryCards = [
  { label: "Total Animals", value: "1,050", change: 4.8, icon: PawPrint, seed: 1 },
  { label: "Available for Adoption", value: "264", change: -3.2, icon: HeartHandshake, seed: 2 },
  { label: "Total Adoptions", value: "590", change: 9.1, icon: ClipboardCheck, seed: 3 },
  { label: "Adoption Success Rate", value: "84.2%", change: 3.1, icon: Percent, seed: 4 },
  { label: "Active Rescue Cases", value: "41", change: -22.6, icon: ShieldAlert, seed: 5 },
  { label: "Community Reports", value: "392", change: 9.5, icon: MessageSquareWarning, seed: 6 },
  { label: "Animals Under Treatment", value: "76", change: -9.5, icon: Stethoscope, seed: 7 },
  { label: "Avg. Adoption Processing Time", value: "4.3 days", change: -5.6, icon: Timer, seed: 8 },
];

