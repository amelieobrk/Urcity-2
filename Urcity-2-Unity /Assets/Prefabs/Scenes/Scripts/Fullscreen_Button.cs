using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using UnityEngine.UI;
using System;
using System.Runtime.InteropServices;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

public class Fullscreen_Button : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void Fullscreen();
    public GameObject CanvasObject;
    private bool hasRun;

    void Update()
    {
        if (Input.GetKey(KeyCode.F) && !hasRun)
        {
            hasRun = true;
            StopAllCoroutines();
            StartCoroutine(StartTimer());
        }
    }

    private IEnumerator StartTimer()
    {
        yield return new WaitForSeconds(0.2f);
        hasRun = false;
        do_fullscreen();
    }

    public void do_fullscreen()
    {
        #if UNITY_WEBGL == true && UNITY_EDITOR == false
        //Screenshot("some custom text");
        //Screenshot (base64_converted);
        Fullscreen();
        #endif
    }
}
