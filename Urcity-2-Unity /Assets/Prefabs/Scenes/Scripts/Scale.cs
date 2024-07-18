using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Scale : MonoBehaviour
{
        GameObject[] selectedObjects;
        public bool plus;
        private bool hasRun = false;
        
    // Start is called before the first frame update
    void Start()
    {
        gameObject.GetComponent<Button>().onClick.AddListener(Scaling);
    }

    void Update()
    {
        if (Input.GetKey(KeyCode.M) && !hasRun)
        {
            hasRun = true;
            plus = true;
            StopAllCoroutines();
            StartCoroutine(StartTimer());
        }
        if (Input.GetKey(KeyCode.N) && !hasRun)
        {
            hasRun = true;
            plus = false;
            StopAllCoroutines();
            StartCoroutine(StartTimer());
        }
    }

    private IEnumerator StartTimer()
    {
        yield return new WaitForSeconds(0.2f);
        hasRun = false;
        Scaling();
    }

    private void Scaling()
    {
        selectedObjects = GameObject.FindGameObjectsWithTag("Selected");
        foreach (GameObject selected in selectedObjects){
            if (plus){
              selected.transform.localScale += new Vector3(0.1f,0.1f,0.1f);
            }
            else {
                  selected.transform.localScale += new Vector3(-0.1f,-0.1f,-0.1f);
            }

               
        }
    }

}
