/* globals Meteor: true */
import { Accounts } from 'meteor/accounts-base';
import ARCreateAccount from './ARCreateAccount';
import ARResendVerificationEmail from './ARResendVerificationEmail';

// Create user
export const createUser = async (newUser) => {
  await ARCreateAccount.callAsync(newUser)
}

// Login
export const login = (username, email, password, callback = () => {}) => {
  Meteor.loginWithPassword(username || email, password, err => {
    callback(err)
  })
}

// Forgot password
export const forgotPassword = (email, callback) => {
  Accounts.forgotPassword(email, callback)
}

// Change password
export const changePassword = (oldPassword, newPassword, callback) => {
  Accounts.changePassword(oldPassword, newPassword, callback)
}

// Reset password
export const resetPassword = (token, newPassword, callback) => {
  Accounts.resetPassword(token, newPassword, callback)
}

// Resend verification link
export const resendVerification = async (email) => {
  await ARResendVerificationEmail.callAsync({ email })
}
