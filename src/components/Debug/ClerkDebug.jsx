import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

const ClerkDebug = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { session } = useClerk();

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
      <h3 className="font-semibold text-yellow-800 mb-2">Clerk Debug Info:</h3>
      <div className="space-y-1 text-yellow-700">
        <div>Loaded: {isLoaded ? 'Yes' : 'No'}</div>
        <div>Signed In: {isSignedIn ? 'Yes' : 'No'}</div>
        <div>User: {user ? user.fullName || user.username : 'None'}</div>
        <div>Session: {session ? 'Active' : 'None'}</div>
        <div>Environment: {import.meta.env.MODE}</div>
      </div>
    </div>
  );
};

export default ClerkDebug;