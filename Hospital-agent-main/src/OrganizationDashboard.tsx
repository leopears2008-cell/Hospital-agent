import React from 'react';
import { OrganizationProfile, UserButton, useOrganization } from '@clerk/react';
import { Link } from 'react-router-dom';

export default function OrganizationDashboard() {
  const { organization } = useOrganization();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Organization Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
          <UserButton />
        </div>
      </header>
      <main className="flex-1 w-full max-w-5xl p-8 flex flex-col items-center gap-8">
        {organization ? (
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-4">Welcome to {organization.name}</h2>
            <p className="text-slate-600 mb-8">Manage your organization members, settings, and billing.</p>
            <OrganizationProfile />
          </div>
        ) : (
          <div>Loading organization...</div>
        )}
      </main>
    </div>
  );
}
