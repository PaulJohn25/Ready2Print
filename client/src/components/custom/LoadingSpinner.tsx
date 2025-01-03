import HashLoader from "react-spinners/HashLoader";

const LoadingSpinner = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <HashLoader color="#3b82f6" size={40} />
        <p className="text-blue-800 font-medium font-montserrat text-sm">
          Analyzing PDF File...
        </p>
      </div>
    </>
  );
};

export default LoadingSpinner;
