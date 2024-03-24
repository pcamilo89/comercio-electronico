# Creación de una API REST de comercio electrónico escalable con Nodejs, Express y MongoDB

## Configuracion Inicial

Configuración Inicial para poder utilizar este proyecto.

### MongoDB

Se asume que ya se tiene la base de datos instalada y disponible, sea de forma local, remota o dentro de un contenedor Docker y que se conoce de antemano la dirección IP y el Puerto en caso de no ser los valores por defecto `localhost` y `27017`.

1.  Se accede por terminal a `mongosh` con el usuario root, el comando completo es: `mongosh --host <db-ip> --port <db-port> -u <user>` (Nota: se puede ignorar las flags `--host` y `--port` si son los valores por defecto).
2.  Se "crea" una nueva base de datos para usar en el proyecto con el comando use: `use <db-name>` o `db.getSiblingDB('<db-name>')`, al ver que el prompt antes del cursor cambia al nombre seleccionado, sabemos que la base de datos fue creada.
3.  Se crea un usuario que tenga acceso solamente a esa base de datos por seguridad, con privilegios de lectura y escritura con el comando:
    (Nota: todos los campos deben estar entre comillas `"`)

```
    db.createUser(
      {
        user: "<db-user>",
        pwd: "<db-password>",
        roles: [ { role: "readWrite", db: "<db-name>" } ]
      }
    )
```

5.  En caso de ser creado de forma exitosa se ve la respuesta: `{ ok: 1 }`, también se puede chequear que el usuario existe con el comando `show users` o `db.getUsers()`, (Nota: si el prompt no esta ubicado en la base de datos donde se creo el usuario local el comando puede retornar una lista vacía o no mostrar el usuario).
6.  Para finalizar se puede salir de `mongosh` con el comando `exit`.

### Node

Se asume que ya se tiene instalado Node y Git para poder proceder con la instalación.

1.  Por la terminal se clona el repositorio de git con el comando:
2.  Se entra al directorio creado para el proyecto y se instalan las dependencias con el comando `npm install` o las alternativas en caso de usar `pnpm` o `yarn`.
3.  Se configuran las variables de entorno especificadas en la sección [Variables de Entorno](#variables-de-entorno) en el archivo `.env` en la raíz del proyecto.
4.  Se inicial el servidor con el comando `npm start`.

#### Importante ( Node Version < v20.6 )

Se asume que se tiene instalada una versión de node igual o superior a `v20.6` para poder utilizar los flags de configuración `--watch-path=./src` y `--env-file .env` y no necesitar los paquetes `nodemon` y `dotenv`.

El comando para iniciar el servidor dentro del archivo package.json es `node --watch-path=./src --env-file=.env ./src/app.js`.

En caso de usar una versión de node menor el comando sera `nodemon ./src/app.js` y se deben agregar las librerías `nodemon` y `dotenv` con los comandos `npm install dotenv` y `npm install --save-dev nodemon` y se debe agregar el import de dotenv `require("dotenv/config");` al inicio del archivo `app.js`.

### Variables de Entorno

Para poder iniciar el servidor se debe crear un archivo de nombre `.env` y agregarle las siguientes variables de entorno:

```text
DB_USER=<db-user>
DB_PASSWORD=<db-password>
DB_IP=<db-ip>
DB_PORT=<db-port>
DB_NAME=<db-name>
SERVER_PORT=<server-port>
```
