import UserModel from '../models/UserModel';

interface RegistrationData {
    email: string;
    password: string;
}

class UserService{
    async registerUser(registrationData: RegistrationData, userInfo: object) {
        const { email, password } = registrationData;

        // Check if the email is already registered
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Create a new user
        const newUser = new UserModel({
            email,
            password,
            userInfo
        });

        await newUser.save();
        return newUser;
    };

    async getUserById(userId: string) {
        const user = await UserModel.findById(userId);

        if(!user){
            throw new Error("User not found!")
        }

        return user;
    }

    async deleteUserById(userId: string) {
        const user = await UserModel.findByIdAndRemove(userId);

        if(!user){
            throw new Error("User not found!")
        }

        return user;
    }
}

export default new UserService();