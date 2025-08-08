import React from 'react'

const DashboardOrg = ({data}) => {
  return (
    <div className="flex flex-col items-center justify-center mt-4 lg:flex-row gap-x-10">
      <div className="overflow-hidden border-4 rounded-full border-zinc-600 w-52 h-52">
        <img
          src="https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="object-cover w-full h-full"
          alt=""
        />
      </div>
      <div className="flex flex-col px-0 py-2 lg:text-lg lg:px-6 gap-y-1 rounded-2xl font-Satoshi">
        <h1 className="text-zinc-500">
          Company Name:{" "}
          <span className="font-semibold lg:ml-5 text-zinc-200">{data.name}</span>
        </h1>
        <h3 className="text-zinc-500">
          Company ID:{" "}
          <span className="font-semibold lg:ml-5 text-zinc-200">{data._id}</span>
        </h3>
        <h5 className="text-zinc-500">
          Company Joined:{" "}
          <span className="font-semibold lg:ml-5 text-zinc-200">
            {new Date(data.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </h5>
        <h6 className="text-zinc-500">
          Company Domain:{" "}
          <a
            className="font-semibold lg:ml-5 text-sky-600"
            href={data.domain || "#"}>
            {data.domain || "Null"}
          </a>
        </h6>
        <h6 className="text-zinc-500">
          Company Email:{" "}
          <span className="font-semibold lg:ml-5 text-zinc-200">{data.email}</span>
        </h6>
        <h6 className="text-zinc-500">
          Company Phone No.:{" "}
          <span className="font-semibold lg:ml-5 text-zinc-200">
            {data.Phone || "Null"}
          </span>
        </h6>
        <h6 className="text-zinc-500">
          Company Status:{" "}
          <span className="ml-5 font-semibold text-green-600 capitalize">
            {data.status}
          </span>
        </h6>
      </div>
    </div>
  );
}

export default DashboardOrg