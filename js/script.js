class DigitalClock {
  constructor() {
    this.alarm = new AlarmClock(this);

    this.hoursFirstDigit = document.querySelector(".hours__digit--first");
    this.hoursSecondDigit = document.querySelector(".hours__digit--second");

    this.minutesFirstDigit = document.querySelector(".minutes__digit--first");
    this.minutesSecondDigit = document.querySelector(".minutes__digit--second");

    this.secondsFirstDigit = document.querySelector(".seconds__digit--first");
    this.secondsSecondDigit = document.querySelector(".seconds__digit--second");

    this.day = "";
    this.hours = "0";
    this.minutes = "0";
    this.seconds = "0";

    this.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    this.digits = {
      0: {
        top: ["left", "top", "right", "bottom"],
        bottom: ["left", "right", "bottom"],
      },
      1: {
        top: ["right"],
        bottom: ["right"],
      },
      2: {
        top: ["top", "right", "bottom"],
        bottom: ["left", "bottom"],
      },
      3: {
        top: ["top", "right", "bottom"],
        bottom: ["right", "bottom"],
      },
      4: {
        top: ["left", "right", "bottom"],
        bottom: ["right"],
      },
      5: {
        top: ["left", "top", "bottom"],
        bottom: ["right", "bottom"],
      },
      6: {
        top: ["left", "top", "bottom"],
        bottom: ["left", "right", "bottom"],
      },
      7: {
        top: ["top", "right"],
        bottom: ["right"],
      },
      8: {
        top: ["left", "top", "right", "bottom"],
        bottom: ["left", "right", "bottom"],
      },
      9: {
        top: ["left", "top", "right", "bottom"],
        bottom: ["right", "bottom"],
      },
    };

    const buttonStart = document.querySelector(".navigation__start");
    buttonStart.addEventListener("click", () => {
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      
      this.showTime();
      this.interval = setInterval(() => this.showTime(), 1000);
    });

    const buttonStop = document.querySelector(".navigation__stop");
    buttonStop.addEventListener("click", () => {
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.resetHours();
      this.resetMinutes();
      this.resetSeconds();

      console.log(this.interval);
      clearInterval(this.interval);
    });

  }

  showTime() {
    const now = new Date();

    const day = now.getDay();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    // Розбиваємо години на цифри
    const [firstDigitHours, secondDigitHours] = hours;
    const [firstDigitMinutes, secondDigitMinutes] = minutes;
    const [firstDigitSeconds, secondDigitSeconds] = seconds;

    // Очищаємо попередні активні сегменти
    this.resetSeparator();

    if (this.hours !== hours) {
      this.hours = hours;
      this.resetHours();
      this.showDigit(this.hoursFirstDigit, parseInt(firstDigitHours));
      this.showDigit(this.hoursSecondDigit, parseInt(secondDigitHours));
    }

    if (this.minutes !== minutes) {
      this.minutes = minutes;
      this.resetMinutes();
      this.showDigit(this.minutesFirstDigit, parseInt(firstDigitMinutes));
      this.showDigit(this.minutesSecondDigit, parseInt(secondDigitMinutes));
    }

    this.resetSeconds();
    this.seconds = seconds;
    this.showDigit(this.secondsFirstDigit, parseInt(firstDigitSeconds));
    this.showDigit(this.secondsSecondDigit, parseInt(secondDigitSeconds));

    if (this.day !== day) {
      this.day = day;
      this.resetDays();
      this.showDays(day);
    }
    this.showSeparator();

    this.alarm.checkAlarm(hours, minutes);

  }

  showDigit(digitElement, number) {
    const { top, bottom } = this.digits[number];

    // Активуємо верхні сегменти
    top.forEach((segment) => {
      const topSegment = digitElement.querySelector(
        `.digit__block--top .digit__segment--${segment}`
      );
      if (topSegment) topSegment.classList.add("digit__segment--active");
    });

    // Активуємо нижні сегменти
    bottom.forEach((segment) => {
      const bottomSegment = digitElement.querySelector(
        `.digit__block--bottom .digit__segment--${segment}`
      );
      if (bottomSegment) bottomSegment.classList.add("digit__segment--active");
    });
  }

  showDays(day) {
    const elDay = this.days[day];

    const allDays = document.querySelectorAll(".weekdays__day");
    allDays.forEach((el) => {
      if (el.textContent === elDay) {
        el.classList.add("weekdays__day--active");
      }
    });
  }

  showSeparator() {
    const allSeparator = document.querySelectorAll(".separator__dot");
    allSeparator.forEach((el) => {
      el.classList.add("separator__dot--active");
    });
  }

  resetHours() {
    const allSegments = document.querySelectorAll(".digit__hours");
    allSegments.forEach((segment) => {
      segment.classList.remove("digit__segment--active");
    });
  }

  resetMinutes() {
    const allSegments = document.querySelectorAll(".digit__minutes");
    allSegments.forEach((segment) => {
      segment.classList.remove("digit__segment--active");
    });
  }

  resetSeconds() {
    const allSegments = document.querySelectorAll(".digit__seconds");
    allSegments.forEach((segment) => {
      segment.classList.remove("digit__segment--active");
    });
  }

  resetDays() {
    const allDays = document.querySelectorAll(".weekdays__day");
    allDays.forEach((el) => {
      el.classList.remove("weekdays__day--active");
    });
  }

  resetSeparator() {
    const allSeparator = document.querySelectorAll(".separator__dot");
    allSeparator.forEach((el) => {
      el.classList.remove("separator__dot--active");
    });
  }

  start() {
    this.showTime();
    this.interval = setInterval(() => this.showTime(), 1000);
  }
}

