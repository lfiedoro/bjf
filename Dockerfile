FROM python:3.6-slim
RUN pip3 install simple-http-server

RUN apt-get update && \
    apt-get install -y npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/site

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000
RUN npm run build

WORKDIR /usr/src/site/dist
CMD ["python3", "-m", "http.server"]
