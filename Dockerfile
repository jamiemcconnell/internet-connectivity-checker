FROM node:5.5.0

EXPOSE 8080

RUN mkdir -p /usr/share/icc

COPY index.js /usr/share/icc
COPY package.json /usr/share/icc

WORKDIR /usr/share/icc
RUN npm install
CMD ["node", "index.js"]