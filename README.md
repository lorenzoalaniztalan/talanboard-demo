# Talan Board - Collaborative Sticky Notes App

Talan Board es una aplicación de notas adhesivas colaborativas construida con Next.js y React. Permite a los usuarios crear, editar y organizar notas adhesivas en un tablero compartido.

## Características

- Notas adhesivas personalizables (color, tamaño de fuente)
- Funcionalidad de arrastrar y soltar
- Soporte para emojis
- Diseño responsivo

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado en tu máquina local:

- Node.js (v14.0.0 o posterior)
- npm (v6.0.0 o posterior)

## Comenzando

Para poner en marcha el proyecto en tu máquina local, sigue estos pasos:

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/talan-board.git
cd talan-board
```

2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Construyendo para producción

Para construir la aplicación para producción, ejecuta:

```bash
npm run build
```

Esto creará una compilación optimizada para producción en el directorio `out`.

## Despliegue

Para desplegar la aplicación, puedes usar cualquier servicio de alojamiento de sitios estáticos. Aquí están los pasos para desplegar en Netlify:

1. Sube tu código a un repositorio de GitHub.
2. Inicia sesión en tu cuenta de Netlify y haz clic en "New site from Git".
3. Elige tu repositorio y establece el comando de construcción como `npm run build`.
4. Establece el directorio de publicación como `out`.
5. Haz clic en "Deploy site".

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.