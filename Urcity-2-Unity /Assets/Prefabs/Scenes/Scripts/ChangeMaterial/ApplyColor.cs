using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ApplyColor : MonoBehaviour
{
    public FlexibleColorPicker fcp;
    public Material material;
    GameObject[] selectedObjects;
    GameObject[] selectedObjectsTerrain;

    // Update is called once per frame
    private void Update()
    {
        //get all selected objects and terrain
        selectedObjects = GameObject.FindGameObjectsWithTag("Selected");
        selectedObjectsTerrain = GameObject.FindGameObjectsWithTag("TerrainSelected");
        
          //color objects
            foreach (GameObject selected in selectedObjects)
            {
                selected.GetComponent<Renderer>().material.color = fcp.color;
            }
            //color terrain
            foreach (GameObject selectedTerrain in selectedObjectsTerrain)
            {
                selectedTerrain.GetComponent<Renderer>().material.color = fcp.color;
            }
            
    }
        
    
}
