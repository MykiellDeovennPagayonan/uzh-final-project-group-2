export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  type: 'Hospital' | 'Clinic' | 'Specialty' | 'Emergency';
  capacity: number;
  established: number;
  departments: string[];
  director: string;
  isActive: boolean;
}

export const clinics: Clinic[] = [
  {
    id: "CLI001",
    name: "Central Medical Center",
    address: "123 Main Street, Downtown, CA 90210",
    phone: "+1 (555) 123-4567",
    email: "info@centralmedical.com",
    type: "Hospital",
    capacity: 500,
    established: 1985,
    departments: ["Emergency", "Cardiology", "Neurology", "Orthopedics", "Pediatrics"],
    director: "Dr. Sarah Johnson",
    isActive: true
  },
  {
    id: "CLI002",
    name: "Sunshine Family Clinic",
    address: "456 Oak Avenue, Suburbia, CA 90211",
    phone: "+1 (555) 234-5678",
    email: "contact@sunshinefamily.com",
    type: "Clinic",
    capacity: 50,
    established: 2001,
    departments: ["Family Medicine", "Pediatrics", "Women's Health"],
    director: "Dr. Michael Chen",
    isActive: true
  },
  {
    id: "CLI003",
    name: "Heart & Vascular Institute",
    address: "789 Cardiac Lane, Medical District, CA 90212",
    phone: "+1 (555) 345-6789",
    email: "info@heartvascular.com",
    type: "Specialty",
    capacity: 150,
    established: 1998,
    departments: ["Cardiology", "Cardiac Surgery", "Vascular Surgery"],
    director: "Dr. Emily Rodriguez",
    isActive: true
  },
  {
    id: "CLI004",
    name: "QuickCare Urgent Center",
    address: "321 Rapid Street, Fastville, CA 90213",
    phone: "+1 (555) 456-7890",
    email: "urgent@quickcare.com",
    type: "Emergency",
    capacity: 75,
    established: 2010,
    departments: ["Emergency Medicine", "Urgent Care", "Radiology"],
    director: "Dr. David Park",
    isActive: true
  },
  {
    id: "CLI005",
    name: "Women's Health Associates",
    address: "654 Wellness Way, Healthtown, CA 90214",
    phone: "+1 (555) 567-8901",
    email: "info@womenshealth.com",
    type: "Specialty",
    capacity: 30,
    established: 2005,
    departments: ["Obstetrics", "Gynecology", "Fertility"],
    director: "Dr. Lisa Thompson",
    isActive: true
  },
  {
    id: "CLI006",
    name: "Riverside General Hospital",
    address: "987 River Road, Riverside, CA 90215",
    phone: "+1 (555) 678-9012",
    email: "admin@riversidegeneral.com",
    type: "Hospital",
    capacity: 800,
    established: 1972,
    departments: ["Emergency", "ICU", "Surgery", "Maternity", "Oncology", "Radiology"],
    director: "Dr. Robert Wilson",
    isActive: true
  },
  {
    id: "CLI007",
    name: "Pediatric Care Center",
    address: "246 Children's Circle, Kidstown, CA 90216",
    phone: "+1 (555) 789-0123",
    email: "care@pediatriccenter.com",
    type: "Specialty",
    capacity: 40,
    established: 2008,
    departments: ["Pediatrics", "Neonatology", "Pediatric Surgery"],
    director: "Dr. Jennifer Martinez",
    isActive: true
  },
  {
    id: "CLI008",
    name: "Metropolitan Emergency Hospital",
    address: "135 Emergency Boulevard, Metro City, CA 90217",
    phone: "+1 (555) 890-1234",
    email: "emergency@metroemergency.com",
    type: "Emergency",
    capacity: 200,
    established: 1995,
    departments: ["Emergency Medicine", "Trauma Surgery", "Critical Care"],
    director: "Dr. Thomas Anderson",
    isActive: true
  },
  {
    id: "CLI009",
    name: "Westside Medical Group",
    address: "357 West Street, Westside, CA 90218",
    phone: "+1 (555) 901-2345",
    email: "info@westsidemedical.com",
    type: "Clinic",
    capacity: 80,
    established: 2012,
    departments: ["Internal Medicine", "Family Practice", "Dermatology"],
    director: "Dr. Maria Garcia",
    isActive: true
  },
  {
    id: "CLI010",
    name: "Advanced Orthopedic Center",
    address: "468 Bone Avenue, Jointville, CA 90219",
    phone: "+1 (555) 012-3456",
    email: "contact@advancedortho.com",
    type: "Specialty",
    capacity: 60,
    established: 2003,
    departments: ["Orthopedics", "Sports Medicine", "Physical Therapy"],
    director: "Dr. Kevin Lee",
    isActive: true
  }
];

// Helper functions
export const getClinicById = (id: string): Clinic | undefined => {
  return clinics.find(clinic => clinic.id === id);
};

export const getClinicsByType = (type: Clinic['type']): Clinic[] => {
  return clinics.filter(clinic => clinic.type === type && clinic.isActive);
};

export const getActiveClinicNames = (): Array<{ id: string; name: string }> => {
  return clinics
    .filter(clinic => clinic.isActive)
    .map(clinic => ({ id: clinic.id, name: clinic.name }));
};

export const searchClinicsByName = (searchTerm: string): Clinic[] => {
  return clinics.filter(clinic => 
    clinic.isActive && 
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};