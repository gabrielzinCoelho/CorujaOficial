import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import api from '../../services/api'

export default class Authentication extends Component {
  static propTypes = {
    redirectWhenLogged: PropTypes.bool.isRequired,
    redirectUrl: PropTypes.string.isRequired
  }

  state = {
    logged: null
  }

  async componentDidMount() {
    try {
      const token = sessionStorage.getItem('token');

      if (!token)
        throw null

      const data = await api.get('/authentication', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (data.status != 200)
        throw null

      this.setState({
        logged: true
      })
    } catch (error) {
      this.setState({
        logged: false
      })
    }
  }

  shouldComponentUpdate() {
    return (this.state.logged != null) ? false : true
  }

  render() {
    return (
      <>
        {
          (() => {
            return (this.state.logged == this.props.redirectWhenLogged) ?
              (<Redirect push to={this.props.redirectUrl} />)
              :
              (null)
          })()
        }
      </>
    )
  }
}