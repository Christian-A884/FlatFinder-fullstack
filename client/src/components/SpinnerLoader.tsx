import { Circles } from "react-loader-spinner";


const SpinnerLoader = () => {
  return (
    <div className="backdrop-blur-sm backdrop-brightness-50 fixed top-0 left-0 flex justify-center items-center h-full w-full z-50">
      <Circles
        height="80"
        width="80"
        color="#173466"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default SpinnerLoader;
