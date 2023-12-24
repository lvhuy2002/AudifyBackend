const currentDate = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(currentDate.getDate() - 25);

console.log(sevenDaysAgo);