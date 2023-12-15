# Pizarra Compartida

El proyecto es una pizarra compartida que permite a los usuarios compartir en tiempo real el pixel art que crean. Para dar una mejor experiencia a los usuarios, este proyecto ofrece a los clientes dos tipos de tableros de dibujo, uno es público que permite a todos los usuarios dibujar en él y el otro es privado que sólo permite entrar y dibujar a los usuarios que conocen el código de la sala.

## Funcionalidades
### Tablero
El tablero de dibujo ofrece distintos botones para proporcionar a los clientes diferentes funciones: limpiar o modificar el dibujo, aumentar o disminuir el grosor del pincel, descargar el dibujo, cambiar el color de todo el dibujo y una paleta para cambiar el color del pincel o del fondo.
Además, la parte superior del botón está a punto de indicar el grosor actual del pincel y el estado con el servidor, si el estado es "cerrado", significa que el usuario no puede compartir el dibujo con otras personas y no puede guardar el dibujo en el servidor. Si se trata de una pizarra privada, también se muestra un código de sala de 8 dígitos compuesto por números y letras minúsculas,  para que el usuario pueda compartirlo con otras personas.

### Página de entrada
Una página sencilla que permite al usuario crear una nueva pizarra privada o entrar en una pizarra privada ya existente mediante un código de sala.

## ¿Cómo empieza?
Entra la carpeta servidor y en el terminal:
```sh
npm start
```

Entra la carpeta client y en el terminal del cliente:
```sh
npm run dev
o
```
