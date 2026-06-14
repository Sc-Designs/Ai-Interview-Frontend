import React from "react";

const DashboardOrg = ({ data }) => {
  const rows = [
    {
      icon: "🏢",
      label: "Company name",
      value: data?.name,
    },
    {
      icon: "📅",
      label: "Date joined",
      value: data?.createdAt
        ? new Date(data.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    },
    {
      icon: "🌐",
      label: "Domain",
      value: data?.domain,
      isLink: true,
    },
    {
      icon: "✉️",
      label: "Email",
      value: data?.email,
    },
    {
      icon: "📞",
      label: "Phone",
      value: data?.phoneNumber || "—",
    },
    {
      icon: "🛡️",
      label: "Status",
      value: data?.status,
      isStatus: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start">
        <div className="flex-shrink-0">
          <div className="overflow-hidden border-2 rounded-full w-20 h-20 border-zinc-700">
            <img
              src={
                data?.profileImage ||
                "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=200&auto=format&fit=crop"
              }
              className="object-cover w-full h-full"
              alt="Organisation logo"
            />
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 gap-0 divide-y divide-zinc-800 lg:grid-cols-2 lg:divide-y-0">
            {rows.map(({ icon, label, value, isLink, isStatus }) => (
              <div
                key={label}
                className="flex items-center gap-3 py-3 px-1 border-b border-zinc-800 last:border-b-0 lg:border-b lg:py-2.5">
                <div className="flex items-center justify-center w-8 h-8 text-sm rounded-lg bg-zinc-800 flex-shrink-0">
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-Satoshi">
                    {label}
                  </p>
                  {isLink ? (
                    <a
                      href={value || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors truncate block font-Satoshi">
                      {value || "Not set"}
                    </a>
                  ) : isStatus ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium capitalize font-Satoshi">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      <span className="text-emerald-400">{value}</span>
                    </span>
                  ) : (
                    <p className="text-sm font-medium text-zinc-200 truncate font-Satoshi">
                      {value || "—"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 px-1">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1.5 font-Satoshi">
              Organisation ID
            </p>
            <p className="text-xs font-mono text-zinc-400 bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 break-all">
              {data?._id || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOrg;
