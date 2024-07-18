using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Wiindow : MonoBehaviour
{
    public GameObject Window;

        void Start()
    {
        Window.SetActive(false);
    }

       public void openWindow (){
        Window.SetActive(true);
    }

       public void closeWindow (){
        Window.SetActive(false);
    }
}
