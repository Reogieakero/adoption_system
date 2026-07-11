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

/** Full application record shown in the "View details" full-screen modal. */
export interface ApplicationDetails {
  personal: {
    applicantId: string;
    fullName: string;
    profilePhoto: string;
    dateOfBirth: string;
    age: number;
    sex: string;
    civilStatus: string;
    nationality: string;
  };
  contact: {
    email: string;
    mobileNumber: string;
    alternateContactNumber?: string;
  };
  address: {
    homeAddress: string;
    barangay: string;
    cityMunicipality: string;
    province: string;
    zipCode: string;
  };
  identification: {
    govIdType: string;
    govIdNumber?: string;
    govIdPhoto: string;
  };
  employment: {
    occupation: string;
    employer?: string;
    monthlyIncomeRange?: string;
  };
  household: {
    residenceType: 'House' | 'Apartment' | 'Condominium' | 'Others';
    homeOwnership: 'Owned' | 'Rented';
    householdMembers: number;
    children: number;
    hasExistingPets: boolean;
    existingPetsCount: number;
  };
  questionnaire: {
    whyAdopt: string;
    ownedPetBefore: string;
    primaryCaregiver: string;
    hoursAlone: string;
    canProvideVetCare: string;
    householdInFavor: string;
    hasSecureArea: string;
  };
  documents: {
    governmentId: string;
    proofOfAddress: string;
    proofOfIncome?: string;
    otherDocuments: string[];
  };
  applicationInfo: {
    requestId: string;
    dateSubmitted: string;
    status: StatusType;
    preferredContactMethod: string;
    preferredAdoptionDate: string;
  };
  emergencyContact: {
    fullName: string;
    relationship: string;
    contactNumber: string;
  };
}