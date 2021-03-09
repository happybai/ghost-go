import React, { useState, useEffect, useRef, useCallback } from "react";
import GBoard, { canMove, move as moveStone } from "gboard";
import styled from "styled-components";
import Avatar from "react-avatar";
import { useParams } from "react-router-dom";
import moment from "moment";

import { fetchKifu, selectKifu } from "slices";
import { NumberParam, useQueryParam, withDefault } from "use-query-params";
import { KifuControls } from "components/common";
import {
  useDispatch,
  useTypedSelector,
  useOutsideClick,
  useGenericData,
} from "utils";
import { zeros, matrix, Matrix } from "mathjs";
import { sgfToPosition } from "../common/Helper";

const KifuBoard = styled.div``;

const board = new GBoard();
const mats: Map<number, Matrix> = new Map();
let markMat = matrix(zeros([19, 19]));
const Kifu = () => {
  const dispatch = useDispatch();
  const params: { id: string } = useParams();
  const [kifu] = useGenericData(useTypedSelector((state) => selectKifu(state)));
  const [mat, setMat] = useState<Matrix>(matrix(zeros([19, 19])));
  const [move, setMove] = useQueryParam("move", withDefault(NumberParam, 0));

  const boardRef = useCallback((node) => {
    mats.set(0, matrix(zeros([19, 19])));

    if (node !== null) {
      board.init(node);
      board.render();
    }
  }, []);

  let moves_count = 0;
  let b_name_en;
  let w_name_en;
  let b_rank;
  let w_rank;
  let date;
  let komi;
  let place;
  let result;
  if (kifu && kifu.data.attributes) {
    console.log(kifu.data.attributes);
    moves_count = kifu.data.attributes.moves_count;
    b_name_en = kifu.data.attributes.b_name_en;
    w_name_en = kifu.data.attributes.w_name_en;
    b_rank = kifu.data.attributes.b_rank;
    w_rank = kifu.data.attributes.w_rank;
    date = kifu.data.attributes.date;
    komi = kifu.data.attributes.komi;
    place = kifu.data.attributes.place;
    result = kifu.data.attributes.result;
  }
  const handleNext = () => {
    if (move < moves_count) {
      setMove(move + 1);
    }
  };

  const handlePrev = () => {
    if (move > 1) {
      setMove(move - 1);
    }
  };

  const handleFastPrev = () => {
    move > 10 ? setMove(move - 10) : setMove(1);
  };

  const handleFastNext = () => {
    move < moves_count - 10 ? setMove(move + 10) : setMove(moves_count);
  };

  const handleFirst = () => {
    setMove(1);
  };

  const handleLast = () => {
    setMove(moves_count);
  };

  useEffect(() => {
    // TODO: There is a performance issue
    const keyDownEvent = (event: KeyboardEvent) => {
      const keyName = event.key;
      if (keyName === "Shift" || keyName === "Alt") return;
      if (event.shiftKey) {
        if (keyName === "ArrowLeft") handleFastPrev();
        if (keyName === "ArrowRight") handleFastNext();
      } else if (event.altKey) {
        if (keyName === "ArrowLeft") handleFirst();
        if (keyName === "ArrowRight") handleLast();
      } else {
        if (keyName === "ArrowLeft") handlePrev();
        if (
          keyName === "ArrowRight" ||
          keyName === " " ||
          keyName === "Enter"
        ) {
          handleNext();
        }
      }
    };
    document.addEventListener("keydown", keyDownEvent, false);
    return () => {
      document.removeEventListener("keydown", keyDownEvent, false);
    };
  });

  useEffect(() => {
    board.render(mat, markMat);
  }, [mat]);

  useEffect(() => {
    if (kifu && move > 0) {
      const { steps, moves_count } = kifu.data.attributes;
      if (move > moves_count) return;
      const index = move - 1;
      const { x, y, ki } = sgfToPosition(steps.split(";")[index]);
      let mat = mats.get(move);
      if (mat) {
        const newMat = moveStone(mat, x, y, ki);
        setMat(newMat);
        mats.set(move, newMat);
        mat = mats.get(index);
      } else {
        mat = matrix(zeros([19, 19]));
        let newMat = matrix(zeros([19, 19]));
        for (let i = 0; i < move; i++) {
          const { x, y, ki } = sgfToPosition(steps.split(";")[i]);
          newMat = moveStone(mat, x, y, ki);
          mats.set(i + 1, newMat);
          mat = newMat;
        }
        setMat(newMat);
      }
      markMat = matrix(zeros([19, 19]));
      markMat.set([x, y], ki);
    }
  }, [move, kifu]);

  useEffect(() => {
    dispatch(fetchKifu({ pattern: { id: params.id } }));
  }, [dispatch, params]);

  return (
    <div className="flex flex-col lg:flex-row">
      <KifuBoard
        className="board"
        id="ghost-board"
        ref={boardRef}
        onClick={handleNext}
      />
      <div className="flex -ml-2 lg:hidden mb-3 justify-center">
        <KifuControls
          onFirst={handleFirst}
          onFastPrev={handleFastPrev}
          onPrev={handlePrev}
          onNext={handleNext}
          onFastNext={handleFastNext}
          onLast={handleLast}
        />
      </div>
      <div className="flex flex-row justify-around flex-1 px-2 lg:p-4 lg:flex-col lg:justify-start">
        <div className="flex flex-row">
          <div>
            <div>
              <Avatar name={b_name_en} size={"5rem"} />
            </div>
            <div className="text-base mt-2">
              {b_name_en}({b_rank})
            </div>
          </div>
          <div className="ml-10">
            <div>
              <Avatar name={w_name_en} size={"5rem"} />
            </div>
            <div className="text-base mt-2">
              {w_name_en}({w_rank})
            </div>
          </div>
        </div>
        <div className="text-base">
          <p className="my-1 mt-3">Date: {moment(date).format("YYYY-MM-DD")}</p>
          <p className="my-1">Komi: {komi}</p>
          <p className="my-1">Result: {result}</p>
        </div>
        <div className="hidden -ml-2 mt-4 lg:block">
          <KifuControls
            onFirst={handleFirst}
            onFastPrev={handleFastPrev}
            onPrev={handlePrev}
            onNext={handleNext}
            onFastNext={handleFastNext}
            onLast={handleLast}
          />
        </div>
      </div>
    </div>
  );
};

