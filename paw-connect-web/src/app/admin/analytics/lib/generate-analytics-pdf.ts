import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalyticsOverview } from "@/services/analytics.api";

export interface PdfReportOptions {
  periodLabel: string;
  data: AnalyticsOverview;
}

function formatDate(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sanitizePeriodLabel(label: string): string {
  return label.replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_").toLowerCase();
}

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 16;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

let pageNum = 1;

function header(doc: jsPDF, title: string) {
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(title, MARGIN, 12);
  doc.setDrawColor(220, 220, 220);
  doc.line(MARGIN, 14, PAGE_WIDTH - MARGIN, 14);
}

function footer(doc: jsPDF) {
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text(`Page ${pageNum}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: "center" });
}

function checkPage(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_HEIGHT - 20) {
    footer(doc);
    doc.addPage();
    pageNum++;
    header(doc, "Analytics Report");
    return MARGIN + 10;
  }
  return y;
}

function sectionTitle(doc: jsPDF, y: number, label: string): number {
  doc.setFontSize(14);
  doc.setTextColor(25, 25, 25);
  doc.setFont("helvetica", "bold");
  doc.text(label, MARGIN, y);
  doc.setFont("helvetica", "normal");
  return y + 8;
}

function subsection(doc: jsPDF, y: number, label: string): number {
  doc.setFontSize(10.5);
  doc.setTextColor(55, 55, 55);
  doc.setFont("helvetica", "bold");
  doc.text(label, MARGIN, y);
  doc.setFont("helvetica", "normal");
  return y + 5.5;
}

function paragraph(doc: jsPDF, y: number, text: string): number {
  y = checkPage(doc, y, 14);
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
  doc.text(lines, MARGIN, y);
  return y + lines.length * 4 + 3;
}

function gap(y: number, space: number): number {
  return y + space;
}

export async function generateAnalyticsPdf(options: PdfReportOptions): Promise<void> {
  const { periodLabel, data } = options;

  const doc = new jsPDF("p", "mm", "a4");
  pageNum = 1;

  header(doc, `Analytics Report — ${periodLabel}`);

  let y = MARGIN + 10;

  doc.setFontSize(20);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.text("Analytics Report", MARGIN, y);
  y += 9;

  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${formatDate()}  |  Period: ${periodLabel}`, MARGIN, y);
  y += 4;
  doc.text("PawConnect Animal Welfare Management System", MARGIN, y);
  y += 8;

  doc.setDrawColor(210, 210, 210);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 8;

  // ── Executive Summary ──
  y = sectionTitle(doc, y, "1. Executive Summary");
  y = paragraph(doc, y,
    `This report provides a comprehensive overview of the animal welfare operations managed through the PawConnect system for the selected period: ${periodLabel}. ` +
    `The data presented covers adoption trends, rescue operations, community reports, animal population demographics, health analytics, and overall performance metrics. ` +
    `The insights derived from this report are intended to support data-driven decision-making, resource allocation, and strategic planning for shelter management and community outreach programs.`
  );

  const totalAdoptions = data.adoptionTrend.reduce((s, r) => s + r.adoptions, 0);
  const totalRescues = data.rescueByMonth.reduce((s, r) => s + r.cases, 0);
  const totalReports = data.reportsByMonth.reduce((s, r) => s + r.reports, 0);
  const totalAnimals = data.dogsVsCats.reduce((s, r) => s + r.value, 0);
  const successPct = (data.rescueSuccessRate * 100).toFixed(1);

  y = paragraph(doc, y,
    `During this period, the system recorded a total of ${totalAdoptions} adoptions, ${totalRescues} rescue cases, and ${totalReports} community reports. ` +
    `The current animal population stands at ${totalAnimals}, with a rescue success rate of ${successPct}% and an average response time of ${data.avgResponseMinutes} minutes. ` +
    `Vaccination coverage is at ${data.vaccinationCoverage}%, indicating the overall health outreach effectiveness across the shelter network.`
  );

  // ── Summary Metrics ──
  y = gap(y, 4);
  y = sectionTitle(doc, y, "2. Key Metrics at a Glance");
  y = paragraph(doc, y,
    "The following table summarizes the core operational metrics for the selected period. These metrics provide a high-level snapshot of shelter performance, " +
    "including animal intake, adoption rates, rescue efficiency, and community engagement. The change column indicates the trend compared to the previous period, " +
    "with positive values representing improvement or growth."
  );

  if (data.summaryCards.length > 0) {
    const rows = data.summaryCards.map((c) => [
      c.label,
      c.value,
      c.change != null
        ? `${c.change >= 0 ? "+" : ""}${c.change}%`
        : "—",
    ]);
    autoTable(doc, {
      startY: y,
      head: [["Metric", "Value", "Change"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── Adoption Analytics ──
  y = sectionTitle(doc, y, "3. Adoption Analytics");
  y = paragraph(doc, y,
    "This section examines adoption activity across the shelter network. Adoption metrics are critical indicators of community engagement " +
    "and the effectiveness of animal placement programs. The analysis covers monthly adoption trends, application volumes, the current status " +
    "of adoption requests, and the most sought-after breeds."
  );

  if (data.adoptionTrend.length > 0) {
    y = checkPage(doc, y, 18);
    y = subsection(doc, y, "3.1 Monthly Adoption Trends");

    const peakAdoption = [...data.adoptionTrend].sort((a, b) => b.adoptions - a.adoptions)[0];
    const peakApp = [...data.adoptionTrend].sort((a, b) => b.applications - a.applications)[0];
    const totalApps = data.adoptionTrend.reduce((s, r) => s + r.applications, 0);

    y = paragraph(doc, y,
      `Over the reported period, a total of ${totalAdoptions} adoptions were completed from ${totalApps} applications received. ` +
      `The highest adoption activity occurred in ${peakAdoption.month} with ${peakAdoption.adoptions} adoptions, while the most applications ` +
      `were received in ${peakApp.month} (${peakApp.applications} applications). This data helps identify seasonal patterns and peak demand ` +
      `periods, which can inform targeted adoption campaigns and resource planning.`
    );

    const rows = data.adoptionTrend.map((r) => [r.month, String(r.adoptions), String(r.applications)]);
    autoTable(doc, {
      startY: y,
      head: [["Month", "Adoptions", "Applications"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  if (data.adoptionStatus.length > 0) {
    y = checkPage(doc, y, 22);
    y = subsection(doc, y, "3.2 Adoption Request Status");
    const total = data.adoptionStatus.reduce((s, r) => s + r.value, 0);
    const pending = data.adoptionStatus.find((r) => r.name.toLowerCase().includes("pending"));
    const completed = data.adoptionStatus.find((r) => r.name.toLowerCase().includes("completed") || r.name.toLowerCase().includes("approved"));

    y = paragraph(doc, y,
      `Of the ${total} total adoption requests, ${pending ? pending.value : 0} are currently pending review and ` +
      `${completed ? completed.value : 0} have been successfully completed. ` +
      "Monitoring the status distribution helps identify bottlenecks in the adoption pipeline and ensures timely processing of applications."
    );

    const rows = data.adoptionStatus.map((r) => [
      r.name,
      String(r.value),
      total > 0 ? `${((r.value / total) * 100).toFixed(1)}%` : "—",
    ]);
    autoTable(doc, {
      startY: y,
      head: [["Status", "Count", "Percentage"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  if (data.topBreeds.length > 0) {
    y = checkPage(doc, y, 18);
    y = subsection(doc, y, "3.3 Most Popular Breeds");
    const topBreed = data.topBreeds[0];
    y = paragraph(doc, y,
      `The most adopted or requested breed is ${topBreed.name} with ${topBreed.value} records. ` +
      "Understanding breed popularity helps shelters tailor their intake strategies and manage breed-specific resources such as " +
      "specialized care, space requirements, and adoption marketing efforts."
    );

    const rows = data.topBreeds.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Breed", "Count"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── Rescue Analytics ──
  y = sectionTitle(doc, y, "4. Rescue Analytics");
  y = paragraph(doc, y,
    "The rescue analytics section provides a detailed view of animal rescue operations. This includes the volume of rescue cases over time, " +
    "the current status of rescue efforts, the types of rescue incidents, and key efficiency metrics such as response time and success rate. " +
    "Rescue data is essential for evaluating operational readiness and identifying areas for improvement in emergency response."
  );

  if (data.rescueByMonth.length > 0) {
    y = checkPage(doc, y, 18);
    y = subsection(doc, y, "4.1 Rescue Cases by Month");
    const peakRescue = [...data.rescueByMonth].sort((a, b) => b.cases - a.cases)[0];
    y = paragraph(doc, y,
      `A total of ${totalRescues} rescue cases were recorded during this period. The busiest month was ${peakRescue.month} with ${peakRescue.cases} cases. ` +
      "Tracking rescue volume by month enables the organization to anticipate seasonal surges and allocate resources accordingly."
    );

    const rows = data.rescueByMonth.map((r) => [r.month, String(r.cases)]);
    autoTable(doc, {
      startY: y,
      head: [["Month", "Cases"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  if (data.rescueStatus.length > 0) {
    y = checkPage(doc, y, 22);
    y = subsection(doc, y, "4.2 Rescue Status Breakdown");
    const totalRescueStatus = data.rescueStatus.reduce((s, r) => s + r.value, 0);
    const resolved = data.rescueStatus.find((r) =>
      r.name.toLowerCase().includes("resolved") || r.name.toLowerCase().includes("completed")
    );

    y = paragraph(doc, y,
      `Of ${totalRescueStatus} rescue cases, ${resolved ? resolved.value : 0} have been resolved. ` +
      "The status distribution provides visibility into the rescue pipeline, from initial report through to resolution, " +
      "helping management identify cases that require escalation or additional support."
    );

    const rows = data.rescueStatus.map((r) => [
      r.name,
      String(r.value),
      totalRescueStatus > 0 ? `${((r.value / totalRescueStatus) * 100).toFixed(1)}%` : "—",
    ]);
    autoTable(doc, {
      startY: y,
      head: [["Status", "Count", "Percentage"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  y = checkPage(doc, y, 16);
  y = subsection(doc, y, "4.3 Rescue Efficiency Metrics");
  y = paragraph(doc, y,
    `The rescue success rate currently stands at ${successPct}%, reflecting the proportion of rescue cases that resulted in a positive outcome. ` +
    `The average response time is ${data.avgResponseMinutes} minutes from the initial report to dispatch. ` +
    "These metrics are key performance indicators for rescue operations. Improvements in response time typically correlate with higher success rates, " +
    "making this a critical area for ongoing investment and process optimization."
  );

  if (data.rescueCategories.length > 0) {
    y = checkPage(doc, y, 18);
    y = subsection(doc, y, "4.4 Rescue Incident Categories");
    const topCategory = data.rescueCategories[0];
    y = paragraph(doc, y,
      `The most common type of rescue incident is "${topCategory.name}" with ${topCategory.value} cases. ` +
      "Categorizing rescue incidents helps the organization understand the nature of emergencies in the community, " +
      "allowing for targeted public education, preventive measures, and specialized training for rescue teams."
    );

    const rows = data.rescueCategories.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Category", "Count"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── Community Reports ──
  y = sectionTitle(doc, y, "5. Community Reports");
  y = paragraph(doc, y,
    "Community reports represent public engagement with the platform, including reports of stray animals, injured wildlife, " +
    "and other animal welfare concerns submitted by community members. This section analyzes report volumes, status resolutions, " +
    "and the geographic distribution of reports across barangays."
  );

  if (data.reportsByMonth.length > 0) {
    y = checkPage(doc, y, 18);
    y = subsection(doc, y, "5.1 Reports by Month");
    const peakReport = [...data.reportsByMonth].sort((a, b) => b.reports - a.reports)[0];
    y = paragraph(doc, y,
      `A total of ${totalReports} community reports were submitted. The highest reporting activity occurred in ${peakReport.month} with ${peakReport.reports} reports. ` +
      "Monitoring community report volumes helps gauge public awareness and trust in the reporting system, as well as identify periods " +
      "of increased animal welfare concern in the community."
    );

    const rows = data.reportsByMonth.map((r) => [r.month, String(r.reports)]);
    autoTable(doc, {
      startY: y,
      head: [["Month", "Reports"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  if (data.reportsByStatus.length > 0) {
    y = checkPage(doc, y, 16);
    y = subsection(doc, y, "5.2 Reports by Status");
    y = paragraph(doc, y,
      "The following table shows the distribution of community reports by their current processing status. " +
      "This helps identify backlogs and ensures that community concerns are being addressed in a timely manner."
    );
    const rows = data.reportsByStatus.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Status", "Count"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  if (data.reportsByCategory.length > 0) {
    y = checkPage(doc, y, 16);
    y = subsection(doc, y, "5.3 Reports by Category");
    y = paragraph(doc, y,
      "Community reports are categorized by type to better understand the nature of public concerns. " +
      "This categorization supports targeted response strategies and community education initiatives."
    );
    const rows = data.reportsByCategory.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Category", "Count"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  if (data.activeBarangays.length > 0) {
    y = checkPage(doc, y, 16);
    y = subsection(doc, y, "5.4 Most Active Barangays");
    const topBarangay = data.activeBarangays[0];
    y = paragraph(doc, y,
      `The most active barangay in terms of community engagement is ${topBarangay.name} with ${topBarangay.value} recorded activities. ` +
      "Geographic analysis of report origins helps identify high-need areas and supports targeted deployment of field personnel and resources."
    );
    const rows = data.activeBarangays.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Barangay", "Activity"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── Animal Population ──
  y = sectionTitle(doc, y, "6. Animal Population Demographics");
  y = paragraph(doc, y,
    "Understanding the demographics of the animal population under care is fundamental to effective shelter management. " +
    "This section breaks down the population by species, breed, sex, age, and status, providing a comprehensive view of the shelter composition. " +
    "These insights inform decisions on resource allocation, specialized care requirements, and adoption program targeting."
  );

  if (data.dogsVsCats.length > 0) {
    y = checkPage(doc, y, 16);
    y = subsection(doc, y, "6.1 Species Composition");
    const dogs = data.dogsVsCats.find((r) => r.name.toLowerCase().includes("dog"));
    const cats = data.dogsVsCats.find((r) => r.name.toLowerCase().includes("cat"));
    const dogPct = dogs && totalAnimals > 0 ? ((dogs.value / totalAnimals) * 100).toFixed(1) : "0";
    const catPct = cats && totalAnimals > 0 ? ((cats.value / totalAnimals) * 100).toFixed(1) : "0";
    y = paragraph(doc, y,
      `The current animal population consists of ${dogs ? dogs.value : 0} dogs (${dogPct}%) and ${cats ? cats.value : 0} cats (${catPct}%). ` +
      "This species distribution helps guide shelter capacity planning, veterinary resource allocation, and targeted adoption marketing."
    );
    const rows = data.dogsVsCats.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Type", "Count"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  if (data.breedDistribution.length > 0) {
    y = checkPage(doc, y, 16);
    y = subsection(doc, y, "6.2 Breed Distribution");
    y = paragraph(doc, y,
      "The breed distribution provides insight into the variety of animals in the shelter system. " +
      "Certain breeds may require specialized care or have different adoption timelines, making this data valuable for operational planning."
    );
    const rows = data.breedDistribution.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Breed", "Count"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  if (data.sexDistribution.length > 0) {
    y = checkPage(doc, y, 14);
    y = subsection(doc, y, "6.3 Sex Distribution");
    y = paragraph(doc, y,
      "Tracking the sex distribution of animals in the shelter supports population management and spay/neuter program planning."
    );
    const rows = data.sexDistribution.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Sex", "Count"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  if (data.petStatusDistribution.length > 0) {
    y = checkPage(doc, y, 16);
    y = subsection(doc, y, "6.4 Animal Status Distribution");
    y = paragraph(doc, y,
      "Animals in the system are categorized by their current status — available for adoption, in foster care, under medical treatment, or adopted. " +
      "This distribution helps management understand the flow of animals through the system and identify areas where intervention may be needed."
    );
    const rows = data.petStatusDistribution.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Status", "Count"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  if (data.ageDistribution.length > 0) {
    y = checkPage(doc, y, 16);
    y = subsection(doc, y, "6.5 Age Distribution");
    const topAge = data.ageDistribution.sort((a, b) => b.value - a.value)[0];
    y = paragraph(doc, y,
      `The largest age group is "${topAge.name}" with ${topAge.value} animals. ` +
      "Age demographics influence the type of care required, adoption marketing strategies, and the urgency of placement — younger animals typically " +
      "have higher adoption rates, while senior animals may need specialized medical attention and targeted promotion."
    );
    const rows = data.ageDistribution.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Age Group", "Count"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  if (data.shelterCapacity.length > 0) {
    y = checkPage(doc, y, 16);
    y = subsection(doc, y, "6.6 Shelter Capacity Utilization");
    y = paragraph(doc, y,
      "Shelter capacity data shows how each facility is being utilized relative to its maximum capacity. " +
      "Monitoring capacity utilization helps prevent overcrowding, ensures adequate living conditions for animals, " +
      "and supports planning for facility expansion or additional resource allocation."
    );
    const rows = data.shelterCapacity.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Shelter", "Occupancy"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── Health Analytics ──
  y = sectionTitle(doc, y, "7. Health Analytics");
  y = paragraph(doc, y,
    "Health analytics provide critical insights into the medical well-being of animals under shelter care. " +
    "This section covers vaccination coverage and overall health status distribution. " +
    "Regular monitoring of health metrics is essential for disease prevention, treatment planning, and ensuring the overall welfare of sheltered animals."
  );

  y = checkPage(doc, y, 12);
  y = subsection(doc, y, "7.1 Vaccination Coverage");
  y = paragraph(doc, y,
    `Vaccination coverage is at ${data.vaccinationCoverage}% of the total animal population. ` +
    `${data.vaccinationCoverage >= 70 ? "This is a strong indicator of effective preventive care programs." : "There is room for improvement in reaching more animals with essential vaccinations."} ` +
    "Maintaining high vaccination rates is critical for preventing disease outbreaks in shelter environments and ensuring animals are healthy prior to adoption."
  );

  if (data.healthStatus.length > 0) {
    y = checkPage(doc, y, 16);
    y = subsection(doc, y, "7.2 Health Status Breakdown");
    const healthy = data.healthStatus.find((r) =>
      r.name.toLowerCase().includes("healthy") || r.name.toLowerCase().includes("good")
    );
    const sick = data.healthStatus.find((r) =>
      r.name.toLowerCase().includes("sick") || r.name.toLowerCase().includes("treatment")
    );
    y = paragraph(doc, y,
      `${healthy ? `${healthy.value} animals are reported in healthy condition` : "Health status data is being recorded"}${sick ? `, while ${sick.value} animals are currently under medical treatment or monitoring.` : "."} ` +
      "Early identification of health issues enables timely veterinary intervention and improves recovery outcomes."
    );
    const rows = data.healthStatus.map((r) => [r.name, String(r.value)]);
    autoTable(doc, {
      startY: y,
      head: [["Status", "Count"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── Performance Metrics ──
  y = sectionTitle(doc, y, "8. Performance Metrics");
  y = paragraph(doc, y,
    "Performance metrics provide a quantitative assessment of organizational efficiency and effectiveness across key operational areas. " +
    "These metrics are essential for tracking progress against strategic goals and identifying areas that require attention or improvement."
  );

  if (data.performanceMetrics.length > 0) {
    y = checkPage(doc, y, 14);
    const improving = data.performanceMetrics.filter((m) => m.change != null && m.change > 0);
    const declining = data.performanceMetrics.filter((m) => m.change != null && m.change < 0);
    y = paragraph(doc, y,
      `Of the ${data.performanceMetrics.length} tracked metrics, ${improving.length} show positive momentum and ${declining.length} indicate declining performance. ` +
      "This balanced view helps leadership focus efforts on areas needing improvement while reinforcing strategies that are yielding positive results."
    );

    const rows = data.performanceMetrics.map((m) => [
      m.label,
      m.value,
      m.change != null ? `${m.change >= 0 ? "+" : ""}${m.change}%` : "—",
    ]);
    autoTable(doc, {
      startY: y,
      head: [["Metric", "Value", "Change"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── Recent Analytics ──
  y = sectionTitle(doc, y, "9. Period-over-Period Comparison");
  y = paragraph(doc, y,
    "This section compares current period metrics against previous period values to highlight trends and changes in operational performance. " +
    "Period-over-period analysis is a key tool for understanding whether the organization is moving in the right direction and identifying " +
    "emerging patterns that may require strategic adjustments."
  );

  if (data.recentAnalytics.length > 0) {
    y = checkPage(doc, y, 14);
    const improving2 = data.recentAnalytics.filter((r) => r.trend === "up");
    const declining2 = data.recentAnalytics.filter((r) => r.trend === "down");
    y = paragraph(doc, y,
      `Compared to the previous period, ${improving2.length} metrics show improvement while ${declining2.length} metrics show decline. ` +
      "This comparative analysis provides a clear picture of organizational momentum and helps prioritize areas for intervention."
    );

    const rows = data.recentAnalytics.map((r) => [
      r.metric,
      r.current,
      r.previous,
      r.change != null ? `${r.change >= 0 ? "+" : ""}${r.change}%` : "—",
      r.trend === "up" ? "Improving" : "Declining",
    ]);
    autoTable(doc, {
      startY: y,
      head: [["Metric", "Current", "Previous", "% Change", "Trend"]],
      body: rows,
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: CONTENT_WIDTH,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [50, 50, 50], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── Conclusion ──
  y = sectionTitle(doc, y, "10. Conclusion and Recommendations");
  y = paragraph(doc, y,
    "This report has presented a comprehensive analysis of the animal welfare operations managed through the PawConnect system. " +
    "The data reveals both strengths and opportunities for improvement across adoption services, rescue operations, community engagement, " +
    "and animal health management."
  );
  y = paragraph(doc, y,
    `Key takeaways include: (1) Adoption activity remains steady with ${totalAdoptions} completed adoptions, with peak demand in ${data.adoptionTrend.length > 0 ? [...data.adoptionTrend].sort((a, b) => b.adoptions - a.adoptions)[0].month : "the reported period"}. ` +
    `(2) Rescue operations handled ${totalRescues} cases with a ${successPct}% success rate and ${data.avgResponseMinutes}-minute average response time. ` +
    `(3) Community engagement generated ${totalReports} reports, reflecting strong public participation in animal welfare. ` +
    `(4) Vaccination coverage at ${data.vaccinationCoverage}% indicates ${data.vaccinationCoverage >= 70 ? "robust" : "developing"} preventive health practices.`
  );
  y = paragraph(doc, y,
    "Recommended actions based on these findings include: continuing to invest in adoption promotion programs, enhancing rescue response " +
    "capabilities to further improve response times, strengthening community engagement initiatives in less active barangays, " +
    `and ${data.vaccinationCoverage < 80 ? "expanding vaccination outreach to increase coverage beyond current levels." : "maintaining the current high vaccination standards."}`
  );

  y += 6;
  doc.setDrawColor(210, 210, 210);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("PawConnect Animal Welfare Management System — Analytics Report", MARGIN, y);

  footer(doc);

  const filename = `analytics-report-${sanitizePeriodLabel(periodLabel)}.pdf`;
  doc.save(filename);
}
