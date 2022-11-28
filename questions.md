# Deel interview answers

## 1- What is the difference between Component and PureComponent? Give an example where it might break my app

PureComponent is exactly the same as Component except that it handles the `shouldComponentUpdate` method for you.

When props or state changes, PureComponent will do a shallow comparison on both props and state. Component on the other hand won’t compare current props and state to next out of the box. Thus, the component will re-render by default whenever `shouldComponentUpdate` is called.

Shallow Comparison
When comparing previous props and state to next, a shallow comparison will check that primitives have the same value (eg, 1 equals 1 or that true equals true) and that the references are the same between more complex javascript values like objects and arrays.

## 2- Context + shouldComponentUpdate might be dangerous. Can think of why is that?

Context is used to communicate with deeply contained components. For example, a root component defines a theme, and any component in the component tree might (or might not) be interested in this information. Like in the official context example.

shouldComponentUpdate (SCU) on the other hand short circuits the re-rendering of a part of the component tree (including children), for example if the props or state of a component are not modified in a meaningful way. As far as the component can tell. But this might accidentally block context propagation…

The context is used to prevent passing props all the way through the children components. This means that any children
can make use of the context to use some data provided by the context.
On the other hand, `shouldComponentUpdate` would not be aware if the context changes, because it receives only the
next prop and next state, which in this case might not change. So, if for example we have a PureComponent which
uses the context, and the context changes, the component won't be updated.

https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076

## 3- Describe 3 ways to pass information from a component to its parent

- Using a callback prop, which can be handled by the parent when it changes. For example:

```javascript
// child component
const SomeComponent = ({ text, onChange }) => {
  handleChange = (event) => {
    onChange(event.target.value)
  }

  return (
    <input type='text' value={ text } onChange={ handleChange } />
  )
}
```

```javascript
// parent component
const ParentComponent = () => {
  const handleSomeComponentChange = (value) => {
    // do something with value
  }

  return (
    <div className='container'>
      <SomeComponent text='test' onChange={ handleSomeComponentChange } />
    </div>
  )
}
```

- Updating the context from a child component. Let's assume we have created a custom customer provider
to manage the context.

```javascript
import { CustomerProvider } from '../context'

const MyApp = () => {
  return (
    <CustomerProvider>
      <MainComponent />
    </CustomerProvider>
  )
}
```

```javascript
import { useContext } from 'react'
import { customerContext } from '../context'

const SomeChild = () => {
  const customer = useContext(customerContext)
  const handleEmailChange = (event) => {
    customer.setEmail(event.target.value)
  }

  return (
    <form onSubmit={ handleEmailChange }>
      {/* the email form goes here */}
    </form>
  )
}
```

- Using some external state manager, such as Redux, where we can dispatch an action which can update some
parent information.

## 4 - Give 2 ways to prevent components from re-rendering

- Replace useState() with useRef()
useState() Hook is widely used in React applications to re-render the components on state changes. However, there are scenarios where we need to track state changes without re-rendering the components.

- Memoization using useMemo() and UseCallback() Hooks
Memoization enables your code to re-render components only if there’s a change in the props. With this technique, developers can avoid unnecessary renderings and reduce the computational load in applications.

https://blog.bitsrc.io/5-ways-to-avoid-react-component-re-renderings-90241e775b8c

## 5 - What is a fragment and why do we need it? Give an example where it might break my app.

A fragment is a component in where you can include some children within it, but it won't create a DOM node.
We could need it, for example if we have to list some content right next to an existing node.
For example, this code:

```javascript
import React from 'react'

const ItemList = ({ items }) => {
  // The JSX returned here needs to be one node, which includes other nodes.
  // It cannot return all de siblings without them to be wrapped
  return (
    <React.Fragment>
      {
        items.map(item => (
          <div>{ item }</div>
        ))
      }
    </React.Fragment>
  )
}
```

```javascript
import { React } from 'react'

const items = [ 'item1', 'item2', 'item3' ]

const MyComponent = () => {
  return (
    <div>First content</div>
    <ItemList items={ items } />
  )
}
```

It will render to this:

```html
<div>First content</div>
<div>Item1</div>
<div>Item2</div>
<div>Item3</div>
```

We should use it only when necessary. It will break if any props other than `key` is passed to it.

## 6 - Give 3 examples of the HOC pattern

- Redux connect HOC:

We can wrap our component within Redux connect HOC, passing the state and dispatch as props to it:

```javascript
import { connect } from 'react-redux'
import { actions } from '../actions/some-feature'
import SomeFeature from './SomeFeature'

const mapStateToProps = (state) => {
  return {
    items: state.someFeature.list,
    loading: state.someFeature.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getItems() {
      dispatch(actions.getItems)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SomeFeature)
```

- React Router HOC:

We can have access to router props using `withRouter` HOC:

```javascript
import { withRouter } from 'react-router-dom'
import SomeFeature from './SomeFeature'

export default withRouter(SomeFeature)
```

This way `SomeFeature` will receive some useful props, such as `history`, `match` or `location`.

- A custom HOC

