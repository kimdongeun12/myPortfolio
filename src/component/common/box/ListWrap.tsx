 "use client"

import clsx from 'clsx';
import { ReactNode, } from 'react';
import _ from '@/commons/libs/lodash-global';


interface IListWrapProps {
  children : ReactNode;
  items : {[key : string]: any}
}

export default function ListWrap({items, children} : IListWrapProps) {
  return (
    <>
      { children }
    </>
  )
}