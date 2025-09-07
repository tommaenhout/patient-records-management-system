import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import { TextInput } from "@/components/atoms/TextInput";
import type { NewPatientRecord, PatientRecord } from "@/interfaces/patient";
import { Modal } from "@/components/atoms/Modal";
import { patientSchema } from "./validations";
import { addPatient, updatePatient } from "@/store/slices/patientsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAlert } from "@/hooks/useAlert";

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientModalFormProps {
  patient?: PatientRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PatientModalForm: React.FC<PatientModalFormProps> = ({
  patient,
  onClose,
  isOpen,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>();
  const { showAlert } = useAlert();
  const { patients } = useAppSelector((state) => state.patients);
  const {
    register,
    handleSubmit,
    formState: { isValid },
    setValue,
    watch,
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: 'onChange',
    defaultValues: patient
      ? {
          name: patient.name || "",
          description: patient.description || "",
          website: patient.website || "",
          avatar: (patient.avatar as string) || "",
        }
      : {
          name: "",
          description: "",
          website: "",
          avatar: "",
        },
  });

  const watchedName = watch("name");
  const watchedDescription = watch("description");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (patient) {
      reset({
        name: patient.name || "",
        description: patient.description || "",
        website: patient.website || "",
        avatar: (patient.avatar as string) || "",
      });
      setSelectedAvatar((patient.avatar as string) || "");
    } else {
      reset({
        name: "",
        description: "",
        website: "",
        avatar: "",
      });
      setSelectedAvatar("");
    }
  }, [patient, reset]);

  const handleAvatarSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setSelectedAvatar(result);
          setValue("avatar", result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleClose = () => {
    reset();
    setSelectedAvatar("");
    onClose();
  };

  const onSubmit = (data: PatientFormData) => {
    if (patient) {
      const patientToUpdate: PatientRecord = {
        ...data,
        id: patient.id,
        createdAt: patient.createdAt,
      };
      dispatch(updatePatient(patientToUpdate));
      showAlert("Patient updated successfully", true);
    } else {
      if (
        patients.find(
          (p: PatientRecord) =>
            p.name.toLowerCase().trim() === data.name.toLowerCase().trim()
        )
      ) {
        showAlert("Patient with this name already exists", false);
        return;
      }
      const newPatientData: NewPatientRecord = {
        ...data,
        createdAt: new Date().toISOString(),
      };

      dispatch(addPatient(newPatientData));
      showAlert("Patient added successfully", true);
    }
    handleClose();
  };

  const isEdit = !!patient;
  const displayName = `${watchedName}`.trim() || "New Patient";
  const isEmpty = !watchedName.trim() || !watchedDescription?.trim();
  const isDisabled = !isValid || isEmpty;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-white rounded-lg py-4 md:px-4 max-w-full mx-auto">
        <h2 className="text-xl text-center md:text-left font-semibold text-gray-900 mb-4">
          {isEdit ? "Edit Patient" : "Create New Patient"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar and Name Section */}
          <div className="flex flex-col  justify-center md:flex-row md:items-center md:space-x-12 space-y-4 md:space-y-0">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-1 md:flex-shrink-0">
              <div
                onClick={handleAvatarSelect}
                className="cursor-pointer mt-0  md:mt-2 hover:opacity-80 transition-opacity"
              >
                <Avatar
                  avatar={selectedAvatar || patient?.avatar}
                  name={displayName}
                  size="xl"
                />
              </div>
            </div>

            {/* Name Input */}
            <div className="flex-1 mb-4 md:mb-0">
              <TextInput
                id="name"
                label="Name"
                placeholder="Enter name"
                required
                {...register("name")}
              />
            </div>
          </div>
          <TextInput
            id="description"
            label="Description"
            placeholder="Enter patient description"
            required
            multiline
            rows={3}
            {...register("description")}
          />

          <TextInput
            id="website"
            label="Website"
            type="url"
            placeholder="https://example.com (optional)"
            {...register("website")}
          />

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 line-clamp-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isDisabled}
            >
              <span className="line-clamp-1">
                {isEdit ? "Update Patient" : "Create Patient"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
