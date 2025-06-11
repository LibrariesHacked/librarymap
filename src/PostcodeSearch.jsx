import React, { useState, useEffect, useRef } from 'react'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import Tooltip from '@mui/material/Tooltip'

import { alpha, lighten } from '@mui/material/styles'

import ClearIcon from '@mui/icons-material/ClearRounded'
import MyLocationIcon from '@mui/icons-material/MyLocationRounded'
import SearchIcon from '@mui/icons-material/SearchRounded'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import useLibraryQuery from './hooks/useLibraryQuery'

import * as geoHelper from './helpers/geo'

const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const SearchIconBox = ({ children }) => {
  return (
    <Box
      position='relative'
      display='inline-flex'
      sx={{
        padding: theme => theme.spacing(1.5),
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </Box>
  )
}

function PostcodeSearch () {
  const [
    { searchType, searchPostcode, searchPosition, searchDistance },
    dispatchSearch
  ] = useSearchStateValue()
  const [{ loadingPostcode, loadingLocation }, dispatchView] =
    useViewStateValue()

  const { getLibrariesFromQuery } = useLibraryQuery()

  const [tempPostcode, setTempPostcode] = useState(searchPostcode || '')

  const prevProps = usePrevious({ searchPostcode })

  useEffect(() => {
    if (prevProps && searchPostcode !== prevProps.searchPostcode) {
      setTempPostcode(searchPostcode)
    }
  }, [searchPostcode, prevProps])

  const getNearestLibraries = async (position, distance) => {
    const nearestLibraries = await getLibrariesFromQuery({
      page: 0,
      pageSize: 20,
      sortModel: [{ field: 'distance', sort: 'asc' }],
      searchPosition: position,
      searchDistance: distance,
      displayClosedLibraries: false,
      serviceFilter: []
    })

    let nearestLibraryLines = []
    if (nearestLibraries.libraries.length > 0) {
      nearestLibraryLines = nearestLibraries.libraries.map(library => {
        return geoHelper.getLineGeoJsonFromPoints(
          [position, [library.longitude, library.latitude]],
          { distance: library.distance }
        )
      })
    }
    dispatchSearch({
      type: 'SetNearestLibraries',
      nearestLibraries: nearestLibraries.libraries,
      nearestLibrariesLines: nearestLibraryLines
    })
  }

  const setPostcodeService = postcodeData => {
    dispatchSearch({
      type: 'SetPostcodeServiceCode',
      postcodeServiceCode: postcodeData.library_service
    })
  }

  const getLocation = async () => {
    if (!loadingLocation) {
      dispatchView({ type: 'ToggleLoadingLocation' })
      const pos =
        searchPosition.length > 0
          ? searchPosition
          : await geoHelper.getCurrentPosition()
      dispatchSearch({ type: 'SetLocation', searchPosition: pos })

      const postcodeData = await getLocationPostcode(pos)

      dispatchView({ type: 'SetLocationLoaded' })
      dispatchView({ type: 'ToggleLoadingLocation' })

      dispatchSearch({
        type: 'SetPostcodeSearch',
        searchPostcode: postcodeData.postcode,
        searchPosition: pos
      })
      setPostcodeService(postcodeData)
      getNearestLibraries(pos, searchDistance)
    }
  }

  const getLocationPostcode = async location => {
    if (location.length > 0) {
      const postcodeData = await geoHelper.getCurrentPostcode(location)
      setTempPostcode(postcodeData.postcode)
      return postcodeData
    }
  }

  const clearSearch = () => {
    setTempPostcode('')
    dispatchSearch({ type: 'ClearAll' })
  }

  const postcodeSearch = async (postcode = tempPostcode) => {
    if (!postcode || postcode === '') {
      dispatchView({
        type: 'ShowNotification',
        notificationMessage: 'Please enter a postcode before searching',
        notificationSeverity: 'warning'
      })
      return
    }
    dispatchView({ type: 'ToggleLoadingPostcode' })
    dispatchView({ type: 'LoadingPostcode' })
    if (geoHelper.validatePostcode(postcode)) {
      const service = await geoHelper.getPostcode(postcode.trim())
      if (service && service.location && service.location.length > 0) {
        dispatchSearch({
          type: 'SetPostcodeSearch',
          searchPostcode: postcode,
          searchPosition: service.location
        })
        setPostcodeService(service)
        getNearestLibraries(service.location, searchDistance)
      } else {
        dispatchView({
          type: 'ShowNotification',
          notificationMessage: 'We could not find that postcode',
          notificationSeverity: 'error'
        })
      }
    } else {
      dispatchView({
        type: 'ShowNotification',
        notificationMessage: 'We could not find that postcode',
        notificationSeverity: 'error'
      })
    }
    dispatchView({ type: 'ToggleLoadingPostcode' })
  }

  const changeSearchDistance = distance => {
    dispatchSearch({
      type: 'SetSearchDistance',
      searchDistance: distance
    })
    // Update nearest libraries if we already have existing search results
    if (searchPosition.length > 0) {
      getNearestLibraries(searchPosition, distance)
    }
  }

  return (
    <Box
      sx={{
        borderRadius: '6px',
        border: theme =>
          `2px solid ${lighten(theme.palette.primary.main, 0.5)}`,
        backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
        position: 'relative',
        display: 'inline-block'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          marginLeft: 0,
          paddingLeft: 0,
          whitespace: 'nowrap',
          display: 'inline-flex',
          color: theme => theme.palette.primary.main
        }}
      >
        <InputBase
          placeholder='Postcode'
          value={tempPostcode}
          onChange={e => setTempPostcode(e.target.value.toUpperCase())}
          onKeyDown={e => {
            if (e.key === 'Enter') postcodeSearch()
          }}
          inputProps={{ 'aria-label': 'search by postcode' }}
          sx={{
            paddingLeft: theme => theme.spacing(2),
            maxWidth: 110,
            color: theme => theme.palette.secondary.main,
            fontWeight: 700
          }}
        />
        {!loadingPostcode ? (
          <Tooltip title='Search by postcode'>
            <IconButton
              aria-label='Search'
              color='inherit'
              onClick={() => postcodeSearch()}
              size='large'
              disabled={loadingPostcode || loadingLocation}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <SearchIconBox>
            <CircularProgress color='secondary' size={22} />
          </SearchIconBox>
        )}
        <Tooltip title='Use your current location'>
          <>
            {!loadingLocation ? (
              <IconButton
                aria-label='Search by current location'
                color='inherit'
                onClick={() => getLocation()}
                size='large'
                disabled={loadingPostcode || loadingLocation}
              >
                <MyLocationIcon />
              </IconButton>
            ) : (
              <SearchIconBox>
                <CircularProgress color='secondary' size={22} />
              </SearchIconBox>
            )}
          </>
        </Tooltip>
        {searchType === 'postcode' ? (
          <Tooltip title='Clear search'>
            <IconButton
              color='secondary'
              aria-label='Clear search'
              onClick={() => clearSearch()}
              size='large'
              disabled={loadingPostcode || loadingLocation}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
      <br />
      <Box
        sx={{
          width: 180,
          margin: 'auto'
        }}
      >
        <Typography
          variant='subtitle1'
          sx={{
            textAlign: 'center',
            color: theme => theme.palette.primary.main,
            fontWeight: 700
          }}
        >
          Adjust search radius
        </Typography>
        <Slider
          step={1609}
          min={1609}
          max={16090}
          marks={false}
          size='small'
          valueLabelDisplay='auto'
          valueLabelFormat={value => `${Math.round(value)} mi`}
          value={searchDistance}
          scale={value => Math.round(value / 1609)}
          onChange={(e, newValue) => changeSearchDistance(newValue)}
        />
      </Box>
    </Box>
  )
}

export default PostcodeSearch
