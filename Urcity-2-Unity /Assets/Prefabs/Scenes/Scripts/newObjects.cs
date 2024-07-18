using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class newObject : MonoBehaviour
{
   public GameObject obj;
    // Update is called once per frame
    public void click()
    {
        GameObject copy = Instantiate(obj, transform.position, transform.rotation);
        copy.tag = "Selectable";
    }
}
