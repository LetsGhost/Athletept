// src/services/userService.ts
import UserModel from '../models/UserModel.ts';

interface RegistrationData {
    email: string;
    password: string;
}

const registerUser = async (registrationData: RegistrationData) => {
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

export { registerUser };
