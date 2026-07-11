"use client";

import React, { useState, useRef } from 'react';
import styles from './Rescues.module.css';

type RescueStage = 'New Reports' | 'Verified Reports' | 'Rescue Operations';

interface RescueCase {
  id: string;
  animalType: string;
  condition: string;
  location: string;
  reporter: string;
  priority: string;
  stage: RescueStage;
  reportedDate: string;
  imageUrl: string;
  coords: { lat: number; lon: number };
  
  // Expanded administrative context
  status: string;
  species: string;
  breed: string;
  estimatedAge: string;
  sex: string;
  colorMarkings: string;
  size: string;
  injuries: string;
  temperament: string;
  collarTag: string;
  animalsInvolved: number;
  lastSeen: string;
  currentSituation: string;
  barangay: string;
  landmarks: string;
  contactNumber: string;
  email: string;
  reporterType: string;
  anonymous: string;
  assignedRescuer: string;
  rescueTeam: string;
  assignedDate: string;
  eta: string;
  dispatchTime: string;
  outcome: string;
}

const INITIAL_DATA: RescueCase[] = [
  { 
    id: 'REC-9011', 
    animalType: 'Stray Cat', 
    condition: 'Severe leg fracture near highway crossover', 
    location: '7th Avenue Metropark, Near Shell Station', 
    reporter: 'Jane Doe', 
    priority: 'Critical', 
    stage: 'New Reports', 
    reportedDate: '2026-07-11 08:30 AM', 
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500', 
    coords: { lat: 40.7588, lon: -73.9851 },
    status: 'Pending Review',
    species: 'Feline',
    breed: 'Domestic Shorthair',
    estimatedAge: '1-2 Years',
    sex: 'Female',
    colorMarkings: 'Calico pattern, white mittens',
    size: 'Small',
    injuries: 'Open compounding fracture on rear right limb',
    temperament: 'Fearful, hissing but non-aggressive',
    collarTag: 'No',
    animalsInvolved: 1,
    lastSeen: '2026-07-11 08:15 AM',
    currentSituation: 'Hiding beneath temporary construction road barriers',
    barangay: 'San Antonio',
    landmarks: 'Opposite Metrobank Highway Depot',
    contactNumber: '+63 917 123 4567',
    email: 'jane.doe@example.com',
    reporterType: 'Citizen',
    anonymous: 'No',
    assignedRescuer: 'Officer Mark Mendoza',
    rescueTeam: 'Alpha Team Alpha',
    assignedDate: '2026-07-11 08:45 AM',
    eta: '25 Minutes',
    dispatchTime: '2026-07-11 08:50 AM',
    outcome: 'Pending Active Target Extrication'
  },
  { 
    id: 'REC-9012', 
    animalType: 'Abandoned Dog', 
    condition: 'Extremely malnourished, tied outside warehouse infrastructure', 
    location: 'Oakridge Subd. Plot 4B', 
    reporter: 'Alex Smith', 
    priority: 'High', 
    stage: 'New Reports', 
    reportedDate: '2026-07-11 06:12 AM', 
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=500', 
    coords: { lat: 34.0522, lon: -118.2437 },
    status: 'Pending Dispatch Logistics',
    species: 'Canine',
    breed: 'Askal / Mixed Breed',
    estimatedAge: '8-10 Months',
    sex: 'Male',
    colorMarkings: 'Light brown, white patches on chest',
    size: 'Medium',
    injuries: 'No visible deep wounds, clear physical skin dehydration',
    temperament: 'Friendly, tail-wagging but weak',
    collarTag: 'Yes (No engraving details available)',
    animalsInvolved: 1,
    lastSeen: '2026-07-11 06:00 AM',
    currentSituation: 'Leashed to a rusted iron storage pipe container',
    barangay: 'Dadiangas North',
    landmarks: 'Behind Old Port Cold Storage Facility',
    contactNumber: '+63 918 765 4321',
    email: 'alex.smith@example.com',
    reporterType: 'Volunteer',
    anonymous: 'No',
    assignedRescuer: 'Sarah Jenkins',
    rescueTeam: 'Delta Unit K9',
    assignedDate: '2026-07-11 07:00 AM',
    eta: '10 Minutes',
    dispatchTime: '2026-07-11 07:05 AM',
    outcome: 'Awaiting On-Site Arrival Assessment'
  }
];

