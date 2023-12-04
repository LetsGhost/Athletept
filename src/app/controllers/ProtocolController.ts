import {Request, Response} from "express";
import protocolService from "../services/ProtocolService.js";
import logger from "../../config/winstonLogger.js";

class ProtocolController{
    async createProtocol(req: Request, res: Response) {
        try {
            const { userId, protocol, comment } = req.body;

            const result = await protocolService.createProtocol(userId, protocol, comment);

            if (result && 'success' in result) {
                const { success, code, message, newProtocol } = result;

                if(success){
                    logger.info('Protocol created', {service: 'ProtocolController.createProtocol'});
                }

                return res.status(code).json({ success, message, newProtocol });
            } else {
                console.log('Unexpected response from protocolService.createProtocol');
                throw new Error('Unexpected response from protocolService.createProtocol');
            }
        } catch (error) {
            logger.error('Error creating protocol:', error, {service: 'ProtocolController.createProtocol'});
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
                logger.error('Unexpected response', {service: 'ProtocolController.getProtocol'});
                return res.status(500).json({ success: false, message: "Internal Server error" });
            }
        }
        catch(error){
            logger.error('Error getting protocol:', error, {service: 'ProtocolController.getProtocol'});
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async createBlankProtocol(req: Request, res: Response) {
        try{
            const { userId } = req.params;
            const { day, type} = req.body;

            const result = await protocolService.createBlankProtocol(userId, day, type);

            if (result && 'success' in result) {
                const { success, code, message, newProtocol } = result;

                if(success){
                    logger.info('Blank protocol created', {service: 'ProtocolController.createBlankProtocol'});
                }

                return res.status(code).json({ success, message, newProtocol });
            } else {
                console.log('Unexpected response from protocolService.createBlankProtocol');
                throw new Error('Unexpected response from protocolService.createBlankProtocol');
            }
        }
        catch(error){
            logger.error('Error creating blank protocol:', error, {service: 'ProtocolController.createBlankProtocol'});
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async downloadProtocol(req: Request, res: Response) {
        try{
            const { userId } = req.params;

            const {success, code, message, pdfBuffer, userInfo} = await protocolService.downloadProtocol(userId);

            if(success){
                logger.info('Protocol downloaded', {service: 'ProtocolController.downloadProtocol'});
            }
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${userInfo?.userInfo.name}-Protokol-${new Date()}.pdf`);
            res.status(code).send(pdfBuffer);
        }
        catch(error){
            logger.error('Error downloading protocol:', error, {service: 'ProtocolController.downloadProtocol'});
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
}

export default new ProtocolController();