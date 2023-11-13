import React from "react";

const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
  if (state != null && state.totalDocs > state.results.length) {
  }
  return (
    <>
      <button
        className="text-dark-grey p-2 px-3 hover:bg-grey/30 
       rounded-lg flex items-center gap-2"
        onClick={() => fetchDataFun({page:state.page+1})}
      >
        Loda more ..
      </button>
    </>
  );
};

export default LoadMoreDataBtn;
