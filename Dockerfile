FROM node:5.5.0

RUN mkdir -p /usr/share/icc

COPY ./src/backend/ /usr/share/icc
COPY package.json /usr/share/icc
COPY constants.js /usr

WORKDIR /usr/share/icc
RUN npm install

EXPOSE 8090

CMD ["node", "index.js"]