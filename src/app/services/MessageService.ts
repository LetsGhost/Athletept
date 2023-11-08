import {MessageModel} from "../models/MessagModel";
import UserModel from "../models/UserModel";

class MessageService{
    async createMessage( message: string, sender: string, userId: string) {
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
                console.log('User not found');
                return {
                    success: false,
                    code: 404,
                    messageo: 'User not found'
                }
            }

            user?.messages.push(newMessage._id);
            await user?.save();

            return {
                success: true,
                code: 201,
                newMessage,
            }
        } catch (error) {
            console.log('Error creating message:', error);
            return {
                success: false,
                code: 500,
                messageo: 'Internal server error'
            }
        }
    };

    async getAllMessagesFromUser(userId: string) {
        try {
            const user = await UserModel.findById(userId).populate('messages');
            if (!user) {
                console.error('User not found');
                return {
                    success: false,
                    code: 404,
                    message: 'User not found'
                }
            }

            return {
                success: true,
                code: 200,
                messages: user.messages,
            }
        } catch (error) {
            console.error('Error getting messages:', error);
            return {
                success: false,
                code: 500,
                message: 'Internal server error'
            }
        }
    }

    async deleteMessageById(messageId: string) {

    }
}


export default new MessageService();