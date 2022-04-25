import React from 'react'
import classes from './Overlay.module.css'
import { IoIosClose } from 'react-icons/io'
import { FiShare2 } from 'react-icons/fi'
import { VscDebugRestart } from 'react-icons/vsc'


function Overlay(props) {
  return (
    <div className={classes.overlay}>
      <IoIosClose className={classes.close} onClick={props.onClose}/>
      <div className={classes.content}>
        {props.word === props.randomWord ? <h1>Congratulations, you guessed the right word!</h1> : <h1>Too bad, you didn't guess the right word</h1>}
        <p>The word was {props.randomWord}</p>
      </div>
      <div className={classes.buttons}>
        <button className={classes.share}>Share <FiShare2 className={classes.buttonIcon}/></button>
        <button onClick={() => props.restart()} className={classes.playAgain}>Restart <VscDebugRestart className={classes.buttonIcon}/></button>
      </div>
    </div>
  )
}

export default Overlay