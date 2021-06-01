
import { useParams } from "react-router-dom";

import ModifyPerson from './ModifyPerson';


export default function EditPerson() {
 let { id } = useParams();
  
  return (
    <div>
      
     <ModifyPerson id={id} />
      
    </div>
  );
}