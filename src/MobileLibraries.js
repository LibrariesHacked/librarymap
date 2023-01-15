import React from 'react'

import ListSubheader from '@mui/material/ListSubheader'

import { DataGrid } from '@mui/x-data-grid'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

function MobileLibraries () {
  const [{ searchDistance, searchPosition, serviceFilter }, dispatchSearch] =
    useSearchStateValue() //eslint-disable-line
  const [{}, dispatchView] = useViewStateValue() //eslint-disable-line

  var selectStop = stop => {
    dispatchSearch({ type: 'SetCurrentStop', currentStopId: stop.id })
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
  }

  const goToStopTimetableWebsite = library => window.open(library.url, '_blank')

  const viewLibraryStopOnMap = stop => {
    dispatchView({
      type: 'SetMapPosition',
      mapPosition: [stop.longitude, stop.latitude],
      mapZoom: 16
    })
  }

  const columns = [{ field: 'name', headerName: 'Name' }]

  const rows = [{ id: 1, name: 'Snow' }]

  return (
    <div>
      <ListSubheader disableSticky>Mobile library stops</ListSubheader>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  )
}

export default MobileLibraries
