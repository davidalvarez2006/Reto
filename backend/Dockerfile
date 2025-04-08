# Usa una imagen oficial de Node.js como base
FROM node:22

# Define el directorio de trabajo dentro del contenedor
WORKDIR /myapp

# Copia el archivo package.json y package-lock.json (si tienes uno) primero
# Esto permite aprovechar el cache de Docker para las dependencias
COPY package.json .
COPY package-lock.json .

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación al contenedor
COPY . .

# Expone el puerto en el que la aplicación va a correr
EXPOSE 3000

# Define el comando que se ejecutará cuando se inicie el contenedor
CMD ["npm", "start"]
