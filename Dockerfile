#FROM node:carbon
#FROM ubuntu:latest
#FROM ubuntu:14.04
FROM ubuntu:14.04
RUN  apt-get update \
  && apt-get install -y wget \
  && apt-get install -y curl \
  && rm -rf /var/lib/apt/lists/
    
# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install --yes nodejs
RUN node -v
RUN npm -v

# add all files from current directory
#ADD ./ /ace

# Create and define the working directory.
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

# Install the application's dependencies.
COPY package.json ./
COPY package-lock.json ./
  
# Install Chrome
#RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
#RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install
#RUN apt-get update
  
# execute bash commands
#RUN cd /ace && \
RUN npm init -y && \
npm install && \
npm audit fix

# Install Chromium-browser
RUN apt-get install -y chromium-browser; apt-get -fy install

# expose port 8000 by default
EXPOSE 9092

#COPY -r /usr/src/cache/node_modules/. /usr/src/app/node_modules/
# run this command on start by default
#CMD cd /ace && \
#node server.js
CMD exec npm start