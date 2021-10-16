/** @jsx jsx */
import {jsx} from '@emotion/core'
import React from 'react'
// 📜 https://reacttraining.com/reach-ui/dialog/
import {Dialog, CircleButton,} from './lib'
import VisuallyHidden from '@reach/visually-hidden'

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

const ModalContentsBase = (props) => {
  const {isOpen, setIsOpen} = React.useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props}/>
  )
}

const ModalContents = ({title, children, ...props}) => {
  return (
    <ModalContentsBase {...props}>
      <ModalDismissButton css={{display: 'flex', justifyContent: 'flex-end'}}>
        <CircleButton>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </CircleButton>
      </ModalDismissButton>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

export {
  Modal,
  ModalContentsBase,
  ModalContents,
  ModalOpenButton,
  ModalDismissButton
}
