import dbSchedule from "../utils/dbSchedule.js";
import logger from "../../config/winstonLogger.js";
class AdminService {
    runDbSchedule() {
        try {
            dbSchedule();
        }
        catch (error) {
            logger.error("Error running dbSchedule:", error, { service: "AdminService.runDbSchedule" });
        }
    }
}
export default new AdminService();
