import React, { useEffect, useState } from "react";
import Dock from "../Components/Dock";
import { useNavigate } from "react-router-dom";
import { VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";
import { GiIsland } from "react-icons/gi";
import { RiAddLargeFill } from "react-icons/ri";
import InfiniteScroll from "react-infinite-scroll-component";
import OrgAxios from "../Config/orgAxios";
import Lottie from "lottie-react";
import animationData from "../assets/handLoading.json";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  receiveMessage,
  removeListener,
  sendMessage,
} from "../socket/socketService";
import { removeQuestionSet } from "../Store/Reducers/Organization";

const Sets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      onClick: () => navigate("/org-profile-edit"),
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
  const organization = useSelector((state) => state.OrganizationReducer);

  const removeSetFromList = (setId) => {
    setResults((prev) => prev.filter((item) => item._id !== setId));
  };

  useEffect(() => {
    if (!query.trim()) fetchInitialSets();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        setPage(1);
        setIsLoading(true);
        setHasSearch(true);
        OrgAxios.get(`/test/api/search?query=${trimmedQuery}&page=1`)
          .then((res) => {
            setResults(res.data.tests);
            setHasMore(res.data.hasMore);
          })
          .catch(console.error)
          .finally(() => setIsLoading(false));
      } else {
        setResults([]);
        setHasSearch(false);
        setPage(1);
        fetchInitialSets();
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchInitialSets = async () => {
    try {
      const res = await OrgAxios.get(`/test/api/search?page=1`);
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
        `/test/api/search?query=${query}&page=${nextPage}`,
      );
      setResults((prev) => [...prev, ...res.data.tests]);
      setHasMore(res.data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    }
  };

  const setDelete = (id) => {
    sendMessage("set-delete", {
      from: "org",
      give: organization._id,
      token: localStorage.getItem("OrgToken"),
      data: id,
    });
  };

  useEffect(() => {
    const onDeleteSuccess = (data) => {
      toast.success(data.message || "Set deleted successfully");
      removeSetFromList(data.setId);
      dispatch(removeQuestionSet(data.setId));
      if (data.warning) toast.warning(data.warning);
    };
    const onDeleteFailed = (data) => {
      toast.error(data.error || "Failed to delete set");
    };
    receiveMessage("set-delete-success", onDeleteSuccess);
    receiveMessage("set-delete-failed", onDeleteFailed);
    return () => {
      removeListener("set-delete-success", onDeleteSuccess);
      removeListener("set-delete-failed", onDeleteFailed);
    };
  }, [dispatch]);

  return (
    <div className="relative w-full min-h-screen bg-black text-white font-Satoshi px-5 pt-8 pb-28 lg:px-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-zinc-600 uppercase tracking-widest">
            Organisation
          </p>
          <h1 className="text-xl font-medium text-white">Question Sets</h1>
        </div>
        <button
          onClick={() => navigate("/set-builder")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors cursor-pointer">
          <RiAddLargeFill size={14} />
          New set
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-600"
        />
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full pointer-events-none z-10">
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-40 h-40"
          />
        </div>
      )}

      {/* Table */}
      <div
        className="w-full overflow-auto rounded-xl border border-zinc-800 h-[65vh] lg:h-[70vh]"
        id="scrollableDiv">
        <InfiniteScroll
          dataLength={results.length}
          next={fetchMoreTests}
          hasMore={hasMore}
          loader={
            !isLoading &&
            hasSearch && (
              <p className="py-3 text-center text-xs text-zinc-600">
                Loading more…
              </p>
            )
          }
          scrollableTarget="scrollableDiv">
          <table className="w-full table-auto text-sm">
            <thead className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-widest">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-widest hidden md:table-cell">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-widest hidden sm:table-cell">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 && !isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-16 text-center text-zinc-600 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">📭</span>
                      <p>No question sets yet</p>
                      <button
                        onClick={() => navigate("/set-builder")}
                        className="mt-2 px-4 py-1.5 text-xs rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer">
                        Create your first set
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {results.map((item, i) => (
                    <tr
                      key={item._id || i}
                      className="border-t border-zinc-800 hover:bg-zinc-900/60 transition-colors group">
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-200 truncate max-w-[180px] lg:max-w-xs">
                          {item.title}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-mono text-xs text-zinc-600 bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5">
                          {item._id}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-zinc-500 text-xs">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/set-update/${item._id}`)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer">
                            Edit
                          </button>
                          <button
                            onClick={() => setDelete(item._id)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-950 text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors cursor-pointer">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!hasMore && results.length > 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-xs text-zinc-700">
                        All sets loaded
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
        className="hover:bg-zinc-700/10"
      />
    </div>
  );
};

export default Sets;
