 "use client"

import { useEffect, useRef, useState } from 'react';
import '/public/styles/visual.scss';


interface ITitleProps {
    title : string;
}

export default function Title({title} : ITitleProps) {

  return (
    <div className='title-wrap'>
        <h2 className='kodchasan'>{ title }</h2>
    </div>
  )
}
