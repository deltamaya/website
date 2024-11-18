'use client'
import { useState } from 'react'
import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

const Image = ({ src, ...rest }: ImageProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const openImage = () => setIsOpen(true)
  const closeImage = () => setIsOpen(false)

  return (
    <>
      {/* Thumbnail */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={openImage} style={{ cursor: 'pointer' }}>
        <NextImage src={`${basePath || ''}${src}`} {...rest} />
      </div>

      {/* Modal */}
      {isOpen && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div className="modal" onClick={closeImage}>
          <div className="modal-content">
            <NextImage src={`${basePath || ''}${src}`} {...rest} />
          </div>
          <style jsx>{`
            .modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
            }

            .modal-content {
              max-width: 90%;
              max-height: 90%;
            }

            .modal img {
              width: auto;
              height: auto;
              max-width: 100%;
              max-height: 100%;
            }
          `}</style>
        </div>
      )}
    </>
  )
}

export default Image
