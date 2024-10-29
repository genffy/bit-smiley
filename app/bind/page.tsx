'use client';

import { useState } from "react";
import { ethers } from 'ethers'

const provider = new ethers.JsonRpcProvider('https://rpc.merlinchain.io/', {
  chainId: 4200,
  name: 'merlin',
})

const ABI =
  [{
    type: 'event',
    anonymous: false,
    inputs: [{
      name: 'original',
      internalType: 'address',
      type: 'address',
      indexed: false
    }, {
      name: 'newAddr',
      internalType: 'address',
      type: 'address',
      indexed: false
    }],
    name: 'BeneficiaryTransferred'
  }, {
    type: 'function',
    inputs: [{
      name: '',
      internalType: 'address',
      type: 'address'
    }],
    name: 'beneficiaries',
    outputs: [{
      name: '',
      internalType: 'address',
      type: 'address'
    }],
    stateMutability: 'view'
  }, {
    type: 'function',
    inputs: [{
      name: '_to',
      internalType: 'address',
      type: 'address'
    }],
    name: 'transferBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable'
  }]
// random wallet from https://rareeth.pro/ 
const wallet = new ethers.Wallet('91edb96619e4576054c2ca00e6209dce0cba9231e9b2ab39e3bcee63a3b80898', provider)
const contractMaker = new ethers.Contract('0x2273818E17138eB10E2116882Fb629b6D3C54b2e', ABI, wallet)
export default function Home() {
  const [aaEvm, setAaEvm] = useState<string>('')
  const [res, setRes] = useState<string>('')
  function doSsearch() {
    contractMaker.beneficiaries(aaEvm).then((res) => {
      if (res === "0x0000000000000000000000000000000000000000") {
        setRes("Address not bound");
      } else {
        setRes(res);
      }
    }).catch(() => {
      alert('please check your address and try again')
    })
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Address Binding Query</h1>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">
              Enter Address
            </label>
            <input
              id="address"
              type="text"
              value={aaEvm}
              onChange={(e) => setAaEvm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900"
              placeholder="Enter address to query..."
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
      </div>
    </div>
  );
}
