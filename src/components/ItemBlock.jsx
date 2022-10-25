import React from "react"

const ItemBlock = ({ title, measure, onValue, placeholder, value }) => {

   return (
      <div className="item-block">
         <div className="item-block__title">{title}</div>
         <div className="input-block">
            <input type="text" onChange={(e) => onValue(e.target.value)} placeholder={placeholder} value={value}/>
            <span>{measure}</span>
         </div>
      </div>
   )
}

export default ItemBlock
