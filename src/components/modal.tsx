"use client"
import * as React from 'react';
import Router, { withRouter } from 'next/router'
import './modal.css';
import axios from 'axios';

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
    const {name, url, tweetUrl} = props;
  return (
    <>
        <div className='modal' />
        <div className='main'>
            <div className='content'>
                {name}
                {url}
                {tweetUrl}
            </div>
        </div>  
    </>
  );
}
