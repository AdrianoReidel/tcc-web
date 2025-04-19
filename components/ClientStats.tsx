import React from 'react';
import Image from 'next/image';

export default function ClientStats() {
  return (
    <div className="bg-white shadow-xl rounded-lg flex items-center px-4 py-2 space-x-2">
      <div className="flex flex-col">
        <span className="font-bold text-sm">+10.000</span>
        <span className="text-xs text-gray-500">Clientes atendidos</span>
      </div>

      <div className="flex -space-x-2">
        <Image src="/images/generic-client-1.png" alt="Cliente 1" width={32} height={32} className="rounded-full" />
        <Image src="/images/generic-client-2.png" alt="Cliente 2" width={32} height={32} className="rounded-full" />
        <Image src="/images/generic-client-3.png" alt="Cliente 3" width={32} height={32} className="rounded-full" />
        <Image src="/images/generic-client-4.png" alt="Cliente 4" width={32} height={32} className="rounded-full" />
      </div>
    </div>
  );
}
