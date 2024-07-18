using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Linq;

public class ChageMaterial2 : MonoBehaviour
{
    [SerializeField]
    private Material materials;

    GameObject[] tag_selected;
    GameObject[] tag_terrain_selected;
    GameObject[] selectedObjects;
    
    // Start is called before the first frame update
    void Start()
    {
        gameObject.GetComponent<Button>().onClick.AddListener(ChangeMaterials);
    }

    private void ChangeMaterials()
    {
        //get all selected objects and terrain
        tag_selected = GameObject.FindGameObjectsWithTag("Selected");
        tag_terrain_selected = GameObject.FindGameObjectsWithTag("TerrainSelected");
        //make one big array
        selectedObjects = tag_selected.Concat(tag_terrain_selected).ToArray();

        //change material of all selected objects
        foreach (GameObject selected in selectedObjects)
        {
            selected.GetComponent<Renderer>().material = materials;
        }
    
    }
}
