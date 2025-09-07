import { cleanUpData } from '../../helpers/list';
import type { Patients, PatientRecord } from '../../interfaces/patient';

describe('cleanUpData', () => {
  const createPatient = (overrides: Partial<PatientRecord> = {}): PatientRecord => ({
    id: '1',
    name: 'John Doe',
    description: 'Test patient',
    website: 'https://example.com',
    avatar: 'https://example.com/avatar.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  });

  describe('name formatting', () => {
    it('should trim whitespace from names', () => {
      const patients: Patients = [
        createPatient({ name: '  John Doe  ' }),
      ];

      const result = cleanUpData(patients);

      expect(result[0].name).toBe('John Doe');
    });

    it('should remove title prefixes (Ms., Mr., Mrs., Dr.)', () => {
      const patients: Patients = [
        createPatient({ id: '1', name: 'Ms. Jane Smith' }),
        createPatient({ id: '2', name: 'Mr. John Doe' }),
        createPatient({ id: '3', name: 'Mrs. Mary Johnson' }),
        createPatient({ id: '4', name: 'Dr. Robert Brown' }),
      ];

      const result = cleanUpData(patients);

      expect(result.find(p => p.id === '1')?.name).toBe('Jane Smith');
      expect(result.find(p => p.id === '2')?.name).toBe('John Doe');
      expect(result.find(p => p.id === '3')?.name).toBe('Mary Johnson');
      expect(result.find(p => p.id === '4')?.name).toBe('Robert Brown');
    });

    it('should handle case-insensitive title prefixes', () => {
      const patients: Patients = [
        createPatient({ id: '1', name: 'ms. jane smith' }),
        createPatient({ id: '2', name: 'MR. JOHN DOE' }),
        createPatient({ id: '3', name: 'Mrs. mary johnson' }),
        createPatient({ id: '4', name: 'DR. robert brown' }),
      ];

      const result = cleanUpData(patients);

      expect(result.find(p => p.id === '1')?.name).toBe('Jane Smith');
      expect(result.find(p => p.id === '2')?.name).toBe('John Doe');
      expect(result.find(p => p.id === '3')?.name).toBe('Mary Johnson');
      expect(result.find(p => p.id === '4')?.name).toBe('Robert Brown');
    });

    it('should capitalize each word properly', () => {
      const patients: Patients = [
        createPatient({ name: 'john doe' }),
        createPatient({ name: 'JANE SMITH' }),
        createPatient({ name: 'mary-jane watson' }),
        createPatient({ name: 'jean-claude van damme' }),
      ];

      const result = cleanUpData(patients);

      // Results are sorted alphabetically
      expect(result[0].name).toBe('Jane Smith');
      expect(result[1].name).toBe('Jean-claude Van Damme');
      expect(result[2].name).toBe('John Doe');
      expect(result[3].name).toBe('Mary-jane Watson');
    });

    it('should handle single names', () => {
      const patients: Patients = [
        createPatient({ name: 'madonna' }),
        createPatient({ name: 'CHER' }),
      ];

      const result = cleanUpData(patients);

      expect(result[0].name).toBe('Cher'); // Sorted alphabetically
      expect(result[1].name).toBe('Madonna');
    });

    it('should handle names with multiple spaces', () => {
      const patients: Patients = [
        createPatient({ name: 'john    doe' }),
        createPatient({ name: 'jane  marie  smith' }),
      ];

      const result = cleanUpData(patients);

      // The current implementation preserves multiple spaces between words
      // Results are sorted alphabetically
      expect(result[0].name).toBe('Jane  Marie  Smith');
      expect(result[1].name).toBe('John    Doe');
    });
  });

  describe('duplicate removal', () => {
    it('should remove duplicates with same name and description, keeping the newest', () => {
      const patients: Patients = [
        createPatient({
          id: '1',
          name: 'John Doe',
          description: 'Test patient',
          createdAt: '2024-01-01T00:00:00Z',
        }),
        createPatient({
          id: '2',
          name: 'John Doe',
          description: 'Test patient',
          createdAt: '2024-01-02T00:00:00Z', // Newer
        }),
        createPatient({
          id: '3',
          name: 'Jane Smith',
          description: 'Another patient',
          createdAt: '2024-01-01T00:00:00Z',
        }),
      ];

      const result = cleanUpData(patients);

      expect(result).toHaveLength(2);
      expect(result.find(p => p.name === 'John Doe')?.id).toBe('2'); // Newer one kept
      expect(result.find(p => p.name === 'Jane Smith')?.id).toBe('3');
    });

    it('should keep patients with same name but different descriptions', () => {
      const patients: Patients = [
        createPatient({
          id: '1',
          name: 'John Doe',
          description: 'Test patient 1',
          createdAt: '2024-01-01T00:00:00Z',
        }),
        createPatient({
          id: '2',
          name: 'John Doe',
          description: 'Test patient 2',
          createdAt: '2024-01-02T00:00:00Z',
        }),
      ];

      const result = cleanUpData(patients);

      expect(result).toHaveLength(2);
      expect(result.find(p => p.description === 'Test patient 1')).toBeDefined();
      expect(result.find(p => p.description === 'Test patient 2')).toBeDefined();
    });

    it('should keep patients with different names but same description', () => {
      const patients: Patients = [
        createPatient({
          id: '1',
          name: 'John Doe',
          description: 'Test patient',
          createdAt: '2024-01-01T00:00:00Z',
        }),
        createPatient({
          id: '2',
          name: 'Jane Smith',
          description: 'Test patient',
          createdAt: '2024-01-02T00:00:00Z',
        }),
      ];

      const result = cleanUpData(patients);

      expect(result).toHaveLength(2);
      expect(result.find(p => p.name === 'John Doe')).toBeDefined();
      expect(result.find(p => p.name === 'Jane Smith')).toBeDefined();
    });

    it('should handle multiple duplicates and keep the newest', () => {
      const patients: Patients = [
        createPatient({
          id: '1',
          name: 'John Doe',
          description: 'Test patient',
          createdAt: '2024-01-01T00:00:00Z',
        }),
        createPatient({
          id: '2',
          name: 'John Doe',
          description: 'Test patient',
          createdAt: '2024-01-03T00:00:00Z', // Newest
        }),
        createPatient({
          id: '3',
          name: 'John Doe',
          description: 'Test patient',
          createdAt: '2024-01-02T00:00:00Z',
        }),
      ];

      const result = cleanUpData(patients);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2'); // Newest one kept
    });

    it('should handle duplicate detection after name formatting', () => {
      const patients: Patients = [
        createPatient({
          id: '1',
          name: 'john doe',
          description: 'Test patient',
          createdAt: '2024-01-01T00:00:00Z',
        }),
        createPatient({
          id: '2',
          name: 'John Doe',
          description: 'Test patient',
          createdAt: '2024-01-02T00:00:00Z', // Newer
        }),
        createPatient({
          id: '3',
          name: 'Mr. John Doe',
          description: 'Test patient',
          createdAt: '2024-01-03T00:00:00Z', // Newest
        }),
      ];

      const result = cleanUpData(patients);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3'); // Newest one kept
      expect(result[0].name).toBe('John Doe'); // Formatted name
    });
  });

  describe('sorting', () => {
    it('should sort patients alphabetically by name (case-insensitive)', () => {
      const patients: Patients = [
        createPatient({ name: 'Zoe Wilson' }),
        createPatient({ name: 'alice Johnson' }),
        createPatient({ name: 'Bob Smith' }),
        createPatient({ name: 'charlie Brown' }),
      ];

      const result = cleanUpData(patients);

      expect(result[0].name).toBe('Alice Johnson');
      expect(result[1].name).toBe('Bob Smith');
      expect(result[2].name).toBe('Charlie Brown');
      expect(result[3].name).toBe('Zoe Wilson');
    });

    it('should handle special characters in sorting', () => {
      const patients: Patients = [
        createPatient({ name: 'Ñoño García' }),
        createPatient({ name: 'Aaron Smith' }),
        createPatient({ name: 'Åsa Andersson' }),
        createPatient({ name: 'Zebra Jones' }),
      ];

      const result = cleanUpData(patients);

      // Should use locale-aware sorting
      expect(result[0].name).toBe('Aaron Smith');
      expect(result[1].name).toBe('Åsa Andersson');
      expect(result[2].name).toBe('Ñoño García');
      expect(result[3].name).toBe('Zebra Jones');
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const patients: Patients = [];

      const result = cleanUpData(patients);

      expect(result).toEqual([]);
    });

    it('should handle single patient', () => {
      const patients: Patients = [
        createPatient({ name: 'john doe' }),
      ];

      const result = cleanUpData(patients);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John Doe');
    });

    it('should preserve all other patient properties', () => {
      const patients: Patients = [
        createPatient({
          id: '123',
          name: 'mr. john doe',
          description: 'Test description',
          website: 'https://test.com',
          avatar: 'https://test.com/avatar.jpg',
          createdAt: '2024-01-01T00:00:00Z',
        }),
      ];

      const result = cleanUpData(patients);

      expect(result[0]).toEqual({
        id: '123',
        name: 'John Doe', // Only name should be modified
        description: 'Test description',
        website: 'https://test.com',
        avatar: 'https://test.com/avatar.jpg',
        createdAt: '2024-01-01T00:00:00Z',
      });
    });

    it('should handle patients with undefined or null properties', () => {
      const patients: Patients = [
        {
          id: '1',
          name: 'john doe',
          description: 'Test patient',
          createdAt: '2024-01-01T00:00:00Z',
          // website and avatar are optional
        },
      ];

      const result = cleanUpData(patients);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John Doe');
      expect(result[0].website).toBeUndefined();
      expect(result[0].avatar).toBeUndefined();
    });

    it('should handle invalid date strings gracefully', () => {
      const patients: Patients = [
        createPatient({
          id: '1',
          name: 'John Doe',
          description: 'Test patient',
          createdAt: 'invalid-date-1',
        }),
        createPatient({
          id: '2',
          name: 'John Doe',
          description: 'Test patient',
          createdAt: 'invalid-date-2',
        }),
      ];

      const result = cleanUpData(patients);

      // Should not crash and should handle the comparison
      expect(result).toHaveLength(1);
    });
  });

  describe('integration tests', () => {
    it('should handle complex real-world data', () => {
      const patients: Patients = [
        createPatient({
          id: '1',
          name: '  DR. john smith  ',
          description: 'Cardiologist',
          createdAt: '2024-01-01T00:00:00Z',
        }),
        createPatient({
          id: '2',
          name: 'ms. jane DOE',
          description: 'Neurologist',
          createdAt: '2024-01-02T00:00:00Z',
        }),
        createPatient({
          id: '3',
          name: 'John Smith', // Duplicate after formatting
          description: 'Cardiologist',
          createdAt: '2024-01-03T00:00:00Z', // Newer
        }),
        createPatient({
          id: '4',
          name: 'alice johnson',
          description: 'Pediatrician',
          createdAt: '2024-01-01T00:00:00Z',
        }),
        createPatient({
          id: '5',
          name: 'Bob Wilson',
          description: 'Surgeon',
          createdAt: '2024-01-01T00:00:00Z',
        }),
      ];

      const result = cleanUpData(patients);

      expect(result).toHaveLength(4); // One duplicate removed
      
      // Check sorting
      expect(result[0].name).toBe('Alice Johnson');
      expect(result[1].name).toBe('Bob Wilson');
      expect(result[2].name).toBe('Jane Doe');
      expect(result[3].name).toBe('John Smith');
      
      // Check duplicate removal (newer John Smith kept)
      expect(result.find(p => p.name === 'John Smith')?.id).toBe('3');
      
      // Check name formatting
      expect(result.find(p => p.id === '2')?.name).toBe('Jane Doe');
      expect(result.find(p => p.id === '4')?.name).toBe('Alice Johnson');
    });
  });
});
