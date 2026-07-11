export type StatusType = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Adopted';
export type ViewModeType = 'table' | 'card';

export interface AdoptionApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  animalName: string;
  animalPhoto: string;
  species: string;
  applicationDate: string;
  status: StatusType;
  assignedStaff?: string;
}