const WORKFLOW_ACTIONS = [
  { id: 'verify', label: 'Verify Report' },
  { id: 'assign', label: 'Assign Rescuer' },
  { id: 'priority', label: 'Update Priority' },
  { id: 'status', label: 'Update Rescue Status' },
  { id: 'map', label: 'View Map' },
  { id: 'contact', label: 'Contact Reporter' },
  { id: 'notes', label: 'Add Notes' },
  { id: 'close', label: 'Close Case' }
];

export default function RescuesPage() {
  const [cases] = useState<RescueCase[]>(INITIAL_DATA);
  const [selectedCaseDetails, setSelectedCaseDetails] = useState<RescueCase | null>(null);
  
  // Dropdown Component Context Flags
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(WORKFLOW_ACTIONS[0]);

  const leftPanelScrollRef = useRef<HTMLDivElement>(null);

  const categories: { stage: RescueStage }[] = [
    { stage: 'New Reports' },
    { stage: 'Verified Reports' },
    { stage: 'Rescue Operations' }
  ];

  const triggerScrollStepDown = () => {
    if (leftPanelScrollRef.current) {
      leftPanelScrollRef.current.scrollBy({
        top: 240,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Rescue Pipeline Registry</h1>
      </header>

      {categories.map((cat) => {
        const filteredCases = cases.filter(c => c.stage === cat.stage);
        return (
          <section key={cat.stage} className={styles.sectionWrapper}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{cat.stage}</h2>
            </div>
            
            <div className={styles.rescueGrid}>
              {filteredCases.map((item) => (
                <div key={item.id} className={styles.caseCard}>
                  {/* Distinct background layer decoration element */}
                  <div className={styles.cardBlobBottomLeft} />

                  <div className={styles.cardAvatarHeader}>
                    <div>
                      <span className={styles.caseId}>{item.id}</span>
                    </div>
                    <div className={styles.cardAvatarFrame}>
                      <img src={item.imageUrl} alt="" className={styles.cardInnerImage} />
                    </div>
                  </div>

                  <div className={styles.cardContentBlock}>
                    <div>
                      <h3 className={styles.animalName}>{item.animalType}</h3>
                      <p className={styles.cardBody}>
                        {item.condition.length > 55 ? `${item.condition.substring(0, 55)}...` : item.condition}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                      <button 
                        type="button" 
                        className={styles.viewDetailsTrigger}
                        onClick={() => {
                          setSelectedCaseDetails(item);
                          setIsDropdownOpen(false);
                        }}
                        aria-label="Inspect comprehensive dashboard details panel"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {selectedCaseDetails && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            
            {/* Modal Header containing structured Horizontal Management Row Layout */}
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.animalName} style={{ fontSize: '1.05rem', margin: 0 }}>Rescue Report Details</h3>
                <span className={styles.caseId}>Tracking Node Hash Reference: {selectedCaseDetails.id}</span>
              </div>

              <div className={styles.headerControlsGroup}>
                
                {/* Custom Styled Select Element (Matches shadcn UI design specifications) */}
                <div className={styles.customSelectContainer}>
                  <button 
                    type="button"
                    className={styles.customSelectTrigger}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>{activeAction.label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className={styles.customSelectMenu}>
                      {WORKFLOW_ACTIONS.map((action) => (
                        <div
                          key={action.id}
                          className={`${styles.customSelectItem} ${activeAction.id === action.id ? styles.customSelectItemSelected : ''}`}
                          onClick={() => {
                            setActiveAction(action);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {action.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="button" 
                  className={`${styles.btnBase} ${styles.btnActionExecute}`}
                  onClick={() => alert(`Executed workflow parameter node: "${activeAction.label}"`)}
                >
                  Execute Action
                </button>

                <button 
                  type="button" 
                  className={`${styles.btnBase} ${styles.btnSecondary}`} 
                  onClick={() => setSelectedCaseDetails(null)}
                >
                  Close Profile
                </button>
              </div>
            </div>

            <div className={styles.modalBodyGrid}>
              
              {/* Left Column Structural Container - Native Scrollbar Elements Excluded */}
              <div className={styles.modalLeftColumnWrapper}>
                <div className={styles.modalLeftColumn} ref={leftPanelScrollRef}>
                  
                  {/* Clean Circle Profile Frame view */}
                  <div className={styles.avatarContainer}>
                    <div className={styles.circleAvatarFrame}>
                      <img src={selectedCaseDetails.imageUrl} alt="Animal Incident Target Profile" className={styles.cardInnerImage} />
                    </div>
                  </div>

                  {/* SECTION 1: REPORT DETAILS */}
                  <div className={styles.dataSegmentBlock}>
                    <h4 className={styles.segmentTitle}>Report Details</h4>
                    <div className={styles.dataFieldsGrid}>
                      <div>
                        <div className={styles.fieldLabel}>Report ID</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.id}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Report Status</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.status}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Report Type</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.animalType}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Priority Level</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.priority}</div>
                      </div>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Date & Time Reported</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.reportedDate}</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: ANIMAL DETAILS */}
                  <div className={styles.dataSegmentBlock}>
                    <h4 className={styles.segmentTitle}>Animal Details</h4>
                    <div className={styles.dataFieldsGrid}>
                      <div>
                        <div className={styles.fieldLabel}>Animal Name</div>
                        <div className={styles.fieldValue}>Unknown / Unassigned</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Species</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.species}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Breed</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.breed}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Estimated Age</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.estimatedAge}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Sex</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.sex}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Size</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.size}</div>
                      </div>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Color/Markings</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.colorMarkings}</div>
                      </div>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Physical Condition</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.condition}</div>
                      </div>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Visible Injuries</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.injuries}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Behavior/Temperament</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.temperament}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Collar or Tag</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.collarTag}</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: INCIDENT DETAILS */}
                  <div className={styles.dataSegmentBlock}>
                    <h4 className={styles.segmentTitle}>Incident Details</h4>
                    <div className={styles.dataFieldsGrid}>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Incident Description</div>
                        <div className={styles.fieldValue}>The dispatch case asset target manifests an active emergency state matching reported profile. Needs immediate triage context application.</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Animals Involved</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.animalsInvolved}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Last Seen Date & Time</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.lastSeen}</div>
                      </div>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Current Situation</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.currentSituation}</div>
                      </div>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Additional Notes</div>
                        <div className={styles.fieldValue}>N/A - No auxiliary notes append records.</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: LOCATION DETAILS */}
                  <div className={styles.dataSegmentBlock}>
                    <h4 className={styles.segmentTitle}>Location Details</h4>
                    <div className={styles.dataFieldsGrid}>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Complete Address</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.location}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Barangay</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.barangay}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Nearby Landmark</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.landmarks}</div>
                      </div>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>GPS Coordinates</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.coords.lat}, {selectedCaseDetails.coords.lon}</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: REPORTER DETAILS */}
                  <div className={styles.dataSegmentBlock}>
                    <h4 className={styles.segmentTitle}>Reporter Details</h4>
                    <div className={styles.dataFieldsGrid}>
                      <div>
                        <div className={styles.fieldLabel}>Reporter Name</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.reporter}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Contact Number</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.contactNumber}</div>
                      </div>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Email Address</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.email}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Reporter Type</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.reporterType}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Anonymous Report</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.anonymous}</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 6: UPLOADED EVIDENCE */}
                  <div className={styles.dataSegmentBlock}>
                    <h4 className={styles.segmentTitle}>Uploaded Evidence</h4>
                    <div className={styles.dataFieldsGrid}>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Attached Files List</div>
                        <div className={styles.fieldValue} style={{ color: '#0284c7', fontSize: '0.75rem', textDecoration: 'underline' }}>
                          📸 {selectedCaseDetails.id}_intake_primary.png
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 7: RESCUE ASSIGNMENT */}
                  <div className={styles.dataSegmentBlock}>
                    <h4 className={styles.segmentTitle}>Rescue Assignment</h4>
                    <div className={styles.dataFieldsGrid}>
                      <div>
                        <div className={styles.fieldLabel}>Assigned Rescuer</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.assignedRescuer}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Rescue Team</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.rescueTeam}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Assigned Date</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.assignedDate}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Est. Response Time</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.eta}</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 8: RESCUE PROGRESS */}
                  <div className={styles.dataSegmentBlock}>
                    <h4 className={styles.segmentTitle}>Rescue Progress</h4>
                    <div className={styles.dataFieldsGrid}>
                      <div>
                        <div className={styles.fieldLabel}>Current Operational Status</div>
                        <div className={styles.fieldValue}>In Progress</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Verification Status</div>
                        <div className={styles.fieldValue}>Verified True Report</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Dispatch Time</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.dispatchTime}</div>
                      </div>
                      <div>
                        <div className={styles.fieldLabel}>Rescue Completion Time</div>
                        <div className={styles.fieldValue}>--:--</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 9: RESCUE OUTCOME */}
                  <div className={styles.dataSegmentBlock}>
                    <h4 className={styles.segmentTitle}>Rescue Outcome</h4>
                    <div className={styles.dataFieldsGrid}>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Current Outcome Metric</div>
                        <div className={styles.fieldValue}>{selectedCaseDetails.outcome}</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 10: ADMIN NOTES */}
                  <div className={styles.dataSegmentBlock}>
                    <h4 className={styles.segmentTitle}>Admin Notes</h4>
                    <div className={styles.dataFieldsGrid}>
                      <div className={styles.dataFieldFullWidth}>
                        <div className={styles.fieldLabel}>Internal Dispatch Notes</div>
                        <div className={styles.fieldValue}>Deploying transport cage unit asset variants based on species matching profiles.</div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 11: ACTIVITY TIMELINE */}
                  <div className={styles.dataSegmentBlock}>
                    <h4 className={styles.segmentTitle}>Activity Timeline</h4>
                    <div className={styles.timelineContainer}>
                      <div className={styles.timelineNode}>
                        <div className={`${styles.timelineMarker} ${styles.timelineMarkerActive}`} />
                        <div className={styles.timelineContent}>
                          <span className={styles.timelineStepTitle}>Report Submitted</span>
                          <span className={styles.timelineTimestamp}>{selectedCaseDetails.reportedDate}</span>
                        </div>
                      </div>
                      <div className={styles.timelineNode}>
                        <div className={`${styles.timelineMarker} ${styles.timelineMarkerActive}`} />
                        <div className={styles.timelineContent}>
                          <span className={styles.timelineStepTitle}>Report Verified</span>
                          <span className={styles.timelineTimestamp}>{selectedCaseDetails.assignedDate}</span>
                        </div>
                      </div>
                      <div className={styles.timelineNode}>
                        <div className={styles.timelineMarker} />
                        <div className={styles.timelineContent}>
                          <span className={styles.timelineStepTitle}>Rescuer Assigned & Dispatched</span>
                          <span className={styles.timelineTimestamp}>Pending Progress Node</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Fixed Control Interface enabling scrolling without visible browser scrollbar */}
                <div className={styles.stickyScrollFooter}>
                  <button 
                    type="button"
                    className={styles.scrollDownActionButton}
                    onClick={triggerScrollStepDown}
                    title="Scroll down through report parameters"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="7 13 12 18 17 13"></polyline>
                      <polyline points="7 6 12 11 17 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right Column Layout Frame displaying explicit map workspace */}
              <div className={styles.modalRightColumn}>
                <div className={styles.mapCanvasFrame}>
                  <iframe
                    title="Modern OpenStreetMap Location View"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedCaseDetails.coords.lon - 0.01}%2C${selectedCaseDetails.coords.lat - 0.01}%2C${selectedCaseDetails.coords.lon + 0.01}%2C${selectedCaseDetails.coords.lat + 0.01}&layer=mapnik&marker=${selectedCaseDetails.coords.lat}%2C${selectedCaseDetails.coords.lon}`}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}