import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import { AppRouter } from './configs/router'

Sentry.init({
  // dsn: "项目的dsn",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});


const App = () => {
  return (
    <div>
      <AppRouter />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
