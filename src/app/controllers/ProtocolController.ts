import {Request, Response} from "express";
import protocolService from "../services/ProtocolService";

class ProtocolController{
    async createProtocol(req: Request, res: Response) {
        try {
            const { userId, protocol, comment } = req.body;

            const result = await protocolService.createProtocol(userId, protocol, comment);

            if (result && 'success' in result) {
                const { success, code, message, newProtocol } = result;
                return res.status(code).json({ success, message, newProtocol });
            } else {
                console.log('Unexpected response from protocolService.createProtocol');
                throw new Error('Unexpected response from protocolService.createProtocol');
            }
        } catch (error) {
            console.error('Error creating ProtocolExercisePlan:', error);
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async getProtocol(req: Request, res: Response) {
        try{
            const { userId } = req.params;

            const result = await protocolService.getProtocol(userId);

            if (result && 'success' in result) {
                const { success, code, message, protocol } = result;
                return res.status(code).json({ success, message, protocol });
            } else {
                console.log('Unexpected response from exercisePlanService.getExercisePlan');
                throw new Error('Unexpected response from exercisePlanService.getExercisePlan');
            }
        }
        catch(error){
            console.error('Error getting ProtocolExercisePlan:', error);
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async downloadProtocol(req: Request, res: Response) {
        try{
            const { userId } = req.params;

            const {success, code, message, pdfBuffer, userInfo} = await protocolService.downloadProtocol(userId);
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${userInfo?.userInfo.name}-Protokol-${new Date()}.pdf`);
            res.status(code).send(pdfBuffer);
        }
        catch(error){
            console.error('Error downloading ProtocolExercisePlan:', error);
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
}

export default new ProtocolController();