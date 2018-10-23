FROM node:9

WORKDIR /usr/src/app

COPY package.json *.lock ./

RUN npm i cnpm -g --registry=https://registry.npm.taobao.org

RUN cnpm i

COPY . .

EXPOSE ${app_port}

CMD [ "node", "server.js", "--port=50053" ]