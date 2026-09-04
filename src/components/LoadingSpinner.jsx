// components/LoadingSpinner.jsx
const LoadingSpinner = () => {
  return (
    <div className="pt-40 flex justify-center items-center ">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;