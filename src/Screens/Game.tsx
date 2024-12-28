import { useCallback, useEffect, useRef, useState } from "react";
import { ChessBoard } from "../Components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const Game = () => {
  const socket = useSocket();
  const [chess, _] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [pending, setPending] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [userColor, setUserColor] = useState<string | null>(() => null);
  const [winner, setWinner] = useState(null);

  const userColorSet = useRef(false);

  // set board according to users color
  const setBoardWithUserColor = useCallback(
    (color: string | null) => {
      if (color === "Black") {
        setBoard(
          chess
            .board()
            .map((row) => row.reverse())
            .reverse()
        );
      } else {
        setBoard(chess.board());
      }
    },
    [userColor]
  );
  // move constants in separate file
  const INIT_GAME = "init_game";
  const MOVE = "move";
  const GAME_OVER = "game_Over";

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.type) {
        case INIT_GAME:
          setBoardWithUserColor(message.color);
          setPending(false);
          setGameStarted(true);
          if (!userColorSet.current) {
            setUserColor(message.color);
            userColorSet.current = true;
          }
          console.log("game initialized");
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoardWithUserColor(userColor);
          console.log(userColor);
          console.log("move made");
          break;
        case GAME_OVER:
          console.log("game over");
          setWinner(message.payload.winner);
          break;
      }
    };
  }, [socket, setBoardWithUserColor]);

  if (!socket) {
    return <div>Connecting...</div>;
  }
  return (
    <div className="md:flex md:justify-center md:h-full">
      <div className="pt-8 md:max-w-screen-lg md:h-full md:w-full">
        <div className="md:grid md:grid-cols-6 md:gap-4 md:w-full">
          <div className="md:col-span-4 md:w-full w-full h-1/2">
            <ChessBoard
              chess={chess}
              setBoardWithUserColor={setBoardWithUserColor}
              board={board}
              socket={socket}
              userColor={userColor}
            />
          </div>
          <div className="md:col-span-2 bg-stone-800 w-full flex flex-col h-full justify-between max-h-lg">
            <div className="py-8 mx-auto">
              {!gameStarted ? (
                !pending ? (
                  <button
                    className="px-8  py-4 text-xl flex justify-center bg-green-500 hover:bg-blue-700 text-white font-bold rounded"
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
                  <div className="px-8  py-4 text-xl flex justify-center text-white font-bold rounded">
                    Waiting for an oppnent...
                  </div>
                )
              ) : (
                <>
                  <div className="px-8  py-4 text-sm flex justify-center text-white font-bold rounded">
                    {winner ? (
                      <div className="text-sm text-white font-bold rounded">{`Game Over! ${winner} is victorious!`}</div>
                    ) : (
                      `Game Started - you are ${userColor}`
                    )}
                  </div>
                  <div className="px-4  py-2 text-sm text-white font-bold grid grid-cols-2 gap-4 place-items-center max-h-72 overflow-auto ">
                    {chess.history()
                      ? chess.history().map((move, i) => {
                          return <div>{i + 1 + ". " + move}</div>;
                        })
                      : ""}
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-center bg-stone-700">
              <div className="flex w-full flex-col justify-center">
                <div className="flex justify-around">
                  <button className="px-6  m-1 py-1 text-sm bg-stone-600 hover:bg-stone-500 text-white rounded">
                    Resign
                  </button>
                  <button className="px-6 m-1 py-1 text-sm bg-stone-600 hover:bg-stone-500 text-white rounded">
                    1/2 Draw
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
