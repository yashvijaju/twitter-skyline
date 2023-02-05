"use client"
import * as React from 'react';
import Link from 'next/link'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import './modal.css';
// import axios from 'axios';

// export async function getSearchTweets(trend) {
//   // Fetch data from external API
//   const url = `https://api.twitter.com/1.1/search/tweets.json`;
//   const res = await axios.get(url, {
//     headers: {
//       Authorization: `Bearer ${process.env.AUTH_BEARER}`
//     },
//     params: {
//       'q': trend
//     }
//   });

//   console.log('hello', res);

//   // Pass data to the page via props
//   return {
//     props: {
//       trends: res.data[0].statuses[0].urls[0].url,
//     }}
// }

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
              <a target="_blank" href={url} rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                <Button variant="contained" sx={{height: '100%', backgroundColor: "#3fa4ff", fontSize: "15px"}}>Go to Twitter ↳</Button>
              </a>
            </div>
        </div>  
    </>
  );
}
