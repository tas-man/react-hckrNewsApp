import React from 'react';
import './index.css';

const navbar = (props) => {
  return(
        <li className="navbar-list-item">
          <button className={props.btnState} onClick={props.callApi}>{props.children}</button>
        </li>
  )
}


export default navbar;
