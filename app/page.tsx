"use client";

import { useState } from "react";
type TypeType = 1 | 2 | 3 | 4 | 5 | 6
type ConfigType = {
  type: TypeType;
  title: string;
  shortTitle: string;
  airdropAmount: number;
  status: number;
  mediumLink: string;
  date: string;
}
type ResultType = {
  address: string;
  addressLong: string;
  addressShort: string;
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
  value6: number;
}
const config: ConfigType[] = [
  {
    "type": 1,
    "title": 'Invalid bit-Disc Black Inscription gas cover',
    "shortTitle": "Invalid",
    "airdropAmount": 0,
    "status": 0,
    "mediumLink": "https://medium.com/@bitsmiley/bitsmiley-harvest-season-airdrop-feeb4163f73f",
    "date": "10/17",
  },
  {
    "type": 2,
    "title": "Stake bit-Disc Black (bitJade)",
    "shortTitle": "bitJade",
    "airdropAmount": 0,
    "status": 0,
    "mediumLink": "https://medium.com/@bitsmiley/bitsmiley-harvest-season-airdrop-feeb4163f73f",
    "date": "10/28",
  },
  {
    "type": 3,
    "title": "The Truememe show",
    "shortTitle": "Truememe",
    "airdropAmount": 0,
    "status": 2,
    "mediumLink": "https://medium.com/@bitsmiley/the-truememe-show-airdrop-rules-and-distribution-d4923f2db9c9",
    "date": "10/15",
  },
  {
    "type": 4,
    "title": "Pre-Season bitPoint",
    "shortTitle": "Pre-S",
    "airdropAmount": 0,
    "status": 0,
    "mediumLink": "https://medium.com/@bitsmiley/bitsmiley-harvest-season-airdrop-feeb4163f73f",
    "date": "10/21",
  },
  {
    "type": 5,
    "title": "Season One bitPoint",
    "shortTitle": "S-One",
    "airdropAmount": 0,
    "status": 0,
    "mediumLink": "https://medium.com/@bitsmiley/bitsmiley-harvest-season-airdrop-feeb4163f73f",
    "date": "10/23",
  },
  {
    "type": 6,
    "title": "Special: bitSmiley Community Events",
    "shortTitle": "Role",
    "airdropAmount": 0,
    "status": 0,
    "mediumLink": "https://medium.com/@bitsmiley/bitsmiley-harvest-season-airdrop-feeb4163f73f",
    "date": "10/25",
  }
]
export default function Home() {
  const [value, setValue] = useState<string>('')
  const [result, setResult] = useState<ResultType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number[]>([0,0,0,0,0,0,0])
  function getValueKey(config: ConfigType): keyof Omit<ResultType, 'address'|'addressLong'|'addressShort'> {
    return `value${config.type}`
  }
  function copyAddress(address: string){
    try{
      navigator.clipboard.writeText(address)
      alert(`Copied: ${address}`)
    } catch(e){
      alert(`Copy failed: ${(e as Error).message}`)
    }
  }
  function formatNum(num: number){
    if(!num) return '0'
    return  `${num.toFixed()}`
  }

  function dynamicDisplay(value: string|number, short: string|number){
    return <>
      <span className="inline sm:hidden">{short}</span>
      <span className="hidden sm:inline">{value}</span>
    </>
  }
  function getRows(){
    return  result.map((item, idx)=>{
      return <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th scope="row"  className="p-0.5 sm:px-3 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={()=>copyAddress(item.address)}>
          {dynamicDisplay(item.addressLong, item.addressShort)}
        </th>
        {
          config.map((conf, i) => {
            return <td className="p-0.5 sm:px-3" key={i}>{dynamicDisplay(item[getValueKey(conf)], formatNum(item[getValueKey(conf)]))}</td>
          })
        }
      </tr> 
    })
  }
  function handleSearch(){
    const avaiableAddress = value.split(/,|;|\s/).map(d=>d.trim()).filter(d=>!!d)
    if(!avaiableAddress.length) return
    const data = avaiableAddress.map(async (item)=>{
      const data = await fetch(`/api/airdrop?address=${item}&_t=${Date.now()}`, {
        "headers": {
          "accept": "application/json",
        },
        "body": null,
        "method": "POST",
      }).then(response => response.json()).catch(error => console.error(error));
      const res: ResultType = {} as ResultType
      if(data.code === 0){
        const resData = data.data as unknown as ConfigType[]
        res.address = item
        res.addressLong = item.replace(/^(.{6})(.*)(.{4})$/, "$1...$3")
        res.addressShort = item.replace(/^(.{2})(.*)(.{4})$/, "$1.$3")
        resData.forEach((item)=>{
          res[getValueKey(item)] = item.airdropAmount
        })
      }
      return res
    }).filter((item)=>!!item)
    setLoading(true)
    Promise.all(data).then((res)=>{
      if(res){
        setResult(res)
        const _total = [0,0,0,0,0,0,0]
        
        res.forEach((item)=>{
          config.forEach((conf)=>{
            _total[conf.type] += item[getValueKey(conf)]
          })
        })
        _total[0] = _total.reduce((a: number, b: number)=>a+b, 0)
        setTotal(_total.map(item => parseFloat(item.toFixed(6))))
      }
      setLoading(false)
    }).catch((error)=>{
      alert(error.message || 'Error')
      setLoading(false)
    })
  }
  function handleChange(value: string){
    console.log(value)
    setValue(value)
  }

  return (
    <div className="min-h-screen p-2 gap-16 sm:p-4 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-start sm:items-center">
        <div className="flex flex-col w-full">
          <textarea rows={5} 
          value={value}
          onChange={(e)=>handleChange(e.target.value)} placeholder="please input your address, multiple split with`, ; or blank`" className="min-h-8 w-full block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
          <button disabled={loading} className={`text-white mt-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${loading ? 'cursor-not-allowed': ''}`} onClick={handleSearch}>Query</button>
        </div>
        <div className="relative w-full">
            {
              loading && <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                <span className="sr-only">Loading...</span>
              </div>
            }
          <table className={`w-full text-xs sm:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ${loading ? 'opacity-20': ''}`} >
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-0.5 sm:px-3">{dynamicDisplay('address', 'evm')}</th>
                {
                  config.map((item, idx)=>{
                    return <th key={idx} scope="col" className="p-0.5 sm:px-3">
                      <div>
                      {dynamicDisplay(item.title, item.shortTitle)}
                      </div>
                      <span className="font-light text-gray-500 dark:text-gray-400"><b className="font-bold text-orange-500">{item.date}</b></span>
                    </th>
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
               getRows()
              }
            </tbody>
            <tfoot>
              <tr className="font-semibold text-gray-900 dark:text-white">
                {
                  result.length ? <>
                  <th scope="row" className="p-0.5 sm:px-3 text-base">{dynamicDisplay(`Total: ${total[0]}`, formatNum(total[0]))}</th>
                    {
                      config.map((item, idx)=>{
                        return <td className="p-0.5 sm:px-3" key={idx}>{dynamicDisplay(total[item.type], formatNum(total[item.type]))}</td>
                      })
                    }  
                  </> : <th colSpan={7} scope="row" className="text-center p-0.5 sm:px-3 text-base">No Data</th>
                }
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
    </div>
  );
}
