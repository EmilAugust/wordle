import React from 'react'
import classes from './Backdrop.module.css'

function Backdrop(props) {
  return (
    <div className={classes.backdrop} onClick={props.onClose}></div>
  )
}

export default Backdrop