import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import adminAxios from "../Config/adminAxios";
import {
  receiveMessage,
  removeListener,
  sendMessage,
} from "../socket/socketService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import animationData from "../assets/JELdjAcy6T.json";

const UserGraph = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [hasSearch, setHasSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const admin = useSelector((state) => state.AdminReducer);

  useEffect(() => {
    if (!query.trim()) fetchInitialUsers();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        setPage(1);
        setIsLoading(true);
        setHasSearch(true);
        adminAxios
          .get(`/user/api/search?query=${trimmedQuery}&page=1`)
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
      const res = await adminAxios.get(`/user/api/search?page=1`);
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
        `/user/api/search?query=${query}&page=${nextPage}`,
      );
      setResults((prev) => [...prev, ...res.data.users]);
      setHasMore(res.data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    }
  };

  const handelBlock = (id) => {
    sendMessage("block-user", {
      from: "admin",
      give: admin._id,
      to: id,
      token: localStorage.getItem("AdminToken"),
    });
  };

  const updateUserBlockStatus = (userId) => {
    setResults((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, block: !user.block } : user,
      ),
    );
  };

  useEffect(() => {
    receiveMessage("block-user-success", (data) => {
      toast.success("Block status changed");
      updateUserBlockStatus(data.userId);
    });
    return () => removeListener("block-user-success");
  }, []);

  return (
    <div className="flex flex-col gap-4 text-white">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search users by name or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white outline-none focus:border-zinc-500 transition-colors font-Satoshi placeholder:text-zinc-600"
        />
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute flex items-center justify-center w-full h-screen -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2 lg:left-[60%]">
          <Lottie
            className="scale-60"
            animationData={animationData}
            loop={true}
          />
        </div>
      )}

      {/* Table */}
      <div
        className="w-full overflow-auto max-h-[60vh] rounded-xl border border-zinc-800"
        id="scrollableDiv">
        <InfiniteScroll
          dataLength={results.length}
          next={fetchMoreUsers}
          hasMore={hasMore}
          loader={
            !isLoading &&
            hasSearch && (
              <p className="py-3 text-center text-xs text-zinc-500 font-Satoshi">
                Loading more…
              </p>
            )
          }
          scrollableTarget="scrollableDiv">
          <table className="w-full table-auto text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-zinc-800 text-left">
                <th className="px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-widest font-Satoshi">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-widest font-Satoshi">
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-widest font-Satoshi hidden sm:table-cell">
                  Phone
                </th>
                <th className="px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-widest font-Satoshi text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 && !isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-zinc-600 font-Satoshi text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                <>
                  {results.map((item, i) => (
                    <tr
                      key={item._id || i}
                      className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3 text-zinc-200 font-Satoshi">
                        {item.name}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${item.email}`}
                          className="text-sky-400 hover:text-sky-300 transition-colors font-Satoshi">
                          {item.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 font-Satoshi hidden sm:table-cell">
                        {item.number || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handelBlock(item._id)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors font-Satoshi cursor-pointer
                            ${
                              item.block
                                ? "bg-emerald-900 text-emerald-300 hover:bg-emerald-800"
                                : "bg-red-950 text-red-400 hover:bg-red-900"
                            }`}>
                          {item.block ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!hasMore && results.length > 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-xs text-zinc-600 font-Satoshi">
                        All users loaded
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default UserGraph;
