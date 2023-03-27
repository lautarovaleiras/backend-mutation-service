# Stack del backend

Por simplicidad a la hora del deploy, manejo de base de datos y autoScaling y hosting  se decidio desarrollar el backend con AWS Lambda en NodeJS(Typescript), la cual se invoca a travez de un  APIGateway y persiste los ADN  en DynamoDB. Tambien se utilizará  Serverless Framework para el manejo de la infraestructura la cual se implementará , valga la redundancia, en AmazonWebServices cubriendo la capa gratuita.

* El beneficio de usar serverless framework es que nos abstrae de usar CloudFormation o SAM ya que tiene una sintaxis un poco mas amigable a la hora de declarar los recursos, ademas de tener plugins que nos facilita el manejo de ambientes.

## Ejercicios Backend
1. Servicio en NodeJS que cumpla con el método pedido solicitado.
    * Para este ejercicio se desarrollo 3 funciones por separado, la cuales se encuentran en MutationController.ts
        * buildMatrix(array) => recibe un array de string y retorna una matriz.
        * getMatrixDetail(matrix) => recibe una matrix y retorna todas las columnas, filas y diagonales de la matriz
        * hasConsecutivesDuplicated(sequence)=> recibe una secuencia(texto) y mediante una regex retorna un booleano indicando si tiene o no 4 caracteres repetidos de forma consecutiva
        * hasMutation(marix)=> recibe una matriz y retorna un booleano indicando si tiene una mutacion. Esta funcion utiliza todas las anteriores para conseguir el resultado. ([Ver detalle](src/lambdas/mutationApi/lib/MutationController.ts)

2. Crear una API REST, hostear esa API en un cloud computing libre (Google App Engine, Amazon AWS, etc, en su capa gratuita), crear el servicio “/mutation/” en donde se pueda detectar si existe mutación enviando la secuencia de ADN mediante un HTTP POST con un JSON el cual tenga el siguiente formato:



    `    POST → /mutation/
        
        {
        
            dna:["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]
        
        }
        
        En caso de verificar una mutación, debería devolver un HTTP 200-OK, en caso contrario un 403-Forbidden


* Para este ejercicio  se desarrollo una API con AWS lambda (nodejs14) y AWS APIGateway con el endpoint **POST → /mutation/** el cual cumple con las especificaciones del ejercio utilando los metodos desarrollados en el ejercicio 1. Para mas detalle ver [Documentacion](#documentación-api) de la API.
  
3. Anexar una base de datos, la cual guarde los ADN’s verificados con la API. Sólo 1 registro por ADN. Exponer un servicio extra “/stats” que devuelva un JSON con las estadísticas de las verificaciones de ADN: {“count_mutations”:40, “count_no_mutation”:100: “ratio”:0.4}
        
     * Para este ejercicio se eligió la DynbamoDB que ofrece AWS y se  creó una tabla en DnaDynamoTable la cual almacena los ADN y al definir la secuencia como PK nos aseguramos que estos sean únicos, ademas almacena el atributo **mutation** el cual nos indica si la cadena de ADN posee una mutacion. Dicho atributo nos es de utlidad para luego querear y obtener los stats solicitados en el ejercicio. Para esto ultimo se creó el endpoint **GET → /stats/**  [Ver Doc](#documentación-api) el cual retorna lo solicitado.
A su vez la carga de los ADN se realiza en el endpoint **POST → /mutation/**

     
**Aclaracion** : Para "querear" se realiza un SCAN en dynamo el cual no es recomendable en grandes volumenes de datos pero por simplicidad del ejercicio se decidio continuar con este metodo.

#### Estructura del proyecto
 * src
    * lambdas
       * mutationApi = > lambda que contiene toda la logica de la api, procesos y storeo de ADNS
        * app.ts -> logica con el manejo de los endpoints
        * lib/mutationController.ts -> cotroller que contiene la logica del proceso del chequeo de ADN
    * shared
        * DBController.ts => Cotroller estilo(orm) para facilitar el manejo del schema y consultas a la Dynamo
 * serverless.yml => template de serverlesss framework para el manejo de la "infra" de AWS, aca definimos todos los resources del servicio a crear en AWS (lambdas,Dynamo,API, roles, environments).
 * package.json



### Configuraciones de DynamoDB 
La tabla DnaDynamoDB esta indexada por la secuencia de ADN ingresada por api. eg. ***dna:["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]*** => sequence: ATGCGACAGTGCTTATGTAGAAGGCCCCTATCACTG , dicho formato se asegura que las los registros por adn sean UNICOS.

 * Index:
    * PK : sequence (dna e.g => sequence: ATGCGACAGTGCTTATGTAGAAGGCCCCTATCACTG ) 
    * SK : No se definio una sortKey
 * Entity:
    * dna_stats: se definio una entity para guardar el atributo **mutation** en el cual se guarda un booleano indicando si la sequence tiene o no mutacion.

### Documentación API
La api es publica y se encuentra hosteada en AWS ApiGateway

**URL-AWS:** https://e2o1weg9ce.execute-api.us-east-1.amazonaws.com/dev

**URL-local:** http://localhost:3000/local


Para obtener el listado de estditicas  de mutaciones, se debe hacer el request vacio.
## Get stats

`GET /stats/`

    curl -i -H 'Accept: application/json' url/stats

### Response

    {
    "stats": {
        "count_mutations": 1,
        "count_no_mutations": 1,
        "ratio": 1
    }
}





## Post dna
El metodo POST user recibe un objeto con una cadena de string de secuencias de ADN y lo guarda en Dynamo


        {
        
            dna:["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]
        
        }

    Puntos a tener en cuenta:
    
        * Las secuencias de adn  solo estan compuestas por  ['A', 'T', 'C', 'G'] caso contrario retorna 400
### Request

`POST /mutation/`

    curl -i -H 'Accept: application/json' --request POST -d ' { dna:["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]}'
    
    url/mutation

### Response
si tiene mutacion


    ok: 200
    
caso contratrio

    Forbbiden:403


## Development

### Requerimientos
Se realizo el desarrollo en una pc con SO Win10
- NodeJs instalado (14.x.x)
- JRE 6 o superior o JDK (Requerido para levanar dynamodb localmente) 
- Cuenta de AWS (puede ser con free tier)
- AWS CLI
- AWS credentials y tenerlas seteadas en las variables de entorno (Win10)

#### Algunas libs utilzadas a mencionar
    * aws-sdk: utilizado para poder comunicarse con dynamodb
    * dynamodb-toolbox: lib que simplifica la config para generar el shema y querear a dynamo
    * lambda-api: permite menejar los endpoint de la lambda con una sintaxis similar a la que tiene express
    * serverless-dynamodb-local: lib para generar dynmodb en localmente




## Local Deploy
Para la prueba en local es indispensable tener seteadas las credentials de AWS y un profile "serverless" ademas de tener instalado JAVA. Todo esto levantar dynamoDB en local y emular el comportamiento que se tiene en la cloud. **SIN EMBARGO TODOS LOS RECURSOS SE LEVANTAN DE MANERA LOCAL, POR LO QUE NO SUPONDRA UN GASTO EN AWS**.

Para esto se utilzaron plugins del framework serveless que levantan la API localmente en el puerto 3000 y dynamo en el puerto 8000.

* Para el caso que se quiera levantar la api localmente pero apuntar a la db en la cloud se dejo preparado el script **api-start-dev** Sin embargo para este caso antes se debe tener deployando toda la infra previamente en AWS



### Instrucciones para prueba local
Se parte de la base de que se tiene instalado el JDK en el sistema con sus variables de entorno seteadas (JAVA_HOME)
Pararse en el directorio /backend
1. Ejecutar npm install serverless -g
2. Ejecutar npm install => para instalar todas las dependencias
3. Correr el script ubicado en backend/package.json "local-dynamo" en el caso de que arroje el error 403, sera necesario instalar el jar de dynamo manualmente => 
 * Aqui el [enlace](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html#DynamoDBLocal.DownloadingAndRunning.title) con el link de descarga. 
  * Crear una carpeta llamada .dynamodb en /backend
  * Descomprimir el contido descargado y ubicarlo dentro de la carpeta creada en el item anterior. 
4. Correr el script 'build' del package.json
5. Correr el script 'api-start-local', el levanta la API en el puerto 3000 y crea la tabla y la hostea en el puerto 8000.