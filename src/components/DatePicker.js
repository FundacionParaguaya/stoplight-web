import React from 'react'
import moment from 'moment'

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props)
    const { dayLabel, monthLabel, yearLabel, defaultDate } = props

    this.state = {
      day: null,
      month: null,
      year: null,
      selectDay: defaultDate
        ? moment(defaultDate).date()
        : props.mode === 'TH'
        ? 'วันที่'
        : dayLabel,
      selectMonth: defaultDate
        ? moment(defaultDate).month() + 1
        : props.mode === 'TH'
        ? 'เดือน'
        : monthLabel,
      selectYear: defaultDate
        ? moment(defaultDate).year()
        : props.mode === 'TH'
        ? 'ปี'
        : yearLabel
    }
  }

  shouldComponentUpdate(_nextProps, nextState) {
    return (
      this.state.selectMonth !== nextState.selectMonth ||
      (this.state.selectDay !== nextState.selectDay) |
        (this.state.selectYear !== nextState.selectYear)
    )
  }

  componentWillMount() {
    let day = [],
      month = [],
      year = []

    const pad = n => {
      return n < 10 ? '0' + n : n
    }

    for (let i = 1; i <= 31; i++) {
      day.push(this.props.padDay ? pad(i) : i)
    }

    let monthIndex = 1
    for (const monthName of moment.localeData().months()) {
      month.push({
        text: this.props.useMonthNames
          ? monthName
          : this.props.padMonth
          ? pad(monthIndex)
          : monthIndex,
        value: monthIndex
      })
      monthIndex++
    }

    for (let i = this.props.maxYear; i >= this.props.minYear; i--) {
      year.push(i)
    }

    this.setState({
      day: day,
      month: month,
      year: year
    })
  }

  changeDate(e, type) {
    this.setState({
      [type]: e.target.value
    })
    this.checkDate(e.target.value, type)
  }

  getDate(date) {
    if (moment(date).isValid()) {
      return moment(date).format()
    } else {
      return undefined
    }
  }

  checkDate(value, type) {
    let { selectDay, selectMonth, selectYear } = this.state

    if (type === 'selectDay') {
      selectDay = value
    } else if (type === 'selectMonth') {
      selectMonth = value
    } else if (type === 'selectYear') {
      selectYear = value
    }

    if (this.isSelectedAllDropdowns(selectDay, selectMonth, selectYear)) {
      const dateObject = {
        year: selectYear,
        month: selectMonth - 1,
        day: selectDay
      }
      this.props.dateChange(this.getDate(dateObject))
    } else {
      this.props.dateChange(undefined)
    }
  }

  isSelectedAllDropdowns(selectDay, selectMonth, selectYear) {
    if (selectDay === '' || selectMonth === '' || selectYear === '') {
      return false
    }
    return this.props.mode === 'TH'
      ? selectDay !== 'วันที่' && selectMonth !== 'เดือน' && selectYear !== 'ปี'
      : selectDay !== this.props.dayLabel &&
          selectMonth !== this.props.monthLabel &&
          selectYear !== this.props.yearLabel
  }

  render() {
    const dayElement = this.state.day.map((day, id) => {
      return (
        <option value={day} key={id}>
          {day}
        </option>
      )
    })
    const monthElement = this.state.month.map((month, id) => {
      return (
        <option value={month.value} key={id}>
          {moment()
            .month(month.value - 1)
            .format('MMMM')}
        </option>
      )
    })
    const yearElement = this.state.year.map((year, id) => {
      return (
        <option value={year} key={id}>
          {year}
        </option>
      )
    })

    return (
      <div>
        <select
          defaultValue=""
          className={this.props.className}
          value={this.state.selectMonth}
          onChange={e => this.changeDate(e, 'selectMonth')}
        >
          <option value="">{this.props.monthLabel}</option>
          {monthElement}
        </select>
        <select
          defaultValue=""
          className={this.props.className}
          value={this.state.selectDay}
          onChange={e => this.changeDate(e, 'selectDay')}
        >
          <option value="">
            {this.props.mode === 'TH' ? 'วันที่' : this.props.dayLabel}
          </option>
          {dayElement}
        </select>
        <select
          defaultValue=""
          className={this.props.className}
          value={this.state.selectYear}
          onChange={e => this.changeDate(e, 'selectYear')}
        >
          <option value="">
            {this.props.mode === 'TH' ? 'ปี' : this.props.yearLabel}
          </option>
          {yearElement}
        </select>
      </div>
    )
  }
}
