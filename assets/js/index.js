class Calendar {

    constructor({ date, table, input, yearSelect, monthSelect }) {

        // Class State

        this._state = "clean";

        // Class Date Options

        this._fullDate = date;
        this._endFullDate = null;
        this._lastFullDate = date;
        this._year = date.getFullYear();
        this._month = date.getMonth();
        this._date = date.getDate();

        // Class Table Options

        this._table = document.querySelector(table);
        this._tableWrapper = this._table.closest("table");
        this._wrapper = this._table.closest(".calendare");
        this._tableSelects = this._wrapper.querySelector(".calendare__select-section");
        this._tableContent = "";
        this._tableCells = [];

        // Class Opinion Elements

        this._input = input;
        this._yearSelect = yearSelect;
        this._monthSelect = monthSelect;

        // Class Started Settings

        this._tableWrapper.classList.add("none");
        this._input.calendar = this;
        this._yearSelect.calendar = this;
        this._monthSelect.calendar = this;
        this.managmentPanel;

        this.setActiveCalendareEvent();
        this.hiddenSelects();

    }

    get isDiapason() {
        return this._isDiapason;
    }

    set isDiapason(value) {
        this._isDiapason = value;
    }

    get state() {
        return this._state;
    }

    get fullDate() {
        return this._fullDate;
    }

    set fullDate(newDate) {
        this._fullDate = newDate;
        this._year = newDate.getFullYear();
        this._month = newDate.getMonth();
        this._date = newDate.getDate();
    }

    get lastFullDate() {
        return this._lastFullDate;
    }

    set lastFullDate(newDate) {
        this._lastFullDate = newDate;
    }

    get endFullDate() {
        return this._endFullDate;
    }

    set endFullDate(value) {
        this._endFullDate = value;
    }

    get year() {
        return this._year;
    }

    get month() {
        return this._month;
    }

    get date() {
        return this._date;
    }

    get input() {
        return this._input;
    }

    get yearSelect() {
        return this._yearSelect;
    }

    get monthSelect() {
        return this._monthSelect;
    }

    generateCells() {
        const startMonthDate = new Date(this._year, this._month);

        this._table.innerHTML = "";

        for (let i = 0; i < this.getDay(startMonthDate); i++) {
            this._tableContent += `<td class="calendare-table__cell calendare-table__cell_empty" data-date="${this._year}.${this._month}.${startMonthDate + i}"></td>`;
        }

        while (startMonthDate.getMonth() == this._month) {
            this._tableContent += `<td class="calendare-table__cell" data-date="${this._year}.${this._month}.${startMonthDate.getDate()}">
                ${startMonthDate.getDate()}
            </td>`;

            if (this.getDay(startMonthDate) == 6) {
                this._tableContent += `</tr><tr class='calendare-table__row'>`;
            }

            startMonthDate.setDate(startMonthDate.getDate() + 1);
        }

        if (this.getDay(startMonthDate) != 0) {
            while (this.getDay(startMonthDate) != 0) {
                this._tableContent += `<td class="calendare-table__cell calendare-table__cell_empty" data-date="${this._year}.${this._month}.${startMonthDate.getDate()}"></td>`;

                startMonthDate.setDate(startMonthDate.getDate() + 1);
            }
        }

        this._table.innerHTML = this._tableContent;

        if (!this._table.lastElementChild.children[0]) {

            const lastRow = this._table.lastElementChild;
            let lastRowContent = "";

            for (let i = 0; i < 7; i++) {
                lastRowContent += `<td class="calendare-table__cell calendare-table__cell_empty"></td>`;
            }

            lastRow.innerHTML = lastRowContent;
        } else if (this._table.children.length == 5) {
            this._tableContent += `<tr class="calendare-table__row">`;

            for (let i = 0; i < 7; i++) {
                this._tableContent += `<td class="calendare-table__cell calendare-table__cell_empty"></td>`;
            }

            this._tableContent += `</tr>`;

            this._table.innerHTML = this._tableContent;
        }

        this._tableContent = "";

        this._tableCells = [...this._table.querySelectorAll(".calendare-table__cell")];

        if (this._isDiapason) {
            this.setDataOrder()
            this.interpretateDiapason();
        }

        this.setActiveCellEvent();

    }

    toggleMonth(direction) {

        if (direction == "next") {

            if (this._month >= 11) {
                this._year++;
                this._month = 0;
            } else {
                this._month++;
            }

            this.generateCells();
        } else {

            if (this._month <= 0) {
                this._year--;
                this._month = 11;
            } else {
                this._month--;
            }

            this.generateCells();
        }

    }

    toggleYear() {

        if (direction == "next") {
            this._year++;
            this.generateCells();
        } else {
            this._year--;
            this.generateCells();
        }

    }

    getDay(date) {
        let trueDate = date.getDay();

        if (trueDate == 0) {
            trueDate = 7;
        }

        return trueDate - 1;
    }

    clearAllCells() {
        this._tableCells.forEach(item => item.classList.remove("calendare-table__cell_active"));
    }

    setActiveCell() {
        const activeCell = this._tableCells.find(item => item.textContent == this._date);

        activeCell.classList.add("calendare-table__cell_active");
    }

    setActiveCellEvent() {
        this._tableCells.forEach(item => {
            item?.addEventListener("click", (event) => {
                const clickedDate = event.currentTarget.textContent;

                this._date = clickedDate;

                this.clearAllCells();
                this.setActiveCell();

                console.log(this._date.trim(), this._month, this._year);

                this._input.input = `${this._date.trim()}.${this._month + 1}.${this._year}`;

                this._state = "changed";
                this.managmentPanel.checkReady();
            });
        });
    }

    openCalendare() {
        this._tableWrapper.classList.remove("none");
    }

    hiddenCalendare() {
        this._tableWrapper.classList.add("none");
    }

    openSelects() {
        this._tableSelects.classList.remove("none");
    }

    hiddenSelects() {
        this._tableSelects.classList.add("none");
    }

    toggleCalendare() {
        this._tableWrapper.classList.toggle("none");
    }

    setDateMemory() {
        this.lastFullDate = this.fullDate;
    }

    getDateMemory() {
        this.fullDate = this.lastFullDate;
    }

    setActiveCalendareEvent() {
        document.addEventListener("click", (event) => {
            if (event.target.closest(".calendare")) {
                if (this.input.state == "clean") {
                    this.input.state = "hover";
                    this.input.setInputView();
                    this.openSelects();
                }
                
            } else {
                if (this.input.state == "hover") {
                    this.input.state = "clean";
                    this.input.setInputView();
                    this.hiddenSelects();
                    this.hiddenCalendare();
                }
                
            }
        });
    }

    millisecondsToDays(milliseconds) {
        return Math.floor(milliseconds / 1000 / 3600 / 24);
    }

    getDiffDates(date1, date2) {
        return this.millisecondsToDays(date1 - date2);
    }

    setDiapasonCalendare(start, end, cells) {
        Array.from(cells).forEach(cell => {
            const value = +(cell.getAttribute("data-order"));
    
            if (value > start && value < end) {
                cell.classList.add("calendare-table__cell_opacity-active");
            }
        });
    }
    
    interpretateDiapason() {
        this.setDiapasonCalendare(this.getDiffDates(this._endFullDate.getDate(), this._fullDate), this._endFullDate.getDate(), this._tableCells);
    }

    setDataOrder() {
        this._tableCells.forEach(item => {
            if (item.getAttribute("data-date")) {
                let itemDateArray = item.getAttribute("data-date").split(".");
                let itemDate = new Date(itemDateArray[0], itemDateArray[1], itemDateArray[2]);
        
                item.setAttribute("data-order", `${Math.round((((itemDate - this._endFullDate) / 1000) / 3600) / 24) + this._endFullDate.getDate() + 1}`);
            }
        });
    }

}

