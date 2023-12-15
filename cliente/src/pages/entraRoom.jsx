import { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Outlet, Link } from "react-router-dom";



function PageEntrar() {
    const socketUrl = 'ws://127.0.0.1:8000';

    // const [user, setUser] = useState();

    const [userId, setUserId] = useState();
    const [roomId, setRoomId] = useState();

    const [modalVisible, setModalVisible] = useState(false);


    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl);

    if (userId == null){
        sendJsonMessage({
            type: "entra consulta",
        });
    }

    // El estado de la conexion de servidor
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Conectado',
        [ReadyState.OPEN]: 'Abierto',
        [ReadyState.CLOSING]: 'Clausura',
        [ReadyState.CLOSED]: 'Cerrado',
        [ReadyState.UNINSTANTIATED]: 'Sin instanciar',
    }[readyState];


    useEffect(() => {
        if (lastJsonMessage) {
            console.log("lastJsonMessage", lastJsonMessage);
        };
        if (lastJsonMessage && lastJsonMessage.userId && userId !== lastJsonMessage.userId) {
            setUserId(lastJsonMessage.userId);
            console.log("userid", lastJsonMessage.userId);
        };
        if (lastJsonMessage && lastJsonMessage.roomId && roomId !== lastJsonMessage.roomId) {
            setRoomId(lastJsonMessage.roomId);
            console.log("roomId", lastJsonMessage.roomId);
        };

    }, [lastJsonMessage, userId]);

    const crearPizarra = () => {
        sendJsonMessage({
            type: "crear"
        });
        setModalVisible(true);
    }

    const handleChange = (event) => {
        setRoomId(event.target.value)
    }
    const entrarPizarra = (event) => {
        sendJsonMessage({
            type: "unir",
            roomId : roomId
        });
        setModalVisible(true);
    }

    const closeModal = () => {
        console.log("modal visible", modalVisible);
        setModalVisible(false);
        console.log("modal visible", modalVisible);
    }
    

    return (
        <>
            <h1>Pizarra Privada</h1>


            <div id='joinBox'>
                <p>¿Quieres acceder a una pizarra existente?</p>
                <label htmlFor="invitacion">Código de invitación</label>
                <br />
                <input type="text" id='invitacion' placeholder='' onChange={handleChange} />
                <button onClick={entrarPizarra}>Enviar</button>
            </div>

            <div className='separada'></div>

            <div id='newBox'>
                <p>O Crear Tu PIZARRA</p>
                <button onClick={crearPizarra}>Crear</button>
            </div>

            <div id='entrar' className='modal' style={{ display: modalVisible ? 'block' : 'none' }}>
                <div className='modal-close' onClick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z" fill="black"></path>
                    </svg>
                </div>
                <div className="modal-title">
                    <h1>Código de invitación</h1>
                </div>
                <div className="modal-content">
                    <Link to={'/tupizarra/' + roomId}>{roomId}</Link>
                </div>
            </div>
        </>
    );
}

export default PageEntrar;