class AlarmClock {
  constructor(digitalClock) {
    this.digitalClock = digitalClock;
    this.inputHours = document.querySelector(".navigation__hours");
    this.inputMinutes = document.querySelector(".navigation__minutes");

    this.inputHours.value = "";
    this.inputMinutes.value = "";

    this.alarmHours = localStorage.getItem("alarmHours");
    this.alarmMinutes = localStorage.getItem("alarmMinutes");

    this.alarmSound = new Audio("./sounds/65.wav");
    this.alarmSound.load();

    this.inputHours.addEventListener("input", (e) => {
      this.alarmHours = e.target.value;
      this.digitalClock.alarmHours = this.alarmHours;

      const [firstDigitHours, secondDigitHours] = this.alarmHours.toString().padStart(2, "0");
      this.digitalClock.resetHours();

      this.digitalClock.showDigit(this.digitalClock.hoursFirstDigit, parseInt(firstDigitHours));
      this.digitalClock.showDigit(this.digitalClock.hoursSecondDigit, parseInt(secondDigitHours));

      localStorage.setItem("alarmHours", this.alarmHours);
    });

    this.inputMinutes.addEventListener("input", (e) => {
      this.alarmMinutes = e.target.value;
      this.digitalClock.alarmMinutes = this.alarmMinutes;

      const [firstDigitMinutes, secondDigitMinutes] = this.alarmMinutes.toString().padStart(2, "0");

      this.digitalClock.resetMinutes();

      this.digitalClock.showDigit(this.digitalClock.minutesFirstDigit, parseInt(firstDigitMinutes));
      this.digitalClock.showDigit(this.digitalClock.minutesSecondDigit, parseInt(secondDigitMinutes));

      localStorage.setItem("alarmMinutes", this.alarmMinutes);
    });
  }

  checkAlarm(hours, minutes) {
    if (this.alarmHours === hours && this.alarmMinutes === minutes) {
      this.alarmSound.play();
    }
  }
}

// Запуск годинника
const clock = new DigitalClock();
clock.start();

const alarm = new AlarmClock(clock);
