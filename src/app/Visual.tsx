import { cookies } from 'next/headers'

import VisualUI from "@/component/unit/visual/VisualUI";
import '/public/styles/visual.scss';

export default function Visual() {
  const cookieStore = cookies();
  const getCookie = cookieStore.get('visual') ? cookieStore.get('visual') : false;
  const visual = getCookie ? 
    (getCookie.value === 'true' ? true : false) : true;
  return (
    <VisualUI visual={visual}/>
  )
}
