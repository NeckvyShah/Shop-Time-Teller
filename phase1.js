const fs = require('fs');

const path = require('path');

// converting time to milliSeconds
const convertTimeToMilliSeconds = (time) =>
  new Date(`08/05/2001 ${time}`).getTime();

// Reading the JSON file
const shopSchedule = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'schedule.json'), 'utf-8')
);
// console.log(shopSchedule);

// current date and time
const date = new Date();
// console.log('currentDate:', date);
const currentTime = date.toLocaleString('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
});
// console.log('currentTime:', currentTime);

const currentDay = date.toLocaleString('en-US', {
  weekday: 'short',
});
// console.log('currentDay:', currentDay);

// finding the shop schedule for current day
const shopCurrentSchedule = shopSchedule.find(
  (schedule) => schedule.day === currentDay
);
// console.log('Shops current schedule:', shopCurrentSchedule);

if (shopCurrentSchedule) {
  const { open, close } = shopCurrentSchedule;
  const currentTimeInMSeconds = convertTimeToMilliSeconds(currentTime);
  const openTimeInMSeconds = convertTimeToMilliSeconds(open);
  const closeTimeInMSeconds = convertTimeToMilliSeconds(close);

  const isOpen =
    currentTimeInMSeconds >= openTimeInMSeconds &&
    currentTimeInMSeconds < closeTimeInMSeconds;

  if (isOpen) {
    console.log('The shop is currently open.');
  } else {
    console.log('The shop is currently closed.');
  }
} else {
  console.log('No schedule found for the current day.');
}
