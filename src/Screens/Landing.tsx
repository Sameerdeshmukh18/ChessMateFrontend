import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div className="pt-8 max-w-2xl-screen-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex justify-center max-w-full">
            <img src={"/chessboard.png"} className="max-w-full md:max-w-96" />
          </div>

          <div className="pt-16 flex flex-col items-center sm:m-2">
            <div className="flex justify-center">
              <h1 className="md:text-4xl text-xl font-bold text-textWhite">
                Play chess online, the online #2 Site!
              </h1>
            </div>
            <div className="mt-4 flex justify-center">
              <button className="md:px-8 md:py-4 px-4 py-2 text-xl bg-buttonPurple text-textWhite font-bold rounded" onClick={()=>{navigate("/game")}}>
                Play Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
