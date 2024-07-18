import React from "react";
import _ from 'lodash';

const Pagination = ({items, pageSize, currentPage, onPageChange}) => {

  const pageCount = items/pageSize;
  if (Math.ceil(pageCount) === 1) return null;
  const pages = _.range(1, pageCount + 1);


  return (
    <nav>
    <ul className='pagination' padding='2rem' style={{marginTop:'1rem'}}>

      {pages.map( page => 
      
      <li 
      style = {{color:'grey'}}
      key={page}  
      className= {page === currentPage? "page-item active" : "page-item"}
      >
        <a 
        style = {{cursor: "pointer", color:'grey'}}
        onClick={()=> onPageChange(page)} 
        className="page-link"
        >
          {page}</a>
      </li>)}
    
    </ul>
  </nav>
  )
}



export default Pagination;