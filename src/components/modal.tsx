"use client"
import * as React from 'react';
import Router, { withRouter } from 'next/router'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './modal.css';

export default function Modal({props}) {
  const {name, url, volume} = props;

  const newhtml = '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">PRIZES, PRIZES, PRIZES!<br><br>HackSC provides a way to express innovation, impact, team-building, also…prizes! Each vertical has an assortment of prizes pertaining to the theme. From drones to Keurigs, snag yourself a winning title; and a fun prize. 🏆 <br><br>Apply to HackSC 2023 by 1/29! <a href="https://t.co/wgX5r1oLZG">pic.twitter.com/wgX5r1oLZG</a></p>&mdash; HackSC 🌺 (@hackscofficial) <a href="https://twitter.com/hackscofficial/status/1619166892182179841?ref_src=twsrc%5Etfw">January 28, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'

  return (
    <>
        <div className='modal' />
        <div className='main'>
            <div className='content'>
              <Typography variant="h6" component="h1" gutterBottom sx={{color: 'white'}}>
                Trending: {name}<br/>
                Volume: {Math.floor(volume*1000)}%
              </Typography>
              <div dangerouslySetInnerHTML={{__html: newhtml}} />
              <a target="_blank" href={url} rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                <Button variant="contained" sx={{height: '100%', backgroundColor: "#3fa4ff", fontSize: "15px"}}>Go to Twitter ↳</Button>
              </a>
            </div>
        </div>  
    </>
  );
}
