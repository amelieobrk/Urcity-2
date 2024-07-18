using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Movement : MonoBehaviour
{
GameObject ob;
GameObject privot;

bool iss;
float dis;
bool stilldown = false;

    // Update is called once per frame
    void Update()
    {
        RaycastHit hit;

        if(Input.GetButton("Fire1"))
        {
            if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit, Mathf.Infinity))
            {
                Collider col = hit.collider.gameObject.GetComponent<Collider>();
                if(stilldown== false){
                col.isTrigger = false;
                stilldown = true;

                }

                if(hit.collider.gameObject != null && !hit.collider.isTrigger && !hit.collider.CompareTag("Terrain") && !hit.collider.CompareTag("TerrainSelectable"))
                {
                    if(!iss)
                    {
                        iss = true;
                        ob = hit.collider.gameObject;
                        // ob.transform.rotation = Quaternion.Euler(0, 0, 0);
                        // print(ob.transform.localRotation.x);

                        ob.transform.gameObject.layer = 2;
                        privot = new GameObject("pivot");
                        Vector3 s = Vector3.Scale(ob.transform.localScale, ob.GetComponent<MeshFilter>().mesh.bounds.size);

                        dis = s.y /2;

                        if (dis == 1){
                            privot.transform.position = new Vector3(ob.transform.position.x, ob.transform.position.y-dis, ob.transform.position.z);
                        }
                        else {
                            privot.transform.position = new Vector3(ob.transform.position.x, ob.transform.position.y, ob.transform.position.z);
                        }

                        ob.transform.parent = privot.transform;
                    }

                }
            }
        }
        else 
        {
            stilldown = false;
            
            if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit, Mathf.Infinity))
            {
                if(hit.collider.gameObject != null && !hit.collider.isTrigger && !hit.collider.CompareTag("Terrain") && !hit.collider.CompareTag("TerrainSelectable"))
                {
                    if(!iss)
                    {
                        Collider col = hit.collider.gameObject.GetComponent<Collider>();
                        col.isTrigger = true;
                    }
                }
            }

            if(ob != null)
            {
                iss = false;
                ob.transform.gameObject.layer = 0;
                ob.transform.parent = null;
                Destroy(privot);
                ob = null;
                return;
            }
        }
        if(ob != null)
        {
            RaycastHit h;

            if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out h , Mathf.Infinity))
            {
                privot.transform.rotation = Quaternion.FromToRotation(Vector3.up, h.normal);
                privot.transform.position = h.point;
            }
        }
    }

}
