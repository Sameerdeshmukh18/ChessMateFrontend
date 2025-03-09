import { useCallback, useEffect, useRef, useState } from "react";
import { ChessBoard } from "../Components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import Loading from "./Loading";

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
    return <div className="h-full w-full flex justify-center items-center"><Loading/></div>;
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
          <div className="md:col-span-2 bg-purple w-full flex flex-col h-full justify-between max-h-lg">
            <div className="py-8 mx-auto w-full">
              {!gameStarted ? (
                !pending ? (
                  <button
                    className="md:px-8  md:py-4 px-4 py-4 text-xl w-full flex justify-center bg-buttonPurple text-textWhite font-bold"
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
                  <div className="px-8  py-4 text-xl flex justify-center text-textWhite font-bold rounded">
                    Waiting for an opponent...
                  </div>
                )
              ) : (
                <>
                  <div className="px-8  py-4 text-sm flex justify-center text-textWhite font-bold rounded">
                    {winner ? (
                      <div className="text-sm text-textWhite font-bold rounded">{`Game Over! ${winner} is victorious!`}</div>
                    ) : (
                      `Game started - you are ${userColor}`
                    )}
                  </div>
                  <div className="px-4  py-2 text-sm text-textWhite font-bold grid md:grid-cols-2 gap-4 place-items-center md:max-h-72 max-h-24 overflow-auto max-sm:grid-flow-col max-sm:auto-cols-max p-4 max-sm:overflow-x-auto">
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
                <div className="flex justify-around border-t-2 border-stone-800">
                  <button className="px-6 m-1 py-1 text-sm bg-bg-purple text-textWhite rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <button className="px-6  m-1 py-1 text-sm bg-bg-purple text-textWhite rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                      />
                    </svg>
                  </button>
                  <button className="px-6 m-1 py-1 text-sm bg-bg-purple text-textWhite rounded">
                    1/2
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
