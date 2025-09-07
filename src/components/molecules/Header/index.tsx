import React, { useEffect, useState } from "react";
import { SearchBar } from "@/components/atoms/SearchBar";
import { Button } from "@/components/atoms/Button";
import Patients from "@/components/svg/Patients";
import Add from "@/components/svg/Add";
import { useDebounce } from "use-debounce";
import { useAppDispatch } from "@/store/hooks";
import { filterPatients } from "@/store/slices/patientsSlice";



interface HeaderProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actionButtonText?: string;
  onActionClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
   title="Patient Records Management",
   subtitle="Manage and view patient information",
   searchPlaceholder="Search patients...",
   actionButtonText="Add Patient",
   onActionClick,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedValue] = useDebounce(searchValue, 500);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(filterPatients(debouncedValue));
  }, [debouncedValue, dispatch]);
 
  return (
    <>
    <div className="bg-white/90 shadow-sm border-b fixed left-0 right-0 z-50  max-w-full border-gray-200 px-8 py-4">
      <div className="flex flex-col gap-3 md:flex-row items-center justify-between">
        {/* Left side - Title and subtitle */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg">
            <Patients />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 line-clamp-1">{title}</h1>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{subtitle}</p>
          </div>
        </div>

        {/* Right side - Search and Action button */}
        <div className="flex-col gap-2 md:flex-row flex w-full md:w-fit  items-start md:items-center space-x-4">
          <SearchBar
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={setSearchValue}
            className="w-full md:w-80 "
          />
          <Button
            onClick={onActionClick}
            variant="primary"
            className="flex w-full md:w-fit items-center space-x-2">
            <Add />
            <span className="text-nowrap">{actionButtonText}</span>
          </Button>
        </div>
      </div>
    </div>
    <div className="h-[200px] md:h-28 lg:h-20"/>
    </>
  );
};
