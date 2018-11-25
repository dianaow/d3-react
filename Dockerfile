FROM mhart/alpine-node:6

RUN apk add --update bash && rm -rf /var/cache/apk/*

RUN mkdir -p /home/ubuntu/d3-react
WORKDIR /home/ubuntu/d3-react
ENV PATH /home/ubuntu/d3-react/node_modules/.bin:$PATH

COPY package.json /home/ubuntu/d3-react/package.json

RUN npm install --silent

COPY . /home/ubuntu/d3-react

RUN npm run build

VOLUME [".:/home/ubuntu/d3-react/", "/home/ubuntu/d3-react/node_modules"]

EXPOSE 3000

CMD ["npm", "run", "start"]
