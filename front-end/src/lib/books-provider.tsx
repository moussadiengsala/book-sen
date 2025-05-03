// import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { useNavigate } from 'react-router';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { login, register, getCurrentUser, logout as logoutService, updateUser } from '../lib/auth-service';
// import type { User, LoginUser, CreateUser, UpdateUser } from '../types';
// import { environment } from './environment';
//
// export function useBook() {
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();
//
//     const Mutation = useMutation({
//         mutationFn: login,
//         onSuccess: (userData) => {
//             setUser(userData);
//             queryClient.setQueryData(['auth', 'me'], userData);
//             navigate('/dashboard');
//         },
//     });
//
//     // Register mutation
//     const registerMutation = useMutation({
//         mutationFn: register,
//         onSuccess: (userData) => {
//             setUser(userData);
//             queryClient.setQueryData(['auth', 'me'], userData);
//             navigate('/dashboard');
//         },
//     });
//
//     // Update profile mutation
//     const updateProfileMutation = useMutation({
//         mutationFn: (data: UpdateUser) => {
//             if (!user) throw new Error('User not authenticated');
//             return updateUser(user.id, data);
//         },
//         onSuccess: (updatedUser) => {
//             setUser(updatedUser);
//             queryClient.setQueryData(['auth', 'me'], updatedUser);
//             localStorage.setItem('user', JSON.stringify(updatedUser));
//         },
//     });
//
//     // Login function
//     const handleLogin = async (credentials: LoginUser) => {
//         await loginMutation.mutateAsync(credentials);
//     };
//
//     // Register function
//     const handleRegister = async (data: CreateUser) => {
//         await registerMutation.mutateAsync(data);
//     };
//
//     // Update profile function
//     const handleUpdateProfile = async (data: UpdateUser) => {
//         await updateProfileMutation.mutateAsync(data);
//     };
//
//     // Logout function
//     const handleLogout = () => {
//         logoutService();
//         setUser({...environment.DEFAULT_USER, isAuthentificate: false});
//         queryClient.clear(); // Clear all queries
//         navigate('/login');
//     };
//
//     const isLoading = loginMutation.isPending || registerMutation.isPending || updateProfileMutation.isPending;
//     const isAuthenticated = !!user;
//
//     return (
//         <AuthContext.Provider
//             value={{
//         user,
//             login: handleLogin,
//             register: handleRegister,
//             updateProfile: handleUpdateProfile,
//             logout: handleLogout,
//             isLoading,
//             isAuthenticated,
//     }}
// >
//     {children}
//     </AuthContext.Provider>
// );
// }