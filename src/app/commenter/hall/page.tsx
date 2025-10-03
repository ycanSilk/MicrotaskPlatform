import React from 'react';
import CommenterHallContentPage from '../hall-content/page';
import { BackButton } from './BackButton';

export default function CommenterHallPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center space-x-2">
          <BackButton />
          <h1 className="text-lg font-bold text-gray-800">抢单大厅</h1>
        </div>
      </div>
      <CommenterHallContentPage />
    </div>
  );
}


