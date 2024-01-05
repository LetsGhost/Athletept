import dbSchedule from "../utils/dbSchedule";
import logger from "../../config/winstonLogger";

class AdminService {
    runDbSchedule(){
        try{
            dbSchedule();
        } catch (error) {
            logger.error("Error running dbSchedule:", error, { service: "AdminService.runDbSchedule" });
        }
    }
}

export default new AdminService();