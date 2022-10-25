import React, { useEffect, useRef, useState } from "react"
import ItemBlock from "./components/ItemBlock"

import downArrowIcon from "./img/down-arrow.png"

const App = () => {
   const dropdownCapitalization = [
      "Without capitalization",
      "Monthly capitalization",
   ]

   const dropdownTerm = ["months", "years"]

   const termMenu = useRef(null)
   const interestMenu = useRef(null)

   const [activeIndex, setActiveIndex] = useState(0)
   const [activeItem, setActiveItem] = useState(
      dropdownCapitalization[activeIndex]
   )
   const [activeIndexTerm, setActiveIndexTerm] = useState(0)
   const [activeTerm, setActiveTerm] = useState(dropdownTerm[0])

   const [toggleList, setToggleList] = useState(false)
   const [toggleTerm, setToggleTerm] = useState(false)

   const [depositStart, setDepositStart] = useState("")
   const [termValue, setTermValue] = useState("")
   const [interestRateValue, setInterestRateValue] = useState("")
   const [taxValue, setTaxValue] = useState("")
   const [replenishment, setReplenishment] = useState("")
   const [inflationLevel, setInflationLevel] = useState("")

   const [totalResult, setTotalResult] = useState(["0,00", "0,00"])

   const isNumber = (value) => {
      if (typeof value !== "number") {
         value = Number(value)
      }
      return value
   }

   const toDot = (value) => {
      if (value.includes(",")) {
         value = value.replace(",", ".")
      }
      return value
   }

   const isValid = (value, comma = "with comma") => {
      let resultValidation = {}

      if (
         comma === "without comma" &&
         (value.match(/\./) || value.match(/\,/))
      ) {
         resultValidation = {
            isValid: false,
            message: "please enter integer value without comma or dot",
         }
         return resultValidation
      }

      const valueArray = value.split("")
      value = value.split(" ").join("")
      value = toDot(value)

      // contains a space
      if (valueArray[valueArray.length - 1] === " ") {
         resultValidation = {
            isValid: false,
            message: "the value can't includes a space",
         }
         return resultValidation
      }

      // not number
      if (isNaN(value)) {
         resultValidation = {
            isValid: false,
            message: "please enter a number",
         }
         return resultValidation
      }

      // 012345
      if (value.match(/^0\d/)) {
         resultValidation = {
            isValid: false,
            message: "wrong number format",
         }
         return resultValidation
      }

      return { isValid: true }
   }

   const joinNumber = (value) => {
      value = value.split(" ").join("")
      value = Number(value)
      return value
   }

   const splitNumber = (value) => {
      let number = toDot(value)
      number = joinNumber(number)
      value = value.split(" ").join("")

      if (number >= 1000) {
         let x = number
         let thousands = 0,
            tens = 0
         while (x >= 1000) {
            x /= 1000
            thousands++
         }

         while (x >= 10) {
            x /= 10
            tens++
         }
         value = value.split("")

         switch (tens) {
            case 0:
               value.splice(1, 0, " ")
               break
            case 1:
               value.splice(2, 0, " ")
               break
            case 2:
               value.splice(3, 0, " ")
               break
         }

         for (let i = 1; i < thousands; i++) {
            value.splice(tens + 1 + i * 3 + i, 0, " ")
         }
         value = value.join("")
         return value
      } else {
         return value
      }
   }

   const checkDepositStart = (value) => {
      const validation = isValid(value)

      if (validation.isValid) {
         const result = splitNumber(value)
         setDepositStart(result)
      } else {
         alert(validation.message)
      }
   }

   const checkTermValue = (value) => {
      const validation = isValid(value, "without comma")

      if (validation.isValid) {
         setTermValue(value)
      } else {
         alert(validation.message)
      }
   }

   const checkInterestRateValue = (value) => {
      const validation = isValid(value)

      if (validation.isValid) {
         setInterestRateValue(value)
      } else {
         alert(validation.message)
      }
   }

   const checkTaxValue = (value) => {
      const validation = isValid(value)

      if (validation.isValid) {
         setTaxValue(value)
      } else {
         alert(validation.message)
      }
   }

   const checkReplenishments = (value) => {
      const validation = isValid(value)

      if (validation.isValid) {
         const result = splitNumber(value)
         setReplenishment(result)
      } else {
         alert(validation.message)
      }
   }

   const checkInflationRate = (value) => {
      const validation = isValid(value)

      if (validation.isValid) {
         setInflationLevel(value)
      } else {
         alert(validation.message)
      }
   }

   const onChooseItem = (e, index) => {
      setActiveIndex(index)
      setActiveItem(dropdownCapitalization[index])
      setToggleList(!toggleList)
   }

   const onChooseTerm = (e, index) => {
      setActiveIndexTerm(index)
      setActiveTerm(dropdownTerm[index])
      setToggleTerm(!toggleTerm)
   }

   let termDepositInMonths = 0

   const roundNumber = (number) => {
      number = isNumber(number)
      let result = Math.round(number * 100) / 100
      result = result.toFixed(2)
      return result
   }

   const countInflationAmount = (sum, termDepositInMonths, inflationAmount) => {
      const inflation = (sum * inflationAmount * termDepositInMonths) / 12 / 100
      return inflation
   }

   let depositEnd = 0,
      netIncome = 0

   const countSimpleInterest = () => {
      let depositAmount = toDot(depositStart)
      let interestRate = toDot(interestRateValue)
      let tax = toDot(taxValue)
      let replenishmentsAmount = toDot(replenishment)
      let inflation = toDot(inflationLevel)

      depositAmount = joinNumber(depositAmount)
      interestRate = joinNumber(interestRate)
      tax = joinNumber(tax)
      replenishmentsAmount = joinNumber(replenishmentsAmount)
      inflation = joinNumber(inflation)
      termDepositInMonths = Number(termDepositInMonths)

      depositEnd = depositAmount

      let inflationAmount = countInflationAmount(
         depositEnd,
         termDepositInMonths,
         inflation
      )
      netIncome = 0
      let totalIncome = 0

      const interestRatePerMonth = interestRate / 12 / 100

      for (let i = 1; i <= termDepositInMonths; i++) {
         let revenue = depositEnd * interestRatePerMonth
         let taxAmount = (revenue * tax) / 100
         netIncome = revenue - taxAmount
         totalIncome += netIncome
         if (i > 1 && i < termDepositInMonths) {
            inflationAmount += countInflationAmount(
               netIncome,
               termDepositInMonths - i,
               inflation
            )
            inflationAmount += countInflationAmount(
               replenishmentsAmount,
               termDepositInMonths - i,
               inflation
            )
         }
         depositEnd += replenishmentsAmount
      }

      totalIncome -= inflationAmount
      depositEnd += totalIncome
      totalIncome = depositEnd - depositAmount

      totalIncome = roundNumber(totalIncome)
      depositEnd = roundNumber(depositEnd)

      totalIncome = splitNumber(String(totalIncome))
      depositEnd = splitNumber(String(depositEnd))

      totalIncome = totalIncome.replace(".", ",")
      depositEnd = depositEnd.replace(".", ",")

      const result = [totalIncome, depositEnd]
      setTotalResult(result)
   }

   const countCompoundInterest = () => {
      let depositAmount = toDot(depositStart)
      let interestRate = toDot(interestRateValue)
      let tax = toDot(taxValue)
      let replenishmentsAmount = toDot(replenishment)
      let inflation = toDot(inflationLevel)

      depositAmount = joinNumber(depositAmount)
      interestRate = joinNumber(interestRate)
      tax = joinNumber(tax)
      replenishmentsAmount = joinNumber(replenishmentsAmount)
      inflation = joinNumber(inflation)
      termDepositInMonths = Number(termDepositInMonths)

      depositEnd = depositAmount
      let inflationAmount = countInflationAmount(
         depositEnd,
         termDepositInMonths,
         inflation
      )
      const interestRatePerMonth = interestRate / 12 / 100

      for (let i = 1; i <= termDepositInMonths; i++) {
         let revenue = depositEnd * interestRatePerMonth
         let taxAmount = (revenue * tax) / 100
         let incomeAfterTax = revenue - taxAmount

         if (i > 1 && i < termDepositInMonths) {
            inflationAmount += countInflationAmount(
               incomeAfterTax,
               termDepositInMonths - i,
               inflation
            )
            inflationAmount += countInflationAmount(
               replenishmentsAmount,
               termDepositInMonths - i,
               inflation
            )
         }

         depositEnd = depositEnd + incomeAfterTax + replenishmentsAmount
      }

      depositEnd -= inflationAmount
      netIncome = depositEnd - depositAmount

      netIncome = roundNumber(netIncome)
      depositEnd = roundNumber(depositEnd)

      netIncome = splitNumber(String(netIncome))
      depositEnd = splitNumber(String(depositEnd))

      netIncome = netIncome.replace(".", ",")
      depositEnd = depositEnd.replace(".", ",")

      const result = [netIncome, depositEnd]
      setTotalResult(result)
   }

   const countResult = () => {
      // Calculate term of deposit in months depending on selected term (months or years)
      if (activeTerm === dropdownTerm[0]) {
         termDepositInMonths = termValue
      } else {
         termDepositInMonths = termValue * 12
      }
      // Choose calculation formula depending on selected kind of capitalization
      if (activeItem === dropdownCapitalization[0]) {
         return countSimpleInterest()
      } else {
         return countCompoundInterest()
      }
   }

   const hideMenu = (e) => {
      if (
         interestMenu.current &&
         !interestMenu.current.contains(e.target) &&
         toggleList
      ) {
         setToggleList(false)
      } else if (
         termMenu.current &&
         !termMenu.current.contains(e.target) &&
         toggleTerm
      ) {
         setToggleTerm(false)
      }
   }

   useEffect(() => {
      document.addEventListener("click", hideMenu)
      return () => document.removeEventListener("click", hideMenu)
   })

   return (
      <div className="container">
         <h1>Deposit calculator</h1>
         <div className="main-content">
            {/* Deposit amount block */}
            <ItemBlock
               title="Deposit amount"
               measure="UAH"
               onValue={checkDepositStart}
               placeholder={"0.00"}
               value={depositStart}
            />

            {/* Deposit term block */}
            <div className="item-block">
               <div className="item-block__title">Deposit term</div>

               <div className="input-block">
                  <input
                     className="term-input"
                     type="text"
                     placeholder={"0"}
                     onChange={(e) => checkTermValue(e.target.value)}
                     value={termValue}
                  />
                  <div className="term-menu" ref={termMenu}>
                     <div
                        className="title-menu"
                        onClick={() => setToggleTerm(!toggleTerm)}
                     >
                        <span>{activeTerm}</span>
                        <img
                           src={downArrowIcon}
                           alt="down-arrow-icon"
                           style={{
                              width: "10px",
                              height: "10px",
                              opacity: ".6",
                              marginTop: "5px",
                           }}
                        />
                     </div>
                     {toggleTerm ? (
                        <ul className="term-list">
                           {dropdownTerm.map((item, index) => {
                              return (
                                 <li
                                    className={
                                       index === activeIndexTerm
                                          ? "term-list__item active"
                                          : "term-list__item"
                                    }
                                    key={index}
                                    onClick={(e) => onChooseTerm(e, index)}
                                 >
                                    {item}
                                 </li>
                              )
                           })}
                        </ul>
                     ) : null}
                  </div>
               </div>
            </div>

            {/* Interest rate block */}
            <ItemBlock
               title="Annual interest rate"
               measure="%"
               onValue={checkInterestRateValue}
               placeholder={"0"}
               value={interestRateValue}
            />

            {/* Income tax block */}
            <ItemBlock
               title="Income tax"
               measure="%"
               onValue={checkTaxValue}
               placeholder={"0"}
               value={taxValue}
            />

            {/* Interest capitalization block */}
            <div className="item-block">
               <div className="item-block__title">Interest capitalization</div>
               <div className="capitalization-menu" ref={interestMenu}>
                  <div
                     className="title-menu"
                     onClick={() => setToggleList(!toggleList)}
                  >
                     <span>{activeItem}</span>
                     <img
                        src={downArrowIcon}
                        alt="down-arrow-icon"
                        style={{
                           width: "15px",
                           height: "15px",
                           opacity: ".6",
                           marginTop: "5px",
                        }}
                     />
                  </div>
                  {toggleList ? (
                     <ul className="dropdown">
                        {dropdownCapitalization.map((item, index) => {
                           return (
                              <li
                                 className={
                                    index === activeIndex
                                       ? "dropdown__item active"
                                       : "dropdown__item"
                                 }
                                 key={index}
                                 onClick={(e) => onChooseItem(e, index)}
                              >
                                 {item}
                              </li>
                           )
                        })}
                     </ul>
                  ) : null}
               </div>
            </div>

            {/* Monthly replenishments block */}
            <ItemBlock
               title="Monthly replenishments"
               measure="UAH"
               onValue={checkReplenishments}
               placeholder={"0.00"}
               value={replenishment}
            />

            {/* Inflation rate block */}
            <ItemBlock
               title="Average annual inflation rate"
               measure="%"
               onValue={checkInflationRate}
               placeholder={"0"}
               value={inflationLevel}
            />

            <div className="count-btn" onClick={() => countResult()}>
               Calculate
            </div>
         </div>
         {/* Total result block */}
         <div className="item-block">
            <div className="income">
               Total income:
               <span> {totalResult ? totalResult[0] : "0,00"} </span>
               UAH
            </div>
            <div className="assets">
               Your assets after withdrawal:
               <span> {totalResult ? totalResult[1] : "0,00"} </span>
               UAH
            </div>
         </div>
      </div>
   )
}

export default App
