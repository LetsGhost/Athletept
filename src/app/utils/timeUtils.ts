class TimeUtils {
    getToday(date: Date) {
        try{
            const myDate = new Date(date);

            return myDate.getDay();
        }catch(error){
            console.log("An error occurred while getting the day of the week: " + error);
        }
    } 

    getWeekNumber(d: Date){
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
        return weekNo;
    }
}

export default new TimeUtils();