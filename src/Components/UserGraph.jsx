import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import adminAxios from "../Config/adminAxios";

const UserGraph = () => {
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

        adminAxios
          .get(`/user/search?query=${trimmedQuery}&page=1`)
          .then((res) => {
            setResults(res.data.users);
            setHasMore(res.data.hasMore);
          })
          .catch(console.error)
          .finally(() => setIsLoading(false));
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
      const res = await adminAxios.get(`/user/search?page=1`);
      setResults(res.data.users);
      setHasMore(res.data.hasMore);
      setPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMoreUsers = async () => {
    const nextPage = page + 1;
    try {
      const res = await adminAxios.get(
        `/user/search?query=${query}&page=${nextPage}`
      );
      setResults((prev) => [...prev, ...res.data.users]);
      setHasMore(res.data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col mt-5 text-white gap-y-5">
      <input
        type="text"
        placeholder="🔍 Search Organization by name or email ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border-2 rounded-full outline-none border-zinc-600 font-Satoshi placeholder:text-zinc-400"
      />

      <div className="w-full overflow-auto max-h-120" id="scrollableDiv">
        <InfiniteScroll
          dataLength={results.length}
          next={fetchMoreUsers}
          hasMore={hasMore}
          loader={
            !isLoading &&
            hasSearch && (
              <h4 className="my-4 text-center text-zinc-300">Loading...</h4>
            )
          }
          scrollableTarget="scrollableDiv">
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
              {results.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    No User Found
                  </td>
                </tr>
              ) : (
                <>
                  {results.map((item, i) => (
                    <tr
                      key={item._id || i}
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
                          <button className="px-6 py-1 text-white transition-all duration-200 rounded cursor-pointer bg-sky-500 hover:bg-red-700">
                            UnBlock
                          </button>
                        ) : (
                          <button className="px-6 py-1 text-white transition-all duration-200 bg-red-500 rounded cursor-pointer hover:bg-red-700">
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!hasMore && results.length > 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-zinc-400">
                        No more users to show.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
      {hasSearch && isLoading && (
        <div className="flex flex-col items-center w-full text-center font-Satoshi text-zinc-300">
          <img src="/JELdjAcy6T.gif" className="w-30 h-30" alt="loading" />
          <p className="-mt-4 text-lg">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default UserGraph;
