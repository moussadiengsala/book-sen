import apiClient from '../lib/api-client';
import type {ApiResponse, AuthenticationResponse, CreateUser, LoginUser, UpdateUser, User} from '../types';
import { jwtDecode } from 'jwt-decode';
import {environment} from "../lib/environment";

export const register = async (userData: CreateUser): Promise<User> => {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    if (userData.avatar) {
        formData.append('avatar', userData.avatar);
    }

    const response = await apiClient.post<ApiResponse<AuthenticationResponse>>('user/auth/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    const token = response.data.data.accessToken;
    localStorage.setItem(environment.SESSION_STORAGE, token);
    return decodeUserFromToken(token);
};

export const login = async (credentials: LoginUser): Promise<User> => {
    const response = await apiClient.post<ApiResponse<AuthenticationResponse>>('user/auth/login', credentials);
    const token = response.data.data.accessToken;
    localStorage.setItem(environment.SESSION_STORAGE, token);
    return decodeUserFromToken(token);
};

export const getCurrentUser = (): User | null => {
    const token = localStorage.getItem(environment.SESSION_STORAGE);
    if (!token) return null;
    return decodeUserFromToken(token);
};

export const updateUser = async (userId: string, userData: UpdateUser): Promise<User> => {
    // Validate at least one field is being updated
    if (!userData.avatar && !userData.current_password && !userData.new_password && !userData.name) {
        throw new Error('At least one field must be provided for update');
    }

    const formData = new FormData();
    if (userData.name) formData.append('name', userData.name);
    if (userData.current_password) formData.append('current_password', userData.current_password);
    if (userData.new_password) formData.append('new_password', userData.new_password);
    if (userData.avatar) formData.append('avatar', userData.avatar);

    const response = await apiClient.put<ApiResponse<User>>(`/user/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
};

export const logout = (): void => {
    localStorage.removeItem(environment.SESSION_STORAGE);
};

function decodeUserFromToken(token: string): User {
    try {
        const decoded: any = jwtDecode(token);
        return decoded.user;
    } catch (error) {
        console.error('Error decoding token:', error);
        throw new Error('Invalid token');
    }
}
