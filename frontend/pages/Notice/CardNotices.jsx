import React, { useContext } from 'react'
import { Fade } from 'react-slideshow-image'
import ThemeContext from '../../utils/useContextTheme'
import 'react-slideshow-image/dist/styles.css'
import PropTypes from 'prop-types'

export default function CardNotices({ element, medias }) {
  const { theme } = useContext(ThemeContext)
  return (
    <div
      key={`novelties${element._id}`}
      className="slide-container position-relative rounded"
    >
      <div className="rounded">
        <Fade>
          {medias.map((eachImg) => (
            <div className="each-fade h-100 w-100" key={eachImg}>
              <img
                src={eachImg}
                className="bg-img-size-cover w-100 rounded"
                style={{ height: '200px' }}
              />
            </div>
          ))}
        </Fade>
      </div>
      <div
        className={`${theme.bg} position-absolute bottom-0 w-100 p-3`}
        style={{ zIndex: '5000', height: '50%' }}
      >
        <h4 className={`${theme.txt} my-0 py-0`}>{element.title}</h4>
        <p className={`${theme.txt} my-0 py-0 fw-bolder`}>
          {element.description}
        </p>
        <p className={`${theme.txt} my-0 py-0 fw-bolder`}>{element.date}</p>
      </div>
    </div>
  )
}

CardNotices.propTypes = {
  element: PropTypes.object.isRequired,
  medias: PropTypes.array.isRequired,
}
