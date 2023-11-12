import { Request, Response } from 'express';
//import CheckInService from '../services/CheckInService'; // May need to be changed to CheckInService because the renamed file doesn't get recognized

class CheckInController {
    async createCheckIn(req: Request, res: Response){
        try{
            const {userId} = req.params

            //const checkIn = await CheckInService.createCheckIn(userId, req.body)

            //res.status(200).json({message: "Check-in created successfully", checkIn: checkIn})
        } catch(err){
            console.log(err)
            res.status(500).json({error: "Error creating check-in"})
        }
    }
}

export default new CheckInController();