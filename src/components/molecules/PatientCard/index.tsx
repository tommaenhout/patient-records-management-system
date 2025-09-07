import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PatientRecord } from "../../../interfaces/patient";
import Avatar from "../../atoms/Avatar";
import { formatDate } from "@/helpers/date";
import { formatWebsiteUrl } from "@/helpers/string";
import Edit from "@/components/svg/Edit";
import Expand from "@/components/svg/Expand";
import Web from "@/components/svg/Web";
import { PatientModalForm } from "../PatientModalForm";

interface PatientCardProps {
  patient: PatientRecord;
  className?: string;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
    <div
      className={`
      bg-white rounded-2xl border border-gray-200 h-fit p-6 shadow-sm
       w-full
      ${className}
    `}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar name={patient.name} avatar={patient.avatar} size="md" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{patient.name}</h2>
            <p className="text-sm text-gray-500">
              Added {formatDate(patient.createdAt)}
            </p>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsModalOpen(true)}>
            <Edit />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Expand
              className={`text-gray-400 transition-transform ${
                !isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              opacity: { duration: 0.2 },
            }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pt-4">
              {/* Description Section */}
              {patient.description && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {patient.description}
                  </p>
                </motion.div>
              )}

              {/* Website Section */}
              {patient.website && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Website
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Web className="text-gray-400" />
                    <a
                      href={formatWebsiteUrl(patient.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {formatWebsiteUrl(patient.website)}
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Footer Section */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className="flex items-center justify-between pt-4 border-t border-gray-100"
              >
                <div className="text-sm text-gray-500 max-w-[150px] line-clamp-1">ID: {patient.id}</div>
                <div className="text-sm text-gray-500 line-clamp-1">
                  {formatDate(patient.createdAt)}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    <PatientModalForm patient={patient} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default PatientCard;
