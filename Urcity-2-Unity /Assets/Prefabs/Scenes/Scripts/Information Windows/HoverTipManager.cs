//Tutorial by Comp-2 Interactive on Youtube
//https://www.youtube.com/watch?v=FVqtmTWd8Zk

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine;

public class HoverTipManager : MonoBehaviour
{
    public TextMeshProUGUI tipText;
    public RectTransform tipWindow;

    public static Action<string, Vector2> OnMouseHover;
    public static Action OnMouseLoseFocus;

    private void OnEnable()
    {
        OnMouseHover += ShowTip;
        OnMouseLoseFocus += HideTip;
    }

    private void OnDisable()
    {
        OnMouseHover -= ShowTip;
        OnMouseLoseFocus -= HideTip;
    }
    
    void Start()
    {
        HideTip();
    }

    private void ShowTip(string tip, Vector2 mousePos)
    {   
        tipText.text = tip;
        tipWindow.sizeDelta= new Vector2(150, tipText.preferredHeight + 20);

        tipWindow.gameObject.SetActive(true);
        if(mousePos.x>= 900){
            //Debug.Log("rechts");
            //Debug.Log(mousePos.x);
            tipWindow.transform.position = new Vector2(mousePos.x - tipWindow.sizeDelta.x -20, mousePos.y - tipText.preferredHeight);
        }
        if(mousePos.x< 900){
            //Debug.Log("links");
            //Debug.Log(mousePos.x);
            tipWindow.transform.position = new Vector2(mousePos.x + tipWindow.sizeDelta.x + 20, mousePos.y - tipText.preferredHeight);
        }
        
    }

    private void HideTip()
    {
        tipText.text = default;
        tipWindow.gameObject.SetActive(false);
    }
}