class DateInput {

    constructor({ input, popUp }) {

        // Input Options

        this._state = "clean";
        this._opinionState = "clean";
        this._calendar;

        // Input Elements

        this._inputBlock = document.querySelector(input);
        this._input = this._inputBlock.querySelector(".calendare-input__input");
        this._convertValue = this._inputBlock.querySelector(".calendare-input__value");
        this._clearBtn = this._inputBlock.querySelector(".input-section__delete-btn");
        this._calendarBtn = this._inputBlock.querySelector(".input-section__open-popup-btn");
        this._leftInputSection = this._inputBlock.querySelector(".input-section__left-section");
        this._popUp = popUp;

        // Input Opinion Options

        this._value = this._input.value;
        this._defaultClasses = this._inputBlock.className;

        // Input Events

        // this._calendarBtn.addEventListener("click", (event) => {
        //     this._calendar.toggleCalendare();
        // });

        this._clearBtn.addEventListener("click", (event) => {

            this.clearAll();

            if (this._opinionState != "redactation") {
                this.calendar._state = "clean";
                this.calendar.managmentPanel.checkReady();
            }

        });

        this._clearBtn.addEventListener("mouseover", () => {
            if (this._state == "save") {
                this._popUp.open();
            }
        });

        this._clearBtn.addEventListener("mouseout", () => {
            if (this._state == "save") {
                this._popUp.hidden();
            }
        });

        this._leftInputSection.addEventListener("click", (event) => {
            if (this._state == "save") {
                this._state = "change";
                this._opinionState = "redactation";
                this.setInputView();

                this.calendar.managmentPanel.checkReady();
                this.calendar.openSelects();
                this.calendar.openCalendare();
            }
        });

        this._input.addEventListener("focus", (event) => {
            // if (this._value == "") {
            //     this._state = "hover";
            // } else {
            //     this._state = "change";
            // }

            if (this._value != "") {
                this._state = "change";
            }

            this.setInputView();
        });

        // this._input.addEventListener("blur", (event) => {
        //     if (this._value == "") {
        //         this._state = "clean";
        //     }

        //     this.setInputView();
        // });


        this._input.addEventListener("input", (event) => {

            this._value = event.currentTarget.value;

            if (this._value != "") {
                this._state = "change";
            }   else {
                this._state = "hover";
            }

            if (this.checkValidDate(this._value)) {
                const convertData = this.getFormatedDate();

                this._calendar.fullDate = convertData;

                this._calendar.yearSelect.value = this._calendar.year;
                this._calendar.monthSelect.value = [this._calendar.input.translateMonth(this._calendar.month), this._calendar.month];
                this._calendar.yearSelect.isActive = true;
                this._calendar.monthSelect.isActive = true;

                this._calendar.generateCells();
                this._calendar.setActiveCell();

                this.calendar._state = "changed";
                this.calendar.managmentPanel.checkReady();
            }   else {
                this.calendar._state = "clean";
                this.calendar.managmentPanel.checkReady();
            }

            this.setInputView();

        });

    }

