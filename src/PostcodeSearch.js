import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Tooltip from '@mui/material/Tooltip'

import { alpha } from '@mui/material/styles';

import ClearIcon from '@mui/icons-material/ClearTwoTone'
import MyLocationIcon from '@mui/icons-material/MyLocationTwoTone'
import SearchIcon from '@mui/icons-material/SearchTwoTone'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as geoHelper from './helpers/geo'
import * as urlHelper from './helpers/url'

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function PostcodeSearch(props) {
  const [{ searchType, searchPostcode, searchPosition }, dispatchSearch] =
    useSearchStateValue() //eslint-disable-line
  const [{ loadingPostcode, loadingLocation }, dispatchView] =
    useViewStateValue() //eslint-disable-line

  const [tempPostcode, setTempPostcode] = useState(searchPostcode || '')

  const prevProps = usePrevious({ searchPostcode })

  let navigate = useNavigate();

  useEffect(() => {
    if (prevProps && searchPostcode !== prevProps.searchPostcode)
      setTempPostcode(searchPostcode)
  }, [searchPostcode, prevProps])

  const getLocation = async () => {
    if (!loadingLocation) {
      dispatchView({ type: 'ToggleLoadingLocation' })
      const pos =
        searchPosition.length > 0
          ? searchPosition
          : await geoHelper.getCurrentPosition()
      dispatchSearch({ type: 'SetLocation', searchPosition: pos })
      const postcode = await getLocationPostcode(pos)
      dispatchView({ type: 'ToggleLoadingLocation' })
      if (postcode && postcode !== '') postcodeSearch(postcode)
    }
  }

  const getLocationPostcode = async location => {
    if (location.length > 0) {
      const postcode = await geoHelper.getCurrentPostcode(...location)
      setTempPostcode(postcode)
      return postcode
    }
  }

  const clearSearch = () => {
    setTempPostcode('')
    dispatchSearch({ type: 'ClearAll' })
    urlHelper.clearService(navigate)
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
      clearSearch()
      const service = await geoHelper.getPostcode(postcode.trim())
      if (service && service.location && service.location.length > 0) {
        dispatchSearch({
          type: 'SetPostcodeSearch',
          searchPostcode: postcode,
          searchPosition: service.location
        })
        dispatchView({
          type: 'SetMapPosition',
          mapPosition: service.location,
          mapZoom: 14
        })
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

  return (
    <Box sx={{
      position: 'relative',
      border: 1,
      borderColor: '#ccc',
      borderRadius: 1,
      backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.10),
      '&:hover': {
        backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.20),
      },
      marginLeft: 0,
      paddingLeft: 0,
      whitespace: 'nowrap',
      display: 'inline-flex',
    }}>
      <InputBase
        placeholder='Postcode'
        value={tempPostcode}
        onChange={e => setTempPostcode(e.target.value.toUpperCase())}
        onKeyDown={e => {
          if (e.key === 'Enter') postcodeSearch()
        }}
        inputProps={{ 'aria-label': 'search by postcode' }}
        sx={{
          padding: theme => theme.spacing(1),
          maxWidth: 110,
        }}
      />
      {searchType === 'postcode' ? (
        <Tooltip title='Clear search'>
          <IconButton
            aria-label='Clear search'
            onClick={() => clearSearch()}
            size="large">
            <ClearIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      <Tooltip title='Search by postcode'>
        {!loadingPostcode ? (
          <IconButton
            aria-label='Search'
            color='primary'
            onClick={() => postcodeSearch()}
            size="large">
            <SearchIcon />
          </IconButton>
        ) : (
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
            <CircularProgress size={22} />
          </Box>
        )}
      </Tooltip>
      <Tooltip title='Use your current location'>
        {!loadingLocation ? (
          <IconButton
            aria-label='Search by current location'
            color='primary'
            onClick={() => getLocation()}
            size="large">
            <MyLocationIcon />
          </IconButton>
        ) : (
          <Box
            position='relative'
            display='inline-flex'
          >
            <CircularProgress size={22} />
          </Box>
        )}
      </Tooltip>
    </Box>
  );
}

export default PostcodeSearch
