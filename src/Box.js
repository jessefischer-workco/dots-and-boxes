export const Box = ({ top, bottom, left, right, winner, onClick }) => (
  <div
    className={
      "box" +
      (top ? " top" + top : "") +
      (bottom ? " bottom" + bottom : "") +
      (left ? " left" + left : "") +
      (right ? " right" + right : "") +
      (winner ? " winner" + winner : "")
    }
    onClick={onClick}
  >
    <span className="winner">{winner || "_"}</span>
    <div className="topLeft"></div>
    <div className="topRight"></div>
    <div className="bottomLeft"></div>
    <div className="bottomRight"></div>
  </div>
);
