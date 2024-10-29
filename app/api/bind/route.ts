
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

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  if (address) {
    try {
      const code = await provider.getCode(address);
      if (code !== '0x') {
        const bindAddress = await contractMaker.beneficiaries(address);
        if (bindAddress === '0x0000000000000000000000000000000000000000') {
          return Response.json({ error: `${address} not bound` });
        }
        return Response.json({ bindAddress, error: null });
      } else {
        return Response.json({ error: `${address} is not a AA wallet address` });
      }
    } catch (error) {
      return Response.json({ error: (error as unknown as Error).message });
    }
  } else {
    return Response.json({ error: 'Address is required' });
  }
}