# Creacion de una API REST de comercio electrónico escalable con Nodejs, Express y MongoDB

## Indice

- [Configuracion Inicial](#configuracion-inicial)
  - [MongoDB](#mongodb)
  - [Variables de Entorno](#variables-de-entorno)
  - [Node](#node)
- [Referencia API](#referencia-api)
  - [Mensajes de Error](#mensajes-de-error)
  - [Autenticacion de Usuarios](#autenticacion-de-usuarios)
  - [Manejo de Productos](#manejo-de-productos)
  - [Manejo de Ordenes de productos](#manejo-de-ordenes-de-productos)
- [Respaldo y Restauracion de Datos](#respaldo-y-restauracion-de-datos)
- [Tecnologias Utilizadas y Decisiones de Diseño](#tecnologias-utilizadas-y-decisiones-de-diseño)

## Configuracion Inicial

Configuración Inicial para poder utilizar este proyecto.

### MongoDB

Se asume que ya se tiene la base de datos instalada y disponible, sea de forma local, remota o dentro de un contenedor Docker y que se conoce de antemano la dirección IP y el Puerto en caso de no ser los valores por defecto `localhost` y `27017`.

1.  Se accede por terminal a `mongosh` con el usuario root, el comando completo es: `mongosh --host <db-ip> --port <db-port> -u <user>` (Nota: se puede ignorar las flags `--host` y `--port` si son los valores por defecto).
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

### Variables de Entorno

Para poder iniciar el servidor se debe crear un archivo de nombre `.env` y agregarle las siguientes variables de entorno:

```text
DB_USER=<db-user>
DB_PASSWORD=<db-password>
DB_IP=<db-ip>
DB_PORT=<db-port>
DB_NAME=<db-name>
SERVER_PORT=<server-port>
JWT_TOKEN_SECRET=<secret-here>
JWT_TOKEN_TIME=<time>
FIND_PAGE_LIMIT=<limit>
```

- `JWT_TOKEN_TIME`: El tiempo debe ser expresado como un string que denota una duración como Ej: `12h`, `1d` , `2w` donde la letra denota una unidad de tiempo como segundo `s`, minuto `m`,hora `h`, día `d`, semana `w`.
- `FIND_PAGE_LIMIT`: Cantidad de elementos que serán mostrados por pagina.

### Node

Se asume que ya se tiene instalado Node y Git para poder proceder con la instalación.

1.  Por la terminal se clona el repositorio de git con el comando: `git clone https://github.com/pcamilo89/comercio-electronico.git`
2.  Se entra al directorio creado para el proyecto y se instalan las dependencias con el comando `npm install` o las alternativas en caso de usar `pnpm` o `yarn`.
3.  Se configuran las variables de entorno especificadas en la sección [Variables de Entorno](#variables-de-entorno) en el archivo `.env` en la raíz del proyecto.
4.  Se inicial el servidor con el comando `npm start`.

#### Importante ( Node Version < v20.6 )

Se asume que se tiene instalada una versión de node igual o superior a `v20.6` para poder utilizar los flags de configuración `--watch-path=./src` y `--env-file .env` y no necesitar los paquetes `nodemon` y `dotenv`.

El comando para iniciar el servidor dentro del archivo package.json es `node --watch-path=./src --env-file=.env ./src/app.js`.

En caso de usar una versión de node menor el comando sera `nodemon ./src/app.js` y se deben agregar las librerías `nodemon` y `dotenv` con los comandos `npm install dotenv` y `npm install --save-dev nodemon` y se debe agregar el import de dotenv `require("dotenv/config");` al inicio del archivo `app.js`.

## Referencia API

### Mensajes de Error

400 (Bad Request):

```JSON
{
  "message": "Username or Email aready exists",
  "timestamp": "2024-03-28T22:40:25.130Z",
  "status": "error"
}
```

401 (Unauthorized):

```JSON
{
  "message": "Access denied, access token validation failed",
  "timestamp": "2024-03-31T23:33:53.765Z",
  "status": "error"
}
```

- `Access denied, access token not found`
- `Access denied, access token has expired`

404 (Not Found):

```JSON
{
  "message": "404 Not Found",
  "timestamp": "2024-03-31T23:06:28.090Z",
  "status": "error"
}
```

### Autenticacion de Usuarios

#### Registro de Usuario

`POST /api/auth/register`

**Body Parameters:**

- username `string` (Obligatorio): Nombre del usuario.
- email `string` (Obligatorio): Email del usuario.
- password `string` (Obligatorio): Contraseña del usuario.

Ejemplo:

```JSON
{
  "username": "lion",
  "email": "lion@animals.com",
  "password": "123456"
}
```

**Response:**

200 (OK):

```JSON
{
  "message": "User \"toad\" has been created",
  "timestamp": "2024-03-28T22:43:25.158Z",
  "status": "ok"
}
```

Error Messages:

- 400 (Bad Request): `"username" length must be at least 4 characters long`
- 400 (Bad Request): `"email" must be a valid email`
- 400 (Bad Request): `"email" is required`
- 400 (Bad Request): `Username or Email aready exists`

#### Inicio de Sesion

`POST /api/auth/login`

**Body Parameters:**

- username `string` (Obligatorio): Nombre del usuario.
- password `string` (Obligatorio): Contraseña del usuario.

Ejemplo:

```JSON
{
  "username": "lion",
  "password": "123456"
}
```

**Response:**

200 (OK):

```JSON
{
  "message": "Login was successful",
  "timestamp": "2024-03-31T23:28:04.898Z",
  "status": "ok",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI8NjAzMjU3NDAzMzZkNDUwMWExY5FmNDYiLCJ1c2VybmFtZSI6Imxpb24iLCJpYXQiOjE3MTE5Mjc2ODQsImV4cCI6MTcxMjUzMjQ4NH0.ODZtQ-mq-XPLDQTIeouG3gWlp5qpvSOBFKGgrLK4ofg"
}
```

Error Messages:

- 400 (Bad Request): `"username" length must be at least 4 characters long`
- 400 (Bad Request): `"password" is required`
- 400 (Bad Request): `Username and password don't match, please try again`

### Manejo de Productos

#### Agregar Producto

`POST /api/products`

**Body Parameters:**

- name `string` (Obligatorio): Nombre del producto.
- description `string` (Obligatorio): Descripción del producto.
- price `number` (Obligatorio): Precio del producto.
- quantity `number` (Obligatorio): Cantidad del producto.

Ejemplo:

```JSON
{
  "name": "Cable VGA",
  "description": "item para borrar",
  "price": 10.00,
  "quantity": 15
}
```

**Response:**

200 (OK):

```JSON
{
  "message": "Product \"Cable VGA\" has been created",
  "timestamp": "2024-03-31T23:45:26.170Z",
  "status": "ok"
}
```

Error Messages:

- 400 (Bad Request): `"name" is required`
- 400 (Bad Request): `"name" length must be at least 3 characters long`
- 400 (Bad Request): `"price" must be greater than or equal to 1`
- 400 (Bad Request): `"price" must be a number`
- 400 (Bad Request): `Product already exists`

#### Ver Producto

`GET /api/products/:id`

**Route Parameters:**

- id `string` (Obligatorio): Identificador del producto.

Ejemplo:

```URI
/api/products/66044e26df7e462efbb595d3
```

**Response:**

200 (OK):

```JSON
{
  "timestamp": "2024-04-01T00:23:53.206Z",
  "status": "ok",
  "product": {
    "_id": "66044e26df7e462efbb595d3",
    "name": "Audifonos Sony",
    "description": "Audifonos marca Sony con gran calidad de audio y cancelacion de sonido exterior",
    "price": 89.99,
    "quantity": 28,
    "createdAt": "2024-03-27T16:49:42.737Z",
    "__v": 0
  }
}
```

Error Messages:

- 400 (Bad Request): `Could not find a match with provided information`
- 400 (Bad Request): `Product doesn't exist`

#### Ver Lista de Productos

`GET /api/products`

**Query Parameters:**

- page `number` (Opcional): Numero de pagina.
- limit `number` (Opcional): Limite de productos por pagina.

Ejemplo:

```URI
/api/products?limit=2&page=2
```

**Response:**

200 (OK):

```JSON
{
  "timestamp": "2024-04-01T00:59:05.154Z",
  "status": "ok",
  "products": [
    {
      "_id": "6609f4df51bd5938a0774c92",
      "name": "Pendrive 4GB",
      "description": "Pendrive USB con 4GB de espacio de almacenamiento",
      "price": 11.23,
      "quantity": 17,
      "createdAt": "2024-03-31T23:42:23.514Z",
      "__v": 0
    },
    {
      "_id": "6605ab45bb11ee1cc7b20465",
      "name": "Disco duro externo Seagate 1GB",
      "description": "Disco duro externo marca Seagate con 1 Gigabite de espacio de almacenamiento",
      "price": 73.23,
      "quantity": 21,
      "createdAt": "2024-03-28T17:39:17.453Z",
      "__v": 0
    }
  ],
  "count": 6,
  "limit": 2,
  "page": 2
}
```

#### Editar Producto

`PATCH /api/products/:id`

**Route Parameters:**

- id `string` (Obligatorio): Identificador del producto.

Ejemplo:

```URI
/api/products/66044e26df7e462efbb595d3
```

**Body Parameters:**

- name `string` (Opcional): Nombre del producto.
- description `string` (Opcional): Descripción del producto.
- price `number` (Opcional): Precio del producto.
- quantity `number` (Opcional): Cantidad del producto.

Ejemplo:

```JSON
{
  "name": "Cable VGA",
  "description": "item para borrar",
  "price": 10.00,
  "quantity": 15
}
```

**Response:**

200 (OK):

```JSON
{
  "message": "The product with the provided id, was updated",
  "timestamp": "2024-04-01T01:22:47.469Z",
  "status": "ok"
}
```

Error Messages:

- 400 (Bad Request): `Could not find a match with provided information`
- 400 (Bad Request): `Product doesn't exist`
- 400 (Bad Request): `The product with the provided id, was not updated`
- 400 (Bad Request): `"name" length must be at least 3 characters long`
- 400 (Bad Request): `"price" must be greater than or equal to 1`
- 400 (Bad Request): `"price" must be a number`

#### Eliminar Producto

`DELETE /api/products/:id`

**Route Parameters:**

- id `string` (Obligatorio): Identificador del producto.

Ejemplo:

```URI
/api/products/66044e26df7e462efbb595d3
```

**Response:**

200 (OK):

```JSON
{
  "message": "The product with the provided id, was deleted",
  "timestamp": "2024-04-01T01:22:47.469Z",
  "status": "ok"
}
```

Error Messages:

- 400 (Bad Request): `Could not find a match with provided information`
- 400 (Bad Request): `Product doesn't exist`
- 400 (Bad Request): `The product with the provided id, was not deleted`

### Manejo de Ordenes de productos

#### Agregar Orden de Producto

`POST /api/product-orders`

**Headers:**

- authorization `string` (Obligatorio): Token que identifica al usuario.

Ejemplo:

```TEXT
Bearer <token>
```

**Body Parameters:**

- status `string` (Obligatorio): Estado inicial de la orden de producto puede ser "pending" o "approved".
- products `[object]` (Obligatorio): Array de productos a agregar a la orden de producto.
  - id `string` (Obligatorio): Identificador del producto.
  - quantity `number` (Obligatorio): Cantidad del producto.

Ejemplo:

```JSON
{
  "status": "pending",
  "products": [
    {
      "_id": "6614e26df7e462efbab595d3",
      "quantity": "5"
    },
    {
      "_id": "661463f75969ce6f6fbb2e9e",
      "quantity": "3"
    }
  ]
}
```

**Response:**

200 (OK):

```JSON
{
  "message": "Product order \"660a15973607fca2827a9a79\" has been created",
  "timestamp": "2024-04-01T02:01:59.191Z",
  "status": "ok"
}
```

Error Messages:

- 400 (Bad Request): `"status" with value "test" fails to match the pending|approved pattern`
- 400 (Bad Request): `"products" is required`
- 400 (Bad Request): `"products" must contain at least 1 items`
- 400 (Bad Request): `One or more product id were not found in stock`
- 400 (Bad Request): `Not Enough stock of "661463f75969ce6f6fbb2e9e" to create the order`

#### Ver Orden de Producto

`GET /api/product-orders/:id`

**Route Parameters:**

- id `string` (Obligatorio): Identificador de la orden de producto.

Ejemplo:

```URI
/api/product-orders/66065bbf3462166d48eb5fc0
```

**Response:**

200 (OK):

```JSON
{
  "timestamp": "2024-04-01T02:49:53.259Z",
  "status": "ok",
  "product": {
    "_id": "66065bbf3462166d48eb5fc0",
    "userId": "660325740336d4501a1caf46",
    "products": [
      {
        "name": "Teclado mecanico Logitech",
        "price": 78.99,
        "quantity": 5,
        "_id": "660463f75969ce6f6fbb2e9e"
      }
    ],
    "status": "pending",
    "createdAt": "2024-03-29T06:12:15.872Z",
    "__v": 3
  }
}
```

Error Messages:

- 400 (Bad Request): `Product order doesn't exist`
- 400 (Bad Request): `Could not find a match with provided information`

#### Ver Lista de Ordenes de Producto

`GET /api/product-orders`

**Query Parameters:**

- page `number` (Opcional): Numero de pagina.
- limit `number` (Opcional): Limite de productos por pagina.
- userId `string` (Opcional): Id de usuario para filtrar.

Ejemplo:

```URI
/api/product-orders?limit=2&page=2&userId=660325740336d4501a1caf46
```

**Response:**

200 (OK):

```JSON
{
  "timestamp": "2024-04-01T02:57:15.856Z",
  "status": "ok",
  "products": [
    {
      "_id": "660736c65054910d6d090566",
      "userId": "660325740336d4501a1caf46",
      "products": [
        {
          "name": "Teclado mecanico Logitech",
          "price": 78.99,
          "quantity": 3,
          "_id": "660463f75969ce6f6fbb2e9e"
        }
      ],
      "status": "pending",
      "createdAt": "2024-03-29T21:46:46.593Z",
      "__v": 0
    },
    {
      "_id": "660736b45054910d6d09055e",
      "userId": "660325740336d4501a1caf46",
      "products": [
        {
          "name": "Audifonos Sony",
          "price": 89.99,
          "quantity": 3,
          "_id": "66044e26df7e462efbb595d3"
        },
        {
          "name": "Teclado mecanico Logitech",
          "price": 78.99,
          "quantity": 7,
          "_id": "660463f75969ce6f6fbb2e9e"
        }
      ],
      "status": "pending",
      "createdAt": "2024-03-29T21:46:28.256Z",
      "__v": 0
    }
  ],
  "count": 20,
  "limit": 2,
  "page": 2
}
```

#### Editar Orden de Producto

`PATCH /api/product-orders/:id`

**Headers:**

- authorization `string` (Obligatorio): Token que identifica al usuario.

Ejemplo:

```TEXT
Bearer <token>
```

**Route Parameters:**

- id `string` (Obligatorio): Identificador del producto.

Ejemplo:

```URI
/api/product-orders/66044e26df7e462efbb595d3
```

**Body Parameters:**

- status `string` (Opcional): Estado de la orden de producto puede ser "pending" o "approved".
- action `string` (Opcional): Acción a realizar con los productos suministrados, puede ser "add", "modify" o "remove".
- products `[object]` (Opcional): Array de productos a agregar a la orden de producto.
  - id `string` (Opcional): Identificador del producto.
  - quantity `number` (Opcional): Cantidad del producto.

> Nota: el parámetro "action" y "products" deben incluirse en conjunto y la lista de productos no puede estar vacía.

Ejemplo:

```JSON
{
  "status": "pending",
  "action": "modify",
  "products": [
    {
      "quantity": 5,
      "_id": "66044e26df7e462efbb595d3"
    }
  ]
}
```

**Response:**

200 (OK):

```JSON
{
  "message": "Product order updated successfully",
  "timestamp": "2024-04-01T03:11:33.674Z",
  "status": "ok"
}
```

Error Messages:

- 400 (Bad Request): `Add action can only add new products, to modify change action`
- 400 (Bad Request): `Both action and product must be present to update the order`
- 400 (Bad Request): `Could not find a match with provided information`
- 400 (Bad Request): `No information available to update product order`
- 400 (Bad Request): `Not Enough stock of "66044e26df7e462efbb595d3" to create the order`
- 400 (Bad Request): `One or more product id were not found in stock`
- 400 (Bad Request): `One or more products not found in product order`
- 400 (Bad Request): `Product order can't be empty, it needs to have at least one product left`
- 400 (Bad Request): `Product order can't be modified if it's already approved`
- 400 (Bad Request): `Product order can't have a product with 0 quantity`
- 400 (Bad Request): `Product order doesn't exist`
- 400 (Bad Request): `You are not the owner of this product order`

#### Eliminar Orden de Producto

`PATCH /api/product-orders/:id`

**Headers:**

- authorization `string` (Obligatorio): Token que identifica al usuario.

Ejemplo:

```TEXT
Bearer <token>
```

**Route Parameters:**

- id `string` (Obligatorio): Identificador del producto.

Ejemplo:

```URI
/api/product-orders/66044e26df7e462efbb595d3
```

**Response:**

200 (OK):

```JSON
{
  "message": "Product order deleted successfully",
  "timestamp": "2024-04-01T03:36:01.474Z",
  "status": "ok"
}
```

Error Messages:

- 400 (Bad Request): `Could not find a match with provided information`
- 400 (Bad Request): `Product order doesn't exist`
- 400 (Bad Request): `Can't delete an approved product order`
- 400 (Bad Request): `You are not the owner of this product order`

## Respaldo y Restauracion de Datos

Para realizar respaldos y restauración de los datos almacenados en la base de datos, existen varias alternativas, entre las que se encuentran varias utilidades en la terminal que vienen en conjunto con `MongoDB`, a continuación explicaremos como utilizarlas.

### mongodump

Es una herramienta que crea una copia binaria del contenido de una base de datos.

Parametros:

- `--host=<url-or-ip>:<port>` La direccion del servidor y el puerto a conectarse.
- `--collection` (Opcional) La coleccion a ser respaldada, si no se coloca se respaldan todas las colecciones dentro de la base de datos.
- `--db=<db-name>` La base de datos a ser respaldada.
- `--archive=<filename>` (Opcional) Nombre del archivo donde se respaldara la data, en caso de no colocarlo se respaldara en una carpeta con varios archivos separados.
- `--authenticationDatabase admin` Base de datos donde se encuentran las credenciales del usuario indicado, por defecto es admin.
- `-u="<user>"` El usuario a autenticar para realizar el respaldo.

Comando:

```TEXT
mongodump --host=<url-or-ip>:<port> --authenticationDatabase admin -u="<user>" --db=<db-name> --archive=<filename>
```

### mongorestore

Es una herramienta que carga la data binaria generada por `mongodump` y la agrega a la base de datos.

Parametros:

- `--host=<url-or-ip>:<port>` La direccion del servidor y el puerto a conectarse.
- `--archive=<filename>` (Opcional) Nombre del archivo donde se respaldara la data, en caso de no colocarlo se respaldara en una carpeta con varios archivos separados.
- `--authenticationDatabase admin` Base de datos donde se encuentran las credenciales del usuario indicado, por defecto es admin.
- `-u="<user>"` El usuario a autenticar para realizar el respaldo.
- `--dryRun` (Opcional) Para hacer un test de la data respaldada sin hacer cambios.
- `--verbose` (Opcional) Muestra mas detalle al momento ejecutar el comando.

Comando:

```TEXT
mongorestore --host=<url-or-ip>:<port> --authenticationDatabase admin -u="<user>" --archive=<filename>
```

### mongoexport

Es una herramienta que crea una copia en formato JSON o CSV del contenido de una base de datos.

Parametros:

- `--host=<url-or-ip>:<port>` La direccion del servidor y el puerto a conectarse.
- `--collection=<name>` (Opcional) La coleccion a ser respaldada, si no se coloca se respaldan todas las colecciones dentro de la base de datos.
- `--db=<db-name>` La base de datos a ser respaldada.
- `--out=<filename>` (Opcional) Nombre del archivo donde se respaldara la data.
- `--authenticationDatabase admin` Base de datos donde se encuentran las credenciales del usuario indicado, por defecto es admin.
- `-u="<user>"` El usuario a autenticar para realizar el respaldo.

Comando:

```TEXT
mongoexport --host=<url-or-ip>:<port> --authenticationDatabase admin -u="<user>" --db=<db-name> --collection=<name> --out=out.json
```

### mongoimport

Es una herramienta que carga la data en formato JSON o CSV generada por `mongoexport` y la agrega a la base de datos.

Parametros:

- `--host=<url-or-ip>:<port>` La direccion del servidor y el puerto a conectarse.
- `--collection=<name>` (Opcional) La coleccion a ser respaldada, si no se coloca se respaldan todas las colecciones dentro de la base de datos.
- `--db=<db-name>` La base de datos a ser respaldada.
- `--file=<filename>` (Opcional) Nombre del archivo donde se extraera la data.
- `--type=<json|csv|tsv>` (Opcional) Especifica el tipo de archivo.
- `--authenticationDatabase admin` Base de datos donde se encuentran las credenciales del usuario indicado, por defecto es admin.
- `-u="<user>"` El usuario a autenticar para realizar el respaldo.

Comando:

```TEXT
mongoexport --host=<url-or-ip>:<port> --authenticationDatabase admin -u="<user>" --db=<db-name> --collection=<name> --file=<filename>
```

## Tecnologias Utilizadas y Decisiones de Diseño

### Base de datos

Se seleccionó MongoDB, ya que al utilizar JavaScript las estructuras de tipo Documento se pueden representar fácilmente como un Objeto o JSON, que aunque se maneje como colecciones de datos individuales o anidadas, simplifica su definición y manejo.

### Estructura de Archivos

Se seleccionó una estructura modular con capas, separando las diferentes etapas de procesamiento de datos, como son la definición y separación de las rutas, controladores que se encargan de transformar la data recibida, servicios que se encargan de procesar información y hacer llamadas a otros recursos como la base de datos, modelos bien definidos y sus validaciones y middlewares para el manejo centralizado de la autenticación y los errores.

### Formato de Codigo y Linter

Se utiliza ESLint, para hacer cumplir estándares de estilo de código (JavaScript Standard Style) para asegurarse que el código sea consistente y prevenir errores potenciales, en conjunto con Prettier para dar formato automático y mejorar la legibilidad y mantenimiento del código.

### Librerias y Herramientas

- `Mongoose`: Librería de Modelado de datos de Objetos (Object Data Modeling), para facilitar la interacción con la base de datos a través de una interface orientada a objetos.
- `Joi`: Para la validación de la entrada de datos del usuario y garantizar la integridad de los datos, a través de un esquema que garantiza formatos y estructuras para prevenir errores.
- `Express-async-errors`: Simplifica el manejo de errores asíncronos dentro de las rutas del API, al prevenir que errores sin manejar puedan tumbar el servidor.
- `Bcryptjs`: Librería para manejo seguro de contraseñas, que utiliza encriptación de un solo sentido.
- `jsonwebtoken`: Para el manejo autenticación segura con JWT, incluyendo la creación, lectura y verificación de tokens en una API stateless.
- `cors`: Para el manejo y limitación de acceso de los recursos compartidos entre dominios.
- `Thunder Client` Para hacer peticiones de prueba a la API ya que esta integrado en VSCode y permite exportar en formato simple una coleccion con un conjunto de rutas.

### Otras Consideraciones

- Para el caso particular de las órdenes de productos se tiene que una orden de producto contiene una lista de uno o más productos dentro, por lo que para poder editar una orden, es decir, poder agregar, modificar, o eliminar un producto, se podía resolver de dos formas. La primera, pasando la acción como parámetro en la ruta, de la forma `/api/product-orders/:id/:action`, o pasar la acción a realizar o como parte de un atributo acción en el body `{ "action": "option"}`, se optó por la segunda opción, ya que permite que la ruta quede más limpia, y como se deben enviar otros parámetros en el body se puede verificar que tanto el parámetro acción como la lista de productos vengan juntos de una manera más simple.
