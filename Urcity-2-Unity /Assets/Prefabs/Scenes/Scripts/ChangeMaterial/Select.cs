using System.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

public class Select : MonoBehaviour
{
    public Material highlightMaterial;
    public Material selectionMaterial;
    public Material BackupMaterial;

    private Material[] originalMaterialHighlight;
    private Material[] originalMaterialSelection;
    private Transform highlight;
    private Transform selection;
    private RaycastHit raycastHit;
    private Transform selectioncopy;

    List<Transform> selectedObjects = new List<Transform>();
    GameObject[] formerselectedObjects;
    GameObject[] tag_selected;
    GameObject[] tag_terrain_selected;
    List<Material[]> materials = new List<Material[]>();

    int counter2;

    void Update()
    {
        //remove 'selected'-Tags from all fromer selected objects and set them 'selectable'
        tag_selected = GameObject.FindGameObjectsWithTag("Selected");
        tag_terrain_selected = GameObject.FindGameObjectsWithTag("TerrainSelected");
        formerselectedObjects = tag_selected.Concat(tag_terrain_selected).ToArray();
        foreach (GameObject selected in formerselectedObjects)
        {
            if(selected.GetComponent<Renderer>().material.name.Contains("SelectMaterial"))
            {
                continue;
            }
            else
            {
                selection = null;
                selectedObjects = new List<Transform>();
                materials = new List<Material[]>();
                if(selected.tag=="Selected"){
                    selected.tag = "Selectable";
                }
                if(selected.tag=="TerrainSelected"){
                    selected.tag = "TerrainSelectable";
                }
                
            }
            
        }
        
        // Highlight

        //if noting is highigted empty the arrays with former materials
        if (highlight != null)
        {
            highlight.GetComponent<MeshRenderer>().materials= originalMaterialHighlight;
                
            originalMaterialHighlight = Array.Empty<Material>();
            highlight = null;
        }

        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        if (!EventSystem.current.IsPointerOverGameObject() && Physics.Raycast(ray, out raycastHit)) //Make sure you have EventSystem in the hierarchy before using EventSystem
        {
            highlight = raycastHit.transform;
            if ((highlight.CompareTag("Selectable")||highlight.CompareTag("TerrainSelectable")) && highlight != selection)
            {
                if (highlight.GetComponent<MeshRenderer>().material != highlightMaterial)
                {
                    int counter = 0;
                    //store the former material of the object, so it can be colored back later
                    originalMaterialHighlight = highlight.GetComponent<MeshRenderer>().materials;
                    Material[] HighlightArray = highlight.GetComponent<MeshRenderer>().materials;
                    //for objects with multiple materials
                    foreach(Material material in HighlightArray)
                    {
                        HighlightArray[counter] = highlightMaterial;
                        counter++;
                    }
                    highlight.GetComponent<MeshRenderer>().materials = HighlightArray;
                }
            }
            else
            {
                highlight = null;
            }
        }

        // Selection
        if (Input.GetMouseButtonDown(1) && !EventSystem.current.IsPointerOverGameObject())
        {
            if (highlight)
            {
                selection = raycastHit.transform;
                if (selection.GetComponent<MeshRenderer>().material != selectionMaterial)
                {
                    int counter = 0;
                    //store original materials so object can be colored back later
                    originalMaterialSelection = originalMaterialHighlight;
                    Material[] selectArray = selection.GetComponent<MeshRenderer>().materials;
                    foreach(Material material in selectArray)
                    {
                        selectArray[counter] = selectionMaterial;
                        counter++;
                    }
                    selection.GetComponent<MeshRenderer>().materials = selectArray;
                    
                    //change tags of objects to selected
                    if(selection.tag=="Selectable"){
                        selection.tag = "Selected";
                    }
                    if(selection.tag=="TerrainSelectable"){
                        selection.tag = "TerrainSelected";
                    }

                     //store selected objects
                    selectedObjects.Add(selection);
                    materials.Add(originalMaterialSelection);
                }
                highlight = null;
            }
            else
            {
                //disselect one object
                selection = raycastHit.transform;
                if (selection && (selection.tag == "Selected" || selection.tag == "TerrainSelected"))
                {
                    counter2 = 0;
                    //find disselected object in list
                    foreach(Transform selected in selectedObjects)
                    {
                        if(selected == selection) 
                        {
                                break;
                        }
                        else
                        {
                            counter2++;
                        }
                    }
                    
                    //color disselected object back in original material
                    selection.GetComponent<MeshRenderer>().materials = materials[counter2];
                        
                    //remove material of disselected object from list
                    materials.RemoveAt(counter2);

                    //set tag of object to 'Selectable'
                    if(selection.tag=="Selected"){
                        selection.tag = "Selectable";
                    }
                    if(selection.tag=="TerrainSelected"){
                        selection.tag = "TerrainSelectable";
                    }
                    //remove unselected object from list
                    selectedObjects.Remove(selection);
                    selection = null;
                }

                //unselect all objects
                if (selection)
                {
                    counter2 = 0;
                    foreach (Transform selected in selectedObjects)
                    {
                        if(selected!=null){
                            //color all objects back in original colors
                            selected.GetComponent<MeshRenderer>().materials = materials[counter2];

                            //give all objects tag 'Selectable'
                            if(selection.tag=="Selected"){
                                selection.tag = "Selectable";
                            }
                            if(selection.tag=="TerrainSelected"){
                                selection.tag = "TerrainSelectable";
                            }
                            counter2++;
                        }
                    }
                    //reset all lists storing objects and materials
                    selection = null;
                    selectedObjects = new List<Transform>();
                    materials = new List<Material[]>();
                }
            }
        }

    }

}
