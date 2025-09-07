import type { Patients } from '../interfaces/patient';

export const cleanUpData = (patients: Patients): Patients => {
  const filtered = [...patients]
    .map(patient => ({
      ...patient,
      name: patient.name.trim()
        .replace(/^(Ms\.|Mr\.|Mrs\.|Dr\.)\s*/i, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }));

  // Remove duplicates with same name and description, keeping the newest
  const uniquePatients = filtered.reduce((acc, current) => {
    const existing = acc.find(p => 
      p.name === current.name && 
      p.description === current.description
    );
    
    if (existing) {
      // Keep the one with the newer createdAt date
      if (new Date(current.createdAt) > new Date(existing.createdAt)) {
        const index = acc.indexOf(existing);
        acc[index] = current;
      }
    } else {
      acc.push(current);
    }
    
    return acc;
  }, [] as Patients);

  return uniquePatients.sort((a, b) => 
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
};
