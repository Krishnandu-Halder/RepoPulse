import React from 'react';
import StatsCards from '../Dashboard/StatsCards';
import Charts from '../Dashboard/Charts';
import DataTable from '../Dashboard/DataTable';

const MainContent = () => {
  return (
    <main className="">
      <div className="grid mb-4 pb-10 px-8 mx-4 rounded-3xl bg-gray-100 border-4 border-green-400">
        <div className="grid grid-cols-12 gap-6">
          <div className="grid grid-cols-12 col-span-12 gap-6 xxl:col-span-9">
            <div className="col-span-12 mt-8">
              <div className="flex items-center h-10 intro-y">
                <h2 className="mr-5 text-lg font-medium truncate">GitHub Dashboard</h2>
              </div>
              
              {/* Stats Cards */}
              <StatsCards />
            </div>
            
            {/* Charts Section */}
            <div className="col-span-12 mt-5">
              <Charts />
            </div>
            
            {/* Data Table Section */}
            <div className="col-span-12 mt-5">
              <DataTable />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;