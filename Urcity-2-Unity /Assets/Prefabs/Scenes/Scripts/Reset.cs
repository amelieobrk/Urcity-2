using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Linq;

public class Reset : MonoBehaviour
{
    GameObject[] tag_selected;
    GameObject[] tag_selectable;
    GameObject[] selectedObjects;
    // Start is called before the first frame update
    void Start()
    {
        gameObject.GetComponent<Button>().onClick.AddListener(ResetScene);
    }

    private void ResetScene()
    {
        tag_selected = GameObject.FindGameObjectsWithTag("Selected");
        tag_selectable = GameObject.FindGameObjectsWithTag("Selectable");
        selectedObjects = tag_selected.Concat(tag_selectable).ToArray();

        foreach (GameObject selected in selectedObjects)
        {
            //if (selected.GetComponent<Rigidbody>()){
            // object has a rigidbody
            Destroy(selected);
            //}
        }
        selectedObjects = null;
    }
}
