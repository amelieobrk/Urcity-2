using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Corection : MonoBehaviour
{
   public GameObject ob;
   public bool fountain;
   public bool gem1;
   public bool gem2;
   
    void Update()
    {
        if(fountain){
            if(ob.transform.rotation.x != -90) {
                ob.transform.rotation = Quaternion.Euler(-90, ob.transform.rotation.y, 0);
             }

             if(ob.transform.rotation.z != 0){
                 ob.transform.rotation = Quaternion.Euler(-90, ob.transform.rotation.y, 0);
            }   
        }
        else{
            if(ob.transform.rotation.x != 0){
                ob.transform.rotation = Quaternion.Euler(0, ob.transform.rotation.y, 0);
            }

            if(ob.transform.rotation.z != 0){
                ob.transform.rotation = Quaternion.Euler(0, ob.transform.rotation.y, 0);
            }
        }

        if(gem1){
            if(ob.transform.position.y < (float)4.4 ){
                ob.transform.position = new Vector3(ob.transform.position.x, ob.transform.position.y + (float)(0.5 * ob.transform.localScale.y), ob.transform.position.z);
            }
        }
        if(gem2){
            if(ob.transform.position.y < (float)4.4 ){
                ob.transform.position = new Vector3(ob.transform.position.x, ob.transform.position.y + (float)(1 * ob.transform.localScale.y), ob.transform.position.z);
            }
        }
     }
}
