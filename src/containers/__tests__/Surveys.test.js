import React from 'react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'

import { shallow, mount, render } from 'enzyme'
import { expect } from 'chai'
import Surveys from './../Surveys'


const initialState = {
  surveys: [{
    id: 0,
    minimumPriorities: 1,
    privacyPolicy: {title:"privacyPolicyTitle", text:"privacyPolicy"},
    surveyConfig: {},
    surveyEconomicQuestions: [],
    surveyStoplightQuestions:[],
    termsConditions: {title:"termsConditionsTitle", text:"termsConditions"}
  }]
};

// it('renders without crashing', () => {
//   shallow(<Surveys />)
// })


describe('Surveys Component', () => {
  let props
  let mountedSurveys

  const surveys = () =>{
    const mockStore = configureMockStore()
    const store = mockStore(initialState)
    console.log("Running surveys function")
    console.log(store)
    if(!mountedSurveys){
      mountedSurveys = mount(
      <Provider store={store}>
      <StaticRouter>
        <Surveys {...props} />
        </StaticRouter>
      </Provider>
  )
    }
    return mountedSurveys
  }

  beforeEach(()=>{
    props = {
      surveys: [{
        id: 0,
        minimumPriorities: 1,
        privacyPolicy: {title:"privacyPolicyTitle", text:"privacyPolicy"},
        surveyConfig: {},
        surveyEconomicQuestions: [],
        surveyStoplightQuestions:[],
        termsConditions: {title:"termsConditionsTitle", text:"termsConditions"}
      }]
    }
    mountedSurveys = undefined
  })

  it("always renders a div", () => {
    console.log(surveys().debug())
    const divs = surveys().find('div');
    console.log(divs.length)
    expect(divs.length).to.be.above(0);
  });

  // it("always renders a survey card", () => {
  //   console.log(surveys())
  //   const cards = surveys().find('div.card');
  //   console.log(surveys().debug())
  //   expect(cards.length).to.be.equal(0);
  // });

})
