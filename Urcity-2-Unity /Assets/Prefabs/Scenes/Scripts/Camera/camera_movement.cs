using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class camera_movement : MonoBehaviour
{
    [SerializeField] private Camera cam;
    private Vector3 previousPosition;
    private Vector3 velocity;
    public int rotationSpeed;

    // Update is called once per frame
    void Update()
    {
        //moving Camera with the mouse
        if (Input.GetMouseButtonDown(2))
        {
            previousPosition = cam.ScreenToViewportPoint(Input.mousePosition);
            
        }
        if(Input.GetMouseButton(2))
        {
            Vector3 direction = previousPosition - cam.ScreenToViewportPoint(Input.mousePosition);
            cam.transform.position = cam.ScreenToWorldPoint(Input.mousePosition);
            cam.transform.Rotate(new Vector3(1, 0, 0), direction.y * 180);
            cam.transform.Rotate(new Vector3(0, 1, 0), -direction.x * 180, Space.World);
            previousPosition = cam.ScreenToViewportPoint(Input.mousePosition);

        }

        //moving caera with arrowkeys
        var h_Input = Input.GetAxis("Horizontal"); 
        var v_Input = Input.GetAxis("Vertical");
     
        Vector3 translation = v_Input * transform.up;
        translation += h_Input * transform.right;
        translation.z = 0;
     
        if (translation.magnitude > 0)
            {
                velocity = translation;
            }
        else
            {
                velocity = Vector3.zero;
            }
     
        if (velocity.magnitude > 0)
            {
                var lookRotate = Quaternion.LookRotation(velocity);
                transform.rotation = Quaternion.Slerp(transform.rotation, lookRotate, Time.deltaTime * rotationSpeed);
            }
        
    }
}
