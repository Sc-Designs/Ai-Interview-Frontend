import React, { useEffect, useState } from 'react'
import adminAxios from "../Config/adminAxios"
const OrganizationGraph = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        adminAxios
          .get(`/user/search?query=${query}`)
          .then((res) => setResults(res.data.users))
          .catch((err) => console.error(err));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);
  return (
    <div className="flex flex-col mt-5 text-white gap-y-5">
        <input
          type="text"
          placeholder="🔍 Search Organization by name or email ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border-2 rounded-full outline-none border-zinc-600 font-Satoshi placeholder:text-zinc-400"
        />
      <div className="w-full overflow-auto max-h-120">
        <table className="w-full border border-gray-600 table-auto">
          <thead className="sticky top-0 z-10">
            <tr className="font-Satoshi">
              <th className="sticky top-0 p-2 text-center bg-black">
                Org .Name
              </th>
              <th className="sticky top-0 p-2 text-center text-green-400 bg-black">
                Email
              </th>
              <th className="sticky top-0 p-2 text-center bg-black text-sky-400">
                Ph. Number
              </th>
              <th className="sticky top-0 p-2 text-center text-red-400 bg-black">
                Downing
              </th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <p>No User Find</p>
            ) : (
              results.map((item, i) => (
                <tr
                  key={i}
                  className={`border-t border-gray-700 font-Okomito ${
                    i % 2 === 0 ? "bg-zinc-800" : "bg-zinc-900"
                  }`}>
                  <td className="p-3 text-center">{item.name}</td>
                  <td className="p-3 text-center text-green-400">
                    {item.email}
                  </td>
                  <td className="p-3 text-center text-sky-400">
                    {item.number || "Null"}
                  </td>
                  <td className="p-3 text-center">
                    {item.block ? (
                      <button className="px-6 py-1 text-white transition-all duration-200 bg-green-600 rounded cursor-pointer hover:bg-red-700">
                        Up Liver
                      </button>
                    ) : (
                      <button className="px-6 py-1 text-white transition-all duration-200 rounded cursor-pointer bg-sky-500 hover:bg-red-700">
                        Shut down
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrganizationGraph