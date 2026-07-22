import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2/promise';

function formatLabel(s: string): string {
  return s
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function calcChange(current: number, previous: number): { current: string; previous: string; change: number | null; trend: string } {
  const curStr = String(current);
  const prevStr = String(previous);
  if (previous === 0 && current === 0) return { current: curStr, previous: prevStr, change: null, trend: 'up' };
  if (previous === 0) return { current: curStr, previous: prevStr, change: 100, trend: 'up' };
  const pct = Math.round(((current - previous) / previous) * 100);
  return { current: curStr, previous: prevStr, change: pct, trend: pct >= 0 ? 'up' : 'down' };
}

async function buildRecentAnalytics(pool: any) {
  const q = (sql: string) => pool.query(sql).then((r: any) => r[0][0] as Record<string, number>);

  const results = await Promise.all([
    q("SELECT COUNT(*) AS curAdoptions FROM adoption_applications WHERE status IN ('approved','pet_unavailable') AND submitted_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)"),
    q("SELECT COUNT(*) AS prevAdoptions FROM adoption_applications WHERE status IN ('approved','pet_unavailable') AND submitted_at >= DATE_SUB(NOW(), INTERVAL 24 MONTH) AND submitted_at < DATE_SUB(NOW(), INTERVAL 12 MONTH)"),
    q("SELECT COUNT(*) AS curActive FROM animal_reports WHERE status IN ('submitted','in_progress','dispatched') AND submitted_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)"),
    q("SELECT COUNT(*) AS prevActive FROM animal_reports WHERE status IN ('submitted','in_progress','dispatched') AND submitted_at >= DATE_SUB(NOW(), INTERVAL 24 MONTH) AND submitted_at < DATE_SUB(NOW(), INTERVAL 12 MONTH)"),
    q("SELECT COUNT(*) AS curReports FROM animal_reports WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)"),
    q("SELECT COUNT(*) AS prevReports FROM animal_reports WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 24 MONTH) AND submitted_at < DATE_SUB(NOW(), INTERVAL 12 MONTH)"),
    q("SELECT COUNT(*) AS curTreatment FROM pets WHERE status = 'under_treatment' AND deleted_at IS NULL"),
    q("SELECT COUNT(*) AS prevTreatment FROM pets WHERE status = 'under_treatment' AND deleted_at IS NULL AND created_at >= DATE_SUB(NOW(), INTERVAL 24 MONTH) AND created_at < DATE_SUB(NOW(), INTERVAL 12 MONTH)"),
    q("SELECT COUNT(*) AS curVax FROM health_records WHERE vaccination_status = 'Vaccinated'"),
    q("SELECT COUNT(*) AS prevVax FROM health_records WHERE vaccination_status = 'Vaccinated' AND created_at >= DATE_SUB(NOW(), INTERVAL 24 MONTH) AND created_at < DATE_SUB(NOW(), INTERVAL 12 MONTH)"),
    q("SELECT COUNT(*) AS curTotalHealth FROM health_records"),
    q("SELECT COUNT(*) AS prevTotalHealth FROM health_records WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 MONTH) AND created_at < DATE_SUB(NOW(), INTERVAL 12 MONTH)"),
  ]);

  const curAdoptions = results[0].curAdoptions;
  const prevAdoptions = results[1].prevAdoptions;
  const curActive = results[2].curActive;
  const prevActive = results[3].prevActive;
  const curReports = results[4].curReports;
  const prevReports = results[5].prevReports;
  const curTreatment = results[6].curTreatment;
  const prevTreatment = results[7].prevTreatment;
  const curVax = results[8].curVax;
  const prevVax = results[9].prevVax;
  const curTotalHealth = results[10].curTotalHealth;
  const prevTotalHealth = results[11].prevTotalHealth;

  const curVaxPct = curTotalHealth > 0 ? Math.round((curVax / curTotalHealth) * 100) : 0;
  const prevVaxPct = prevTotalHealth > 0 ? Math.round((prevVax / prevTotalHealth) * 100) : 0;

  const adoptionChange = calcChange(curAdoptions, prevAdoptions);
  const activeChange = calcChange(curActive, prevActive);
  const reportsChange = calcChange(curReports, prevReports);
  const treatmentChange = calcChange(curTreatment, prevTreatment);

  return [
    { metric: 'Total Adoptions', ...adoptionChange },
    { metric: 'Active Rescue Cases', ...activeChange },
    { metric: 'Community Reports', ...reportsChange },
    { metric: 'Animals Under Treatment', ...treatmentChange },
    { metric: 'Vaccination Coverage', current: `${curVaxPct}%`, previous: `${prevVaxPct}%`, change: prevVaxPct > 0 ? Math.round(((curVaxPct - prevVaxPct) / prevVaxPct) * 100) : (curVaxPct > 0 ? 100 : null), trend: curVaxPct >= prevVaxPct ? 'up' : 'down' },
  ];
}

export const analyticsController = {
  async overview(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [[{ totalPets }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS totalPets FROM pets WHERE deleted_at IS NULL');
      const [[{ availablePets }]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS availablePets FROM pets WHERE status = 'available' AND deleted_at IS NULL");
      const [[{ totalAdoptions }]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS totalAdoptions FROM adoption_applications WHERE status IN ('approved','pet_unavailable')");
      const [[{ pendingAdoptions }]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS pendingAdoptions FROM adoption_applications WHERE status = 'pending_review'");
      const [[{ rejectedAdoptions }]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS rejectedAdoptions FROM adoption_applications WHERE status = 'rejected'");
      const [[{ activeRescues }]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS activeRescues FROM animal_reports WHERE status IN ('submitted','in_progress','dispatched')");
      const [[{ resolvedRescues }]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS resolvedRescues FROM animal_reports WHERE status = 'resolved'");
      const [[{ totalReports }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS totalReports FROM animal_reports');
      const [[{ underTreatment }]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS underTreatment FROM pets WHERE status = 'under_treatment' AND deleted_at IS NULL");
      const [[{ criticalHealth }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS criticalHealth FROM health_records WHERE heart_rate_bpm > 140');
      const [[{ healthyCount }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS healthyCount FROM health_records WHERE heart_rate_bpm IS NULL OR heart_rate_bpm <= 100');
      const [[{ vaccinatedCount }]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS vaccinatedCount FROM health_records WHERE vaccination_status = 'Vaccinated'");
      const [[{ totalHealthRecords }]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS totalHealthRecords FROM health_records');

      const vaccinationCoverage = totalHealthRecords > 0 ? Math.round((vaccinatedCount / totalHealthRecords) * 100) : 0;

      const [dogsVsCatsRows] = await pool.query<RowDataPacket[]>(
        "SELECT species, COUNT(*) AS value FROM pets WHERE deleted_at IS NULL GROUP BY species"
      );

      const [adoptionTrendRows] = await pool.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(a.submitted_at, '%b') AS month,
                SUM(CASE WHEN a.status IN ('approved','pet_unavailable') THEN 1 ELSE 0 END) AS adoptions,
                COUNT(*) AS applications
         FROM adoption_applications a
         WHERE a.submitted_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
         GROUP BY DATE_FORMAT(a.submitted_at, '%b')
         ORDER BY MIN(a.submitted_at) ASC`
      );

      const [dogVsCatAdoptionRows] = await pool.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(a.submitted_at, '%b') AS month, p.species, COUNT(*) AS count
         FROM adoption_applications a
         JOIN pets p ON a.pet_id = p.pet_id
         WHERE a.submitted_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
         AND a.status IN ('approved','pet_unavailable')
         GROUP BY DATE_FORMAT(a.submitted_at, '%b'), p.species
         ORDER BY MIN(a.submitted_at) ASC`
      );

      const [[{ avgResponseMinutes }]] = await pool.query<RowDataPacket[]>(
        `SELECT COALESCE(AVG(TIMESTAMPDIFF(MINUTE, submitted_at, resolved_at)), 0) AS avgResponseMinutes
         FROM animal_reports
         WHERE resolved_at IS NOT NULL AND status = 'resolved'`
      );

      const [rescueCategoryRows] = await pool.query<RowDataPacket[]>(
        `SELECT CASE WHEN species = 'unknown' THEN 'Unknown' WHEN species = 'dog' THEN 'Dog' WHEN species = 'cat' THEN 'Cat' END AS name, COUNT(*) AS value FROM animal_reports GROUP BY species`
      );

      const [reportCategoryRows] = await pool.query<RowDataPacket[]>(
        `SELECT CASE WHEN species = 'unknown' THEN 'Unknown' WHEN species = 'dog' THEN 'Dog' WHEN species = 'cat' THEN 'Cat' END AS name, COUNT(*) AS value FROM animal_reports GROUP BY species`
      );

      const [barangayRows] = await pool.query<RowDataPacket[]>(
        `SELECT location_area AS name, COUNT(*) AS value FROM animal_reports WHERE location_area IS NOT NULL AND location_area != '' GROUP BY location_area ORDER BY value DESC LIMIT 10`
      );

      const [sexDistRows] = await pool.query<RowDataPacket[]>(
        `SELECT sex AS name, COUNT(*) AS value FROM pets WHERE deleted_at IS NULL GROUP BY sex`
      );

      const [petStatusDistRows] = await pool.query<RowDataPacket[]>(
        `SELECT status AS name, COUNT(*) AS value FROM pets WHERE deleted_at IS NULL GROUP BY status`
      );

      const [ageDistRows] = await pool.query<RowDataPacket[]>(
        `SELECT age_estimate AS name, COUNT(*) AS value FROM pets WHERE deleted_at IS NULL AND age_estimate IS NOT NULL AND age_estimate != '' GROUP BY age_estimate ORDER BY value DESC LIMIT 10`
      );

      const [shelterCapacityRows] = await pool.query<RowDataPacket[]>(
        `SELECT source_type AS name, COUNT(*) AS value FROM pets WHERE deleted_at IS NULL GROUP BY source_type`
      );

      const [adoptionStatusRows] = await pool.query<RowDataPacket[]>(
        `SELECT status AS name, COUNT(*) AS value FROM adoption_applications GROUP BY status`
      );

      const [rescueByMonthRows] = await pool.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(submitted_at, '%b') AS month, COUNT(*) AS cases
         FROM animal_reports
         WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
         GROUP BY DATE_FORMAT(submitted_at, '%b')
         ORDER BY MIN(submitted_at) ASC`
      );

      const [rescueStatusRows] = await pool.query<RowDataPacket[]>(
        `SELECT status AS name, COUNT(*) AS value FROM animal_reports GROUP BY status`
      );

      const [reportsByMonthRows] = await pool.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(submitted_at, '%b') AS month, COUNT(*) AS reports
         FROM animal_reports
         WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
         GROUP BY DATE_FORMAT(submitted_at, '%b')
         ORDER BY MIN(submitted_at) ASC`
      );

      const [reportsByStatusRows] = await pool.query<RowDataPacket[]>(
        `SELECT CASE WHEN status IN ('submitted','in_progress','dispatched') THEN 'In Progress' WHEN status = 'resolved' THEN 'Resolved' ELSE status END AS name, COUNT(*) AS value FROM animal_reports GROUP BY name`
      );

      const [breedDistributionRows] = await pool.query<RowDataPacket[]>(
        `SELECT breed_detail AS name, COUNT(*) AS value FROM pets WHERE deleted_at IS NULL AND breed_detail IS NOT NULL AND breed_detail != '' GROUP BY breed_detail ORDER BY value DESC LIMIT 10`
      );

      const [topBreedRows] = await pool.query<RowDataPacket[]>(
        `SELECT breed_detail AS name, COUNT(*) AS value FROM pets WHERE deleted_at IS NULL AND breed_detail IS NOT NULL AND breed_detail != '' GROUP BY breed_detail ORDER BY value DESC LIMIT 6`
      );

      const [healthStatusRows] = await pool.query<RowDataPacket[]>(
        `SELECT CASE WHEN hr.heart_rate_bpm > 140 THEN 'Critical' WHEN hr.heart_rate_bpm > 100 THEN 'Under Treatment' WHEN hr.heart_rate_bpm > 80 OR hr.heart_rate_bpm IS NOT NULL THEN 'Recovering' WHEN hr.heart_rate_bpm IS NULL THEN 'Healthy' END AS name, COUNT(*) AS value FROM health_records hr GROUP BY name`
      );

      const adoptionApprovalRate = totalAdoptions + pendingAdoptions + rejectedAdoptions > 0
        ? Math.round((totalAdoptions / (totalAdoptions + pendingAdoptions + rejectedAdoptions)) * 1000) / 10
        : 0;

      const rescueCompletionRate = totalReports > 0
        ? Math.round((resolvedRescues / totalReports) * 1000) / 10
        : 0;

      const overview = {
        summaryCards: [
          { label: 'Total Animals', value: String(totalPets), change: null, seed: 1 },
          { label: 'Available for Adoption', value: String(availablePets), change: null, seed: 2 },
          { label: 'Total Adoptions', value: String(totalAdoptions), change: null, seed: 3 },
          { label: 'Adoption Success Rate', value: `${adoptionApprovalRate}%`, change: null, seed: 4 },
          { label: 'Active Rescue Cases', value: String(activeRescues), change: null, seed: 5 },
          { label: 'Community Reports', value: String(totalReports), change: null, seed: 6 },
          { label: 'Animals Under Treatment', value: String(underTreatment), change: null, seed: 7 },
          { label: 'Vaccination Coverage', value: `${vaccinationCoverage}%`, change: null, seed: 8 },
        ],
        adoptionTrend: adoptionTrendRows.map((r: any) => ({ month: r.month, adoptions: r.adoptions, applications: r.applications })),
        adoptionStatus: adoptionStatusRows.map((r: any) => ({ name: formatLabel(r.name), value: r.value })),
        topBreeds: topBreedRows.map((r: any) => ({ name: r.name, value: r.value })),
        rescueByMonth: rescueByMonthRows.map((r: any) => ({ month: r.month, cases: r.cases })),
        rescueStatus: rescueStatusRows.map((r: any) => ({ name: formatLabel(r.name), value: r.value })),
        reportsByMonth: reportsByMonthRows.map((r: any) => ({ month: r.month, reports: r.reports })),
        reportsByStatus: reportsByStatusRows.map((r: any) => ({ name: r.name, value: r.value })),
        breedDistribution: breedDistributionRows.map((r: any) => ({ name: r.name, value: r.value })),
        dogsVsCats: dogsVsCatsRows.map((r: any) => ({ name: r.species === 'dog' ? 'Dogs' : 'Cats', value: r.value })),
        healthStatus: healthStatusRows.map((r: any) => ({ name: r.name, value: r.value })),
        vaccinationCoverage,
        rescueSuccessRate: rescueCompletionRate,
        dogVsCatAdoptions: dogVsCatAdoptionRows.map((r: any) => ({
          month: r.month,
          species: r.species,
          count: r.count,
        })),
        avgResponseMinutes: Math.round(avgResponseMinutes),
        rescueCategories: rescueCategoryRows.map((r: any) => ({ name: r.name, value: r.value })),
        reportsByCategory: reportCategoryRows.map((r: any) => ({ name: r.name, value: r.value })),
        activeBarangays: barangayRows.map((r: any) => ({ name: r.name, value: r.value })),
        sexDistribution: sexDistRows.map((r: any) => ({ name: formatLabel(r.name), value: r.value })),
        petStatusDistribution: petStatusDistRows.map((r: any) => ({ name: formatLabel(r.name), value: r.value })),
        ageDistribution: ageDistRows.map((r: any) => ({ name: r.name, value: r.value })),
        shelterCapacity: shelterCapacityRows.map((r: any) => ({ name: r.name === 'shelter' ? 'Shelter' : r.name === 'community' ? 'Community' : r.name, value: r.value })),
        performanceMetrics: [
          { label: 'Adoption Approval Rate', value: `${adoptionApprovalRate}%`, change: null },
          { label: 'Rescue Completion Rate', value: `${rescueCompletionRate}%`, change: null },
          { label: 'Active Rescue Cases', value: String(activeRescues), change: null },
          { label: 'Animals Under Treatment', value: String(underTreatment), change: null },
          { label: 'Vaccination Coverage', value: `${vaccinationCoverage}%`, change: null },
        ],
        recentAnalytics: await buildRecentAnalytics(pool),
      };

      res.json({ success: true, overview });
    } catch (err) { next(err); }
  },
};
