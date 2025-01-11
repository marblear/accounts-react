import React, { Component, Fragment } from 'react';
import { validateForm } from '../utils/';
import BaseForm from './baseForm';
import { getModel, redirect } from './commonUtils';
import { resendVerification } from './methods';

class ResendVerification extends Component {
  constructor (props) {
    super(props)
    this.state = {
      emailSent: false,
      errors: []
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
      hideSignInLink
    } = defaults

    const {
      errors,
      emailSent
    } = this.state

    const model = this.getModel()

    return (
      <Fragment>

        <BaseForm
          context={this}
          currentState={currentState}
          values={model}
          defaults={defaults}
          onSubmit={this.onSubmit}
          errors={errors}
        />

        {emailSent && <p className='email-sent'>{texts.info.emailSent}</p>}

        {!hideSignInLink && (
          <a className='signIn-link' onMouseDown={this.redirectToSignIn} href=''>
            {texts.links.toSignIn}
          </a>
        )}
      </Fragment>
    )
  }

  onSubmit = () => {
    // Validate form
    if (!validateForm(this.getModel(), this)) return
    void this.sendVerificationLink()
  }

  sendVerificationLink = async () => {
    // Send the verification link to the desired email
    try {
      await resendVerification(this.state.email)
      this.setState({ errors: [], emailSent: true })
      this.props.defaults.onSubmitHook(undefined, this.props.currentState)
    } catch (err) {
      this.setState({ errors: [{ _id: '__globals', errStr: err.reason }], emailSent: false })
      this.props.defaults.onSubmitHook(err, this.props.currentState)
    }
  }

  redirectToSignIn = () => {
    this.redirect('signIn', this.props.defaults.redirects.toSignIn)
  }
}

export default ResendVerification
