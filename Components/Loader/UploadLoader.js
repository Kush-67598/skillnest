import { ProgressBar } from "react-loader-spinner";

export default function Loader({ message }) {
  return (
    <div className=" flex   z-50">
      {" "}
      <ProgressBar
        visible={true}
        height="80"
        width="80"
        barColor="#66fa8e"
        borderColor="black"
        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      {message && <p className=" text-sm text-gray-600">{message}</p>}
    </div>
  );
}
