import { ThreeDots } from "react-loader-spinner";

export default function Loader({ message }) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
