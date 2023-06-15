import { getCookieParser } from "next/dist/server/api-utils";
import VisualUI from "../component/unit/visual/VisualUI";
import { cookies } from 'next/headers'

export default function Visual() {
  const cookieStore = cookies();
  const getCookie = cookieStore.get('visual') ? cookieStore.get('visual') : false;
  const visual = getCookie ? getCookie.value === 'true' ? true : false
                            : true;
  return (
    <VisualUI visual={visual}/>
  )
}