export default Kifu;

// const id = window.location.pathname.split("/").pop();

// const { data, loading, error } = useQuery(GET_KIFU, {
//   variables: { id },
// });

// const [kifu, setKifu] = useState({
//   bRank: "",
//   wRank: "",
//   result: "",
//   komi: "",
//   shortDate: "",
//   playerB: { enName: "" },
//   playerW: { enName: "" },
// });

// const [moves, setMoves] = useState([]);
// const [step, setStep] = useState(0);
// const [settings, setSettings] = useState({ theme: "" });

// const canvasRef = useRef<HTMLCanvasElement>(null);

// useEffect(() => {
//   if (!data) return;
//   setKifu(data.kifu);
//   setSettings(data.settings);
//   setMoves(data.kifu.steps.split(";"));
// }, [data]);

// useEffect(() => {
//   if (canvasRef.current) {
//     const { width, height } = window.screen;
//     const boardWidth =
//       width > height ? window.innerHeight - 60 : window.innerWidth;
//     if (canvasRef.current !== null) {
//       canvasRef.current.width = boardWidth;
//       canvasRef.current.height = boardWidth;
//     }

//     const board = new Board({
//       theme: settings.theme,
//       canvas: canvasRef.current,
//       showCoordinate: true,
//     });

//     board.setStones(CoordsToTree(moves.slice(0, step)));
//     board.render();
//   }
// }, [moves, settings, step]);

// if (loading) return <div>Loading...</div>;
// if (error) return <div>Error</div>;

// const gutter = 18;
// const iconStyle = {
//   fontSize: 26,
//   padding: 8,
//   marginTop: 10,
//   marginLeft: -10,
// };

// return (
//   <Row className="kifu-container" gutter={[24, 24]}>
//     <Col style={{ padding: "12px 20px" }}>
//       <div className="kifu-board">
//         <canvas
//           role="button"
//           style={{ width: "90vh", height: "90vh" }}
//           ref={canvasRef}
//           onClick={() => {
//             if (step > moves.length) return;
//             setStep(step + 1);
//           }}
//         />
//       </div>
//     </Col>
//     <Col style={{ padding: "30px 30px" }}>
//       <Row gutter={[gutter, gutter]}>
//         <Col>Black: </Col>
//         <Col>
//           {kifu.playerB.enName}({kifu.bRank})
//         </Col>
//       </Row>
//       <Row gutter={[gutter, gutter]}>
//         <Col>White: </Col>
//         <Col>
//           {kifu.playerW.enName}({kifu.wRank})
//         </Col>
//       </Row>
//       <Row gutter={[gutter, gutter]}>
//         <Col>Result: </Col>
//         <Col>{kifu.result}</Col>
//       </Row>
//       <Row gutter={[gutter, gutter]}>
//         <Col>Komi: </Col>
//         <Col>{kifu.komi}</Col>
//       </Row>
//       <Row gutter={[gutter, gutter]}>
//         <Col>Date: </Col>
//         <Col>{kifu.shortDate}</Col>
//       </Row>
//       <Row gutter={[gutter, gutter]}>
//         <Col>
//           <FastBackwardOutlined
//             style={iconStyle}
//             onClick={() => {
//               setStep(1);
//             }}
//           />
//           <BackwardOutlined
//             style={iconStyle}
//             onClick={() => {
//               step < 10 ? setStep(0) : setStep(step - 10);
//             }}
//           />
//           <CaretLeftOutlined
//             style={iconStyle}
//             onClick={() => {
//               if (step <= 0) return;
//               setStep(step - 1);
//             }}
//           />
//           <CaretRightOutlined
//             style={iconStyle}
//             onClick={() => {
//               if (step > moves.length) return;
//               setStep(step + 1);
//             }}
//           />
//           <ForwardOutlined
//             style={iconStyle}
//             onClick={() => {
//               step < moves.length - 10
//                 ? setStep(step + 10)
//                 : setStep(moves.length);
//             }}
//           />
//           <FastForwardOutlined
//             style={iconStyle}
//             onClick={() => {
//               setStep(moves.length);
//             }}
//           />
//         </Col>
//       </Row>
//     </Col>
//   </Row>
