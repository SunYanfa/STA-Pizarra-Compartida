import React, { useState, useEffect, useRef } from "react"

function PixelCanvas(props) {
    const [isDrawing, setIsDrawing] = useState(false);

    const color = props.color;
    const background = props.background;
    const lastJsonMessage = props.lastJsonMessage;

    const canvasWidth = props.width || 1000;
    const canvasHeight = props.height || 504;

    const handleMouseDown = () => {
        setIsDrawing(true);
    };

    const handleMouseUp = () => {
        setIsDrawing(false)
    };

    const handleMouseMove = (event) => {
        const canvas = props.canvasRef.current;

        if (canvas && isDrawing) {
            const context = canvas.getContext("2d");
            const pixelSize = props.pixelSize;
            const x =
                Math.floor((event.clientX - canvas.getBoundingClientRect().left) / pixelSize) *
                pixelSize;
            const y =
                Math.floor((event.clientY - canvas.getBoundingClientRect().top) / pixelSize) *
                pixelSize;

            // Config el background
            context.fillStyle = color;
            // console.log("background", props.background);
            context.fillRect(x, y, pixelSize, pixelSize);

            // Aqui guarda los datos de canvas
            let base64Canvas = canvas.toDataURL();
            props.handleCanvasChange(base64Canvas);
        }
    };



    useEffect(() => {
        const canvas = props.canvasRef.current;
        const context = canvas.getContext("2d");

        if (props.lastJsonMessage) {
            // Crear una nuevo objecto de canva
            const image = new Image();
            image.src = props.lastJsonMessage['canvasData'];

            // Cuando la imagen esté cargada, dibújala en el lienzo.
            image.onload = () => {

                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
            };

        }

    }, [props.lastJsonMessage])

    // Parte de actualizar los fondos
    useEffect(() => {
        const canvas = props.canvasRef.current;
        const context = canvas.getContext("2d");
        if (background) {
            console.log("background", background);
            context.fillStyle = background;
            context.fillRect(0, 0, canvas.width, canvas.height);
            // Aqui guarda los datos de canvas
            let base64Canvas = canvas.toDataURL();
            props.handleCanvasChange(base64Canvas);
        }
    }, [props.background])

    return (
        <>
            <div id="canvasBox">
                <canvas
                    ref={props.canvasRef}
                    id="pixelCanvas"
                    width={canvasWidth}
                    height={canvasHeight}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                ></canvas>
                {/* <input ref={colorPickerRef} id="colorPicker" type="color" /> */}
            </div>
            <div>
                {lastJsonMessage ? (
                    <div>{lastJsonMessage.someProperty}</div>
                ) : null}

            </div>
        </>

    );

}

export default PixelCanvas;
