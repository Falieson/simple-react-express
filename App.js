import React from 'react'

function App(props) {  
  const {children}=props

  if(!children){
    return (
      <h1>Foo Bar, world!</h1>
    )
  }

  return (
    <div>
      {children}
    </div>
  )
}

export default App