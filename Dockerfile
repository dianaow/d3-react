FROM mhart/alpine-node:6

RUN apk add --update bash && rm -rf /var/cache/apk/*

WORKDIR /home/ubuntu/d3-react
ENV PATH /home/ubuntu/d3-react/node_modules/.bin:$PATH

COPY . /home/ubuntu/d3-react

RUN npm install --silent

VOLUME [".:/home/ubuntu/d3-react/", "/home/ubuntu/d3-react/node_modules"]

EXPOSE 3000

RUN npm run build

CMD ["npm", "run", "start"]
