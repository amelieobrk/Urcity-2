using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;
using System.Runtime.InteropServices;
using System.IO;

public class ScreenShot_old : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void Screenshot (string screenshot);

    public void TakeScreenShot() 
    {
            string ScreenshotName;
            string ScreenshotName_svg;
            string path;
            string path2;
            string timestamp = DateTime.Now.ToString("yyyy''MM''dd'T'HH''mm''ss");
            ScreenshotName = "Screenshots/UrCity" + timestamp + ".png";
            path = Path.Combine(Application.dataPath, ScreenshotName);
            ScreenshotName_svg = "Screenshots/UrCity" + timestamp + ".txt";
            path2 = Path.Combine(Application.dataPath, ScreenshotName_svg);
            ScreenCapture.CaptureScreenshot(path);
            Debug.Log("dataPath : " + path);
            //convert to base64 - funktioniertw arum auch immer nicht, er findet den Pfad nicht
            //byte[] imageBytes = System.IO.File.ReadAllBytes(path); 
            byte[] imageBytes = System.IO.File.ReadAllBytes("Assets/Screenshots/UrCity20230115T214727.png");
            string base64String = Convert.ToBase64String(imageBytes);

            using (StreamWriter sw = File.CreateText(path2))
            {
                sw.WriteLine(base64String);
            }	

            #if UNITY_WEBGL == true && UNITY_EDITOR == false
                Screenshot (base64String);
            #endif
    }
}


