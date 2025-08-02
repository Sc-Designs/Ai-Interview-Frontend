import React from 'react'


const UserGraph = () => {
  return (
    <div className="flex flex-col mt-5 text-white gap-y-5">
      <div className="flex overflow-hidden border-2 rounded-full border-zinc-600">
        <input
          type="text"
          placeholder="🔍 Search User by name or email ..."
          className="w-full px-4 py-2 outline-none font-Satoshi placeholder:text-zinc-400"
        />
        <button className="px-10 cursor-pointer bg-zinc-900 hover:bg-zinc-800">
          Search
        </button>
      </div>
      <div className="w-full overflow-auto max-h-120">
        <table className="w-full border border-gray-600 table-auto">
          <thead className="sticky top-0 z-10">
            <tr className="font-Satoshi">
              <th className="sticky top-0 p-2 text-center bg-black">Name</th>
              <th className="sticky top-0 p-2 text-center text-green-400 bg-black">
                Email
              </th>
              <th className="sticky top-0 p-2 text-center bg-black text-sky-400">
                Number
              </th>
              <th className="sticky top-0 p-2 text-center text-red-400 bg-black">
                Blocks
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({length: 15}).map((_,i)=>(
              <tr key={i} className={`border-t border-gray-700 font-Okomito ${i%2 === 0 ? "bg-zinc-800":"bg-zinc-900"}`}>
              <td className="p-3 text-center">Jone Doe</td>
              <td className="p-3 text-center text-green-400">
                email@gmail.com
              </td>
              <td className="p-3 text-center text-sky-400">+91 0000000000</td>
              <td className="p-3 text-center"><button className='px-6 py-1 text-white transition-all duration-200 bg-red-500 rounded cursor-pointer hover:bg-red-700'>Block</button></td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserGraph