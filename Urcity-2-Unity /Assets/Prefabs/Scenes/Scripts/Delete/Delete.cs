using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Delete : MonoBehaviour
{
    GameObject[] selectedObjects;
    private bool hasRun = false;
    // Start is called before the first frame update
    void Start()
    {
        gameObject.GetComponent<Button>().onClick.AddListener(DeleteObject);
    }

    void Update()
    {
        if (Input.GetKey(KeyCode.X) && !hasRun)
        {
            hasRun = true;
            StopAllCoroutines();
            StartCoroutine(StartTimer());
            //Debug.Log("delete");
        }
    }

    private IEnumerator StartTimer()
    {
        yield return new WaitForSeconds(0.1f);
        hasRun = false;
        DeleteObject();
    }

    private void DeleteObject()
    {
        selectedObjects = GameObject.FindGameObjectsWithTag("Selected");
        //Debug.Log(selectedObjects.Length);
        foreach (GameObject selected in selectedObjects)
        {
            Destroy(selected);
        }
    }
}
