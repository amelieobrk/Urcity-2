using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Camera_walk : MonoBehaviour
{
    private Vector3 cameraPosition;
    [Header("Camera Settings")]
    public float cameraSpeed;
    private bool cameraViewpointUp;

    // Start is called before the first frame update
    void Start()
    {
        cameraPosition = this.transform.position;
        cameraViewpointUp = false;

    }

    // Update is called once per frame
    void Update()
    {
        //ensure that function of keys align with the direction the caera looks at
        if(cameraViewpointUp){
            if (Input.GetKey(KeyCode.W))
            {
                if(cameraPosition.z <= 60){
                    cameraPosition.z += cameraSpeed / 50;
                }
            }
            if (Input.GetKey(KeyCode.S))
            {
                if(cameraPosition.z >= 0){
                    cameraPosition.z -= cameraSpeed / 50;
                }
            }
            if (Input.GetKey(KeyCode.A))
            {
                if(cameraPosition.x >= -170){
                    cameraPosition.x -= cameraSpeed / 50;
                }
            }
            if (Input.GetKey(KeyCode.D))
            {
                if(cameraPosition.x <= -114){
                    cameraPosition.x += cameraSpeed / 50;
                }
            }
        }

        if(!cameraViewpointUp){
            if (Input.GetKey(KeyCode.W))
            {
                Vector3 dir = transform.forward;
                dir.y=0;
                cameraPosition = transform.position + dir * cameraSpeed * Time.deltaTime;
            }
            if (Input.GetKey(KeyCode.S))
            {
                Vector3 dir = transform.forward;
                dir.y=0;
                cameraPosition = transform.position - dir * cameraSpeed * Time.deltaTime;
            }
            if (Input.GetKey(KeyCode.A))
            {
                Vector3 dir = Camera.main.transform.right;
                dir.y=0;
                cameraPosition = transform.position - dir * cameraSpeed * Time.deltaTime;
            }
            if (Input.GetKey(KeyCode.D))
            {
                Vector3 dir = Camera.main.transform.right;
                dir.y=0;
                cameraPosition = transform.position + dir * cameraSpeed * Time.deltaTime;
            }
            cameraPosition.y = 7;
            //border-checks:
            if(cameraPosition.z >=60){
                cameraPosition.z = 55;
            }
            if(cameraPosition.z <=0){
                cameraPosition.z = 5;
            }
            if(cameraPosition.x <= -170){
                cameraPosition.x = -165;
            }
            if(cameraPosition.x >= -114){
                cameraPosition.x = -120;
            }
        }

        //change cameraposition to bottom-view
        if (Input.GetButtonDown("1Key"))
        {
            cameraViewpointUp = false;
            if(cameraPosition.y == 37)
            {
                this.transform.Rotate(-90, 0, 0);
                cameraPosition.y = 7;
            }
            
        }
        //change cameraposition to top view
        if (Input.GetButtonDown("2Key"))
        {
            cameraViewpointUp = true;
            if (cameraPosition.y == 7)
            {
                this.transform.Rotate(90, 0, 0);
                cameraPosition.y = 37;
            }
        
        }
        this.transform.position = cameraPosition;
    }
}
