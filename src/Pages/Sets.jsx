import React, { useEffect, useState } from 'react'
import Dock from '../Components/Dock'
import { useNavigate } from "react-router-dom";
import {
  VscHome,
  VscArchive,
  VscAccount,
  VscSettingsGear,
} from "react-icons/vsc";
import { GiIsland } from "react-icons/gi";
import { RiAddLargeFill } from "react-icons/ri";
import InfiniteScroll from "react-infinite-scroll-component";
import OrgAxios from "../Config/orgAxios"
const Sets = () => {
  const navigate = useNavigate()
  const items = [
    {
      icon: <GiIsland size={18} />,
      label: "Landing Page",
      onClick: () => navigate("/"),
    },
    {
      icon: <VscArchive size={18} />,
      label: "Questions",
      onClick: () => navigate("/sets"),
    },
    {
      icon: <VscAccount size={18} />,
      label: "Profile",
      onClick: () => navigate("/org-profile"),
    },
    {
      icon: <VscSettingsGear size={18} />,
      label: "Settings",
      onClick: () => alert("Settings!"),
    },
    {
      icon: <RiAddLargeFill size={18} />,
      label: "Add Sets",
      onClick: () => navigate("/set-builder"),
    },
  ];
   const [query, setQuery] = useState("");
   const [results, setResults] = useState([]);
   const [hasMore, setHasMore] = useState(true);
   const [page, setPage] = useState(1);
   const [hasSearch, setHasSearch] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
     if (!query.trim()) {
       fetchInitialUsers();
     }
   }, []);

   useEffect(() => {
     const delayDebounce = setTimeout(() => {
       const trimmedQuery = query.trim();
       if (trimmedQuery) {
         setPage(1);
         setIsLoading(true);
         setHasSearch(true);

         OrgAxios.get(`/test/search?query=${trimmedQuery}&page=1`).then((res) => {
             setResults(res.data.tests);
             setHasMore(res.data.hasMore);
           }).catch(console.error).finally(() => setIsLoading(false));
       } else {
         setResults([]);
         setHasSearch(false);
         setPage(1);
         fetchInitialUsers();
       }
     }, 300);

     return () => clearTimeout(delayDebounce);
   }, [query]);
    const fetchInitialUsers = async () => {
      try {
        const res = await OrgAxios.get(`/test/search?page=1`);
        setResults(res.data.tests);
        setHasMore(res.data.hasMore);
        setPage(1);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMoreTests = async () => {
      const nextPage = page + 1;
      try {
        const res = await OrgAxios.get(
          `/test/search?query=${query}&page=${nextPage}`
        );
        setResults((prev) => [...prev, ...res.data.tests]);
        setHasMore(res.data.hasMore);
        setPage(nextPage);
      } catch (err) {
        console.error(err);
      }
    };
  return (
    <div className="w-full h-screen px-10 py-5 text-white bg-black font-Satoshi">
      <input
        type="text"
        placeholder="🔍 Search by name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded-full outline-none border-1 placeholder:text-zinc-500"
      />
      <div className="w-full overflow-auto max-h-[75vh]" id="scrollableDiv">
        <InfiniteScroll
          dataLength={results.length}
          next={fetchMoreTests}
          hasMore={hasMore}
          loader={
            !isLoading &&
            hasSearch && (
              <h4 className="my-4 text-center text-zinc-300">Loading...</h4>
            )
          }
          scrollableTarget="scrollableDiv">
          <table className="w-full border border-gray-600 table-auto ">
            <tbody>
              {results.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    No Test Found
                  </td>
                </tr>
              ) : (
                <>
                  {results.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <p
                          className={`p-4 text-left border ${
                            i % 2 === 0 ? "bg-zinc-900" : "bg-zinc-950"
                          }`}>
                          <span className='font-black text-amber-600'>Name</span> : {item.title}
                        </p>
                      </td>
                      <td>
                        <p
                          className={`p-4 text-center border text-rose-600 ${
                            i % 2 === 0 ? "bg-zinc-900" : "bg-zinc-950"
                          }`}>
                          {item._id}
                        </p>
                      </td>
                      <td>
                        <p
                          className={`p-4 text-center text-green-400 border ${
                            i % 2 === 0 ? "bg-zinc-900" : "bg-zinc-950"
                          }`}>
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </td>
                      <td>
                        <div
                          className={`flex items-center justify-center p-2 border border-sky-400 ${
                            i % 2 === 0 ? "bg-zinc-800" : "bg-zinc-700"
                          }`}>
                          <button className="w-full px-4 py-2 text-white bg-sky-400">
                            Edit
                          </button>
                        </div>
                      </td>
                      <td>
                        <div
                          className={`flex items-center justify-center p-2 border border-red-400 ${
                            i % 2 === 0 ? "bg-zinc-800" : "bg-zinc-700"
                          }`}>
                          <button className="w-full px-4 py-2 text-white bg-red-400">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!hasMore && results.length > 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-4 text-center text-zinc-400">
                        No more Tests to show.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
      <Dock
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
        className="hover:bg-zinc-700/10 "
      />
    </div>
  );
}

export default Sets