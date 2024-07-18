using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class openPicker : MonoBehaviour
{
    int active;
    Material material;
    public GameObject Window;
    GameObject[] selectedObjects;
    GameObject[] selectedObjectsTerrain;

        void Start()
    {
        Window.SetActive(false);
        active = 0;
        
    }

       public void opencloseWindow (){
        selectedObjects = GameObject.FindGameObjectsWithTag("Selected");
        selectedObjectsTerrain = GameObject.FindGameObjectsWithTag("TerrainSelected");

        //open colorpicker
        if(active == 0)
        {
            Window.SetActive(true);
            active = 1;
        }

        //close Colorpicker
        else
        {
            Window.SetActive(false);
            active = 0;

            //remove selectedmaterial from objects and terrain and set them back to 'selectable'
            foreach (GameObject selected in selectedObjects)
            {
                Color color = selected.GetComponent<Renderer>().material.color;
                selected.GetComponent<Renderer>().material = material;
                selected.GetComponent<Renderer>().material.color = color;
                selected.tag = "Selectable";

            }
            foreach (GameObject selectedTerrain in selectedObjectsTerrain)
            {
                Color color = selectedTerrain.GetComponent<Renderer>().material.color;
                selectedTerrain.GetComponent<Renderer>().material = material;
                selectedTerrain.GetComponent<Renderer>().material.color = color;
                selectedTerrain.tag = "TerrainSelectable";

            }

        }
    }
}


