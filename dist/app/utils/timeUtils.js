// Check if a date is within the last week
function wasLastWeek(date) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Subtract 7 days from the current date
    // Set the time to the start of the day for accurate comparison
    oneWeekAgo.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= oneWeekAgo;
}
export { wasLastWeek };
