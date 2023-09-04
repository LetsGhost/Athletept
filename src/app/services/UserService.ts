import UserModel from '../models/UserModel';

interface RegistrationData {
    email: string;
    password: string;
}

export const registerUser = async (registrationData: RegistrationData) => {
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
    });

    await newUser.save();
    return newUser;
};

export const getUserById = async (userId: string) => {
    const user = await UserModel.findById(userId);

    if(!user){
        throw new Error("User not found!")
    }

    return user;
}
