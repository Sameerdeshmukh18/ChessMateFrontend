import { Color, Square, PieceSymbol } from "chess.js";
import { useState } from "react";

export const ChessBoard = ({
  board,
  socket,
  chess,
  setBoardWithUserColor,
  userColor,
}: {
  userColor: any;
  chess: any;
  setBoardWithUserColor: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [clickedElement, setClickedElement] = useState<HTMLDivElement | null>();
  // const [isPlaying, setIsPlaying] = useState(false);
  // const audioRef = useRef(new Audio('../../public/move-self.mp3'));

  // const playMoveSound = useCallback(() => {
  //   console.log("in playmove sound")
  //   if (isPlaying) {
  //     return;
  //   }

  //   setIsPlaying(true);
  //   audioRef.current.currentTime = 0; // Rewind to the start
  //   audioRef.current.play().catch(error => {
  //     console.error("Error playing audio:", error);
  //   });

  //   audioRef.current.onended = () => {
  //     setIsPlaying(false);
  //   };
  // }, []);

  return (
    <div>
      {board.map((row, i) => {
        return (
          <div key={i} className="text-white-200 flex justify-center">
            {row.map((square, j) => {
              const squareRepresenation =
                userColor === "Black"
                  ? ((String.fromCharCode(104 - (j % 8)) +
                      "" +
                      (i + 1)) as Square)
                  : ((String.fromCharCode(97 + (j % 8)) +
                      "" +
                      (8 - i)) as Square);
              return (
                <div
                  onClick={(e) => {
                    if (!clickedElement) {
                      const element = e.currentTarget;
                      setClickedElement(element);
                      element.classList.add("bg-yellow-200");
                      element.classList.add("bg-opacity-25");
                    } else {
                      clickedElement?.classList.remove("bg-yellow-200");
                      clickedElement?.classList.remove("bg-opacity-25");
                      setClickedElement(null);
                    }
                    if (!from) {
                      if (chess.turn() === "w" && userColor === "White") {
                        setFrom(square?.square ?? null);
                      }
                      if (chess.turn() === "b" && userColor === "Black") {
                        setFrom(square?.square ?? null);
                      }
                    } else {
                      try {
                        chess.move({
                          from: from,
                          to: squareRepresenation,
                          promotion: "q",
                        });
                        socket.send(
                          JSON.stringify({
                            type: "move",
                            move: {
                              from: from,
                              to: squareRepresenation,
                            },
                          })
                        );
                      } catch (error) {
                        console.log(error);
                      }
                      // playMoveSound();
                      setBoardWithUserColor(userColor);
                      console.log(from, squareRepresenation);
                      setFrom(null);
                    }
                  }}
                  key={j}
                  className={`w-16 h-16 ${
                    (i + j) % 2 === 0 ? "bg-white" : "bg-green-600"
                  }`}
                  // onDrop={(e)=>{
                  //   e.preventDefault();
                  //   if (from) {
                  //     try {
                  //       chess.move({
                  //         from: from,
                  //         to: squareRepresenation,
                  //       });
                  //       socket.send(
                  //         JSON.stringify({
                  //           type: "move",
                  //           move: {
                  //             from: from,
                  //             to: squareRepresenation,
                  //           },
                  //         })
                  //       );
                  //     } catch (error) {
                  //       console.log(error);
                  //     }

                  //     setBoard(chess.board());
                  //     console.log(from, squareRepresenation);
                  //     setFrom(null);

                  //   }
                  // }}
                >
                  <div className="w-full h-full flex justify-center">
                    <div className="w-full h-full flex justify-center">
                      {square?.type ? (
                        <div className="h-full flex justify-center flex-col">
                          <img
                            src={`./${
                              square?.color === "b"
                                ? square.type
                                : square?.type + "_w"
                            }.svg`}
                            alt=""
                            className=""
                            draggable="true"
                            onDrag={(e) => {
                              e.preventDefault();
                              console.log("dragging-");
                              setFrom(square?.square ?? null);
                            }}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
