import * as React from 'react';
import Router, { withRouter } from 'next/router'
import Typography from '@mui/material/Typography';
import './modal.css';


export default function Modal({props}) {
    const {name, url} = props;
  return (
    <>
        <div className='modal' />
        <div className='main'>
            <div className='content'>
              <Typography variant="h6" component="h1" gutterBottom sx={{color: 'white'}}>
              Trending: {name}
            </Typography>
                {url}
            </div>
        </div>  
    </>
  );
}
