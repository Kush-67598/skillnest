import {  Bars } from "react-loader-spinner";

export default function Loader({ message }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
      {" "}
      <Bars
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      
      {message && <p className="mt-2 text-md text-white">{message}</p>}
    </div>
  );
}
