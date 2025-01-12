import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../utils/useContextTheme'
import logos from '../../assets/img/reality/Token Reality 1.png'
import RealityModal from '../../components/RealityModal'

export default function Realities() {
  const { theme } = useContext(ThemeContext)
  const { t } = useTranslation()
  return (
    <section className={`${theme.bg} p-7-5vh text-white mb-0`} id="">
      <div
        className="d-flex w-100 px-7-5porcent justify-content-between"
        id="realities"
      >
        <div className="w-60" id="realitiContain">
          <div className="d-flex align-items-center w-100 ">
            <img src={theme.reality} alt="" className="w-50" />
            <span className={`${theme.txt} text-center text-uppercase fs-7`}>
              Token
            </span>
          </div>
          <br />
          <p className={`${theme.txt}`}>
            {t(
              "Para que las transacciones sean posibles, creamos tokens llamados 'Realities', los cuales se utilizan como moneda en nuestro metaverso. Con estos se realizan todas las transacciones financieras dentro de este multimetaverso. Podrás comprar parcelas( Realands y Patchas ), accesorios, ropa, servicios, y todo lo que se encuentre a la venta en Nuruk.",
            )}
          </p>
          <h2 className="text-primary">{t('¿Cómo funciona?')}</h2>
          <p className={`${theme.txt}`}>
            {t(
              'El reality token funciona dentro del ecosistema de Near. En este ecosistema es que se almacena el registro de transacciones en la blockchain. Tus realities se almacenan en tu Near Wallet, y se verán reflejados en tu perfil de Nuruk en la app de Reality Near. En nuestro metaverso puedes realizar infinidad de compras y ventas, adquirir tesoros o NFTs; y todo esto mediante transacciones de realities.',
            )}
          </p>
        </div>
        <div
          className="w-40 d-flex flex-column align-item-center justify-content-center"
          id="realitiContain"
        >
          <img src={logos} alt="" className="w-80 mx-5" />
          <center>
            <RealityModal />
          </center>
        </div>
      </div>
    </section>
  )
}
