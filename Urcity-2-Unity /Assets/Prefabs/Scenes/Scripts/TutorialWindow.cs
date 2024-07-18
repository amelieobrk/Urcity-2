using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TutorialWindow : MonoBehaviour
{
      public GameObject Window;
      public bool aktiv;

        void Start()
    {
        Window.SetActive(aktiv);
    }
       public void closeWindow (){
        Window.SetActive(false);
    }

        public void openWindow (){
        Window.SetActive(true);
    }
}
