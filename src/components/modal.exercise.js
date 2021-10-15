import React from 'react'
// 📜 https://reacttraining.com/reach-ui/dialog/
import {Dialog} from './lib'

const ModalContext = React.createContext()

const Modal = ({children}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <ModalContext.Provider value={{isOpen, setIsOpen}}>
      {children}
    </ModalContext.Provider>
  )
}

const ModalDismissButton = ({ children, ...props }) => {
  const {setIsOpen} = React.useContext(ModalContext)
  return (
    <div {...props}>
      {React.cloneElement(children, {
        onClick: () => setIsOpen(false)
      })}
    </div>
  )
}

const ModalOpenButton = ({children}) => {
  const {setIsOpen} = React.useContext(ModalContext)
  return (
    React.cloneElement(children, {
      onClick: () => setIsOpen(true)
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
