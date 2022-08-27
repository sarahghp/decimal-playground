import dedent from "dedent";

export const CALCULATOR = {
  title: "Calculator",
  description: `This example is a small calculator app written in React, which
  uses exact Decimal calculations instead of floating point. It shows how to
  manipulate the DOM from the playground.`,
  text: dedent`
  // Make sure to click "Toggle DOM" above
  // to see the app!

  function isInteger(dec) {
    const truncOptions = {
      maximumFractionDigits: 0,
      roundingMode: "down",
    };
    return Decimal.round(dec, truncOptions) === dec;
  }

  class Key extends React.Component {
    render() {
      const keyStyle = {
        background: "gray",
        borderRadius: "50%",
        color: "white",
      };
      return (
        <button style={keyStyle} onClick={() => this.props.onClick()}>
          {this.props.children}
        </button>
      );
    }
  }

  class Display extends React.Component {
    render() {
      const displayStyle = {
        backgroundColor: "lightgray",
        borderRadius: 5,
        gridColumnEnd: "span 4",
        fontSize: "2em",
        fontFamily: "sans",
        textAlign: "end",
        padding: 5,
      };

      const { value, inputExponent } = this.props;
      let display = value?.toString();

      // The display should show a trailing decimal point
      // and trailing zeroes if any have been entered.

      // FIXME: This should instead be done with NumberFormat
      // and its minimumFractionDigits option, but that is not
      // yet implemented.
      // FIXME: something weird about if-conditions: results
      // are different when putting this expression directly
      // in the if-statement
      const cond = inputExponent !== 0m;
      if (cond) {
        if (isInteger(value)) {
          display += ".";
        }
        const [, normalizedDecimalDigits] = display.split(".");
        const missingZeroes =
          -(Number(inputExponent) + 1) - normalizedDecimalDigits.length;
        if (missingZeroes > 0) {
          display += "0".repeat(missingZeroes);
        }
      }
      return <div style={displayStyle}>{display}</div>;
    }
  }

  class Calc extends React.Component {
    static #initialState = {
      // Decimal value where we accumulate typed digits
      accum: 0m,
      // If this is non-zero, the user entered a decimal
      // point, and the value of the next typed digit
      // will be multiplied by 10**inputExponent
      inputExponent: 0m,
      // Pending binary operation
      op: null,
      // First operand for the pending binary operation
      store: null,
      // If true, typing another digit will not add that
      // digit to the accumulator, but instead clear the
      // accumulator first. (This happens after typing
      // the = key, or an operator)
      nextDigitClears: false,
    };

    constructor() {
      super();
      this.state = Calc.#initialState;
    }

    #clear() {
      this.setState(Calc.#initialState);
    }

    #appendDigit(digit) {
      let { accum, inputExponent, nextDigitClears } = this.state;
      if (nextDigitClears) {
        accum = 0m;
        inputExponent = 0m;
      }
      // FIXME: *=, +=, -= operators don't work
      // FIXME: something weird about if-conditions, see above
      const cond = inputExponent === 0m;
      if (cond) {
        accum = accum * 10m;
        accum = accum + digit;
      } else {
        accum = accum + Math.pow(10m, inputExponent) * digit;
        inputExponent = inputExponent - 1m;
      }
      this.setState({ accum, inputExponent, nextDigitClears: false });
    }

    #enterDecimalPoint() {
      const { inputExponent, nextDigitClears } = this.state;
      if (inputExponent !== 0m) {
        return;
      }
      if (nextDigitClears) {
        this.setState({ accum: 0m, inputExponent: -1m, nextDigitClears: false });
      } else {
        this.setState({ inputExponent: -1m });
      }
    }

    #calculate() {
      const left = this.state.store;
      const right = this.state.accum;
      switch (this.state.op) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return Decimal.divide(left, right);
        default:
          log("something went wrong");
          return 0;
      }
    }

    #enterOperator(op) {
      const accum = this.state.op ? this.#calculate() : this.state.accum;
      this.setState({
        accum,
        store: accum,
        op,
        inputExponent: 0m,
        nextDigitClears: true,
      });
    }

    #doOperation() {
      if (!this.state.op) {
        this.setState({ inputExponent: 0m, nextDigitClears: true });
        return;
      }
      const result = this.#calculate();
      this.setState({
        accum: result,
        inputExponent: 0m,
        op: null,
        store: null,
        nextDigitClears: true,
      });
    }

    #doUnaryOperation(op) {
      const { accum } = this.state;
      let result;
      switch (op) {
        case "sqrt":
          // FIXME: implement Math.sqrt(); fake it for now
          log("Math.sqrt not yet implemented for Decimal.");
          log("This result is going to be inaccurate.");
          result = Decimal(Math.sqrt(Number(accum)));
          break;
        case "square":
          // FIXME: shouldn't need to wrap this in Decimal()
          result = Math.pow(Decimal(accum), 2m);
          break;
        case "negate":
          result = -1m * accum;
          break;
        default:
          log("something went wrong!");
          result = 0;
      }
      this.setState({
        accum: result,
        nextDigitClears: true,
      });
    }

    render() {
      const gridStyle = {
        columnGap: 10,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gridTemplateRows: "3fr 2fr 2fr 2fr 2fr 2fr",
        rowGap: 10,
        maxWidth: 190,
        maxHeight: 310,
        justifyItems: "stretch",
      };

      return (
        <div style={gridStyle}>
          <Display
            value={this.state.accum}
            inputExponent={this.state.inputExponent}
          ></Display>
          <Key onClick={() => this.#clear()}>C</Key>
          <Key onClick={() => this.#doUnaryOperation("sqrt")}>&radic;</Key>
          <Key onClick={() => this.#doUnaryOperation("square")}>x&sup2;</Key>
          <Key onClick={() => this.#enterOperator("/")}>&divide;</Key>
          <Key onClick={() => this.#appendDigit(7m)}>7</Key>
          <Key onClick={() => this.#appendDigit(8m)}>8</Key>
          <Key onClick={() => this.#appendDigit(9m)}>9</Key>
          <Key onClick={() => this.#enterOperator("*")}>&times;</Key>
          <Key onClick={() => this.#appendDigit(4m)}>4</Key>
          <Key onClick={() => this.#appendDigit(5m)}>5</Key>
          <Key onClick={() => this.#appendDigit(6m)}>6</Key>
          <Key onClick={() => this.#enterOperator("-")}>&minus;</Key>
          <Key onClick={() => this.#appendDigit(1m)}>1</Key>
          <Key onClick={() => this.#appendDigit(2m)}>2</Key>
          <Key onClick={() => this.#appendDigit(3m)}>3</Key>
          <Key onClick={() => this.#enterOperator("+")}>+</Key>
          <Key onClick={() => this.#doUnaryOperation("negate")}>&plusmn;</Key>
          <Key onClick={() => this.#appendDigit(0m)}>0</Key>
          <Key onClick={() => this.#enterDecimalPoint()}>.</Key>
          <Key onClick={() => this.#doOperation()}>=</Key>
        </div>
      );
    }
  }

  // ========================================

  const div = document.createElement("div");
  document.querySelector("body").append(div);
  const root = ReactDOM.createRoot(div);
  root.render(<Calc />);
  `,
};
