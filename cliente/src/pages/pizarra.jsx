import React from 'react';
import { useParams, useLoaderData } from 'react-router-dom';

import PixelCanvas from '../CanvasBox';
import { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { saveAs } from 'file-saver';

const Pizarra = ({value, link, linkText}) => {

    const socketUrl = 'ws://127.0.0.1:8000';
    const canvasRef = useRef(null); // Declare canvasRef here
    const [background, setBackground] = useState();
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl);


    const [userId, setUserId] = useState();
    const roomId = useLoaderData();
    console.log("roomId", roomId);

    if (userId == null){
        sendJsonMessage({
            type: "consultar",
            roomId: roomId
        });
    }

    // console.log("user", userId);
    // console.log("room", roomId);

    const [color, setColor] = useState("#000000");
    const [pixelSize, setPixelSize] = useState(8);



    // Escuchar la informacion de servidor
    // Configurar el userID y el roomId
    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.userId && userId != "") {
            setUserId(lastJsonMessage.userId);
            // console.log("userId", lastJsonMessage.userId);
            // console.log("roomId", lastJsonMessage.roomId);
            console.log("last Message", lastJsonMessage);

        };
    }, [lastJsonMessage, userId]);

    // Enviar los datos al servidor
    const handleCanvasChange = (base64Canvas) => {
        sendJsonMessage({
            type: "actualizar",
            roomId: roomId,
            userId: userId,
            canvasData: base64Canvas
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


    const setSizeLarger = () => {
        setPixelSize(pixelSize * 2);
    }

    const setSizeSmaller = () => {
        setPixelSize(pixelSize / 2);
    }

    const setColorWhite = () => {
        setColor("#ffffff");
    }

    const clearAll = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        handleCanvasChange(canvas.toDataURL());
    };

    const saveCanvas = () => {
        const canvas = canvasRef.current;

        canvas.toBlob(function (blob) {
            saveAs(blob, "canvas.png");
        });
    }

	const fillColor = () => {
		setBackground(color);
        handleCanvasChange(canvas.toDataURL());
	}

    return (
        <>
            <div id='mainBox'>
                <h1>Pizarra {value}</h1>
                <a href={link}>{linkText}</a>
                <p>{roomId}</p>
                <p>el WebSocket está actualmente en <span className='estado'>{connectionStatus}</span></p>
                <p>el tamaño es <span>{pixelSize}</span> pixeles</p>
            </div>
            <div id='toolBox'>
                <button onClick={clearAll}>Borrar todo</button>
                <button onClick={setColorWhite}>Borrar</button>
                <button onClick={setSizeLarger}>Grande</button>
                <button onClick={setSizeSmaller}>Pequeño</button>
                <button onClick={saveCanvas}>Descargar</button>
                <button onClick={fillColor}>Fondo</button>

                <div id='colorBox'>
                    <input type="color" id='color' value={color} onChange={e => setColor(e.target.value)} />
                    <label htmlFor="color">{color}</label>
                </div>

            </div>
            <PixelCanvas
                handleCanvasChange={handleCanvasChange}
                lastJsonMessage={lastJsonMessage}
                color={color}
                background={background}
                pixelSize={pixelSize}
                canvasRef={canvasRef}
            />

        </>
    );
};

export default Pizarra;
