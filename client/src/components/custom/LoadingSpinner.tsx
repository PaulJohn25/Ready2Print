import HashLoader from "react-spinners/HashLoader";

interface LoadingSpinnerProps {
  textIndicator: string;
}

const LoadingSpinner = ({ textIndicator }: LoadingSpinnerProps) => {
  return (
    <>
      <div className="flex items-center justify-center gap-3 mt-4">
        <HashLoader color="#3b82f6" size={40} />
        <p className="text-blue-800 font-medium font-montserrat text-sm">
          {textIndicator}
        </p>
      </div>
    </>
  );
};

export default LoadingSpinner;