Here is an example of a very simple HOC, that just tracks that the wrapped component is being rendered,
using some external logger library.

```javascript
// The logger HOC
import React from 'react'
import logger from 'some-logger-library'

export const withLogger = (WrappedComponent, name) => ({ ...props }) => {
  logger.log('Rendering component', name)

  return (
    <WrappedComponent { ...props } />
  )
}
```

Then some component which we want to track:

```javascript
import React from 'react'

import { withLogger } from './logger'

const SomeComponent = ({text}) => {
  return (
    <div>
      This is some component with - { text }
    </div>
  )
}

export default withLogger(SomeComponent, 'some component')
```

Then we directly use the component from the parent:

```javascript
import React from 'react'
import SomeComponent from './SomeComponent'

function App() {
  return (
    <div className="App">
      <SomeComponent text='Some text' />
    </div>
  );
}
```

## 7 - What is the difference in handling exceptions in promises, callbacks and async...await?

### Callbacks

In this case we pass a callback function to the called function, so the callback will handle what
should happen at some point. The callback usually receives (from the called function) two args.
One is the result itself, and the other is the error, in case something went wrong.
For example:

```javascript
getItems(options, (error, result) => {
  if (error) {
    // handle the error in some way
  } else {
    // do something with result
  }
})
```

### Promises

Here the function returns a promise, and the way to handle errors is:

```javascript
getItems(options)
  .then(result => {
    // do something with result
  })
  .catch(error => {
    // handle the error in some way
  })
```

### async/await

This is another way of handling promises, in a more straight-forward way:

```javascript
try {
  const result = await getItems(options)
  // do something with result
} catch (error) {
  // handle the error in some way
}
```

## 8 - How many arguments does setState take and why is async

The `setState` method is used to set a state in a class component and receives 2 arguments:
- The new state value
- A callback, that will be executed when the state actually changes

It is an async method for performance reasons, so React updates all the states in the next render

## 9 - List the steps needed to migrate a class to function component

- Change the class to a function
- convert to functions the class methods
- Get rid of `this` references
- replace constructor state by `useState`
- All lifecycle methods, should be replaced by `useEffect` hooks.
- The `render()` method should be returned by the functional `return`.

## 10 - List a few ways styles can be used with components

### Inline styles

You can give a component inline styles through `styles` prop:

```javascript
class StudentList extends Component{
  render(){
    const {name, classNo, roll, addr} = this.props
    const ulStyle = {border: '2px solid green', width:'40%', listStyleType:'none'}
    const liStyle = {color : 'blue', fontSize:'23px'}
    return(
      <ul style={ulStyle}>
        <li style={liStyle}>Name : {name}</li>
        <li style={liStyle}>Class: {classNo}</li>
        <li style={liStyle}>Roll: {roll}</li>
        <li style={liStyle}>Address : {addr}</li>
      </ul>
    )
  }
}
```

### Normal CSS

You can get an object with the styles from an actual CSS file, using modules.
For example, given the CSS:

```css
.StudentList{
    border: 2px solid green;
    width: 40%:
    list-style-type: none;
    }

.StudentList-details{
    color: blue;
    font-size: 23px;
    }
```

We can import and use it as follows:

```javascript
import styles from './styles.module.css'

...

class StudentList extends Component{
  render(){
    const {name, classNo, roll, addr} = this.props
    return(
      <ul className='StudentList'>
        <li className='StudentList-details'>Name : {name}</li>
        <li className='StudentList-details'>Class: {classNo}</li>
        <li className='StudentList-details'>Roll: {roll}</li>
        <li className='StudentList-details'>Address : {addr}</li>
      </ul>
    )
  }
}
```

### CSS module
 A CSS module is a simple CSS file but a key difference is by default when it is imported every class name and animation inside the CSS module is scoped locally to the component that is importing it also CSS file name should follow the format ‘filename.module.css’. This allows us to use a valid name for CSS classes without worrying about conflicts with other class names in your application.

is the way that we used on this project

```css
.list{
    border: 2px solid green;
    width: 40%:
    list-style-type: none;
    }

.details{
    color: blue;
    font-size: 23px;
    }
```

```javascript
import React, { Component } from 'react'
import style from './StudentList.module.css'

const StudentList = (props) => {
  const {name, classNo, roll, addr} = props
  return(
    <ul className={style.list}>
      <li className={style.details}>Name : {name}</li>
      <li className={style.details}>Class: {classNo}</li>
      <li className={style.details}>Roll: {roll}</li>
      <li className={style.details}>Address : {addr}</li>
    </ul>
  )
}

export default StudentList
```

# 11 - How to render an HTML string coming from the server

React automatically escapes the HTML tags, for security reasons. So, if I receive
an HTML string from the server and try to display it directly:

```javascript
<div className='container'>
  { htmlResponseString }
</div>
```

the browser will print the HTML exactly as is, so no changes in the DOM will be reflected.

In order to be able to actually render the HTML received, we should use `dangerouslySetInnerHTML`
prop. For example:

```javascript
<div
  className='container'
  dangerouslySetInnerHTML={{ __html: htmlResponseString }}
/>
```
