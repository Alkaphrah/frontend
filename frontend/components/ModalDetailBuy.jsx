import React, { useState, useEffect } from 'react'
import { Modal, Box } from '@mui/material'
import checkCircle from '../assets/img/icons/check_circle.png'
import near from '../assets/img/icons/near.svg'
import TileMap from '../utils/tilemap'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { get_required_deposit, create_token } from '../assets/js/near/utils'
import LoadingModal from '../components/LoadingModal'

export default function ModalDetailBuy({
  openNearWallet,
  setOpenNearWallet,
  img,
  posX,
  posY,
}) {
  const { t } = useTranslation()
  const [openCompleted, setOpenCompleted] = useState(false)
  const [openSpinner, setOpenSpinner] = useState(false)

  const getImg = () => {
    if (openNearWallet) {
      const canvas = document.getElementById('modal-buy-detail')
      const ctx = canvas.getContext('2d')
      const tileMap = new TileMap(15, Number(posX), Number(posY), null, img)
      tileMap.clearCanvas(canvas, ctx)
      tileMap.draw(canvas, ctx)
    }
  }
  useEffect(() => {
    getImg()
  }, [openNearWallet])

  const handleClose = () => {
    setOpenNearWallet(false)
    setOpenSpinner(false)

    setOpenCompleted(false)
  }
  const buyNuruk = async () => {
    setOpenSpinner(true)
    const currentUser = window.accountId
    const args = {
      // account_id
      owner_id: currentUser,
      metadata: {
        spec: 'nft-1.0.0',
        name: `#${posX}${posY}`,
        symbol: `#R${posX}${posY}`,
        icon: 'data:image/svg+xml,%3C…',
        reference: '',
        reference_hash: '',
      },
      x: posX,
      y: posY,
    }
    console.log('args', args)
    console.log('account_id', currentUser)
    debugger
    const gas = 300000000000000
    const amount = await get_required_deposit(args, currentUser)
    debugger
    console.log('amount', amount)
    const data = await create_token(args, gas, amount)
    console.log('data', data)
    debugger
    handleClose()
    setOpenCompleted(true)
  }
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '20px',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 4,
    px: 4,
    pb: 4,
  }

  return (
    <>
      <LoadingModal handleClose={handleClose} open={openSpinner} />

      <Modal open={openNearWallet} onClose={handleClose} keepMounted>
        <Box
          sx={{
            ...style,
            width: 500,
          }}
        >
          <div>
            <div className="h3 text-center">Resumen de la compra</div>
            <div className="my-4 row">
              <div className="col">
                <canvas
                  id="modal-buy-detail"
                  type="module"
                  className="img__modal"
                ></canvas>
              </div>
              <div className="col">
                <div className="h5">Titulo</div>
                <p>Descripción del producto que se esta presentando.</p>
                <p className="text-grey mt-4">
                  <span className="pr-2">
                    <img src={near} style={{ width: 20 }} alt="" />
                  </span>
                  1400.0000
                </p>
              </div>
            </div>
            <div className="col-12 text-center">
              <button
                onClick={buyNuruk}
                className="rounded btn-lg px-5 btn btn-primary _btn"
              >
                {t('Confirmar')}
              </button>
              <div
                onClick={function () {
                  handleClose()
                }}
                className="mt-3 text-gray"
              >
                {t('Volver')}
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal open={openCompleted} onClose={handleClose}>
        <Box
          sx={{
            ...style,
            width: 500,
          }}
        >
          <div>
            <div className="text-center">
              <img src={checkCircle} alt="" />
            </div>
            <div className="h3 text-center my-4">¡TRANSACCIÓN EXISTOSA!</div>
            <div className="col-12 text-center">
              <button
                type="button"
                onClick={handleClose}
                className="rounded btn btn-lg px-5 btn-primary _btn"
              >
                Ok
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}

ModalDetailBuy.propTypes = {
  openNearWallet: PropTypes.func.isRequired,
  setOpenNearWallet: PropTypes.func.isRequired,
  img: PropTypes.array.isRequired,
  posX: PropTypes.string.isRequired,
  posY: PropTypes.string.isRequired,
}
