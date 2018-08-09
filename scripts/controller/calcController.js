class CalcController {

    constructor() {

        this._audio = new Audio("click.mp3");
        this._audioOnOff = false;
        this._lastNumber = "";
        this._lastOPerator = "";
        this._operation = [];
        this._keeper = [];
        this._locale = "pt-BR";
        this._displayCalEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    initialize() {

        this.setDisplayDate();

        setInterval(() => {

            this.setDisplayDate();

        }, 1000);

        //atualizar display
        this.setLastNumberToDisplay();

        this.pasteFromClipboard();

        this.music();

    }

    music() {

        document.querySelectorAll("#btn-m").forEach(btn => {
            btn.addEventListener("click", e => {
                this.toggleAudio();
            });
        });

    }

    toggleAudio() {

        this._audioOnOff = !this._audioOnOff;
    }

    playAudio() {
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    clearNumber() {

        this._operation = this._operation.toString().split("");

        this._operation.pop();

        //atualizar display
        this.setLastNumberToDisplay();
    }

    clearEntry() {

        if (this.isOperator(this._operation) > -1) {
            this._operation.pop();
        } else {
            this.clearAll();
        }

        //atualizar display
        this.setLastNumberToDisplay();
    }

    clearAll() {

        this._operation = [];
        this._lastNumber = "";
        this._lastOPerator = "";

        //atualizar display
        this.setLastNumberToDisplay();
    }

    setError() {
        return this.displayCalc = "error";
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    isOperator(value) {
        return (["+", "-", "*", "/", "%", "**"].indexOf(value) > -1);
    }

    setLastOperator(value) {
        this._operation[this._operation.length - 1] = value;
    }

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
        }

    }

    getLastItem(isOperator = true) {

        let lasItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lasItem = this._operation[i];
                break;
            }
        }

        if (!lasItem) {
            lasItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lasItem;
    }

    setLastNumberToDisplay() {

        let lasNumber = this.getLastItem(false);

        if (!lasNumber) lasNumber = 0;

        this.displayCalc = lasNumber;
    }

    getResult() {
        try {
            return eval(this._operation.join(""));
        } catch (error) {
            setTimeout(() => {
                this.setError();
            }, 1);
        }
    }

    calc() {

        let last = "";
        this._lastOPerator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOPerator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if (last == "%") {
            result /= 100;
            this._operation = [result];

        } else {
            this._operation = [result];

            if (last) this._operation.push(last);
        }

        //atualizar display
        this.setLastNumberToDisplay();

    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {
            //string
            if (this.isOperator(value)) {

                this.setLastOperator(value);

            } else {
                this.pushOperation(value);

                //atualizar display
                this.setLastNumberToDisplay();
            }

        } else if (this.isOperator(value) && value == "**") {

            this._operation = [this._operation, "**", "0.5"];
            this.calc();

        } else {
            //number

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperator(newValue);

                //atualizar display
                this.setLastNumberToDisplay();

            }

        }
    }

    addDot() {
        let lastoperation = this.getLastOperation();

        if (typeof lastoperation === "string" && lastoperation.split("").indexOf(".") > -1) return;

        if (this.isOperator(lastoperation) || !lastoperation) {
            this.pushOperation("0.");
        } else {
            this.setLastOperator(lastoperation.toString() + ".");
        }

        //atualizar display
        this.setLastNumberToDisplay();
    }

    negativo() {

        let lastoperation = this.getLastOperation();

        if (this._operation.toString().split("").indexOf("-") > - 1) {

            this.setLastOperator(this._operation.toString().replace("-", ""));

        } else {

            this.setLastOperator("-" + lastoperation.toString());

        }

        //atualizar display
        this.setLastNumberToDisplay();

    }

    execBtn(value) {

        this.playAudio();

        switch (value) {

            case "c":
                this.clearAll();
                break;
            case "ce":
                this.clearEntry();
                break;
            case "Backspace":
                this.clearNumber();
                break;
            case "soma":
                this.addOperation("+");
                break;
            case "subtracao":
                this.addOperation("-");
                break;
            case "divisao":
                this.addOperation("/");
                break;
            case "porcento":
                this.addOperation("%");
                break;
            case "multiplicacao":
                this.addOperation("*");
                break;
            case "sqrt":
                this.addOperation("**");
                break;
            case "igual":
                this.calc();
                break;
            case "ponto":
                this.addDot();
                break;
            case "negativo":
                this.negativo();
                break;
            case "m":
                this.music();
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    initKeyboard() {
        document.addEventListener("keyup", e => {

            this.playAudio();

            switch (e.key) {

                case "Escape":
                    this.clearAll();
                    break;
                case "Backspace":
                    this.clearEntry();
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperation(e.key);
                    break;
                case "=":
                case "Enter":
                    this.calc();
                    break;
                case ".":
                case ",":
                    this.addDot();
                    break;
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperation(parseInt(e.key));
                    break;
                case "c":
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
                case "m":
                    this.music();
                    break;
            }

        });
    }

    copyToClipboard() {
        let input = document.createElement("input");
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
    }

    pasteFromClipboard() {

        document.addEventListener("paste", e => {
            let text = e.clipboardData.getData("Text");
            this.displayCalc = parseFloat(text);
        });

    }

    initButtonsEvents() {

        let buttons = document.querySelectorAll("#buttons > div > button");

        buttons.forEach((btn, index) => {

            btn.addEventListener("click", e => {
                let textBtn = btn.id.replace("btn-", "");
                this.execBtn(textBtn);
            });

        });
    }

    setDisplayDate() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, "short");
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayCalc() {
        return this._displayCalEl.innerHTML;
    }

    set displayCalc(value) {

        if (value.toString().split("").indexOf(".") > -1 && value.toString().length > 10) {

            this._displayCalEl.innerHTML = value.toFixed(10);
            return false;

        } else if (value.toString().length > 11) {

            this.setError();
            return false;

        }

        this._displayCalEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }
    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}