import { useEffect, useState } from "react";
import { ChessBoard } from "../Components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const Game = () => {
  const socket = useSocket();
  const [chess, _] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [pending, setPending] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [userColor,setUserColor] = useState();
  
  // move constants in separate file
  const INIT_GAME = "init_game";
  const MOVE = "move";
  const GAME_OVER = "game_Over";
  useEffect(() => {
    if (!socket) {
      return;
    }
    if(userColor==="Black"){
      setBoard(board.map(row=>row.reverse()).reverse());
      console.log(board);
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          setPending(false);
          setGameStarted(true);
          setUserColor(message.color);
          console.log("game initialized");
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("move made");
          break;
        case GAME_OVER:
          console.log("game over");
          break;
      }
    };
  }, [socket]);

  if (!socket) {
    return <div>Connecting...</div>;
  }
  return (
    <div className="flex justify-center h-full">
      <div className="pt-8 max-w-screen-lg h-full w-full">
        <div className="grid grid-cols-6 gap-4 w-full ">
          <div className="col-span-4  w-full ">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              board={board}
              socket={socket}
              userColor={userColor}
            />
          </div>
          <div className="col-span-2 bg-stone-800 w-full flex h-full justify-center overflow-scroll">
            <div className="pt-8">
              {!gameStarted ? (
                !pending ? (
                  <button
                    className="px-8  py-4 text-xl bg-green-500 hover:bg-blue-700 text-white font-bold rounded"
                    onClick={() => {
                      socket.send(
                        JSON.stringify({
                          type: INIT_GAME,
                        })
                      );
                      setPending(true);
                    }}
                  >
                    Play
                  </button>
                ) : (
                  <div className="px-8  py-4 text-xl text-white font-bold rounded">Waiting for an oppnent...</div>
                )
              ) : (
                <><div className="px-8  py-4 text-xl text-white font-bold rounded">Game Started</div>
                <div className="px-4  py-2 text-xl text-white font-bold grid grid-cols-2 gap-4 justify-between">{chess.history()?
                chess.history().map((move,i)=>{
                  return <div>{(i+1)+". "+move}</div>

                }):""}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
