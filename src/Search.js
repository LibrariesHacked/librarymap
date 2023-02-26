import React from 'react'

import PostcodeSearch from './PostcodeSearch'
import ServiceFilter from './ServiceFilter'

function Search() {
  return (
    <>
      <PostcodeSearch settings />
      <ServiceFilter />
    </>
  )
}

export default Search
