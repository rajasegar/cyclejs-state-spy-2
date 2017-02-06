import xs from 'xstream';
import {html} from 'snabbdom-jsx';
import { assoc, curry } from 'ramda';

export function App (sources) {

  const scanFn = curry((state, updateFn) => {
    return updateFn(state);
  });

  // SEEDS
  const seeds = {
    username: "",
    email: ""
  };


  // INTENTS
  const intents = {
    changeUsername: sources.DOM.select("#username")
      .events('input')
      .map((event) => event.target.value),

    changeEmail: sources.DOM.select("#email")
      .events('input')
      .map((event) => event.target.value)
  };

  // STATE
  const state = xs.merge(
    // Track fields
    intents.changeUsername.map((v) => assoc('username',v)),
    intents.changeEmail.map((v) => assoc('email',v))
  )
    .fold(scanFn,seeds)
    .remember();

  // SINKS
  const vtree$ = state.map((state) => {
    return (
        <div>
          <h1>Registration</h1>
          <div className='form-element'>
            <label for='username'>Username:</label>
            <br/>
            <input id="username" type="text" autocomplete="off"/>
          </div>
          <div className='form-element'>
            <label for='email'>Email:</label>
            <br/>
            <input id="email" type="email" autocomplete="off"/>
          </div>
          <hr/>
          <h2>State SPY</h2>
          <pre>{ JSON.stringify(state,null,2)}</pre>
        </div>
    );
  });

  const sinks = {
    DOM: vtree$
  };
    return sinks;
}
