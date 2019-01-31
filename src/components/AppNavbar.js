import React, { Component } from 'react'

import { X, ArrowLeft } from 'react-feather'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'

import { withI18n } from 'react-i18next'
class AppNavbar extends Component {
  constructor(props, context) {
    super(props, context)

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      show: false
    }
  }

  handleClose() {
    this.setState({ show: false })
  }

  handleShow() {
    this.setState({ show: true })
  }

  handleExit() {
    window.location.href = 'https://testing.povertystoplight.org'
  }

  render() {
    const { t } = this.props
    return (
      <div className="app-navbar">
        <h1>
          {this.props.showBack === true ? (
            <button
              className="btn btn-link app-navbar-back"
              onClick={this.props.backHandler}
            >
              <ArrowLeft />
            </button>
          ) : (
            ''
          )}
          {this.props.text}
          <button
            className="btn btn-link app-navbar-close"
            onClick={this.handleShow}
          >
            <X />
          </button>

          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title> Exit Survey </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {t('modals.yourLifemapIsNotComplete')}
              <br />
              <strong>This data will be lost.</strong> <br />
              <br />
              {t('modals.areYouSureYouWantToExit')}
            </Modal.Body>
            <Modal.Footer>
              <button class="btn btn-secondary" onClick={this.handleClose}>
                No
              </button>
              <button class="btn btn-danger" onClick={this.handleExit}>
                Yes
              </button>
            </Modal.Footer>
          </Modal>
        </h1>
      </div>
    )
  }
}

export default withI18n()(connect()(AppNavbar))
