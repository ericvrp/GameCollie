import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export default class MainLayout extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="main">
          {this.props.content}
        </div>
      </MuiThemeProvider>
    );
  }
}
