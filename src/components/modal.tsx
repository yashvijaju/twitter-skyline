"use client"
import * as React from 'react';
import Router, { withRouter } from 'next/router'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './modal.css';

export default function Modal({props}) {
  const {name, url, volume} = props;

  return (
    <>
        <div className='modal' />
        <div className='main'>
            <div className='content'>
              <Typography variant="h6" component="h1" gutterBottom sx={{color: 'white'}}>
                Trending: {name}<br/>
                {Math.floor(volume*1000)}%
              </Typography>
              <a target="_blank" href={url} rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                <Button variant="contained" sx={{height: '100%', backgroundColor: "#3fa4ff", fontSize: "15px"}}>Go to Twitter ↳</Button>
              </a>
            </div>
        </div>  
    </>
  );
}
