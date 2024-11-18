'use client'
import React, { useState, useEffect, useCallback } from 'react'
import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

const Image = ({ src, ...rest }: ImageProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [isMouseDown, setIsMouseDown] = useState(false)

  const dragThreshold = 5 // Minimum distance to move before dragging starts

  const openImage = () => {
    setIsOpen(true)
    setScale(1) // Reset scale when opening the image
    setPosition({ x: 0, y: 0 }) // Reset position
  }
  const closeImage = () => setIsOpen(false)

  // Prevent body scroll and add "Escape" key event listener when modal is open
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeImage()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }

    // Cleanup on unmount or when modal is closed
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Zoom in and out using the mouse wheel
  const handleWheel = (event: React.WheelEvent) => {
    if (isOpen) {
      event.preventDefault()
      const zoomSpeed = 0.2
      if (event.deltaY < 0) {
        setScale((prev) => Math.min(prev + zoomSpeed, 5)) // Zoom in, max scale 5x
      } else {
        setScale((prev) => Math.max(prev - zoomSpeed, 0.5)) // Zoom out, min scale 0.5x
      }
    }
  }

  // Handle mouse down for dragging
  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault() // Prevent default drag behavior
    setIsMouseDown(true)
    setStartPos({ x: event.clientX, y: event.clientY })
  }

  // Handle mouse move for dragging
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isMouseDown) {
        const deltaX = event.clientX - startPos.x
        const deltaY = event.clientY - startPos.y

        // Only start dragging if the mouse has moved beyond the threshold
        if (!isDragging && (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold)) {
          setIsDragging(true)
        }

        if (isDragging) {
          const speed = 1.0 / scale
          setPosition((prev) => ({
            x: prev.x + deltaX * speed,
            y: prev.y + deltaY * speed,
          }))
          setStartPos({ x: event.clientX, y: event.clientY })
        }
      }
    },
    [isMouseDown, startPos.x, startPos.y, isDragging, scale]
  )

  // Handle mouse up to stop dragging
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      setIsMouseDown(false)
    } else {
      closeImage()
    }
  }

  // Add mousemove and mouseup event listeners
  useEffect(() => {
    if (isMouseDown) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isMouseDown, handleMouseMove, handleMouseUp])

  return (
    <>
      {/* Thumbnail */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={openImage} style={{ cursor: 'pointer' }}>
        <NextImage src={`${basePath || ''}${src}`} {...rest} />
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="modal" onWheel={handleWheel} role="dialog" aria-modal="true">
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className="modal-content"
            onMouseDown={handleMouseDown}
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
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
              overflow: hidden;
            }

            .modal-content {
              transition: transform 0.05s ease-out;
              max-width: 90%;
              max-height: 90%;
              display: flex;
              align-items: center;
              justify-content: center;
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
