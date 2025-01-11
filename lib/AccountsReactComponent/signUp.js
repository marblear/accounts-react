import { Accounts } from 'meteor/accounts-base';
import React, { Component, Fragment } from 'react';
import AccountsReact from '../AccountsReact';
import { validateForm } from '../utils';
import BaseForm from './baseForm';
import { getModel, redirect } from './commonUtils';
import { createUser, login } from './methods';
import SocialButtons from './socialButtons';

class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: [],
      signUpSuccessful: false
    }

    this.getModel = getModel.bind(this)
    this.redirect = redirect.bind(this)
  }

  render () {
    const {
      currentState,
      defaults
    } = this.props

    const {
      texts,
      hideSignInLink,
      showReCaptcha,
      sendVerificationEmail,
      forbidClientAccountCreation
    } = defaults

    const {
      signUpSuccessful
    } = this.state

    return (
      <Fragment>
        <BaseForm
          context={this}
          currentState={currentState}
          values={this.getModel()}
          defaults={defaults}
          onSubmit={this.onSubmit}
          errors={this.state.errors}
          showReCaptcha={showReCaptcha}
        />

        {!forbidClientAccountCreation && (
          <SocialButtons
            defaults={defaults}
          />
        )}

        {signUpSuccessful && sendVerificationEmail && <p>{texts.info.signUpVerifyEmail}</p>}

        {!hideSignInLink && (
          <a className='signIn-link' onMouseDown={this.redirectToSignIn} style={linkStyle} href=''>
            {texts.links.toSignIn}
          </a>
        )}
      </Fragment>
    )
  }

  onSubmit = async () => {
    const model = this.getModel()
    // Validate form
    if (!validateForm(model, this)) { return }

    const {
      username,
      email,
      password,
      confirmPassword, // dont delete so it doesn't get included in profile object.
      ...profile
    } = this.getModel()

    // The user object to insert
    const newUser = {
      username,
      email,
      password: password ? Accounts._hashPassword(password) : '',
      ...profile
    }

    const {
      showReCaptcha,
      preSignupHook,
      onSubmitHook,
      loginAfterSignup
    } = this.props.defaults

    // Add recaptcha field
    if (showReCaptcha) {
      newUser.tempReCaptchaResponse = AccountsReact.config.tempReCaptchaResponse
    }

    preSignupHook(password, newUser)

    try {
      await createUser(newUser);
      this.setState({ signUpSuccessful: true })
      if (loginAfterSignup) {
        const { password } = this.getModel()
        const { username, email } = newUser
        login(username, email, password, () => {})
      }
      onSubmitHook(undefined, this.props.currentState)
    } catch(err) {
      // validation errors suppose to be inside an array, if string then its a different error
      if (typeof err.reason !== 'string') {
        this.setState({ errors: err.reason })
      } else {
        this.setState({ errors: [{ _id: '__globals', errStr: err.reason }] })
      }
      onSubmitHook(err, this.props.currentState)
    }
  }

  redirectToSignIn = () => {
    this.redirect('signIn', this.props.defaults.redirects.toSignIn)
  }
}

const linkStyle = {
  display: 'block'
}

export default SignUp
