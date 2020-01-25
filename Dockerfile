FROM node:lts-alpine

RUN mkdir /pa
WORKDIR /pa

ADD ./pa /pa
RUN npm install
