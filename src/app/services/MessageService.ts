import {MessageModel} from "../models/MessagModel";
import UserModel from "../models/UserModel";

export const createMessage = async ( message: string, sender: string, userId: string) => {
    try {
        // Create a new message
        const newMessage = new MessageModel({
            message,
            sender,
        });

        // Save the message to the database
        await newMessage.save();

        // Update the user's messages array with the message's ObjectId
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.messages.push(newMessage._id);
        await user.save();

        return newMessage;
    } catch (error) {
        throw error;
    }
};
