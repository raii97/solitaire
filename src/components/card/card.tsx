import { CSSProperties } from "react";
import { Card } from "../../types";
import "./card.css";

interface CardComponentProps {
  card: Card;
  handleClick?: any;
  rowIndex?: number;
  colIndex?: number;
}

const CardComponent = (props: CardComponentProps) => {
  if (!props.card) {
    return null;
  }
  const getSuitIcon = () => {
    switch (props.card.suit) {
      case "heart":
        return "/heart-icon.png";
      case "spade":
        return "/spade-icon.png";
      case "diamond":
        return "/diamond-icon.png";
      case "club":
        return "/club-icon.png";
    }
  };

  const handleCardClick = () => {
    if (!props.handleClick) {
      return;
    }
    if (props.colIndex !== undefined && props.rowIndex !== undefined) {
      props.handleClick(props.colIndex, props.rowIndex);
    } else {
      props.handleClick();
    }
  };

  const getCardLabel = () => {
    if (props.card.number === 1) {
      return "A";
    }
    if (props.card.number === 11) {
      return "J";
    }
    if (props.card.number === 12) {
      return "Q";
    }
    if (props.card.number === 13) {
      return "K";
    }

    return props.card.number;
  };

  const getCardStyle = () => {
    if (props.rowIndex !== undefined) {
      return {
        position: "absolute",
        top: `${props.rowIndex * 40}px`,
        backgroundColor: "white",
      } as CSSProperties;
    }
  };

  // const getFaceCardClass = () => {
  //   const { color, number } = props.card;

  //   if (number === 11) {
  //     if (color === "red") {
  //       return "red-jack";
  //     } else {
  //       return "black-jack";
  //     }
  //   } else if (number === 12) {
  //     if (color === "red") {
  //       return "red-jack";
  //     } else {
  //       return "black-jack";
  //     }
  //   } else if (number === 11) {
  //     if (color === "red") {
  //       return "red-jack";
  //     } else {
  //       return "black-jack";
  //     }
  //   }

  //   return "";
  // };

  if (!props.card.flipped) {
    return <div className="card back-card" style={getCardStyle()}></div>;
  }

  return (
    <div
      style={getCardStyle()}
      onClick={handleCardClick}
      className={`card ${
        props.card.color === "black" ? "black-card" : "red-card"
      } ${props.card.selected ? "selected-card" : ""} `}
    >
      <div className="number">{getCardLabel()}</div>
      <div className="top-left-icon">
        <img src={getSuitIcon()} alt={props.card.suit} className="suit-icon" />{" "}
        <div className="number ">{getCardLabel()}</div>
      </div>

      <img
        src={getSuitIcon()}
        alt={props.card.suit}
        className="suit-icon bottom-right-icon"
      />
    </div>
  );
};
export default CardComponent;
