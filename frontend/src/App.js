import React, { Component } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import Routes from './routes';

const theme = createMuiTheme({
  spacing: 2,
  palette: {
    type: 'light',
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#3EA6FF',
    },
    background: {
      light: '#f3f3f3',
    },
  },
});

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    );
  }
}

export default App;