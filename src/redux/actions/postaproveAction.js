import { GLOBALTYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'

export const POSTAPROVE_TYPES = {
    GET_POSTS_PENDIENTES: 'GET_POSTS_PENDIENTES',
    CREATE_POST_PENDIENTE: 'CREATE_POST_PENDIENTE',
    APROVE_POST_PENDIENTE: 'APROVE_POST_PENDIENTE',
    DELETE_POST_PENDIENTE: 'DELETE_POST_PENDIENTE',
    LOADING_POSTS_PENDIENTE: 'LOADING_POSTS_PENDIENTE',

}


     export const createPostpendiente = ({ postData,  wilaya, commune, specifications, images, auth, socket }) => async (dispatch) => {
        let media = []
        //Se crea un array let media = [] para almacenar las URLs de las imágenes subidas a Cloudinary.
   
        try {
            dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true} });
            if (images.length > 0) media = await imageUpload(images)//Si hay imágenes, se suben a Cloudinary usando la función imageUpload(images) y se almacenan las URLs resultantes en media

    
            const res = await postDataAPI('crearpostpendiente', { ...postData,   wilaya, commune, specifications, images: media }, auth.token)//Se envían el contenido del post y las URLs de las imágenes al servidor usando postDataAPI.

     
            dispatch({
                type: POSTAPROVE_TYPES.CREATE_POST_PENDIENTE,
                payload: { ...res.data.newPost, user: auth.user }
            })
    
            dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} })
           
            dispatch({ 
              type: GLOBALTYPES.ALERT, 
              payload: {
                  success: res.data.msg
              } 
          })
            // Notify
            const msg = {
                id: res.data.newPost._id,
                text: 'ajouter une nouvelle publication.',
                recipients: res.data.newPost.user.followers,
                url: `/post/${res.data.newPost._id}`,
                 
                image: media[0].url
            }
    
            dispatch(createNotify({ msg, auth, socket }))
    
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: err.response.data.msg }
            })
        }
    }

export const getPostsPendientesss = (token) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        const res = await getDataAPI('getpostspendientes', token);

        dispatch({
            type: POSTAPROVE_TYPES.GET_POSTS_PENDIENTES,
            payload: { ...res.data, page: 2 }
        });

        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};


export const aprovarPostPendiente = (post, estado, auth) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true} });

        const res = await patchDataAPI(`aprovarpost/${post._id}/aprovado`, { estado }, auth.token);

        dispatch({
            type: POSTAPROVE_TYPES.APROVE_POST_PENDIENTE,
            payload: res.data,
        });

        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (error) {
        const errorMsg = error.response ? error.response.data.msg : 'Unexpected error occurred';
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: errorMsg },
        });
    }
};
export const deletePostPendiente = ({ post, auth, socket }) => async (dispatch) => {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    dispatch({ type: POSTAPROVE_TYPES.DELETE_POST_PENDIENTE, payload: post })

    try {
        const res = await deleteDataAPI(`post/${post._id}`, auth.token)

        // Notify
        const msg = {
            id: post._id,
            text: 'suprimer une publication.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({ msg, auth, socket }))
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        })
    }
}