    get input() {
        return this._input.value;
    }

    set input(value) {
        this._value = value;
        this._input.value = value;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    get calendar() {
        return this._calendar;
    }

    set calendar(value) {
        this._calendar = value;
    }

    get convertValue() {
        return this._convertValue.textContent;
    }

    set convertValue(value) {
        this._convertValue.textContent = value;
    }

    clearAll() {
        this.convertValue = "";
        this._input.value = "";

        this._calendar.yearSelect.value = ["Выберите год", ""];
        this._calendar.monthSelect.value = ["Выберите месяц", ""];

        this._calendar.yearSelect.isActive = false;
        this._calendar.monthSelect.isActive = false;

        this._value = "";
        this._state = "clean";
        this.setInputView();

        this.calendar.fullDate = new Date(0, 0, 1);

        this.calendar.hiddenSelects();
        this.calendar.hiddenCalendare();
    }

    checkValidDate(date) {
        const regexp = /\d\d\.\d\d\.\d\d\d\d/;

        return regexp.test(date);
    }

    getFormatedDate() {
        const [date, month, year] = this._value.split(".");

        return new Date(year, month - 1, date);
    }

    setInputView() {

        switch (this._state) {
            case "clean":
                this._inputBlock.className = this._defaultClasses;
                break

            case "hover":
                this._inputBlock.className = this._defaultClasses;
                this._inputBlock.classList.add("input-section_white");
                break

            case "change":
                this._inputBlock.className = this._defaultClasses;
                this._inputBlock.classList.add("input-section_white");
                this._inputBlock.classList.add("input-section_skip-open");
                break

            case "save":
                this._inputBlock.className = this._defaultClasses;
                this._inputBlock.classList.add("input-section_blue");
                break
        }

    }

    translateMonth(month) {
        switch (month) {
            case 0:
                return "Январь"
                break;

            case 1:
                return "Февраль"
                break;

            case 2:
                return "Март"
                break;

            case 3:
                return "Апрель"
                break;

            case 4:
                return "Май"
                break;

            case 5:
                return "Июнь"
                break;

            case 6:
                return "Июль"
                break;

            case 7:
                return "Август"
                break;

            case 8:
                return "Сентябрь"
                break;

            case 9:
                return "Октябрь"
                break;

            case 10:
                return "Ноябрь"
                break;

            case 11:
                return "Декабрь"
                break;
        }
    }

}

class Select {

