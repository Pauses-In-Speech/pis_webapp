FROM node:20-alpine
# https://jsramblings.com/dockerizing-a-react-app/
ENV REACT_APP_AM_I_IN_A_DOCKER_CONTAINER=1

# Set the working directory to /app inside the container
WORKDIR /app
# Copy dependancy files
COPY package.json .
COPY package-lock.json .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Copy app files
COPY . .
# Build the app
# RUN npm run build
CMD ["npm", "start"]
# docker build ./pis_webapp -t pis_webapp
# docker run -d -it -–rm -p 3000:3000 -v ${PWD}/:/app/src -–name pis-web pis_webapp:latest /bin/sh
# docker run -d -it -–rm -p 3000:3000 -v %cd%/src:/app/src -–name pis-web pis_webapp:latest /bin/sh