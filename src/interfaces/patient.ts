export interface PatientRecord {
  createdAt: string;
  name: string;
  id: string;
  description?: string;
  website?: string;
  avatar?: string | Record<string, never>;
}


export type Avatar = PatientRecord["avatar"];
export type Name = PatientRecord["name"];
export type Date = PatientRecord["createdAt"];
export type id = PatientRecord["id"];

export type NewPatientRecord = Omit<PatientRecord, 'id'>;
export type Patients = PatientRecord[];