    constructor(select) {

        // Select Opinion Options

        this.calendar;

        // Select Options

        this._select = document.querySelector(select);
        this._value = this._select.querySelector(".item-select__value");
        this._selectButtons = this._select.querySelectorAll(".item-select__list-value");
        this._isActive = false;
        // this._prevArrow = this._select.querySelector(".item-select__arrow-btn_prev");
        // this._nextArrow = this._select.querySelector(".item-select__arrow-btn_next");

        // Select Events

        this._selectButtons.forEach(item => {
            item.addEventListener("click", (event) => {
                const currentBtn = event.currentTarget;

                this._value.textContent = currentBtn.textContent;
                this._value.setAttribute("data-value", currentBtn.getAttribute("data-value"));
                this._isActive = true;
            });
        });

        this._value.addEventListener("click", (event) => {
            const hiddenElement = event.currentTarget.closest(".item-select__open-section").nextElementSibling;

            hiddenElement.classList.toggle("none");
        });

        // this._prevArrow.addEventListener("click", () => this.toggleArrowValue("standart", "prev"));
        // this._nextArrow.addEventListener("click", () => this.toggleArrowValue("standart", "next"));
    }

    get value() {
        return +this._value.getAttribute("data-value");
    }

    set value(value) {
        if (Array.isArray(value)) {
            const [text, data] = value;
            this._value.textContent = text;
            this._value.setAttribute("data-value", data);
        } else {
            this._value.textContent = value;
            this._value.setAttribute("data-value", value);
        }
    }

    get selectButtons() {
        return this._selectButtons;
    }

    get isActive() {
        return this._isActive;
    }

    set isActive(value) {
        this._isActive = value;
    }

    // toggleArrowValue(direction, method) {

    //     if (method == "standart") {

    //         const currentIndex = this._selectButtons.find(item => item.getAttribute("data-value") == this._value.getAttribute("data-value"));

    //         if (direction == "next") {

    //             if (currentIndex <= 1) {
    //                 this._prevArrow.classList.add("item-select__arrow-btn_disabled");
    //             }   else {
    //                 this._prevArrow.classList.remove("item-select__arrow-btn_disabled");
    //                 this._value.textContent = this._selectButtons[currentIndex + 1].textContent;
    //                 this._value.setAttribute("data-value", this._selectButtons[currentIndex + 1].getAttribute("data-value"));
    //             }

    //         }   else {

    //             if (currentIndex >= this._selectButtons.length - 1) {
    //                 this._nextArrow.classList.add("item-select__arrow-btn_disabled");
    //             }   else {
    //                 this._nextArrow.classList.remove("item-select__arrow-btn_disabled");
    //                 this._value.textContent = this._selectButtons[currentIndex - 1].textContent;
    //                 this._value.setAttribute("data-value", this._selectButtons[currentIndex - 1].getAttribute("data-value"));
    //             }

    //         }
    //     }   else {



    //     }

    // }

}

class Managment {

    constructor({ calendares, applyBtn, resetBtn }) {

        // Managment Options

        this._state = "clean";

        this._calendares = calendares;
        this._applyBtn = document.querySelector(applyBtn);
        this._resetBtn = document.querySelector(resetBtn);

        this._applyBtn.addEventListener("click", () => this.applyChanges());
        this._resetBtn.addEventListener("click", () => this.resetChanges());

        [this._startCalendar, this._endCalendar] = this._calendares;

        this._startCalendar.endFullDate = this._endCalendar.fullDate;
        this._endCalendar.endFullDate = this._endCalendar.fullDate;

        // Managment Started Options

        this._calendares.forEach(calendar => {
            calendar.managmentPanel = this;
        });

        // Managments Events

        this._calendares.forEach(calendar => {

            const selects = [calendar.yearSelect, calendar.monthSelect];
            let isSelection = false;

            selects.forEach(item => {

                item.selectButtons.forEach(btn => {
                    btn.addEventListener("click", (event) => {
                        if (calendar.yearSelect.isActive && calendar.monthSelect.isActive) {
                            isSelection = true;
                        }   else {
                            isSelection = false;
                        }

                        if (!calendar.input.input) {
                            if (isSelection) {
                                const [year, month, date] = [calendar.yearSelect.value, calendar.monthSelect.value, calendar.date];

                                calendar.input.input = `${date}.${month + 1}.${year}`;
                                calendar.fullDate = new Date(year, month, date);

                                calendar.openCalendare();
                                this.generateMonth(calendar);

                                calendar.input.state = "change";
                                calendar.input.setInputView();

                                calendar._state = "changed";
                                calendar.managmentPanel.checkReady();
                            }
                        } else {

                            if (calendar.yearSelect.isActive) {
                                calendar.input.input = `${calendar.date}.${calendar.month}.${calendar.yearSelect.value}`;
                                calendar.fullDate = new Date(calendar.yearSelect.value, calendar.month, calendar.date);
                            }

                            if (calendar.monthSelect.isActive) {
                                calendar.input.input = `${calendar.date}.${calendar.monthSelect.value + 1}.${calendar.year}`;
                                calendar.fullDate = new Date(calendar.year, calendar.monthSelect.value, calendar.date);
                            }

                            calendar.openCalendare();
                            this.generateMonth(calendar);

                            calendar.input.state = "change";
                            calendar.input.setInputView();

                            calendar._state = "changed";
                            calendar.managmentPanel.checkReady();

                        }

                    });
                });

            });

        });

    }

