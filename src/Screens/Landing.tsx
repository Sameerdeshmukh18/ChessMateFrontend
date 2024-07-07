import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div className="pt-8 max-w-2xl-screen-lg">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
          <div className="flex justify-center">
            <img src={"/chessboard.png"} className="max-w-96" />
          </div>

          <div className="pt-16">
            <div className="flex justify-center">
              <h1 className="text-4xl font-bold text-white">
                Play chess online the online #2 Site!
              </h1>
            </div>
            <div className="mt-4 flex justify-center">
              <button className="px-8 py-4 text-xl bg-green-500 hover:bg-blue-700 text-white font-bold rounded" onClick={()=>{navigate("/game")}}>
                Play Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
