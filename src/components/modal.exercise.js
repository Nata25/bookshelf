import React from 'react'
// 📜 https://reacttraining.com/reach-ui/dialog/
import {Dialog} from './lib'

function callAll (...fns) {
  return function (args) {
    fns.forEach(fn => {
      if (fn && typeof fn === 'function') {
        fn(args)
      }
    })
  }
}

const ModalContext = React.createContext()

const Modal = ({children}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <ModalContext.Provider value={{isOpen, setIsOpen}}>
      {children}
    </ModalContext.Provider>
  )
}

const ModalDismissButton = ({ children: child, ...props }) => {
  const {setIsOpen} = React.useContext(ModalContext)
  return (
    <div {...props}>
      {React.cloneElement(child, {
        onClick: callAll(child.props.onClick, () => setIsOpen(false))
      })}
    </div>
  )
}

const ModalOpenButton = ({children: child, ...props}) => {
  const {setIsOpen} = React.useContext(ModalContext)
  return (
    React.cloneElement(child, {
      onClick: callAll(child.props.onClick, () => setIsOpen(true)),
      ...props
    })
  )
}

const ModalContents = (props) => {
  const {isOpen, setIsOpen} = React.useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props}/>
  )
}

export {
  Modal,
  ModalContents,
  ModalOpenButton,
  ModalDismissButton
}
