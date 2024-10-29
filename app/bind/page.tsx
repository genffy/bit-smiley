'use client';

import { useState } from "react";
import Image from 'next/image'

export default function Home() {
  const [aaEvm, setAaEvm] = useState<string>('')
  const [res, setRes] = useState<string>('')
  async function doSsearch() {
    const data = await fetch(`/api/bind?address=${aaEvm}&_t=${Date.now()}`, {
      "headers": {
        "accept": "application/json",
      },
      "body": null,
      "method": "POST",
    }).then(response => response.json()).catch(error => console.error(error));
    if(!!data.error){
      alert(data.error)
      setRes('')
      return
    } else {
      setRes(data.bindAddress)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">AA Address Binding Query</h1>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">
              Enter AA Address
            </label>
            <input
              id="address"
              type="text"
              value={aaEvm}
              onChange={(e) => setAaEvm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
              placeholder="Enter AA address to query..."
            />
          </div>

          <button
            onClick={doSsearch}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Query
          </button>

          {res && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-sm font-medium text-gray-700 mb-2">Result:</h2>
              <p className="text-gray-900 break-all">{res}</p>
            </div>
          )}
        </div>
        <div>
          <Image src="/how-to-get-aa-wallet.png"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            alt="how-to-get-aa-wallet-address" />
        </div>
      </div>
    </div>
  );
}
