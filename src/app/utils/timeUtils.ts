import logger from "../../config/winstonLogger";

class TimeUtils {
    getToday(date: Date) {
        try{
            const myDate = new Date(date);

            return myDate.getDay();
        }catch(error){
            logger.error('Error getting today:', error, {service: 'TimeUtils.getToday'});
            return 0;
        }
    } 

    getWeekNumber(d: Date){
        try{
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            const weekNo = Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
            return weekNo;
        } catch(error){
            logger.error('Error getting week number:', error, {service: 'TimeUtils.getWeekNumber'});
            return 0;
        }
    }
}

export default new TimeUtils();