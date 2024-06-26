import React from 'react'
 
import {  useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
 
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'
 
 
import { aprovarPostPendiente, deletePostPendiente } from '../../../redux/actions/postaproveAction'
  import { useTranslation } from 'react-i18next'

const CardHeaderr = ({ post  }) => {
   
    const {  languagee,auth,socket  } = useSelector(state => state)
     
       const { t } = useTranslation();
   
       
   
    
    const dispatch = useDispatch()

    const history = useHistory()
    const handleAprove = () => {
       
      
        // Mostrar la ventana de confirmación personalizada
        const confirmAction = window.confirm("¿Deseas aprobar esta agencias?")
        if (confirmAction) {
          dispatch(aprovarPostPendiente(post, 'aprovado', auth));
          return history.push("/administracion/postspendientes");
        }
      };
      
      
 
    const handleDeletePost = () => {
        if (window.confirm("Voulez-vous vraiment supprimer ce service?")) {
            dispatch(deletePostPendiente({ post, auth ,socket }))
            return history.push("/")
        }
    }

  
   

const handleEditPost = () => {
        dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } })
    }

 
   
    return (
        <div className="card_header">
       

       <div className="nav-item dropdown ml-auto">  
        <span className="material-icons" id="moreLink" data-toggle="dropdown">
            more_horiz
        </span>

        <div className="dropdown-menu">
    {auth.user && ( // Verifica si auth.user está definido
        (auth.user._id === post.user._id || auth.user.role === 'admin') && (
            <>   
                <div className="dropdown-item" onClick={handleAprove}>
                    <span className="material-icons">create</span> {t('Aprove le service', { lng: languagee.language })} 
                </div>
                <div className="dropdown-item" onClick={handleDeletePost} >
                    <span className="material-icons">delete_outline</span>{t('Suprimer le service', { lng: languagee.language })}  
                </div>
                <div className="dropdown-item" onClick={handleEditPost}>
                    <span className="material-icons">create</span>{t('Actualise le service', { lng: languagee.language })}  
                </div>   
            </>
        )
    )}
    
    
</div>




            </div>
 

        </div>
    )
}

export default CardHeaderr
