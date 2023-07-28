const fs = require("fs");

const path = require("path");

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Reading the JSON file
const shopSchedule = JSON.parse(
  fs.readFileSync(path.join(__dirname, "schedule.json"), "utf-8")
);

// converting time to milliSeconds
const convertTimeToMilliSeconds = (time) =>
  new Date(`08/05/2001 ${time}`).getTime();

// current date and time
const currentDate = new Date();

const currentTime = currentDate.toLocaleString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});
// console.log(currentTime);

const currentDay = currentDate.toLocaleString("en-US", {
  weekday: "short",
});

const nextOpenDay = function () {
  let nextOpenDay = days[(days.indexOf(currentDay) + 1) % 7];
  let daysToAdd = 1;

  while (!shopSchedule.find((schedule) => schedule.day === nextOpenDay)) {
    nextOpenDay = days[(days.indexOf(nextOpenDay) + 1) % 7];
    daysToAdd++;
  }

  // calculating time until next open day
  const nextOpenTime = shopSchedule.find(
    (schedule) => schedule.day === nextOpenDay
  ).open;
  const nextOpenDateTime = new Date(
    currentDate.toDateString() + " " + nextOpenTime
  );
  const timeUntilNextOpen = nextOpenDateTime - currentDate;

  let hoursUntilNextOpenTime =
    Math.floor(timeUntilNextOpen / (1000 * 60 * 60)) + daysToAdd * 24;

  if (hoursUntilNextOpenTime <= 24) {
    console.log(`The shop will open after ${hoursUntilNextOpenTime} hours`);
  } else {
    const openDay = Math.floor(hoursUntilNextOpenTime / 24);
    hoursUntilNextOpenTime = hoursUntilNextOpenTime % 24;
    console.log(
      `The shop will open after ${openDay} day/s and ${hoursUntilNextOpenTime}hour/s`
    );
  }
};

// finding the shop schedule for current day
const shopCurrentSchedule = shopSchedule.find(
  (schedule) => schedule.day === currentDay
);
console.log("Shops current schedule:", shopCurrentSchedule);

// if shop current schedule exists
if (shopCurrentSchedule) {
  const { open, close } = shopCurrentSchedule;
  const currentTimeInMSeconds = convertTimeToMilliSeconds(currentTime);
  const openTimeInMSeconds = convertTimeToMilliSeconds(open);
  const closeTimeInMSeconds = convertTimeToMilliSeconds(close);

  // if the user reaches in between the open and close time
  if (
    currentTimeInMSeconds >= openTimeInMSeconds &&
    currentTimeInMSeconds < closeTimeInMSeconds
  ) {
    console.log("Shop is currently open");

    // remaining time until close
    const remainingTime = closeTimeInMSeconds - currentTimeInMSeconds;
    const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
    console.log(`Shop will be closed within ${remainingHours} hour/s`);
  }

  // if the user reaches b4 the opening of the shop on the shop schedule day
  else {
    if (currentTimeInMSeconds < openTimeInMSeconds) {
      const shopOpenAfter = Math.abs(
        openTimeInMSeconds - currentTimeInMSeconds
      );
      console.log(
        `Shop will open after ${Math.floor(
          shopOpenAfter / (1000 * 60 * 60)
        )}hour/s`
      );
    }

    // if the user reaches after the shop is closed but on the current shop schedule day
    else {
      console.log("Shop is currently closed");

      nextOpenDay();
    }
  }
} else {
  console.log("The shop is currently closed");

  // finding next open day
  nextOpenDay();
}
