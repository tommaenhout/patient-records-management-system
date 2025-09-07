import React from 'react';
import { motion } from 'framer-motion';
import type { PatientRecord } from '../../../interfaces/patient';
import PatientCard from '../PatientCard';
import UserCardSkeleton from '../../skeletons/UserCardSkeleton';

interface PatientListProps {
  patients: PatientRecord[];
  loading?: boolean;
  className?: string;
}

const PatientList: React.FC<PatientListProps> = ({ patients, loading = false, className = '' }) => {
  if (loading) {
    return (
      <motion.div 
        className={`w-full ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <UserCardSkeleton className="w-full" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  if (patients.length === 0) {
    return (
      <motion.div 
        className={`text-center py-8 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-gray-500 text-lg">No patients found</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`w-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
          }
        }}
        initial="hidden"
        animate="show"
      >
        {patients.map((patient) => (
          <motion.div
            key={patient.id}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.9 },
              show: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }
              }
            }}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
            layout
          >
            <PatientCard
              patient={patient}
              className="w-full"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PatientList;