    generateMonth(calendar) {
        // const yearSelectValue = calendar.yearSelect.value;
        // const monthSelectValue = calendar.monthSelect.value;
        // const newDate = new Date(calendar.year, calendar.month, calendar.date);

        // calendar.fullDate = newDate;

        calendar.generateCells();
        calendar.setActiveCell();
    }

    applyChanges() {

        if (this._state == "ready") {
            this._calendares.forEach(calendar => {
                if (calendar.state == "changed") {
                    const input = calendar.input;

                    if (input.input) {
                        calendar.fullDate = input.getFormatedDate();
                        input.convertValue = `${calendar.date} ${input.translateMonth(calendar.month)} ${calendar.year}`;

                        calendar.yearSelect.value = calendar.year;
                        calendar.monthSelect.value = [input.translateMonth(calendar.month), calendar.month];

                        calendar.hiddenCalendare();
                        calendar.hiddenSelects();

                        input.state = "save";
                        input.setInputView();
                        calendar.setDateMemory();
                        this.unsetReadyState();
                    }   else {
                        input.clearAll();
                        calendar.setDateMemory();
                        this.unsetReadyState();
                    }
                }
            });

            if (this._startCalendar.input.state == "save" && this._endCalendar.input.state == "save") {
                this._startCalendar.isDiapason = true;
                this._endCalendar.isDiapason = true;

                this._startCalendar.generateCells();
                this._endCalendar.generateCells();
            }
        }

    }

    resetChanges() {

        if (this._state == "ready") {
            this._calendares.forEach(calendar => {
                if (calendar.state == "changed") {
                    const input = calendar.input;
                    calendar.getDateMemory();
                    console.log(calendar.fullDate);

                    input.input = `${calendar.date}.${calendar.month + 1}.${calendar.year}`;
                    input.convertValue = `${calendar.date} ${input.translateMonth(calendar.month)} ${calendar.year}`;

                    calendar.yearSelect.value = calendar.year;
                    calendar.monthSelect.value = [input.translateMonth(calendar.month), calendar.month];

                    calendar.hiddenCalendare();
                    calendar.hiddenSelects();

                    input.state = "save";
                    input.setInputView();
                    this.unsetReadyState();
                }
            });
        }

    }

    checkReady() {

        this._calendares.forEach(calendar => {
            if (calendar.state == "changed") {
                this.setReadyState();
            }   else {
                this.unsetReadyState();
            }
        });

    }

    setReadyState() {
        this._state = "ready";
        this._applyBtn.classList.add("calendare-block__btn_apply_active");
        this._resetBtn.classList.add("calendare-block__btn_reset_active");
    }

    unsetReadyState() {
        this._state = "clean";
        this._applyBtn.classList.remove("calendare-block__btn_apply_active");
        this._resetBtn.classList.remove("calendare-block__btn_reset_active");
    }

}

class PopUp {
    constructor(popUp) {
        this._popUp = document.querySelector(popUp);
    }

    open() {
        this._popUp.classList.remove("none");
    }

    hidden() {
        this._popUp.classList.add("none");
    }
}

let calendareStart = new Calendar({
    date: new Date(2023, 11, 1),
    table: ".calendare-table__body_start",
    input: new DateInput({ input: ".calendare__input-section_start", popUp: new PopUp(".input-section__pop-up_start" )}),
    yearSelect: new Select(".calendare__item-select_start-year"),
    monthSelect: new Select(".calendare__item-select_start-month")
});

let calendareEnd = new Calendar({
    date: new Date(2023, 11, 1),
    table: ".calendare-table__body_end",
    input: new DateInput({ input: ".calendare__input-section_end", popUp: new PopUp(".input-section__pop-up_end" )}),
    yearSelect: new Select(".calendare__item-select_end-year"),
    monthSelect: new Select(".calendare__item-select_end-month")
});

let managmentPanel = new Managment({
    calendares: [calendareStart, calendareEnd],
    applyBtn: ".calendare-block__btn_apply",
    resetBtn: ".calendare-block__btn_reset",
});

calendareStart.generateCells();