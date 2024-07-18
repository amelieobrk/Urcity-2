using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Rotate : MonoBehaviour
{
        GameObject[] selectedObjects;
        private bool hasRun = false;
    // Start is called before the first frame update
    void Start()
    {
        gameObject.GetComponent<Button>().onClick.AddListener(Ratation);
    }

    void Update()
    {
        if (Input.GetKey(KeyCode.R) && !hasRun)
        {
            hasRun = true;
            StopAllCoroutines();
            StartCoroutine(StartTimer());
        }
    }

    private IEnumerator StartTimer()
    {
        yield return new WaitForSeconds(0.1f);
        hasRun = false;
        Ratation();
    }

    private void Ratation()
    {
        selectedObjects = GameObject.FindGameObjectsWithTag("Selected");
        foreach (GameObject selected in selectedObjects){
                // selected.transform.Rotate(new Vector3(0,1,0), Time.deltaTime * 100);
                 selected.transform.Rotate(0, 5, 0);
            
            
        }
    }

}

