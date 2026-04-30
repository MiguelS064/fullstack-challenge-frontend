# Frontend - React
Aplicación desarrollada en React (Vite) que consume la API del backend para visualizar información de StackExchange y datos de vuelos.


## Requisitos previos
Docker  
Docker Compose  
Navegador web (Chrome, Edge o Firefox)  

Es necesario tener el backend en ejecución antes de iniciar el frontend.  
También es necesario haber creado previamente la red de Docker definida en el backend:

    docker network create reto-network


## Ejecución
Abrir una segunda terminal (distinta a la del backend) y ejecutar:

docker-compose up --build


## Acceso
http://localhost:3000


## Conexión con el backend
El frontend consume la API desde:
    * API: http://localhost:8000
    * Swagger: http://localhost:8000/docs


## Tecnologías
React  
Vite  
Axios  
Bootstrap  
Docker  


## Notas
El frontend se conecta al backend mediante la red de Docker compartida (reto-network)  
El backend debe estar activo antes de iniciar el frontend  
Se manejan estados de carga, error y ausencia de datos  
La información se obtiene mediante peticiones HTTP a la API