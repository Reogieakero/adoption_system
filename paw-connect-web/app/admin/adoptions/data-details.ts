import type { AdoptionApplication, ApplicationDetails } from './types';

/** Small deterministic hash so the same application always renders the same mock details. */
function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(seed: number, options: T[]): T {
  return options[seed % options.length];
}

const SEX_OPTIONS = ['Female', 'Male'];
const CIVIL_STATUS_OPTIONS = ['Single', 'Married', 'Widowed', 'Separated'];
const NATIONALITY_OPTIONS = ['Filipino', 'American', 'Canadian', 'Australian'];
const BARANGAYS = ['San Isidro', 'Poblacion', 'Bagong Silang', 'Santa Cruz', 'Malinis'];
const CITIES = ['Davao City', 'Quezon City', 'Cebu City', 'Baguio City', 'Iloilo City'];
const PROVINCES = ['Davao del Sur', 'Metro Manila', 'Cebu', 'Benguet', 'Iloilo'];
const GOV_ID_TYPES = ["Driver's License", 'Passport', 'PhilSys National ID', "Voter's ID"];
const OCCUPATIONS = ['Software Engineer', 'Registered Nurse', 'Teacher', 'Accountant', 'Small Business Owner'];
const INCOME_RANGES = ['₱20,000 - ₱35,000', '₱35,000 - ₱60,000', '₱60,000 - ₱100,000', '₱100,000+'];
const RESIDENCE_TYPES: ApplicationDetails['household']['residenceType'][] = ['House', 'Apartment', 'Condominium', 'Others'];
const OWNERSHIP: ApplicationDetails['household']['homeOwnership'][] = ['Owned', 'Rented'];
const CONTACT_METHODS = ['Email', 'Mobile call', 'SMS / Text'];

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

/** Builds a full mock ApplicationDetails record from the lightweight AdoptionApplication row. */
export function getApplicationDetails(app: AdoptionApplication): ApplicationDetails {
  const seed = hashSeed(app.id);

  const age = 22 + (seed % 35);
  const birthYear = 2026 - age;
  const dateOfBirth = `${birthYear}-${pad(1 + (seed % 12))}-${pad(1 + (seed % 28))}`;

  const householdMembers = 1 + (seed % 6);
  const children = seed % 3;
  const hasExistingPets = seed % 2 === 0;

  const mobileNumber = `+63 9${(100000000 + (seed % 899999999)).toString().slice(0, 9)}`;

  return {
    personal: {
      applicantId: `PA-${app.id.replace('APP-', '')}`,
      fullName: app.applicantName,
      profilePhoto: `https://i.pravatar.cc/200?u=${app.id}`,
      dateOfBirth,
      age,
      sex: pick(seed, SEX_OPTIONS),
      civilStatus: pick(seed + 1, CIVIL_STATUS_OPTIONS),
      nationality: pick(seed + 2, NATIONALITY_OPTIONS),
    },
    contact: {
      email: app.applicantEmail,
      mobileNumber,
      alternateContactNumber: seed % 3 === 0 ? undefined : `+63 9${((seed * 7) % 899999999 + 100000000).toString().slice(0, 9)}`,
    },
    address: {
      homeAddress: `${12 + (seed % 900)} ${pick(seed + 3, ['Mabini', 'Rizal', 'Bonifacio', 'Del Pilar', 'Magsaysay'])} Street`,
      barangay: pick(seed + 4, BARANGAYS),
      cityMunicipality: pick(seed + 5, CITIES),
      province: pick(seed + 5, PROVINCES),
      zipCode: `${8000 + (seed % 1900)}`,
    },
    identification: {
      govIdType: pick(seed + 6, GOV_ID_TYPES),
      govIdNumber: seed % 4 === 0 ? undefined : `••••••${(seed % 9000) + 1000}`,
      govIdPhoto: `https://placehold.co/480x300/e2e8f0/475569?text=Government+ID`,
    },
    employment: {
      occupation: pick(seed + 7, OCCUPATIONS),
      employer: seed % 5 === 0 ? undefined : pick(seed + 8, ['Northgate Solutions Inc.', 'Riverside Medical Center', 'Evergreen Academy', 'Summit Accounting Group', 'Self-employed']),
      monthlyIncomeRange: seed % 6 === 0 ? undefined : pick(seed + 9, INCOME_RANGES),
    },
    household: {
      residenceType: pick(seed + 10, RESIDENCE_TYPES),
      homeOwnership: pick(seed + 11, OWNERSHIP),
      householdMembers,
      children,
      hasExistingPets,
      existingPetsCount: hasExistingPets ? 1 + (seed % 3) : 0,
    },
    questionnaire: {
      whyAdopt: `I've always felt a strong connection to ${app.species.toLowerCase()}s and want to give ${app.animalName} a loving, permanent home.`,
      ownedPetBefore: seed % 2 === 0 ? 'Yes, grew up with pets at home.' : 'No, this would be my first pet.',
      primaryCaregiver: app.applicantName,
      hoursAlone: pick(seed + 12, ['Less than 2 hours', '2 - 4 hours', '4 - 6 hours', '6+ hours']),
      canProvideVetCare: 'Yes, I can commit to regular check-ups and vaccinations.',
      householdInFavor: 'Yes, everyone at home is on board with the adoption.',
      hasSecureArea: 'Yes, we have a fenced yard / dedicated pet space.',
    },
    documents: {
      governmentId: `https://placehold.co/480x300/e2e8f0/475569?text=Government+ID`,
      proofOfAddress: `https://placehold.co/480x300/e2e8f0/475569?text=Proof+of+Address`,
      proofOfIncome: seed % 4 === 0 ? undefined : `https://placehold.co/480x300/e2e8f0/475569?text=Proof+of+Income`,
      otherDocuments: seed % 3 === 0 ? [`https://placehold.co/480x300/e2e8f0/475569?text=Home+Photo`] : [],
    },
    applicationInfo: {
      requestId: app.id,
      dateSubmitted: app.applicationDate,
      status: app.status,
      preferredContactMethod: pick(seed + 13, CONTACT_METHODS),
      preferredAdoptionDate: app.applicationDate,
    },
    emergencyContact: {
      fullName: pick(seed + 14, ['Anna Cruz', 'Michael Reyes', 'Grace Santos', 'Paolo Ramirez', 'Kristine Villanueva']),
      relationship: pick(seed + 15, ['Sibling', 'Parent', 'Spouse', 'Friend']),
      contactNumber: `+63 9${((seed * 13) % 899999999 + 100000000).toString().slice(0, 9)}`,
    },
  };
}