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
                  onClick={() => {
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
                      {}
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
