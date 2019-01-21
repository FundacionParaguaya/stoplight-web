import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withI18n } from 'react-i18next'
import Modal from 'react-modal'

import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'
import PrioritiesAchievementsForm from './PrioritiesAchievementsForm'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

Modal.setAppElement('#root')
class IndicatorList extends Component {
  constructor(props) {
    super(props)

    let draft = this.props.drafts.filter(
      draft => draft.draftId === this.props.draftId
    )[0]

    let numberOfRedYellowIndicators = draft.indicatorSurveyDataList.filter(
      indicator => indicator.value === 1 || indicator.value === 2
    ).length

    this.state = {
      draft: draft,
      modalIsOpen: false,
      modal: {
        formType: null,
        indicator: null,
        questionText: null
      },
      numberOfPrioritiesRequired: this.props.minimumPriorities < numberOfRedYellowIndicators ? this.props.minimumPriorities : numberOfRedYellowIndicators,
      numberPrioritiesMade: 0,
      listOfPrioritiesMade: []
    }
  }

  openModal = indicator => {
    if (indicator.formType) {
      // only open modal if formType is not null (i.e. not blank indicator)
      this.setState({
        modalIsOpen: true,
        modal: { formType: indicator.formType, indicator: indicator.codeName, questionText: indicator.questionText }
      })
    }
  }

  addPriority = () => {
    // only if indicator was not answered yet
    console.log(this.state.listOfPrioritiesMade)
    if (
      this.state.listOfPrioritiesMade.filter(
        priority => priority === this.state.modal.indicator
      ).length === 0
    ) {
      this.setState(prevState => ({
        numberPrioritiesMade: prevState.numberPrioritiesMade + 1,
        listOfPrioritiesMade: [
          ...prevState.listOfPrioritiesMade,
          prevState.modal.indicator
        ]
      }))
    }
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      modal: { formType: null, indicator: null , questionText: null}
    })
  }

  // get this.props.surveys passed in

  // get dimensions from survey

  render() {
    const { t } = this.props
    let answeredEnoughPriorities =
      this.state.numberPrioritiesMade < this.state.numberOfPrioritiesRequired

    let dimensionList = [
      ...new Set(this.props.data.map(stoplight => stoplight.dimension))
    ]
    let groupedIndicatorList = dimensionList
      .map(dimension => {
        return {
          dimension: dimension,
          indicators: this.props.data.filter(
            stoplight => stoplight.dimension === dimension
          )
        }
      })
      .map(indicatorGroup => {
        return {
          dimension: indicatorGroup.dimension,
          indicators: indicatorGroup.indicators.map(indicator => {
            indicator.answer = this.state.draft.indicatorSurveyDataList.filter(
              indicatorAnswer => indicatorAnswer.key === indicator.codeName
            )[0].value
            switch (indicator.answer) {
              case 1:
                indicator.dotClass = 'dot red'
                indicator.formType = 'priority'
                break
              case 2:
                indicator.dotClass = 'dot gold'
                indicator.formType = 'priority'
                break
              case 3:
                indicator.dotClass = 'dot green'
                indicator.formType = 'achievement'
                break
              default:
                indicator.dotClass = 'dot grey'
                indicator.formType = null
            }
            return indicator
          })
        }
      })

    return (
      <div>
        <h2> {t('views.yourLifeMap')} </h2>
        <hr />
        {groupedIndicatorList.map(indicatorGroup => {
          return (
            <div key={indicatorGroup.dimension}>
              <h4>{indicatorGroup.dimension}</h4>
              <ul style={{ listStyle: 'none' }} className="list-group">
                {indicatorGroup.indicators.map(indicator => {
                  return (
                    <li
                      style={{
                        justifyContent: 'space-between',
                        display: 'flex',
                        cursor: 'pointer'
                      }}
                      key={indicator.codeName}
                      className="list-group-item"
                      onClick={() => this.openModal(indicator)}
                    >
                      <span
                        style={{ position: 'absolute', left: '1%' }}
                        className={indicator.dotClass}
                      />
                      <span style={{ paddingLeft: '5%' }}>
                        {indicator.questionText}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <br />
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                style={customStyles}
                className="col-6"
                contentLabel=""
              >
                <PrioritiesAchievementsForm
                  formType={this.state.modal.formType}
                  indicator={this.state.modal.indicator}
                  questionText={this.state.modal.questionText}
                  modalTitle={t(`views.lifemap.${this.state.modal.formType}`)}
                  draftId={this.props.draftId}
                  closeModal={this.closeModal}
                  addPriority={this.addPriority}
                />
              </Modal>
            </div>
          )
        })}
        {answeredEnoughPriorities ? (
          <div>
            {this.state.numberOfPrioritiesRequired - this.state.numberPrioritiesMade >
            1 ? (
              <h5>
                {t('views.lifemap.youNeedToAddPriorities').replace(
                  '%n',
                  this.state.numberOfPrioritiesRequired - this.state.numberPrioritiesMade
                )}
              </h5>
            ) : (
              <h5>{t('views.lifemap.youNeedToAddPriotity')}</h5>
            )}
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={() => this.props.nextStep()}
              disabled
            >
              {t('general.continue')}
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={() => this.props.nextStep()}
          >
            {t('general.continue')}
          </button>
        )}
      </div>
    )
  }
}

const mapDispatchToProps = {
  addSurveyData,
  addSurveyDataWhole
}

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
})

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(IndicatorList)
)
