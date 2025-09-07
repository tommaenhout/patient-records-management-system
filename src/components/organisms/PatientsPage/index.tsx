
import Alert from "@/components/atoms/Alert";
import { useGetPatients } from "@/hooks/useGetPatients";
import PatientList from "@/components/molecules/PatientList";
import { Header } from "@/components/molecules/Header";
import { useAppSelector } from "@/store/hooks";
import { cleanUpData } from "@/helpers/list";
import { PatientModalForm } from "@/components/molecules/PatientModalForm";
import { useMemo, useState } from "react";

export function PatientsPage() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
  
    const { loading } = useGetPatients();
    const filteredPatients = useAppSelector(
      (state) => state.patients.filteredPatients
    );
  
    const handleAddPatient = () => {
      setIsOpen(true);
    };
  
    const cleanedPatients = useMemo(
      () => cleanUpData(filteredPatients),
      [filteredPatients]
    );
  
    return (
      <>
        <Header onActionClick={handleAddPatient} />
        <div className="p-8">
          <PatientList patients={cleanedPatients} loading={loading} />
        </div>
        <PatientModalForm
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          patient={null}
        />
        <Alert />
      </>
    );
  }