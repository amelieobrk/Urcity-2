using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using UnityEngine.UI;
using System;
using System.Runtime.InteropServices;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

public class Screenshot2 : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void Screenshot(string screenshot);
    public GameObject CanvasObject;

    /*void Start()
    {
        StartCoroutine(TakeScreenShot());
        yield return null;
    }*/

    public void TakeScreenShot()
    {
        string ScreenshotName_png;
        string ScreenshotName_base64;
        string path;
        string path2;
        byte[] bytes;

        string timestamp = DateTime.Now.ToString("yyyy''MM''dd'T'HH''mm''ss");
        ScreenshotName_png = "Screenshots/UrCity" + timestamp + ".png";
        ScreenshotName_base64 = "Screenshots/UrCity" + timestamp + ".txt";
        path = Path.Combine(Application.dataPath, ScreenshotName_base64);
        path2 = Path.Combine(Application.dataPath, ScreenshotName_png);

        CanvasObject.SetActive(false);
        var texture = ScreenCapture.CaptureScreenshotAsTexture();
        CanvasObject.SetActive(true);
        bytes = texture.EncodeToPNG();
        string base64_converted = Convert.ToBase64String(bytes);
        UnityEngine.Object.Destroy(texture);


#if UNITY_WEBGL == true && UNITY_EDITOR == false
        Screenshot (base64_converted);
#endif

    }
}

