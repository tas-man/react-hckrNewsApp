import React from 'react';
import './index.css';

const contentItem = (props) => {
  return(
    <li className="content-list-item">
      <a className="content-link" href={props.url}>
      {props.children}
      <div className="content-block">

          <div className="content-url">
            <span>{props.url}</span>
          </div>
          <div className="content-info">
            <div className="content-comments">
              <span> {props.kids} </span>
            </div>
            <div className="content-points">
              <span> {props.score} </span>
            </div>
          </div>

      </div>
      </a>
    </li>
  )
}

export default contentItem;
