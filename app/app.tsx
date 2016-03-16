import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AppBar } from 'material-ui';

document.addEventListener("DOMContentLoaded", function(event) {
  ReactDOM.render(<AppBar title="Coeo" />, document.getElementById('container'));
});