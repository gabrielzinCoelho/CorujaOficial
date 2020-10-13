import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';

export default class AlertNotify extends Component {

    static propTypes = {

        alertSeverity: function (props, propName, componentName) {
                            if (!/error|info|success|warning/.test(props[propName])) {
                                return new Error(
                                    'Invalid prop `' + propName + '` supplied to' +
                                    ' `' + componentName + '`. Validation failed.'
                                );
                            }
        },
        alertTitle: PropTypes.string,
        alertMessage: PropTypes.string,
        open: PropTypes.bool

    }
  
    render() {

        return (
            <>
                <Snackbar
                    open={this.props.open}
                    autoHideDuration={5000}
                    onClose={this.props.handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={this.props.handleClose} variant="filled" severity={this.props.alertSeverity}>
                        <AlertTitle>{this.props.alertTitle}</AlertTitle>
                        {this.props.alertMessage}
                    </Alert>
                </Snackbar>
            </>
        )
    }


}
