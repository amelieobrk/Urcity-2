import React from "react";
import Link from "next/link";
import { Row, Col } from "react-bootstrap";


export default function About(){
  return (
     <div>
      <Row><></></Row>
      <Row>
    <div className="center"> 
    <form >
      <label htmlFor="name" className="mb-2 italic">Name</label>
      <input
        className="mb-4 border-b-2"
        id="name"
        name="name"
        type="text"
        autocomplete="name"
        required
      />
      <label htmlFor="name" className="mb-2 italic">Beschreibung</label>
      <input
        className="mb-4 border-b-2"
        id="name"
        name="name"
        type="text"
        autocomplete="name"
        required
      />
      <div className="center-button">
      <button className="form-submit-button" >
        Teilen
      </button>
      <Link href="/editor">
        <button>
          Zurück
          </button>
          </Link>
      </div>
    </form>
  </div>
  </Row>
  <Row><></></Row>
  </div>

  )
}