import React from 'react'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import ListSubheader from '@mui/material/ListSubheader'

import { DataGrid } from '@mui/x-data-grid'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

function Libraries () {
  const [
    { searchDistance, searchPosition, serviceFilter, displayClosedLibraries },
    dispatchSearch
  ] = useSearchStateValue() //eslint-disable-line
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  var selectLibrary = library => {
    dispatchSearch({ type: 'SetCurrentLibrary', currentLibraryId: library.id })
    dispatchView({ type: 'SetLibraryDialog', libraryDialogOpen: true })
  }

  const goToLibraryWebsite = library => window.open(library.url, '_blank')

  const viewLibraryOnMap = library => {
    dispatchView({
      type: 'SetMapPosition',
      mapPosition: [library.longitude, library.latitude],
      mapZoom: 16
    })
  }

  const toggleDisplayClosedLibraries = () => {
    dispatchSearch({
      type: 'SetDisplayClosedLibraries',
      displayClosedLibraries: !displayClosedLibraries
    })
  }

  const columns = [{ field: 'name', headerName: 'Name' }]

  const rows = [{ id: 1, name: 'Snow' }]

  return (
    <div>
      <ListSubheader disableSticky>Libraries</ListSubheader>
      <FormControlLabel
        control={
          <Checkbox
            checked={displayClosedLibraries}
            onChange={() => toggleDisplayClosedLibraries()}
            name='checkedB'
            color='primary'
          />
        }
        label='Display permanently closed libraries'
      />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  )
}

export default Libraries
