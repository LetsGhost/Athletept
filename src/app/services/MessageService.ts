import MessageModel from "../models/MessagModel.js";
import UserModel from "../models/UserModel.js";
import logger from "../../config/winstonLogger.js";

import mongoose from "mongoose";

class MessageService{
    async createMessage( message: string, userId: string) {
        try {
            // Create a new message
            const newMessage = new MessageModel({
                message,
            });

            // Save the message to the database
            await newMessage.save();

            // Update the user's messages array with the message's ObjectId
            const user = await UserModel.findById(userId);
            if (!user) {
                return {
                    success: false,
                    code: 404,
                    messageo: 'User not found'
                }
            }

            user?.messages.push(newMessage._id as mongoose.Schema.Types.ObjectId);
            await user?.save();

            return {
                success: true,
                code: 201,
                newMessage,
            }
        } catch (error) {
            logger.error('Error creating message:', error, {service: 'MessageService.createMessage'});
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
            logger.error('Error getting all messages from user:', error, {service: 'MessageService.getAllMessagesFromUser'});
            return {
                success: false,
                code: 500,
                message: 'Internal server error'
            }
        }
    }

    async getMessageById(messageId: string) {
        try{
            const messageText = await MessageModel.findById(new mongoose.Types.ObjectId(messageId));
            
            if(!messageText){
                return {
                    success: false,
                    code: 404,
                    message: 'Message not found'
                }
            }
    
            return {
                success: true,
                code: 200,
                messageText,
            }
        } catch(error){
            logger.error('Error getting message by id:', error, {service: 'MessageService.getMessageById'});
            return {
                success: false,
                code: 500,
                message: 'Internal server error'
            }
        }
    }

    async deleteMessageById(messageId: string) {
        try{
            // Delete the message from the database
            const deletedMessage = await MessageModel.findByIdAndDelete(messageId);
            if(!deletedMessage){
                return {
                    success: false,
                    code: 404,
                    message: 'Message not found'
                }
            }

            // Delete the message from the user's messages array
            const user = await UserModel.findOne({messages: messageId});
            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: 'User not found'
                }
            }

            user.messages = user.messages.filter(message => message.toString() !== messageId);
            await user.save();

            return {
                success: true,
                code: 200,
                deletedMessage,
            }
        } catch(error){
            logger.error('Error deleting message by id:', error, {service: 'MessageService.deleteMessageById'});
            return {
                success: false,
                code: 500,
                message: 'Internal server error'
            }
        }
    }
}


export default new MessageService();