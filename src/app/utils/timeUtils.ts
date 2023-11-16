class TimeUtils {
    getToday(date: Date) {
        try{
            const myDate = new Date(date);

            return myDate.getDay();
        }catch(error){
            console.log("An error occurred while getting the day of the week: " + error);
        }
    }
}

export default new TimeUtils();