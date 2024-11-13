'use client';

import React from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Highlight from '../../components/Highlight';
import Image from 'next/image';

function Profile() {
  const { user, isLoading } = useUser();

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 sm:mt-8 md:mt-10 px-4 sm:px-6 md:px-8">
      {isLoading && <Loading />}
      {user && (
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Profile Card */}
          <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Profile Picture */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-800">
                  <Image
                    src={user.picture}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex flex-col items-center sm:items-start gap-2 flex-grow">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100">
                  {user.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* User Meta Data Section */}
          <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-100">
                Profile Information
              </h3>
              
              {/* User Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                  <p className="text-sm text-gray-400 mb-1">Email Verified</p>
                  <p className="text-base text-gray-100">
                    {user.email_verified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                  <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                  <p className="text-base text-gray-100">
                    {new Date(user.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Raw Profile Data */}
          <div className="rounded-xl border-2 border-gray-800 bg-gray-950 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-100">
                Raw Profile Data
              </h3>
              <Highlight>
                {JSON.stringify(user, null, 2)}
              </Highlight>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});