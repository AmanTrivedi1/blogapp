import { GiEmptyHourglass } from "react-icons/gi";
import { IoArrowDownOutline } from "react-icons/io5";

const LoadMoreDataBtn = ({ state, fetchDataFun, additionalParams }) => {
  if (state != null && state.totalDocs > state.results.length) {
    return (
      <button
        className=" border-grey   border mb-2 py-2 px-4 hover:bg-grey/30 
            rounded-lg flex items-center gap-2"
        onClick={() => fetchDataFun({ ...additionalParams, page: state.page + 1 })}
      >
        Load more <IoArrowDownOutline className="animate-bounce"/>
      </button>
    );
  } else if (state != null && state.results.length === 0) {
    return <p>No data to load.</p>;
  } else {
    return  (
      <div className="">
      <p className="border inline-flex items-center  gap-x-2  border-grey cursor-not-allowed px-4 py-2 mb-2 rounded-lg">   Nothing to load <GiEmptyHourglass className=""/></p>
      </div>
    ) 
  }
};

export default LoadMoreDataBtn;
