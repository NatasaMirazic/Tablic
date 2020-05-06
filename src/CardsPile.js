import React from "react";
import {CARD_BACKGROUND} from "./constants/constants";

function CardsPile(props) {
  return (
    <div>
      {props.cards.map((image, index) =>
        <div 
          key={index}
          className={[
            `${props.classContainer}`,
            `card${index}`,
          ].filter(e => !!e).join(' ')}
        >
          <img
            src={require('' + (CARD_BACKGROUND))}
            alt="card"
            className={[
              'back-card',
              `${props.classContainer}`,
              `card${index}`,
            ].filter(e => !!e).join(' ')}/>
        </div>
      )}
  </div>
  )
}

export default CardsPile;
