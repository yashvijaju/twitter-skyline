import * as React from 'react';
import Router, { withRouter } from 'next/router'
import './modal.css';


export default function Modal({props}) {
    const {name, url} = props;
  return (
    <>
        <div className='modal' />
        <div className='main'>
            <div className='content'>
                {name}
                {url}
            </div>
        </div>  
    </>
  );
}
